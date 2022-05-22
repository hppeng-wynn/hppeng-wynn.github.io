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
    "majorIds"];
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
    "rainbowRaw",
    "sprint",
    "sprintReg",
    "jh",
    "lq",
    "gXp",
    "gSpd"
];

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
    expandedItem.set("powders", powders);
    return expandedItem;
}

class Item {
    constructor(item_obj) {
        this.statMap = ; //can use the statMap as an expanded Item
        this.atkSpd = attackSpeed;
        this.hash = "CR-" + hash;
        this.initCraftStats();
        this.statMap.set("hash", this.hash);
    }
}
