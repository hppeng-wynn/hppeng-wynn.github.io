

const classDefenseMultipliers = new Map([ ["relik",0.50], ["bow",0.60], ["wand", 0.80], ["dagger", 1.0], ["spear",1.20], ["sword", 1.10]]);

/**
 * @description Error to catch items that don't exist.
 * @module ItemNotFound
 */
class ItemNotFound {
    /**
     * @class
     * @param {String} item the item name entered
     * @param {String} type the type of item
     * @param {Boolean} genElement whether to generate an element from inputs
     * @param {String} override override for item type
     */
    constructor(item, type, genElement, override) {
        /** 
         * @public 
         * @type {String}
         */
        this.message = `Cannot find ${override||type} named ${item}`;
        if (genElement)
            /** 
             * @public 
             * @type {Element}
             */
            this.element = document.getElementById(`${type}-choice`).parentElement.querySelectorAll("p.error")[0];
        else
            this.element = document.createElement("div");
    }
}

/**
 * @description Error to catch incorrect input.
 * @module IncorrectInput 
 */
class IncorrectInput {
    /**
     * @class
     * @param {String} input the inputted text
     * @param {String} format the correct format
     * @param {String} sibling the id of the error node's sibling
     */
    constructor(input, format, sibling) {
        /** 
         * @public
         * @type {String}
         */
        this.message = `${input} is incorrect. Example: ${format}`;
        /**
         * @public
         * @type {String}
         */
        this.id = sibling;
    }
}

/**
 * @description Error that inputs an array of items to generate errors of.
 * @module ListError
 * @extends Error
 */
class ListError extends Error {
    /**
     * @class
     * @param {Array} errors array of errors
     */
    constructor(errors) {
        let ret = [];
        if (typeof errors[0] == "string") {
            super(errors[0]);
        } else {
            super(errors[0].message);
        }
        for (let i of errors) {
            if (typeof i == "string") {
                ret.push(new Error(i));
            } else {
                ret.push(i);
            }
        }
        /**
         * @public
         * @type {Object[]}
         */
        this.errors = ret;
    }
}

/*Class that represents a wynn player's build.
*/
class Build{
    
    /**
     * @description Construct a build.
     * @param {Number} level : Level of the player.
     * @param {String[]} equipment : List of equipment names that make up the build.
     *                    In order: boots, Chestplate, Leggings, Boots, Ring1, Ring2, Brace, Neck, Weapon.
     * @param {Number[]} powders : Powder application. List of lists of integers (powder IDs).
     *                  In order: boots, Chestplate, Leggings, Boots, Weapon.
     * @param {Object[]} inputerrors : List of instances of error-like classes.
     * 
     * @param {Object[]} tomes: List of tomes.
     *                      In order: 2x Weapon Mastery Tome, 4x Armor Mastery Tome, 1x Guild Tome.
     *                      2x Slaying Mastery Tome, 2x Dungeoneering Mastery Tome, 2x Gathering Mastery Tome are in game, but do not have "useful" stats (those that affect damage calculations or building)
     */
    constructor(level, items, tomes, weapon){

        if (level < 1) { //Should these be constants?
            this.level = 1;
        } else if (level > 106) {
            this.level = 106;
        } else if (level <= 106 && level >= 1) {
            this.level = level;
        } else if (typeof level === "string") {
            this.level = level;
            errors.push(new IncorrectInput(level, "a number", "level-choice"));
        } else {
            errors.push("Level is not a string or number.");
        }
        document.getElementById("level-choice").value = this.level;

        this.availableSkillpoints = levelToSkillPoints(this.level);
        this.equipment = items;
        this.tomes = tomes;
        this.weapon = weapon;
        this.items = this.equipment.concat([this.weapon]).concat(this.tomes);
        // return [equip_order, best_skillpoints, final_skillpoints, best_total];

        // calc skillpoints requires statmaps only
        let result = calculate_skillpoints(this.equipment.concat(this.tomes).map((x) => x.statMap), this.weapon.statMap);
        console.log(result);
        this.equip_order = result[0];
        // How many skillpoints the player had to assign (5 number)
        this.base_skillpoints = result[1];
        // How many skillpoints the build ended up with (5 number)
        this.total_skillpoints = result[2];
        // How many skillpoints assigned (1 number, sum of base_skillpoints)
        this.assigned_skillpoints = result[3];
        this.activeSetCounts = result[4];

        this.initBuildStats();
    }  

