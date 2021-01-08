let nonRolledIDs = ["name", "displayName", "tier", "set", "slots", "type", "material", "drop", "quest", "restrict", "nDam", "fDam", "wDam", "aDam", "tDam", "eDam", "atkSpd", "hp", "fDef", "wDef", "aDef", "tDef", "eDef", "lvl", "classReq", "strReq", "dexReq", "intReq", "defReq", "agiReq","str", "dex", "int", "agi", "def", "fixID", "category", "id"];
let rolledIDs = ["hprPct", "mr", "sdPct", "mdPct", "ls", "ms", "xpb", "lb", "ref", "thorns", "exploding", "spd", "atkTier", "poison", "hpBonus", "spRegen", "eSteal", "hprRaw", "sdRaw", "mdRaw", "fDamPct", "wDamPct", "aDamPct", "tDamPct", "eDamPct", "fDefPct", "wDefPct", "aDefPct", "tDefPct", "eDefPct", "spPct1", "spRaw1", "spPct2", "spRaw2", "spPct3", "spRaw3", "spPct4", "spRaw4", "rainbowRaw", "sprint", "sprintReg", "jh", "lq", "gXp", "gSpd"];
let stackingIDs = ["hprPct", "mr", "sdPct", "mdPct", "ls", "ms", "xpb", "lb", "ref", "thorns", "exploding", "spd", "atkTier", "poison", "hpBonus", "spRegen", "eSteal", "hprRaw", "sdRaw", "mdRaw", "fDamPct", "wDamPct", "aDamPct", "tDamPct", "eDamPct", "fDefPct", "wDefPct", "aDefPct", "tDefPct", "eDefPct", "spPct1", "spRaw1", "spPct2", "spRaw2", "spPct3", "spRaw3", "spPct4", "spRaw4", "rainbowRaw", "sprint", "sprintReg", "jh", "lq", "gXp", "gSpd", "fDef", "wDef", "aDef", "tDef", "eDef", "str", "dex", "int", "agi", "def"];
let standaloneIDs = ["name", "displayName", "tier", "set", "slots", "type", "material", "drop", "quest", "restrict", "nDam", "fDam", "wDam", "aDam", "tDam", "eDam", "atkSpd", "hp", "lvl", "classReq", "fixID", "category", "id"];

function expandItem(item){
    let minRolls = new Map();
    let maxRolls = new Map();
    let expandedItem = new Map();
    if(item.fixID){ //The item has fixed IDs.
        expandedItem.set("fixID",true);
        for (const id of rolledIDs){ //all rolled IDs are numerical
            if(item[id]) {
                minRolls.set(id,item[id]);
                maxRolls.set(id,item[id]);
            }
        }
    }else{ //The item does not have fixed IDs.
        for (const id of rolledIDs){
            if(item[id]){
                if(item[id] > 0){ // positive rolled IDs                   
                    minRolls.set(id,idRound(item[id]*0.3));
                    maxRolls.set(id,idRound(item[id]*1.3));
                }else if(item[id] < 0){ //negative rolled IDs
                    minRolls.set(id,idRound(item[id]*1.3));
                    maxRolls.set(id,idRound(item[id]*0.7));
                }else{//Id = 0
                    minRolls.set(id,0);
                    maxRolls.set(id,0);
                }
            }
        }
    }
    for (const id of nonRolledIDs){
        if(item[id]){
            expandedItem.set(id,item[id]);
        }
    }
    expandedItem.set("minRolls",minRolls);
    expandedItem.set("maxRolls",maxRolls);
    return expandedItem;
}

