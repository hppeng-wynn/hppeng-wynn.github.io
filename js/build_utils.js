/*Turns the input amount of skill points into a float precision percentage.
* @param skp - the integer skillpoint count to be converted
*/
function skillPointsToPercentage(skp){
    if (skp<=0) {
        return 0.0;
    } else if (skp>=150) {
        skp = 150;
    }
    const r = 0.9908;
    return ((1 - Math.pow(r, skp + 1)) / (1 - r) - 1) / 100.0;
        //return (-0.0000000066695* Math.pow(Math.E, -0.00924033 * skp + 18.9) + 1.0771);
        //return(-0.0000000066695* Math.pow(Math.E, -0.00924033 * skp + 18.9) + 1.0771).toFixed(3);
    //return Math.min(Math.max(0.00,(-0.0000000066695* Math.pow(Math.E, -0.00924033 * skp + 18.9) + 1.0771)),.808); 
    //return clamp((-0.0000000066695* Math.pow(Math.E, -0.00924033 * skp + 18.9) + 1.0771), 0.00, 0.808);
}

// WYNN2: Skillpoint max scaling. Intel is cost reduction
const skillpoint_final_mult = [1, 1, 0.5, 0.867, 0.951];
// intel damage and water%
const skillpoint_damage_mult = [1, 1, 1, 0.867, 0.951];

/*Turns the input amount of levels into skillpoints available.
*
* @param level - the integer level count to be converted
*/
function levelToSkillPoints(level){
    if(level < 1){
        return 0;
    }else if(level >= 101){
        return 200;
    }else{
        return (level - 1) * 2;
    }
}

/*Turns the input amount of levels in to base HP.
* @param level - the integer level count to be converted
*/
function levelToHPBase(level){
    if(level < 1){ //bad level
        return this.levelToHPBase(1);
    }else if (level > 106){ //also bad level
        return this.levelToHPBase(106);
    }else{ //good level
        return 5*level + 5;
    }
}

const skp_order = ["str","dex","int","def","agi"];
const skill = ["Strength", "Dexterity", "Intelligence", "Defense", "Agility"];
const skp_elements = ["e","t","w","f","a"];
const damageClasses = ["Neutral","Earth","Thunder","Water","Fire","Air"];
const damage_keys = [ "nDam_", "eDam_", "tDam_", "wDam_", "fDam_", "aDam_" ];
// Set up item lists for quick access later.
const armorTypes = [ "helmet", "chestplate", "leggings", "boots" ];
const accessoryTypes = [ "ring", "bracelet", "necklace" ];
const weaponTypes = [ "wand", "spear", "bow", "dagger", "relik" ];
const consumableTypes = [ "potion", "scroll", "food"];
const tome_types = ['weaponTome', 'armorTome', 'guildTome'];
const attackSpeeds = ["SUPER_SLOW", "VERY_SLOW", "SLOW", "NORMAL", "FAST", "VERY_FAST", "SUPER_FAST"];
const baseDamageMultiplier = [ 0.51, 0.83, 1.5, 2.05, 2.5, 3.1, 4.3 ];
//0.51, 0.82, 1.50, 2.05, 2.50, 3.11, 4.27
const classes = ["Warrior", "Assassin", "Mage", "Archer", "Shaman"];
const wep_to_class = new Map([["dagger", "Assassin"], ["spear", "Warrior"], ["wand", "Mage"], ["bow", "Archer"], ["relik", "Shaman"]])
const tiers = ["Normal", "Unique", "Rare", "Legendary", "Fabled", "Mythic", "Set", "Crafted"] //I'm not sure why you would make a custom crafted but if you do you should be able to use it w/ the correct powder formula
const all_types = armorTypes.concat(accessoryTypes).concat(weaponTypes).concat(consumableTypes).concat(tome_types).map(x => x.substring(0,1).toUpperCase() + x.substring(1));
//weaponTypes.push("sword");
//console.log(types)
let itemTypes = armorTypes.concat(accessoryTypes).concat(weaponTypes).concat(tome_types);

let elementIcons = ["\u2724","\u2726", "\u2749", "\u2739", "\u274b" ];
let skpReqs = skp_order.map(x => x + "Req");

