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
        this.items = [helmet, chestplate, leggings, boots, ring1, ring2, bracelet, necklace, weapon];
        // return [equip_order, best_skillpoints, final_skillpoints, best_total];
        let result = calculate_skillpoints(this.equipment, weapon);
        this.equip_order = result[0];
        this.base_skillpoints = result[1];
        this.total_skillpoints = result[2];
        this.assigned_skillpoints = result[3];
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
        //Establish vars
        let meleeMult = new Map();
        meleeMult.set("SUPER_SLOW",0.51);
        meleeMult.set("VERY_SLOW",0.83);
        meleeMult.set("SLOW",1.5);
        meleeMult.set("NORMAL",2.05);
        meleeMult.set("FAST",2.5); 
        meleeMult.set("VERY_FAST",3.1);
        meleeMult.set("SUPER_FAST",4.3);
        let atkSpdToNum = new Map();
        atkSpdToNum.set("SUPER_SLOW",-3);
        atkSpdToNum.set("VERY_SLOW",-2);
        atkSpdToNum.set("SLOW",-1);
        atkSpdToNum.set("NORMAL",0);
        atkSpdToNum.set("FAST",1);
        atkSpdToNum.set("VERY_FAST",2);
        atkSpdToNum.set("SUPER_FAST",3);
        let numToAtkSpd = new Map();
        numToAtkSpd.set(-3,"SUPER_SLOW");
        numToAtkSpd.set(-2,"VERY_SLOW");
        numToAtkSpd.set(-1,"SLOW");
        numToAtkSpd.set(0,"NORMAL");
        numToAtkSpd.set(1,"FAST");
        numToAtkSpd.set(2,"VERY_FAST");
        numToAtkSpd.set(3,"SUPER_FAST");

        let stats = this.getBuildStats();
        let nDam = stats.get("nDam").split("-").map(Number);
        let eDam = stats.get("eDam").split("-").map(Number);
        let tDam = stats.get("tDam").split("-").map(Number);
        let wDam = stats.get("wDam").split("-").map(Number);
        let fDam = stats.get("fDam").split("-").map(Number);
        let aDam = stats.get("aDam").split("-").map(Number);
        let mdRaw = stats.get("maxStats").get("mdRaw");
        
        let mdPct = stats.get("maxStats").get("mdPct");
        let eDamPct = stats.get("maxStats").get("eDamPct");
        let tDamPct = stats.get("maxStats").get("tDamPct");
        let wDamPct = stats.get("maxStats").get("wDamPct");
        let fDamPct = stats.get("maxStats").get("fDamPct");
        let aDamPct = stats.get("maxStats").get("aDamPct");
        
        let baseAtkTier = stats.get("atkSpd");
        let atkTier = stats.get("maxStats").get("atkTier");
        let adjAtkSpd = atkSpdToNum.get(baseAtkTier) + atkTier;
        if(adjAtkSpd > 3){
            adjAtkSpd = 3;
        }else if(adjAtkSpd < -3){
            adjAtkSpd = -3;
        }
        adjAtkSpd = numToAtkSpd.get(adjAtkSpd);
        let str = stats.get("str");
        let strReq = stats.get("strReq");
        str = str + strReq;
        let dex = stats.get("dex");
        let dexReq = stats.get("dexReq");
        dex = dex + dexReq;
        let int = stats.get("int");
        let intReq = stats.get("intReq");
        int = int + intReq;
        let def = stats.get("def");
        let defReq = stats.get("defReq");
        def = def + defReq;
        let agi = stats.get("agi");
        let agiReq = stats.get("agiReq");
        agi = agi + agiReq;
        let poison = stats.get("maxStats").get("poison");

        //Now do math
        let nDamAdj = [Math.round(nDam[0] * ((100 + mdPct + skillPointsToPercentage(str) * 100) / 100.) + mdRaw), Math.round(nDam[1] * ((100 + mdPct + skillPointsToPercentage(str) * 100) / 100.) + mdRaw), Math.round(nDam[0] * ((200 + mdPct + skillPointsToPercentage(str) * 100) / 100.) + mdRaw), Math.round(nDam[1] * ((200 + mdPct + skillPointsToPercentage(str) * 100) / 100.) + mdRaw)];
        let eDamAdj = [Math.round(eDam[0] * ((100 + mdPct + eDamPct + skillPointsToPercentage(str) * 100 + skillPointsToPercentage(str) * 100) / 100.)), Math.round(eDam[1] * ((100 + mdPct + eDamPct + skillPointsToPercentage(str) * 100 + skillPointsToPercentage(str) * 100) / 100.)), Math.round(eDam[0] * ((200 + mdPct + eDamPct + skillPointsToPercentage(str) * 100 + skillPointsToPercentage(str) * 100) / 100.)), Math.round(eDam[1] * ((200 + mdPct + eDamPct + skillPointsToPercentage(str) * 100 + skillPointsToPercentage(str) * 100) / 100.))];
        let tDamAdj = [Math.round(tDam[0] * ((100 + mdPct + tDamPct + skillPointsToPercentage(str) * 100 + skillPointsToPercentage(dex) * 100) / 100.)), Math.round(tDam[1] * ((100 + mdPct + tDamPct + skillPointsToPercentage(str) * 100 + skillPointsToPercentage(dex) * 100) / 100.)), Math.round(tDam[0] * ((200 + mdPct + tDamPct + skillPointsToPercentage(str) * 100 + skillPointsToPercentage(dex) * 100) / 100.)), Math.round(tDam[1] * ((200 + mdPct + tDamPct + skillPointsToPercentage(str) * 100 + skillPointsToPercentage(dex) * 100) / 100.))];
        let wDamAdj = [Math.round(wDam[0] * ((100 + mdPct + wDamPct + skillPointsToPercentage(str) * 100 + skillPointsToPercentage(int) * 100) / 100.)), Math.round(wDam[1] * ((100 + mdPct + wDamPct + skillPointsToPercentage(str) * 100 + skillPointsToPercentage(int) * 100) / 100.)), Math.round(wDam[0] * ((200 + mdPct + wDamPct + skillPointsToPercentage(str) * 100 + skillPointsToPercentage(int) * 100) / 100.)), Math.round(wDam[1] * ((200 + mdPct + wDamPct + skillPointsToPercentage(str) * 100 + skillPointsToPercentage(int) * 100) / 100.))];
        let fDamAdj = [Math.round(fDam[0] * ((100 + mdPct + fDamPct + skillPointsToPercentage(str) * 100 + skillPointsToPercentage(def) * 100) / 100.)), Math.round(fDam[1] * ((100 + mdPct + fDamPct + skillPointsToPercentage(str) * 100 + skillPointsToPercentage(def) * 100) / 100.)), Math.round(fDam[0] * ((200 + mdPct + fDamPct + skillPointsToPercentage(str) * 100 + skillPointsToPercentage(def) * 100) / 100.)), Math.round(fDam[1] * ((200 + mdPct + fDamPct + skillPointsToPercentage(str) * 100 + skillPointsToPercentage(def) * 100) / 100.))];
        let aDamAdj = [Math.round(aDam[0] * ((100 + mdPct + aDamPct + skillPointsToPercentage(str) * 100 + skillPointsToPercentage(agi) * 100) / 100.)), Math.round(aDam[1] * ((100 + mdPct + aDamPct + skillPointsToPercentage(str) * 100 + skillPointsToPercentage(agi) * 100) / 100.)), Math.round(aDam[0] * ((200 + mdPct + aDamPct + skillPointsToPercentage(str) * 100 + skillPointsToPercentage(agi) * 100) / 100.)), Math.round(aDam[1] * ((200 + mdPct + aDamPct + skillPointsToPercentage(str) * 100 + skillPointsToPercentage(agi) * 100) / 100.))];
        let totalDamNorm = [nDamAdj[0]+eDamAdj[0]+tDamAdj[0]+wDamAdj[0]+fDamAdj[0]+aDamAdj[0], nDamAdj[1]+eDamAdj[1]+tDamAdj[1]+wDamAdj[1]+fDamAdj[1]+aDamAdj[1]];
        let totalDamCrit = [nDamAdj[2]+eDamAdj[2]+tDamAdj[2]+wDamAdj[2]+fDamAdj[2]+aDamAdj[2], nDamAdj[3]+eDamAdj[3]+tDamAdj[3]+wDamAdj[3]+fDamAdj[3]+aDamAdj[3]];
        let normDPS = (totalDamNorm[0]+totalDamNorm[1])/2 * meleeMult.get(adjAtkSpd);
        let critDPS = (totalDamCrit[0]+totalDamCrit[1])/2 * meleeMult.get(adjAtkSpd);
        let avgDPS = (normDPS * (1 - skillPointsToPercentage(dex))) + (critDPS * (skillPointsToPercentage(dex))) + (poison / 3.0 * (1 + skillPointsToPercentage(str)));
        //console.log([nDamAdj,eDamAdj,tDamAdj,wDamAdj,fDamAdj,aDamAdj,totalDamNorm,totalDamCrit,normDPS,critDPS,avgDPS]);
        return [nDamAdj,eDamAdj,tDamAdj,wDamAdj,fDamAdj,aDamAdj,totalDamNorm,totalDamCrit,normDPS,critDPS,avgDPS];
    }

    /*  Get all stats for this build. Returns a map w/ sums of all IDs.
        @dep test.js.item_fields
        @dep test.js.rolledIDs
        @dep test.js.nonRolledIDs   
        @dep test.js.expandItem()
        @pre The build itself should be valid. No checking of validity of pieces is done here.
        @post The map returned will contain non-stacking IDs w/ a value null.
    */
    getBuildStats(){
        //Create a map of this build's stats
        //This is universal for every possible build, so it's possible to move this elsewhere.
        let statMap = new Map();
        let minStats = new Map(); //for rolled mins
        let maxStats = new Map(); //for rolled maxs
        for (const i in item_fields){ 
            let id = item_fields[i];
            if(rolledIDs.includes(id)){ //ID is rolled - put the min and max rolls in min and max stats
                if(stackingIDs.includes(id)){ //IDs stack - make it number
                    minStats.set(id,0);
                    maxStats.set(id,0);
                }//if standaloneIDs includes id, something's wrong.
            }else{ //ID is not rolled - just set w/ default
                 if(stackingIDs.includes(id)){//stacking but not rolled: ex skill points
                    statMap.set(id,0);
                 }else if(standaloneIDs.includes(id)){
                    statMap.set(id,"");
                 }else if(skpReqs.includes(id)){
                    statMap.set(id,0);
                 }
            }    
        }
        statMap.set("minStats",minStats);
        statMap.set("maxStats",maxStats);
        
        for (const i in this.items){
            let item = expandItem(this.items[i]);
            for(const [key,value] of item){ //for each key:value pair in item
                if(key === "minRolls"){ 
                    for (const [id,roll] of value){ //for each id:roll pair in minRolls
                        statMap.get("minStats").set(id,statMap.get("minStats").get(id) + roll); //we know they must stack
                    }
                }else if(key==="maxRolls"){
                    for (const [id,roll] of value){ //for each id:roll pair in maxRolls
                        statMap.get("maxStats").set(id,statMap.get("maxStats").get(id) + roll); //we know they must stack
                    }
                }else if(typeof value === "undefined"){ //does not stack - convert to string
                    statMap.set(key,statMap.get(key).concat("undefined,"));
                }else if(typeof value === "null"){ //does not stack - convert to string
                    statMap.set(key,statMap.get(key).concat("null,"));
                }else if(typeof value === "number"){ //although the value is not rolled, it stacks b/c it's a number.
                    if(key === "strReq" || key === "dexReq" || key === "intReq" || key === "defReq" || key === "agiReq" ){
                        if(value > statMap.get(key)){
                            statMap.set(key,value);
                        }
                    }else{
                        statMap.set(key,statMap.get(key)+value);
                    }
                }else if(typeof value === "string"){ //does not stack
                    if(key === "nDam" || key === "eDam" || key === "tDam" || key === "wDam" || key === "fDam" || key === "aDam" || key === "atkSpd"){
                        statMap.set(key,statMap.get(key).concat(value));
                    }else{
                        statMap.set(key,statMap.get(key).concat(value.concat(",")));
                    }
                }
            }
        }
        console.log(statMap);
        return statMap;
    }

    /* Setters */


}
