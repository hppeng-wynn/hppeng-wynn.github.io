let nonRolledIDs = ["name", "displayName", "tier", "set", "slots", "type", "material", "drop", "quest", "restrict", "nDam", "fDam", "wDam", "aDam", "tDam", "eDam", "atkSpd", "hp", "fDef", "wDef", "aDef", "tDef", "eDef", "lvl", "classReq", "strReq", "dexReq", "intReq", "agiReq", "defReq","str", "dex", "int", "agi", "def", "fixID", "category", "id"];
let rolledIDs = ["hprPct", "mr", "sdPct", "mdPct", "ls", "ms", "xpb", "lb", "ref", "thorns", "exploding", "spd", "atkTier", "poison", "hpBonus", "spRegen", "eSteal", "hprRaw", "sdRaw", "mdRaw", "fDamPct", "wDamPct", "aDamPct", "tDamPct", "eDamPct", "fDefPct", "wDefPct", "aDefPct", "tDefPct", "eDefPct", "spPct1", "spRaw1", "spPct2", "spRaw2", "spPct3", "spRaw3", "spPct4", "spRaw4", "rainbowRaw", "sprint", "sprintReg", "jh", "lq", "gXp", "gSpd"];
let stackingIDs = ["hprPct", "mr", "sdPct", "mdPct", "ls", "ms", "xpb", "lb", "ref", "thorns", "exploding", "spd", "atkTier", "poison", "hpBonus", "spRegen", "eSteal", "hprRaw", "sdRaw", "mdRaw", "fDamPct", "wDamPct", "aDamPct", "tDamPct", "eDamPct", "fDefPct", "wDefPct", "aDefPct", "tDefPct", "eDefPct", "spPct1", "spRaw1", "spPct2", "spRaw2", "spPct3", "spRaw3", "spPct4", "spRaw4", "rainbowRaw", "sprint", "sprintReg", "jh", "lq", "gXp", "gSpd", "fDef", "wDef", "aDef", "tDef", "eDef", "str", "dex", "int", "agi", "def"];
let standaloneIDs = ["name", "displayName", "tier", "set", "slots", "type", "material", "drop", "quest", "restrict", "nDam", "fDam", "wDam", "aDam", "tDam", "eDam", "atkSpd", "hp", "lvl", "classReq", "strReq", "dexReq", "intReq", "agiReq", "defReq", "fixID", "category", "id"];

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
    // normals just display a thing.
    let display_commands = [
        "#cdiv",
        "displayName",
        "#ldiv",
        "atkSpd",
        "#ldiv",
        "nDam", "eDam", "tDam", "wDam", "tDam", "aDam"]
    let rest_TMP = [
        "lvl",
        "classReq",
        "strReq", "dexReq", "intReq", "defReq","agiReq",
        "hp",
        "eDef", "tDef", "wDef", "fDef", "aDef",
        "str", "dex", "int", "agi", "def",
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
        "eDamPct", "tDamPct", "wDamPct", "fDamPct", "aDamPct",
        "eDefPct", "tDefPct", "wDefPct", "fDefPct", "aDefPct",
        "spPct1", "spRaw1", "spPct2", "spRaw2", "spPct3", "spRaw3", "spPct4", "spRaw4",
        "rainbowRaw",
        "sprint", "sprintReg",
        "jh",
        "xpb", "lb", "lq",
        "spRegen",
        "eSteal",
        "gXp", "gSpd",
        "slots",
        "set",
        "quest",
        "restrict"];

    let idPrefixes = {"displayName": "", "lvl":"Combat Level Min: ", "classReq":"Class Req: ","strReq":"Strength Min: ","dexReq":"Dexterity Min: ","intReq":"Intelligence Min: ","defReq":"Defense Min: ","agiReq":"Agility Min: ", "nDam":"Neutral Damage: ", "eDam":"Earth Damage: ", "tDam":"Thunder Damage: ", "wDam":"Water Damage: ", "fDam":"Fire Damage: ", "aDam":"Air Damage: ", "atkSpd":"Attack Speed: ", "hp":"Health: ", "eDef":"Earth Defense: ", "tDef":"Thunder Defense: ", "wDef":"Water Defense: ", "fDef":"Fire Defense: ", "aDef":"Air Defense: ", "str":"Strength: ", "dex":"Dexterity: ", "int":"Intelligence: ", "def":"Defense: ","agi":"Agility: ", "hpBonus":"Health Bonus: ", "hprRaw":"Health Regen Raw: ", "hprPct":"Health Regen %: ", "sdRaw":"Raw Spell Damage: ", "sdPct":"Spell Damage %: ", "mdRaw":"Main Attack Neutral Damage: ", "mdPct":"Main Attack Damage %: ", "mr":"Mana Regen: ", "ms":"Mana Steal: ", "ref":"Reflection: ", "ls":"Life Steal: ", "poison":"Poison: ", "thorns":"Thorns: ", "exploding":"Expoding: ", "spd":"Walk Speed Bonus: ", "atkTier":"Attack Speed Bonus: ",  "eDamPct":"Earth Damage %: ", "tDamPct":"Thunder Damage %: ", "wDamPct":"Water Damage %: ", "fDamPct":"Fire Damage %: ", "aDamPct":"Air Damage %: ", "eDefPct":"Earth Defense %: ", "tDefPct":"Thunder Defense %: ", "wDefPct":"Water Defense %: ", "fDefPct":"Fire Defense %: ", "aDefPct":"Air Defense %: ", "spPct1":"1st Spell Cost %: ", "spRaw1":"1st Spell Cost Raw: ", "spPct2":"2nd Spell Cost %: ", "spRaw2":"2nd Spell Cost Raw: ", "spPct3":"3rd Spell Cost %: ", "spRaw3":"3rd Spell Cost Raw: ", "spPct4":"4th Spell Cost %: ", "spRaw4":"4th Spell Cost Raw: ", "rainbowRaw":"Rainbow Spell Damage Raw: ", "sprint":"Sprint Bonus: ", "sprintReg":"Sprint Regen Bonus: ", "jh":"Jump Height: ", "xpb":"Combat XP Bonus: ", "lb":"Loot Bonus: ", "lq":"Loot Quality: ", "spRegen":"Soul Point Regen: ", "eSteal":"Stealing: ", "gXp":"Gathering XP Bonus: ", "gSpd":"Gathering Speed Bonus: ", "slots":"Powder Slots: ", "set":"This item belongs to the ", "quest":"This item is from the quest<br>", "restrict":""};
    let idSuffixes = {"displayName": "", "lvl":"", "classReq":"","strReq":"","dexReq":"","intReq":"","defReq":"","agiReq":"", "nDam":"", "eDam":"", "tDam":"", "wDam":"", "fDam":"", "aDam":"", "atkSpd":"", "hp":"", "eDef":"", "tDef":"", "wDef":"", "fDef":"", "aDef":"", "str":"", "dex":"", "int":"", "def":"","agi":"", "hpBonus":"", "hprRaw":"", "hprPct":"%", "sdRaw":"", "sdPct":"%", "mdRaw":"", "mdPct":"%", "mr":"/4s", "ms":"/4s", "ref":"%", "ls":"/4s", "poison":"/3s", "thorns":"%", "exploding":"%", "spd":"%", "atkTier":" tier",  "eDamPct":"%", "tDamPct":"%", "wDamPct":"%", "fDamPct":"%", "aDamPct":"%", "eDefPct":"%", "tDefPct":"%", "wDefPct":"%", "fDefPct":"%", "aDefPct":"%", "spPct1":"%", "spRaw1":"", "spPct2":"%", "spRaw2":"", "spPct3":"%", "spRaw3":"", "spPct4":"%", "spRaw4":"", "rainbowRaw":"", "sprint":"%", "sprintReg":"%", "jh":"", "xpb":"%", "lb":"%", "lq":"%", "spRegen":"%", "eSteal":"%", "gXp":"%", "gSpd":"%", "slots":"", "set":" set.", "quest":".", "restrict":""};

    // Clear the parent div.
    setHTML(parent_id, "");
    let parent_div = document.getElementById(parent_id);
    
    let active_elem;
    
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
            parent_div.appendChild(active_elem);
        }
        else {
            let id = command;
            console.log(id);
            let new_elem;
            if(nonRolledIDs.includes(id) && item.get(id)){//nonRolledID & non-0/non-null/non-und ID
                new_elem = document.createElement('p');
                new_elem.textContent = idPrefixes[id].concat(item.get(id), idSuffixes[id]);
            }
//            if(rolledIDs.includes(id)&& item.get("minRolls").get(id) && item.get("maxRolls").get(id) ){//rolled ID & non-0/non-null/non-und ID
//                itemString = itemString.concat(idPrefixes[id]);
//                itemString = itemString.concat(item.get("minRolls").get(id), idSuffixes[id],"<br>");
//            }//Just don't do anything if else
            if (new_elem) {
                active_elem.appendChild(new_elem);
            }
        }
    }
    

