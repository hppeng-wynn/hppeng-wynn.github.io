/*
 * TESTING SECTION
 */

const url_base = location.href.split("#")[0];
const url_tag = location.hash.slice(1);
console.log(url_base);
console.log(url_tag);

/*
 * END testing section
 */

const BUILD_VERSION = "1.1";

document.getElementById("header").textContent = "Wynn build calculator "+BUILD_VERSION+" (db version "+DB_VERSION+")";

let player_build;
// Set up item lists for quick access later.
let armorTypes = [ "helmet", "chestplate", "leggings", "boots" ];
let accessoryTypes = [ "ring", "bracelet", "necklace" ];
let weaponTypes = [ "wand", "spear", "bow", "dagger", "relik" ];
let item_fields = [ "name", "displayName", "tier", "set", "slots", "type", "material", "drop", "quest", "restrict", "nDam", "fDam", "wDam", "aDam", "tDam", "eDam", "atkSpd", "hp", "fDef", "wDef", "aDef", "tDef", "eDef", "lvl", "classReq", "strReq", "dexReq", "intReq", "defReq", "agiReq", "hprPct", "mr", "sdPct", "mdPct", "ls", "ms", "xpb", "lb", "ref", "str", "dex", "int", "agi", "def", "thorns", "exploding", "spd", "atkTier", "poison", "hpBonus", "spRegen", "eSteal", "hprRaw", "sdRaw", "mdRaw", "fDamPct", "wDamPct", "aDamPct", "tDamPct", "eDamPct", "fDefPct", "wDefPct", "aDefPct", "tDefPct", "eDefPct", "fixID", "category", "spPct1", "spRaw1", "spPct2", "spRaw2", "spPct3", "spRaw3", "spPct4", "spRaw4", "rainbowRaw", "sprint", "sprintReg", "jh", "lq", "gXp", "gSpd", "id" ];
let nonRolledIDs = ["name", "displayName", "tier", "set", "slots", "type", "material", "drop", "quest", "restrict", "nDam", "fDam", "wDam", "aDam", "tDam", "eDam", "atkSpd", "hp", "fDef", "wDef", "aDef", "tDef", "eDef", "lvl", "classReq", "strReq", "dexReq", "intReq", "defReq", "agiReq","str", "dex", "int", "agi", "def", "fixID", "category", "id"];
let rolledIDs = ["hprPct", "mr", "sdPct", "mdPct", "ls", "ms", "xpb", "lb", "ref", "thorns", "exploding", "spd", "atkTier", "poison", "hpBonus", "spRegen", "eSteal", "hprRaw", "sdRaw", "mdRaw", "fDamPct", "wDamPct", "aDamPct", "tDamPct", "eDamPct", "fDefPct", "wDefPct", "aDefPct", "tDefPct", "eDefPct", "spPct1", "spRaw1", "spPct2", "spRaw2", "spPct3", "spRaw3", "spPct4", "spRaw4", "rainbowRaw", "sprint", "sprintReg", "jh", "lq", "gXp", "gSpd"];
let stackingIDs = ["hprPct", "mr", "sdPct", "mdPct", "ls", "ms", "xpb", "lb", "ref", "thorns", "exploding", "spd", "atkTier", "poison", "hpBonus", "spRegen", "eSteal", "hprRaw", "sdRaw", "mdRaw", "fDamPct", "wDamPct", "aDamPct", "tDamPct", "eDamPct", "fDefPct", "wDefPct", "aDefPct", "tDefPct", "eDefPct", "spPct1", "spRaw1", "spPct2", "spRaw2", "spPct3", "spRaw3", "spPct4", "spRaw4", "rainbowRaw", "sprint", "sprintReg", "jh", "lq", "gXp", "gSpd", "fDef", "wDef", "aDef", "tDef", "eDef", "str", "dex", "int", "agi", "def"];
let standaloneIDs = ["name", "displayName", "tier", "set", "slots", "type", "material", "drop", "quest", "restrict", "nDam", "fDam", "wDam", "aDam", "tDam", "eDam", "atkSpd", "hp", "lvl", "classReq", "fixID", "category", "id"];
let skpReqs = ["strReq", "dexReq", "intReq", "defReq", "agiReq"];
let itemTypes = armorTypes.concat(accessoryTypes).concat(weaponTypes);
let itemLists = new Map();
for (const it of itemTypes) {
    itemLists.set(it, []);
}
let itemMap = new Map();
let idMap = new Map();

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
        ["helmet", "No Helmet"],
        ["chestplate", "No Chestplate"],
        ["leggings", "No Leggings"],
        ["boots", "No Boots"],
        ["ring", "No Ring 1"],
        ["ring", "No Ring 2"],
        ["bracelet", "No Bracelet"],
        ["necklace", "No Necklace"],
        ["wand", "No Weapon"],
    ];
    for (let i = 0; i < 9; i++) {
        let item = Object();
        for (const field of item_fields) {
            item[field] = 0;
        }
        item.type = noneItems[i][0];
        item.name = noneItems[i][1];
        item.displayName = item.name;
        item.set = null;
        item.quest = null;
        item.skillpoints = [0, 0, 0, 0, 0];
        item.has_negstat = false;
        item.reqs = [0, 0, 0, 0, 0];
        item.fixID = true;
        item.tier = " ";//do not get rid of this @hpp
        item.id = 10000 + i;

        noneItems[i] = item;
    }
    items = items.concat(noneItems);
    console.log(items);
    for (const item of items) {
        itemLists.get(item.type).push(item.displayName);
        itemMap.set(item.displayName, item);
        idMap.set(item.id, item.displayName);
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

    populateFromURL();
}

