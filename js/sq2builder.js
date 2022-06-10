const url_tag = location.hash.slice(1);
// console.log(url_base);
// console.log(url_tag);


const BUILD_VERSION = "7.0.19";

// function setTitle() {
//     let text;
//     if (url_base.includes("hppeng-wynn")) {
//         text = "WynnBuilder UNSTABLE version "+BUILD_VERSION+" (db version "+DB_VERSION+")";
//     }
//     else {
//         text = "WynnBuilder version "+BUILD_VERSION+" (db version "+DB_VERSION+")";
//         document.getElementById("header").classList.add("funnynumber");
//     }
//     document.getElementById("header").textContent = text;
// }
// 
// setTitle();

let player_build;


// THIS IS SUPER DANGEROUS, WE SHOULD NOT BE KEEPING THIS IN SO MANY PLACES
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
let tome_fields = [
    "weaponTome1",
    "weaponTome2",
    "armorTome1",
    "armorTome2",
    "armorTome3",
    "armorTome4",
    "guildTome1",
]
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

let tome_names = [
    "Weapon Tome",
    "Weapon Tome",
    "Armor Tome",
    "Armor Tome",
    "Armor Tome",
    "Armor Tome",
    "Guild Tome",
]
let equipmentInputs = equipment_fields.map(x => x + "-choice");
let buildFields = equipment_fields.map(x => x+"-tooltip").concat(tome_fields.map(x => x + "-tooltip"));
let tomeInputs = tome_fields.map(x => x + "-choice");

let powderInputs = [
    "helmet-powder",
    "chestplate-powder",
    "leggings-powder",
    "boots-powder",
    "weapon-powder",
];

function getItemNameFromID(id) {
    if (redirectMap.has(id)) {
        return getItemNameFromID(redirectMap.get(id));
    }
    return idMap.get(id);
}

function getTomeNameFromID(id) {
    if (tomeRedirectMap.has(id)) {
        return getTomeNameFromID(tomeRedirectMap.get(id));
    }
    return tomeIDMap.get(id);
}

function parsePowdering(powder_info) {
    // TODO: Make this run in linear instead of quadratic time... ew
    let powdering = [];
    for (let i = 0; i < 5; ++i) {
        let powders = "";
        let n_blocks = Base64.toInt(powder_info.charAt(0));
        powder_info = powder_info.slice(1);
        for (let j = 0; j < n_blocks; ++j) {
            let block = powder_info.slice(0,5);
            let six_powders = Base64.toInt(block);
            for (let k = 0; k < 6 && six_powders != 0; ++k) {
                powders += powderNames.get((six_powders & 0x1f) - 1);
                six_powders >>>= 5;
            }
            powder_info = powder_info.slice(5);
        }
        powdering[i] = powders;
    }
    return [powdering, powder_info];
}

/*
 * Populate fields based on url, and calculate build.
 */
