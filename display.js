let nonRolledIDs = ["name", "displayName", "tier", "set", "slots", "type", "material", "drop", "quest", "restrict", "nDam", "fDam", "wDam", "aDam", "tDam", "eDam", "atkSpd", "hp", "fDef", "wDef", "aDef", "tDef", "eDef", "lvl", "classReq", "strReq", "dexReq", "intReq", "defReq", "agiReq","str", "dex", "int", "agi", "def", "fixID", "category", "id", "skillpoints", "reqs", "nDam_", "fDam_", "wDam_", "aDam_", "tDam_", "eDam_"];
let rolledIDs = ["hprPct", "mr", "sdPct", "mdPct", "ls", "ms", "xpb", "lb", "ref", "thorns", "expd", "spd", "atkTier", "poison", "hpBonus", "spRegen", "eSteal", "hprRaw", "sdRaw", "mdRaw", "fDamPct", "wDamPct", "aDamPct", "tDamPct", "eDamPct", "fDefPct", "wDefPct", "aDefPct", "tDefPct", "eDefPct", "spPct1", "spRaw1", "spPct2", "spRaw2", "spPct3", "spRaw3", "spPct4", "spRaw4", "rainbowRaw", "sprint", "sprintReg", "jh", "lq", "gXp", "gSpd"];
let damageClasses = ["Neutral","Earth","Thunder","Water","Fire","Air"];
let reversedIDs = [ "atkTier", "spPct1", "spRaw1", "spPct2", "spRaw2", "spPct3", "spRaw3", "spPct4", "spRaw4" ];


