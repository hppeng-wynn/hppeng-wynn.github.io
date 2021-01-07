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
        console.log(result);
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
    /*  Get total melee dps for build.
    */
    getMeleeDPS(){
        let meleeMult = {
            "SUPER_SLOW":"0.51",
            "VERY_SLOW":"0.83",
            "SLOW":"1.5",
            "NORMAL":"2.05",
            "FAST":"2.5",
            "VERY_FAST":"3.1",
            "SUPER_FAST":"4.3",
        }
        let stats = this.getBuildStats();
        let nDam = stats.get("nDam");

        return [];
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
        for (const i in item_fields){ 
            let id = item_fields[i];
            if(stackingIDs.includes(id)){ //IDs stack - make it number
                statMap.set(id,0);
            }else if(standaloneIDs.includes(id)){ //IDs do not stack - string
                statMap.set(id,"");
            }
        }
        for (const i in this.items){
            let item = expandItem(this.items[i]);
            console.log(item,type(item));
            if(item.has("fixID") && item.get("fixID")){//item has fixed IDs
                for(const [key,value] in item.entries()){
                    console.log(key,value);
                }
            }else{//item does not have fixed IDs
                for (const i in item) {
                    console.log(entry,": ",item.get(entry));
                  }
            }
        }

        return statMap;
    }

    /* Setters */


}
