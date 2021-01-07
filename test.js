
let player_build;
// Set up item lists for quick access later.
let armorTypes = [ "helmet", "chestplate", "leggings", "boots" ];
let accessoryTypes = [ "ring", "bracelet", "necklace" ];
let weaponTypes = [ "wand", "spear", "bow", "dagger", "relik" ];
let item_fields = [ "name", "displayName", "tier", "set", "slots", "type", "material", "drop", "quest", "restrict", "nDam", "fDam", "wDam", "aDam", "tDam", "eDam", "atkSpd", "hp", "fDef", "wDef", "aDef", "tDef", "eDef", "lvl", "classReq", "strReq", "dexReq", "intReq", "agiReq", "defReq", "hprPct", "mr", "sdPct", "mdPct", "ls", "ms", "xpb", "lb", "ref", "str", "dex", "int", "agi", "def", "thorns", "expoding", "spd", "atkTier", "poison", "hpBonus", "spRegen", "eSteal", "hprRaw", "sdRaw", "mdRaw", "fDamPct", "wDamPct", "aDamPct", "tDamPct", "eDamPct", "fDefPct", "wDefPct", "aDefPct", "tDefPct", "eDefPct", "type", "fixID", "category", "spPct1", "spRaw1", "spPct2", "spRaw2", "spPct3", "spRaw3", "spPct4", "spRaw4", "rainbowRaw", "sprint", "sprintReg", "jh", "lq", "gXp", "gSpd" ];
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
    player_build = new Build(
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
    document.getElementById("build-helmet").innerHTML = player_build.helmet.name;
    document.getElementById("build-chestplate").innerHTML = player_build.chestplate.name;
    document.getElementById("build-leggings").innerHTML = player_build.helmet.name;
    document.getElementById("build-boots").innerHTML = player_build.helmet.name;
    document.getElementById("build-ring1").innerHTML = player_build.ring1.name;
    document.getElementById("build-ring2").innerHTML = player_build.ring2.name;
    document.getElementById("build-bracelet").innerHTML = player_build.bracelet.name;
    document.getElementById("build-necklace").innerHTML = player_build.necklace.name;
    document.getElementById("build-weapon").innerHTML = player_build.weapon.name;
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

load_init(init);