let item_fields = [ "name", "displayName", "lore", "color", "tier", "set", "slots", "type", "material", "drop", "quest", "restrict", "nDam", "fDam", "wDam", "aDam", "tDam", "eDam", "atkSpd", "hp", "fDef", "wDef", "aDef", "tDef", "eDef", "lvl", "classReq", "strReq", "dexReq", "intReq", "defReq", "agiReq", "hprPct", "mr", "sdPct", "mdPct", "ls", "ms", "xpb", "lb", "ref", "str", "dex", "int", "agi", "def", "thorns", "expd", "spd", "atkTier", "poison", "hpBonus", "spRegen", "eSteal", "hprRaw", "sdRaw", "mdRaw", "fDamPct", "wDamPct", "aDamPct", "tDamPct", "eDamPct", "fDefPct", "wDefPct", "aDefPct", "tDefPct", "eDefPct", "fixID", "category", "spPct1", "spRaw1", "spPct2", "spRaw2", "spPct3", "spRaw3", "spPct4", "spRaw4", "rSdRaw", "sprint", "sprintReg", "jh", "lq", "gXp", "gSpd", "id", "majorIds", "damMobs", "defMobs",

// wynn2 damages.
"eMdPct","eMdRaw","eSdPct","eSdRaw",/*"eDamPct"*/,"eDamRaw","eDamAddMin","eDamAddMax",
"tMdPct","tMdRaw","tSdPct","tSdRaw",/*"tDamPct"*/,"tDamRaw","tDamAddMin","tDamAddMax",
"wMdPct","wMdRaw","wSdPct","wSdRaw",/*"wDamPct"*/,"wDamRaw","wDamAddMin","wDamAddMax",
"fMdPct","fMdRaw","fSdPct","fSdRaw",/*"fDamPct"*/,"fDamRaw","fDamAddMin","fDamAddMax",
"aMdPct","aMdRaw","aSdPct","aSdRaw",/*"aDamPct"*/,"aDamRaw","aDamAddMin","aDamAddMax",
"nMdPct","nMdRaw","nSdPct","nSdRaw","nDamPct","nDamRaw","nDamAddMin","nDamAddMax",      // neutral which is now an element
/*"mdPct","mdRaw","sdPct","sdRaw",*/"damPct","damRaw","damAddMin","damAddMax",          // These are the old ids. Become proportional.
"rMdPct","rMdRaw","rSdPct",/*"rSdRaw",*/"rDamPct","rDamRaw","rDamAddMin","rDamAddMax",  // rainbow (the "element" of all minus neutral). rSdRaw is rainraw
"critDamPct"
];
// Extra fake IDs (reserved for use in spell damage calculation) : damageMultiplier, defMultiplier, poisonPct, activeMajorIDs
let str_item_fields = [ "name", "displayName", "lore", "color", "tier", "set", "type", "material", "drop", "quest", "restrict", "category", "atkSpd" ]

//File reading for ID translations for JSON purposes
let reversetranslations = new Map();
let translations = new Map([["name", "name"], ["displayName", "displayName"], ["tier", "tier"], ["set", "set"], ["sockets", "slots"], ["type", "type"], ["dropType", "drop"], ["quest", "quest"], ["restrictions", "restrict"], ["damage", "nDam"], ["fireDamage", "fDam"], ["waterDamage", "wDam"], ["airDamage", "aDam"], ["thunderDamage", "tDam"], ["earthDamage", "eDam"], ["attackSpeed", "atkSpd"], ["health", "hp"], ["fireDefense", "fDef"], ["waterDefense", "wDef"], ["airDefense", "aDef"], ["thunderDefense", "tDef"], ["earthDefense", "eDef"], ["level", "lvl"], ["classRequirement", "classReq"], ["strength", "strReq"], ["dexterity", "dexReq"], ["intelligence", "intReq"], ["agility", "agiReq"], ["defense", "defReq"], ["healthRegen", "hprPct"], ["manaRegen", "mr"], ["spellDamage", "sdPct"], ["damageBonus", "mdPct"], ["lifeSteal", "ls"], ["manaSteal", "ms"], ["xpBonus", "xpb"], ["lootBonus", "lb"], ["reflection", "ref"], ["strengthPoints", "str"], ["dexterityPoints", "dex"], ["intelligencePoints", "int"], ["agilityPoints", "agi"], ["defensePoints", "def"], ["thorns", "thorns"], ["exploding", "expd"], ["speed", "spd"], ["attackSpeedBonus", "atkTier"], ["poison", "poison"], ["healthBonus", "hpBonus"], ["soulPoints", "spRegen"], ["emeraldStealing", "eSteal"], ["healthRegenRaw", "hprRaw"], ["spellDamageRaw", "sdRaw"], ["damageBonusRaw", "mdRaw"], ["bonusFireDamage", "fDamPct"], ["bonusWaterDamage", "wDamPct"], ["bonusAirDamage", "aDamPct"], ["bonusThunderDamage", "tDamPct"], ["bonusEarthDamage", "eDamPct"], ["bonusFireDefense", "fDefPct"], ["bonusWaterDefense", "wDefPct"], ["bonusAirDefense", "aDefPct"], ["bonusThunderDefense", "tDefPct"], ["bonusEarthDefense", "eDefPct"], ["type", "type"], ["identified", "fixID"], ["skin", "skin"], ["category", "category"], ["spellCostPct1", "spPct1"], ["spellCostRaw1", "spRaw1"], ["spellCostPct2", "spPct2"], ["spellCostRaw2", "spRaw2"], ["spellCostPct3", "spPct3"], ["spellCostRaw3", "spRaw3"], ["spellCostPct4", "spPct4"], ["spellCostRaw4", "spRaw4"], ["rainbowSpellDamageRaw", "rSdRaw"], ["sprint", "sprint"], ["sprintRegen", "sprintReg"], ["jumpHeight", "jh"], ["lootQuality", "lq"], ["gatherXpBonus", "gXp"], ["gatherSpeed", "gSpd"]]);
//does not include damMobs (wep tomes) and defMobs (armor tomes)
for (const [k, v] of translations) {
    reversetranslations.set(v, k);
}

