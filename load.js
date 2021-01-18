const DB_VERSION = 20;
const BUILD_VERSION = "6.9.2";

// @See https://github.com/mdn/learning-area/blob/master/javascript/apis/client-side-storage/indexeddb/video-store/index.js

let db;
let reload = false;
let items;
let sets;
let ings;
let recipes;

/*
 * Load item set from local DB. Calls init() on success.
 */
async function load_local(init_func) {
    let get_tx = db.transaction(['item_db', 'set_db', 'ing_db', 'recipe_db'], 'readonly');
    let sets_store = get_tx.objectStore('set_db');
    let get_store = get_tx.objectStore('item_db');
    let ings_store = get_tx.objectStore('ing_db');
    let recipes_store = get_tx.objectStore('recipe_db');
    let request = get_store.getAll();
    request.onerror = function(event) {
        console.log("Could not read local item db...");
    }
    request.onsuccess = function(event) {
        console.log("Successfully read local item db.");
        items = request.result;
        let request2 = sets_store.openCursor();

        sets = {};
        request2.onerror = function(event) {
            console.log("Could not read local set db...");
        }

        request2.onsuccess = function(event) {
            let cursor = event.target.result;
            if (cursor) {
                sets[cursor.primaryKey] = cursor.value;
                cursor.continue();
            }
            else {
                console.log("Successfully read local set db.");
                console.log(sets);
                init_func();
            }

        }
    }
    let request3 = ings_store.getAll();
    request3.onerror = function(event) {
        console.log("Could not read local ingredient db...");
    }
    request3.onsuccess = function(event) {
        console.log("Successfully read local ingredient db.");
        ings = request3.result;
    }
    let request4 = recipes_store.getAll();
    request4.onerror = function(event) {
        console.log("Could not read local recipe db...");
    }
    request4.onsuccess = function(event) {
        console.log("Successfully read local recipe db.");
        recipes = request4.result;
    }
    await get_tx.complete;
    db.close();
}

/*
 * Clean bad item data. For now just assigns display name if it isn't already assigned.
 */
function clean_item(item) {
    if (item.displayName === undefined) {
        item.displayName = item.name;
    }
    item.skillpoints = [item.str, item.dex, item.int, item.def, item.agi];
    item.has_negstat = item.str < 0 || item.dex < 0 || item.int < 0 || item.def < 0 || item.agi < 0;
    item.reqs = [item.strReq, item.dexReq, item.intReq, item.defReq, item.agiReq];
}

/*
 * Load item set from remote DB (aka a big json file). Calls init() on success.
 */
async function load(init_func) {

    let getUrl = window.location;
    let baseUrl = getUrl.protocol + "//" + getUrl.host + "/" + getUrl.pathname.split('/')[1];
    let url = baseUrl + "/compress.json";
    url = url.replace("/crafter.html", ""); //JANK
    let result = await (await fetch(url)).json();
    items = result.items;
    sets = result.sets;
    url = url.replace("/compress.json", "/ingreds_compress.json");
    result = await (await fetch(url)).json();
    ings = result.ingredients;
    url = url.replace("/ingreds_compress.json", "/recipes_compress.json");
    result = await (await fetch(url)).json();
    recipes = result.recipes;

    // https://developer.mozilla.org/en-US/docs/Web/API/IDBObjectStore/clear
    let clear_tx = db.transaction(['item_db', 'set_db'], 'readwrite');
    let clear_items = clear_tx.objectStore('item_db');
    let clear_sets = clear_tx.objectStore('item_db');
    let clear_tx2 = db.transaction(['ing_db'], 'readwrite');
    let clear_ings = clear_tx2.objectStore('ing_db');
    let clear_tx3 = db.transaction(['recipe_db'], 'readwrite');
    let clear_recipes = clear_tx3.objectStore('recipe_db');
    await clear_items.clear();
    await clear_sets.clear();
    await clear_ings.clear();
    await clear_recipes.clear();
    await clear_tx.complete;
    await clear_tx2.complete;
    await clear_tx3.complete;

    let add_tx = db.transaction(['item_db', 'set_db'], 'readwrite');
    let items_store = add_tx.objectStore('item_db');
    let add_promises = [];
    for (const item of items) {
        clean_item(item);
        add_promises.push(items_store.add(item, item.name));
    }
    let sets_store = add_tx.objectStore('set_db');
    for (const set in sets) {
        add_promises.push(sets_store.add(sets[set], set));
    }

    let add_tx2 = db.transaction(['ing_db'], 'readwrite');
    let ings_store = add_tx2.objectStore('ing_db');
    for (const ing in ings) {
        add_promises.push(ings_store.add(ings[ing], ing));
    }
    let add_tx3 = db.transaction(['recipe_db'], 'readwrite');
    let recipes_store = add_tx3.objectStore('recipe_db');
    for (const recipe in recipes) {
        add_promises.push(recipes_store.add(recipes[recipe], recipe));
    }
    add_promises.push(add_tx.complete);
    add_promises.push(add_tx2.complete);
    add_promises.push(add_tx3.complete);
    Promise.all(add_promises).then((values) => {
        db.close();
        init_func();
    });
}

function load_init(init_func) {
    
    let request = window.indexedDB.open("ing_db", DB_VERSION)
    request.onerror = function() {
        console.log("DB failed to open...");
    }

    request.onsuccess = function() {
        db = request.result;
        if (!reload) {
            console.log("Using stored data...")
            load_local(init_func);
        }
        else {
            console.log("Using new data...")
            load(init_func);
        }
    }

    request.onupgradeneeded = function(e) {
        reload = true;

        let db = e.target.result;
        
        try {
            db.deleteObjectStore('item_db');
        }
        catch (error) {
            console.log("Could not delete item DB. This is probably fine");
        }
        try {
            db.deleteObjectStore('set_db');
        }
        catch (error) {
            console.log("Could not delete set DB. This is probably fine");
        }
        try {
            db.deleteObjectStore('ing_db');
        }
        catch (error) {
            console.log("Could not delete ingredient DB. This is probably fine");
        }
        try {
            db.deleteObjectStore('recipe_db');
        }
        catch (error) {
            console.log("Could not delete recipe DB. This is probably fine");
        }
        db.createObjectStore('item_db');
        db.createObjectStore('set_db');
        db.createObjectStore('ing_db');
        db.createObjectStore('recipe_db');

        console.log("DB setup complete...");
    }
}
