

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
    constructor(level, items, weapon){

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
        this.weapon = weapon;
        this.items = this.equipment.concat([this.weapon]);
        // return [equip_order, best_skillpoints, final_skillpoints, best_total];

        // calc skillpoints requires statmaps only
        let result = calculate_skillpoints(this.equipment.map((x) => x.statMap), this.weapon.statMap);
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
        return [this.equipment,this.weapon].flat();
    }


    /*  Get all stats for this build. Stores in this.statMap.
        @pre The build itself should be valid. No checking of validity of pieces is done here.
    */
    initBuildStats(){

        let staticIDs = ["hp", "eDef", "tDef", "wDef", "fDef", "aDef", "str", "dex", "int", "def", "agi", "damMobs", "defMobs"];

        let must_ids = [
            "eMdPct","eMdRaw","eSdPct","eSdRaw","eDamPct","eDamRaw","eDamAddMin","eDamAddMax",
            "tMdPct","tMdRaw","tSdPct","tSdRaw","tDamPct","tDamRaw","tDamAddMin","tDamAddMax",
            "wMdPct","wMdRaw","wSdPct","wSdRaw","wDamPct","wDamRaw","wDamAddMin","wDamAddMax",
            "fMdPct","fMdRaw","fSdPct","fSdRaw","fDamPct","fDamRaw","fDamAddMin","fDamAddMax",
            "aMdPct","aMdRaw","aSdPct","aSdRaw","aDamPct","aDamRaw","aDamAddMin","aDamAddMax",
            "nMdPct","nMdRaw","nSdPct","nSdRaw","nDamPct","nDamRaw","nDamAddMin","nDamAddMax",      // neutral which is now an element
            "mdPct","mdRaw","sdPct","sdRaw","damPct","damRaw","damAddMin","damAddMax",          // These are the old ids. Become proportional.
            "rMdPct","rMdRaw","rSdPct","rSdRaw","rDamPct","rDamRaw","rDamAddMin","rDamAddMax"   // rainbow (the "element" of all minus neutral). rSdRaw is rainraw
        ]

        //Create a map of this build's stats
        let statMap = new Map();
        statMap.set("defMultiplier", 1);

        for (const staticID of staticIDs) {
            statMap.set(staticID, 0);
        }
        for (const staticID of must_ids) {
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
        statMap.set('damageMultiplier', 1 + (statMap.get('damMobs') / 100));
        statMap.set('defMultiplier', 1 - (statMap.get('defMobs') / 100));
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
    }
}
