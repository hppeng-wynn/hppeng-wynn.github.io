const ING_DB_VERSION = 18;

// @See https://github.com/mdn/learning-area/blob/master/javascript/apis/client-side-storage/indexeddb/video-store/index.js

let idb;
let ireload = false;
let iload_in_progress = false;
let iload_complete = false;
let ings;
let recipes;

let ingMap = new Map();
let ingList = [];

let recipeMap;
let recipeList = [];

let ingIDMap = new Map();
let recipeIDMap;

/*
 * Load item set from local DB. Calls init() on success.
 */
async function ing_load_local() {
    return new Promise(function(resolve, reject) {
        let get_tx = idb.transaction(['ing_db', 'recipe_db'], 'readonly');
        let ings_store = get_tx.objectStore('ing_db');
        let recipes_store = get_tx.objectStore('recipe_db');
        let request3 = ings_store.getAll();
        request3.onerror = function(event) {
            reject("Could not read local ingredient db...");
        }
        request3.onsuccess = function(event) {
            console.log("Successfully read local ingredient db.");
        }
        let request4 = recipes_store.getAll();
        request4.onerror = function(event) {
            reject("Could not read local recipe db...");
        }
        request4.onsuccess = function(event) {
            console.log("Successfully read local recipe db.");
        }
        get_tx.oncomplete = function(event) {
            ings = request3.result;
            recipes = request4.result;
            init_ing_maps();
            iload_complete = true;
            idb.close();
            resolve()
        }
    });
}

function clean_ing(ing) {
    if (ing.remapID === undefined) {
        if (ing.displayName === undefined) {
            ing.displayName = ing.name;
        }
    }
}

async function load_ings_old_version(version_str) {
    iload_in_progress = true;
    let getUrl = window.location;
    let baseUrl = getUrl.protocol + "//" + getUrl.host;// + getUrl.pathname.split('/')[1];
    // No random string -- we want to use caching
    let url = baseUrl + "/data/" + version_str + "/ingreds.json"
    let result = await (await fetch(url)).json();
    ings = result;
    for (const id in ings) {
        clean_ing(ings[id]);
    }

    url = getURL.procol + "//" + getUrl.host + "/recipes_compress.json";
    result = await (await fetch(url)).json();
    recipes = result.recipes;

    init_maps();
    iload_complete = true;
}

/*
 * Load item set from remote DB (aka a big json file). Calls init() on success.
 */
async function load_ings() {

    let getUrl = window.location;
    let baseUrl = getUrl.protocol + "//" + getUrl.host + "/";// + getUrl.pathname.split('/')[1];
    // "Random" string to prevent caching!
    let url = baseUrl + "/ingreds_compress.json?"+new Date();
    url = url.replace(/\w+.html/, "") ; 
    let result = await (await fetch(url)).json();

    result = await (await fetch(url)).json();
    ings = result;

    url = url.replace("/ingreds_compress.json", "/recipes_compress.json");
    result = await (await fetch(url)).json();
    recipes = result.recipes;

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
    let add_tx2 = idb.transaction(['ing_db'], 'readwrite');
    let ings_store = add_tx2.objectStore('ing_db');
    for (const id in ings) {
        clean_ing(ings[id]);
        add_promises.push(ings_store.add(ings[id], id));
    }
    let add_tx3 = idb.transaction(['recipe_db'], 'readwrite');
    let recipes_store = add_tx3.objectStore('recipe_db');
    for (const recipe in recipes) {
        add_promises.push(recipes_store.add(recipes[recipe], recipe));
    }
    add_promises.push(add_tx2.complete);
    add_promises.push(add_tx3.complete);

    await Promise.all(add_promises);
    init_ing_maps();
    iload_complete = true;
    idb.close();
}

