let nonRolledIDs = ["name", "displayName", "tier", "set", "slots", "type", "material", "drop", "quest", "restrict", "nDam", "fDam", "wDam", "aDam", "tDam", "eDam", "atkSpd", "hp", "fDef", "wDef", "aDef", "tDef", "eDef", "lvl", "classReq", "strReq", "dexReq", "intReq", "defReq", "agiReq","str", "dex", "int", "agi", "def", "fixID", "category", "id", "skillpoints", "reqs", "nDam_", "fDam_", "wDam_", "aDam_", "tDam_", "eDam_"];
let rolledIDs = ["hprPct", "mr", "sdPct", "mdPct", "ls", "ms", "xpb", "lb", "ref", "thorns", "expd", "spd", "atkTier", "poison", "hpBonus", "spRegen", "eSteal", "hprRaw", "sdRaw", "mdRaw", "fDamPct", "wDamPct", "aDamPct", "tDamPct", "eDamPct", "fDefPct", "wDefPct", "aDefPct", "tDefPct", "eDefPct", "spPct1", "spRaw1", "spPct2", "spRaw2", "spPct3", "spRaw3", "spPct4", "spRaw4", "rainbowRaw", "sprint", "sprintReg", "jh", "lq", "gXp", "gSpd"];

let reversedIDs = [ "atkTier", "spPct1", "spRaw1", "spPct2", "spRaw2", "spPct3", "spRaw3", "spPct4", "spRaw4" ];

