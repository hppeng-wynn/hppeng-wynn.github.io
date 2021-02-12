/*Turns the input amount of skill points into a float precision percentage.
* @param skp - the integer skillpoint count to be converted
*/
function skillPointsToPercentage(skp){
    /*if (skp<=0){
        return 0.0;
    }else if(skp>=150){
        return 0.808;
    }else{
        return (-0.0000000066695* Math.pow(Math.E, -0.00924033 * skp + 18.9) + 1.0771);
        //return(-0.0000000066695* Math.pow(Math.E, -0.00924033 * skp + 18.9) + 1.0771).toFixed(3);
    }*/    
    //return Math.min(Math.max(0.00,(-0.0000000066695* Math.pow(Math.E, -0.00924033 * skp + 18.9) + 1.0771)),.808); 
    return clamp((-0.0000000066695* Math.pow(Math.E, -0.00924033 * skp + 18.9) + 1.0771), 0.00, 0.808);
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