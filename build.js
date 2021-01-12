
const baseDamageMultiplier = [ 0.51, 0.83, 1.5, 2.05, 2.5, 3.1, 4.3 ];
const attackSpeeds = ["SUPER_SLOW", "VERY_SLOW", "SLOW", "NORMAL", "FAST", "VERY_FAST", "SUPER_FAST"];
const classDefenseMultipliers = new Map([ ["relik",0.50], ["bow",0.60], ["wand", 0.80], ["dagger", 1.0], ["spear",1.20] ]);

/*Turns the input amount of skill points into a float precision percentage.
* @param skp - the integer skillpoint count to be converted
*/
function skillPointsToPercentage(skp){
    if (skp<=0){
        return 0.0;
    }else if(skp>=150){
        return 0.808;
    }else{
        return(-0.0000000066695* Math.pow(Math.E, -0.00924033 * skp + 18.9) + 1.0771);
        //return(-0.0000000066695* Math.pow(Math.E, -0.00924033 * skp + 18.9) + 1.0771).toFixed(3);
    }       
}

/*Turns the input amount of levels into skillpoints available.
*
* @param level - the integer level count te be converted
*/
function levelToSkillPoints(level){
    if(level < 1){
        return 0;
    }else if(level >= 101){
        return 200;
    }else{
        return (level - 1) * 2;
    }
}

/*Turns the input amount of levels in to base HP.
* @param level - the integer level count to be converted
*/
function levelToHPBase(level){
    if(level < 1){ //bad level
        return this.levelToHPBase(1);
    }else if (level > 106){ //also bad level
        return this.levelToHPBase(106);
    }else{ //good level
        return 5*level + 5;
    }
}

/*Class that represents a wynn player's build.
*/
class Build{
    
    /*
     * Construct a build.
     * @param level : Level of the player.
     * @param equipment : List of equipment names that make up the build.
     *                    In order: Helmet, Chestplate, Leggings, Boots, Ring1, Ring2, Brace, Neck, Weapon.
     * @param powders : Powder application. List of lists of integers (powder IDs).
     *                  In order: Helmet, Chestplate, Leggings, Boots, Weapon.
     */
    constructor(level,equipment, powders){
        // NOTE: powders is just an array of arrays of powder IDs. Not powder objects.
        this.powders = powders;
        if(itemMap.get(equipment[0]) && itemMap.get(equipment[0]).type === "helmet") {
            const helmet = itemMap.get(equipment[0]);
            this.powders[0] = this.powders[0].slice(0,helmet.slots); 
            this.helmet = expandItem(helmet, this.powders[0]);
        }else{
            throw new TypeError("No such helmet named ", equipment[0]);
        }
        if(itemMap.get(equipment[1]).type === "chestplate") {
            const chestplate = itemMap.get(equipment[1]);
            this.powders[1] = this.powders[1].slice(0,chestplate.slots); 
            this.chestplate = expandItem(chestplate, this.powders[1]);
        }else{
            throw new TypeError("No such chestplate named ", equipment[1]);
        }
        if(itemMap.get(equipment[2]).type === "leggings") {
            const leggings = itemMap.get(equipment[2]);
            this.powders[2] = this.powders[2].slice(0,leggings.slots); 
            this.leggings = expandItem(leggings, this.powders[2]);
        }else{
            throw new TypeError("No such leggings named ", equipment[2]);
        }
        if(itemMap.get(equipment[3]).type === "boots") {
            const boots = itemMap.get(equipment[3]);
            this.powders[3] = this.powders[3].slice(0,boots.slots); 
            this.boots = expandItem(boots, this.powders[3]);
        }else{
            throw new TypeError("No such boots named ", equipment[3]);
        }
        if(itemMap.get(equipment[4]).type === "ring") {
            const ring = itemMap.get(equipment[4]);
            this.ring1 = expandItem(ring, []);
        }else{
            throw new TypeError("No such ring named ", equipment[4]);
        }
        if(itemMap.get(equipment[5]).type === "ring") {
            const ring = itemMap.get(equipment[5]);
            this.ring2 = expandItem(ring, []);
        }else{
            throw new TypeError("No such ring named ", equipment[5]);
        }
        if(itemMap.get(equipment[6]).type === "bracelet") {
            const bracelet = itemMap.get(equipment[6]);
            this.bracelet = expandItem(bracelet, []);
        }else{
            throw new TypeError("No such bracelet named ", equipment[6]);
        }
        if(itemMap.get(equipment[7]).type === "necklace") {
            const necklace = itemMap.get(equipment[7]);
            this.necklace = expandItem(necklace, []);
        }else{
            throw new TypeError("No such necklace named ", equipment[7]);
        }
        if(itemMap.get(equipment[8]).category === "weapon") {
            const weapon = itemMap.get(equipment[8]);
            this.powders[4] = this.powders[4].slice(0,weapon.slots); 
            this.weapon = expandItem(weapon, this.powders[4]);
        }else{
            throw new TypeError("No such weapon named ", equipment[8]);
        }
        if(level < 1){ //Should these be constants?
            this.level = 1;
        }else if (level > 106){
            this.level = 106;
        }else{
            this.level = level;
        }
        this.availableSkillpoints = levelToSkillPoints(this.level);
        this.equipment = [ this.helmet, this.chestplate, this.leggings, this.boots, this.ring1, this.ring2, this.bracelet, this.necklace ];
        this.items = this.equipment.concat([this.weapon]);
        // return [equip_order, best_skillpoints, final_skillpoints, best_total];
        let result = calculate_skillpoints(this.equipment, this.weapon);
        this.equip_order = result[0];
        this.base_skillpoints = result[1];
        this.total_skillpoints = result[2];
        this.assigned_skillpoints = result[3];
        this.activeSetCounts = result[4];

        // For strength boosts like warscream, vanish, etc.
        this.damageMultiplier = 1.0;

        this.initBuildStats();
    }  

