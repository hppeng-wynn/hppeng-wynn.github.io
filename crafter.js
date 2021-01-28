/*
 * TESTING SECTION
 */

const url_base = location.href.split("#")[0];
const url_tag = location.hash.slice(1);
console.log(url_base);
console.log(url_tag);



const BUILD_VERSION = "6.9.9";
/*
 * END testing section
 */


 /* TODO: 
    Make material tier do something
    Double powders
    Integrate to normal builder
 */
let recipeTypes = ["HELMET","CHESTPLATE","LEGGINGS","BOOTS","RELIK","WAND","SPEAR","DAGGER","BOW","RING","NECKLACE","BRACELET","SCROLL","FOOD","POTION"];
let levelTypes = ["1-3","3-5","5-7","7-9","10-13","13-15","15-17","17-19","20-23","23-25","25-27","27-29","30-33","33-35","35-37","37-39","40-43","43-45","45-47","47-49","50-53","53-55","55-57","57-59","60-63","63-65","65-67","67-69","70-73","73-75","75-77","77-79","80-83","83-85","85-87","87-89","90-93","93-95","95-97","97-99","100-103","103-105",]
let ingFields = ["fDefPct", "wDefPct", "aDefPct", "tDefPct", "eDefPct", "hprPct", "mr", "sdPct", "mdPct", "ls", "ms", "xpb", "lb", "lq", "ref", "str", "dex", "int", "agi", "def", "thorns", "expd", "spd", "atkTier", "poison", "hpBonus", "spRegen", "eSteal", "hprRaw", "sdRaw", "mdRaw", "fDamPct", "wDamPct", "aDamPct", "tDamPct", "eDamPct", "spPct1", "spRaw1", "spPct2", "spRaw2", "spPct3", "spRaw3", "spPct4", "spRaw4", "jh", "sprint", "sprintReg", "gXp", "gSpd"];
let player_craft;

function setTitle() {
    document.getElementById("header").textContent = "WynnCrafter version "+BUILD_VERSION+" (ingredient db version "+ING_DB_VERSION+")";
    document.getElementById("header").classList.add("funnynumber");
    let disclaimer = document.createElement("p");
    disclaimer.textContent = "THIS CRAFTER IS INCOMPLETE. The effect of material tiers on crated items is not 100% tested and accurate. If you know how the math behind it works, please contact ferricles on forums, discord, or ingame.";
    document.getElementById("header").append(disclaimer);
}
setTitle();

let ingMap = new Map();
let ingList = [];

let recipeMap = new Map();
let recipeList = [];

