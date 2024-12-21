/**
 * @module load_tome
 * 
 * Depends on `clen_item` from load_item.js
 */

const TOME_DB_VERSION = 10;

let tomes;
let tomeMap;
let tomeIDMap;
let tomeRedirectMap;
let tomeLists = new Map();
let none_tomes = [];

class TomeLoader extends Loader {
    get old_data_paths() {
        return 'tomes';
    }
    
    get remote_paths() {
        return "tomes";
    }

    process_local(tsx, reject) {
        let tome_store = tsx.objectStore('tome_db');
        let tome_request = tome_store.getAll();
        tome_request.onerror = () => {
            reject("Could not read local tome db...");
        }
        tome_request.onsuccess = (event) => {
            tomes = event.target.result;
            console.log("Successfully read local tome db.");
        }
    }

    process_old_version(data) {
        tomes = data.tomes;
        for (const tome of tomes) {
            clean_item(tome);
        }
    }

    process_remote(data, tsx, reject) {
        tomes = data.tomes
        tsx.onabort = () => {
            reject("Not enough space...")
        };
        let tomes_store = tsx.objectStore('tome_db');
        for (const tome of tomes) {
            clean_item(tome);
            let req = tomes_store.add(tome, tome.name);
            req.onerror = () => {
                reject("ADD TOME ERROR? " + tome.name);
            };
        }
    }

    init_maps() {
        const none_tomes_info = [
            ["tome", "weaponTome", "No Weapon Tome", 61],
            ["tome", "armorTome", "No Armor Tome", 62],
            ["tome", "guildTome", "No Guild Tome", 63],
            ["tome", "lootrunTome", "No Lootrun Tome", 93]
        ];

        //warp
        tomeMap = new Map();
        /* Mapping from item names to set names. */
        tomeIDMap = new Map();

        tomeRedirectMap = new Map();
        for (const it of tome_types) {
            tomeLists.set(it, []);
        }

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
}

const tome_loader = new TomeLoader('tome_db', ['tome_db'], TOME_DB_VERSION);

