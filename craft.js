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
    constructor(recipe, mat_tiers, ingreds, attackSpeed) {
        this.recipe = recipe;
        this.mat_tiers = mat_tiers;
        this.ingreds = ingreds;
        this.statMap = new Map(); //can use the statMap as an expanded Item
        this.atkSpd = attackSpeed;
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
            statMap.set("atkSpd",this.atkSpd);
        } 
        statMap.set("powders","");
        
        /* Change certain IDs based on material tier. 
            healthOrDamage changes.
            duration and durability change. (but not basicDuration)

        */
        let matmult = 1;
        let sorted = this.mat_tiers.sort();
        //TODO - idfk how this works
        if( sorted[0] == 1 && sorted[1] == 1) {
            matmult = 1; 
        } else if( sorted[0] == 1 && sorted[1] == 2) {
            matmult = 1.079; 
        }else if( sorted[0] == 1 && sorted[1] == 3) {
            matmult = 1.15; 
        }else if( sorted[0] == 2 && sorted[1] == 2) {
            matmult = 1.24; 
        }else if( sorted[0] == 2 && sorted[1] == 3) {
            matmult = 1.3; 
        }else if( sorted[0] == 3 && sorted[1] == 3) {
            matmult = 1.4; 
        }
        let low = this.recipe.get("healthOrDamage")[0];
        let high = this.recipe.get("healthOrDamage")[1];
        if (statMap.get("category") === "consumable") {
            //duration modifier
            if(statMap.has("hp")) { //hack
                statMap.set("hp", Math.floor( low * matmult )+ "-" + Math.floor( high * matmult ));
            } else {
                statMap.set("duration", [Math.floor( statMap.get("duration")[0] * matmult ), Math.floor( statMap.get("duration")[1] * matmult )]);
            }
        } else {
            //durability modifier
            statMap.set("durability", [Math.floor( statMap.get("durability")[0] * matmult ), Math.floor( statMap.get("durability")[1] * matmult )]);
        }
        if (statMap.get("category") === "weapon") {
            //attack damages oh boy
            let ratio = 2.05; //UNSURE IF THIS IS HOW IT'S DONE. MIGHT BE DONE WITH SKETCHY FLOORING.
            if (this.atkSpd === "SLOW") {
                ratio /= 1.5;
            } else if (this.atkSpd === "NORMAL") {
                ratio = 1;
            } else if (this.atkSpd = "FAST") {
                ratio /= 2.5;
            }
            low *= ratio*matmult;
            high *= ratio*matmult;
            this.recipe.get("healthOrDamage")[0] = low;
            this.recipe.get("healthOrDamage")[1] = high;
        }
        /* END SECTION */

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