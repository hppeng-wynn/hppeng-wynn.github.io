const DB_VERSION = 24;
// @See https://github.com/mdn/learning-area/blob/master/javascript/apis/client-side-storage/indexeddb/video-store/index.js

let db;
let reload = false;
let items;
let sets;

/*
 * Load item set from local DB. Calls init() on success.
 */
async function load_local(init_func) {
    let get_tx = db.transaction(['item_db', 'set_db'], 'readonly');
    let sets_store = get_tx.objectStore('set_db');
    let get_store = get_tx.objectStore('item_db');
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
    let result = await (await fetch(url)).json();
    items = result.items;
    sets = result.sets;

    let clear_tx = db.transaction(['item_db', 'set_db'], 'readwrite');
    let clear_items = clear_tx.objectStore('item_db');
    let clear_sets = clear_tx.objectStore('item_db');

    await clear_items.clear();
    await clear_sets.clear();
    await clear_tx.complete;

    let add_tx = db.transaction(['item_db', 'set_db'], 'readwrite');
    add_tx.onabort = function() {
        console.log("Not enough space...");
    };
    let items_store = add_tx.objectStore('item_db');
    let add_promises = [];
    for (const item of items) {
        clean_item(item);
        let req = items_store.add(item, item.name);
        req.onerror = function() {
            console.log("ADD ITEM ERROR? " + item.name);
        };
        add_promises.push(req);
    }
    let sets_store = add_tx.objectStore('set_db');
    for (const set in sets) {
        add_promises.push(sets_store.add(sets[set], set));
    }
    add_promises.push(add_tx.complete);
    Promise.all(add_promises).then((values) => {
        db.close();
        init_func();
    });
}

function load_init(init_func) {
    let request = window.indexedDB.open('item_db', DB_VERSION);

    request.onerror = function() {
        console.log("DB failed to open...");
    };

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

        db.createObjectStore('item_db');
        db.createObjectStore('set_db');

        console.log("DB setup complete...");
    }
}
