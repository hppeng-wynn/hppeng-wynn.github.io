

const tiers = ["Normal", "Unique", "Rare", "Legendary", "Fabled", "Mythic", "Set", "Crafted"] //I'm not sure why you would make a custom crafted but if you do you should be able to use it w/ the correct powder formula
const types = armorTypes.concat(accessoryTypes).concat(weaponTypes).concat(consumableTypes).map(x => x.substring(0,1).toUpperCase() + x.substring(1));
const atkSpds = ["SUPER_SLOW","VERY_SLOW","SLOW","NORMAL","FAST","VERY_FAST","SUPER_FAST"];
const ci_save_order = ["name", "lore",  "tier", "set", "slots", "type", "material", "drop", "quest",  "nDam", "fDam", "wDam", "aDam", "tDam", "eDam", "atkSpd", "hp", "fDef", "wDef", "aDef", "tDef", "eDef", "lvl", "classReq", "strReq", "dexReq", "intReq", "defReq", "agiReq","str", "dex", "int", "agi", "def", "id", "skillpoints", "reqs", "nDam_", "fDam_", "wDam_", "aDam_", "tDam_", "eDam_", "majorIds", "hprPct", "mr", "sdPct", "mdPct", "ls", "ms", "xpb", "lb", "ref", "thorns", "expd", "spd", "atkTier", "poison", "hpBonus", "spRegen", "eSteal", "hprRaw", "sdRaw", "mdRaw", "fDamPct", "wDamPct", "aDamPct", "tDamPct", "eDamPct", "fDefPct", "wDefPct", "aDefPct", "tDefPct", "eDefPct", "spPct1", "spRaw1", "spPct2", "spRaw2", "spPct3", "spRaw3", "spPct4", "spRaw4", "rainbowRaw", "sprint", "sprintReg", "jh", "lq", "gXp", "gSpd"];
//omitted restrict - it's always "Custom Item"
//omitted displayName - either it's the same as name (repetitive) or it's "Custom Item"
//omitted category - can always get this from type
//omitted fixId - we will denote this early in the string.



/** An object representing a Custom Item. Mostly for vanity purposes.
 * @dep Requires the use of nonRolledIDs and rolledIDs from display.js.
 * @dep Requires the use of attackSpeeds from build.js.   
*/
class Custom{
    /**
     * @description Construct a custom item (CI) from a statMap. 
     * @param {statMap}: A map with keys from rolledIDs or nonRolledIDs or minRolls/maxRolls and values befitting the keys. minRolls and maxRolls are their own maps and have the same keys, but with minimum and maximum values (for rolls). 
     * 
     */
    constructor(statMap){
        this.statMap = statMap;
        this.initCustomStats();
    }

    //Applies powders to the CI
    applyPowders() {
        if (this.statMap.get("category") === "armor") {
            //double apply armor powders
            for(const id of this.statMap.get("powders")){
                let powder = powderStats[id];
                let name = powderNames.get(id);
                this.statMap.set(name.charAt(0) + "Def", (this.statMap.get(name.charAt(0)+"Def") || 0) + 2 * powder["defPlus"]);
                this.statMap.set(skp_elements[(skp_elements.indexOf(name.charAt(0)) + 4 )% 5] + "Def", (this.statMap.get(skp_elements[(skp_elements.indexOf(name.charAt(0)) + 4 )% 5]+"Def") || 0) - 2 * powder["defMinus"]);
            }
        }else if (this.statMap.get("category") === "weapon") {
            //do nothing - weapon powders are handled in displayExpandedItem
        }
    }

    
    setHash(hash) {
        this.hash = hash;
        this.statMap.set("hash",hash);
    }

    updateName(name) {
        this.name = name;
        this.displayName = name; 
    }

    /* Get all stats for this CI. 
     * Stores in this.statMap.
     * Follows the expandedItem item structure, similar to a crafted item.
     * TODO: Check if this is even useful
    */
    initCustomStats(){
        //this.setHashVerbose(); //do NOT move sethash from here please
        
        this.statMap.set("custom", true);
        if (this.statMap.get("tier") === "Crafted") {
            this.statMap.set("crafted", true);
            for (const e of skp_elements) {
                this.statMap.set(e+"DamLow", this.statMap.get(e+"Dam"));
            }
            this.statMap.set("nDamLow", this.statMap.get("nDam"));
        }
        
        if (this.statMap.get("type")) {
            this.statMap.set("type",this.statMap.get("type").toLowerCase());
            if (armorTypes.includes(this.statMap.get("type"))) {
                this.statMap.set("category","armor");
            } else if (accessoryTypes.includes(this.statMap.get("type"))) {
                this.statMap.set("category","accessory");
            } else if (weaponTypes.includes(this.statMap.get("type"))) {
                this.statMap.set("category","weapon");
            } else if (consumableTypes.includes(this.statMap.get("type"))) {
                this.statMap.set("category","consumable")
            }
        }
        if(this.statMap.get("category") !== "weapon") {
            this.statMap.set("atkSpd", "");
        }


        if (this.statMap.get("name") && this.statMap.get("name") !== "") {
            this.statMap.set("displayName", this.statMap.get("name"));
        } else {
            this.statMap.set("displayName", "Custom Item");
        }

        this.statMap.set("reqs",[this.statMap.get("strReq"),this.statMap.get("dexReq"),this.statMap.get("intReq"),this.statMap.get("defReq"),this.statMap.get("agiReq")]);
        this.statMap.set("powders", []);
        this.statMap.set("restrict", "Custom Item")
    }

}