let ingIDMap = new Map();
let recipeIDMap = new Map();
function init() {
    //no ing
    let ing = Object();
    ing.name = "No Ingredient";
    ing.tier = 0;
    ing.lvl = 0;
    ing.skills = ["ARMOURING", "TAILORING", "WEAPONSMITHING", "WOODWORKING", "JEWELING", "COOKING", "ALCHEMISM", "SCRIBING"];
    ing.ids= {};
    ing.itemIDs = {"dura": 0, "strReq": 0, "dexReq": 0,"intReq": 0,"defReq": 0,"agiReq": 0,};
    ing.consumableIDs = {"dura": 0, "charges": 0};
    ing.posMods = {"left": 0, "right": 0, "above": 0, "under": 0, "touching": 0, "notTouching": 0};
    ingMap.set(ing["name"], ing);            
    ingList.push(ing["name"]);
    ingIDMap.set(ingList.length-1, ing["name"]);
    let numerals = new Map([[1, "I"], [2, "II"], [3, "III"], [4, "IV"], [5, "V"], [6, "VI"]]);
    for (let i = 0; i < 5; i ++) {
        for (const powderIng of powderIngreds) {
            let ing = Object();
            ing.name = "" + damageClasses[i+1] + " Powder " + numerals.get(powderIngreds.indexOf(powderIng) + 1);
            ing.tier = 0;
            ing.lvl = 0;
            ing.skills = ["ARMOURING", "TAILORING", "WEAPONSMITHING", "WOODWORKING"];
            ing.ids = {};
            ing.isPowder = true;
            ing.pid = 6*i + powderIngreds.indexOf(powderIng);
            ing.itemIDs = {"dura": powderIng["durability"], "strReq": 0, "dexReq": 0,"intReq": 0,"defReq": 0,"agiReq": 0,};
            switch(i) {
                case 0:
                    ing.itemIDs["strReq"] = powderIng["skpReq"];
                    break;
                case 1:
                    ing.itemIDs["dexReq"] = powderIng["skpReq"];
                    break;
                case 2:
                    ing.itemIDs["intReq"] = powderIng["skpReq"];
                    break;
                case 3:
                    ing.itemIDs["defReq"] = powderIng["skpReq"];
                    break;
                case 4:
                    ing.itemIDs["agiReq"] = powderIng["skpReq"];
                    break;
            }
            ing.consumableIDs = {"dura": 0, "charges": 0};
            ing.posMods = {"left": 0, "right": 0, "above": 0, "under": 0, "touching": 0, "notTouching": 0};
            ingMap.set(ing["name"],ing);
            ingList.push(ing["name"]);
        }
    }
    

    for (const ing of ings) {
        ingMap.set(ing["name"], ing);
        ingList.push(ing["name"]);
    }
    for (const recipe of recipes) {
        recipeMap.set(recipe["id"], recipe);
        recipeList.push(recipe["id"]);
    }
    console.log("all ingredients");
    console.log(ings);
    console.log("all recipes");
    console.log(recipes);
    console.log(ingList);
    console.log(recipeList);   

    document.getElementById("recipe-choice").addEventListener("change", (event) => {
        updateMaterials();
    });
    document.getElementById("level-choice").addEventListener("change", (event) => {
        updateMaterials();
    });

    populateFields();
    decodeCraft(url_tag);
}
function updateMaterials() {
    let recipeName = getValue("recipe-choice") ? getValue("recipe-choice") : "Potion";
    let levelRange = getValue("level-choice") ? getValue("level-choice") : "103-105";
    let recipe = expandRecipe(recipeMap.get(recipeName + "-" + levelRange));
    if (recipe !== undefined) {
        try{
            document.getElementById("mat-1").textContent = recipe.get("materials")[0].get("item").split(" ").slice(1).join(" ") + " Tier:";
            document.getElementById("mat-2").textContent = recipe.get("materials")[1].get("item").split(" ").slice(1).join(" ") + " Tier:"; 
        } catch (error){
            //e e e
        }
    }
    else {
        document.getElementById("mat-1").textContent = "Material 1 Tier:";
        document.getElementById("mat-2").textContent = "Material 2 Tier:";
    }
}
function toggleAtkSpd(buttonId) {
    let buttons = ["slow-atk-button", "normal-atk-button", "fast-atk-button"];
    let elem = document.getElementById(buttonId);
    if (elem.classList.contains("toggleOn")) {
        elem.classList.remove("toggleOn");
    } else {
        for (const button of buttons) {
            document.getElementById(button).classList.remove("toggleOn");
        }
        elem.classList.add("toggleOn");
    }
}