async function load_ing_init() {
    return new Promise((resolve, reject) => {
        let request = window.indexedDB.open("ing_db", ING_DB_VERSION)
        request.onerror = function() {
            reject("DB failed to open...");
        }

        request.onsuccess = async function() {
            idb = request.result;
            if (iload_in_progress) {
                while (!iload_complete) {
                    await sleep(100);
                }
                console.log("Skipping load...")
            }
            else {
                iload_in_progress = true
                if (ireload) {
                    console.log("Using new data...")
                    await load_ings();
                }
                else {
                    console.log("Using stored data...")
                    await ing_load_local();
                }
            }
            resolve();
        }

        request.onupgradeneeded = function(e) {
            ireload = true;

            let idb = e.target.result;
            
            try {
                idb.deleteObjectStore('ing_db');
            }
            catch (error) {
                console.log("Could not delete ingredient DB. This is probably fine");
            }
            try {
                idb.deleteObjectStore('recipe_db');
            }
            catch (error) {
                console.log("Could not delete recipe DB. This is probably fine");
            }
            idb.createObjectStore('ing_db');
            idb.createObjectStore('recipe_db');

            console.log("DB setup complete...");
        }
    });
}

function init_ing_maps() {
    recipeMap = new Map();
    recipeIDMap = new Map();

    let ing = {
        name: "No Ingredient",
        displayName: "No Ingredient",
        tier: 0,
        lvl: 0,
        skills: ["ARMOURING", "TAILORING", "WEAPONSMITHING", "WOODWORKING", "JEWELING", "COOKING", "ALCHEMISM", "SCRIBING"],
        ids: {},
        itemIDs: {"dura": 0, "strReq": 0, "dexReq": 0,"intReq": 0,"defReq": 0,"agiReq": 0,},
        consumableIDs: {"dura": 0, "charges": 0},
        posMods: {"left": 0, "right": 0, "above": 0, "under": 0, "touching": 0, "notTouching": 0},
        id: 4000
    };
    ingMap.set(ing.displayName, ing);
    ingList.push(ing.displayName);
    ingIDMap.set(ing.id, ing.displayName);
    let numerals = new Map([[1, "I"], [2, "II"], [3, "III"], [4, "IV"], [5, "V"], [6, "VI"]]);
    for (let i = 0; i < 5; i ++) {
        for (const powderIng of powderIngreds) {
            let ing = {
                name: "" + damageClasses[i+1] + " Powder " + numerals.get(powderIngreds.indexOf(powderIng) + 1),
                tier: 0,
                lvl: 0,
                skills: ["ARMOURING", "TAILORING", "WEAPONSMITHING", "WOODWORKING", "JEWELING"],
                ids: {},
                isPowder: true,
                pid: 6*i + powderIngreds.indexOf(powderIng),
                itemIDs: {"dura": powderIng["durability"], "strReq": 0, "dexReq": 0,"intReq": 0,"defReq": 0,"agiReq": 0},
                consumableIDs: {"dura": 0, "charges": 0},
                posMods: {"left": 0, "right": 0, "above": 0, "under": 0, "touching": 0, "notTouching": 0}
            };
            ing.id = 4001 + ing.pid;
            ing.displayName = ing.name;
            switch(i) {
                case 0:
                    ing.itemIDs["strReq"] = powderIng["skpReq"];
                    break;
                case 1:
                    ing.itemIDs["dexReq"] = powderIng["skpReq"];
                    break;
                case 2:
                    ing.itemIDs["intReq"] = powderIng["skpReq"];
                    break;
                case 3:
                    ing.itemIDs["defReq"] = powderIng["skpReq"];
                    break;
                case 4:
                    ing.itemIDs["agiReq"] = powderIng["skpReq"];
                    break;
            }
            ingMap.set(ing.displayName, ing);
            ingList.push(ing.displayName);
            ingIDMap.set(ing.id, ing.displayName);
        }
    }
    

    for (const ing of ings) {
        ingMap.set(ing.displayName, ing);
        ingList.push(ing.displayName);
        ingIDMap.set(ing.id, ing.displayName);
    }
    for (const recipe of recipes) {
        recipeMap.set(recipe.name, recipe);
        recipeList.push(recipe.name);
        recipeIDMap.set(recipe.id, recipe.name);
    }
}