/*
 * Populate fields based on url, and calculate build.
 */
function populateFromURL() {
    if (url_tag) {
        let helmet;
        let chestplate;
        let leggings;
        let boots;
        let ring1;
        let ring2;
        let bracelet;
        let necklace;
        let weapon;
        let info = url_tag.split("_");
        let version = info[0];
        if (version === "0") {
            let equipments = info[1];
            helmet = idMap.get(Base64.toInt(equipments.slice(0,3)));
            chestplate = idMap.get(Base64.toInt(equipments.slice(3,6)));
            leggings = idMap.get(Base64.toInt(equipments.slice(6,9)));
            boots = idMap.get(Base64.toInt(equipments.slice(9,12)));
            ring1 = idMap.get(Base64.toInt(equipments.slice(12,15)));
            ring2 = idMap.get(Base64.toInt(equipments.slice(15,18)));
            bracelet = idMap.get(Base64.toInt(equipments.slice(18,21)));
            necklace = idMap.get(Base64.toInt(equipments.slice(21,24)));
            weapon = idMap.get(Base64.toInt(equipments.slice(24,27)));
        }

        setValue("helmet-choice", helmet);
        setValue("helmet-powder", "");
        setValue("chestplate-choice", chestplate);
        setValue("chestplate-powder", "");
        setValue("leggings-choice", leggings);
        setValue("leggings-powder", "");
        setValue("boots-choice", boots);
        setValue("boots-powder", "");
        setValue("ring1-choice", ring1);
        setValue("ring2-choice", ring2);
        setValue("bracelet-choice", bracelet);
        setValue("necklace-choice", necklace);
        setValue("weapon-choice", weapon);
        setValue("weapon-powder", "");
        setValue("str-skp", "0");
        setValue("dex-skp", "0");
        setValue("int-skp", "0");
        setValue("def-skp", "0");
        setValue("agi-skp", "0");
        calculateBuild();
    }
}

