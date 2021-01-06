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
    let noneItems = [
        {displayName:"No Helmet", name: "No Helmet", category: "armor", type: "helmet", aDamPct: 0 ,aDef: 0, aDefPct: 0, agi: 0, agiReq: 0, atkTier: 0, classReq: null, def: 0, defReq: 0, dex: 0, dexReq: 0, drop: "never", eDamPct: 0, eDef: 0, eDefPct: 0, eSteal: 0, exploding: 0, fDamPct: 0, fDef: 0, fDefPct: 0, fixID: true, gSpd: 0, gXp: 0, hp: 0, hpBonus: 0, hprPct: 0, hprRaw: 0, int: 0, intReq: 0, jh: 0, lb: 0, lq: 0, ls: 0, lvl: 0, material: null, mdPct: 0, mdRaw: 0, mr: 0, ms: 0, poison: 0, quest: null, rainbowRaw: 0, ref: 0, sdPct: 0, sdRaw: 0, set: null, slots: 0, spPct1: 0, spPct2: 0, spPct3: 0, spPct4: 0, spRaw1: 0, spRaw2: 0, spRaw3: 0, spRaw4: 0, spRegen: 0, spd: 0, sprintReg: 0, str: 0, strReq: 0, tDamPct: 0, tDef: 0, tDefPct: 0, thorns: 0, tier: null, wDamPct: 0, wDef: 0, wDefPct: 0, xpb: 0},
        {displayName:"No Chestplate", name: "No Chesptlate", category: "armor", type: "chestplate", aDamPct: 0 ,aDef: 0, aDefPct: 0, agi: 0, agiReq: 0, atkTier: 0, classReq: null, def: 0, defReq: 0, dex: 0, dexReq: 0, drop: "never", eDamPct: 0, eDef: 0, eDefPct: 0, eSteal: 0, exploding: 0, fDamPct: 0, fDef: 0, fDefPct: 0, fixID: true, gSpd: 0, gXp: 0, hp: 0, hpBonus: 0, hprPct: 0, hprRaw: 0, int: 0, intReq: 0, jh: 0, lb: 0, lq: 0, ls: 0, lvl: 0, material: null, mdPct: 0, mdRaw: 0, mr: 0, ms: 0, poison: 0, quest: null, rainbowRaw: 0, ref: 0, sdPct: 0, sdRaw: 0, set: null, slots: 0, spPct1: 0, spPct2: 0, spPct3: 0, spPct4: 0, spRaw1: 0, spRaw2: 0, spRaw3: 0, spRaw4: 0, spRegen: 0, spd: 0, sprintReg: 0, str: 0, strReq: 0, tDamPct: 0, tDef: 0, tDefPct: 0, thorns: 0, tier: null, wDamPct: 0, wDef: 0, wDefPct: 0, xpb: 0},
        {displayName:"No Leggings", name: "No Leggings", category: "armor", type: "leggings", aDamPct: 0 ,aDef: 0, aDefPct: 0, agi: 0, agiReq: 0, atkTier: 0, classReq: null, def: 0, defReq: 0, dex: 0, dexReq: 0, drop: "never", eDamPct: 0, eDef: 0, eDefPct: 0, eSteal: 0, exploding: 0, fDamPct: 0, fDef: 0, fDefPct: 0, fixID: true, gSpd: 0, gXp: 0, hp: 0, hpBonus: 0, hprPct: 0, hprRaw: 0, int: 0, intReq: 0, jh: 0, lb: 0, lq: 0, ls: 0, lvl: 0, material: null, mdPct: 0, mdRaw: 0, mr: 0, ms: 0, poison: 0, quest: null, rainbowRaw: 0, ref: 0, sdPct: 0, sdRaw: 0, set: null, slots: 0, spPct1: 0, spPct2: 0, spPct3: 0, spPct4: 0, spRaw1: 0, spRaw2: 0, spRaw3: 0, spRaw4: 0, spRegen: 0, spd: 0, sprintReg: 0, str: 0, strReq: 0, tDamPct: 0, tDef: 0, tDefPct: 0, thorns: 0, tier: null, wDamPct: 0, wDef: 0, wDefPct: 0, xpb: 0},
        {displayName:"No Boots", name: "No Boots", category: "armor", type: "boots", aDamPct: 0 ,aDef: 0, aDefPct: 0, agi: 0, agiReq: 0, atkTier: 0, classReq: null, def: 0, defReq: 0, dex: 0, dexReq: 0, drop: "never", eDamPct: 0, eDef: 0, eDefPct: 0, eSteal: 0, exploding: 0, fDamPct: 0, fDef: 0, fDefPct: 0, fixID: true, gSpd: 0, gXp: 0, hp: 0, hpBonus: 0, hprPct: 0, hprRaw: 0, int: 0, intReq: 0, jh: 0, lb: 0, lq: 0, ls: 0, lvl: 0, material: null, mdPct: 0, mdRaw: 0, mr: 0, ms: 0, poison: 0, quest: null, rainbowRaw: 0, ref: 0, sdPct: 0, sdRaw: 0, set: null, slots: 0, spPct1: 0, spPct2: 0, spPct3: 0, spPct4: 0, spRaw1: 0, spRaw2: 0, spRaw3: 0, spRaw4: 0, spRegen: 0, spd: 0, sprintReg: 0, str: 0, strReq: 0, tDamPct: 0, tDef: 0, tDefPct: 0, thorns: 0, tier: null, wDamPct: 0, wDef: 0, wDefPct: 0, xpb: 0},
        {displayName:"No Ring 1", name: "No Ring 1", category: "accessory", type: "ring", aDamPct: 0 ,aDef: 0, aDefPct: 0, agi: 0, agiReq: 0, atkTier: 0, classReq: null, def: 0, defReq: 0, dex: 0, dexReq: 0, drop: "never", eDamPct: 0, eDef: 0, eDefPct: 0, eSteal: 0, exploding: 0, fDamPct: 0, fDef: 0, fDefPct: 0, fixID: true, gSpd: 0, gXp: 0, hp: 0, hpBonus: 0, hprPct: 0, hprRaw: 0, int: 0, intReq: 0, jh: 0, lb: 0, lq: 0, ls: 0, lvl: 0, material: null, mdPct: 0, mdRaw: 0, mr: 0, ms: 0, poison: 0, quest: null, rainbowRaw: 0, ref: 0, sdPct: 0, sdRaw: 0, set: null, slots: 0, spPct1: 0, spPct2: 0, spPct3: 0, spPct4: 0, spRaw1: 0, spRaw2: 0, spRaw3: 0, spRaw4: 0, spRegen: 0, spd: 0, sprintReg: 0, str: 0, strReq: 0, tDamPct: 0, tDef: 0, tDefPct: 0, thorns: 0, tier: null, wDamPct: 0, wDef: 0, wDefPct: 0, xpb: 0},
        {displayName:"No Ring 2", name: "No Ring 2", category: "accessory", type: "ring", aDamPct: 0 ,aDef: 0, aDefPct: 0, agi: 0, agiReq: 0, atkTier: 0, classReq: null, def: 0, defReq: 0, dex: 0, dexReq: 0, drop: "never", eDamPct: 0, eDef: 0, eDefPct: 0, eSteal: 0, exploding: 0, fDamPct: 0, fDef: 0, fDefPct: 0, fixID: true, gSpd: 0, gXp: 0, hp: 0, hpBonus: 0, hprPct: 0, hprRaw: 0, int: 0, intReq: 0, jh: 0, lb: 0, lq: 0, ls: 0, lvl: 0, material: null, mdPct: 0, mdRaw: 0, mr: 0, ms: 0, poison: 0, quest: null, rainbowRaw: 0, ref: 0, sdPct: 0, sdRaw: 0, set: null, slots: 0, spPct1: 0, spPct2: 0, spPct3: 0, spPct4: 0, spRaw1: 0, spRaw2: 0, spRaw3: 0, spRaw4: 0, spRegen: 0, spd: 0, sprintReg: 0, str: 0, strReq: 0, tDamPct: 0, tDef: 0, tDefPct: 0, thorns: 0, tier: null, wDamPct: 0, wDef: 0, wDefPct: 0, xpb: 0},
        {displayName:"No Bracelet", name: "No Bracelet", category: "accessory", type: "bracelet", aDamPct: 0 ,aDef: 0, aDefPct: 0, agi: 0, agiReq: 0, atkTier: 0, classReq: null, def: 0, defReq: 0, dex: 0, dexReq: 0, drop: "never", eDamPct: 0, eDef: 0, eDefPct: 0, eSteal: 0, exploding: 0, fDamPct: 0, fDef: 0, fDefPct: 0, fixID: true, gSpd: 0, gXp: 0, hp: 0, hpBonus: 0, hprPct: 0, hprRaw: 0, int: 0, intReq: 0, jh: 0, lb: 0, lq: 0, ls: 0, lvl: 0, material: null, mdPct: 0, mdRaw: 0, mr: 0, ms: 0, poison: 0, quest: null, rainbowRaw: 0, ref: 0, sdPct: 0, sdRaw: 0, set: null, slots: 0, spPct1: 0, spPct2: 0, spPct3: 0, spPct4: 0, spRaw1: 0, spRaw2: 0, spRaw3: 0, spRaw4: 0, spRegen: 0, spd: 0, sprintReg: 0, str: 0, strReq: 0, tDamPct: 0, tDef: 0, tDefPct: 0, thorns: 0, tier: null, wDamPct: 0, wDef: 0, wDefPct: 0, xpb: 0},
        {displayName:"No Necklace", name: "No Necklace", category: "accessory", type: "necklace", aDamPct: 0 ,aDef: 0, aDefPct: 0, agi: 0, agiReq: 0, atkTier: 0, classReq: null, def: 0, defReq: 0, dex: 0, dexReq: 0, drop: "never", eDamPct: 0, eDef: 0, eDefPct: 0, eSteal: 0, exploding: 0, fDamPct: 0, fDef: 0, fDefPct: 0, fixID: true, gSpd: 0, gXp: 0, hp: 0, hpBonus: 0, hprPct: 0, hprRaw: 0, int: 0, intReq: 0, jh: 0, lb: 0, lq: 0, ls: 0, lvl: 0, material: null, mdPct: 0, mdRaw: 0, mr: 0, ms: 0, poison: 0, quest: null, rainbowRaw: 0, ref: 0, sdPct: 0, sdRaw: 0, set: null, slots: 0, spPct1: 0, spPct2: 0, spPct3: 0, spPct4: 0, spRaw1: 0, spRaw2: 0, spRaw3: 0, spRaw4: 0, spRegen: 0, spd: 0, sprintReg: 0, str: 0, strReq: 0, tDamPct: 0, tDef: 0, tDefPct: 0, thorns: 0, tier: null, wDamPct: 0, wDef: 0, wDefPct: 0, xpb: 0},
        {displayName:"No Weapon", name: "No Weapon", category: "weapon", type: "wand", aDamPct: 0 ,aDef: 0, aDefPct: 0, agi: 0, agiReq: 0, atkTier: 0, classReq: null, def: 0, defReq: 0, dex: 0, dexReq: 0, drop: "never", eDamPct: 0, eDef: 0, eDefPct: 0, eSteal: 0, exploding: 0, fDamPct: 0, fDef: 0, fDefPct: 0, fixID: true, gSpd: 0, gXp: 0, hp: 0, hpBonus: 0, hprPct: 0, hprRaw: 0, int: 0, intReq: 0, jh: 0, lb: 0, lq: 0, ls: 0, lvl: 0, material: null, mdPct: 0, mdRaw: 0, mr: 0, ms: 0, poison: 0, quest: null, rainbowRaw: 0, ref: 0, sdPct: 0, sdRaw: 0, set: null, slots: 0, spPct1: 0, spPct2: 0, spPct3: 0, spPct4: 0, spRaw1: 0, spRaw2: 0, spRaw3: 0, spRaw4: 0, spRegen: 0, spd: 0, sprintReg: 0, str: 0, strReq: 0, tDamPct: 0, tDef: 0, tDefPct: 0, thorns: 0, tier: null, wDamPct: 0, wDef: 0, wDefPct: 0, xpb: 0}
    ]
    items = items.concat(noneItems);
    console.log(items);
    for (const item of items) {
        itemLists.get(item.type).push(item.displayName);
        itemMap.set(item.displayName, item);
    }
    /*for (const item of noneItems){
        itemLists.get(item.type).push(item.name);
        itemMap.set(item.name, item);
    }*/
    
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
    /*  TODO: implement level changing
        Make this entire function prettier
    */
    let helmet = document.getElementById("helmet-choice").value;
    let chestplate = document.getElementById("chestplate-choice").value;
    let leggings = document.getElementById("leggings-choice").value;
    let boots = document.getElementById("boots-choice").value;
    let ring1 = document.getElementById("ring1-choice").value;
    let ring2 = document.getElementById("ring2-choice").value;
    let bracelet = document.getElementById("bracelet-choice").value;
    let necklace = document.getElementById("necklace-choice").value;
    let weapon = document.getElementById("weapon-choice").value;
    if(helmet===""){
        helmet = "No Helmet";
    }
    if(chestplate===""){
        chestplate = "No Chestplate";
    }
    if(leggings===""){
        leggings = "No Leggings";
    }
    if(boots===""){
        boots = "No Boots";
    }
    if(ring1===""){
        ring1 = "No Ring 1";
    }
    if(ring2===""){
        ring2 = "No Ring 2";
    }
    if(bracelet===""){
        bracelet = "No Bracelet";
    }
    if(necklace===""){
        necklace = "No Necklace";
    }
    if(weapon===""){
        weapon = "No Weapon";
    }
    let player_build = new Build(
        106,
        itemMap.get(helmet),
        itemMap.get(chestplate),
        itemMap.get(leggings),
        itemMap.get(boots),
        itemMap.get(ring1),
        itemMap.get(ring2),
        itemMap.get(bracelet),
        itemMap.get(necklace),
        itemMap.get(weapon),
        );
    console.log(player_build.toString());
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