let nonRolledIDs = [
    "name",
    "lore",
    "displayName",
    "tier",
    "set",
    "slots",
    "type",
    "material",
    "drop",
    "quest",
    "restrict",
    "nDam", "fDam", "wDam", "aDam", "tDam", "eDam",
    "atkSpd",
    "hp",
    "fDef", "wDef", "aDef", "tDef", "eDef",
    "lvl",
    "classReq",
    "strReq", "dexReq", "intReq", "defReq", "agiReq",
    "str", "dex", "int", "agi", "def",
    "fixID",
    "category",
    "id",
    "skillpoints",
    "reqs",
    "nDam_", "fDam_", "wDam_", "aDam_", "tDam_", "eDam_",
    "majorIds",
    "damMobs",
    "defMobs",
// wynn2 damages.
"eDamAddMin","eDamAddMax",
"tDamAddMin","tDamAddMax",
"wDamAddMin","wDamAddMax",
"fDamAddMin","fDamAddMax",
"aDamAddMin","aDamAddMax",
"nDamAddMin","nDamAddMax",  // neutral which is now an element
"damAddMin","damAddMax",    // all
"rDamAddMin","rDamAddMax"   // rainbow (the "element" of all minus neutral).
];
let rolledIDs = [
    "hprPct",
    "mr",
    "sdPct",
    "mdPct",
    "ls",
    "ms",
    "xpb",
    "lb",
    "ref",
    "thorns",
    "expd",
    "spd",
    "atkTier",
    "poison",
    "hpBonus",
    "spRegen",
    "eSteal",
    "hprRaw",
    "sdRaw",
    "mdRaw",
    "fDamPct", "wDamPct", "aDamPct", "tDamPct", "eDamPct",
    "fDefPct", "wDefPct", "aDefPct", "tDefPct", "eDefPct",
    "spPct1", "spRaw1",
    "spPct2", "spRaw2",
    "spPct3", "spRaw3",
    "spPct4", "spRaw4",
    "pDamRaw",
    "sprint",
    "sprintReg",
    "jh",
    "lq",
    "gXp",
    "gSpd",
// wynn2 damages.
"eMdPct","eMdRaw","eSdPct","eSdRaw",/*"eDamPct"*/,"eDamRaw","eDamAddMin","eDamAddMax",
"tMdPct","tMdRaw","tSdPct","tSdRaw",/*"tDamPct"*/,"tDamRaw","tDamAddMin","tDamAddMax",
"wMdPct","wMdRaw","wSdPct","wSdRaw",/*"wDamPct"*/,"wDamRaw","wDamAddMin","wDamAddMax",
"fMdPct","fMdRaw","fSdPct","fSdRaw",/*"fDamPct"*/,"fDamRaw","fDamAddMin","fDamAddMax",
"aMdPct","aMdRaw","aSdPct","aSdRaw",/*"aDamPct"*/,"aDamRaw","aDamAddMin","aDamAddMax",
"nMdPct","nMdRaw","nSdPct","nSdRaw","nDamPct","nDamRaw","nDamAddMin","nDamAddMax",      // neutral which is now an element
/*"mdPct","mdRaw","sdPct","sdRaw",*/"damPct","damRaw","damAddMin","damAddMax",          // These are the old ids. Become proportional.
"rMdPct","rMdRaw","rSdPct",/*"rSdRaw",*/"rDamPct","rDamRaw","rDamAddMin","rDamAddMax"   // rainbow (the "element" of all minus neutral). rSdRaw is rainraw
];
let reversedIDs = [ "spPct1", "spRaw1", "spPct2", "spRaw2", "spPct3", "spRaw3", "spPct4", "spRaw4" ];