    /*Returns build in string format
    */
    toString(){
        return [this.equipment,this.weapon,this.tomes].flat();
    }

    /* Getters */

    getSpellCost(spellIdx, cost) {
        return Math.max(1, this.getBaseSpellCost(spellIdx, cost));
    }

    getBaseSpellCost(spellIdx, cost) {
        // old intelligence: cost = Math.ceil(cost * (1 - skillPointsToPercentage(this.total_skillpoints[2])));
        cost += this.statMap.get("spRaw"+spellIdx);
        return Math.floor(cost * (1 + this.statMap.get("spPct"+spellIdx) / 100));
    }
    

    /*  Get melee stats for build.
        Returns an array in the order:
    */
    getMeleeStats(){
        const stats = this.statMap;
        const weapon_stats = this.weapon.statMap;
        if (weapon_stats.get("tier") === "Crafted") {
            stats.set("damageBases", [weapon_stats.get("nDamBaseHigh"),weapon_stats.get("eDamBaseHigh"),weapon_stats.get("tDamBaseHigh"),weapon_stats.get("wDamBaseHigh"),weapon_stats.get("fDamBaseHigh"),weapon_stats.get("aDamBaseHigh")]);
        }
        let adjAtkSpd = attackSpeeds.indexOf(stats.get("atkSpd")) + stats.get("atkTier");
        if(adjAtkSpd > 6){
            adjAtkSpd = 6;
        }else if(adjAtkSpd < 0){
            adjAtkSpd = 0;
        }

        let damage_mult = 1;
        if (weapon_stats.get("type") === "relik") {
            damage_mult = 0.99; // CURSE YOU WYNNCRAFT
            //One day we will create WynnWynn and no longer have shaman 99% melee injustice.
            //In all seriousness 99% is because wynn uses 0.33 to estimate dividing the damage by 3 to split damage between 3 beams.
        }
        // 0spellmult for melee damage.
        let results = calculateSpellDamage(stats, [100, 0, 0, 0, 0, 0], stats.get("mdRaw"), stats.get("mdPct"), 0, this.weapon.statMap, this.total_skillpoints, damage_mult * this.damageMultiplier);
        
        let dex = this.total_skillpoints[1];

        let totalDamNorm = results[0];
        let totalDamCrit = results[1];
        totalDamNorm.push(1-skillPointsToPercentage(dex));
        totalDamCrit.push(skillPointsToPercentage(dex));
        let damages_results = results[2];
        
        let singleHitTotal = ((totalDamNorm[0]+totalDamNorm[1])*(totalDamNorm[2])
                            +(totalDamCrit[0]+totalDamCrit[1])*(totalDamCrit[2]))/2;

        //Now do math
        let normDPS = (totalDamNorm[0]+totalDamNorm[1])/2 * baseDamageMultiplier[adjAtkSpd];
        let critDPS = (totalDamCrit[0]+totalDamCrit[1])/2 * baseDamageMultiplier[adjAtkSpd];
        let avgDPS = (normDPS * (1 - skillPointsToPercentage(dex))) + (critDPS * (skillPointsToPercentage(dex)));
        //[[n n n n] [e e e e] [t t t t] [w w w w] [f f f f] [a a a a] [lowtotal hightotal normalChance] [critlowtotal crithightotal critChance] normalDPS critCPS averageDPS adjAttackSpeed, singleHit] 
        return damages_results.concat([totalDamNorm,totalDamCrit,normDPS,critDPS,avgDPS,adjAtkSpd, singleHitTotal]).concat(results[3]);
    }

