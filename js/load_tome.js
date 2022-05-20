const TOME_DB_VERSION = 1;
// @See https://github.com/mdn/learning-area/blob/master/javascript/apis/client-side-storage/indexeddb/video-store/index.jsA

let tdb;
let treload = false;
let tload_complete = false;
let tload_in_progress = false;
let tomes;
let tomeMap;
let tomeIDMap;
let tomeLists = new Map();
/*
 * Load tome set from local DB. Calls init() on success.
 */
async function load_tome_local(init_func) {
    let get_tx = tdb.transaction(['tome_db'], 'readonly');
    let get_store = get_tx.objectStore('tome_db');
    let request = get_store.getAll();
    request.onerror = function(event) {
        console.log("Could not read local tome db...");
    }
    request.onsuccess = function(event) {
        console.log("Successfully read local tome db.");
        tomes = request.result;
        
        init_tome_maps();
        init_func();
        tload_complete = true;
    }
    await get_tx.complete;
    tdb.close();
}

/*
 * Load tome set from remote DB (json). Calls init() on success.
 */
async function load_tome(init_func) {

    let getUrl = window.location;
    let baseUrl = getUrl.protocol + "//" + getUrl.host + "/";// + getUrl.pathname.split('/')[1];
    // "Random" string to prevent caching!
    let url = baseUrl + "/tomes.json?"+new Date();
    let result = await (await fetch(url)).json();
    tomes = result.tomes

    let add_tx = tdb.transaction(['tome_db'], 'readwrite');
    add_tx.onabort = function(e) {
        console.log(e);
        console.log("Not enough space...");
    };
    let tomes_store = add_tx.objectStore('tome_db');
    let add_promises = [];
    for (const tome of tomes) {
        //dependency on clean_item in load.js
        clean_item(tome);
        let req = tomes_store.add(tome, tome.name);
        req.onerror = function() {
            console.log("ADD TOME ERROR? " + tome.name);
        };
        add_promises.push(req);
    }
    Promise.all(add_promises).then((values) => {
        init_tome_maps();
        init_func();
        tload_complete = true;
    });
    // DB not closed? idfk man
}

function load_tome_init(init_func) {
    if (tload_complete) {
        console.log("Tome db already loaded, skipping load sequence");
        init_func();
        return;
    }
    let request = window.indexedDB.open('tome_db', TOME_DB_VERSION);

    request.onerror = function() {
        console.log("DB failed to open...");
    };

    request.onsuccess = function() {
        (async function() {
            tdb = request.result;
            if (!treload) {
                console.log("Using stored data...")
                load_tome_local(init_func);
            }
            else {
                if (tload_in_progress) {
                    while (!tload_complete) {
                        await sleep(100);
                    }
                    console.log("Skipping load...")
                    init_func();
                }
                else {
                    // Not 100% safe... whatever!
                    tload_in_progress = true
                    console.log("Using new data...")
                    load_tome(init_func);
                }
            }
        })()
    }

    request.onupgradeneeded = function(e) {
        treload = true;

        let tdb = e.target.result;
        
        try {
            tdb.deleteObjectStore('tome_db');
        }
        catch (error) {
            console.log("Could not delete tome DB. This is probably fine");
        }

        tdb.createObjectStore('tome_db');

        console.log("DB setup complete...");
    }
}

function init_tome_maps() {
    //warp
    tomeMap = new Map();
    /* Mapping from item names to set names. */
    tomeIDMap = new Map();
    for (const it of tomeTypes) {
        tomeLists.set(it, []);
    }

    let noneTomes = [
        ["tome", "weaponTome", "No Weapon Tome"],
        ["tome", "armorTome", "No Armor Tome"],
        ["tome", "guildTome", "No Guild Tome"]
    ];
    for (let i = 0; i < 3; i++) {
        let tome = Object();
        tome.slots = 0;
        tome.category = noneTomes[i][0];
        tome.type = noneTomes[i][1];
        tome.name = noneTomes[i][2];
        tome.displayName = tome.name;
        tome.set = null;
        tome.quest = null;
        tome.skillpoints = [0, 0, 0, 0, 0];
        tome.has_negstat = false;
        tome.reqs = [0, 0, 0, 0, 0];
        tome.fixID = true;
        tome.tier = "Normal";
        tome.id = 10000 + i;
        tome.nDam = "0-0";
        tome.eDam = "0-0";
        tome.tDam = "0-0";
        tome.wDam = "0-0";
        tome.fDam = "0-0";
        tome.aDam = "0-0";
        //dependency - load.js
        clean_item(tome);

        noneTomes[i] = tome;
    }
    tomes = tomes.concat(noneTomes);
    //console.log(tomes);
    for (const tome of tomes) {
        if (tome.remapID === undefined) {
            tomeLists.get(tome.type).push(tome.displayName);
            tomeMap.set(tome.displayName, tome);
            if (noneTomes.includes(tome)) {
                idMap.set(tome.id, "");
            }
            else {
                idMap.set(tome.id, tome.displayName);
            }
        }
        else {
            redirectMap.set(tome.id, tome.remapID);
        }
    }
    console.log(tomeLists);
    console.log(tomeMap);
}
