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
        this.skillpoints = levelToSkillPoints(this.level)
    }  

    /*Returns build in string format
    */ TODO
    toString(){
        return this.helmet.name + ", " + this.chestplate.name + ", " + this.leggings.name + ", " + this.boots.name + ", " + this.ring1.name + ", " + this.ring2.name + ", " + this.bracelet.name + ", " + this.necklace.name + ", " + this.weapon.name;
    }

    /* Getters */ TODO
    getHealth(){
        health = parseInt(this.helmet.hp,10) + parseInt(this.helmet.hpBonus,10) + parseInt(this.chestplate.hp,10) + parseInt(this.chestplate.hpBonus,10) + parseInt(this.leggings.hp,10) + parseInt(this.leggings.hpBonus,10) + parseInt(this.boots.hp,10) + parseInt(this.boots.hpBonus,10) + parseInt(this.ring1.hp,10) + parseInt(this.ring1.hpBonus,10) + parseInt(this.ring2.hp,10) + parseInt(this.ring2.hpBonus,10) + parseInt(this.bracelet.hp,10) + parseInt(this.bracelet.hpBonus,10) + parseInt(this.necklace.hp,10) + parseInt(this.necklace.hpBonus,10) + parseInt(this.weapon.hp,10) + parseInt(this.weapon.hpBonus,10) + levelToHPBase(this.level);
        if(health<5){
            return 5;
        }else{
            return health;
        }
    }
    /* Setters */ TODO

}