function decodeBuild(url_tag) {
    if (url_tag) {
        //default values
        let equipment = [null, null, null, null, null, null, null, null, null];
        let tomes = [null, null, null, null, null, null, null];
        let powdering = ["", "", "", "", ""];
        let info = url_tag.split("_");
        let version = info[0];
        let save_skp = false;
        let skillpoints = [0, 0, 0, 0, 0];
        let level = 106;

        version_number = parseInt(version)
        //equipment (items)
        // TODO: use filters
        if (version_number < 4) {
            let equipments = info[1];
            for (let i = 0; i < 9; ++i ) {
                let equipment_str = equipments.slice(i*3,i*3+3);
                equipment[i] = getItemNameFromID(Base64.toInt(equipment_str));
            }
            info[1] = equipments.slice(27);
        }
        else if (version_number == 4) { 
            let info_str = info[1];
            let start_idx = 0;
            for (let i = 0; i < 9; ++i ) {
                if (info_str.charAt(start_idx) === "-") {
                    equipment[i] = "CR-"+info_str.slice(start_idx+1, start_idx+18);
                    start_idx += 18;
                }
                else {
                    let equipment_str = info_str.slice(start_idx, start_idx+3);
                    equipment[i] = getItemNameFromID(Base64.toInt(equipment_str));
                    start_idx += 3;
                }
            }
            info[1] = info_str.slice(start_idx);
        }
        else if (version_number <= 6) {
            let info_str = info[1];
            let start_idx = 0;
            for (let i = 0; i < 9; ++i ) {
                if (info_str.slice(start_idx,start_idx+3) === "CR-") {
                    equipment[i] = info_str.slice(start_idx, start_idx+20);
                    start_idx += 20;
                } else if (info_str.slice(start_idx+3,start_idx+6) === "CI-") {
                    let len = Base64.toInt(info_str.slice(start_idx,start_idx+3));
                    equipment[i] = info_str.slice(start_idx+3,start_idx+3+len);
                    start_idx += (3+len);
                } else {
                    let equipment_str = info_str.slice(start_idx, start_idx+3);
                    equipment[i] = getItemNameFromID(Base64.toInt(equipment_str));
                    start_idx += 3;
                }
            }
            info[1] = info_str.slice(start_idx);
        }
        //constant in all versions
        for (let i in equipment) {
            setValue(equipmentInputs[i], equipment[i]);
        }

        //level, skill point assignments, and powdering
        if (version_number == 1) {
            let powder_info = info[1];
            let res = parsePowdering(powder_info);
            powdering = res[0];
        } else if (version_number == 2) {
            save_skp = true;
            let skillpoint_info = info[1].slice(0, 10);
            for (let i = 0; i < 5; ++i ) {
                skillpoints[i] = Base64.toIntSigned(skillpoint_info.slice(i*2,i*2+2));
            }

            let powder_info = info[1].slice(10);
            let res = parsePowdering(powder_info);
            powdering = res[0];
        } else if (version_number <= 6){
            level = Base64.toInt(info[1].slice(10,12));
            setValue("level-choice",level);
            save_skp = true;
            let skillpoint_info = info[1].slice(0, 10);
            for (let i = 0; i < 5; ++i ) {
                skillpoints[i] = Base64.toIntSigned(skillpoint_info.slice(i*2,i*2+2));
            }

            let powder_info = info[1].slice(12);

            let res = parsePowdering(powder_info);
            powdering = res[0];
            info[1] = res[1];
        }
        // Tomes.
        if (version == 6) {
            //tome values do not appear in anything before v6.
            for (let i = 0; i < 7; ++i) {
                let tome_str = info[1].charAt(i);
                setValue(tomeInputs[i], getTomeNameFromID(Base64.toInt(tome_str)));
            }
            info[1] = info[1].slice(7);
        }

        for (let i in powderInputs) {
            setValue(powderInputs[i], powdering[i]);
        }

        calculateBuild(save_skp, skillpoints);
    }
}

/*  Stores the entire build in a string using B64 encoding and adds it to the URL.
*/
function encodeBuild() {

    if (player_build) {
        let build_string;
        
        //V6 encoding - Tomes
        build_version = 4;
        build_string = "";
        tome_string = "";

        let crafted_idx = 0;
        let custom_idx = 0;
        for (const item of player_build.items) {
            
            if (item.get("custom")) {
                let custom = "CI-"+encodeCustom(player_build.customItems[custom_idx],true);
                build_string += Base64.fromIntN(custom.length, 3) + custom;
                custom_idx += 1;
                build_version = Math.max(build_version, 5);
            } else if (item.get("crafted")) {
                build_string += "CR-"+encodeCraft(player_build.craftedItems[crafted_idx]);
                crafted_idx += 1;
            } else if (item.get("category") === "tome") {
                let tome_id = item.get("id");
                if (tome_id <= 60) {
                    // valid normal tome. ID 61-63 is for NONE tomes.
                    build_version = Math.max(build_version, 6);
                }
                tome_string += Base64.fromIntN(tome_id, 1);
            } else {
                build_string += Base64.fromIntN(item.get("id"), 3);
            }
        }

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
        build_string += tome_string;

        return build_version.toString() + "_" + build_string;
    }
}

