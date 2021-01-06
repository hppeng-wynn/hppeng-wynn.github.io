const DB_VERSION = 1;
// @See https://github.com/mdn/learning-area/blob/master/javascript/apis/client-side-storage/indexeddb/video-store/index.js

//const item_fields = [ "name", "displayName", "tier", "set", "slots", "type", "armorType", "color", "lore", "material", "drop", "quest", "restrict", "nDam", "fDam", "wDam", "aDam", "tDam", "eDam", "atkSpd", "hp", "fDef", "wDef", "aDef", "tDef", "eDef", "lvl", "classReq", "strReq", "dexReq", "intReq", "agiReq", "defReq", "hprPct", "mr", "sdPct", "mdPct", "ls", "ms", "xpb", "lb", "ref", "str", "dex", "int", "agi", "def", "thorns", "expoding", "spd", "atkTier", "poison", "hpBonus", "spRegen", "eSteal", "hprRaw", "sdRaw", "mdRaw", "fDamPct", "wDamPct", "aDamPct", "tDamPct", "eDamPct", "fDefPct", "wDefPct", "aDefPct", "tDefPct", "eDefPct", "accessoryType", "fixID", "skin", "category", "spPct1", "spRaw1", "spPct2", "spRaw2", "spPct3", "spRaw3", "spPct4", "spRaw4", "rainbowRaw", "sprint", "sprintReg", "jh", "lq", "gXp", "gSpd" ]

let db;
let items;
let reload = false;
let armorTypes = [ "helmet", "chestplate", "leggings", "boots" ];
let accessoryTypes = [ "ring", "bracelet", "necklace" ];
let weaponTypes = [ "wand", "spear", "bow", "dagger", "relik" ];
let itemTypes = armorTypes.concat(accessoryTypes).concat(weaponTypes);
let itemLists = new Map();
for (const it of itemTypes) {
    itemLists.set(it, []);
}
let itemMap = new Map();

function populateItemList(type) {
    let item_list = document.getElementById(type+"-items");
    for (const item of itemLists.get(type)) {
        let el = document.createElement("option");
        el.value = item;
        item_list.appendChild(el);
    }
}

function init() {
    console.log(items);
    for (const item of items) {
        itemLists.get(item.type).push(item.name);
        itemMap.set(item.name, item);
    }
    
    for (const armorType of armorTypes) {
        populateItemList(armorType);
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

function clean_item(item) {
    if (item.displayName === null) {
        item.displayName = item.name;
    }
}

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
    
    let objectStore = db.createObjectStore('item_db');

    objectStore.createIndex('item', 'item', {unique: false});

    console.log("DB setup complete...");
}

