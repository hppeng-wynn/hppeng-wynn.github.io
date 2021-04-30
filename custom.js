

const ci_save_order = ["name", "lore",  "tier", "set", "slots", "type", "material", "drop", "quest",  "nDam", "fDam", "wDam", "aDam", "tDam", "eDam", "atkSpd", "hp", "fDef", "wDef", "aDef", "tDef", "eDef", "lvl", "classReq", "strReq", "dexReq", "intReq", "defReq", "agiReq","str", "dex", "int", "agi", "def", "id", "skillpoints", "reqs", "nDam_", "fDam_", "wDam_", "aDam_", "tDam_", "eDam_", "majorIds", "hprPct", "mr", "sdPct", "mdPct", "ls", "ms", "xpb", "lb", "ref", "thorns", "expd", "spd", "atkTier", "poison", "hpBonus", "spRegen", "eSteal", "hprRaw", "sdRaw", "mdRaw", "fDamPct", "wDamPct", "aDamPct", "tDamPct", "eDamPct", "fDefPct", "wDefPct", "aDefPct", "tDefPct", "eDefPct", "spPct1", "spRaw1", "spPct2", "spRaw2", "spPct3", "spRaw3", "spPct4", "spRaw4", "rainbowRaw", "sprint", "sprintReg", "jh", "lq", "gXp", "gSpd","durability","duration","charges"];
const nonRolled_strings = ["name","lore", "tier","set","type","material","drop","quest","majorIds","classReq","atkSpd","displayName", "nDam", "fDam", "wDam", "aDam", "tDam", "eDam", "nDam_", "fDam_", "wDam_", "aDam_", "tDam_", "eDam_", "durability", "duration"];
//omitted restrict - it's always "Custom Item"
//omitted displayName - either it's the same as name (repetitive) or it's "Custom Item"
//omitted category - can always get this from type
//omitted fixId - we will denote this early in the string.
//omitted "nDam_", "fDam_", "wDam_", "aDam_", "tDam_", "eDam_" - will be calculated on display

/**
 * @param {Map} custom - the statMap of the CI
 * @param {boolean} verbose - if we want lore and majorIds to display
 */
function encodeCustom(custom, verbose) {
    if (custom) {
        if (custom.statMap) {
            custom = custom.statMap; 
        }
        let hash = "1";
        //version 1
        if (custom.has("fixID") && custom.get("fixID")) {
            hash += "1";
        } else {
            hash += "0";
        }
        for (const i in ci_save_order) {
            let id = ci_save_order[i];
            if (rolledIDs.includes(id)) {
                let val_min = custom.get("minRolls").has(id) ? custom.get("minRolls").get(id) : 0;
                let val_max = custom.get("maxRolls").has(id) ? custom.get("maxRolls").get(id) : 0;
                let sign = (Boolean(val_min / Math.abs(val_min) < 0) | 0) + 2*(Boolean(val_max / Math.abs(val_max) < 0) | 0) // 0 - both pos 1 - min neg max pos 2 - min pos max neg (how?) 3 - min neg max neg 
                //console.log(id + ": " + sign);
                let min_len = Math.max(1,Math.ceil(log(64,Math.abs(val_min)+1)));
                let max_len = Math.max(1,Math.ceil(log(64,Math.abs(val_max)+1)));
                let len = Math.max(min_len,max_len);
                val_min = Math.abs(val_min);
                val_max = Math.abs(val_max);


                if ( val_min != 0 || val_max != 0 ) {
                    //hash += Base64.fromIntN(i,2) + Base64.fromIntN(val_min,Math.max(1,Math.ceil(log(64,Math.abs(val_min))))) + ":" + Base64.fromIntN(val_max,Math.max(1,Math.ceil(log(64,Math.abs(val_min))))) + "_";
                    if (custom.get("fixID")) {
                        hash += Base64.fromIntN(i,2) + Base64.fromIntN(len,2) + sign + Base64.fromIntN(val_min, len);
                    } else {
                        hash += Base64.fromIntN(i,2) + Base64.fromIntN(len,2) + sign + Base64.fromIntN(val_min, len) + Base64.fromIntN(val_max,len);
                    }
                }
            } else {
                let damages = ["nDam", "eDam", "tDam", "wDam", "fDam", "aDam"]; //"nDam_", "eDam_", "tDam_", "wDam_", "fDam_", "aDam_"
                let val = custom.get(id);

                if (typeof(val) === "string" && val !== "") {
                    if ((damages.includes(id) && val === "0-0") || (!verbose && ["lore","majorIds","quest","materials","drop","set"].includes(id))) { continue; }
                    if (id === "type") {
                        hash += Base64.fromIntN(i,2) + Base64.fromIntN(types.indexOf(val.substring(0,1).toUpperCase()+val.slice(1)),1);
                    } else if (id === "tier") {
                        hash += Base64.fromIntN(i,2) + Base64.fromIntN(tiers.indexOf(val),1);
                    } else if (id === "atkSpd") {
                        hash += Base64.fromIntN(i,2) + Base64.fromIntN(attackSpeeds.indexOf(val),1);
                    } else if (id === "classReq") {
                        hash += Base64.fromIntN(i,2) + Base64.fromIntN(classes.indexOf(val),1);
                    } else {
                        hash += Base64.fromIntN(i,2) + Base64.fromIntN(val.replaceAll(" ", "%20").length,2) + val.replaceAll(" ", "%20"); //values cannot go above 4096 chars!!!! Is this ok?
                    }
                } else if (typeof(val) === "number" && val != 0) {
                    let len = Math.max(1,Math.ceil(log(64,Math.abs(val))));
                    let sign = Boolean(val / Math.abs(val) < 0) | 0;
                    //console.log(sign);
                    //hash += Base64.fromIntN(i,2) + Base64.fromIntN(val,Math.max(1,Math.ceil(log(64,Math.abs(val))))) + "_";
                    hash += Base64.fromIntN(i,2) + Base64.fromIntN(len,2) + sign + Base64.fromIntN(Math.abs(val),len);
                } 
            }
        }

        return hash;
    }
    return "";
}