function calculateBuild(save_skp, skp){
    try {
        resetEditableIDs();
        if (player_build) {
            reset_powder_specials();
            updateBoosts("skip", false);
            updatePowderSpecials("skip", false);
        }
        let weaponName = getValue(equipmentInputs[8]);
        //bruh @hpp
        if (weaponName.startsWith("Morph-")) {
            let equipment = [ "Morph-Stardust", "Morph-Steel", "Morph-Iron", "Morph-Gold", "Morph-Topaz", "Morph-Emerald", "Morph-Amethyst", "Morph-Ruby", weaponName.substring(6) ];
            for (let i in equipment) {
                setValue(equipmentInputs[i], equipment[i]);
            }
        }

        //updatePowderSpecials("skip"); //jank pt 1
        save_skp = (typeof save_skp !== 'undefined') ?  save_skp : false;
        /*  TODO: implement level changing
            Make this entire function prettier
        */
        let equipment = [ null, null, null, null, null, null, null, null, null ];
        for (let i in equipment) {
            let equip = getValue(equipmentInputs[i]).trim();
            if (equip === "") {
                equip = "No " + equipment_names[i]
            }
            else {
                setValue(equipmentInputs[i], equip);
            }
            equipment[i] = equip;
        }
        let powderings = [];
        let errors = [];
        for (const i in powderInputs) {
            // read in two characters at a time.
            // TODO: make this more robust.
            let input = getValue(powderInputs[i]).trim();
            let powdering = [];
            let errorederrors = [];
            while (input) {
                let first = input.slice(0, 2);
                let powder = powderIDs.get(first);
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
            //console.log("POWDERING: " + powdering);
            powderings.push(powdering);
        }
        let tomes = [ null, null, null, null, null, null, null];
        for (let i in tomes) {
            let equip = getValue(tomeInputs[i]).trim();
            if (equip === "") {
                equip = "No " + tome_names[i]
            }
            else {
                setValue(tomeInputs[i], equip);
            }
            tomes[i] = equip;
        }
        

        let level = document.getElementById("level-choice").value;
        player_build = new Build(level, equipment, powderings, new Map(), errors, tomes);
        console.log(player_build);

        //isn't this deprecated?
        for (let i of document.getElementsByClassName("hide-container-block")) {
			i.style.display = "block";
        }
        for (let i of document.getElementsByClassName("hide-container-grid")) {
			i.style.display = "grid";
        }

        console.log(player_build.toString());
        displaysq2EquipOrder(document.getElementById("build-order"),player_build.equip_order);

        const assigned = player_build.base_skillpoints;
        const skillpoints = player_build.total_skillpoints;
        for (let i in skp_order){ //big bren
            setText(skp_order[i] + "-skp-base", "Original: " + skillpoints[i]);
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
        
        updateEditableIDs();
        calculateBuildStats();
        if (player_build.errored)
            throw new ListError(player_build.errors);
    }
    catch (error) {
        console.log(error);
    }
}

function handleBuilderError(error) {
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

/* Updates all build statistics based on (for now) the skillpoint input fields and then calculates build stats.
*/
function updateStats() {
    
    let specialNames = ["Quake", "Chain_Lightning", "Curse", "Courage", "Wind_Prison"];
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
                    }  else if (name === "Wind Prison") {
                        player_build.externalStats.set("aDamPct", player_build.externalStats.get("aDamPct") - special.weaponSpecialEffects.get("Damage Boost")[i-1]);
                        player_build.externalStats.get("damageBonus")[4] -= special.weaponSpecialEffects.get("Damage Boost")[i-1];
                    }
                }
            }
        }
    }
    

    
    let skillpoints = player_build.total_skillpoints;
    let delta_total = 0;
    for (let i in skp_order) {
        let value = document.getElementById(skp_order[i] + "-skp").value;
        if (value === ""){value = 0; setValue(skp_order[i] + "-skp", value)}
        let manual_assigned = 0;
        if (value.includes("+")) {
            let skp = value.split("+");
            for (const s of skp) {
                manual_assigned += parseInt(s,10);
            }
        } else {
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
        updateArmorPowderSpecials("skip", false);
        updateBoosts("skip", false);
        for (let id of editable_item_fields) {
            player_build.statMap.set(id, parseInt(getValue(id)));
        }
    }
    player_build.aggregateStats();
    console.log(player_build.statMap);
    calculateBuildStats();
}

 
/* Updates all IDs in the edit IDs section. Resets each input and original value text to the correct text according to the current build.
*/
function updateEditableIDs() {
    if (player_build) {
        for (const id of editable_item_fields) {
            let edit_input = document.getElementById(id);
            let val = player_build.statMap.get(id);
            edit_input.value = val;
            edit_input.placeholder = val;

            let value_label = document.getElementById(id + "-base");
            value_label.textContent = "Original Value: " + val;
            //a hack to make resetting easier
            value_label.value = val;
        }
    }
}