    /*
        Get all defensive stats for this build.
    */
    getDefenseStats(){
        const stats = this.statMap;
        let defenseStats = [];
        let def_pct = skillPointsToPercentage(this.total_skillpoints[3]);
        let agi_pct = skillPointsToPercentage(this.total_skillpoints[4]);
        //total hp
        let totalHp = stats.get("hp") + stats.get("hpBonus");
        if (totalHp < 5) totalHp = 5;
        defenseStats.push(totalHp);
        //EHP
        let ehp = [totalHp, totalHp];
        let defMult = classDefenseMultipliers.get(this.weapon.statMap.get("type"));
        ehp[0] /= ((1-def_pct)*(1-agi_pct)*(2-defMult)*(2-this.defenseMultiplier));
        ehp[1] /= ((1-def_pct)*(2-defMult)*(2-this.defenseMultiplier));    
        defenseStats.push(ehp);
        //HPR
        let totalHpr = rawToPct(stats.get("hprRaw"), stats.get("hprPct")/100.);
        defenseStats.push(totalHpr);
        //EHPR
        let ehpr = [totalHpr, totalHpr];
        ehpr[0] /= ((1-def_pct)*(1-agi_pct)*(2-defMult)*(2-this.defenseMultiplier)); 
        ehpr[1] /= ((1-def_pct)*(2-defMult)*(2-this.defenseMultiplier)); 
        defenseStats.push(ehpr);
        //skp stats
        defenseStats.push([ (1 - ((1-def_pct) * (2 - this.defenseMultiplier)))*100, agi_pct*100]);
        //eledefs - TODO POWDERS
        let eledefs = [0, 0, 0, 0, 0];
        for(const i in skp_elements){ //kinda jank but ok
            eledefs[i] = rawToPct(stats.get(skp_elements[i] + "Def"), stats.get(skp_elements[i] + "DefPct")/100.);
        }
        defenseStats.push(eledefs);
        
        //[total hp, [ehp w/ agi, ehp w/o agi], total hpr, [ehpr w/ agi, ehpr w/o agi], [def%, agi%], [edef,tdef,wdef,fdef,adef]]
        return defenseStats;
    }

    /*  Get all stats for this build. Stores in this.statMap.
        @pre The build itself should be valid. No checking of validity of pieces is done here.
    */
    initBuildStats(){

        let staticIDs = ["hp", "eDef", "tDef", "wDef", "fDef", "aDef", "str", "dex", "int", "def", "agi"];

        //Create a map of this build's stats
        let statMap = new Map();

        for (const staticID of staticIDs) {
            statMap.set(staticID, 0);
        }
        statMap.set("hp", levelToHPBase(this.level)); 

        let major_ids = new Set();
        for (const item of this.items){
            const item_stats = item.statMap;
            for (let [id, value] of item_stats.get("maxRolls")) {
                if (staticIDs.includes(id)) {
                    continue;
                }
                statMap.set(id,(statMap.get(id) || 0)+value);
            }
            for (const staticID of staticIDs) {
                if (item_stats.get(staticID)) {
                    statMap.set(staticID, statMap.get(staticID) + item_stats.get(staticID));
                }
            }
            if (item_stats.get("majorIds")) {
                for (const major_id of item_stats.get("majorIds")) {
                    major_ids.add(major_id);
                }
            }
        }
        statMap.set("activeMajorIDs", major_ids);
        for (const [setName, count] of this.activeSetCounts) {
            const bonus = sets.get(setName).bonuses[count-1];
            for (const id in bonus) {
                if (skp_order.includes(id)) {
                    // pass. Don't include skillpoints in ids
                }
                else {
                    statMap.set(id,(statMap.get(id) || 0)+bonus[id]);
                }
            }
        }
        statMap.set("poisonPct", 100);

        // The stuff relevant for damage calculation!!! @ferricles
        statMap.set("atkSpd", this.weapon.statMap.get("atkSpd"));

        this.statMap = statMap;

        this.aggregateStats();
    }

    aggregateStats() {
        let statMap = this.statMap;
        let weapon_stats = this.weapon.statMap;
        statMap.set("damageRaw", [weapon_stats.get("nDam"), weapon_stats.get("eDam"), weapon_stats.get("tDam"), weapon_stats.get("wDam"), weapon_stats.get("fDam"), weapon_stats.get("aDam")]);
        statMap.set("damageBonus", [statMap.get("eDamPct"), statMap.get("tDamPct"), statMap.get("wDamPct"), statMap.get("fDamPct"), statMap.get("aDamPct")]);
        statMap.set("defRaw", [statMap.get("eDef"), statMap.get("tDef"), statMap.get("wDef"), statMap.get("fDef"), statMap.get("aDef")]);
        statMap.set("defBonus", [statMap.get("eDefPct"), statMap.get("tDefPct"), statMap.get("wDefPct"), statMap.get("fDefPct"), statMap.get("aDefPct")]);
        statMap.set("defMult", classDefenseMultipliers.get(weapon_stats.get("type")));
    }
}
