

//constructs a craft from a hash 'CR-qwoefsabaoe' or 'qwoefsaboe'
function getCraftFromHash(hash) {
    let name = hash.slice();
    try {
        if (name.slice(0,3) === "CR-") {
            name = name.substring(3);
        } else {
            throw new Error("Not a crafted item!");
        }
        version = name.substring(0,1);
        name = name.substring(1);
        if (version === "1") {
            let ingreds = [];
            for (let i = 0; i < 6; i ++ ) {
                ingreds.push( expandIngredient(ingMap.get(ingIDMap.get(Base64.toInt(name.substring(2*i,2*i+2))))) );
            }
            let recipe = expandRecipe(recipeMap.get(recipeIDMap.get(Base64.toInt(name.substring(12,14)))));
            
            tierNum = Base64.toInt(name.substring(14,15));
            let mat_tiers = [];
            mat_tiers.push(tierNum % 3 == 0 ? 3 : tierNum % 3);
            mat_tiers.push(Math.floor((tierNum-0.5) / 3)+1); //Trying to prevent round-off error, don't yell at me
            let atkSpd = Base64.toInt(name.substring(15));
            let atkSpds = ["SLOW","NORMAL","FAST"];
            let attackSpeed = atkSpds[atkSpd];
            return new Craft(recipe,mat_tiers,ingreds,attackSpeed,"1"+name);
        }
    } catch (error) {
        return undefined;
    }
    
    
}