/* Resets all IDs in the edit IDs section to their "original" values. 
*/
function resetEditableIDs() {
    if (player_build) {
        for (const id of editable_item_fields) {
            let edit_input = document.getElementById(id);
            let value_label = document.getElementById(id + "-base");

            edit_input.value = value_label.value;
            edit_input.placeholder = value_label.value;
        }
    } else {
        //no player build, reset to 0
        for (const id of editable_item_fields) {
            let edit_input = document.getElementById(id);

            edit_input.value = 0;
            edit_input.placeholder = 0;
        }
    }
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
            if (name === "vanish") {
                player_build.defenseMultiplier -= .15;
            }
            elem.classList.remove("toggleOn");
        }else{
            player_build.damageMultiplier += damageMultipliers.get(name);
            if (name === "warscream") {
                player_build.defenseMultiplier += .20;
            }
            if (name === "vanish") {
                player_build.defenseMultiplier += .15;
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
                if (key === "vanish") { player_build.defenseMultiplier -= .15 }
            }
        }
    }
    if (recalcStats) {
        calculateBuildStats();
    }
}

/* Updates ACTIVE powder special boosts (weapons)
*/
function updatePowderSpecials(buttonId, recalcStats) {
    //console.log(player_build.statMap);
   
    let name = (buttonId).split("-")[0];
    let power = (buttonId).split("-")[1]; // [1, 5]
    let specialNames = ["Quake", "Chain Lightning", "Curse", "Courage", "Wind Prison"];
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
                } else if (name === "Wind Prison") {
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
                        } else if (name === "Wind Prison") {
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
                } else if (name === "Wind Prison") {
                    player_build.externalStats.set("aDamPct", player_build.externalStats.get("aDamPct") + special.weaponSpecialEffects.get("Damage Boost")[power-1]);
                    player_build.externalStats.get("damageBonus")[4] += special.weaponSpecialEffects.get("Damage Boost")[power-1];
                }
            }
        }
    }

    if (recalcStats) {
        calculateBuildStats();
    }
    displaysq2PowderSpecials(document.getElementById("powder-special-stats"), powderSpecials, player_build, true); 
}


/* Updates PASSIVE powder special boosts (armors)
*/
function updateArmorPowderSpecials(elem_id, recalc_stats) {
    //we only update the powder special + external stats if the player has a build
    if (elem_id !== "skip") {
        if (player_build !== undefined && player_build.weapon !== undefined && player_build.weapon.get("name") !== "No Weapon") {
            let wynn_elem = elem_id.split("_")[0]; //str, dex, int, def, agi

            //update the label associated w/ the slider 
            let elem = document.getElementById(elem_id);
            let label = document.getElementById(elem_id + "_label");
            let prev_label = document.getElementById(elem_id + "_prev");
    
            let value = elem.value;
    
            //for use in editing build stats
            let prev_value = prev_label.value;
            let value_diff = value - prev_value;
    
            //update the "previous" label
            prev_label.value = value;
    
            label.textContent = label.textContent.split(":")[0] + ": " + value;
            
            let dmg_id = elem_chars[skp_names.indexOf(wynn_elem)] + "DamPct"; 
            let new_dmgboost = player_build.externalStats.get(dmg_id) + value_diff;
            
            //update build external stats - the second one is the relevant one for damage calc purposes
            player_build.externalStats.set(dmg_id, new_dmgboost);
            player_build.externalStats.get("damageBonus")[skp_names.indexOf(wynn_elem)] = new_dmgboost;
            
            //update the slider's graphics
            let bg_color = elem_colors[skp_names.indexOf(wynn_elem)];
            let pct = Math.round(100 * value / powderSpecialStats[skp_names.indexOf(wynn_elem)].cap);
            elem.style.background = `linear-gradient(to right, ${bg_color}, ${bg_color} ${pct}%, #AAAAAA ${pct}%, #AAAAAA 100%)`;

        }
    } else {
        if (player_build !== undefined) {
            for (let i = 0; i < skp_names.length; ++i) {
                skp_name = skp_names[i];
                skp_char = elem_chars[i];
                player_build.externalStats.set(skp_char + "DamPct", player_build.externalStats.get(skp_char + "DamPct") - document.getElementById(skp_name+"_boost_armor").value);
                player_build.externalStats.get("damageBonus")[i] -= document.getElementById(skp_name+"_boost_armor").value;
            }
        }
    }
    

    if (recalc_stats && player_build) {
        //calc build stats and display powder special
        calculateBuildStats();
        // displaysq2PowderSpecials(document.getElementById("powder-special-stats"), powderSpecials, player_build, true); 
    }

}

