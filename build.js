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


const baseDamageMultiplier = [ 0.51, 0.83, 1.5, 2.05, 2.5, 3.1, 4.3 ];
const attackSpeeds = ["SUPER_SLOW", "VERY_SLOW", "SLOW", "NORMAL", "FAST", "VERY_FAST", "SUPER_FAST"];

/*Class that represents a wynn player's build.
*/
class Build{
    
    /*Construct a build.
    */
    constructor(level,helmet,chestplate,leggings,boots,ring1,ring2,bracelet,necklace,weapon,powders){
        // NOTE: powders is just an array of arrays of powder IDs. Not powder objects.
        this.powders = powders
        if(helmet.type.valueOf() != "helmet".valueOf()){
            throw new TypeError("No such helmet named ", helmet.name);
        }else{
            this.powders[0] = this.powders[0].slice(0,helmet.slots); 
            this.helmet = expandItem(helmet, this.powders[0]);
        }
        if(chestplate.type.valueOf() != "chestplate"){
            throw new TypeError("No such chestplate named ", chestplate.name);
        }else{
            this.powders[1] = this.powders[1].slice(0,chestplate.slots); 
            this.chestplate = expandItem(chestplate, this.powders[1]);
        }
        if(leggings.type.valueOf() != "leggings"){
            throw new TypeError("No such leggings named ", leggings.name);
        }else{
            this.powders[2] = this.powders[2].slice(0,leggings.slots); 
            this.leggings = expandItem(leggings, this.powders[2]);
        }
        if(boots.type.valueOf() != "boots"){
            throw new TypeError("No such boots named ", boots.name);
        }else{
            this.powders[3] = this.powders[3].slice(0,boots.slots); 
            this.boots = expandItem(boots, this.powders[3]);
        }
        if(ring1.type.valueOf() != "ring"){
            throw new TypeError("No such ring named ", ring1.name);
        }else{
            this.ring1 = expandItem(ring1, []);
        }
        if(ring2.type.valueOf() != "ring"){
            throw new TypeError("No such ring named ", ring2.name);
        }else{
            this.ring2 = expandItem(ring2, []);
        }
        if(bracelet.type.valueOf() != "bracelet"){
            throw new TypeError("No such bracelet named ", bracelet.name);
        }else{
            this.bracelet = expandItem(bracelet, []);
        }
        if(necklace.type.valueOf() != "necklace"){
            throw new TypeError("No such necklace named ", necklace.name);
        }else{
            this.necklace = expandItem(necklace, []);
        }
        if(weapon.type.valueOf() == "wand" || weapon.type.valueOf() == "bow" || weapon.type.valueOf() == "dagger" || weapon.type.valueOf() == "spear" || weapon.type.valueOf() == "relik"){
            this.powders[4] = this.powders[4].slice(0,weapon.slots); 
            this.weapon = expandItem(weapon, this.powders[4]);
        }else{
            throw new TypeError("No such weapon named ", weapon.name);
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
    getHealth(){
        let health = levelToHPBase(this.level);
        for (const item in this.items) {
            if (item.hp) health += item.hp;
            if (item.hpBonus) health += item.hpBonus;
        }
        if(health<5){
            return 5;
        }else{
            return health;
        }
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
        let results = calculateSpellDamage(stats, [100, 0, 0, 0, 0, 0], stats.get("mdRaw"), stats.get("mdPct"), 0, this.weapon, this.damageMultiplier, this.total_skillpoints);
        let totalDamNorm = results[0];
        let totalDamCrit = results[1];
        let damages_results = results[2];

        let dex = this.total_skillpoints[1];

        //Now do math
        let normDPS = (totalDamNorm[0]+totalDamNorm[1])/2 * baseDamageMultiplier[adjAtkSpd];
        let critDPS = (totalDamCrit[0]+totalDamCrit[1])/2 * baseDamageMultiplier[adjAtkSpd];
        let avgDPS = (normDPS * (1 - skillPointsToPercentage(dex))) + (critDPS * (skillPointsToPercentage(dex)));
        //console.log([nDamAdj,eDamAdj,tDamAdj,wDamAdj,fDamAdj,aDamAdj,totalDamNorm,totalDamCrit,normDPS,critDPS,avgDPS]);
        return damages_results.concat([totalDamNorm,totalDamCrit,normDPS,critDPS,avgDPS,adjAtkSpd]);
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
                if (item[staticID]) { statMap.set(statMap.get(staticID) + item[staticID]); }
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