function calculateCraft() {
    //Make things display.
    for (let i of document.getElementsByClassName("hide-container-block")) {
        i.style.display = "block";
    }
    for (let i of document.getElementsByClassName("hide-container-grid")) {
        i.style.display = "grid";
    }
    //define the fields that will go into crafting the craft.
    let recipe = getValue("recipe-choice") === "" ? "Potion" : getValue("recipe-choice");
    let levelrange = getValue("level-choice") === "" ? "103-105" : getValue("level-choice"); 
    recipe = expandRecipe(recipeMap.get(recipe+"-"+levelrange));
    let mat_tiers = [];
    for (i = 1; i < 3; i++) {
        for(j = 1; j < 4; j++) {
            let elem = document.getElementById("mat-" + i + "-" + j);
            if(elem.classList.contains("toggleOn")) {
                mat_tiers.push(j); //Tier is 1, 2, or 3.
                break;
            }
        }
        if (mat_tiers.length < i) { //default to t3
            mat_tiers.push(3);
            document.getElementById("mat-"+i+"-3").classList.add("toggleOn");
        } 
    }
    let ingreds = [];
    for (i = 1; i < 7; i++) {
        getValue("ing-choice-" + i) === "" ? ingreds.push(expandIngredient(ingMap.get("No Ingredient"))) : ingreds.push(expandIngredient(ingMap.get(getValue("ing-choice-" + i))));
    }
    let atkSpd = "NORMAL"; //default attack speed will be normal.
    for (const b of ["slow-atk-button", "normal-atk-button", "fast-atk-button"]) {
        button = document.getElementById(b);
        if (button.classList.contains("toggleOn")) {
            atkSpd = b.split("-")[0].toUpperCase();
        }
    }
    //create the craft
    player_craft = new Craft(recipe,mat_tiers,ingreds,atkSpd,"");

    location.hash = encodeCraft();
    player_craft.setHash(encodeCraft().split("_")[1]);
    console.log(player_craft);
    /*console.log(recipe)
    console.log(levelrange)
    console.log(mat_tiers)
    console.log(ingreds)*/
    document.getElementById("mat-1").textContent = recipe.get("materials")[0].get("item").split(" ").slice(1).join(" ") + " Tier:";
    document.getElementById("mat-2").textContent = recipe.get("materials")[1].get("item").split(" ").slice(1).join(" ") + " Tier:"; 
    
    //Display Recipe Stats
    displayRecipeStats(player_craft, "recipe-stats");
    for(let i = 0; i < 6; i++) {
        displayExpandedIngredient(player_craft["ingreds"][i],"tooltip-" + i);
    }
    //Display Craft Stats
    displayCraftStats(player_craft, "craft-stats");
    //Display Ingredients' Stats
    for (let i = 1; i < 7; i++) {
        displayExpandedIngredient(player_craft.ingreds[i-1] , "ing-"+i+"-stats");
    }
    //Display Warnings - only ingred type warnings for now
    let warning_elem = document.getElementById("craft-warnings");
    warning_elem.textContent = ""; //refresh warnings
    warning_elem.classList.add("warning");
    let type = player_craft["recipe"].get("skill");
    for (const ingred of player_craft["ingreds"]) {
        if (!(ingred.get("skills").includes(type))) {
            let p = document.createElement("p");
            p.textContent = "WARNING: " + ingred.get("name") + " cannot be used for " + type.charAt(0) + type.substring(1).toLowerCase() +"!";
            warning_elem.appendChild(p);
        }
    }

    
}

function encodeCraft() {
    if (player_craft) {
        let atkSpds = ["SLOW","NORMAL","FAST"];
        let craft_string =  "1_" + 
                            Base64.fromIntN(ingList.indexOf(player_craft.ingreds[0].get("name")), 2) + 
                            Base64.fromIntN(ingList.indexOf(player_craft.ingreds[1].get("name")), 2) +
                            Base64.fromIntN(ingList.indexOf(player_craft.ingreds[2].get("name")), 2) +
                            Base64.fromIntN(ingList.indexOf(player_craft.ingreds[3].get("name")), 2) +
                            Base64.fromIntN(ingList.indexOf(player_craft.ingreds[4].get("name")), 2) +
                            Base64.fromIntN(ingList.indexOf(player_craft.ingreds[5].get("name")), 2) + 
                            Base64.fromIntN(recipeList.indexOf(player_craft.recipe.get("id")),2) + 
                            Base64.fromIntN(player_craft.mat_tiers[0] + (player_craft.mat_tiers[1]-1)*3, 1) +  //this maps tiers [a,b] to a+3b.
                            Base64.fromIntN(atkSpds.indexOf(player_craft["atkSpd"]),1);
        return craft_string;
    }
    return "";
}
function decodeCraft(url_tag) {
    if (url_tag) {
        console.log(url_tag);
        let info = url_tag.split("_");
        let version = info[0];
        let tag = info[1];
        if (version === "1") {
            ingreds = [];
            for (let i = 0; i < 6; i ++ ) {
                setValue("ing-choice-"+(i+1), ingList[Base64.toInt(tag.substring(2*i,2*i+2))]);
            }
            recipe = recipeList[Base64.toInt(tag.substring(12,14))];
            recipesName = recipe.split("-");
            setValue("recipe-choice",recipesName[0]);
            setValue("level-choice",recipesName[1]+"-"+recipesName[2]);
            tierNum = Base64.toInt(tag.substring(14,15));
            mat_tiers = [];
            mat_tiers.push(tierNum % 3 == 0 ? 3 : tierNum % 3);
            mat_tiers.push(Math.floor((tierNum-0.5) / 3)+1); //Trying to prevent round-off error, don't yell at me
            toggleMaterial("mat-1-"+mat_tiers[0]);
            toggleMaterial("mat-2-"+mat_tiers[1]);
            atkSpd = Base64.toInt(tag.substring(15));
            console.log(atkSpd);
            let atkSpdButtons = ["slow-atk-button", "normal-atk-button", "fast-atk-button"];
            toggleAtkSpd(atkSpdButtons[atkSpd]);
            
            calculateCraft();
        }
    }
}

