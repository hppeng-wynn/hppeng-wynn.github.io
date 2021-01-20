const url_base = location.href.split("#")[0];
const url_tag = location.hash.slice(1);
console.log(url_base);
console.log(url_tag);

const BUILD_VERSION = "6.9.7";

function setTitle() {
    document.getElementById("header").textContent = "WynnBuilder version "+BUILD_VERSION+" (db version "+DB_VERSION+")";
    document.getElementById("header").classList.add("funnynumber");
}

setTitle();

let player_build;
// Set up item lists for quick access later.
let armorTypes = [ "helmet", "chestplate", "leggings", "boots" ];
let accessoryTypes = [ "ring", "bracelet", "necklace" ];
let weaponTypes = [ "wand", "spear", "bow", "dagger", "relik" ];
// THIS IS SUPER DANGEROUS, WE SHOULD NOT BE KEEPING THIS IN SO MANY PLACES
let item_fields = [ "name", "displayName", "tier", "set", "slots", "type", "material", "drop", "quest", "restrict", "nDam", "fDam", "wDam", "aDam", "tDam", "eDam", "atkSpd", "hp", "fDef", "wDef", "aDef", "tDef", "eDef", "lvl", "classReq", "strReq", "dexReq", "intReq", "defReq", "agiReq", "hprPct", "mr", "sdPct", "mdPct", "ls", "ms", "xpb", "lb", "ref", "str", "dex", "int", "agi", "def", "thorns", "expd", "spd", "atkTier", "poison", "hpBonus", "spRegen", "eSteal", "hprRaw", "sdRaw", "mdRaw", "fDamPct", "wDamPct", "aDamPct", "tDamPct", "eDamPct", "fDefPct", "wDefPct", "aDefPct", "tDefPct", "eDefPct", "fixID", "category", "spPct1", "spRaw1", "spPct2", "spRaw2", "spPct3", "spRaw3", "spPct4", "spRaw4", "rainbowRaw", "sprint", "sprintReg", "jh", "lq", "gXp", "gSpd", "id" ];
let editable_item_fields = [ "sdPct", "sdRaw", "mdPct", "mdRaw", "poison", "fDamPct", "wDamPct", "aDamPct", "tDamPct", "eDamPct", "fDefPct", "wDefPct", "aDefPct", "tDefPct", "eDefPct", "hprRaw", "hprPct", "hpBonus", "atkTier", "spPct1", "spRaw1", "spPct2", "spRaw2", "spPct3", "spRaw3", "spPct4", "spRaw4" ];

let editable_elems = [];

for (let i of editable_item_fields) {
    let elem = document.getElementById(i);
    elem.addEventListener("change", (event) => {
        elem.classList.add("highlight");
    });
    editable_elems.push(elem);
}

for (let i of skp_order) {
    let elem = document.getElementById(i+"-skp");
    elem.addEventListener("change", (event) => {
        elem.classList.add("highlight");
    });
    editable_elems.push(elem);
}

function clear_highlights() {
    for (let i of editable_elems) {
        i.classList.remove("highlight");
    }
}


let equipment_fields = [
    "helmet",
    "chestplate",
    "leggings",
    "boots",
    "ring1",
    "ring2",
    "bracelet",
    "necklace",
    "weapon"
];
let equipment_names = [
    "Helmet",
    "Chestplate",
    "Leggings",
    "Boots",
    "Ring 1",
    "Ring 2",
    "Bracelet",
    "Necklace",
    "Weapon"
];
let equipmentInputs = equipment_fields.map(x => x + "-choice");
let buildFields = equipment_fields.map(x => "build-"+x);