/**
 * Take an item with id list and turn it into a set of minrolls and maxrolls.
 */
function expandItem(item) {
    let minRolls = new Map();
    let maxRolls = new Map();
    let expandedItem = new Map();
    if (item.fixID) { //The item has fixed IDs.
        expandedItem.set("fixID",true);
        for (const id of rolledIDs) { //all rolled IDs are numerical
            let val = (item[id] || 0);
            minRolls.set(id,val);
            maxRolls.set(id,val);
        }
    } else { //The item does not have fixed IDs.
        for (const id of rolledIDs) {
            let val = (item[id] || 0);
            if (val > 0) { // positive rolled IDs
                if (reversedIDs.includes(id)) {
                    maxRolls.set(id,idRound(val*0.3));
                    minRolls.set(id,idRound(val*1.3));
                } else {
                    maxRolls.set(id,idRound(val*1.3));
                    minRolls.set(id,idRound(val*0.3));
                }
            } else if (val < 0) { //negative rolled IDs
                if (reversedIDs.includes(id)) {
                    maxRolls.set(id,idRound(val*1.3));
                    minRolls.set(id,idRound(val*0.7));
                }
                else {
                    maxRolls.set(id,idRound(val*0.7));
                    minRolls.set(id,idRound(val*1.3));
                }
            }
            else { // if val == 0
                // NOTE: DO NOT remove this case! idRound behavior does not round to 0!
                maxRolls.set(id,0);
                minRolls.set(id,0);
            }
        }
    }
    for (const id of nonRolledIDs) {
        expandedItem.set(id,item[id]);
    }
    expandedItem.set("minRolls",minRolls);
    expandedItem.set("maxRolls",maxRolls);
    return expandedItem;
}

class Item {
    constructor(item_obj) {
        this.statMap = expandItem(item_obj);
    }
}

/* Takes in an ingredient object and returns an equivalent Map().
*/
function expandIngredient(ing) {
    let expandedIng = new Map();
    let mapIds = ['consumableIDs', 'itemIDs', 'posMods'];
    for (const id of mapIds) {
        let idMap = new Map();
        for (const key of Object.keys(ing[id])) {
            idMap.set(key, ing[id][key]);
        }
        expandedIng.set(id, idMap);
    }
    let normIds = ['lvl','name', 'displayName','tier','skills','id'];
    for (const id of normIds) {
        expandedIng.set(id, ing[id]);
    }
    if (ing['isPowder']) {
        expandedIng.set("isPowder",ing['isPowder']);
        expandedIng.set("pid",ing['pid']);
    }
    //now the actually hard one
    let idMap = new Map();
    idMap.set("minRolls", new Map());
    idMap.set("maxRolls", new Map());
    for (const field of ingFields) {
        let val = (ing['ids'][field] || 0);
        idMap.get("minRolls").set(field, val['minimum']);
        idMap.get("maxRolls").set(field, val['maximum']);
    }
    expandedIng.set("ids",idMap);
    return expandedIng;
}

/* Takes in a recipe object and returns an equivalent Map().
*/
function expandRecipe(recipe) {
    let expandedRecipe = new Map();
    let normIDs = ["name", "skill", "type","id"];
    for (const id of normIDs) {
        expandedRecipe.set(id,recipe[id]);
    }
    let rangeIDs = ["durability","lvl", "healthOrDamage", "duration", "basicDuration"];
    for (const id of rangeIDs) {
        if(recipe[id]){
            expandedRecipe.set(id, [recipe[id]['minimum'], recipe[id]['maximum']]);
        } else {
            expandedRecipe.set(id, [0,0]);
        }
    }
    expandedRecipe.set("materials", [ new Map([ ["item", recipe['materials'][0]['item']], ["amount", recipe['materials'][0]['amount']] ]) , new Map([ ["item", recipe['materials'][1]['item']], ["amount",recipe['materials'][1]['amount'] ] ]) ]);
    return expandedRecipe;
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