function getCustomFromHash(hash) {
    let name = hash.slice();
    let statMap;
    try {
        if (name.slice(0,3) === "CI-") {
            name = name.substring(3);
        } else {
            throw new Error("Not a custom item!");
        }
    
        let version = name.charAt(0);
        let fixID = Boolean(parseInt(name.charAt(1),10));
        let tag = name.substring(2);
        statMap = new Map();
        statMap.set("minRolls", new Map());
        statMap.set("maxRolls", new Map());
    
        if (version === "1") {
            //do the things
            if (fixID) {
                statMap.set("fixID", true);
            } 
            console.log(",,");
            while (tag !== "") {
                let id = ci_save_order[Base64.toInt(tag.slice(0,2))];
                console.log(tag.slice(0, 2) + ": " + id);
                let len = Base64.toInt(tag.slice(2,4));
                if (rolledIDs.includes(id)) {
                    let sign = parseInt(tag.slice(4,5),10);
                    let minRoll = Base64.toInt(tag.slice(5,5+len));
                    if (!fixID) {
                        let maxRoll = Base64.toInt(tag.slice(5+len,5+2*len));
                        if (sign > 1) {
                            maxRoll *= -1;
                        }
                        if (sign % 2 == 1) {
                            minRoll *= -1;
                        }
                        statMap.get("minRolls").set(id,minRoll);
                        statMap.get("maxRolls").set(id,maxRoll);
                        tag = tag.slice(5+2*len);
                    } else {
                        if (sign != 0) {
                            minRoll *= -1;
                        }
                        statMap.get("minRolls").set(id,minRoll);
                        statMap.get("maxRolls").set(id,minRoll);
                        tag = tag.slice(5+len);
                    }
                } else {
                    let val;
                    if (nonRolled_strings.includes(id)) {
                        if (id === "tier") {
                            val = tiers[Base64.toInt(tag.charAt(2))];
                            len = -1;
                        } else if (id === "type") {
                            val = types[Base64.toInt(tag.charAt(2))];
                            len = -1;
                        } else if (id === "atkSpd") {
                            val = attackSpeeds[Base64.toInt(tag.charAt(2))];
                            len = -1;
                        } else if (id === "classReq") {
                            val = classes[Base64.toInt(tag.charAt(2))];
                            len = -1;
                        } else { //general case
                            val = tag.slice(4,4+len).replaceAll("%20"," ");
                        }
                        tag = tag.slice(4+len);
                    } else {
                        let sign = parseInt(tag.slice(4,5),10);
                        val = Base64.toInt(tag.slice(5,5+len));
                        if (sign == 1) {
                            val *= -1;
                        }
                        tag = tag.slice(5+len);
                    } 
                    statMap.set(id, val);
                }
            }
            statMap.set("hash","CI-"+name);
            return new Custom(statMap);
        }
    } catch (error) {
        //console.log(statMap);
        return undefined;
    }
    
}

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
        let ihash = hash.slice();
        if (ihash.slice(0,3) !== "CI-") {
            ihash = "CI-" + hash;
        }

        this.hash = ihash;
        this.statMap.set("hash",ihash);
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

        for (const n of ["nDam","eDam","tDam","wDam","fDam","aDam"]) {
            if (!(this.statMap.has(n) && this.statMap.get(n))) {
                this.statMap.set(n,"0-0");
            }
        }

        for (const id of ci_save_order) {
            if (rolledIDs.includes(id)) {
                if (!(this.statMap.get("minRolls").has(id) && this.statMap.get("minRolls").get(id))) {
                    this.statMap.get("minRolls").set(id,0);
                    this.statMap.get("maxRolls").set(id,0);
                }
            } else {
                if (nonRolled_strings.includes(id)) {
                    if (!(this.statMap.has(id)&&this.statMap.get(id))) {
                        this.statMap.set(id,"");
                    }
                } else {
                    if (!(this.statMap.has(id)&&this.statMap.get(id))) {
                        this.statMap.set(id,0);
                    }
                }
            }
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
                this.statMap.set("category","consumable");
            }
        }

        if (this.statMap.get("tier") === "Crafted") {
            this.statMap.set("crafted", true);

            for (const e of skp_elements) {
                this.statMap.set(e+"DamLow", this.statMap.get(e+"Dam"));
            }
            this.statMap.set("nDamLow", this.statMap.get("nDam"));
            this.statMap.set("hpLow", this.statMap.get("hp"));
            for (const e of skp_order) {
                this.statMap.get("minRolls").set(e,this.statMap.get(e));
                this.statMap.get("maxRolls").set(e,this.statMap.get(e));
            }
            // for (const e of ["durability", "duration"]) {
            //     if (this.statMap.get(e) === "") {
            //         this.statMap.set(e, [0,0]);
            //     } else {
            //         this.statMap.set(e, [this.statMap.get(e).split("-")[0],this.statMap.get(e).split("-")[1]])
            //     }
            // }

            this.statMap.set("lvlLow",this.statMap.get("lvl"));
            if (this.statMap.get("category") === "weapon") {
                //this is for powder purposes.
                //users will likely not stick to the 0.9,1.1 rule because custom item. We will get around this by breaking everything and rewarding users for sticking to 0.9,1.1.
                this.statMap.set("nDamBaseLow", Math.floor((parseFloat(this.statMap.get("nDamLow")) + parseFloat(this.statMap.get("nDam"))) / 2) );
                this.statMap.set("nDamBaseHigh", Math.floor((parseFloat(this.statMap.get("nDamLow")) + parseFloat(this.statMap.get("nDam"))) / 2) );
                for (const e in skp_elements) {
                    this.statMap.set(skp_elements[e]+"DamBaseLow", Math.floor((parseFloat(this.statMap.get(skp_elements[e]+"DamLow")) + parseFloat(this.statMap.get(skp_elements[e]+"Dam"))) / 2));
                    this.statMap.set(skp_elements[e]+"DamBaseHigh", Math.floor((parseFloat(this.statMap.get(skp_elements[e]+"DamLow")) + parseFloat(this.statMap.get(skp_elements[e]+"Dam"))) / 2));
                }
                this.statMap.set("ingredPowders", []);
            }
        }

        if (this.statMap.get("category") !== "weapon") {
            this.statMap.set("atkSpd", "");
            for (const n in ["nDam","eDam","tDam","wDam","fDam","aDam"]) {
                //this.statMap.set(n,"");
            }
        } else {

        }


        if (this.statMap.get("name") && this.statMap.get("name") !== "") {
            this.statMap.set("displayName", this.statMap.get("name"));
        } else {
            this.statMap.set("displayName", "Custom Item");
        }
        this.statMap.set("powders",[]);


        this.statMap.set("reqs",[this.statMap.get("strReq"),this.statMap.get("dexReq"),this.statMap.get("intReq"),this.statMap.get("defReq"),this.statMap.get("agiReq")]);
        this.statMap.set("skillpoints", [this.statMap.get("str"),this.statMap.get("dex"),this.statMap.get("int"),this.statMap.get("def"),this.statMap.get("agi")]);
              

        this.statMap.set("restrict", "Custom Item")
    }

}
