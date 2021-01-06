//Turns the input amount of skill points into a 3-decimal precision percentage.
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


for (i = 0; i < 151; i++) {
  console.log(i, ", ",skillPointsToPercentage(i));
}

class Build{
    
}