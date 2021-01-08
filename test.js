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

const BUILD_VERSION = "1.3";

document.getElementById("header").textContent = "Wynn build calculator "+BUILD_VERSION+" (db version "+DB_VERSION+")";

let player_build;
// Set up item lists for quick access later.
let armorTypes = [ "helmet", "chestplate", "leggings", "boots" ];
let accessoryTypes = [ "ring", "bracelet", "necklace" ];
let weaponTypes = [ "wand", "spear", "bow", "dagger", "relik" ];
let item_fields = [ "name", "displayName", "tier", "set", "slots", "type", "material", "drop", "quest", "restrict", "nDam", "fDam", "wDam", "aDam", "tDam", "eDam", "atkSpd", "hp", "fDef", "wDef", "aDef", "tDef", "eDef", "lvl", "classReq", "strReq", "dexReq", "intReq", "defReq", "agiReq", "hprPct", "mr", "sdPct", "mdPct", "ls", "ms", "xpb", "lb", "ref", "str", "dex", "int", "agi", "def", "thorns", "exploding", "spd", "atkTier", "poison", "hpBonus", "spRegen", "eSteal", "hprRaw", "sdRaw", "mdRaw", "fDamPct", "wDamPct", "aDamPct", "tDamPct", "eDamPct", "fDefPct", "wDefPct", "aDefPct", "tDefPct", "eDefPct", "fixID", "category", "spPct1", "spRaw1", "spPct2", "spRaw2", "spPct3", "spRaw3", "spPct4", "spRaw4", "rainbowRaw", "sprint", "sprintReg", "jh", "lq", "gXp", "gSpd", "id" ];
let skpReqs = ["strReq", "dexReq", "intReq", "defReq", "agiReq"];

