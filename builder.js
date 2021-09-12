const url_tag = location.hash.slice(1);
// console.log(url_base);
// console.log(url_tag);


const BUILD_VERSION = "7.0.19";

function setTitle() {
    let text;
    if (url_base.includes("hppeng-wynn")) {
        text = "WynnBuilder UNSTABLE version "+BUILD_VERSION+" (db version "+DB_VERSION+")";
    }
    else {
        text = "WynnBuilder version "+BUILD_VERSION+" (db version "+DB_VERSION+")";
        document.getElementById("header").classList.add("funnynumber");
    }
    document.getElementById("header").textContent = text;
}

setTitle();

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

let powderInputs = [
    "helmet-powder",
    "chestplate-powder",
    "leggings-powder",
    "boots-powder",
    "weapon-powder",
];



/*
 * Function that takes an item list and populates its corresponding dropdown.
 * Used for armors and bracelet/necklace.
 */
function populateItemList(type) {
    let item_list = document.getElementById(type+"-items");
    for (const item of itemLists.get(type)) {
        let item_obj = itemMap.get(item);
        if (item_obj["restrict"] && item_obj["restrict"] === "DEPRECATED") {
            continue;
        }
        let el = document.createElement("option");
        el.value = item;
        item_list.appendChild(el);
    }
}

/*
 * Populate dropdowns, add listeners, etc.
 */
function init() {
    console.log("builder.js init");
    
    for (const armorType of armorTypes) {
        populateItemList(armorType);
        // Add change listener to update armor slots.
        document.getElementById(armorType+"-choice").addEventListener("change", (event) => {
            let item_name = event.target.value;
            let nSlots = undefined;
            if (itemMap.has(item_name)) {
                let item = itemMap.get(item_name);
                nSlots = item["slots"];
                //console.log(item);
            }
            else {
                let crafted_custom_item = getCraftFromHash(item_name) !== undefined ? getCraftFromHash(item_name) : (getCustomFromHash(item_name) !== undefined ? getCustomFromHash(item_name) : undefined);
                if (crafted_custom_item !== undefined) {
                    nSlots = crafted_custom_item.statMap.get("slots");
                } 
            }
            if (nSlots !== undefined) {
                document.getElementById(armorType+"-slots").textContent = nSlots + " slots";
            }
            else {
                document.getElementById(armorType+"-slots").textContent = "X slots";
            }
        });
    }

    let ring1_list = document.getElementById("ring1-items");
    let ring2_list = document.getElementById("ring2-items");
    for (const ring of itemLists.get("ring")) {
        let item_obj = itemMap.get(ring);
        if (item_obj["restrict"] && item_obj["restrict"] === "DEPRECATED") {
            continue;
        }
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
            let item_obj = itemMap.get(weapon);
            if (item_obj["restrict"] && item_obj["restrict"] === "DEPRECATED") {
                continue;
            }
            let el = document.createElement("option");
            el.value = weapon;
            weapon_list.appendChild(el);
        }
    }

    // Add change listener to update weapon slots.
    document.getElementById("weapon-choice").addEventListener("change", (event) => {
        let item_name = event.target.value;
        let item = itemMap.has(item_name) ? itemMap.get(item_name) : (getCraftFromHash(item_name) ? getCraftFromHash(item_name) : (getCustomFromHash(item_name) ? getCustomFromHash(item_name) : undefined));
        if (item !== undefined && event.target.value !== "") {
            document.getElementById("weapon-slots").textContent = (item["slots"] ? item["slots"] : (item.statMap !== undefined ? ( item.statMap.has("slots") ? item.statMap.get("slots") : 0): 0) )+ " slots";
        } else {
            document.getElementById("weapon-slots").textContent = "X slots";
        }
    });

    decodeBuild(url_tag);
}

function getItemNameFromID(id) {
    if (redirectMap.has(id)) {
        return getItemNameFromID(redirectMap.get(id));
    }
    return idMap.get(id);
}

