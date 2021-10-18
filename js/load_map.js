const MAP_DB_VERSION = 3;

// @See https://github.com/mdn/learning-area/blob/master/javascript/apis/client-side-storage/indexeddb/video-store/index.js

let mdb;
let mreload = false;
var terrs = new Map(); //terr name : location: rectangle def {startX, startY, endX, endY
var claims = new Map(); //terr name: guild name
var neighbors = new Map(); //terr name:  [neighbor names]
var resources = new Map(); //terr name: Map({emeralds: bool, doubleemeralds: bool, doubleresource: bool, resources: [], storage: []})
var maplocs = []; //literally the object array from maploc_compress
var terrdata;

/*
 * Load item set from local DB. Calls init() on success.
 */
async function map_load_local(init_func) {
    let get_tx = mdb.transaction(['map_db','maploc_db'], 'readonly');
    let map_store = get_tx.objectStore('map_db');
    let maploc_store = get_tx.objectStore('maploc_db');
    let request5 = map_store.getAll();

    request5.onerror = function(event) {
        console.log("Could not read local map db...");
    }

    request5.onsuccess = function(event) {
        console.log("Successfully read local map db.");
        terrdata = request5.result;
    }

    get_tx = mdb.transaction(['maploc_db'], 'readonly');
    map_store = get_tx.objectStore('maploc_db');
    let request6 = maploc_store.getAll();

    request6.onerror = function(event) {
        console.log("Could not read local map locations db...");
    }
    request6.onsuccess = function(event) {
        console.log("Successfully read local locations map db.");
        maplocs = request6.result;
        init_map_maps();
        init_func();
    }

    await get_tx.complete;
    mdb.close();
    
}


/*
 * Load item set from remote DB (aka a big json file). Calls init() on success.
 */
async function load_map(init_func) {

    let getUrl = window.location;
    let baseUrl = getUrl.protocol + "//" + getUrl.host + "/" + getUrl.pathname.split('/')[1];
    let url = baseUrl + "/terrs_compress.json";
    url = url.replace(/\w+.html/, "") ; 
    let result = await (await fetch(url)).json();
    terrdata = result;

    url = baseUrl + "/maploc_compress.json";
    url = url.replace(/\w+.html/, "");
    result = await (await fetch(url)).json();
    maplocs = result.locations;

    refreshData();
    console.log(terrdata);
    console.log(maplocs);


    // https://developer.mozilla.org/en-US/docs/Web/API/IDBObjectStore/clear
    /*let clear_tx2 = db.transaction(['ing_db'], 'readwrite');
    let clear_ings = clear_tx2.objectStore('ing_db');
    let clear_tx3 = db.transaction(['recipe_db'], 'readwrite');
    let clear_recipes = clear_tx3.objectStore('recipe_db');
    await clear_ings.clear();
    await clear_recipes.clear();
    await clear_tx2.complete;
    await clear_tx3.complete;*/
    let add_promises = [];

    let add_tx2 = mdb.transaction(['map_db'], 'readwrite');
    let map_store = add_tx2.objectStore('map_db');
    for (const terr of Object.entries(terrdata)) {
        add_promises.push(map_store.add(terr[1],terr[0])); //WHY? WHY WOULD YOU STORE AS VALUE, KEY? WHY NOT KEEP THE NORMAL KEY, VALUE CONVENTION?
    }

    let add_tx3 = mdb.transaction(['maploc_db'], 'readwrite');
    let maploc_store = add_tx3.objectStore('maploc_db');
    for (const i in maplocs) {
        add_promises.push(maploc_store.add(maplocs[i],i));
    }

    add_promises.push(add_tx2.complete);
    add_promises.push(add_tx3.complete);
    
    Promise.all(add_promises).then((values) => {
        mdb.close();
        init_map_maps();
        init_func();
    });
}

function load_map_init(init_func) {
    //uncomment below line to force reload
    
    // window.indexedDB.deleteDatabase("map_db", MAP_DB_VERSION);
    // window.indexedDB.deleteDatabase("maploc_db", MAP_DB_VERSION);
    if (mdb) {
        console.log("Map db already loaded, skipping load sequence");
        init_func();
        return;
    }

    let request = window.indexedDB.open("map_db", MAP_DB_VERSION)
    request.onerror = function() {
        console.log("DB failed to open...");
    }

    request.onsuccess = function() {
        mdb = request.result;
        if (!mreload) {
            console.log("Using stored data...")
            map_load_local(init_func);
        }
        else {
            console.log("Using new data...")
            load_map(init_func);
        }
    }

    request.onupgradeneeded = function(e) {
        mreload = true;

        let mdb = e.target.result;
        
        try {
            mdb.deleteObjectStore('map_db');
        }
        catch (error) {
            console.log("Could not delete map DB. This is probably fine");
        }
        try {
            mdb.deleteObjectStore('maploc_db');
        }
        catch (error) {
            console.log("Could not delete map location DB. This is probably fine");
        }

        mdb.createObjectStore('map_db');
        mdb.createObjectStore('maploc_db');

        console.log("DB setup complete...");
    }
}

/** Saves map data. Meant to be called after territories and guilds are refreshed.
 * 
 */
function save_map_data() {
    let add_promises = [];

    let add_tx2 = mdb.transaction(['map_db'], 'readwrite');
    let map_store = add_tx2.objectStore('map_db');
    for (const terr of Object.entries(terrdata)) {
        add_promises.push(map_store.add(terr[1],terr[0])); //WHY? WHY WOULD YOU STORE AS VALUE, KEY? WHY NOT KEEP THE NORMAL KEY, VALUE CONVENTION?
    }

    let add_tx3 = mdb.transaction(['maploc_db'], 'readwrite');
    let maploc_store = add_tx3.objectStore('maploc_db');
    for (const i in maplocs) {
        add_promises.push(maploc_store.add(maplocs[i],i));
    }

    add_promises.push(add_tx2.complete);
    add_promises.push(add_tx3.complete);
    
    Promise.all(add_promises).then((values) => {
        mdb.close();
        init_map_maps();
        init_func();
    });
}



function init_map_maps() {
    for (const [terr,data] of Object.entries(terrdata)) {
        terrs.set(data.territory,data.location);
        // claims.set(data.territory,data.guild);
        // if (!guilds.includes(data.guild)) {
        //     guilds.push(data.guild);
        // }
        neighbors.set(data.territory,data.neighbors);
        resources.set(data.territory,{"resources":data.resources,"storage":data.storage,"emeralds":data.emeralds,"doubleemeralds":data.doubleemeralds,"doubleresource":data.doubleresource});
    }

}
