const DB_VERSION = 87;
// @See https://github.com/mdn/learning-area/blob/master/javascript/apis/client-side-storage/indexeddb/video-store/index.jsA

let db;
let reload = false;
let load_complete = false;
let load_in_progress = false;
let items;
let sets;
let itemMap;
let idMap;
let redirectMap;
let itemLists = new Map();
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
        //console.log(items);
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
                //console.log(sets);
                init_maps();
                init_func();
                load_complete = true;
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
        if (item.slots === undefined) {
            item.slots = 0
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

/*
 * Load item set from remote DB (aka a big json file). Calls init() on success.
 */
async function load(init_func) {

    let getUrl = window.location;
    let baseUrl = getUrl.protocol + "//" + getUrl.host + "/";// + getUrl.pathname.split('/')[1];
    // "Random" string to prevent caching!
    let url = baseUrl + "/compress.json?"+new Date();
    let result = await (await fetch(url)).json();
    items = result.items;
    sets = result.sets;
    


//    let clear_tx = db.transaction(['item_db', 'set_db'], 'readwrite');
//    let clear_items = clear_tx.objectStore('item_db');
//    let clear_sets = clear_tx.objectStore('item_db');
//
//    await clear_items.clear();
//    await clear_sets.clear();
//    await clear_tx.complete;

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
    for (const set in sets) {
        add_promises.push(sets_store.add(sets[set], set));
    }
    add_promises.push(add_tx.complete);
    Promise.all(add_promises).then((values) => {
        init_maps();
        init_func();
        load_complete = true;
    });
    // DB not closed? idfk man
}

function load_init(init_func) {
    if (load_complete) {
        console.log("Item db already loaded, skipping load sequence");
        init_func();
        return;
    }
    let request = window.indexedDB.open('item_db', DB_VERSION);

    request.onerror = function() {
        console.log("DB failed to open...");
    };

    request.onsuccess = function() {
        (async function() {
            db = request.result;
            if (!reload) {
                console.log("Using stored data...")
                load_local(init_func);
            }
            else {
                if (load_in_progress) {
                    while (!load_complete) {
                        await sleep(100);
                    }
                    console.log("Skipping load...")
                    init_func();
                }
                else {
                    // Not 100% safe... whatever!
                    load_in_progress = true
                    console.log("Using new data...")
                    load(init_func);
                }
            }
        })()
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

function init_maps() {
    //warp
    itemMap = new Map();
    /* Mapping from item names to set names. */
    idMap = new Map();
    redirectMap = new Map();
    for (const it of itemTypes) {
        itemLists.set(it, []);
    }

    let noneItems = [
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
    for (let i = 0; i < 9; i++) {
        let item = Object();
        item.slots = 0;
        item.category = noneItems[i][0];
        item.type = noneItems[i][1];
        item.name = noneItems[i][2];
        item.displayName = item.name;
        item.set = null;
        item.quest = null;
        item.skillpoints = [0, 0, 0, 0, 0];
        item.has_negstat = false;
        item.reqs = [0, 0, 0, 0, 0];
        item.fixID = true;
        item.tier = "Normal";//do not get rid of this @hpp
        item.id = 10000 + i;
        item.nDam = "0-0";
        item.eDam = "0-0";
        item.tDam = "0-0";
        item.wDam = "0-0";
        item.fDam = "0-0";
        item.aDam = "0-0";
        clean_item(item);

        noneItems[i] = item;
    }
    items = items.concat(noneItems);
    //console.log(items);
    for (const item of items) {
        if (item.remapID === undefined) {
            itemLists.get(item.type).push(item.displayName);
            itemMap.set(item.displayName, item);
            if (noneItems.includes(item)) {
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
    console.log(itemMap);
}
