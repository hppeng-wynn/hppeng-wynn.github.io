import {Build} from "./build.js"
const DB_VERSION = 2;
// @See https://github.com/mdn/learning-area/blob/master/javascript/apis/client-side-storage/indexeddb/video-store/index.js

let db;
let items;
let reload = false;
// Set up item lists for quick access later.
let armorTypes = [ "helmet", "chestplate", "leggings", "boots" ];
let accessoryTypes = [ "ring", "bracelet", "necklace" ];
let weaponTypes = [ "wand", "spear", "bow", "dagger", "relik" ];
let itemTypes = armorTypes.concat(accessoryTypes).concat(weaponTypes);
let itemLists = new Map();
for (const it of itemTypes) {
    itemLists.set(it, []);
}
let itemMap = new Map();

/*
 * Function that takes an item list and populates its corresponding dropdown.
 * Used for armors and bracelet/necklace.
 */
function populateItemList(type) {
    let item_list = document.getElementById(type+"-items");
    for (const item of itemLists.get(type)) {
        let el = document.createElement("option");
        el.value = item;
        item_list.appendChild(el);
    }
}

/*
 * Populate dropdowns, add listeners, etc.
 */
function init() {
    console.log(items);
    for (const item of items) {
        itemLists.get(item.type).push(item.displayName);
        itemMap.set(item.displayName, item);
    }
    
    for (const armorType of armorTypes) {
        populateItemList(armorType);
        // Add change listener to update armor slots.
        document.getElementById(armorType+"-choice").addEventListener("change", (event) => {
            let item = itemMap.get(event.target.value);
            if (item !== undefined) {
                document.getElementById(armorType+"-slots").textContent = item.slots + " slots";
            }
            else {
                document.getElementById(armorType+"-slots").textContent = "X slots";
            }
        });
    }

    let ring1_list = document.getElementById("ring1-items");
    let ring2_list = document.getElementById("ring2-items");
    for (const ring of itemLists.get("ring")) {
        let el1 = document.createElement("option");
        let el2 = document.createElement("option");
        el1.value = ring;
        el2.value = ring;
        ring1_list.appendChild(el1);
        ring2_list.appendChild(el2);
    }

    populateItemList("bracelet");
    populateItemList("necklace");

    let weapon_list = document.getElementById("weapon-items");
    for (const weaponType of weaponTypes) {
        for (const weapon of itemLists.get(weaponType)) {
            let el = document.createElement("option");
            el.value = weapon;
            weapon_list.appendChild(el);
        }
    }

    // Add change listener to update weapon slots.
    document.getElementById("weapon-choice").addEventListener("change", (event) => {
        let item = itemMap.get(event.target.value);
        if (item !== undefined) {
            document.getElementById("weapon-slots").textContent = item.slots + " slots";
        }
        else {
            document.getElementById("weapon-slots").textContent = "X slots";
        }
    });
}

/*
 * Load item set from local DB. Calls init() on success.
 */
async function load_local() {
    let get_tx = db.transaction('item_db', 'readonly');
    let get_store = get_tx.objectStore('item_db');
    let request = get_store.getAll();
    request.onerror = function(event) {
        console.log("Could not read local db...");
    }
    request.onsuccess = function(event) {
        console.log("Successfully read local db.");
        items = request.result;
        init();
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
async function load() {
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
        init();
    });
}

let request = window.indexedDB.open('item_db', DB_VERSION);

request.onerror = function() {
    console.log("DB failed to open...");
};

request.onsuccess = function() {
    db = request.result;
    if (!reload) {
        console.log("Using stored data...")
        load_local();
    }
    else {
        console.log("Using new data...")
        load();
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

function calculateBuild(){
    //TODO: implement level changing
    let player_build = new Build(
        106,
        itemMap.get(document.getElementById("helmet-choice").value),
        itemMap.get(document.getElementById("chestplate-choice").value),
        itemMap.get(document.getElementById("leggings-choice").value),
        itemMap.get(document.getElementById("boots-choice").value),
        itemMap.get(document.getElementById("ring1-choice").value),
        itemMap.get(document.getElementById("ring2-choice").value),
        itemMap.get(document.getElementById("bracelet-choice").value),
        itemMap.get(document.getElementById("necklace-choice").value),
        itemMap.get(document.getElementById("weapon-choice").value),
        );
    console.log(player_build.toString())
}

function resetFields(){
    document.getElementById("helmet-choice").value = "";
    document.getElementById("helmet-powder").value = "";
    document.getElementById("chestplate-choice").value = "";
    document.getElementById("chestplate-powder").value = "";
    document.getElementById("leggings-choice").value = "";
    document.getElementById("leggings-powder").value = "";
    document.getElementById("boots-choice").value = "";
    document.getElementById("boots-powder").value = "";
    document.getElementById("ring1-choice").value = "";
    document.getElementById("ring2-choice").value = "";
    document.getElementById("bracelet-choice").value = "";
    document.getElementById("necklace-choice").value = "";
    document.getElementById("weapon-choice").value = "";
    document.getElementById("weapon-powder").value = "";
    document.getElementById("str-skp").value = "";
    document.getElementById("dex-skp").value = "";
    document.getElementById("int-skp").value = "";
    document.getElementById("def-skp").value = "";
    document.getElementById("agi-skp").value = "";
}
