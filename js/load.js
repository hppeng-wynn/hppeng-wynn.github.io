const DB_VERSION = 122;
// @See https://github.com/mdn/learning-area/blob/master/javascript/apis/client-side-storage/indexeddb/video-store/index.jsA

let db;
let reload = false;
let load_complete = false;
let load_in_progress = false;
let items;
let sets = new Map();
let itemMap;
let idMap;
let redirectMap;
let itemLists = new Map();
/*
 * Load item set from local DB. Calls init() on success.
 */
async function load_local() {
    return new Promise(function(resolve, reject) {
        let get_tx = db.transaction(['item_db', 'set_db'], 'readonly');
        let sets_store = get_tx.objectStore('set_db');
        let get_store = get_tx.objectStore('item_db');
        let request = get_store.getAll();
        request.onerror = function(event) {
            reject("Could not read local item db...");
        }
        request.onsuccess = function(event) {
            console.log("Successfully read local item db.");
        }

        // key-value iteration (hpp don't break this again)
        // https://stackoverflow.com/questions/47931595/indexeddb-getting-all-data-with-keys
        let request2 = sets_store.openCursor();
        request2.onerror = function(event) {
            reject("Could not read local set db...");
        }
        request2.onsuccess = function(event) {
            let cursor = event.target.result;
            if (cursor) {
                let key = cursor.primaryKey;
                let value = cursor.value;
                sets.set(key, value);
                cursor.continue();
            }
            else {
               // no more results
                console.log("Successfully read local set db.");
            }
        };
        get_tx.oncomplete = function(event) {
            items = request.result;
            init_maps();
            load_complete = true;
            db.close();
            resolve();
        }
    });
}

/*
 * Clean bad item data.
 * Assigns `displayName` to equal `name` if it is undefined.
 * String values default to empty string.
 * Numeric values default to 0.
 * Major ID defaults to empty list.
 */
function clean_item(item) {
    if (item.remapID === undefined) {
        if (item.displayName === undefined) {
            item.displayName = item.name;
        }
        item.skillpoints = [item.str, item.dex, item.int, item.def, item.agi];
        item.reqs = [item.strReq, item.dexReq, item.intReq, item.defReq, item.agiReq];
        item.has_negstat = false;
        for (let i = 0; i < 5; ++i) {
            if (item.reqs[i] === undefined) { item.reqs[i] = 0; }
            if (item.skillpoints[i] === undefined) { item.skillpoints[i] = 0; }
            if (item.skillpoints[i] < 0) { item.has_negstat = true; }
        }
        for (let key of item_fields) {
            if (item[key] === undefined) {
                if (key in str_item_fields) {
                    item[key] = "";
                }
                else if (key == "majorIds") {
                    item[key] = [];
                }
                else {
                    item[key] = 0;
                }
            }
        }
    }
}

async function load_old_version(version_str) {
    load_in_progress = true;
    let getUrl = window.location;
    let baseUrl = `${getUrl.protocol}//${getUrl.host}/`;
    // No random string -- we want to use caching
    let url = `${baseUrl}/data/${version_str}/items.json`;
    let result = await (await fetch(url)).json();
    items = result.items;
    for (const item of items) {
        clean_item(item);
    }
    let sets_ = result.sets;
    sets = new Map();
    for (const set in sets_) {
        sets.set(set, sets_[set]);
    }
    init_maps();
    load_complete = true;
}

/*
 * Load item set from remote DB (aka a big json file). Calls init() on success.
 */
async function load() {
    let getUrl = window.location;
    let baseUrl = `${getUrl.protocol}//${getUrl.host}/`;
    // "Random" string to prevent caching!
    let url = baseUrl + "/compress.json?"+new Date();
    let result = await (await fetch(url)).json();
    items = result.items;
    let sets_ = result.sets;
    
    let add_tx = db.transaction(['item_db', 'set_db'], 'readwrite');
    add_tx.onabort = function(e) {
        console.log(e);
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
    for (const set in sets_) {
        add_promises.push(sets_store.add(sets_[set], set));
        sets.set(set, sets_[set]);
    }
    add_promises.push(add_tx.complete);

    await Promise.all(add_promises);
    init_maps();
    load_complete = true;
    db.close();
}

async function load_init() {
    return new Promise((resolve, reject) => {
        let request = window.indexedDB.open('item_db', DB_VERSION);

        request.onerror = function() {
            reject("DB failed to open...");
        };

        request.onsuccess = async function() {
            db = request.result;
            if (load_in_progress) {
                while (!load_complete) {
                    await sleep(100);
                }
                console.log("Skipping load...")
            }
            else {
                load_in_progress = true;
                if (reload) {
                    console.log("Using new data...")
                    await load();
                }
                else {
                    console.log("Using stored data...")
                    await load_local();
                }
            }
            resolve();
        };

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
        };
    });
}

let none_items = [
    ["armor", "helmet", "No Helmet"],
    ["armor", "chestplate", "No Chestplate"],
    ["armor", "leggings", "No Leggings"],
    ["armor", "boots", "No Boots"],
    ["accessory", "ring", "No Ring 1"],
    ["accessory", "ring", "No Ring 2"],
    ["accessory", "bracelet", "No Bracelet"],
    ["accessory", "necklace", "No Necklace"],
    ["weapon", "dagger", "No Weapon"],
];
for (let i = 0; i < none_items.length; i++) {
    let item = Object();
    item.slots = 0;
    item.category = none_items[i][0];
    item.type = none_items[i][1];
    item.name = none_items[i][2];
    item.displayName = item.name;
    item.set = null;
    item.quest = null;
    item.skillpoints = [0, 0, 0, 0, 0];
    item.has_negstat = false;
    item.reqs = [0, 0, 0, 0, 0];
    item.fixID = true;
    item.tier = "Normal";
    item.id = 10000 + i;
    item.nDam = "0-0";
    item.eDam = "0-0";
    item.tDam = "0-0";
    item.wDam = "0-0";
    item.fDam = "0-0";
    item.aDam = "0-0";
    clean_item(item);

    none_items[i] = item;
}

function init_maps() {
    // List of 'raw' "none" items (No Helmet, etc), in order helmet, chestplate... ring1, ring2, brace, neck, weapon.
    for (const it of item_types) {
        itemLists.set(it, []);
    }

    itemMap = new Map();
    /* Mapping from item names to set names. */
    idMap = new Map();
    redirectMap = new Map();
    items = items.concat(none_items);
    //console.log(items);
    for (const item of items) {
        if (item.remapID === undefined) {
            itemLists.get(item.type).push(item.displayName);
            itemMap.set(item.displayName, item);
            if (none_items.includes(item)) {
                idMap.set(item.id, "");
            }
            else {
                idMap.set(item.id, item.displayName);
            }
        }
        else {
            redirectMap.set(item.id, item.remapID);
        }
    }
    for (const [set_name, set_data] of sets) {
        for (const item_name of set_data.items) {
            itemMap.get(item_name).set = set_name;
        }
    }
}