/*Turns the input amount of skill points into a float precision percentage.
    * @param skp - the integer skillpoint count to be converted
    */
function skillPointsToPercentage(skp){
    if (skp<=0){
        return 0.0;
    }else if(skp>=150){
        return 0.808;
    }else{
        return(-0.0000000066695* Math.pow(Math.E, -0.00924033 * skp + 18.9) + 1.0771);
        //return(-0.0000000066695* Math.pow(Math.E, -0.00924033 * skp + 18.9) + 1.0771).toFixed(3);
    }       
}

/*Turns the input amount of levels into skillpoints available.
*
* @param level - the integer level count te be converted
*/
function levelToSkillPoints(level){
    if(level < 1){
        return 0;
    }else if(level >= 101){
        return 200;
    }else{
        return (level - 1) * 2;
    }
}

/*Turns the input amount of levels in to base HP.
* @param level - the integer level count to be converted
*/
function levelToHPBase(level){
    if(level < 1){ //bad level
        return this.levelToHPBase(1);
    }else if (level > 106){ //also bad level
        return this.levelToHPBase(106);
    }else{ //good level
        return 5*level + 5;
    }
}

/*Class that represents a wynn player's build.
*/
class Build{
    
    /*Construct a build.
    */
    constructor(level,helmet,chestplate,leggings,boots,ring1,ring2,bracelet,necklace,weapon){
        if(helmet.type.valueOf() != "helmet".valueOf()){
            throw new TypeError("No such helmet named ", helmet.name);
        }else{
            this.helmet = helmet;
        }
        if(chestplate.type.valueOf() != "chestplate"){
            throw new TypeError("No such chestplate named ", chestplate.name);
        }else{
            this.chestplate = chestplate;
        }
        if(leggings.type.valueOf() != "leggings"){
            throw new TypeError("No such leggings named ", leggings.name);
        }else{
            this.leggings = leggings;
        }
        if(boots.type.valueOf() != "boots"){
            throw new TypeError("No such boots named ", boots.name);
        }else{
            this.boots = boots;
        }
        if(ring1.type.valueOf() != "ring"){
            throw new TypeError("No such ring named ", ring1.name);
        }else{
            this.ring1 = ring1;
        }
        if(ring2.type.valueOf() != "ring"){
            throw new TypeError("No such ring named ", ring2.name);
        }else{
            this.ring2 = ring2;
        }
        if(bracelet.type.valueOf() != "bracelet"){
            throw new TypeError("No such bracelet named ", bracelet.name);
        }else{
            this.bracelet = bracelet;
        }
        if(necklace.type.valueOf() != "necklace"){
            throw new TypeError("No such necklace named ", necklace.name);
        }else{
            this.necklace = necklace;
        }
        if(weapon.type.valueOf() == "wand" || weapon.type.valueOf() == "bow" || weapon.type.valueOf() == "dagger" || weapon.type.valueOf() == "spear" || weapon.type.valueOf() == "relik"){
            this.weapon = weapon;
        }else{
            throw new TypeError("No such weapon named ", weapon.name);
        }
        if(level < 1){ //Should these be constants?
            this.level = 1;
        }else if (level > 106){
            this.level = 106;
        }else{
            this.level = level;
        }
        this.skillpoints = levelToSkillPoints(this.level)
    }  