    /*Returns build in string format
    */
    toString(){
        return this.helmet.get("name") + ", " + this.chestplate.get("name") + ", " + this.leggings.get("name") + ", " + this.boots.get("name") + ", " + this.ring1.get("name") + ", " + this.ring2.get("name") + ", " + this.bracelet.get("name") + ", " + this.necklace.get("name") + ", " + this.weapon.get("name");
    }

    /* Getters */

    /*  Get total health for build.
    */

    getSpellCost(spellIdx, cost) {
        cost = Math.ceil(cost * (1 - skillPointsToPercentage(this.total_skillpoints[2])));
        cost += this.statMap.get("spRaw"+spellIdx);
        return Math.max(1, Math.floor(cost * (1 + this.statMap.get("spPct"+spellIdx) / 100)))
    }
    

    /*  Get melee stats for build.
        Returns an array in the order:
    */
    getMeleeStats(){
        const stats = this.statMap;
        let adjAtkSpd = attackSpeeds.indexOf(stats.get("atkSpd")) + stats.get("atkTier");
        if(adjAtkSpd > 6){
            adjAtkSpd = 6;
        }else if(adjAtkSpd < 0){
            adjAtkSpd = 0;
        }

        // 0 for melee damage.
        let results = calculateSpellDamage(stats, [100, 0, 0, 0, 0, 0], stats.get("mdRaw"), stats.get("mdPct"), 0, this.weapon, this.total_skillpoints, this.damageMultiplier);
        
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
        return damages_results.concat([totalDamNorm,totalDamCrit,normDPS,critDPS,avgDPS,adjAtkSpd, singleHitTotal]);
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
        ehp[0] /= ((1-def_pct)*(1-agi_pct)*(2-defMult));         
        ehp[1] /= ((1-def_pct)*(2-defMult));    
        defenseStats.push(ehp);
        //HPR
        let totalHpr = rawToPct(stats.get("hprRaw"), stats.get("hprPct")/100.);
        defenseStats.push(totalHpr);
        //EHPR
        let ehpr = [totalHpr, totalHpr];
        ehpr[0] /= ((1-def_pct)*(1-agi_pct)*(2-defMult)); 
        ehpr[1] /= ((1-def_pct)*(2-defMult)); 
        defenseStats.push(ehpr);
        //skp stats
        defenseStats.push([def_pct*100, agi_pct*100]);
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

        let staticIDs = ["hp", "eDef", "tDef", "wDef", "fDef", "aDef"];

        //Create a map of this build's stats
        //This is universal for every possible build, so it's possible to move this elsewhere.
        let statMap = new Map();

        for (const staticID of staticIDs) {
            statMap.set(staticID, 0);
        }
        statMap.set("hp", levelToHPBase(this.level)); //TODO: Add player base health
        
        for (const item of this.items){
            for (let [id, value] of item.get("maxRolls")) {
                statMap.set(id,(statMap.get(id) || 0)+value);
            }
            for (const staticID of staticIDs) {
                if (item.get(staticID)) {
                    statMap.set(staticID, statMap.get(staticID) + item.get(staticID));
                }
            }
        }
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

        // The stuff relevant for damage calculation!!! @ferricles
        statMap.set("atkSpd", this.weapon.get("atkSpd"));
        statMap.set("damageRaw", [this.weapon.get("nDam"), this.weapon.get("eDam"), this.weapon.get("tDam"), this.weapon.get("wDam"), this.weapon.get("fDam"), this.weapon.get("aDam")]);
        statMap.set("damageBonus", [statMap.get("eDamPct"), statMap.get("tDamPct"), statMap.get("wDamPct"), statMap.get("fDamPct"), statMap.get("aDamPct")]);
        statMap.set("defRaw", [statMap.get("eDam"), statMap.get("tDef"), statMap.get("wDef"), statMap.get("fDef"), statMap.get("aDef")]);
        statMap.set("defBonus", [statMap.get("eDamPct"), statMap.get("tDefPct"), statMap.get("wDefPct"), statMap.get("fDefPct"), statMap.get("aDefPct")]);

        this.statMap = statMap;
    }

}
