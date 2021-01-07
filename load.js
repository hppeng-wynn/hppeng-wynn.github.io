const DB_VERSION = 2;
// @See https://github.com/mdn/learning-area/blob/master/javascript/apis/client-side-storage/indexeddb/video-store/index.js

let db;
let reload = false;
let items;

/*
 * Load item set from local DB. Calls init() on success.
 */
async function load_local(init_func) {
    let get_tx = db.transaction('item_db', 'readonly');
    let get_store = get_tx.objectStore('item_db');
    let request = get_store.getAll();
    request.onerror = function(event) {
        console.log("Could not read local db...");
    }
    request.onsuccess = function(event) {
        console.log("Successfully read local db.");
        items = request.result;
        init_func();
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
}

/*
 * Load item set from remote DB (aka a big json file). Calls init() on success.
 */
async function load(init_func) {
    let url = "https://hppeng-wynn.github.io/compress.json";
    let result = await (await fetch(url)).json();
    items = result.items;

    // https://developer.mozilla.org/en-US/docs/Web/API/IDBObjectStore/clear
    let clear_tx = db.transaction('item_db', 'readwrite');
    let clear_store = clear_tx.objectStore('item_db');

    await clear_store.clear();
    await clear_tx.complete;

    let add_tx = db.transaction('item_db', 'readwrite');
    let add_store = add_tx.objectStore('item_db');
    let add_promises = [];
    for (const item of items) {
        clean_item(item);
        add_promises.push(add_store.add(item, item.name));
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
            console.log("Could not delete DB. This is probably fine");
        }
        let objectStore = db.createObjectStore('item_db');

        objectStore.createIndex('item', 'item', {unique: false});

        console.log("DB setup complete...");
    }
}