let powderIDs = new Map();
let powderNames = new Map();
let _powderID = 0;
for (const x of ['e', 't', 'w', 'f', 'a']) {
    for (let i = 1; i <= 6; ++i) {
        // Support both upper and lowercase, I guess.
        powderIDs.set(x.toUpperCase()+i, _powderID);
        powderIDs.set(x+i, _powderID);
        powderNames.set(_powderID, x+i);
        _powderID++;
    }
}
let powderInputs = [
    "helmet-powder",
    "chestplate-powder",
    "leggings-powder",
    "boots-powder",
    "weapon-powder",
];
// Ordering: [dmgMin, dmgMax, convert, defPlus, defMinus (+6 mod 5)]
let powderStats = [
    [3,6,17,2,1], [6,9,21,4,2], [8,14,25,8,3], [11,16,31,14,5], [15,18,38,22,9], [18,22,46,30,13],
    [1,8,9,3,1], [1,13,11,5,1], [2,18,14,9,2], [3,24,17,14,4], [3,32,22,20,7], [5,40,28,28,10],
    [3,4,13,3,1], [4,7,15,6,1], [6,10,17,11,2], [8,12,21,18,4], [11,14,26,28,7], [13,17,32,40,10],
    [2,5,14,3,1], [4,8,16,5,2], [6,10,19,9,3], [9,13,24,16,5], [12,16,30,25,9], [15,19,37,36,13],
    [2,6,11,3,1], [4,9,14,6,2], [7,10,17,10,3], [9,13,22,16,5], [13,18,28,24,9], [16,18,35,34,13]
];

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
        ["armor", "helmet", "No Helmet"],
        ["armor", "chestplate", "No Chestplate"],
        ["armor", "leggings", "No Leggings"],
        ["armor", "boots", "No Boots"],
        ["accessory", "ring", "No Ring 1"],
        ["accessory", "ring", "No Ring 2"],
        ["accessory", "bracelet", "No Bracelet"],
        ["accessory", "necklace", "No Necklace"],
        ["weapon", "wand", "No Weapon"],
    ];
    for (let i = 0; i < 9; i++) {
        let item = Object();
        for (const field of item_fields) {
            item[field] = 0;
        }
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
        item.tier = " ";//do not get rid of this @hpp
        item.id = 10000 + i;
        item.nDam = "0-0";
        item.eDam = "0-0";
        item.tDam = "0-0";
        item.wDam = "0-0";
        item.fDam = "0-0";
        item.aDam = "0-0";

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
        let powdering = ["", "", "", "", ""];
        let info = url_tag.split("_");
        let version = info[0];
        if (version === "0" || version === "1") {
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
        if (version === "1") {
            let powder_info = info[1].slice(27);
            console.log(powder_info);
            // TODO: Make this run in linear instead of quadratic time...
            for (let i = 0; i < 5; ++i) {
                let powders = "";
                let n_blocks = Base64.toInt(powder_info.charAt(0));
                console.log(n_blocks + " blocks");
                powder_info = powder_info.slice(1);
                for (let j = 0; j < n_blocks; ++j) {
                    let block = powder_info.slice(0,5);
                    console.log(block);
                    let six_powders = Base64.toInt(block);
                    for (let k = 0; k < 6 && six_powders != 0; ++k) {
                        powders += powderNames.get((six_powders & 0x1f) - 1);
                        six_powders >>>= 5;
                    }
                    powder_info = powder_info.slice(5);
                }
                powdering[i] = powders;
            }
        }

        setValue("helmet-choice", helmet);
        setValue("helmet-powder", powdering[0]);
        setValue("chestplate-choice", chestplate);
        setValue("chestplate-powder", powdering[1]);
        setValue("leggings-choice", leggings);
        setValue("leggings-powder", powdering[2]);
        setValue("boots-choice", boots);
        setValue("boots-powder", powdering[3]);
        setValue("ring1-choice", ring1);
        setValue("ring2-choice", ring2);
        setValue("bracelet-choice", bracelet);
        setValue("necklace-choice", necklace);
        setValue("weapon-choice", weapon);
        setValue("weapon-powder", powdering[4]);
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
//        let build_string = "0_" + Base64.fromIntN(player_build.helmet.id, 3) +
//                            Base64.fromIntN(player_build.chestplate.id, 3) +
//                            Base64.fromIntN(player_build.leggings.id, 3) +
//                            Base64.fromIntN(player_build.boots.id, 3) +
//                            Base64.fromIntN(player_build.ring1.id, 3) +
//                            Base64.fromIntN(player_build.ring2.id, 3) +
//                            Base64.fromIntN(player_build.bracelet.id, 3) +
//                            Base64.fromIntN(player_build.necklace.id, 3) +
//                            Base64.fromIntN(player_build.weapon.id, 3);
        let build_string = "1_" + Base64.fromIntN(player_build.helmet.id, 3) +
                            Base64.fromIntN(player_build.chestplate.id, 3) +
                            Base64.fromIntN(player_build.leggings.id, 3) +
                            Base64.fromIntN(player_build.boots.id, 3) +
                            Base64.fromIntN(player_build.ring1.id, 3) +
                            Base64.fromIntN(player_build.ring2.id, 3) +
                            Base64.fromIntN(player_build.bracelet.id, 3) +
                            Base64.fromIntN(player_build.necklace.id, 3) +
                            Base64.fromIntN(player_build.weapon.id, 3);

        for (const _powderset of player_build.powders) {
            let n_bits = Math.ceil(_powderset.length / 6);
            build_string += Base64.fromIntN(n_bits, 1); // Hard cap of 378 powders.
            // Slice copy.
            let powderset = _powderset.slice();
            while (powderset.length != 0) {
                let firstSix = powderset.slice(0,6).reverse();
                let powder_hash = 0;
                for (const powder of firstSix) {
                    powder_hash = (powder_hash << 5) + 1 + powder; // LSB will be extracted first.
                }
                build_string += Base64.fromIntN(powder_hash, 5);
                powderset = powderset.slice(6);
            }
        }

        return build_string;
    }
    return "";
}