let powderIDs = new Map();
let powderNames = new Map();
let _powderID = 0;
for (const x of skp_elements) {
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
class Powder {
    constructor(min, max, convert, defPlus, defMinus) {
        this.min = min;
        this.max = max;
        this.convert = convert;
        this.defPlus = defPlus;
        this.defMinus = defMinus;
    }
}
function _p(a,b,c,d,e) { return new Powder(a,b,c,d,e); } //bruh moment

let powderStats = [
    _p(3,6,17,2,1), _p(6,9,21,4,2), _p(8,14,25,8,3), _p(11,16,31,14,5), _p(15,18,38,22,9), _p(18,22,46,30,13),
    _p(1,8,9,3,1), _p(1,13,11,5,1), _p(2,18,14,9,2), _p(3,24,17,14,4), _p(3,32,22,20,7), _p(5,40,28,28,10),
    _p(3,4,13,3,1), _p(4,7,15,6,1), _p(6,10,17,11,2), _p(8,12,21,18,4), _p(11,14,26,28,7), _p(13,17,32,40,10),
    _p(2,5,14,3,1), _p(4,8,16,5,2), _p(6,10,19,9,3), _p(9,13,24,16,5), _p(12,16,30,25,9), _p(15,19,37,36,13),
    _p(2,6,11,3,1), _p(4,9,14,6,2), _p(7,10,17,10,3), _p(9,13,22,16,5), _p(13,18,28,24,9), _p(16,18,35,34,13)
];

//Ordering: [weapon special name, weapon special effects, armor special name, armor special effects]
class PowderSpecial{
    constructor(wSpName, wSpEff, aSpName, aSpEff, cap){
        this.weaponSpecialName = wSpName;
        this.weaponSpecialEffects = wSpEff;
        this.armorSpecialName = aSpName;
        this.armorSpecialEffects = aSpEff;
        this.cap = cap;
    }
}
function _ps(a,b,c,d,e) { return new PowderSpecial(a,b,c,d,e); } //bruh moment

let powderSpecialStats = [
    _ps("Quake",new Map([["Radius",[5,5.5,6,6.5,7]], ["Damage",[155,220,285,350,415]] ]),"Rage",new Map([ ["Damage", [0.3,0.4,0.5,0.7,1.0]],["Description", "% " + "\u2764" + " Missing"] ]),400), //e
    _ps("Chain Lightning",new Map([ ["Chains", [5,6,7,8,9]], ["Damage", [200,225,250,275,300]] ]),"Kill Streak",new Map([ ["Damage", [3,4.5,6,7.5,9]],["Duration", [5,5,5,5,5]],["Description", "Mob Killed"] ]),200), //t
    _ps("Curse",new Map([ ["Duration", [7,7.5,8,8.5,9]],["Damage Boost", [90,120,150,180,210]] ]),"Concentration",new Map([ ["Damage", [1,2,3,4,5]],["Duration",[1,1,1,1,1]],["Description", "Mana Used"] ]),150), //w
    _ps("Courage",new Map([ ["Duration", [6,6.5,7,7.5,8]],["Damage", [75,87.5,100,112.5,125]],["Damage Boost", [70,90,110,130,150]] ]),"Endurance",new Map([ ["Damage", [2,3,4,5,6]],["Duration", [8,8,8,8,8]],["Description", "Hit Taken"] ]),200), //f
    _ps("Air Prison",new Map([ ["Duration", [3,3.5,4,4.5,5]],["Damage Boost", [400,450,500,550,600]],["Knockback", [8,12,16,20,24]] ]),"Dodge",new Map([ ["Damage",[2,3,4,5,6]],["Duration",[2,3,4,5,6]],["Description","Near Mobs"] ]),150) //a
];

let itemTypes = armorTypes.concat(accessoryTypes).concat(weaponTypes);
let itemLists = new Map();
for (const it of itemTypes) {
    itemLists.set(it, []);
}
let itemMap = new Map();
/* Mapping from item names to set names. */
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
        ["weapon", "dagger", "No Weapon"],
    ];
    for (let i = 0; i < 9; i++) {
        let item = Object();
        item.slots = 0;
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
        if (noneItems.includes(item)) {
            idMap.set(item.id, "");
        }
        else {
            idMap.set(item.id, item.displayName);
        }
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

    decodeBuild(url_tag);
}

/*
 * Populate fields based on url, and calculate build.
 */
