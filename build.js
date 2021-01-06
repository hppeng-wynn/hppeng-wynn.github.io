/*Class that represents a wynn player's build.
*/
class Build{
    item_fields = [ "name", "displayName", "tier", "set", "slots", "type", "material", "drop", "quest", "restrict", "nDam", "fDam", "wDam", "aDam", "tDam", "eDam", "atkSpd", "hp", "fDef", "wDef", "aDef", "tDef", "eDef", "lvl", "classReq", "strReq", "dexReq", "intReq", "agiReq", "defReq", "hprPct", "mr", "sdPct", "mdPct", "ls", "ms", "xpb", "lb", "ref", "str", "dex", "int", "agi", "def", "thorns", "expoding", "spd", "atkTier", "poison", "hpBonus", "spRegen", "eSteal", "hprRaw", "sdRaw", "mdRaw", "fDamPct", "wDamPct", "aDamPct", "tDamPct", "eDamPct", "fDefPct", "wDefPct", "aDefPct", "tDefPct", "eDefPct", "type", "fixID", "category", "spPct1", "spRaw1", "spPct2", "spRaw2", "spPct3", "spRaw3", "spPct4", "spRaw4", "rainbowRaw", "sprint", "sprintReg", "jh", "lq", "gXp", "gSpd" ];

    /*Turns the input amount of skill points into a float precision percentage.
    * @param skp - the integer skillpoint count to be converted
    */
    static skillPointsToPercentage(skp){
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
    static levelToSkillPoints(level){
        if(level < 1){
            return 0;
        }else if(level >= 101){
            return 200;
        }else{
            return (level - 1) * 2;
        }
    }
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
        if(ring1.type.valueOf() != "rings"){
            throw new TypeError("No such ring named ", ring1.name);
        }else{
            this.ring1 = ring1;
        }
        if(ring2.type.valueOf() != "rings"){
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
            this.necklace = necklace;
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
        this.skillpoints = levelToSkillPoints(this.level)
    }  

    /*Returns build in string format
    */ TODO
    toString(){
        return this.helmet.name + ", " + this.chestplate.name + ", " + this.leggings.name + ", " + this.boots.name + ", " + this.ring1.name + ", " + this.ring2.name + ", " + this.bracelet.name + ", " + this.necklace.name + ", " + this.weapon.name;
    }

    /* Getters */
    //getHealth()
    /* Setters */

}

export{Build};