function populateFields() {
    let recipe_list = document.getElementById("recipe-choices");
    for (const recipe of recipeTypes) {
        let el = document.createElement("option");
        el.value = recipe.charAt(0) + recipe.substring(1).toLowerCase();
        recipe_list.appendChild(el);
    }
    let level_list = document.getElementById("level-choices");
    for (const range of levelTypes) {
        let el = document.createElement("option");
        el.value = range;
        level_list.appendChild(el);
    }
    for (i = 1; i < 7; i++) {
        let ing_list = document.getElementById("ing-choices-"+i);
        for (const ing of ingList) {
            let el = document.createElement("option");
            el.value = ing;
            ing_list.appendChild(el);
        }
    }
    
    
}

/* Toggles ONE button
*/
function toggleButton(buttonId) {
    let elem = document.getElementById(buttonId);
    if (elem.classList.contains("toggleOn")) {
        elem.classList.remove("toggleOn");
    } else{
        elem.classList.add("toggleOn");
    }
}

/* Copy the link
*/
function copyRecipe(){
    if (player_craft) {
        copyTextToClipboard(url_base+location.hash);
        document.getElementById("copy-button").textContent = "Copied!";
    }
}

/* Copy the link AND a display of all ingredients
*/
function shareRecipe(){
    if (player_craft) {
        let copyString = url_base+location.hash + "\n";
        let name = player_craft.recipe.get("id").split("-");
        copyString += " > " + name[0] + " " + "Lv. " + name[1] + "-" + name[2] + " (" + player_craft.mat_tiers[0] + "\u272B, " + player_craft.mat_tiers[1] + "\u272B)\n";
        copyString += " > [" + player_craft.ingreds[0].get("name") + " | " + player_craft.ingreds[1].get("name") + "\n";
        copyString += " > " + player_craft.ingreds[2].get("name") + " | " + player_craft.ingreds[3].get("name") + "\n";
        copyString += " > " + player_craft.ingreds[4].get("name") + " | " + player_craft.ingreds[5].get("name") + "]";  
        copyTextToClipboard(copyString);
        document.getElementById("share-button").textContent = "Copied!";
    } 
}
/* Toggles the entire material's buttons
*/
function toggleMaterial(buttonId) {
    let elem = document.getElementById(buttonId);
    let mat = buttonId.split("-")[1]
    if (!elem.classList.contains("toggleOn")) { //we turned on that button, now toggle the others off
        toggleButton(buttonId);
        for (i = 1; i < 4; i++) {
            if ("mat-" + mat + "-" + i !== buttonId) {
                document.getElementById("mat-" + mat + "-" + i).classList.remove("toggleOn");
            }
        }
    } else { //we turned off a button: do nothing
        toggleButton(buttonId);
    }
}

/* Reset all fields
*/
function resetFields() {
    for (let i = 1; i < 3; i ++) {
        for (let j = 1; j < 4; j++) {
            document.getElementById("mat-"+i+"-"+j).classList.remove("toggleOn");
        }
    } 
    for (let i = 1; i < 7; i++) {
        setValue("ing-choice-"+i, "");
    }
    setValue("recipe-choice", "");
    setValue("level-choice", "");
    location.hash = "";
    calculateCraft();
}

load_ing_init(init);