    /*Returns build in string format
    */ TODO
    toString(){
        return this.helmet.name + ", " + this.chestplate.name + ", " + this.leggings.name + ", " + this.boots.name + ", " + this.ring1.name + ", " + this.ring2.name + ", " + this.bracelet.name + ", " + this.necklace.name + ", " + this.weapon.name;
    }

    /* Getters */ TODO
    getHealth(){
        health = parseInt(this.helmet.hp,10) + parseInt(this.helmet.hpBonus,10) + parseInt(this.chestplate.hp,10) + parseInt(this.chestplate.hpBonus,10) + parseInt(this.leggings.hp,10) + parseInt(this.leggings.hpBonus,10) + parseInt(this.boots.hp,10) + parseInt(this.boots.hpBonus,10) + parseInt(this.ring1.hp,10) + parseInt(this.ring1.hpBonus,10) + parseInt(this.ring2.hp,10) + parseInt(this.ring2.hpBonus,10) + parseInt(this.bracelet.hp,10) + parseInt(this.bracelet.hpBonus,10) + parseInt(this.necklace.hp,10) + parseInt(this.necklace.hpBonus,10) + parseInt(this.weapon.hp,10) + parseInt(this.weapon.hpBonus,10) + levelToHPBase(this.level);
        if(health<5){
            return 5;
        }else{
            return health;
        }
    }
    /* Setters */ TODO

}