function calculateBuild(){
    /*  TODO: implement level changing
        Make this entire function prettier
    */
    let helmet = getValue("helmet-choice");
    let chestplate = getValue("chestplate-choice");
    let leggings = getValue("leggings-choice");
    let boots = getValue("boots-choice");
    let ring1 = getValue("ring1-choice");
    let ring2 = getValue("ring2-choice");
    let bracelet = getValue("bracelet-choice");
    let necklace = getValue("necklace-choice");
    let weapon = getValue("weapon-choice");
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
    let powderings = [];
    for (const i in powderInputs) {
        // read in two characters at a time.
        // TODO: make this more robust.
        let input = getValue(powderInputs[i]);
        let powdering = [];
        while (input) {
            let first = input.slice(0, 2);
            powdering.push(powderIDs.get(first));
            input = input.slice(2);
        }
        powderings.push(powdering);
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
        powderings
        );
    console.log(player_build.toString());

    let equip_order_text = "Equip order: <br>";
    for (const item of player_build.equip_order) {
        equip_order_text += item.displayName + "<br>";
    }
    setHTML("build-order", equip_order_text);
    
    const assigned = player_build.base_skillpoints;
    const skillpoints = player_build.total_skillpoints;

    let skp_order = ["str","dex","int","def","agi"];
    let skp_effects = ["% more damage dealt.","% chance to crit.","% spell cost reduction.","% less damage taken.","% chance to dodge."];
    for (let i in skp_order){ //big bren
        setText(skp_order[i] + "-skp-assign", "Before Boosts: " + assigned[i]);
        setValue(skp_order[i] + "-skp", skillpoints[i]);
        if(assigned[i] <= 100){
            setText(skp_order[i] + "-skp-base", "Original Value: " + skillpoints[i]);
        }else{
            setHTML(skp_order[i] + "-skp-base", "Original Value: " + skillpoints[i] + "<br>WARNING: cannot assign " + assigned[i] + " skillpoints naturally.");
        }
        setText(skp_order[i] + "-skp-pct", (skillPointsToPercentage(skillpoints[i])*100).toFixed(1).concat(skp_effects[i]));
    }
    console.log(skillpoints);
    if(player_build.assigned_skillpoints > levelToSkillPoints(player_build.level)){
        setHTML("summary-box", "Summary: Assigned "+player_build.assigned_skillpoints+" skillpoints.<br>" + "WARNING: Too many skillpoints need to be assigned!<br> For level " + player_build.level + ", there are only " + levelToSkillPoints(player_build.level) + " skill points available.");
    }else{
        setText("summary-box", "Summary: Assigned "+player_build.assigned_skillpoints+" skillpoints.");
    }

    displayExpandedItem(expandItem(player_build.helmet), "build-helmet");
    displayExpandedItem(expandItem(player_build.chestplate), "build-chestplate");
    displayExpandedItem(expandItem(player_build.leggings), "build-leggings");
    displayExpandedItem(expandItem(player_build.boots), "build-boots");
    displayExpandedItem(expandItem(player_build.ring1), "build-ring1");
    displayExpandedItem(expandItem(player_build.ring2), "build-ring2");
    displayExpandedItem(expandItem(player_build.bracelet), "build-bracelet");
    displayExpandedItem(expandItem(player_build.necklace), "build-necklace");
    displayExpandedItem(expandItem(player_build.weapon), "build-weapon");

    calculateBuildStats();
}

function calculateBuildStats() {
    let meleeStats = player_build.getMeleeStats();
    //nDamAdj,eDamAdj,tDamAdj,wDamAdj,fDamAdj,aDamAdj,totalDamNorm,totalDamCrit,normDPS,critDPS,avgDPS
    for (let i = 0; i < 6; ++i) {
        for (let j in meleeStats[i]) {
            meleeStats[i][j] = Math.round(meleeStats[i][j]);
        }
    }
    for (let i = 6; i < 8; ++i) {
        for (let j in meleeStats[i]) {
            meleeStats[i][j] = Math.round(meleeStats[i][j]);
        }
    }
    let meleeSummary = "";
    meleeSummary = meleeSummary.concat("<h1><u>Melee Stats</u></h1>");
    meleeSummary = meleeSummary.concat("<h2>Average DPS: ",Math.round(meleeStats[10]),"</h2> <br>");
    let attackSpeeds = ["SUPER SLOW", "VERY SLOW", "SLOW", "NORMAL", "FAST", "VERY FAST", "SUPER FAST"];
    meleeSummary = meleeSummary.concat("<b>Attack Speed: ",attackSpeeds[meleeStats[11]],"</b><br><br>");
    meleeSummary = meleeSummary.concat("<b>Non-Crit Stats: </b><br>");
    let damagePrefixes = ["Neutral Damage: ","Earth Damage: ","Thunder Damage: ","Water Damage: ","Fire Damage: ","Air Damage: "];
    for (let i = 0; i < 6; i++){
        if(meleeStats[i][0] > 0){
            meleeSummary = meleeSummary.concat(damagePrefixes[i],meleeStats[i][0]," -> ",meleeStats[i][1],"<br>");
        }
    }
    meleeSummary = meleeSummary.concat("<br>Total Damage: ",meleeStats[6][0]," -> ",meleeStats[6][1],"<br>");
    meleeSummary = meleeSummary.concat("Normal DPS: ",Math.round(meleeStats[8]),"<br><br>");
    meleeSummary = meleeSummary.concat("<b>Crit Stats: </b><br>");
    for (let i = 0; i < 6; i++){
        if(meleeStats[i][2] > 0){
            meleeSummary = meleeSummary.concat(damagePrefixes[i],meleeStats[i][2]," -> ",meleeStats[i][3],"<br>");
        }
    }
    meleeSummary = meleeSummary.concat("<br>Total Damage: ",meleeStats[7][0]," -> ",meleeStats[7][1],"<br>");
    meleeSummary = meleeSummary.concat("Crit DPS: ",Math.round(meleeStats[9]),"<br><br>");
    setHTML("build-melee-stats", "".concat(meleeSummary)); //basically complete function
    let defenseStats = "";

    setHTML("build-defense-stats", "".concat(defenseStats));
    location.hash = encodeBuild();
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