function expandItem(item, powders){
    let minRolls = new Map();
    let maxRolls = new Map();
    let expandedItem = new Map();
    if(item.fixID){ //The item has fixed IDs.
        expandedItem.set("fixID",true);
        for (const id of rolledIDs){ //all rolled IDs are numerical
            let val = (item[id] || 0);
            //if(item[id]) {
                minRolls.set(id,val);
                maxRolls.set(id,val);
            //}
        }
    }else{ //The item does not have fixed IDs.
        for (const id of rolledIDs){
            let val = (item[id] || 0);
            if(val > 0){ // positive rolled IDs                   
                minRolls.set(id,idRound(val*0.3));
                maxRolls.set(id,idRound(val*1.3));
            }else if(val < 0){ //negative rolled IDs
                if (reversedIDs.includes(id)) {
                    maxRolls.set(id,idRound(val*1.3));
                    minRolls.set(id,idRound(val*0.7));
                }
                else {
                    minRolls.set(id,idRound(val*1.3));
                    maxRolls.set(id,idRound(val*0.7));
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
        return 1; //this is a hack, will need changing along w/ rest of ID system if anything changes
    }else{
        return rounded;
    }
}

let idPrefixes = {"displayName": "", "lvl":"Combat Level Min: ", "classReq":"Class Req: ","strReq":"Strength Min: ","dexReq":"Dexterity Min: ","intReq":"Intelligence Min: ","defReq":"Defense Min: ","agiReq":"Agility Min: ", "nDam_":"Neutral Damage: ", "eDam_":"Earth Damage: ", "tDam_":"Thunder Damage: ", "wDam_":"Water Damage: ", "fDam_":"Fire Damage: ", "aDam_":"Air Damage: ", "atkSpd":"Attack Speed: ", "hp":"Health : ", "eDef":"Earth Defense: ", "tDef":"Thunder Defense: ", "wDef":"Water Defense: ", "fDef":"Fire Defense: ", "aDef":"Air Defense: ", "str":"Strength: ", "dex":"Dexterity: ", "int":"Intelligence: ", "def":"Defense: ","agi":"Agility: ", "hpBonus":"Health Bonus: ", "hprRaw":"Health Regen Raw: ", "hprPct":"Health Regen %: ", "sdRaw":"Raw Spell Damage: ", "sdPct":"Spell Damage %: ", "mdRaw":"Raw Melee Damage: ", "mdPct":"Melee Damage %: ", "mr":"Mana Regen: ", "ms":"Mana Steal: ", "ref":"Reflection: ", "ls":"Life Steal: ", "poison":"Poison: ", "thorns":"Thorns: ", "expd":"Exploding: ", "spd":"Walk Speed Bonus: ", "atkTier":"Attack Speed Bonus: ",  "eDamPct":"Earth Damage %: ", "tDamPct":"Thunder Damage %: ", "wDamPct":"Water Damage %: ", "fDamPct":"Fire Damage %: ", "aDamPct":"Air Damage %: ", "eDefPct":"Earth Defense %: ", "tDefPct":"Thunder Defense %: ", "wDefPct":"Water Defense %: ", "fDefPct":"Fire Defense %: ", "aDefPct":"Air Defense %: ", "spPct1":"1st Spell Cost %: ", "spRaw1":"1st Spell Cost Raw: ", "spPct2":"2nd Spell Cost %: ", "spRaw2":"2nd Spell Cost Raw: ", "spPct3":"3rd Spell Cost %: ", "spRaw3":"3rd Spell Cost Raw: ", "spPct4":"4th Spell Cost %: ", "spRaw4":"4th Spell Cost Raw: ", "rainbowRaw":"Rainbow Spell Damage Raw: ", "sprint":"Sprint Bonus: ", "sprintReg":"Sprint Regen Bonus: ", "jh":"Jump Height: ", "xpb":"Combat XP Bonus: ", "lb":"Loot Bonus: ", "lq":"Loot Quality: ", "spRegen":"Soul Point Regen: ", "eSteal":"Stealing: ", "gXp":"Gathering XP Bonus: ", "gSpd":"Gathering Speed Bonus: ", "slots":"Powder Slots: ", "set":"Set: ", "quest":"Quest Req: ", "restrict":""};
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

function displaySetBonuses(build, parent_id) {
    setHTML(parent_id, "");
    let parent_div = document.getElementById(parent_id);

    let set_summary_elem = document.createElement('p');
    set_summary_elem.classList.add('itemcenter');
    set_summary_elem.textContent = "Set Bonuses:";
    parent_div.append(set_summary_elem);

    for (const [setName, count] of build.activeSetCounts) {
        let set_elem = document.createElement('p');
        set_elem.id = "set-"+setName;
        set_summary_elem.append(set_elem);
        
        const bonus = sets[setName].bonuses[count-1];
        let mock_item = new Map();
        mock_item.set("fixID", true);
        mock_item.set("displayName", setName+" Set: "+count+"/"+sets[setName].items.length);
        let mock_minRolls = new Map();
        mock_item.set("minRolls", mock_minRolls);
        for (const id in bonus) {
            if (rolledIDs.includes(id)) {
                mock_minRolls.set(id, bonus[id]);
            }
            else {
                mock_item.set(id, bonus[id]);
            }
        }
        displayExpandedItem(mock_item, set_elem.id);
    }
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
    let title = document.createElement("p");
    title.classList.add("itemcenter");
    title.classList.add("itemp");
    title.classList.add("title");
    title.classList.add("Normal");
    title.textContent = "Overall Build Stats";
    parent_div.append(title);
    parent_div.append(document.createElement("br"));

    let set_summary_elem = document.createElement('p');
    set_summary_elem.classList.add('itemp');
    set_summary_elem.classList.add('left');
    set_summary_elem.textContent = "Set Summary:";
    parent_div.append(set_summary_elem);
    for (const [setName, count] of build.activeSetCounts) {
        let set_elem = document.createElement('p');
        set_elem.classList.add('itemp');
        set_elem.classList.add('left');
        set_elem.textContent = "    "+setName+" Set: "+count+"/"+sets[setName].items.length;
        set_summary_elem.append(set_elem);
    }

    let stats = build.statMap;
    console.log(build.statMap);
    
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
        "!elemental",
        "slots",
        "!elemental",
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
                    // PROPER POWDER DISPLAYING EZ CLAP 
                    p_elem.textContent = "";
                    let powderMap = new Map([ ["e", "Earth"], ["t", "Thunder"], ["w", "Water"], ["f", "Fire"], ["a", "Air"]]);
                    let numerals = new Map([["1", "I"], ["2", "II"], ["3", "III"], ["4", "IV"], ["5", "V"], ["6", "VI"]]);
                    /*p_elem.textContent = idPrefixes[id].concat(item.get(id), idSuffixes[id]) + 
                    " [ " + item.get("powders").map(x => powderNames.get(x)) + " ]";*/
                    let wrapper = document.createElement("p");
                    p_elem.classList.add("itemtable");
                    let row = document.createElement("tr");

                    let powderPrefix = document.createElement("td");
                    powderPrefix.classList.add("itemp");
                    powderPrefix.classList.add("left");
                    powderPrefix.textContent = "Powders: [";
                    row.appendChild(powderPrefix);
                    
                    let spaceElem = document.createElement("td");
                    //spaceElem.textContent = " ";
                    spaceElem.classList.add("itemp");
                    

                    let powderList = item.get("powders").map(x => powderNames.get(x))
                    for(let i = 0; i < powderList.length; i++){
                        let powder = document.createElement("td");
                        let powderStr = powderList[i];
                        console.log(powderStr);
                        powder.textContent = numerals.get(powderStr.charAt(1), 10);
                        powder.classList.add(powderMap.get(powderStr.charAt(0)));
                        powder.classList.add("nopadding");
                        row.appendChild(powder);
                    }

                    let powderSuffix = document.createElement("td");
                    powderSuffix.classList.add("itemp");
                    powderSuffix.classList.add("left"); 
                    powderSuffix.classList.add("nopadding");
                    powderSuffix.textContent = "]";
                    row.appendChild(powderSuffix);

                    wrapper.appendChild(row);
                    p_elem.appendChild(wrapper);
                }else if(id === "displayName"){
                    p_elem.classList.add("title");
                    if(item.get("tier") !== " "){
                        p_elem.classList.add(item.get("tier"));
                    }
                }else if(skp_order.includes(id)){ //id = str, dex, int, def, or agi
                    p_elem.textContent = "";
                    p_elem.classList.add("itemtable");
                    let row = document.createElement("tr");
                    let title = document.createElement("td");
                    title.textContent = idPrefixes[id] + " ";
                    let boost = document.createElement("td");
                    if(item.get(id) < 0){
                        boost.classList.add("negative");
                    }else{ //boost = 0 SHOULD not come up
                        boost.classList.add("positive");
                    }
                    boost.classList.add("spaceLeft");
                    boost.textContent = item.get(id);
                    row.appendChild(title);
                    row.appendChild(boost);
                    p_elem.appendChild(row);
                }else if(id === "restrict"){
                    p_elem.classList.add("restrict");
                }
            }
            else if (rolledIDs.includes(id) && item.get("minRolls").get(id)){ // && item.get("maxRolls").get(id) ){//rolled ID & non-0/non-null/non-und ID
                let style = "positive";
                if (item.get("minRolls").get(id) < 0) {
                    style = "negative";
                }
                //let flipPosNeg = ["spRaw1","spRaw2","spRaw3","spRaw4","spPct1","spPct2","spPct3","spPct4"];
                if(reversedIDs.filter(e => e !== "atkTier").includes(id)){
                    style === "positive" ? style = "negative" : style = "positive"; 
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
    if (item.get("tier") & item.get("tier") !== " ") {
        let item_desc_elem = document.createElement('p');
        item_desc_elem.classList.add('itemp');
        item_desc_elem.classList.add('left');
        item_desc_elem.classList.add(item.get("tier"));
        item_desc_elem.textContent = item.get("tier")+" "+item.get("type");
        parent_div.append(item_desc_elem);
    }
}

function displayFixedID(active, id, value, elemental_format, style) {
    if (style) {
        if(reversedIDs.filter(e => e !== "atkTier").includes(id)){
            style === "positive" ? style = "negative" : style = "positive"; 
        }
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
function displayEquipOrder(parent_elem,buildOrder){
    parent_elem.textContent = "";
    const order = buildOrder.slice();
    let title_elem = document.createElement("p");
    title_elem.textContent = "Equip order ";
    title_elem.classList.add("title");
    title_elem.classList.add("Normal");
    title_elem.classList.add("itemp");
    parent_elem.append(title_elem);
    parent_elem.append(document.createElement("br"));
    for (const item of order) {
        let p_elem = document.createElement("p");
        p_elem.classList.add("itemp");
        p_elem.classList.add("left");
        p_elem.textContent = item.get("displayName");
        parent_elem.append(p_elem);
    }
}

function displayMeleeDamage(parent_elem, overallparent_elem, meleeStats){
    let attackSpeeds = ["Super Slow", "Very Slow", "Slow", "Normal", "Fast", "Very Fast", "Super Fast"];
    //let damagePrefixes = ["Neutral Damage: ","Earth Damage: ","Thunder Damage: ","Water Damage: ","Fire Damage: ","Air Damage: "];
    parent_elem.textContent = "";
    overallparent_elem.textContent = "";
    const stats = meleeStats.slice();
    
    for (let i = 0; i < 6; ++i) {
        for (let j in stats[i]) {
            stats[i][j] = stats[i][j].toFixed(2);
        }
    }
    for (let i = 6; i < 8; ++i) {
        for (let j = 0; j < 2; j++) {
            stats[i][j] = stats[i][j].toFixed(2);
        }
    }
    for (let i = 8; i < 11; ++i){
        stats[i] = stats[i].toFixed(2);
    }
    
    //title
    let title_elem = document.createElement("p");
    title_elem.classList.add("title");
    title_elem.classList.add("Normal");
    title_elem.classList.add("itemp");
    title_elem.textContent = "Melee Stats";
    parent_elem.append(title_elem);
    parent_elem.append(document.createElement("br"));

    //overall title
    let title_elemavg = document.createElement("p");
    title_elemavg.classList.add("title");
    title_elemavg.classList.add("Normal");
    title_elemavg.textContent = "Melee Stats";
    overallparent_elem.append(title_elemavg);
    
    //average DPS
    let averageDamage = document.createElement("p");
    averageDamage.classList.add("left");
    averageDamage.classList.add("itemp");
    averageDamage.textContent = "Average DPS: " + stats[10];
    parent_elem.append(averageDamage);

    //overall average DPS
    let overallaverageDamage = document.createElement("p");
    overallaverageDamage.classList.add("itemp");
    overallaverageDamage.textContent = "Average DPS: " + stats[10];
    overallparent_elem.append(overallaverageDamage);
    overallparent_elem.append(document.createElement("br"));

    //attack speed
    let atkSpd = document.createElement("p");
    atkSpd.classList.add("left");
    atkSpd.classList.add("itemp");
    atkSpd.textContent = "Attack Speed: " + attackSpeeds[stats[11]];
    parent_elem.append(atkSpd);
    parent_elem.append(document.createElement("br"));

    //overall attack speed
    let overallatkSpd = document.createElement("p");
    overallatkSpd.classList.add("center");
    overallatkSpd.classList.add("itemp");
    overallatkSpd.textContent = "Attack Speed: " + attackSpeeds[stats[11]];
    overallparent_elem.append(overallatkSpd);
    overallparent_elem.append(document.createElement("br"));

    //Non-Crit: n->elem, total dmg, DPS
    let nonCritStats = document.createElement("p");
    nonCritStats.classList.add("left");
    nonCritStats.classList.add("itemp");
    nonCritStats.textContent = "Non-Crit Stats: ";
    nonCritStats.append(document.createElement("br"));
    for (let i = 0; i < 6; i++){
        if(stats[i][0] > 0){
            let dmg = document.createElement("p");
            dmg.textContent = stats[i][0] + "-" + stats[i][1];
            dmg.classList.add(damageClasses[i]);
            dmg.classList.add("itemp");
            nonCritStats.append(dmg);
        }
    }
    let normalDamage = document.createElement("p");
    normalDamage.textContent = "Total: " + stats[6][0] + "-" + stats[6][1];
    normalDamage.classList.add("itemp");
    nonCritStats.append(normalDamage);

    let normalDPS = document.createElement("p");
    normalDPS.textContent = "Normal DPS: " + stats[8];
    normalDPS.classList.add("itemp");
    nonCritStats.append(normalDPS);
    
    let normalChance = document.createElement("p");
    normalChance.textContent = "Non-Crit Chance: " + (stats[6][2]*100).toFixed(2) + "%"; 
    normalChance.classList.add("itemp");
    normalChance.append(document.createElement("br"));
    normalChance.append(document.createElement("br"));
    nonCritStats.append(normalChance);

    parent_elem.append(nonCritStats);
    parent_elem.append(document.createElement("br"));

    //Crit: n->elem, total dmg, DPS
    let critStats = document.createElement("p");
    critStats.classList.add("left");
    critStats.classList.add("itemp");
    critStats.textContent = "Crit Stats: ";
    critStats.append(document.createElement("br"));
    for (let i = 0; i < 6; i++){
        if(stats[i][2] > 0){
            dmg = document.createElement("p");
            dmg.textContent = stats[i][2] + "-" + stats[i][3];
            dmg.classList.add(damageClasses[i]);
            dmg.classList.add("itemp");
            critStats.append(dmg);
        }
    }
    let critDamage = document.createElement("p");
    critDamage.textContent = "Total: " + stats[7][0] + "-" + stats[7][1];
    critDamage.classList.add("itemp");
    critStats.append(critDamage);

    let critDPS = document.createElement("p");
    critDPS.textContent = "Crit DPS: " + stats[9];
    critDPS.classList.add("itemp");
    critStats.append(critDPS);

    let critChance = document.createElement("p");
    critChance.textContent = "Crit Chance: " + (stats[7][2]*100).toFixed(2) + "%";
    critChance.classList.add("itemp");
    critChance.append(document.createElement("br"));
    critChance.append(document.createElement("br"));
    critStats.append(critChance);

    parent_elem.append(critStats);
}
function displayDefenseStats(parent_elem,defenseStats){
    parent_elem.textContent = "";
    const stats = defenseStats.slice();    
    let title_elem = document.createElement("p");
    title_elem.textContent = "Defense Stats";
    title_elem.classList.add("title");
    title_elem.classList.add("Normal");
    title_elem.classList.add("itemp");
    parent_elem.append(title_elem);
    parent_elem.append(document.createElement("br"));
    let statsTable = document.createElement("table");
    statsTable.classList.add("itemtable");

    //[total hp, ehp, total hpr, ehpr, [def%, agi%], [edef,tdef,wdef,fdef,adef]]
    for(const i in stats){
        if(typeof stats[i] === "number"){
            stats[i] = stats[i].toFixed(2);
        }else{
            for(const j in stats[i]){
                stats[i][j] = stats[i][j].toFixed(2);
            }
        }
    }
    //total HP
    let hpRow = document.createElement("tr");
    let hp = document.createElement("td");
    hp.classList.add("Health");
    hp.classList.add("left");
    hp.textContent = "HP:";  
    let boost = document.createElement("td");
    boost.textContent = stats[0];
    boost.classList.add("right");
    
    hpRow.appendChild(hp);
    hpRow.append(boost);
    statsTable.appendChild(hpRow);
    //EHP
    let ehpRow = document.createElement("tr");
    let ehp = document.createElement("td");
    ehp.classList.add("left");
    ehp.textContent = "Effective HP:";

    boost = document.createElement("td");
    boost.textContent = stats[1][0];
    boost.classList.add("right");

    ehpRow.appendChild(ehp);
    ehpRow.append(boost);
    statsTable.append(ehpRow);

    ehpRow = document.createElement("tr");
    ehp = document.createElement("td");
    ehp.classList.add("left");
    ehp.textContent = "Effective HP (no agi):";

    boost = document.createElement("td");
    boost.textContent = stats[1][1];
    boost.classList.add("right");

    ehpRow.appendChild(ehp);
    ehpRow.append(boost);
    statsTable.append(ehpRow);

    //total HPR
    let hprRow = document.createElement("tr");
    let hpr = document.createElement("td");
    hpr.classList.add("Health");
    hpr.classList.add("left");
    hpr.textContent = "HP Regen:";  
    boost = document.createElement("td");
    boost.textContent = stats[2];
    boost.classList.add("right");

    hprRow.appendChild(hpr);
    hprRow.appendChild(boost);
    statsTable.appendChild(hprRow);
    //EHPR
    let ehprRow = document.createElement("tr");
    let ehpr = document.createElement("td");
    ehpr.classList.add("left");
    ehpr.textContent = "Effective HP Regen:";

    boost = document.createElement("td");
    boost.textContent = stats[3][0];
    boost.classList.add("right");

    ehprRow.appendChild(ehpr);
    ehprRow.append(boost);
    statsTable.append(ehprRow);

    ehprRow = document.createElement("tr");
    ehpr = document.createElement("td");
    ehpr.classList.add("left");
    ehpr.textContent = "Effective HP Regen (no agi):";

    boost = document.createElement("td");
    boost.textContent = stats[3][1];
    boost.classList.add("right");

    ehprRow.appendChild(ehpr);
    ehprRow.append(boost);
    statsTable.append(ehprRow);
    //eledefs
    let eledefs = stats[5];
    for (let i = 0; i < eledefs.length; i++){
        let eledefElemRow = document.createElement("tr");

        let eledef = document.createElement("td");
        eledef.classList.add("left")
        let eledefTitle = document.createElement("b");
        eledefTitle.textContent = damageClasses[i+1];
        eledefTitle.classList.add(damageClasses[i+1]);

        let defense = document.createElement("b");
        defense.textContent = " Def: ";

        eledef.appendChild(eledefTitle);
        eledef.appendChild(defense);
        eledefElemRow.appendChild(eledef);

        let boost = document.createElement("td");
        boost.textContent = eledefs[i];
        boost.classList.add("right");
        eledefElemRow.appendChild(boost);

        statsTable.appendChild(eledefElemRow);
    }
    //skp
    let defRow = document.createElement("tr");
    let defElem = document.createElement("td");
    defElem.classList.add("left");
    defElem.textContent = "Damage Absorbed %:";
    boost = document.createElement("td");
    boost.classList.add("right");
    boost.textContent = stats[4][0] + "%";
    defRow.appendChild(defElem);
    defRow.appendChild(boost);
    statsTable.append(defRow);

    let agiRow = document.createElement("tr");
    let agiElem = document.createElement("td");
    agiElem.classList.add("left");
    agiElem.textContent = "Dodge Chance %:";
    boost = document.createElement("td");
    boost.classList.add("right");
    boost.textContent = stats[4][1] + "%";
    agiRow.appendChild(agiElem);
    agiRow.appendChild(boost);
    statsTable.append(agiRow);

    parent_elem.append(statsTable);
}
function displaySpellDamage(parent_elem, overallparent_elem, build, spell, spellIdx) {
    parent_elem.textContent = "";

    const stats = build.statMap;
    let title_elem = document.createElement("p");
    title_elem.classList.add("title");
    title_elem.classList.add("Normal");

    overallparent_elem.textContent = "";
    let title_elemavg = document.createElement("p");
    title_elemavg.classList.add('title');
    title_elemavg.classList.add('Normal');

    if (spellIdx != 0) {
        title_elem.textContent = spell.title + " (" + build.getSpellCost(spellIdx, spell.cost) + ")";
        title_elemavg.textContent = spell.title + " (" + build.getSpellCost(spellIdx, spell.cost) + ")";
    }
    else {
        title_elem.textContent = spell.title;
        title_elemavg.textContent = spell.title;
    }

    parent_elem.append(title_elem);
    overallparent_elem.append(title_elemavg);

    let critChance = skillPointsToPercentage(build.total_skillpoints[1]);

    let save_damages = [];

    for (const part of spell.parts) {
        parent_elem.append(document.createElement("br"));
        let part_div = document.createElement("p");
        parent_elem.append(part_div);

        let part_divavg = document.createElement("p");
        overallparent_elem.append(part_divavg);

        let subtitle_elem = document.createElement("p");
        subtitle_elem.textContent = part.subtitle;
        part_div.append(subtitle_elem);

        if (part.summary == true) {
            let subtitle_elemavg = document.createElement("p");
            subtitle_elemavg.textContent = part.subtitle;
            part_divavg.append(subtitle_elemavg);
        }
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

            if (part.summary == true) {
                let overallaverageLabel = document.createElement("p");
                overallaverageLabel.textContent = "Average: "+averageDamage.toFixed(2);
                overallaverageLabel.classList.add("damageSubtitle");
                part_divavg.append(overallaverageLabel);
            }

            let nonCritLabel = document.createElement("p");
            nonCritLabel.textContent = "Non-Crit Average: "+nonCritAverage.toFixed(2);
            nonCritLabel.classList.add("damageSubtitle");
            part_div.append(nonCritLabel);
            
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
            let heal_amount = (part.strength * build.getDefenseStats()[0] * Math.max(0, Math.min(1.5, 1 + 0.05 * stats.get("wDamPct")/100))).toFixed(2);
            let healLabel = document.createElement("p");
            healLabel.textContent = heal_amount;
            healLabel.classList.add("damagep");
            part_div.append(healLabel);
            if (part.summary == true) {
                let overallhealLabel = document.createElement("p");
                overallhealLabel.textContent = heal_amount;
                overallhealLabel.classList.add("damagep")
                part_divavg.append(overallhealLabel);
            }
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

            let overallaverageLabel = document.createElement("p");
            overallaverageLabel.textContent = "Average: "+total_damage.toFixed(2);
            overallaverageLabel.classList.add("damageSubtitle");
            part_divavg.append(overallaverageLabel);
        }
    }
}