/* Creates a crafted item object.
*/
class Craft{
    /* Constructs a craft.
       @param recipe: Helmet-1-3 (id), etc. A recipe object.
       @param mat_tiers: [1->3, 1->3]. An array with 2 numbers.
       @param ingreds: []. An array with 6 entries, each with an ingredient Map.
    */
    constructor(recipe, mat_tiers, ingreds, attackSpeed, hash) {
        this.recipe = recipe;
        this.mat_tiers = mat_tiers;
        this.ingreds = ingreds;
        this.statMap = new Map(); //can use the statMap as an expanded Item
        this.atkSpd = attackSpeed;
        this.hash = "CR-" + hash;
        this.initCraftStats();
        this.statMap.set("hash", this.hash);
    }
    

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
        this.hash = "CR-" + hash;
        this.statMap.set("name", this.hash);
        this.statMap.set("displayName", this.hash);
        this.statMap.set("hash", this.hash);
    }
    /*  Get all stats for this build. Stores in this.statMap.
        @pre The craft itself should be valid. No checking of validity of pieces is done here.
    */
    initCraftStats(){

        let statMap = new Map();
        statMap.set("minRolls", new Map());
        statMap.set("maxRolls", new Map());
        statMap.set("name", this.hash);
        statMap.set("displayName", this.hash);
        statMap.set("tier", "Crafted");
        statMap.set("type", this.recipe.get("type").toLowerCase());
        statMap.set("duration", [this.recipe.get("duration")[0], this.recipe.get("duration")[1]]); //[low, high]
        statMap.set("durability", [this.recipe.get("durability")[0], this.recipe.get("durability")[1]]);
        statMap.set("lvl", this.recipe.get("lvl")[1]);
        statMap.set("lvlLow", this.recipe.get("lvl")[0]);
        statMap.set("nDam", 0);
        statMap.set("hp",0);
        statMap.set("hpLow",0);
        for (const e of skp_elements) {
            statMap.set(e + "Dam", "0-0");
            statMap.set(e + "Def", 0);
        }
        for (const e of skp_order) {
            statMap.set(e + "Req", 0)
            statMap.set(e, 0);
        }
        let allNone = true;
        if (armorTypes.includes(statMap.get("type")) || weaponTypes.includes(statMap.get("type"))) {
            statMap.set("category","weapon");
            if(this.recipe.get("lvl")[0] < 30) {
                statMap.set("slots", 1);
            } else if (this.recipe.get("lvl")[0] < 70) {
                statMap.set("slots", 2);
            } else{
                statMap.set("slots", 3);
            }
        } else {
            statMap.set("slots", 0);
        }
        if (consumableTypes.includes(statMap.get("type"))) {
            statMap.set("category","consumable");
            if(this.recipe.get("lvl")[0] < 30) {
                statMap.set("charges", 1);
            } else if (this.recipe.get("lvl")[0] < 70) {
                statMap.set("charges", 2);
            } else{
                statMap.set("charges", 3);
            }
            //no ingredient consumables ALWAYS have 3 charges.
            
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
            statMap.set("charges", 0);
        }

        if (armorTypes.includes(statMap.get("type"))) {
            statMap.set("hp", this.recipe.get("healthOrDamage").join("-"));
            statMap.set("category","armor");
        } else if (weaponTypes.includes(statMap.get("type"))) {
            statMap.set("nDam", this.recipe.get("healthOrDamage").join("-"));
            for (const e of skp_elements) {
                statMap.set(e + "Dam", "0-0");
                statMap.set(e + "DamLow", "0-0");
            }
            //statMap.set("damageBonus", [statMap.get("eDamPct"), statMap.get("tDamPct"), statMap.get("wDamPct"), statMap.get("fDamPct"), statMap.get("aDamPct")]);
            statMap.set("category","weapon");
            statMap.set("atkSpd",this.atkSpd);
        } 
        if (accessoryTypes.includes(statMap.get("type"))) {
            statMap.set("category", "accessory");
        }
        statMap.set("powders",[]);
        
        /* Change certain IDs based on material tier. 
            healthOrDamage changes.
            duration and durability change. (but not basicDuration)

        */
        let matmult = 1;
        let tierToMult = [0,1,1.25,1.4];
        let tiers = this.mat_tiers.slice();
        let amounts = this.recipe.get("materials").map(x=> x.get("amount"));
        //Mat Multipliers - should work!
        matmult = (tierToMult[tiers[0]]*amounts[0] + tierToMult[tiers[1]]*amounts[1]) / (amounts[0]+amounts[1]);
        console.log(matmult);

        let low = this.recipe.get("healthOrDamage")[0];
        let high = this.recipe.get("healthOrDamage")[1];
        if (statMap.get("category") === "consumable") {
            if(allNone) { 
                statMap.set("hp", Math.floor( low * matmult )+ "-" + Math.floor( high * matmult ));
            }
            statMap.set("duration", [Math.floor( statMap.get("duration")[0] * matmult ), Math.floor( statMap.get("duration")[1] * matmult )]);
        } else {
            //durability modifier
            statMap.set("durability", [Math.floor( statMap.get("durability")[0] * matmult ), Math.floor( statMap.get("durability")[1] * matmult )]);
        }
        if (statMap.get("category") === "weapon") {
            //attack damages oh boy
            let ratio = 2.05;  
            if (this['atkSpd'] === "SLOW") {
                ratio /= 1.5;
            } else if (this['atkSpd'] === "NORMAL") {
                ratio = 1;
            } else if (this['atkSpd'] === "FAST") {
                ratio /= 2.5;
            }
            let nDamBaseLow = Math.floor(low * matmult);
            let nDamBaseHigh = Math.floor(high * matmult);
            nDamBaseLow = Math.floor(nDamBaseLow * ratio);
            nDamBaseHigh = Math.floor(nDamBaseHigh * ratio);
            let elemDamBaseLow = [0,0,0,0,0];
            let elemDamBaseHigh = [0,0,0,0,0];
            /*
             * APPLY POWDERS - MAY NOT BE CORRECT
            */
            let powders = []; 
            for (let n in this.ingreds) {
                let ingred = this.ingreds[n];
                if (ingred.get("isPowder")) {
                    powders.push(ingred.get("pid"));
                }
            }
            for (const p of powders) {
                /* Powders as ingredients in crafted weapons are different than powders applied to non-crafted weapons. Thanks to nbcss for showing me the math.
                */
                let powder = powderStats[p];  //use min, max, and convert
                let element = Math.floor((p+0.01)/6); //[0,4], the +0.01 attempts to prevent division error
                let diffLow = Math.floor(nDamBaseLow * powder.convert/100);
                nDamBaseLow -= diffLow;
                elemDamBaseLow[element] += diffLow + Math.floor( (powder.min + powder.max) / 2 );
                let diffHigh = Math.floor(nDamBaseHigh * powder.convert/100);
                nDamBaseHigh -= diffHigh;
                elemDamBaseHigh[element] += diffHigh + Math.floor( (powder.min + powder.max) / 2 );
            }
            
            /* I create a separate variable for each low damage range because we need one damage range to calculate damage with, and it's custom to use the maximum range of the range range.
            */
            let low1 = Math.floor(nDamBaseLow * 0.9);
            let low2 = Math.floor(nDamBaseLow * 1.1);
            let high1 = Math.floor(nDamBaseHigh * 0.9);
            let high2 = Math.floor(nDamBaseHigh * 1.1);
            statMap.set("nDamBaseLow", nDamBaseLow);
            statMap.set("nDamBaseHigh", nDamBaseHigh);
            statMap.set("nDamLow", low1+"-"+low2); 
            statMap.set("nDam", high1+"-"+high2);
            for (const e in skp_elements) {
                statMap.set(skp_elements[e]+"DamBaseLow", elemDamBaseLow[e]);
                statMap.set(skp_elements[e]+"DamBaseHigh", elemDamBaseHigh[e]);
                low1 = Math.floor(elemDamBaseLow[e] * 0.9);
                low2 = Math.floor(elemDamBaseLow[e] * 1.1);
                high1 = Math.floor(elemDamBaseHigh[e] * 0.9);
                high2 = Math.floor(elemDamBaseHigh[e] * 1.1);
                statMap.set(skp_elements[e]+"DamLow", low1+"-"+low2);
                statMap.set(skp_elements[e]+"Dam",high1+"-"+high2);
            }
        } else if (statMap.get("category") === "armor") {
            for (let n in this.ingreds) {
                let ingred = this.ingreds[n];
                if (ingred.get("isPowder")) {
                    let powder = powderStats[ingred.get("pid")];
                    let name = powderNames.get(ingred.get("pid"));
                    statMap.set(name.charAt(0) + "Def", (statMap.get(name.charAt(0)+"Def") || 0) + powder["defPlus"]);
                    statMap.set(skp_elements[(skp_elements.indexOf(name.charAt(0)) + 4 )% 5] + "Def", (statMap.get(skp_elements[(skp_elements.indexOf(name.charAt(0)) + 4 )% 5]+"Def") || 0) - powder["defMinus"]);
                }
            }
            low = Math.floor(low * matmult);
            high = Math.floor(high * matmult);
            statMap.set("hp",high);
            statMap.set("hpLow",low);
        }
        /* END SECTION */

        
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
                if(key !== "dura"  && !consumableTypes.includes(statMap.get("type"))) { //consumables NEVER get reqs
                    if (!ingred.get("isPowder")) {
                        statMap.set(key, Math.round(statMap.get(key) + value*eff_mult)); 
                    } else {
                        statMap.set(key, Math.round(statMap.get(key) + value));
                    }
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
            for (const [key,value] of ingred.get("ids").get("maxRolls")) {
                if (value && value != 0) {
                    let rolls = [ingred.get("ids").get("minRolls").get(key), value];
                    rolls = rolls.map(x => Math.floor(x * eff_mult)).sort(function(a, b){return a - b});
                    statMap.get("minRolls").set(key, (statMap.get("minRolls").get(key)) ? statMap.get("minRolls").get(key) + rolls[0] : rolls[0]);
                    statMap.get("maxRolls").set(key, (statMap.get("maxRolls").get(key)) ? statMap.get("maxRolls").get(key) + rolls[1] : rolls[1]);
                }
            }
        }
        for (const d in statMap.get("durability")) {
            if(statMap.get("durability")[d] < 1) { statMap.get("durability")[d] = 1;} 
            else {
                statMap.get("durability")[d] = Math.floor(statMap.get("durability")[d]);
            }
        }
        for (const d in statMap.get("duration")) {
            if(!allNone && statMap.get("duration")[d] < 10) { statMap.get("duration")[d] = 10;}
        }
        if(statMap.has("charges") && statMap.get("charges") < 1 ) { statMap.set("charges",1)}

        statMap.set("reqs",[0,0,0,0,0]);
        statMap.set("skillpoints", [0,0,0,0,0]);
        statMap.set("damageBonus",[0,0,0,0,0]);
        for (const e in skp_order) {
            statMap.set(skp_order[e], statMap.get("maxRolls").has(skp_order[e]) ? statMap.get("maxRolls").get(skp_order[e]) : 0);
            statMap.get("skillpoints")[e] = statMap.get("maxRolls").has(skp_order[e]) ? statMap.get("maxRolls").get(skp_order[e]) : 0;
            statMap.get("reqs")[e] = statMap.has(skp_order[e]+"Req") && !consumableTypes.includes(statMap.get("type"))? statMap.get(skp_order[e]+"Req") : 0;
            statMap.get("damageBonus")[e] = statMap.has(skp_order[e]+"DamPct") ? statMap.get(skp_order[e]+"DamPct") : 0;
        }
        for (const id of rolledIDs) {
            if (statMap.get("minRolls").has(id)) {
                continue;
            } else {
                statMap.get("minRolls").set(id,0);
                statMap.get("maxRolls").set(id,0);
            }
        }

        statMap.set("crafted", true);
        this.statMap = statMap;
    }
}