function expandItem(item, powders){
    let minRolls = new Map();
    let maxRolls = new Map();
    let expandedItem = new Map();
    if(item.fixID){ //The item has fixed IDs.
        expandedItem.set("fixID",true);
        for (const id of rolledIDs){ //all rolled IDs are numerical
            //if(item[id]) {
                minRolls.set(id,item[id]);
                maxRolls.set(id,item[id]);
            //}
        }
    }else{ //The item does not have fixed IDs.
        for (const id of rolledIDs){
            if(item[id] > 0){ // positive rolled IDs                   
                minRolls.set(id,idRound(item[id]*0.3));
                maxRolls.set(id,idRound(item[id]*1.3));
            }else if(item[id] < 0){ //negative rolled IDs
                if (reversedIDs.includes(id)) {
                    maxRolls.set(id,idRound(item[id]*1.3));
                    minRolls.set(id,idRound(item[id]*0.7));
                }
                else {
                    minRolls.set(id,idRound(item[id]*1.3));
                    maxRolls.set(id,idRound(item[id]*0.7));
                }
            }else{//Id = 0
                minRolls.set(id,0);
                maxRolls.set(id,0);
            }
        }
    }
    for (const id of nonRolledIDs){
        expandedItem.set(id,item[id]);
    }
    expandedItem.set("minRolls",minRolls);
    expandedItem.set("maxRolls",maxRolls);
    expandedItem.set("powders", powders);
    return expandedItem;
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

let idPrefixes = {"displayName": "", "lvl":"Combat Level Min: ", "classReq":"Class Req: ","strReq":"Strength Min: ","dexReq":"Dexterity Min: ","intReq":"Intelligence Min: ","defReq":"Defense Min: ","agiReq":"Agility Min: ", "nDam_":"Neutral Damage: ", "eDam_":"Earth Damage: ", "tDam_":"Thunder Damage: ", "wDam_":"Water Damage: ", "fDam_":"Fire Damage: ", "aDam_":"Air Damage: ", "atkSpd":"Attack Speed: ", "hp":"Health : ", "eDef":"Earth Defense: ", "tDef":"Thunder Defense: ", "wDef":"Water Defense: ", "fDef":"Fire Defense: ", "aDef":"Air Defense: ", "str":"Strength: ", "dex":"Dexterity: ", "int":"Intelligence: ", "def":"Defense: ","agi":"Agility: ", "hpBonus":"Health Bonus: ", "hprRaw":"Health Regen Raw: ", "hprPct":"Health Regen %: ", "sdRaw":"Raw Spell Damage: ", "sdPct":"Spell Damage %: ", "mdRaw":"Main Attack Neutral Damage: ", "mdPct":"Main Attack Damage %: ", "mr":"Mana Regen: ", "ms":"Mana Steal: ", "ref":"Reflection: ", "ls":"Life Steal: ", "poison":"Poison: ", "thorns":"Thorns: ", "expd":"Exploding: ", "spd":"Walk Speed Bonus: ", "atkTier":"Attack Speed Bonus: ",  "eDamPct":"Earth Damage %: ", "tDamPct":"Thunder Damage %: ", "wDamPct":"Water Damage %: ", "fDamPct":"Fire Damage %: ", "aDamPct":"Air Damage %: ", "eDefPct":"Earth Defense %: ", "tDefPct":"Thunder Defense %: ", "wDefPct":"Water Defense %: ", "fDefPct":"Fire Defense %: ", "aDefPct":"Air Defense %: ", "spPct1":"1st Spell Cost %: ", "spRaw1":"1st Spell Cost Raw: ", "spPct2":"2nd Spell Cost %: ", "spRaw2":"2nd Spell Cost Raw: ", "spPct3":"3rd Spell Cost %: ", "spRaw3":"3rd Spell Cost Raw: ", "spPct4":"4th Spell Cost %: ", "spRaw4":"4th Spell Cost Raw: ", "rainbowRaw":"Rainbow Spell Damage Raw: ", "sprint":"Sprint Bonus: ", "sprintReg":"Sprint Regen Bonus: ", "jh":"Jump Height: ", "xpb":"Combat XP Bonus: ", "lb":"Loot Bonus: ", "lq":"Loot Quality: ", "spRegen":"Soul Point Regen: ", "eSteal":"Stealing: ", "gXp":"Gathering XP Bonus: ", "gSpd":"Gathering Speed Bonus: ", "slots":"Powder Slots: ", "set":"Set: ", "quest":"Quest Req: ", "restrict":""};
let idSuffixes = {"displayName": "", "lvl":"", "classReq":"","strReq":"","dexReq":"","intReq":"","defReq":"","agiReq":"", "nDam_":"", "eDam_":"", "tDam_":"", "wDam_":"", "fDam_":"", "aDam_":"", "atkSpd":"", "hp":"", "eDef":"", "tDef":"", "wDef":"", "fDef":"", "aDef":"", "str":"", "dex":"", "int":"", "def":"","agi":"", "hpBonus":"", "hprRaw":"", "hprPct":"%", "sdRaw":"", "sdPct":"%", "mdRaw":"", "mdPct":"%", "mr":"/4s", "ms":"/4s", "ref":"%", "ls":"/4s", "poison":"/3s", "thorns":"%", "expd":"%", "spd":"%", "atkTier":" tier",  "eDamPct":"%", "tDamPct":"%", "wDamPct":"%", "fDamPct":"%", "aDamPct":"%", "eDefPct":"%", "tDefPct":"%", "wDefPct":"%", "fDefPct":"%", "aDefPct":"%", "spPct1":"%", "spRaw1":"", "spPct2":"%", "spRaw2":"", "spPct3":"%", "spRaw3":"", "spPct4":"%", "spRaw4":"", "rainbowRaw":"", "sprint":"%", "sprintReg":"%", "jh":"", "xpb":"%", "lb":"%", "lq":"%", "spRegen":"%", "eSteal":"%", "gXp":"%", "gSpd":"%", "slots":"", "set":" set.", "quest":"", "restrict":""};

function apply_elemental_format(p_elem, id, suffix) {
    suffix = (typeof suffix !== 'undefined') ?  suffix : "";
    // THIS IS SO JANK BUT IM TOO LAZY TO FIX IT TODO
    let parts = idPrefixes[id].split(/ (.*)/);
    let element_prefix = parts[0];
    let desc = parts[1];
    let i_elem = document.createElement('b');
    i_elem.classList.add(element_prefix);
    i_elem.textContent = element_prefix;
    p_elem.appendChild(i_elem);

    let i_elem2 = document.createElement('b');
    i_elem2.textContent = " " + desc + suffix;
    p_elem.appendChild(i_elem2);
}

function displayBuildStats(build, parent_id){
    // Commands to "script" the creation of nice formatting.
    // #commands create a new element.
    // !elemental is some janky hack for elemental damage.
    // normals just display a thing.

    let display_commands = [
        "#ldiv",
        "!elemental",
        "hp",
        "fDef", "wDef", "aDef", "tDef", "eDef",
        "!elemental",
        "#table",
        "str", "dex", "int", "def", "agi",
        "hpBonus",
        "hprRaw", "hprPct",
        "sdRaw", "sdPct",
        "mdRaw", "mdPct",
        "mr", "ms",
        "ref", "thorns",
        "ls",
        "poison",
        "expd",
        "spd",
        "atkTier",
        "!elemental",
        "fDamPct", "wDamPct", "aDamPct", "tDamPct", "eDamPct",
        "fDefPct", "wDefPct", "aDefPct", "tDefPct", "eDefPct",
        "!elemental",
        "spPct1", "spRaw1", "spPct2", "spRaw2", "spPct3", "spRaw3", "spPct4", "spRaw4",
        "rainbowRaw",
        "sprint", "sprintReg",
        "jh",
        "xpb", "lb", "lq",
        "spRegen",
        "eSteal",
        "gXp", "gSpd",
        ];

    // Clear the parent div.
    setHTML(parent_id, "");
    let parent_div = document.getElementById(parent_id);

    let stats = build.statMap;
    
    let active_elem;
    let elemental_format = false;

    //TODO this is put here for readability, consolidate with definition in build.js
    let staticIDs = ["hp", "eDef", "tDef", "wDef", "fDef", "aDef"];

    for (const command of display_commands) {
        if (command.charAt(0) === "#") {
            if (command === "#cdiv") {
                active_elem = document.createElement('div');
                active_elem.classList.add('itemcenter');
            }
            else if (command === "#ldiv") {
                active_elem = document.createElement('div');
                active_elem.classList.add('itemleft');
            }
            else if (command === "#table") {
                active_elem = document.createElement('table');
                active_elem.classList.add('itemtable');
            }
            parent_div.appendChild(active_elem);
        }
        else if (command.charAt(0) === "!") {
            // TODO: This is sooo incredibly janky.....
            if (command === "!elemental") {
                elemental_format = !elemental_format;
            }
        }
        else {
            let id = command;
            if (stats.get(id)) {
                let style = null;
                if (!staticIDs.includes(id)) {
                    style = "positive";
                    if (stats.get(id) < 0) {
                        style = "negative";
                    }
                }
                displayFixedID(active_elem, id, stats.get(id), elemental_format, style);
            }
        }
    }
}

function displayExpandedItem(item, parent_id){
    // Commands to "script" the creation of nice formatting.
    // #commands create a new element.
    // !elemental is some janky hack for elemental damage.
    // normals just display a thing.
    if (item.get("category") === "weapon") {
        let stats = new Map();
        stats.set("atkSpd", item.get("atkSpd"));
        stats.set("damageBonus", [0, 0, 0, 0, 0]);
        stats.set("damageRaw", [item.get("nDam"), item.get("eDam"), item.get("tDam"), item.get("wDam"), item.get("fDam"), item.get("aDam")]);
        let results = calculateSpellDamage(stats, [100, 0, 0, 0, 0, 0], 0, 0, 0, item, [0, 0, 0, 0, 0]);
        let damages = results[2];
        let damage_keys = [ "nDam_", "eDam_", "tDam_", "wDam_", "fDam_", "aDam_" ];
        for (const i in damage_keys) {
            item.set(damage_keys[i], damages[i][0]+"-"+damages[i][1]);
        }
    }

    let display_commands = [
        "#cdiv",
        "displayName",
        "#ldiv",
        "atkSpd",
        "#ldiv",
        "!elemental",
        "hp",
        "nDam_", "fDam_", "wDam_", "aDam_", "tDam_", "eDam_",
        "fDef", "wDef", "aDef", "tDef", "eDef",
        "!elemental",
        "#ldiv",
        "classReq",
        "lvl",
        "strReq", "dexReq", "intReq", "defReq","agiReq",
        "#ldiv",
        "str", "dex", "int", "def", "agi",
        "#table",
        "hpBonus",
        "hprRaw", "hprPct",
        "sdRaw", "sdPct",
        "mdRaw", "mdPct",
        "mr", "ms",
        "ref", "thorns",
        "ls",
        "poison",
        "expd",
        "spd",
        "atkTier",
        "!elemental",
        "fDamPct", "wDamPct", "aDamPct", "tDamPct", "eDamPct",
        "fDefPct", "wDefPct", "aDefPct", "tDefPct", "eDefPct",
        "!elemental",
        "spPct1", "spRaw1", "spPct2", "spRaw2", "spPct3", "spRaw3", "spPct4", "spRaw4",
        "rainbowRaw",
        "sprint", "sprintReg",
        "jh",
        "xpb", "lb", "lq",
        "spRegen",
        "eSteal",
        "gXp", "gSpd",
        "#ldiv",
        "slots",
        "set",
        "quest",
        "restrict"];

    // Clear the parent div.
    setHTML(parent_id, "");
    let parent_div = document.getElementById(parent_id);
    
    let active_elem;
    let fix_id = item.has("fixID") && item.get("fixID");
    let elemental_format = false;
    for (const command of display_commands) {
        if (command.charAt(0) === "#") {
            if (command === "#cdiv") {
                active_elem = document.createElement('div');
                active_elem.classList.add('itemcenter');
            }
            else if (command === "#ldiv") {
                active_elem = document.createElement('div');
                active_elem.classList.add('itemleft');
            }
            else if (command === "#table") {
                active_elem = document.createElement('table');
                active_elem.classList.add('itemtable');
            }
            parent_div.appendChild(active_elem);
        }
        else if (command.charAt(0) === "!") {
            // TODO: This is sooo incredibly janky.....
            if (command === "!elemental") {
                elemental_format = !elemental_format;
            }
        }
        else {
            let id = command;
            if(nonRolledIDs.includes(id) && item.get(id)){//nonRolledID & non-0/non-null/non-und ID
                let p_elem = displayFixedID(active_elem, id, item.get(id), elemental_format);
                if (id === "slots") {
                    // HACK TO MAKE POWDERS DISPLAY NICE!! TODO
                    p_elem.textContent = idPrefixes[id].concat(item.get(id), idSuffixes[id]) + 
                    " [ " + item.get("powders").map(x => powderNames.get(x)) + " ]";
                }
            }
            else if(rolledIDs.includes(id)&& item.get("minRolls").get(id)){ // && item.get("maxRolls").get(id) ){//rolled ID & non-0/non-null/non-und ID
                let style = "positive";
                if (item.get("minRolls").get(id) < 0) {
                    style = "negative";
                }
                if (fix_id) {
                    displayFixedID(active_elem, id, item.get("minRolls").get(id), elemental_format, style);
                }
                else {
                    let row = document.createElement('tr');
                    let min_elem = document.createElement('td');
                    min_elem.classList.add('left');
                    min_elem.classList.add(style);
                    min_elem.textContent = item.get("minRolls").get(id) + idSuffixes[id];
                    row.appendChild(min_elem);

                    let desc_elem = document.createElement('td');
                    desc_elem.classList.add('center');
                    //TODO elemental format jank
                    if (elemental_format) {
                        apply_elemental_format(desc_elem, id);
                    }
                    else {
                        desc_elem.textContent = idPrefixes[id];
                    }
                    row.appendChild(desc_elem);

                    let max_elem = document.createElement('td');
                    max_elem.classList.add('right');
                    max_elem.classList.add(style);
                    max_elem.textContent = item.get("maxRolls").get(id) + idSuffixes[id];
                    row.appendChild(max_elem);
                    active_elem.appendChild(row);
                }
            }//Just don't do anything if else
        }
    }
    let item_desc_elem = document.createElement('p');
    item_desc_elem.classList.add('itemp');
    item_desc_elem.classList.add('left');
    item_desc_elem.textContent = item.get("tier")+" "+item.get("type");
    parent_div.append(item_desc_elem);
}

function displayFixedID(active, id, value, elemental_format, style) {
    if (style) {
        let row = document.createElement('tr');
        let desc_elem = document.createElement('td');
        desc_elem.classList.add('left');
        if (elemental_format) {
            apply_elemental_format(desc_elem, id);
        }
        else {
            desc_elem.textContent = idPrefixes[id];
        }
        row.appendChild(desc_elem);

        let value_elem = document.createElement('td');
        value_elem.classList.add('right');
        value_elem.classList.add(style);
        value_elem.textContent = value + idSuffixes[id];
        row.appendChild(value_elem);
        active.appendChild(row);
        return row;
    }
    else {
        // HACK TO AVOID DISPLAYING ZERO DAMAGE! TODO
        if (value === "0-0") {
            return;
        }
        let p_elem = document.createElement('p');
        p_elem.classList.add('itemp');
        if (elemental_format) {
            apply_elemental_format(p_elem, id, value);
        }
        else {
            p_elem.textContent = idPrefixes[id].concat(value, idSuffixes[id]);
        }
        active.appendChild(p_elem);
        return p_elem;
    }
}

function displaySpellDamage(parent_elem, build, spell, spellIdx) {
    parent_elem.textContent = "";

    const stats = build.statMap;
    let title_elem = document.createElement("p");
    title_elem.classList.add('center');
    if (spellIdx != 0) {
        title_elem.textContent = spell.title + " (" + build.getSpellCost(spellIdx, spell.cost) + ")";
    }
    else {
        title_elem.textContent = spell.title;
    }

    parent_elem.append(title_elem);
    let critChance = skillPointsToPercentage(build.total_skillpoints[1]);

    let save_damages = [];

    for (const part of spell.parts) {
        parent_elem.append(document.createElement("br"));
        let part_div = document.createElement("p");
        parent_elem.append(part_div);

        let subtitle_elem = document.createElement("p");
        subtitle_elem.textContent = part.subtitle;
        part_div.append(subtitle_elem);
        if (part.type === "damage") {

            let _results = calculateSpellDamage(stats, part.conversion,
                                    stats.get("sdRaw"), stats.get("sdPct"), 
                                    part.multiplier / 100, build.weapon, build.total_skillpoints);
            let totalDamNormal = _results[0];
            let totalDamCrit = _results[1];
            let results = _results[2];
            for (let i = 0; i < 6; ++i) {
                for (let j in results[i]) {
                    results[i][j] = results[i][j].toFixed(2);
                }
            }
            let nonCritAverage = (totalDamNormal[0]+totalDamNormal[1])/2;
            let critAverage = (totalDamCrit[0]+totalDamCrit[1])/2;
            let averageDamage = (1-critChance)*nonCritAverage+critChance*critAverage;

            let averageLabel = document.createElement("p");
            averageLabel.textContent = "Average: "+averageDamage.toFixed(2);
            averageLabel.classList.add("damageSubtitle");
            part_div.append(averageLabel);

            let nonCritLabel = document.createElement("p");
            nonCritLabel.textContent = "Non-Crit Average: "+nonCritAverage.toFixed(2);
            nonCritLabel.classList.add("damageSubtitle");
            part_div.append(nonCritLabel);

            let damageClasses = ["Neutral","Earth","Thunder","Water","Fire","Air"];
            for (let i = 0; i < 6; i++){
                if (results[i][1] > 0){
                    let p = document.createElement("p");
                    p.classList.add("damagep");
                    p.classList.add(damageClasses[i]);
                    p.textContent = results[i][0]+"-"+results[i][1];
                    part_div.append(p);
                }
            }
            //part_div.append(document.createElement("br"));
            let critLabel = document.createElement("p");
            critLabel.textContent = "Crit Average: "+critAverage.toFixed(2);
            critLabel.classList.add("damageSubtitle");
            part_div.append(critLabel);

            for (let i = 0; i < 6; i++){
                if (results[i][1] > 0){
                    let p = document.createElement("p");
                    p.classList.add("damagep");
                    p.classList.add(damageClasses[i]);
                    p.textContent = results[i][2]+"-"+results[i][3];
                    part_div.append(p);
                }
            }
            save_damages.push(averageDamage);
        }
        else if (part.type == "heal") {
            let heal_amount = part.strength * build.getHealth() * Math.max(0, Math.min(1.5, 1 + 0.05 * stats.get("wDamPct")));
            let healLabel = document.createElement("p");
            healLabel.textContent = heal_amount;
            healLabel.classList.add("damagep");
            part_div.append(healLabel);
        }
        else if (part.type === "total") {
            let total_damage = 0;
            for (let i in part.factors) {
                total_damage += save_damages[i] * part.factors[i];
            }
            let averageLabel = document.createElement("p");
            averageLabel.textContent = "Average: "+total_damage.toFixed(2);
            averageLabel.classList.add("damageSubtitle");
            part_div.append(averageLabel);
        }
    }
}