//    if(item.has("fixID") && item.get("fixID")){//fixed IDs
//        for(i = 0; i < ids.length; i++){ //iterate the ids
//            if(nonRolledIDs.includes(ids[i]) && item.get(ids[i])){//nonRolledID & non-0/non-null/non-und ID
//                itemString = itemString.concat(idPrefixes[ids[i]]);
//                itemString = itemString.concat(item.get(ids[i]), idSuffixes[ids[i]],"<br>");
//            }
//            if(rolledIDs.includes(ids[i])&& item.get("minRolls").get(ids[i]) && item.get("maxRolls").get(ids[i]) ){//rolled ID & non-0/non-null/non-und ID
//                itemString = itemString.concat(idPrefixes[ids[i]]);
//                itemString = itemString.concat(item.get("minRolls").get(ids[i]), idSuffixes[ids[i]],"<br>");
//            }//Just don't do anything if else
//        }
//    }else{//non-fixed IDs
//        for(i = 0; i < ids.length; i++){ //iterate the ids
//            if(nonRolledIDs.includes(ids[i]) && item.get(ids[i])){//nonRolledID & non-0/non-null/non-und ID
//                itemString = itemString.concat(idPrefixes[ids[i]]);
//                itemString = itemString.concat(item.get(ids[i]), idSuffixes[ids[i]],"<br>");
//            }
//            if(rolledIDs.includes(ids[i])&& item.get("minRolls").get(ids[i]) && item.get("maxRolls").get(ids[i]) ){//rolled ID & non-0/non-null/non-und ID
//                itemString = itemString.concat(idPrefixes[ids[i]]);
//                itemString = itemString.concat(item.get("minRolls").get(ids[i]), idSuffixes[ids[i]], " -> ", idRound(item.get("maxRolls").get(ids[i])),idSuffixes[ids[i]],"<br>");
//            }//Just don't do anything if else
//        }
//    }
//    itemString = itemString.concat("<br>",item.get("tier")," ", item.get("type"));
}