function displayExpandedItem(item, parent_id){
    // Commands to "script" the creation of nice formatting.
    // #commands create a new element.
    // !elemental is some janky hack for elemental damage.
    // normals just display a thing.
    let display_commands = [
        "#cdiv",
        "displayName",
        "#ldiv",
        "atkSpd",
        "#ldiv",
        "!elemental",
        "hp",
        "nDam", "eDam", "tDam", "wDam", "fDam", "aDam",
        "eDef", "tDef", "wDef", "fDef", "aDef",
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
        "exploding",
        "spd",
        "atkTier",
        "!elemental",
        "eDamPct", "tDamPct", "wDamPct", "fDamPct", "aDamPct",
        "eDefPct", "tDefPct", "wDefPct", "fDefPct", "aDefPct",
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

    let idPrefixes = {"displayName": "", "lvl":"Combat Level Min: ", "classReq":"Class Req: ","strReq":"Strength Min: ","dexReq":"Dexterity Min: ","intReq":"Intelligence Min: ","defReq":"Defense Min: ","agiReq":"Agility Min: ", "nDam":"Neutral Damage: ", "eDam":"Earth Damage: ", "tDam":"Thunder Damage: ", "wDam":"Water Damage: ", "fDam":"Fire Damage: ", "aDam":"Air Damage: ", "atkSpd":"Attack Speed: ", "hp":"Health : ", "eDef":"Earth Defense: ", "tDef":"Thunder Defense: ", "wDef":"Water Defense: ", "fDef":"Fire Defense: ", "aDef":"Air Defense: ", "str":"Strength: ", "dex":"Dexterity: ", "int":"Intelligence: ", "def":"Defense: ","agi":"Agility: ", "hpBonus":"Health Bonus: ", "hprRaw":"Health Regen Raw: ", "hprPct":"Health Regen %: ", "sdRaw":"Raw Spell Damage: ", "sdPct":"Spell Damage %: ", "mdRaw":"Main Attack Neutral Damage: ", "mdPct":"Main Attack Damage %: ", "mr":"Mana Regen: ", "ms":"Mana Steal: ", "ref":"Reflection: ", "ls":"Life Steal: ", "poison":"Poison: ", "thorns":"Thorns: ", "exploding":"Expoding: ", "spd":"Walk Speed Bonus: ", "atkTier":"Attack Speed Bonus: ",  "eDamPct":"Earth Damage %: ", "tDamPct":"Thunder Damage %: ", "wDamPct":"Water Damage %: ", "fDamPct":"Fire Damage %: ", "aDamPct":"Air Damage %: ", "eDefPct":"Earth Defense %: ", "tDefPct":"Thunder Defense %: ", "wDefPct":"Water Defense %: ", "fDefPct":"Fire Defense %: ", "aDefPct":"Air Defense %: ", "spPct1":"1st Spell Cost %: ", "spRaw1":"1st Spell Cost Raw: ", "spPct2":"2nd Spell Cost %: ", "spRaw2":"2nd Spell Cost Raw: ", "spPct3":"3rd Spell Cost %: ", "spRaw3":"3rd Spell Cost Raw: ", "spPct4":"4th Spell Cost %: ", "spRaw4":"4th Spell Cost Raw: ", "rainbowRaw":"Rainbow Spell Damage Raw: ", "sprint":"Sprint Bonus: ", "sprintReg":"Sprint Regen Bonus: ", "jh":"Jump Height: ", "xpb":"Combat XP Bonus: ", "lb":"Loot Bonus: ", "lq":"Loot Quality: ", "spRegen":"Soul Point Regen: ", "eSteal":"Stealing: ", "gXp":"Gathering XP Bonus: ", "gSpd":"Gathering Speed Bonus: ", "slots":"Powder Slots: ", "set":"Set: ", "quest":"Quest Req: ", "restrict":""};
    let idSuffixes = {"displayName": "", "lvl":"", "classReq":"","strReq":"","dexReq":"","intReq":"","defReq":"","agiReq":"", "nDam":"", "eDam":"", "tDam":"", "wDam":"", "fDam":"", "aDam":"", "atkSpd":"", "hp":"", "eDef":"", "tDef":"", "wDef":"", "fDef":"", "aDef":"", "str":"", "dex":"", "int":"", "def":"","agi":"", "hpBonus":"", "hprRaw":"", "hprPct":"%", "sdRaw":"", "sdPct":"%", "mdRaw":"", "mdPct":"%", "mr":"/4s", "ms":"/4s", "ref":"%", "ls":"/4s", "poison":"/3s", "thorns":"%", "exploding":"%", "spd":"%", "atkTier":" tier",  "eDamPct":"%", "tDamPct":"%", "wDamPct":"%", "fDamPct":"%", "aDamPct":"%", "eDefPct":"%", "tDefPct":"%", "wDefPct":"%", "fDefPct":"%", "aDefPct":"%", "spPct1":"%", "spRaw1":"", "spPct2":"%", "spRaw2":"", "spPct3":"%", "spRaw3":"", "spPct4":"%", "spRaw4":"", "rainbowRaw":"", "sprint":"%", "sprintReg":"%", "jh":"", "xpb":"%", "lb":"%", "lq":"%", "spRegen":"%", "eSteal":"%", "gXp":"%", "gSpd":"%", "slots":"", "set":" set.", "quest":"", "restrict":""};

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
                let p_elem = document.createElement('p');
                p_elem.classList.add('itemp');
                if (elemental_format) {
                    // HACK TO AVOID DISPLAYING ZERO DAMAGE! TODO
                    if (item.get(id) === "0-0") {
                        continue;
                    }
                    apply_elemental_format(p_elem, id, item.get(id));
                }
                else {
                    p_elem.textContent = idPrefixes[id].concat(item.get(id), idSuffixes[id]);
                }
                active_elem.appendChild(p_elem);
            }
            else if(rolledIDs.includes(id)&& item.get("minRolls").get(id)){ // && item.get("maxRolls").get(id) ){//rolled ID & non-0/non-null/non-und ID
                let row = document.createElement('tr');
                let style = "positive";
                if (item.get("minRolls").get(id) < 0) {
                    style = "negative";
                }
                if (fix_id) {
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
                    value_elem.textContent = item.get("minRolls").get(id) + idSuffixes[id];
                    row.appendChild(value_elem);
                }
                else {
                    let min_elem = document.createElement('td');
                    min_elem.classList.add('left');
                    min_elem.classList.add(style);
                    min_elem.textContent = item.get("minRolls").get(id) + idSuffixes[id];
                    row.appendChild(min_elem);

                    let desc_elem = document.createElement('td');
                    desc_elem.classList.add('center');
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
                }
                active_elem.appendChild(row);
            }//Just don't do anything if else
        }
    }
    let item_desc_elem = document.createElement('p');
    item_desc_elem.classList.add('itemp');
    item_desc_elem.classList.add('left');
    item_desc_elem.textContent = item.get("tier")+" "+item.get("type");
    parent_div.append(item_desc_elem);
}
