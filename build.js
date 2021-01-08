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
    constructor(level,helmet,chestplate,leggings,boots,ring1,ring2,bracelet,necklace,weapon){
        if(helmet.type.valueOf() != "helmet".valueOf()){
            throw new TypeError("No such helmet named ", helmet.name);
        }else{
            this.helmet = helmet;
        }
        if(chestplate.type.valueOf() != "chestplate"){
            throw new TypeError("No such chestplate named ", chestplate.name);
        }else{
            this.chestplate = chestplate;
        }
        if(leggings.type.valueOf() != "leggings"){
            throw new TypeError("No such leggings named ", leggings.name);
        }else{
            this.leggings = leggings;
        }
        if(boots.type.valueOf() != "boots"){
            throw new TypeError("No such boots named ", boots.name);
        }else{
            this.boots = boots;
        }
        if(ring1.type.valueOf() != "ring"){
            throw new TypeError("No such ring named ", ring1.name);
        }else{
            this.ring1 = ring1;
        }
        if(ring2.type.valueOf() != "ring"){
            throw new TypeError("No such ring named ", ring2.name);
        }else{
            this.ring2 = ring2;
        }
        if(bracelet.type.valueOf() != "bracelet"){
            throw new TypeError("No such bracelet named ", bracelet.name);
        }else{
            this.bracelet = bracelet;
        }
        if(necklace.type.valueOf() != "necklace"){
            throw new TypeError("No such necklace named ", necklace.name);
        }else{
            this.necklace = necklace;
        }
        if(weapon.type.valueOf() == "wand" || weapon.type.valueOf() == "bow" || weapon.type.valueOf() == "dagger" || weapon.type.valueOf() == "spear" || weapon.type.valueOf() == "relik"){
            this.weapon = weapon;
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
        this.equipment = [ helmet, chestplate, leggings, boots, ring1, ring2, bracelet, necklace ];
        this.items = this.equipment.concat([weapon]);
        // return [equip_order, best_skillpoints, final_skillpoints, best_total];
        let result = calculate_skillpoints(this.equipment, weapon);
        this.equip_order = result[0];
        this.base_skillpoints = result[1];
        this.total_skillpoints = result[2];
        this.assigned_skillpoints = result[3];

        this.initBuildStats();
    }  

    /*Returns build in string format
    */
    toString(){
        return this.helmet.name + ", " + this.chestplate.name + ", " + this.leggings.name + ", " + this.boots.name + ", " + this.ring1.name + ", " + this.ring2.name + ", " + this.bracelet.name + ", " + this.necklace.name + ", " + this.weapon.name;
    }

    /* Getters */

    /*  Get total health for build.
    */
    getHealth(){
        health = parseInt(this.helmet.hp,10) + parseInt(this.helmet.hpBonus,10) + parseInt(this.chestplate.hp,10) + parseInt(this.chestplate.hpBonus,10) + parseInt(this.leggings.hp,10) + parseInt(this.leggings.hpBonus,10) + parseInt(this.boots.hp,10) + parseInt(this.boots.hpBonus,10) + parseInt(this.ring1.hp,10) + parseInt(this.ring1.hpBonus,10) + parseInt(this.ring2.hp,10) + parseInt(this.ring2.hpBonus,10) + parseInt(this.bracelet.hp,10) + parseInt(this.bracelet.hpBonus,10) + parseInt(this.necklace.hp,10) + parseInt(this.necklace.hpBonus,10) + parseInt(this.weapon.hp,10) + parseInt(this.weapon.hpBonus,10) + levelToHPBase(this.level);
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
        // Array of neutral + ewtf damages. Each entry is a pair (min, max).
        let damages = [];
        for (const damage_string of stats.get("damageRaw")) {
            const damage_vals = damage_string.split("-").map(Number);
            damages.push(damage_vals);
        }
        let mdRaw = stats.get("mdRaw");
        
        let mdPct = stats.get("mdPct");
        
        let adjAtkSpd = attackSpeeds.indexOf(stats.get("atkSpd")) + stats.get("atkTier");
        if(adjAtkSpd > 6){
            adjAtkSpd = 6;
        }else if(adjAtkSpd < 0){
            adjAtkSpd = 0;
        }
        let poison = stats.get("poison");

        let totalDamNorm = [mdRaw, mdRaw];
        let totalDamCrit = [mdRaw, mdRaw];
        let damages_results = [];
        // 0th skillpoint is strength, 1st is dex.
        let str = this.total_skillpoints[0];
        let dex = this.total_skillpoints[1];
        let staticBoost = (mdPct / 100.)  + skillPointsToPercentage(str);
        let skillBoost = [0];
        for (let i in this.total_skillpoints) {
            skillBoost.push(skillPointsToPercentage(this.total_skillpoints[i]) + stats.get("damageBonus")[i] / 100.);
        }
        console.log(skillBoost);
        for (let i in damages) {
            let damageBoost = 1 + skillBoost[i] + staticBoost;
            console.log(damageBoost);
            damages_results.push([
                Math.round(damages[i][0] * damageBoost),        // Normal min
                Math.round(damages[i][1] * damageBoost),        // Normal max
                Math.round(damages[i][0] * (1 + damageBoost)),  // Crit min
                Math.round(damages[i][1] * (1 + damageBoost)),  // Crit max
            ]);
            totalDamNorm[0] += damages_results[i][0];
            totalDamNorm[1] += damages_results[i][1];
            totalDamCrit[0] += damages_results[i][2];
            totalDamCrit[1] += damages_results[i][3];
        }
        for (let i in damages_results[0]) {
            damages_results[0][i] += mdRaw;
        }

        //Now do math
        let normDPS = (totalDamNorm[0]+totalDamNorm[1])/2 * baseDamageMultiplier[adjAtkSpd];
        let critDPS = (totalDamCrit[0]+totalDamCrit[1])/2 * baseDamageMultiplier[adjAtkSpd];
        let avgDPS = (normDPS * (1 - skillPointsToPercentage(dex))) + (critDPS * (skillPointsToPercentage(dex))) + (poison / 3.0 * (1 + skillPointsToPercentage(str)));
        //console.log([nDamAdj,eDamAdj,tDamAdj,wDamAdj,fDamAdj,aDamAdj,totalDamNorm,totalDamCrit,normDPS,critDPS,avgDPS]);
        return damages_results.concat([totalDamNorm,totalDamCrit,normDPS,critDPS,avgDPS]);
    }

    /*  Get all stats for this build. Stores in this.statMap.
        @dep test.js.expandItem()
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
        
        for (const _item of this.items){
            let item = expandItem(_item);
            for (let [id, value] of item.get("maxRolls")) {
                statMap.set(id,(statMap.get(id) || 0)+value);
            }
            for (const staticID of staticIDs) {
                if (item[staticID]) { statMap.set(statMap.get(staticID) + item[staticID]); }
            }
        }

        // The stuff relevant for damage calculation!!! @ferricles
        statMap.set("atkSpd", this.weapon["atkSpd"]);
        statMap.set("damageRaw", [this.weapon["nDam"], this.weapon["eDam"], this.weapon["tDam"], this.weapon["wDam"], this.weapon["fDam"], this.weapon["aDam"]]);
        statMap.set("damageBonus", [statMap.get("eDamPct"), statMap.get("tDamPct"), statMap.get("wDamPct"), statMap.get("fDamPct"), statMap.get("aDamPct")]);
        statMap.set("defRaw", [statMap.get("eDam"), statMap.get("tDef"), statMap.get("wDef"), statMap.get("fDef"), statMap.get("aDef")]);
        statMap.set("defBonus", [statMap.get("eDamPct"), statMap.get("tDefPct"), statMap.get("wDefPct"), statMap.get("fDefPct"), statMap.get("aDefPct")]);

        console.log(statMap);

        this.statMap = statMap;
    }

}
