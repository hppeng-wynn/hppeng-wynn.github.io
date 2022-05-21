

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
    constructor(level,equipment, powders, externalStats, inputerrors=[], tomes){

        let errors = inputerrors;
        //this contains the Craft objects, if there are any crafted items. this.boots, etc. will contain the statMap of the Craft (which is built to be an expandedItem).
        this.craftedItems = [];
        this.customItems = [];
        // NOTE: powders is just an array of arrays of powder IDs. Not powder objects.
        this.powders = powders;
        if(itemMap.get(equipment[0]) && itemMap.get(equipment[0]).type === "helmet") {
            const helmet = itemMap.get(equipment[0]);
            this.powders[0] = this.powders[0].slice(0,helmet.slots); 
            this.helmet = expandItem(helmet, this.powders[0]);
        } else {
            try {
                let helmet = getCustomFromHash(equipment[0]) ? getCustomFromHash(equipment[0]) : (getCraftFromHash(equipment[0]) ? getCraftFromHash(equipment[0]) : undefined);
                if (helmet.statMap.get("type") !== "helmet") {
                    throw new Error("Not a helmet");
                }
                this.powders[0] = this.powders[0].slice(0,helmet.statMap.get("slots")); 
                helmet.statMap.set("powders",this.powders[0].slice());
                this.helmet = helmet.statMap;
                applyArmorPowders(this.helmet, this.powders[0]);
                if (this.helmet.get("custom")) {
                    this.customItems.push(helmet);
                } else if (this.helmet.get("crafted")) { //customs can also be crafted, but custom takes priority.
                    this.craftedItems.push(helmet);
                }
                
            } catch (Error) {
                const helmet = itemMap.get("No Helmet");
                this.powders[0] = this.powders[0].slice(0,helmet.slots);
                this.helmet = expandItem(helmet, this.powders[0]);
                errors.push(new ItemNotFound(equipment[0], "helmet", true));
            }
        }
        if(itemMap.get(equipment[1]) && itemMap.get(equipment[1]).type === "chestplate") {
            const chestplate = itemMap.get(equipment[1]);
            this.powders[1] = this.powders[1].slice(0,chestplate.slots); 
            this.chestplate = expandItem(chestplate, this.powders[1]);
        } else {
            try {
                let chestplate = getCustomFromHash(equipment[1]) ? getCustomFromHash(equipment[1]) : (getCraftFromHash(equipment[1]) ? getCraftFromHash(equipment[1]) : undefined);
                if (chestplate.statMap.get("type") !== "chestplate") {
                    throw new Error("Not a chestplate");
                }
                this.powders[1] = this.powders[1].slice(0,chestplate.statMap.get("slots"));
                chestplate.statMap.set("powders",this.powders[1].slice());
                this.chestplate = chestplate.statMap;
                applyArmorPowders(this.chesplate, this.powders[1]);
                if (this.chestplate.get("custom")) {
                    this.customItems.push(chestplate);
                } else if (this.chestplate.get("crafted")) { //customs can also be crafted, but custom takes priority.
                    this.craftedItems.push(chestplate);
                }
            } catch (Error) {
                console.log(Error);
                const chestplate = itemMap.get("No Chestplate");
                this.powders[1] = this.powders[1].slice(0,chestplate.slots); 
                this.chestplate = expandItem(chestplate, this.powders[1]);
                errors.push(new ItemNotFound(equipment[1], "chestplate", true));
            }
        }
        if (itemMap.get(equipment[2]) && itemMap.get(equipment[2]).type === "leggings") {
            const leggings = itemMap.get(equipment[2]);
            this.powders[2] = this.powders[2].slice(0,leggings.slots); 
            this.leggings = expandItem(leggings, this.powders[2]);
        } else {
            try {
                let leggings = getCustomFromHash(equipment[2]) ? getCustomFromHash(equipment[2]) : (getCraftFromHash(equipment[2]) ? getCraftFromHash(equipment[2]) : undefined);
                if (leggings.statMap.get("type") !== "leggings") {
                    throw new Error("Not a leggings");
                }
                this.powders[2] = this.powders[2].slice(0,leggings.statMap.get("slots")); 
                leggings.statMap.set("powders",this.powders[2].slice());
                this.leggings = leggings.statMap;
                applyArmorPowders(this.leggings, this.powders[2]);
                if (this.leggings.get("custom")) {
                    this.customItems.push(leggings);
                } else if (this.leggings.get("crafted")) { //customs can also be crafted, but custom takes priority.
                    this.craftedItems.push(leggings);
                }
            } catch (Error) {
                const leggings = itemMap.get("No Leggings");
                this.powders[2] = this.powders[2].slice(0,leggings.slots); 
                this.leggings = expandItem(leggings, this.powders[2]);
                errors.push(new ItemNotFound(equipment[2], "leggings", true));
            }
        }
        if (itemMap.get(equipment[3]) && itemMap.get(equipment[3]).type === "boots") {
            const boots = itemMap.get(equipment[3]);
            this.powders[3] = this.powders[3].slice(0,boots.slots); 
            this.boots = expandItem(boots, this.powders[3]);
        } else {
            try {
                let boots = getCustomFromHash(equipment[3]) ? getCustomFromHash(equipment[3]) : (getCraftFromHash(equipment[3]) ? getCraftFromHash(equipment[3]) : undefined);
                if (boots.statMap.get("type") !== "boots") {
                    throw new Error("Not a boots");
                }
                this.powders[3] = this.powders[3].slice(0,boots.statMap.get("slots")); 
                boots.statMap.set("powders",this.powders[3].slice());
                this.boots = boots.statMap;
                applyArmorPowders(this.boots, this.powders[3]);
                if (this.boots.get("custom")) {
                    this.customItems.push(boots);
                } else if (this.boots.get("crafted")) { //customs can also be crafted, but custom takes priority.
                    this.craftedItems.push(boots);
                }
            } catch (Error) {
                const boots = itemMap.get("No Boots");
                this.powders[3] = this.powders[3].slice(0,boots.slots); 
                this.boots = expandItem(boots, this.powders[3]);
                errors.push(new ItemNotFound(equipment[3], "boots", true));
            }
        }
        if(itemMap.get(equipment[4]) && itemMap.get(equipment[4]).type === "ring") {
            const ring = itemMap.get(equipment[4]);
            this.ring1 = expandItem(ring, []);
        }else{
            try {
                let ring = getCustomFromHash(equipment[4]) ? getCustomFromHash(equipment[4]) : (getCraftFromHash(equipment[4]) ? getCraftFromHash(equipment[4]) : undefined);
                if (ring.statMap.get("type") !== "ring") {
                    throw new Error("Not a ring");
                }
                this.ring1 = ring.statMap;
                if (this.ring1.get("custom")) {
                    this.customItems.push(ring);
                } else if (this.ring1.get("crafted")) { //customs can also be crafted, but custom takes priority.
                    this.craftedItems.push(ring);
                }
            } catch (Error) {
                const ring = itemMap.get("No Ring 1");
                this.ring1 = expandItem(ring, []);
                errors.push(new ItemNotFound(equipment[4], "ring1", true, "ring"));
            }
        }
        if(itemMap.get(equipment[5]) && itemMap.get(equipment[5]).type === "ring") {
            const ring = itemMap.get(equipment[5]);
            this.ring2 = expandItem(ring, []);
        }else{
            try {
                let ring = getCustomFromHash(equipment[5]) ? getCustomFromHash(equipment[5]) : (getCraftFromHash(equipment[5]) ? getCraftFromHash(equipment[5]) : undefined);
                if (ring.statMap.get("type") !== "ring") {
                    throw new Error("Not a ring");
                }
                this.ring2 = ring.statMap;
                if (this.ring2.get("custom")) {
                    this.customItems.push(ring);
                } else if (this.ring2.get("crafted")) { //customs can also be crafted, but custom takes priority.
                    this.craftedItems.push(ring);
                }
            } catch (Error) {
                const ring = itemMap.get("No Ring 2");
                this.ring2 = expandItem(ring, []);
                errors.push(new ItemNotFound(equipment[5], "ring2", true, "ring"));
            }
        }
        if(itemMap.get(equipment[6]) && itemMap.get(equipment[6]).type === "bracelet") {
            const bracelet = itemMap.get(equipment[6]);
            this.bracelet = expandItem(bracelet, []);
        }else{
            try {
                let bracelet = getCustomFromHash(equipment[6]) ? getCustomFromHash(equipment[6]) : (getCraftFromHash(equipment[6]) ? getCraftFromHash(equipment[6]) : undefined);
                if (bracelet.statMap.get("type") !== "bracelet") {
                    throw new Error("Not a bracelet");
                }
                this.bracelet = bracelet.statMap;
                if (this.bracelet.get("custom")) {
                    this.customItems.push(bracelet);
                } else if (this.bracelet.get("crafted")) { //customs can also be crafted, but custom takes priority.
                    this.craftedItems.push(bracelet);
                }
            } catch (Error) {
                const bracelet = itemMap.get("No Bracelet");
                this.bracelet = expandItem(bracelet, []);
                errors.push(new ItemNotFound(equipment[6], "bracelet", true));
            }
        }
        if(itemMap.get(equipment[7]) && itemMap.get(equipment[7]).type === "necklace") {
            const necklace = itemMap.get(equipment[7]);
            this.necklace = expandItem(necklace, []);
        }else{
            try {
                let necklace = getCustomFromHash(equipment[7]) ? getCustomFromHash(equipment[7]) : (getCraftFromHash(equipment[7]) ? getCraftFromHash(equipment[7]) : undefined);
                if (necklace.statMap.get("type") !== "necklace") {
                    throw new Error("Not a necklace");
                }
                this.necklace = necklace.statMap;
                if (this.necklace.get("custom")) {
                    this.customItems.push(necklace);
                } else if (this.necklace.get("crafted")) { //customs can also be crafted, but custom takes priority.
                    this.craftedItems.push(necklace);
                }
            } catch (Error) {
                const necklace = itemMap.get("No Necklace");
                this.necklace = expandItem(necklace, []);
                errors.push(new ItemNotFound(equipment[7], "necklace", true));
            }
        }
        if(itemMap.get(equipment[8]) && itemMap.get(equipment[8]).category === "weapon") {
            const weapon = itemMap.get(equipment[8]);
            this.powders[4] = this.powders[4].slice(0,weapon.slots); 
            this.weapon = expandItem(weapon, this.powders[4]);
        }else{
            try {
                let weapon = getCustomFromHash(equipment[8]) ? getCustomFromHash(equipment[8]) : (getCraftFromHash(equipment[8]) ? getCraftFromHash(equipment[8]) : undefined);
                if (weapon.statMap.get("category") !== "weapon") {
                    throw new Error("Not a weapon");
                }
                this.weapon = weapon.statMap;
                if (this.weapon.get("custom")) {
                    this.customItems.push(weapon);
                } else if (this.weapon.get("crafted")) { //customs can also be crafted, but custom takes priority.
                    this.craftedItems.push(weapon);
                }
                this.powders[4] = this.powders[4].slice(0,this.weapon.get("slots")); 
                this.weapon.set("powders",this.powders[4].slice());
                // document.getElementsByClassName("powder-specials")[0].style.display = "grid";
            } catch (Error) {
                const weapon = itemMap.get("No Weapon");
                this.powders[4] = this.powders[4].slice(0,weapon.slots); 
                this.weapon = expandItem(weapon, this.powders[4]);
                // document.getElementsByClassName("powder-specials")[0].style.display = "none";
                errors.push(new ItemNotFound(equipment[8], "weapon", true));
            }
        }

        //cannot craft tomes

        if(tomeMap.get(tomes[0]) && tomeMap.get(tomes[0]).type === "weaponTome") {
            const weaponTome1 = tomeMap.get(tomes[0]);
            this.weaponTome1 = expandItem(weaponTome1, []);
        } else {
            try {
                let weaponTome1 = getCustomFromHash(tomes[0]) ? getCustomFromHash(tomes[0]) : undefined;
                if (weaponTome1.statMap.get("type") !== "weaponTome") {
                    throw new Error("Not a Weapon Tome");
                }
                if (this.weaponTome1.get("custom")) {
                    this.customItems.push(weaponTome1);
                } //can't craft tomes
                
            } catch (Error) {
                const weaponTome1 = tomeMap.get("No Weapon Tome");
                this.weaponTome1 = expandItem(weaponTome1, []);
                errors.push(new ItemNotFound(tomes[0], "weaponTome1", true));
            }
        }
        if(tomeMap.get(tomes[1]) && tomeMap.get(tomes[1]).type === "weaponTome") {
            const weaponTome2 = tomeMap.get(tomes[1]);
            this.weaponTome2 = expandItem(weaponTome2, []);
        } else {
            try {
                let weaponTome2 = getCustomFromHash(tomes[1]) ? getCustomFromHash(tomes[1]) : undefined;
                if (weaponTome2.statMap.get("type") !== "weaponTome") {
                    throw new Error("Not a Weapon Tome");
                }
                if (this.weaponTome2.get("custom")) {
                    this.customItems.push(weaponTome2);
                } //can't craft tomes
                
            } catch (Error) {
                const weaponTome2 = tomeMap.get("No Weapon Tome");
                this.weaponTome2 = expandItem(weaponTome2, []);
                errors.push(new ItemNotFound(tomes[1], "weaponTome2", true));
            }
        }
        if(tomeMap.get(tomes[2]) && tomeMap.get(tomes[2]).type === "armorTome") {
            const armorTome1 = tomeMap.get(tomes[2]);
            this.armorTome1 = expandItem(armorTome1, []);
        } else {
            try {
                let armorTome1 = getCustomFromHash(tomes[2]) ? getCustomFromHash(tomes[2]) : undefined;
                if (armorTome1.statMap.get("type") !== "armorTome") {
                    throw new Error("Not an Armor Tome");
                }
                if (this.armorTome1.get("custom")) {
                    this.customItems.push(armorTome1);
                } //can't craft tomes
                
            } catch (Error) {
                const armorTome1 = tomeMap.get("No Armor Tome");
                this.armorTome1 = expandItem(armorTome1, []);
                errors.push(new ItemNotFound(tomes[2], "armorTome1", true));
            }
        }
        if(tomeMap.get(tomes[3]) && tomeMap.get(tomes[3]).type === "armorTome") {
            const armorTome2 = tomeMap.get(tomes[3]);
            this.armorTome2 = expandItem(armorTome2, []);
        } else {
            try {
                let armorTome2 = getCustomFromHash(tomes[3]) ? getCustomFromHash(tomes[3]) : undefined;
                if (armorTome2.statMap.get("type") !== "armorTome") {
                    throw new Error("Not an Armor Tome");
                }
                if (this.armorTome2.get("custom")) {
                    this.customItems.push(armorTome2);
                } //can't craft tomes
                
            } catch (Error) {
                const armorTome2 = tomeMap.get("No Armor Tome");
                this.armorTome2 = expandItem(armorTome2, []);
                errors.push(new ItemNotFound(tomes[3], "armorTome2", true));
            }
        }
        if(tomeMap.get(tomes[4]) && tomeMap.get(tomes[4]).type === "armorTome") {
            const armorTome3 = tomeMap.get(tomes[4]);
            this.armorTome3 = expandItem(armorTome3, []);
        } else {
            try {
                let armorTome3 = getCustomFromHash(tomes[4]) ? getCustomFromHash(tomes[4]) : undefined;
                if (armorTome3.statMap.get("type") !== "armorTome") {
                    throw new Error("Not an Armor Tome");
                }
                if (this.armorTome3.get("custom")) {
                    this.customItems.push(armorTome3);
                } //can't craft tomes
                
            } catch (Error) {
                const armorTome3 = tomeMap.get("No Armor Tome");
                this.armorTome3 = expandItem(armorTome3, []);
                errors.push(new ItemNotFound(tomes[4], "armorTome3", true));
            }
        }
        if(tomeMap.get(tomes[5]) && tomeMap.get(tomes[5]).type === "armorTome") {
            const armorTome4 = tomeMap.get(tomes[5]);
            this.armorTome4 = expandItem(armorTome4, []);
        } else {
            try {
                let armorTome4 = getCustomFromHash(tomes[5]) ? getCustomFromHash(tomes[5]) : undefined;
                if (armorTome4.statMap.get("type") !== "armorTome") {
                    throw new Error("Not an Armor Tome");
                }
                if (this.armorTome4.get("custom")) {
                    this.customItems.push(armorTome4);
                } //can't craft tomes
                
            } catch (Error) {
                const armorTome4 = tomeMap.get("No Armor Tome");
                this.armorTome4 = expandItem(armorTome4, []);
                errors.push(new ItemNotFound(tomes[5], "armorTome4", true));
            }
        }
        if(tomeMap.get(tomes[6]) && tomeMap.get(tomes[6]).type === "guildTome") {
            const guildTome1 = tomeMap.get(tomes[6]);
            this.guildTome1 = expandItem(guildTome1, []);
        } else {
            try {
                let guildTome1 = getCustomFromHash(tomes[6]) ? getCustomFromHash(tomes[6]) : undefined;
                if (guildTome1.statMap.get("type") !== "guildTome1") {
                    throw new Error("Not an Guild Tome");
                }
                if (this.guildTome1.get("custom")) {
                    this.customItems.push(guildTome1);
                } //can't craft tomes
                
            } catch (Error) {
                const guildTome1 = tomeMap.get("No Guild Tome");
                this.guildTome1 = expandItem(guildTome1, []);
                errors.push(new ItemNotFound(tomes[6], "guildTome1", true));
            }
        }
        
        //console.log(this.craftedItems)

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
        this.equipment = [ this.helmet, this.chestplate, this.leggings, this.boots, this.ring1, this.ring2, this.bracelet, this.necklace ];
        this.tomes = [this.weaponTome1, this.weaponTome2, this.armorTome1, this.armorTome2, this.armorTome3, this.armorTome4, this.guildTome1];
        this.items = this.equipment.concat([this.weapon]).concat(this.tomes);
        // return [equip_order, best_skillpoints, final_skillpoints, best_total];
        let result = calculate_skillpoints(this.equipment.concat(this.tomes), this.weapon);
        console.log(result);
        this.equip_order = result[0];
        // How many skillpoints the player had to assign (5 number)
        this.base_skillpoints = result[1];
        // How many skillpoints the build ended up with (5 number)
        this.total_skillpoints = result[2];
        // How many skillpoints assigned (1 number, sum of base_skillpoints)
        this.assigned_skillpoints = result[3];
        this.activeSetCounts = result[4];
        
        // For strength boosts like warscream, vanish, etc.
        this.damageMultiplier = 1.0;
        this.defenseMultiplier = 1.0;

        // For other external boosts ;-;
        this.externalStats = externalStats;

        this.initBuildStats();

        // Remove every error before adding specific ones
        for (let i of document.getElementsByClassName("error")) {
            i.textContent = "";
        }
        this.errors = errors;
        if (errors.length > 0) this.errored = true;
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
        cost = Math.ceil(cost * (1 - skillPointsToPercentage(this.total_skillpoints[2])));
        cost += this.statMap.get("spRaw"+spellIdx);
        return Math.floor(cost * (1 + this.statMap.get("spPct"+spellIdx) / 100));
    }
    

    /*  Get melee stats for build.
        Returns an array in the order:
    */
    getMeleeStats(){
        const stats = this.statMap;
        if (this.weapon.get("tier") === "Crafted") {
            stats.set("damageBases", [this.weapon.get("nDamBaseHigh"),this.weapon.get("eDamBaseHigh"),this.weapon.get("tDamBaseHigh"),this.weapon.get("wDamBaseHigh"),this.weapon.get("fDamBaseHigh"),this.weapon.get("aDamBaseHigh")]);
        }
        let adjAtkSpd = attackSpeeds.indexOf(stats.get("atkSpd")) + stats.get("atkTier");
        if(adjAtkSpd > 6){
            adjAtkSpd = 6;
        }else if(adjAtkSpd < 0){
            adjAtkSpd = 0;
        }

        let damage_mult = 1;
        if (this.weapon.get("type") === "relik") {
            damage_mult = 0.99; // CURSE YOU WYNNCRAFT
            //One day we will create WynnWynn and no longer have shaman 99% melee injustice.
            //In all seriousness 99% is because wynn uses 0.33 to estimate dividing the damage by 3 to split damage between 3 beams.
        }
        // 0spellmult for melee damage.
        let results = calculateSpellDamage(stats, [100, 0, 0, 0, 0, 0], stats.get("mdRaw"), stats.get("mdPct") + this.externalStats.get("mdPct"), 0, this.weapon, this.total_skillpoints, damage_mult * this.damageMultiplier, this.externalStats);
        
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
        let defMult = classDefenseMultipliers.get(this.weapon.get("type"));
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
            for (let [id, value] of item.get("maxRolls")) {
                if (staticIDs.includes(id)) {
                    continue;
                }
                statMap.set(id,(statMap.get(id) || 0)+value);
            }
            for (const staticID of staticIDs) {
                if (item.get(staticID)) {
                    statMap.set(staticID, statMap.get(staticID) + item.get(staticID));
                }
            }
            if (item.get("majorIds")) {
                for (const major_id of item.get("majorIds")) {
                    major_ids.add(major_id);
                }
            }
        }
        statMap.set("activeMajorIDs", major_ids);
        for (const [setName, count] of this.activeSetCounts) {
            const bonus = sets[setName].bonuses[count-1];
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
        statMap.set("atkSpd", this.weapon.get("atkSpd"));

        for (const x of skp_elements) {
            this.externalStats.set(x + "DamPct", 0);
        }
        this.externalStats.set("mdPct", 0);
        this.externalStats.set("sdPct", 0);
        this.externalStats.set("damageBonus", [0, 0, 0, 0, 0]);
        this.externalStats.set("defBonus",[0, 0, 0, 0, 0]);
        this.externalStats.set("poisonPct", 0);
        this.statMap = statMap;

        this.aggregateStats();
    }

    aggregateStats() {
        let statMap = this.statMap;
        statMap.set("damageRaw", [this.weapon.get("nDam"), this.weapon.get("eDam"), this.weapon.get("tDam"), this.weapon.get("wDam"), this.weapon.get("fDam"), this.weapon.get("aDam")]);
        statMap.set("damageBonus", [statMap.get("eDamPct"), statMap.get("tDamPct"), statMap.get("wDamPct"), statMap.get("fDamPct"), statMap.get("aDamPct")]);
        statMap.set("defRaw", [statMap.get("eDef"), statMap.get("tDef"), statMap.get("wDef"), statMap.get("fDef"), statMap.get("aDef")]);
        statMap.set("defBonus", [statMap.get("eDefPct"), statMap.get("tDefPct"), statMap.get("wDefPct"), statMap.get("fDefPct"), statMap.get("aDefPct")]);
        statMap.set("defMult", classDefenseMultipliers.get(this.weapon.get("type")));
    }
}
