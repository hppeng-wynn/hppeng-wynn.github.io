const ITEM_DB_VERSION = 154;

let items;
let sets = new Map();
let itemMap;
let idMap;
let redirectMap;
let itemLists = new Map();
let none_items = [];

class ItemLoader extends Loader {
    get remote_paths() {
        return 'compress';
    }

    get old_data_paths() {
        return 'items';
    }

    process_remote(data, tsx, reject) {
        items = data.items;
        let sets_ = data.sets;

        tsx.onabort = () => {
            reject("Not enough space...")
        };

        let items_store = tsx.objectStore('item_db');
        for (const item of items) {
            clean_item(item);
            let req = items_store.add(item, item.name);
            req.onerror = () => {
                reject("ADD ITEM ERROR? " + item.name);
            };
        }
        let sets_store = tsx.objectStore('set_db');
        for (const set in sets_) {
            sets_store.add(sets_[set], set);
            sets.set(set, sets_[set]);
        }
    }

    process_old_version(data) {
        items = data.items;
        for (const item of items) {
            clean_item(item);
        }
        let sets_ = data.sets;
        sets = new Map();
        for (const set in sets_) {
            sets.set(set, sets_[set]);
        }
    }

    process_local(tsx, reject) {
        let sets_store = tsx.objectStore('set_db');
        let item_store = tsx.objectStore('item_db');
        let items_request = item_store.getAll();
        items_request.onerror = () => {
            reject("Could not read local item db...");
        }
        items_request.onsuccess = (event) => {
            items = event.target.result;
            console.log("Successfully read local item db.");
        }

        // key-value iteration (hpp don't break this again)
        // https://stackoverflow.com/questions/47931595/indexeddb-getting-all-data-with-keys
        let sets_cursor_request = sets_store.openCursor();
        sets_cursor_request.onerror = () => {
            reject("Could not read local set db...");
        }
        sets_cursor_request.onsuccess = (event) => {
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
    }

    init_maps() {
        let none_items_info = [
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

        for (let i = 0; i < none_items_info.length; i++) {
            let item = Object();
            item.slots = 0;
            item.category = none_items_info[i][0];
            item.type = none_items_info[i][1];
            item.name = none_items_info[i][2];
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

            none_items.push(item);
        }

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
}

const item_loader = new ItemLoader('item_db', ['item_db', 'set_db'], ITEM_DB_VERSION);

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


// Aspects and tomes
const wynn_version_names = [
    '2.0.1.1',
    '2.0.1.2',
    '2.0.2.1',
    '2.0.2.3',
    '2.0.3.1',
    '2.0.4.1',
    '2.0.4.3',
    '2.0.4.4',
    '2.1.0.0',
    '2.1.0.1',
    '2.1.1.0',
    '2.1.1.1',
    '2.1.1.2',
    '2.1.1.3',
    '2.1.1.4',
    '2.1.1.5'
];

const WYNN_VERSION_LATEST = wynn_version_names.length - 1;
// Default to the newest version.
let wynn_version_id = WYNN_VERSION_LATEST;

/**
 * A map of all existing major ids.
 *
 * @type {Record<string, MajorId> | null}
 *
 * @typedef {Object} MajorId
 * @property {string} displayName - The name of the ID in SCREAMING_CASE
 * @property {string} description - The description of the ability.
 * @property {Array<AbilitySpec>} abilities - Affected abilities. see atree.js for spec.
*/
let MAJOR_IDS = null;

async function load_major_id_data(version_str) {
    let getUrl = window.location;
    let baseUrl = `${getUrl.protocol}//${getUrl.host}/`;
    // No random string -- we want to use caching
    let url = `${baseUrl}/data/${version_str}/majid.json`;
    MAJOR_IDS = await (await fetch(url)).json();
    console.log("Loaded major id data");
}

let ASPECTS = null;

async function load_aspect_data(version_str) {
    let getUrl = window.location;
    let baseUrl = `${getUrl.protocol}//${getUrl.host}/`;
    // No random string -- we want to use caching
    let url = `${baseUrl}/data/${version_str}/aspects.json`;
    try {
        ASPECTS = await (await fetch(url)).json();
        console.log("Loaded aspects data");
    } catch (error) {
        ASPECTS = null;
        console.log("Could not load aspect data -- maybe an older version?");
        console.log(error);
    }
}