function resetArmorPowderSpecials() {
    for (const skp of skp_names) {
        document.getElementById(skp + "_boost_armor").value = 0;
        document.getElementById(skp + "_boost_armor_prev").value = 0;
        document.getElementById(skp + "_boost_armor").style.background = `linear-gradient(to right, #AAAAAA, #AAAAAA 0%, #AAAAAA 100%)`;
        document.getElementById(skp + "_boost_armor_label").textContent = `% ${capitalizeFirst(elem_names[skp_names.indexOf(skp)])} Damage Boost: 0`
    }
}

/* Calculates all build statistics and updates the entire display.
*/
function calculateBuildStats() {
    const assigned = player_build.base_skillpoints;
    const skillpoints = player_build.total_skillpoints;
    let skp_effects = ["% more damage dealt.","% chance to crit.","% spell cost reduction.","% less damage taken.","% chance to dodge."];
    for (let i in skp_order){ //big bren
        setText(skp_order[i] + "-skp-assign", "Assign: " + assigned[i]);
        setValue(skp_order[i] + "-skp", skillpoints[i]);
        let linebreak = document.createElement("br");
        linebreak.classList.add("itemp");
        document.getElementById(skp_order[i] + "-skp-label");
        setText(skp_order[i] + "-skp-pct", (skillPointsToPercentage(skillpoints[i])*100).toFixed(1).concat(skp_effects[i]));
        document.getElementById(skp_order[i]+"-warnings").textContent = ''
        if (assigned[i] > 100) {
            let skp_warning = document.createElement("p");
            skp_warning.classList.add("warning");
            skp_warning.classList.add("small-text")
            skp_warning.textContent += "Cannot assign " + assigned[i] + " skillpoints in " + ["Strength","Dexterity","Intelligence","Defense","Agility"][i] + " manually.";
            document.getElementById(skp_order[i]+"-warnings").textContent = ''
            document.getElementById(skp_order[i]+"-warnings").appendChild(skp_warning);
        }
    }

    let summarybox = document.getElementById("summary-box");
    summarybox.textContent = "";
    let skpRow = document.createElement("p");

    let remainingSkp = document.createElement("p");
    remainingSkp.classList.add("scaled-font");
    let remainingSkpTitle = document.createElement("b");
    remainingSkpTitle.textContent = "Assigned " + player_build.assigned_skillpoints + " skillpoints. Remaining skillpoints: ";
    let remainingSkpContent = document.createElement("b");
    remainingSkpContent.textContent = "" + (levelToSkillPoints(player_build.level) - player_build.assigned_skillpoints);
    remainingSkpContent.classList.add(levelToSkillPoints(player_build.level) - player_build.assigned_skillpoints < 0 ? "negative" : "positive");

    remainingSkp.appendChild(remainingSkpTitle);
    remainingSkp.appendChild(remainingSkpContent);


    summarybox.append(skpRow);
    summarybox.append(remainingSkp);
    if(player_build.assigned_skillpoints > levelToSkillPoints(player_build.level)){
        let skpWarning = document.createElement("span");
        //skpWarning.classList.add("itemp");
        skpWarning.classList.add("warning");
        skpWarning.textContent = "WARNING: Too many skillpoints need to be assigned!";
        let skpCount = document.createElement("p");
        skpCount.classList.add("warning");
        skpCount.textContent = "For level " + (player_build.level>101 ? "101+" : player_build.level)  + ", there are only " + levelToSkillPoints(player_build.level) + " skill points available.";
        summarybox.append(skpWarning);
        summarybox.append(skpCount);
    }
    let lvlWarning;
    for (const item of player_build.items) {
        let item_lvl;
        if (item.get("crafted")) {
            //item_lvl = item.get("lvlLow") + "-" + item.get("lvl");
            item_lvl = item.get("lvlLow");
        }
        else {
            item_lvl = item.get("lvl");
        }

        if (player_build.level < item_lvl) {
            if (!lvlWarning) {
                lvlWarning = document.createElement("p");
                lvlWarning.classList.add("itemp");
                lvlWarning.classList.add("warning");
                lvlWarning.textContent = "WARNING: A level " + player_build.level + " player cannot use some piece(s) of this build."
            }
            let baditem = document.createElement("p"); 
                baditem.classList.add("nocolor");
                baditem.classList.add("itemp"); 
                baditem.textContent = item.get("displayName") + " requires level " + item.get("lvl") + " to use.";
                lvlWarning.appendChild(baditem);
        }
    }
    if(lvlWarning){
        summarybox.append(lvlWarning);
    }
    for (const [setName, count] of player_build.activeSetCounts) {
        const bonus = sets[setName].bonuses[count-1];
        // console.log(setName);
        if (bonus["illegal"]) {
            let setWarning = document.createElement("p");
            setWarning.classList.add("itemp");
            setWarning.classList.add("warning");
            setWarning.textContent = "WARNING: illegal item combination: " + setName
            summarybox.append(setWarning);
        }
    }

    for (let i in player_build.items) {
        displaysq2ExpandedItem(player_build.items[i], buildFields[i]);
        collapse_element("#"+equipment_keys[i]+"-tooltip");
    }

    displaysq2ArmorStats(player_build);
    displaysq2BuildStats('overall-stats', player_build, build_all_display_commands);
    displaysq2BuildStats("offensive-stats",player_build, build_offensive_display_commands);
    displaysq2SetBonuses("set-info",player_build);
    displaysq2WeaponStats(player_build);

    let meleeStats = player_build.getMeleeStats();
    displaysq2MeleeDamage(document.getElementById("build-melee-stats"), document.getElementById("build-melee-statsAvg"), meleeStats);

    displaysq2DefenseStats(document.getElementById("defensive-stats"),player_build);

    displaysq2PoisonDamage(document.getElementById("build-poison-stats"),player_build);

    let spells = spell_table[player_build.weapon.get("type")];
    for (let i = 0; i < 4; ++i) {
        let parent_elem = document.getElementById("spell"+i+"-info");
        let overallparent_elem = document.getElementById("spell"+i+"-infoAvg");
        displaysq2SpellDamage(parent_elem, overallparent_elem, player_build, spells[i], i+1);
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

function populateBuildList() {
    const buildList = document.getElementById("build-choice");
    const savedBuilds = window.localStorage.getItem("builds") === null ? {} : JSON.parse(window.localStorage.getItem("builds"));

    for (const buildName of Object.keys(savedBuilds).sort()) {
        const buildOption = document.createElement("option");
        buildOption.setAttribute("value", buildName);
        buildList.appendChild(buildOption);
    }
}

function saveBuild() {
    if (player_build) {
        const savedBuilds = window.localStorage.getItem("builds") === null ? {} : JSON.parse(window.localStorage.getItem("builds"));
        const saveName = document.getElementById("build-name").value;
        const encodedBuild = encodeBuild();
        if ((!Object.keys(savedBuilds).includes(saveName)
                || document.getElementById("saved-error").textContent !== "") && encodedBuild !== "") {
            savedBuilds[saveName] = encodedBuild.replace("#", "");
            window.localStorage.setItem("builds", JSON.stringify(savedBuilds));

            document.getElementById("saved-error").textContent = "";
            document.getElementById("saved-build").textContent = "Build saved locally";
            
            const buildList = document.getElementById("build-choice");
            const buildOption = document.createElement("option");
            buildOption.setAttribute("value", saveName);
            buildList.appendChild(buildOption);
        } else {
            document.getElementById("saved-build").textContent = "";
            if (encodedBuild === "") {
                document.getElementById("saved-error").textContent = "Empty build";
            }
            else {
                document.getElementById("saved-error").textContent = "Exists. Overwrite?";
            }
        }
    }
}

function loadBuild() {
    let savedBuilds = window.localStorage.getItem("builds") === null ? {} : JSON.parse(window.localStorage.getItem("builds"));
    let saveName = document.getElementById("build-name").value;

    if (Object.keys(savedBuilds).includes(saveName)) { 
        decodeBuild(savedBuilds[saveName])
        document.getElementById("loaded-error").textContent = "";
        document.getElementById("loaded-build").textContent = "Build loaded";
    } else {
        document.getElementById("loaded-build").textContent = "";
        document.getElementById("loaded-error").textContent = "Build doesn't exist";
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
    setValue("level-choice", "106");
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

function toggleButton(button_id) {
    let button = document.getElementById(button_id);
    if (button) {
        if (button.classList.contains("toggleOn")) {
            button.classList.remove("toggleOn");
        } else {
            button.classList.add("toggleOn");
        }
    }
}

function optimizeStrDex() {
    if (!player_build) {
        return;
    }
    const remaining = levelToSkillPoints(player_build.level) - player_build.assigned_skillpoints;
    const base_skillpoints = player_build.base_skillpoints;
    const max_str_boost = 100 - base_skillpoints[0];
    const max_dex_boost = 100 - base_skillpoints[1];
    if (Math.min(remaining, max_str_boost, max_dex_boost) < 0) return; // Unwearable

    const base_total_skillpoints = player_build.total_skillpoints;
    let str_bonus = remaining;
    let dex_bonus = 0;
    let best_skillpoints = player_build.total_skillpoints;
    let best_damage = 0;
    for (let i = 0; i <= remaining; ++i) {
        let total_skillpoints = base_total_skillpoints.slice();
        total_skillpoints[0] += Math.min(max_str_boost, str_bonus);
        total_skillpoints[1] += Math.min(max_dex_boost, dex_bonus);

        // Calculate total 3rd spell damage
        let spell = spell_table[player_build.weapon.get("type")][2];
        const stats = player_build.statMap;
        let critChance = skillPointsToPercentage(total_skillpoints[1]);
        let save_damages = [];
        let spell_parts;
        if (spell.parts) {
            spell_parts = spell.parts;
        }
        else {
            spell_parts = spell.variants.DEFAULT;
            for (const majorID of stats.get("activeMajorIDs")) {
                if (majorID in spell.variants) {
                    spell_parts = spell.variants[majorID];
                    break;
                }
            }
        }
        let total_damage = 0;
        for (const part of spell_parts) {
            if (part.type === "damage") {
                let _results = calculateSpellDamage(stats, part.conversion,
                                        stats.get("sdRaw"), stats.get("sdPct") + player_build.externalStats.get("sdPct"), 
                                        part.multiplier / 100, player_build.weapon, total_skillpoints,
                                        player_build.damageMultiplier, player_build.externalStats);
                let totalDamNormal = _results[0];
                let totalDamCrit = _results[1];
                let results = _results[2];
                let tooltipinfo = _results[3];
                
                for (let i = 0; i < 6; ++i) {
                    for (let j in results[i]) {
                        results[i][j] = results[i][j].toFixed(2);
                    }
                }
                let nonCritAverage = (totalDamNormal[0]+totalDamNormal[1])/2 || 0;
                let critAverage = (totalDamCrit[0]+totalDamCrit[1])/2 || 0;
                let averageDamage = (1-critChance)*nonCritAverage+critChance*critAverage || 0;

                save_damages.push(averageDamage);
                if (part.summary == true) {
                    total_damage = averageDamage;
                }
            } else if (part.type === "total") {
                total_damage = 0;
                for (let i in part.factors) {
                    total_damage += save_damages[i] * part.factors[i];
                }
            }
        }        // END Calculate total 3rd spell damage (total_damage)
        if (total_damage > best_damage) {
            best_damage = total_damage;
            best_skillpoints = total_skillpoints.slice();
        }

        str_bonus -= 1;
        dex_bonus += 1;
        
    }
    // TODO: reduce duplicated code, @calculateBuild
    let skillpoints = player_build.total_skillpoints;
    let delta_total = 0;
    for (let i in skp_order) {
        let manual_assigned = best_skillpoints[i];
        let delta = manual_assigned - skillpoints[i];
        skillpoints[i] = manual_assigned;
        player_build.base_skillpoints[i] += delta;
        delta_total += delta;
    }
    player_build.assigned_skillpoints += delta_total;
        
    try {
        calculateBuildStats();
        if (player_build.errored)
            throw new ListError(player_build.errors);
    }
    catch (error) {
        handleBuilderError(error);
    }
}

// TODO: Learn and use await
function init() {
    console.log("builder.js init");
    init_autocomplete();
    decodeBuild(url_tag);
    for (const i of equipment_keys) {
        update_field(i);
    }
}
function init2() {
    load_ing_init(init);
}
function init3() {
    load_tome_init(init2)
}


load_init(init3);