function encodeBuild() {
    if (player_build) {
        let build_string = "0_" + Base64.fromIntN(player_build.helmet.id, 3) +
                            Base64.fromIntN(player_build.chestplate.id, 3) +
                            Base64.fromIntN(player_build.leggings.id, 3) +
                            Base64.fromIntN(player_build.boots.id, 3) +
                            Base64.fromIntN(player_build.ring1.id, 3) +
                            Base64.fromIntN(player_build.ring2.id, 3) +
                            Base64.fromIntN(player_build.bracelet.id, 3) +
                            Base64.fromIntN(player_build.necklace.id, 3) +
                            Base64.fromIntN(player_build.weapon.id, 3);

        return build_string;
    }
    return "";
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

    let equip_order_text = "Equip order: <br>";
    for (const item of player_build.equip_order) {
        equip_order_text += item.displayName + "<br>";
    }
    setHTML("build-order", equip_order_text);
    
    let assigned = player_build.base_skillpoints;
    setText("str-skp-assign", "Before Boosts: " + assigned[0]);
    setText("dex-skp-assign", "Before Boosts: " + assigned[1]);
    setText("int-skp-assign", "Before Boosts: " + assigned[2]);
    setText("def-skp-assign", "Before Boosts: " + assigned[3]);
    setText("agi-skp-assign", "Before Boosts: " + assigned[4]);

    let skillpoints = player_build.total_skillpoints;
    setValue("str-skp", skillpoints[0]);
    setValue("dex-skp", skillpoints[1]);
    setValue("int-skp", skillpoints[2]);
    setValue("def-skp", skillpoints[3]);
    setValue("agi-skp", skillpoints[4]);
    setText("str-skp-base", "Original Value: " + skillpoints[0]);
    setText("dex-skp-base", "Original Value: " + skillpoints[1]);
    setText("int-skp-base", "Original Value: " + skillpoints[2]);
    setText("def-skp-base", "Original Value: " + skillpoints[3]);
    setText("agi-skp-base", "Original Value: " + skillpoints[4]);
    console.log(skillpoints);

    setHTML("str-skp-pct", skillPointsToPercentage(skillpoints[0])*100 );
    setHTML("dex-skp-pct", skillPointsToPercentage(skillpoints[1])*100 );
    setHTML("int-skp-pct", skillPointsToPercentage(skillpoints[2])*100 );
    setHTML("def-skp-pct", skillPointsToPercentage(skillpoints[3])*100 );
    setHTML("agi-skp-pct", skillPointsToPercentage(skillpoints[4])*100 );

    setText("summary-box", "Summary: Assigned "+player_build.assigned_skillpoints+" skillpoints.");

    displayExpandedItem(expandItem(player_build.helmet), "build-helmet");
    displayExpandedItem(expandItem(player_build.chestplate), "build-chestplate");
    displayExpandedItem(expandItem(player_build.leggings), "build-leggings");
    displayExpandedItem(expandItem(player_build.boots), "build-boots");
    displayExpandedItem(expandItem(player_build.ring1), "build-ring1");
    displayExpandedItem(expandItem(player_build.ring2), "build-ring2");
    displayExpandedItem(expandItem(player_build.bracelet), "build-bracelet");
    displayExpandedItem(expandItem(player_build.necklace), "build-necklace");
    displayExpandedItem(expandItem(player_build.weapon), "build-weapon");
    let meleeStats = player_build.getMeleeStats();
    //nDamAdj,eDamAdj,tDamAdj,wDamAdj,fDamAdj,aDamAdj,totalDamNorm,totalDamCrit,normDPS,critDPS,avgDPS
    let meleeSummary = "";
    meleeSummary = meleeSummary.concat("<h1><u>Melee Stats</u></h1>");
    meleeSummary = meleeSummary.concat("<h2>Average DPS: ",Math.round(meleeStats[10]),"</h2> <br><br>");
    meleeSummary = meleeSummary.concat("<b>Non-Crit Stats: </b><br>");
    if(meleeStats[0][0] > 0){
        meleeSummary = meleeSummary.concat("Neutral Damage: ",meleeStats[0][0]," -> ",meleeStats[0][1],"<br>");
    }
    if(meleeStats[1][0] > 0){
        meleeSummary = meleeSummary.concat("Earth Damage: ",meleeStats[1][0]," -> ",meleeStats[1][1],"<br>");
    }
    if(meleeStats[2][0] > 0){
        meleeSummary = meleeSummary.concat("Thunder Damage: ",meleeStats[2][0]," -> ",meleeStats[2][1],"<br>");
    }
    if(meleeStats[3][0] > 0){
        meleeSummary = meleeSummary.concat("Water Damage: ",meleeStats[3][0]," -> ",meleeStats[3][1],"<br>");
    }
    if(meleeStats[4][0] > 0){
        meleeSummary = meleeSummary.concat("Fire Damage: ",meleeStats[4][0]," -> ",meleeStats[4][1],"<br>");
    }
    if(meleeStats[5][0] > 0){
        meleeSummary = meleeSummary.concat("Air Damage: ",meleeStats[5][0]," -> ",meleeStats[5][1],"<br>");
    }
    meleeSummary = meleeSummary.concat("<br>Total Damage: ",meleeStats[6][0]," -> ",meleeStats[6][1],"<br>");
    meleeSummary = meleeSummary.concat("Normal DPS: ",Math.round(meleeStats[8]),"<br><br>");
    meleeSummary = meleeSummary.concat("<b>Crit Stats: </b><br>");
    if(meleeStats[0][2] > 0){
        meleeSummary = meleeSummary.concat("Neutral Damage: ",meleeStats[0][2]," -> ",meleeStats[0][3],"<br>");
    }
    if(meleeStats[1][2] > 0){
        meleeSummary = meleeSummary.concat("Earth Damage: ",meleeStats[1][2]," -> ",meleeStats[1][3],"<br>");
    }
    if(meleeStats[2][2] > 0){
        meleeSummary = meleeSummary.concat("Thunder Damage: ",meleeStats[2][2]," -> ",meleeStats[2][3],"<br>");
    }
    if(meleeStats[3][2] > 0){
        meleeSummary = meleeSummary.concat("Water Damage: ",meleeStats[3][2]," -> ",meleeStats[3][3],"<br>");
    }
    if(meleeStats[4][2] > 0){
        meleeSummary = meleeSummary.concat("Fire Damage: ",meleeStats[4][2]," -> ",meleeStats[4][3],"<br>");
    }
    if(meleeStats[5][2] > 0){
        meleeSummary = meleeSummary.concat("Air Damage: ",meleeStats[5][2]," -> ",meleeStats[5][3],"<br>");
    }
    meleeSummary = meleeSummary.concat("<br>Total Damage: ",meleeStats[7][0]," -> ",meleeStats[7][1],"<br>");
    meleeSummary = meleeSummary.concat("Crit DPS: ",Math.round(meleeStats[9]),"<br><br>");
    setHTML("build-cumulative-stats", "".concat(meleeSummary)); //Incomplete function
    location.hash = encodeBuild();
}
/*  Helper function that gets stats ranges for wearable items.
    @param item - an item in Object format.
*/
/*  A second helper function that takes items from expandItem() and stringifies them.
    @param item - a map with non-rolled Ids as normal key:value pairs and all rolled IDs as 2 separate key:value pairs in the minRoll and maxRoll keys that are mapped to maps.
    TODO: write the function
*/
function expandedItemToString(item){
    let ids = ["lvl", "classReq","strReq", "dexReq", "intReq", "defReq","agiReq", "nDam", "eDam", "tDam", "wDam", "tDam", "aDam", "atkSpd", "hp", "eDef", "tDef", "wDef", "fDef", "aDef", "str", "dex", "int", "agi", "def", "hpBonus", "hprRaw", "hprPct", "sdRaw", "sdPct", "mdRaw", "mdPct", "mr", "ms", "ref", "ls", "poison", "thorns", "exploding", "spd", "atkTier",  "eDamPct", "tDamPct", "wDamPct", "fDamPct", "aDamPct", "eDefPct", "tDefPct", "wDefPct", "fDefPct", "aDefPct", "spPct1", "spRaw1", "spPct2", "spRaw2", "spPct3", "spRaw3", "spPct4", "spRaw4", "rainbowRaw", "sprint", "sprintReg", "jh", "xpb", "lb", "lq", "spRegen", "eSteal", "gXp", "gSpd", "slots", "set", "quest", "restrict"];
    let idPrefixes = {"lvl":"Combat Level Min: ", "classReq":"Class Req: ","strReq":"Strength Min: ","dexReq":"Dexterity Min: ","intReq":"Intelligence Min: ","defReq":"Defense Min: ","agiReq":"Agility Min: ", "nDam":"Neutral Damage: ", "eDam":"Earth Damage: ", "tDam":"Thunder Damage: ", "wDam":"Water Damage: ", "fDam":"Fire Damage: ", "aDam":"Air Damage: ", "atkSpd":"Attack Speed: ", "hp":"Health: ", "eDef":"Earth Defense: ", "tDef":"Thunder Defense: ", "wDef":"Water Defense: ", "fDef":"Fire Defense: ", "aDef":"Air Defense: ", "str":"Strength: ", "dex":"Dexterity: ", "int":"Intelligence: ", "def":"Defense: ","agi":"Agility: ", "hpBonus":"Health Bonus: ", "hprRaw":"Health Regen Raw: ", "hprPct":"Health Regen %: ", "sdRaw":"Raw Spell Damage: ", "sdPct":"Spell Damage %: ", "mdRaw":"Main Attack Neutral Damage: ", "mdPct":"Main Attack Damage %: ", "mr":"Mana Regen: ", "ms":"Mana Steal: ", "ref":"Reflection: ", "ls":"Life Steal: ", "poison":"Poison: ", "thorns":"Thorns: ", "exploding":"Expoding: ", "spd":"Walk Speed Bonus: ", "atkTier":"Attack Speed Bonus: ",  "eDamPct":"Earth Damage %: ", "tDamPct":"Thunder Damage %: ", "wDamPct":"Water Damage %: ", "fDamPct":"Fire Damage %: ", "aDamPct":"Air Damage %: ", "eDefPct":"Earth Defense %: ", "tDefPct":"Thunder Defense %: ", "wDefPct":"Water Defense %: ", "fDefPct":"Fire Defense %: ", "aDefPct":"Air Defense %: ", "spPct1":"1st Spell Cost %: ", "spRaw1":"1st Spell Cost Raw: ", "spPct2":"2nd Spell Cost %: ", "spRaw2":"2nd Spell Cost Raw: ", "spPct3":"3rd Spell Cost %: ", "spRaw3":"3rd Spell Cost Raw: ", "spPct4":"4th Spell Cost %: ", "spRaw4":"4th Spell Cost Raw: ", "rainbowRaw":"Rainbow Spell Damage Raw: ", "sprint":"Sprint Bonus: ", "sprintReg":"Sprint Regen Bonus: ", "jh":"Jump Height: ", "xpb":"Combat XP Bonus: ", "lb":"Loot Bonus: ", "lq":"Loot Quality: ", "spRegen":"Soul Point Regen: ", "eSteal":"Stealing: ", "gXp":"Gathering XP Bonus: ", "gSpd":"Gathering Speed Bonus: ", "slots":"Powder Slots: ", "set":"This item belongs to the ", "quest":"This item is from the quest<br>", "restrict":""};
    let idSuffixes = {"lvl":"", "classReq":"","strReq":"","dexReq":"","intReq":"","defReq":"","agiReq":"", "nDam":"", "eDam":"", "tDam":"", "wDam":"", "fDam":"", "aDam":"", "atkSpd":"", "hp":"", "eDef":"", "tDef":"", "wDef":"", "fDef":"", "aDef":"", "str":"", "dex":"", "int":"", "def":"","agi":"", "hpBonus":"", "hprRaw":"", "hprPct":"%", "sdRaw":"", "sdPct":"%", "mdRaw":"", "mdPct":"%", "mr":"/4s", "ms":"/4s", "ref":"%", "ls":"/4s", "poison":"/3s", "thorns":"%", "exploding":"%", "spd":"%", "atkTier":" tier",  "eDamPct":"%", "tDamPct":"%", "wDamPct":"%", "fDamPct":"%", "aDamPct":"%", "eDefPct":"%", "tDefPct":"%", "wDefPct":"%", "fDefPct":"%", "aDefPct":"%", "spPct1":"%", "spRaw1":"", "spPct2":"%", "spRaw2":"", "spPct3":"%", "spRaw3":"", "spPct4":"%", "spRaw4":"", "rainbowRaw":"", "sprint":"%", "sprintReg":"%", "jh":"", "xpb":"%", "lb":"%", "lq":"%", "spRegen":"%", "eSteal":"%", "gXp":"%", "gSpd":"%", "slots":"", "set":" set.", "quest":".", "restrict":""};
    let itemString = "";
    itemString = itemString.concat(item.get("name"),"<br><br>");
    if(item.has("fixID") && item.get("fixID")){//fixed IDs
        for(i = 0; i < ids.length; i++){ //iterate the ids
            if(nonRolledIDs.includes(ids[i]) && item.get(ids[i])){//nonRolledID & non-0/non-null/non-und ID
                itemString = itemString.concat(idPrefixes[ids[i]]);
                itemString = itemString.concat(item.get(ids[i]), idSuffixes[ids[i]],"<br>");
            }
            if(rolledIDs.includes(ids[i]) && item.get("minRolls").get(ids[i]) && item.get("maxRolls").get(ids[i]) ){//rolled ID & non-0/non-null/non-und ID
                itemString = itemString.concat(idPrefixes[ids[i]]);
                itemString = itemString.concat(item.get("minRolls").get(ids[i]), idSuffixes[ids[i]],"<br>");
            }//Just don't do anything if else
        }
    }else{//non-fixed IDs
        for(i = 0; i < ids.length; i++){ //iterate the ids
            if(nonRolledIDs.includes(ids[i]) && item.get(ids[i])){//nonRolledID & non-0/non-null/non-und ID
                itemString = itemString.concat(idPrefixes[ids[i]]);
                itemString = itemString.concat(item.get(ids[i]), idSuffixes[ids[i]],"<br>");
            }
            if(rolledIDs.includes(ids[i]) && item.get("minRolls").get(ids[i]) && item.get("maxRolls").get(ids[i]) ){//rolled ID & non-0/non-null/non-und ID
                itemString = itemString.concat(idPrefixes[ids[i]]);
                itemString = itemString.concat(item.get("minRolls").get(ids[i]), idSuffixes[ids[i]], " -> ", idRound(item.get("maxRolls").get(ids[i])),idSuffixes[ids[i]],"<br>");
            }//Just don't do anything if else
        }
    }
    itemString = itemString.concat("<br>",item.get("tier")," ", item.get("type"));
    return itemString;
}
/*An independent helper function that rounds a rolled ID to the nearest integer OR brings the roll away from 0.
* @param id
*/
function idRound(id){
    rounded = Math.round(id);
    if(rounded == 0){
        return 1;
    }else{
        return rounded;
    }
}



function resetFields(){
    setValue("helmet-choice", "");
    setValue("helmet-powder", "");
    setValue("chestplate-choice", "");
    setValue("chestplate-powder", "");
    setValue("leggings-choice", "");
    setValue("leggings-powder", "");
    setValue("boots-choice", "");
    setValue("boots-powder", "");
    setValue("ring1-choice", "");
    setValue("ring2-choice", "");
    setValue("bracelet-choice", "");
    setValue("necklace-choice", "");
    setValue("weapon-choice", "");
    setValue("weapon-powder", "");
    setValue("str-skp", "0");
    setValue("dex-skp", "0");
    setValue("int-skp", "0");
    setValue("def-skp", "0");
    setValue("agi-skp", "0");
    location.hash = "";
}

load_init(init);