function parsePowdering(powder_info) {
    // TODO: Make this run in linear instead of quadratic time... ew
    let powdering = [];
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
    return powdering;
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
                let equipment_str = equipments.slice(i*3,i*3+3);
                equipment[i] = getItemNameFromID(Base64.toInt(equipment_str));
            }
            info[1] = equipments.slice(27);
        }
        if (version === "4") { 
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
        if (version === "5") {
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
        if (version === "1") {
            let powder_info = info[1];
            powdering = parsePowdering(powder_info);
        } else if (version === "2") {
            save_skp = true;
            let skillpoint_info = info[1].slice(0, 10);
            for (let i = 0; i < 5; ++i ) {
                skillpoints[i] = Base64.toIntSigned(skillpoint_info.slice(i*2,i*2+2));
            }

            let powder_info = info[1].slice(10);
            powdering = parsePowdering(powder_info);
        } else if (version === "3" || version === "4" || version === "5"){
            level = Base64.toInt(info[1].slice(10,12));
            setValue("level-choice",level);
            save_skp = true;
            let skillpoint_info = info[1].slice(0, 10);
            for (let i = 0; i < 5; ++i ) {
                skillpoints[i] = Base64.toIntSigned(skillpoint_info.slice(i*2,i*2+2));
            }

            let powder_info = info[1].slice(12);

            powdering = parsePowdering(powder_info);
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
        let build_string;
        if (player_build.customItems.length > 0) { //v5 encoding
            build_string = "5_";
            let crafted_idx = 0;
            let custom_idx = 0;
            for (const item of player_build.items) {
                
                if (item.get("custom")) {
                    let custom = "CI-"+encodeCustom(player_build.customItems[custom_idx],true);
                    build_string += Base64.fromIntN(custom.length, 3) + custom;
                    custom_idx += 1;
                } else if (item.get("crafted")) {
                    build_string += "CR-"+encodeCraft(player_build.craftedItems[crafted_idx]);
                    crafted_idx += 1;
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
        } else { //v4 encoding
            build_string = "4_";
            let crafted_idx = 0;
            for (const item of player_build.items) {
                if (item.get("crafted")) {
                    build_string += "-"+encodeCraft(player_build.craftedItems[crafted_idx]);
                    crafted_idx += 1;
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
        }
        return build_string;
    }
    //        this.equipment = [ this.helmet, this.chestplate, this.leggings, this.boots, this.ring1, this.ring2, this.bracelet, this.necklace ];
    //        let build_string = "3_" + Base64.fromIntN(player_build.helmet.get("id"), 3) +
    //                            Base64.fromIntN(player_build.chestplate.get("id"), 3) +
    //                            Base64.fromIntN(player_build.leggings.get("id"), 3) +
    //                            Base64.fromIntN(player_build.boots.get("id"), 3) +
    //                            Base64.fromIntN(player_build.ring1.get("id"), 3) +
    //                            Base64.fromIntN(player_build.ring2.get("id"), 3) +
    //                            Base64.fromIntN(player_build.bracelet.get("id"), 3) +
    //                            Base64.fromIntN(player_build.necklace.get("id"), 3) +
    //                            Base64.fromIntN(player_build.weapon.get("id"), 3);
    return "";
}

function calculateBuild(save_skp, skp){
    try {
        let specialNames = ["Quake", "Chain_Lightning", "Curse", "Courage", "Wind_Prison"];
        for (const sName of specialNames) {
            for (let i = 1; i < 6; i++) {
                let elem = document.getElementById(sName + "-" + i);
                let name = sName.replace("_", " ");
                if (elem.classList.contains("toggleOn")) { //toggle the pressed button off
                    elem.classList.remove("toggleOn");
                }
            }
        }
        if(player_build){
            updateBoosts("skip", false);
            updatePowderSpecials("skip", false);
        }
        let weaponName = getValue(equipmentInputs[8]);
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
            //console.log("POWDERING: " + powdering);
            powderings.push(powdering);
        }
        

        let level = document.getElementById("level-choice").value;
        player_build = new Build(level, equipment, powderings, new Map(), errors);
        console.log(player_build);
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
        handleBuilderError(error);
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

/* Updates all powder special boosts 
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
    let td = document.createElement("p");

    let remainingSkp = document.createElement("p");
    remainingSkp.classList.add("center");
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

function saveBuild() {
    if (player_build) {
        let savedBuilds = window.localStorage.getItem("builds") === null ? {} : JSON.parse(window.localStorage.getItem("builds"));
        let saveName = document.getElementById("build-name").value;
        if ((!Object.keys(savedBuilds).includes(saveName) || document.getElementById("saved-error").textContent !== "") && location.hash !== "") {
            savedBuilds[saveName] = location.hash.replace("#", "");
            window.localStorage.setItem("builds", JSON.stringify(savedBuilds));

            document.getElementById("saved-error").textContent = "";
            document.getElementById("saved-build").textContent = "Build saved";
        } else {
            if (location.hash === "")
                document.getElementById("saved-error").textContent = "Empty build";
            else
                document.getElementById("saved-error").textContent = "Exists. Overwrite?";
        }
    }
}

function loadBuild() {
    let savedBuilds = window.localStorage.getItem("builds") === null ? {} : JSON.parse(window.localStorage.getItem("builds"));
    let saveName = document.getElementById("build-name").value;

    document.getElementById("loaded-error").textContent = "";
    if (Object.keys(savedBuilds).includes(saveName)) { 
        decodeBuild(savedBuilds[saveName])
        document.getElementById("loaded-build").textContent = "Build loaded";
    } else
        document.getElementById("loaded-error").textContent = "Build doesn't exist";
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

function optimizeStrDex() {
    const remaining = levelToSkillPoints(player_build.level) - player_build.assigned_skillpoints;
    const base_skillpoints = player_build.base_skillpoints;
    const max_str_boost = 100 - base_skillpoints[0];
    const max_dex_boost = 100 - base_skillpoints[1];
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
        setTitle();
        if (player_build.errored)
            throw new ListError(player_build.errors);
    }
    catch (error) {
        handleBuilderError(error);
    }
}

// TODO: Learn and use await
function init2() {
    load_ing_init(init);
}
load_init(init2);