function decodeBuild(url_tag) {
    if (url_tag) {
        let equipment = [null, null, null, null, null, null, null, null, null];
        let powdering = ["", "", "", "", ""];
        let info = url_tag.split("_");
        let version = info[0];
        let save_skp = false;
        let skillpoints = [0, 0, 0, 0, 0];
        let level = 106;
        if (version === "0" || version === "1" || version === "2" || version === "3") {
            let equipments = info[1];
            for (let i = 0; i < 9; ++i ) {
                equipment[i] = idMap.get(Base64.toInt(equipments.slice(i*3,i*3+3)));
            }
        }
        if (version === "1") {
            let powder_info = info[1].slice(27);
            console.log(powder_info);
            // TODO: Make this run in linear instead of quadratic time... ew
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
        if (version === "2") {
            save_skp = true;
            let skillpoint_info = info[1].slice(27, 37);
            for (let i = 0; i < 5; ++i ) {
                skillpoints[i] = Base64.toIntSigned(skillpoint_info.slice(i*2,i*2+2));
            }

            let powder_info = info[1].slice(37);
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
        if(version === "3"){
            level = Base64.toInt(info[1].slice(37,39));
            setValue("level-choice",level);
            save_skp = true;
            let skillpoint_info = info[1].slice(27, 37);
            for (let i = 0; i < 5; ++i ) {
                skillpoints[i] = Base64.toIntSigned(skillpoint_info.slice(i*2,i*2+2));
            }

            let powder_info = info[1].slice(39);
            // TODO: Make this run in linear instead of quadratic time...
            for (let i = 0; i < 5; ++i) {
                let powders = "";
                let n_blocks = Base64.toInt(powder_info.charAt(0));
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
        for (let i in powderInputs) {
            setValue(powderInputs[i], powdering[i]);
        }
        for (let i in equipment) {
            setValue(equipmentInputs[i], equipment[i]);
        }
        calculateBuild(save_skp, skillpoints);
    }
}

/*  Stores the entire build in a string using B64 encryption and adds it to the URL.
*/
function encodeBuild() {
    if (player_build) {
        let build_string = "3_" + Base64.fromIntN(player_build.helmet.get("id"), 3) +
                            Base64.fromIntN(player_build.chestplate.get("id"), 3) +
                            Base64.fromIntN(player_build.leggings.get("id"), 3) +
                            Base64.fromIntN(player_build.boots.get("id"), 3) +
                            Base64.fromIntN(player_build.ring1.get("id"), 3) +
                            Base64.fromIntN(player_build.ring2.get("id"), 3) +
                            Base64.fromIntN(player_build.bracelet.get("id"), 3) +
                            Base64.fromIntN(player_build.necklace.get("id"), 3) +
                            Base64.fromIntN(player_build.weapon.get("id"), 3);

        for (const skp of skp_order) {
            build_string += Base64.fromIntN(getValue(skp + "-skp"), 2); // Maximum skillpoints: 2048
        }
        build_string += Base64.fromIntN(player_build.level, 2);
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

function calculateBuild(save_skp, skp){
    try {
        let specialNames = ["Quake", "Chain_Lightning", "Curse", "Courage", "Air_Prison"];
        for (const sName of specialNames) {
            for (let i = 1; i < 6; i++) {
                let elem = document.getElementById(sName + "-" + i);
                let name = sName.replace("_", " ");
                if (elem.classList.contains("toggleOn")) { //toggle the pressed button off
                    elem.classList.remove("toggleOn");
                    let special = powderSpecialStats[specialNames.indexOf(sName)];
                    console.log(special);
                    if (special["weaponSpecialEffects"].has("Damage Boost")) { 
                        if (name === "Courage" || name === "Curse") { //courage is universal damage boost
                            //player_build.damageMultiplier -= special.weaponSpecialEffects.get("Damage Boost")[i-1]/100;
                            player_build.externalStats.set("sdPct", player_build.externalStats.get("sdPct") - special.weaponSpecialEffects.get("Damage Boost")[i-1]);
                            player_build.externalStats.set("mdPct", player_build.externalStats.get("mdPct") - special.weaponSpecialEffects.get("Damage Boost")[i-1]);
                            player_build.externalStats.set("poisonPct", player_build.externalStats.get("poisonPct") - special.weaponSpecialEffects.get("Damage Boost")[i-1]);
                        } else if (name === "Air Prison") {
                            player_build.externalStats.set("aDamPct", player_build.externalStats.get("aDamPct") - special.weaponSpecialEffects.get("Damage Boost")[i-1]);
                            player_build.externalStats.get("damageBonus")[4] -= special.weaponSpecialEffects.get("Damage Boost")[i-1];
                        }
                    }
                }
            }
        }
        if(player_build){
            updateBoosts("skip", false);
            updatePowderSpecials("skip", false);
        }
        //updatePowderSpecials("skip"); //jank pt 1
        save_skp = (typeof save_skp !== 'undefined') ?  save_skp : false;
        /*  TODO: implement level changing
            Make this entire function prettier
        */
        let equipment = [ null, null, null, null, null, null, null, null, null ];
        for (let i in equipment) {
            let equip = getValue(equipmentInputs[i]);
            if (equip === "") equip = "No " + equipment_names[i];
            equipment[i] = equip;
        }
        let powderings = [];
        let errors = [];
        for (const i in powderInputs) {
            // read in two characters at a time.
            // TODO: make this more robust.
            let input = getValue(powderInputs[i]);
            let powdering = [];
            let errorederrors = [];
            while (input) {
                let first = input.slice(0, 2);
                let powder = powderIDs.get(first);
                console.log(powder);
                if (powder === undefined) {
                    errorederrors.push(first);
                } else {
                    powdering.push(powder);
                }
                input = input.slice(2);
            }
            if (errorederrors.length > 0) {
                if (errorederrors.length > 1)
                    errors.push(new IncorrectInput(errorederrors.join(""), "t6w6", powderInputs[i]));
                else
                    errors.push(new IncorrectInput(errorederrors[0], "t6 or e3", powderInputs[i]));
            }
            console.log("POWDERING" + powdering);
            powderings.push(powdering);
        }
        
        console.log(equipment);
        player_build = new Build(document.getElementById("level-choice").value, equipment, powderings, new Map(), errors);

        for (let i of document.getElementsByClassName("hide-container-block")) {
			i.style.display = "block";
        }
        for (let i of document.getElementsByClassName("hide-container-grid")) {
			i.style.display = "grid";
        }

        console.log(player_build.toString());
        displayEquipOrder(document.getElementById("build-order"),player_build.equip_order);

        

        const assigned = player_build.base_skillpoints;
        const skillpoints = player_build.total_skillpoints;
        for (let i in skp_order){ //big bren
            setText(skp_order[i] + "-skp-base", "Original Value: " + skillpoints[i]);
        }

        for (let id of editable_item_fields) {
            setValue(id, player_build.statMap.get(id));
            setText(id+"-base", "Original Value: " + player_build.statMap.get(id));
        }
        
        if (save_skp) {
            // TODO: reduce duplicated code, @updateStats
            let skillpoints = player_build.total_skillpoints;
            let delta_total = 0;
            for (let i in skp_order) {
                let manual_assigned = skp[i];
                let delta = manual_assigned - skillpoints[i];
                skillpoints[i] = manual_assigned;
                player_build.base_skillpoints[i] += delta;
                delta_total += delta;
            }
            player_build.assigned_skillpoints += delta_total;
        }
        
        calculateBuildStats();
        setTitle();
        if (player_build.errored)
            throw new ListError(player_build.errors);

    }
    catch (error) {
        if (error instanceof ListError) {
            for (let i of error.errors) {
                if (i instanceof ItemNotFound) {
                    i.element.textContent = i.message;
                } else if (i instanceof IncorrectInput) {
                    if (document.getElementById(i.id) !== null) {
                        document.getElementById(i.id).parentElement.querySelectorAll("p.error")[0].textContent = i.message;
                    }
                } else {
                    let msg = i.stack;
                    let lines = msg.split("\n");
                    let header = document.getElementById("header");
                    header.textContent = "";
                    for (const line of lines) {
                        let p = document.createElement("p");
                        p.classList.add("itemp");
                        p.textContent = line;
                        header.appendChild(p);
                    }
                    let p2 = document.createElement("p");
                    p2.textContent = "If you believe this is an error, contact hppeng on forums or discord.";
                    header.appendChild(p2);
                }
            }
        } else {
            let msg = error.stack;
            let lines = msg.split("\n");
            let header = document.getElementById("header");
            header.textContent = "";
            for (const line of lines) {
                let p = document.createElement("p");
                p.classList.add("itemp");
                p.textContent = line;
                header.appendChild(p);
            }
            let p2 = document.createElement("p");
            p2.textContent = "If you believe this is an error, contact hppeng on forums or discord.";
            header.appendChild(p2);
        }
    }
}

/* Updates all build statistics based on (for now) the skillpoint input fields and then calculates build stats.
*/
function updateStats() {
    
    let specialNames = ["Quake", "Chain_Lightning", "Curse", "Courage", "Air_Prison"];
    for (const sName of specialNames) {
        for (let i = 1; i < 6; i++) {
            let elem = document.getElementById(sName + "-" + i);
            let name = sName.replace("_", " ");
            if (elem.classList.contains("toggleOn")) { //toggle the pressed button off
                elem.classList.remove("toggleOn");
                let special = powderSpecialStats[specialNames.indexOf(sName)];
                console.log(special);
                if (special["weaponSpecialEffects"].has("Damage Boost")) { 
                    if (name === "Courage" || name === "Curse") { //courage is universal damage boost
                        //player_build.damageMultiplier -= special.weaponSpecialEffects.get("Damage Boost")[i-1]/100;
                        player_build.externalStats.set("sdPct", player_build.externalStats.get("sdPct") - special.weaponSpecialEffects.get("Damage Boost")[i-1]);
                        player_build.externalStats.set("mdPct", player_build.externalStats.get("mdPct") - special.weaponSpecialEffects.get("Damage Boost")[i-1]);
                        player_build.externalStats.set("poisonPct", player_build.externalStats.get("poisonPct") - special.weaponSpecialEffects.get("Damage Boost")[i-1]);
                    }  else if (name === "Air Prison") {
                        player_build.externalStats.set("aDamPct", player_build.externalStats.get("aDamPct") - special.weaponSpecialEffects.get("Damage Boost")[i-1]);
                        player_build.externalStats.get("damageBonus")[4] -= special.weaponSpecialEffects.get("Damage Boost")[i-1];
                    }
                }
            }
        }
    }
    

    //WILL BREAK WEBSITE IF NO BUILD HAS BEEN INITIALIZED! @HPP
    let skillpoints = player_build.total_skillpoints;
    let delta_total = 0;
    for (let i in skp_order) {
        let value = document.getElementById(skp_order[i] + "-skp").value;
        let manual_assigned = 0;
        if (value.includes("+")) {
            let skp = value.split("+");
            for (const s of skp) {
                manual_assigned += parseInt(s,10);
            }
        }  else {
            manual_assigned = parseInt(value,10);
        }
        let delta = manual_assigned - skillpoints[i];
        skillpoints[i] = manual_assigned;
        player_build.base_skillpoints[i] += delta;
        delta_total += delta;
    }
    player_build.assigned_skillpoints += delta_total;
    if(player_build){
        updatePowderSpecials("skip", false);
        updateBoosts("skip", false);
    }
    for (let id of editable_item_fields) {
        player_build.statMap.set(id, parseInt(getValue(id)));
    }
    player_build.aggregateStats();
    console.log(player_build.statMap);
    calculateBuildStats();
}
/* Updates all spell boosts
*/
function updateBoosts(buttonId, recalcStats) {
    let elem = document.getElementById(buttonId);
    let name = buttonId.split("-")[0];
    if(buttonId !== "skip") {
        if (elem.classList.contains("toggleOn")) {
            player_build.damageMultiplier -= damageMultipliers.get(name);
            if (name === "warscream") {
                player_build.defenseMultiplier -= .20;
            }
            elem.classList.remove("toggleOn");
        }else{
            player_build.damageMultiplier += damageMultipliers.get(name);
            if (name === "warscream") {
                player_build.defenseMultiplier += .20;
            }
            elem.classList.add("toggleOn");
        }
        updatePowderSpecials("skip", false); //jank pt 1
    } else {
        for (const [key, value] of damageMultipliers) {
            let elem = document.getElementById(key + "-boost")
            if (elem.classList.contains("toggleOn")) {
                elem.classList.remove("toggleOn");
                player_build.damageMultiplier -= value;
                if (key === "warscream") { player_build.defenseMultiplier -= .20 }
            }
        }
    }
    if (recalcStats) {
        calculateBuildStats();
    }
}

/* Updates all powder special boosts 
*/
function updatePowderSpecials(buttonId, recalcStats) {
    //console.log(player_build.statMap);
   
    let name = (buttonId).split("-")[0];
    let power = (buttonId).split("-")[1]; // [1, 5]
    let specialNames = ["Quake", "Chain Lightning", "Curse", "Courage", "Air Prison"];
    let powderSpecials = []; // [ [special, power], [special, power]]
    

    if(name !== "skip"){
        let elem = document.getElementById(buttonId);
        if (elem.classList.contains("toggleOn")) { //toggle the pressed button off
            elem.classList.remove("toggleOn");
            let special = powderSpecialStats[specialNames.indexOf(name.replace("_", " "))];
            if (special.weaponSpecialEffects.has("Damage Boost")) { 
                name = name.replace("_", " ");
                if (name === "Courage" || name === "Curse") { //courage and curse are universal damage boost
                    player_build.externalStats.set("sdPct", player_build.externalStats.get("sdPct") - special.weaponSpecialEffects.get("Damage Boost")[power-1]);
                    player_build.externalStats.set("mdPct", player_build.externalStats.get("mdPct") - special.weaponSpecialEffects.get("Damage Boost")[power-1]);
                    player_build.externalStats.set("poisonPct", player_build.externalStats.get("poisonPct") - special.weaponSpecialEffects.get("Damage Boost")[power-1]);
                    //poison?
                } else if (name === "Air Prison") {
                    player_build.externalStats.set("aDamPct", player_build.externalStats.get("aDamPct") - special.weaponSpecialEffects.get("Damage Boost")[power-1]);
                    player_build.externalStats.get("damageBonus")[4] -= special.weaponSpecialEffects.get("Damage Boost")[power-1];
                }
            }
        } else {
            for (let i = 1;i < 6; i++) { //toggle all pressed buttons of the same powder special off
                //name is same, power is i
                if(document.getElementById(name.replace(" ", "_") + "-" + i).classList.contains("toggleOn")) {
                    document.getElementById(name.replace(" ", "_") + "-" + i).classList.remove("toggleOn");
                    let special = powderSpecialStats[specialNames.indexOf(name.replace("_", " "))];
                    if (special.weaponSpecialEffects.has("Damage Boost")) { 
                        name = name.replace("_", " "); //might be redundant
                        if (name === "Courage" || name === "Curse") { //courage is universal damage boost
                            //player_build.damageMultiplier -= special.weaponSpecialEffects.get("Damage Boost")[i-1]/100;
                            player_build.externalStats.set("sdPct", player_build.externalStats.get("sdPct") - special.weaponSpecialEffects.get("Damage Boost")[i-1]);
                            player_build.externalStats.set("mdPct", player_build.externalStats.get("mdPct") - special.weaponSpecialEffects.get("Damage Boost")[i-1]);
                            player_build.externalStats.set("poisonPct", player_build.externalStats.get("poisonPct") - special.weaponSpecialEffects.get("Damage Boost")[i-1]);
                        } else if (name === "Air Prison") {
                            player_build.externalStats.set("aDamPct", player_build.externalStats.get("aDamPct") - special.weaponSpecialEffects.get("Damage Boost")[i-1]);
                            player_build.externalStats.get("damageBonus")[4] -= special.weaponSpecialEffects.get("Damage Boost")[i-1];
                        }
                    }
                }
            }
            //toggle the pressed button on
            elem.classList.add("toggleOn"); 
        }
    }
   
    for (const sName of specialNames) {
        for (let i = 1;i < 6; i++) {
            if (document.getElementById(sName.replace(" ","_") + "-" + i).classList.contains("toggleOn")) {
                let powderSpecial = powderSpecialStats[specialNames.indexOf(sName.replace("_"," "))]; 
                powderSpecials.push([powderSpecial, i]);
                break;
            }   
        }
    }
    

    if (name !== "skip") {
        let elem = document.getElementById(buttonId);
        if (elem.classList.contains("toggleOn")) {
            let special = powderSpecialStats[specialNames.indexOf(name.replace("_", " "))];
            if (special["weaponSpecialEffects"].has("Damage Boost")) { 
                let name = special["weaponSpecialName"];
                if (name === "Courage" || name === "Curse") { //courage and curse are is universal damage boost
                    player_build.externalStats.set("sdPct", player_build.externalStats.get("sdPct") + special.weaponSpecialEffects.get("Damage Boost")[power-1]);
                    player_build.externalStats.set("mdPct", player_build.externalStats.get("mdPct") + special.weaponSpecialEffects.get("Damage Boost")[power-1]);
                    player_build.externalStats.set("poisonPct", player_build.externalStats.get("poisonPct") + special.weaponSpecialEffects.get("Damage Boost")[power-1]);
                } else if (name === "Air Prison") {
                    player_build.externalStats.set("aDamPct", player_build.externalStats.get("aDamPct") + special.weaponSpecialEffects.get("Damage Boost")[power-1]);
                    player_build.externalStats.get("damageBonus")[4] += special.weaponSpecialEffects.get("Damage Boost")[power-1];
                }
            }
        }
    }

    if (recalcStats) {
        calculateBuildStats();
    }
    displayPowderSpecials(document.getElementById("powder-special-stats"), powderSpecials, player_build); 
}
/* Calculates all build statistics and updates the entire display.
*/
function calculateBuildStats() {
    const assigned = player_build.base_skillpoints;
    const skillpoints = player_build.total_skillpoints;
    let skp_effects = ["% more damage dealt.","% chance to crit.","% spell cost reduction.","% less damage taken.","% chance to dodge."];
    for (let i in skp_order){ //big bren
        setText(skp_order[i] + "-skp-assign", "Manually Assigned: " + assigned[i]);
        setValue(skp_order[i] + "-skp", skillpoints[i]);
        let linebreak = document.createElement("br");
        linebreak.classList.add("itemp");
        document.getElementById(skp_order[i] + "-skp-label");
        setText(skp_order[i] + "-skp-pct", (skillPointsToPercentage(skillpoints[i])*100).toFixed(1).concat(skp_effects[i]));
        if (assigned[i] > 100) {
            let skp_warning = document.createElement("p");
            skp_warning.classList.add("warning");
            skp_warning.textContent += "WARNING: Cannot assign " + assigned[i] + " skillpoints in " + ["Strength","Dexterity","Intelligence","Defense","Agility"][i] + " manually.";
            document.getElementById(skp_order[i]+"-skp-pct").appendChild(skp_warning);
        }
    }

    let summarybox = document.getElementById("summary-box");
    summarybox.textContent = "";
    let skpRow = document.createElement("p");
    //skpRow.classList.add("left");
    let td = document.createElement("p");
    //td.classList.add("left");
    let skpSummary = document.createElement("b");
    skpSummary.textContent = "Assigned " + player_build.assigned_skillpoints + " skillpoints. Total: (";
    //skpSummary.classList.add("itemp");
    td.appendChild(skpSummary);
    for (let i = 0; i < skp_order.length; i++){
        let skp = document.createElement("b");
        let boost = document.createElement("b");
        skp.classList.add(damageClasses[i+1]);
        boost.textContent = player_build.total_skillpoints[i];
        if (i < 4) {
            boost.classList.add("space");
        }
        td.appendChild(skp);
        td.appendChild(boost);
    }
   
    let skpEnd = document.createElement("b");
    skpEnd.textContent = ")";
    td.appendChild(skpEnd);
    skpRow.append(td);

    let remainingSkp = document.createElement("p");
    remainingSkp.classList.add("center");
    let remainingSkpTitle = document.createElement("b");
    remainingSkpTitle.textContent = "Remaining skillpoints: ";
    let remainingSkpContent = document.createElement("b");
    //remainingSkpContent.textContent = "" + (levelToSkillPoints(player_build.level) - player_build.assigned_skillpoints < 0 ? "< 0" : levelToSkillPoints(player_build.level) - player_build.assigned_skillpoints);
    remainingSkpContent.textContent = "" + (levelToSkillPoints(player_build.level) - player_build.assigned_skillpoints);
    remainingSkpContent.classList.add(levelToSkillPoints(player_build.level) - player_build.assigned_skillpoints < 0 ? "negative" : "positive");

    remainingSkp.appendChild(remainingSkpTitle);
    remainingSkp.appendChild(remainingSkpContent);


    summarybox.append(skpRow);
    summarybox.append(remainingSkp);
    if(player_build.assigned_skillpoints > levelToSkillPoints(player_build.level)){
        let skpWarning = document.createElement("p");
        //skpWarning.classList.add("itemp");
        skpWarning.classList.add("warning");
        skpWarning.classList.add("itemp");
        skpWarning.textContent = "WARNING: Too many skillpoints need to be assigned!";
        let skpCount = document.createElement("p");
        skpCount.classList.add("itemp");
        skpCount.textContent = "For level " + (player_build.level>101 ? "101+" : player_build.level)  + ", there are only " + levelToSkillPoints(player_build.level) + " skill points available.";
        summarybox.append(skpWarning);
        summarybox.append(skpCount);
    }
    let lvlWarning;
    for (const item of player_build.items) {
        if (player_build.level < item.get("lvl")) {
            if (!lvlWarning) {
                lvlWarning = document.createElement("p");
                lvlWarning.classList.add("itemp");
                lvlWarning.classList.add("warning");
                lvlWarning.textContent = "WARNING: A level 50 player cannot use some piece(s) of this build."
            }
            let baditem = document.createElement("p"); 
                baditem.classList.add("nocolor");
                baditem.classList.add("itemp"); 
                baditem.textContent = item.get("name") + " requires level " + item.get("lvl") + " to use.";
                lvlWarning.appendChild(baditem);
        }
    }
    if(lvlWarning){
        summarybox.append(lvlWarning);
    }

    for (let i in player_build.items) {
        displayExpandedItem(player_build.items[i], buildFields[i]);
    }

    displayBuildStats("build-overall-stats",player_build);
    displaySetBonuses("set-info",player_build);
    displayNextCosts("int-info",player_build);

    let meleeStats = player_build.getMeleeStats();
    displayMeleeDamage(document.getElementById("build-melee-stats"), document.getElementById("build-melee-statsAvg"), meleeStats);

    displayDefenseStats(document.getElementById("build-defense-stats"),player_build);

    displayPoisonDamage(document.getElementById("build-poison-stats"),player_build);

    let spells = spell_table[player_build.weapon.get("type")];
    for (let i = 0; i < 4; ++i) {
        let parent_elem = document.getElementById("spell"+i+"-info");
        let overallparent_elem = document.getElementById("spell"+i+"-infoAvg");
        displaySpellDamage(parent_elem, overallparent_elem, player_build, spells[i], i+1);
    }

    location.hash = encodeBuild();
    clear_highlights();
}

function copyBuild() {
    if (player_build) {
        copyTextToClipboard(url_base+location.hash);
        document.getElementById("copy-button").textContent = "Copied!";
    }
}

function shareBuild() {
    if (player_build) {
        let text = url_base+location.hash+"\n"+
            "WynnBuilder build:\n"+
            "> "+player_build.helmet.get("displayName")+"\n"+
            "> "+player_build.chestplate.get("displayName")+"\n"+
            "> "+player_build.leggings.get("displayName")+"\n"+
            "> "+player_build.boots.get("displayName")+"\n"+
            "> "+player_build.ring1.get("displayName")+"\n"+
            "> "+player_build.ring2.get("displayName")+"\n"+
            "> "+player_build.bracelet.get("displayName")+"\n"+
            "> "+player_build.necklace.get("displayName")+"\n"+
            "> "+player_build.weapon.get("displayName")+" ["+player_build.weapon.get("powders").map(x => powderNames.get(x)).join("")+"]";
        copyTextToClipboard(text);
        document.getElementById("share-button").textContent = "Copied!";
    }
}

function resetFields(){
    for (let i in powderInputs) {
        setValue(powderInputs[i], "");
    }
    for (let i in equipmentInputs) {
        setValue(equipmentInputs[i], "");
    }
    setValue("str-skp", "0");
    setValue("dex-skp", "0");
    setValue("int-skp", "0");
    setValue("def-skp", "0");
    setValue("agi-skp", "0");
    setValue("level-choice", "");
    location.hash = "";
    calculateBuild();
}

function toggleID() {
    let button = document.getElementById("show-id-button");
    let targetDiv = document.getElementById("id-edit");
    if (button.classList.contains("toggleOn")) { //toggle the pressed button off
        targetDiv.style.display = "none";
        button.classList.remove("toggleOn");
    }
    else {
        targetDiv.style.display = "block";
        button.classList.add("toggleOn");
    }
}

load_init(init);

