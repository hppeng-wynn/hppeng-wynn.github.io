/** 
 * This file defines a class representing the player Build.
 *
 * Keeps track of equipment list, equip order, skillpoint assignment (initial),
 * Aggregates item stats into a statMap to be used in damage calculation.
 */

const classDefenseMultipliers = new Map([ ["relik",0.60], ["bow",0.70], ["wand", 0.80], ["dagger", 1.0], ["spear", 1.0]]);

/*
 * Class that represents a wynn player's build.
 */
class Build {
    
    /**
     * @description Construct a build.
     * @param {Number} level : Level of the player.
     * @param {String[]} items: List of equipment names that make up the build.
     *                    In order: Helmet, Chestplate, Leggings, Boots, Ring1, Ring2, Brace, Neck, Tomes [x7].
     * @param {Item} weapon: Weapon that this build is using.
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
        } else {
            errors.push("Level is not a string or number.");
        }
        document.getElementById("level-choice").value = this.level;

        this.availableSkillpoints = levelToSkillPoints(this.level);
        this.equipment = items;
        this.weapon = weapon;
        this.items = this.equipment.concat([this.weapon]);

        // calc skillpoints requires statmaps only
        let result = calculate_skillpoints(this.equipment.map((x) => x.statMap), this.weapon.statMap);
        const _equip_order = result[0].slice();
        this.equip_order = [];
        for (const item of _equip_order) {
            if (item.get('category') === 'tome' || item.has('NONE')) { continue; }
            this.equip_order.push(item);
        }
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
            "rMdPct","rMdRaw","rSdPct","rSdRaw","rDamPct","rDamRaw","rDamAddMin","rDamAddMax",  // rainbow (the "element" of all minus neutral). rSdRaw is rainraw
            "healPct",
        ]

        //Create a map of this build's stats
        let statMap = new Map();

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
        statMap.set('damMult', new Map());
        statMap.set('defMult', new Map());
        statMap.get('damMult').set('tome', statMap.get('damMobs'))
        statMap.get('defMult').set('tome', statMap.get('defMobs'))
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
        statMap.set("poisonPct", 0);
        statMap.set("critDamPct", 0);
        statMap.set("healMult", 0);

        // The stuff relevant for damage calculation!!! @ferricles
        statMap.set("atkSpd", this.weapon.statMap.get("atkSpd"));

        this.statMap = statMap;
    }
}
