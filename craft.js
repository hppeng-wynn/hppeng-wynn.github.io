let armorTypes = [ "helmet", "chestplate", "leggings", "boots" ];
let accessoryTypes = [ "ring", "bracelet", "necklace" ];
let weaponTypes = [ "wand", "spear", "bow", "dagger", "relik" ];
let consumableTypes = [ "potion", "scroll", "food"]
/* Creates a crafted item object.
*/
class Craft{
    /* Constructs a craft.
       @param recipe: Helmet-1-3 (id), etc. A recipe object.
       @param mat_tiers: [1->3, 1->3]. An array with 2 numbers.
       @param ingreds: []. An array with 6 entries, each with an ingredient Map.
    */
    constructor(recipe, mat_tiers, ingreds) {
        this.recipe = recipe;
        this.mat_tiers = mat_tiers;
        this.ingreds = ingreds;
        this.statMap = new Map(); //can use the statMap as an expanded Item

        this.initCraftStats();
    }

    
    /*  Get all stats for this build. Stores in this.statMap.
        @pre The craft itself should be valid. No checking of validity of pieces is done here.
    */
    initCraftStats(){
        let consumables = ["POTION", "SCROLL", "FOOD"];
        let statMap = new Map();
        statMap.set("minRolls", new Map());
        statMap.set("maxRolls", new Map());
        statMap.set("displayName", "Crafted Item"); //TODO: DISPLAY THE HASH
        statMap.set("tier", "Crafted");
        statMap.set("type", this.recipe.get("type").toLowerCase());
        statMap.set("duration", [this.recipe.get("duration")[0], this.recipe.get("duration")[1]]); //[low, high]
        statMap.set("durability", [this.recipe.get("durability")[0], this.recipe.get("durability")[1]]);
        statMap.set("lvl", (this.recipe.get("lvl")[0] + "-" + this.recipe.get("lvl")[1]) );
        statMap.set("nDam", 0);

        if (armorTypes.includes(statMap.get("type")) || weaponTypes.includes(statMap.get("type"))) {
            if(this.recipe.get("lvl")[0] < 30) {
                statMap.set("slots", 1);
            } else if (this.recipe.get("lvl") < 70) {
                statMap.set("slots", 2);
            } else{
                statMap.set("slots", 3);
            }
        } else {
            statMap.set("slots", 0);
        }
        if (consumableTypes.includes(statMap.get("type"))) {
            if(this.recipe.get("lvl")[0] < 30) {
                statMap.set("charges", 1);
            } else if (this.recipe.get("lvl") < 70) {
                statMap.set("charges", 2);
            } else{
                statMap.set("charges", 3);
            }
            //no ingredient consumables ALWAYS have 3 charges.
            let allNone = true;
            for(const ingred of this.ingreds) {
                if(ingred.get("name") !== "No Ingredient") {
                    allNone = false;
                    break;
                }
            }
            if (allNone) {
                statMap.set("charges", 3);
                statMap.set("hp", this.recipe.get("healthOrDamage").join("-"));
                statMap.set("duration", this.recipe.get("basicDuration"));
            }
            statMap.set("category","consumable");
        } else {
            statMap.set("slots", 0);
        }

        if (armorTypes.includes(statMap.get("type"))) {
            statMap.set("hp", this.recipe.get("healthOrDamage").join("-"));
            statMap.set("category","armor");
        } else if (weaponTypes.includes(statMap.get("type"))) {
            statMap.set("nDam", this.recipe.get("healthOrDamage").join("-"));
            for (const e of skp_elements) {
                statMap.set(e + "Dam", "0-0");
            }
            //statMap.set("damageBonus", [statMap.get("eDamPct"), statMap.get("tDamPct"), statMap.get("wDamPct"), statMap.get("fDamPct"), statMap.get("aDamPct")]);
            statMap.set("category","weapon");
        } 
        statMap.set("powders","");
        /* Change certain IDs based on material tier. 
            healthOrDamage changes.
            duration and durability change. (but not basicDuration)

        */

        //calc ingredient effectivenesses -> see https://wynndata.tk/cr/585765168
        let eff = [[100,100],[100,100],[100,100]];
        for (let n in this.ingreds) { 
            let ingred = this.ingreds[n];
            //i and j will refer to the eff matrix.
            let i = Math.floor(n / 2);
            let j = n % 2;
            for (const [key,value] of ingred.get("posMods")) {
                if(value == 0) {
                    continue;
                } else {
                    if (key === "above") {
                        for (let k = i-1; k > -1; k--) {
                            eff[k][j] += value;
                        }
                    } else if (key === "under") {
                        for (let k = i+1; k < 3; k++) {
                            eff[k][j] += value;
                        }
                    } else if (key === "left") {
                        if (j == 1) {
                            eff[i][j-1] += value;
                        }
                    } else if (key === "right") {
                        if (j == 0) {
                            eff[i][j+1] += value;
                        }
                    } else if (key === "touching") {
                        for (let k in eff) {
                            for (let l in eff[k]) {
                                if ( (Math.abs(k-i) == 1 && Math.abs (l-j) == 0) || (Math.abs(k-i) == 0 && Math.abs (l-j) == 1) ) {
                                    eff[k][l] += value;
                                }
                            }
                        }
                    } else if (key === "notTouching") {
                        for (let k in eff) {
                            for (let l in eff[k]) {
                                if ( (Math.abs(k-i) > 1) || (Math.abs(k-i) == 1 && Math.abs(l-j) == 1) ) {
                                    eff[k][l] += value;
                                }
                            }
                        }
                    } else {
                        console.log("Something went wrong. Please contact hppeng.");
                        //wtf happened
                    }
                }
            }
        }
        //apply material tiers - the good thing is that this should be symmetric.
        for (const mat of this.mat_tiers) {

        }

        //apply ingredient effectivness - on ids, and reqs (itemIDs). NOT on durability, duration, or charges.
        let eff_flat = eff.flat();
        statMap.set("ingredEffectiveness", eff_flat);
        //console.log(eff_flat);
        //apply ingredient ids
        for (const n in this.ingreds) {
            let ingred = this.ingreds[n];
            let eff_mult = (eff_flat[n] / 100).toFixed(2);
            for (const [key, value] of ingred.get("itemIDs")) {
                if(key !== "dura") {
                    statMap.set(key, statMap.get(key) + Math.floor(value*eff_mult)); //CHECK IF THIS IS CORRECT
                } else { //durability, NOT affected by effectiveness
                    statMap.set("durability", statMap.get("durability").map(x => x + value));
                }
            }
            for (const [key,value] of ingred.get("consumableIDs")) {
                //neither duration nor charges are affected by effectiveness
                if(key === "dura") {
                    statMap.set("duration", statMap.get("duration").map(x => x + value));
                } else{
                    statMap.set(key, statMap.get("charges") + value);
                }
            }
            for (const [key,value] of ingred.get("ids").get("minRolls")) {
                if (value && value != 0) {
                    let rolls = [value,ingred.get("ids").get("maxRolls").get(key)];
                    rolls = rolls.map(x => Math.floor(x * eff_mult)).sort();
                    statMap.get("minRolls").set(key, (statMap.get("minRolls").get(key)) ? statMap.get("minRolls").get(key) + rolls[0] : rolls[0]);
                    statMap.get("maxRolls").set(key, (statMap.get("maxRolls").get(key)) ? statMap.get("maxRolls").get(key) + rolls[1] : rolls[1]);
                }
            }
        }
        for (const e of skp_order) {
            statMap.set(e,statMap.get("maxRolls").get(e));
        }
        for (const d in statMap.get("durability")) {
            if(statMap.get("durability")[d] < 1) { statMap.get("durability")[d] = 1;}
        }
        for (const d in statMap.get("duration")) {
            if(statMap.get("duration")[d] < 1) { statMap.get("duration")[d] = 1;}
        }
        if(statMap.has("charges") && statMap.get("charges") < 1 ) { statMap.set("charges",1)}
        this.statMap = statMap;
    }
}