const TOME_DB_VERSION = 9;
// @See https://github.com/mdn/learning-area/blob/master/javascript/apis/client-side-storage/indexeddb/video-store/index.jsA

let tdb;
let treload = false;
let tload_complete = false;
let tload_in_progress = false;
let tomes;
let tomeMap;
let tometomeIDMap;
let tomeRedirectMap;
let tomeLists = new Map();
/*
 * Load tome set from local DB. Calls init() on success.
 */
async function load_tome_local() {
    return new Promise(function(resolve, reject) {
        let get_tx = tdb.transaction(['tome_db'], 'readonly');
        let get_store = get_tx.objectStore('tome_db');
        let request = get_store.getAll();
        request.onerror = function(event) {
            reject("Could not read local tome db...");
        }
        request.onsuccess = function(event) {
            console.log("Successfully read local tome db.");
        }
        get_tx.oncomplete = function(event) {
            tomes = request.result;
            init_tome_maps();
            tload_complete = true;
            tdb.close();
            resolve();
        }
    });
}

async function load_tome_old_version(version_str) {
    tload_in_progress = true;
    let getUrl = window.location;
    let baseUrl = `${getUrl.protocol}//${getUrl.host}/`;
    // No random string -- we want to use caching
    let url = `${baseUrl}/data/${version_str}/tomes.json`;
    let result = await (await fetch(url)).json();
    tomes = result.tomes;
    for (const tome of tomes) {
        //dependency on clean_item in load.js
        clean_item(tome);
    }
    init_tome_maps();
    tload_complete = true;
}
/*
 * Load tome set from remote DB (json). Calls init() on success.
 */
async function load_tome() {
    let getUrl = window.location;
    let baseUrl = `${getUrl.protocol}//${getUrl.host}/`;
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
    add_promises.push(add_tx.complete);

    await Promise.all(add_promises);
    init_tome_maps();
    tload_complete = true;
    tdb.close();
}

async function load_tome_init() {
    return new Promise((resolve, reject) => {
        let request = window.indexedDB.open('tome_db', TOME_DB_VERSION);

        request.onerror = function() {
            reject("DB failed to open...");
        };

        request.onsuccess = async function() {
            tdb = request.result;
            if (tload_in_progress) {
                while (!tload_complete) {
                    await sleep(100);
                }
                console.log("Skipping load...")
            }
            else {
                tload_in_progress = true
                if (treload) {
                    console.log("Using new data...")
                    await load_tome();
                }
                else {
                    console.log("Using stored data...")
                    await load_tome_local();
                }
            }
            resolve();
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
    });
}

const none_tomes_info = [
    ["tome", "weaponTome", "No Weapon Tome", 61],
    ["tome", "armorTome", "No Armor Tome", 62],
    ["tome", "guildTome", "No Guild Tome", 63],
    ["tome", "lootrunTome", "No Lootrun Tome", 93]
];
let none_tomes;

function init_tome_maps() {
    //warp
    tomeMap = new Map();
    /* Mapping from item names to set names. */
    tomeIDMap = new Map();

    tomeRedirectMap = new Map();
    for (const it of tome_types) {
        tomeLists.set(it, []);
    }

    none_tomes = [];
    for (let i = 0; i < 4; i++) {
        let tome = Object();
        tome.slots = 0;
        tome.category = none_tomes_info[i][0];
        tome.type = none_tomes_info[i][1];
        tome.name = none_tomes_info[i][2];
        tome.displayName = tome.name;
        tome.set = null;
        tome.quest = null;
        tome.skillpoints = [0, 0, 0, 0, 0];
        tome.has_negstat = false;
        tome.reqs = [0, 0, 0, 0, 0];
        tome.fixID = true;
        tome.tier = "Normal";
        tome.id = none_tomes_info[i][3];
        tome.nDam = "0-0";
        tome.eDam = "0-0";
        tome.tDam = "0-0";
        tome.wDam = "0-0";
        tome.fDam = "0-0";
        tome.aDam = "0-0";
        //dependency - load.js
        clean_item(tome);

        none_tomes.push(tome);
    }
    tomes = tomes.concat(none_tomes);
    for (const tome of tomes) {
        if (tome.remapID === undefined) {
            tomeLists.get(tome.type).push(tome.displayName);
            tomeMap.set(tome.displayName, tome);
            if (none_tomes.includes(tome)) {
                tomeIDMap.set(tome.id, "");
            }
            else {
                tomeIDMap.set(tome.id, tome.displayName);
            }
        }
        else {
            tomeRedirectMap.set(tome.id, tome.remapID);
        }
    }
}
