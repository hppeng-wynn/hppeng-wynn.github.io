/*
 * TESTING SECTION
 */

const url_base = location.href.split("#")[0];
const url_tag = location.hash.slice(1);
console.log(url_base);
console.log(url_tag);



const BUILD_VERSION = "6.9.7";
/*
 * END testing section
 */


 /* TODO: 
    Make it craft
    Make material tier do something
    Double powders
    Integrate to normal builder
 */
let recipeTypes = ["HELMET","CHESTPLATE","LEGGINGS","BOOTS","RELIK","WAND","SPEAR","DAGGER","BOW","RING","NECKLACE","BRACELET","SCROLL","FOOD","POTION"];
let levelTypes = ["1-3","3-5","5-7","7-9","10-13","13-15","15-17","17-19","20-23","23-25","25-27","27-29","30-33","33-35","35-37","37-39","40-43","43-45","45-47","47-49","50-53","53-55","55-57","57-59","60-63","63-65","65-67","67-69","70-73","73-75","75-77","77-79","80-83","83-85","85-87","87-89","90-93","93-95","95-97","97-99","100-103","103-105",]
let ingFields = ["fDefPct", "wDefPct", "aDefPct", "tDefPct", "eDefPct", "hprPct", "mr", "sdPct", "mdPct", "ls", "ms", "xpb", "lb", "lq", "ref", "str", "dex", "int", "agi", "def", "thorns", "expd", "spd", "atkTier", "poison", "hpBonus", "spRegen", "eSteal", "hprRaw", "sdRaw", "mdRaw", "fDamPct", "wDamPct", "aDamPct", "tDamPct", "eDamPct", "spPct1", "spRaw1", "spPct2", "spRaw2", "spPct3", "spRaw3", "spPct4", "spRaw4", "jh", "sprint", "sprintReg", "gXp", "gSpd"];
let player_craft;

function setTitle() {
    document.getElementById("header").textContent = "WynnBuilder version "+BUILD_VERSION+" (ingredient db version "+ING_DB_VERSION+")";
    document.getElementById("header").classList.add("funnynumber");
}
setTitle();

let ingMap = new Map();
let ingList = [];

let recipeMap = new Map();
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
    ing.posMods = {"left": 0, "right": 0, "above": 0, "under": 0, "touching": 0, "notTouching": 0}
    ingMap.set(ing["name"], ing);
    for (const ing of ings) {
        ingMap.set(ing["name"], ing);
        ingList.push(ing["name"]);
    }
    for (const recipe of recipes) {
        recipeMap.set(recipe["id"], recipe);
    }
    console.log("all ingredients");
    console.log(ings);
    console.log("all recipes");
    console.log(recipes);

    document.getElementById("recipe-choice").addEventListener("change", (event) => {
        updateMaterials();
    });
    document.getElementById("level-choice").addEventListener("change", (event) => {
        updateMaterials();
    });

    populateFields();
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
            //eee
        }
    }
    else {
        document.getElementById("mat-1").textContent = "Material 1 Tier:";
        document.getElementById("mat-2").textContent = "Material 2 Tier:";
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

    //create the craft
    player_craft = new Craft(recipe,mat_tiers,ingreds);
    console.log(player_craft);
    /*console.log(recipe)
    console.log(levelrange)
    console.log(mat_tiers)
    console.log(ingreds)*/
    document.getElementById("mat-1").textContent = recipe.get("materials")[0].get("item").split(" ").slice(1).join(" ") + " Tier:";
    document.getElementById("mat-2").textContent = recipe.get("materials")[1].get("item").split(" ").slice(1).join(" ") + " Tier:"; 
    
    //Display Recipe Stats
    displayRecipeStats(player_craft, "recipe-stats");
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

    //set the location hash. TODO
    /*let hash = "";
    location.hash = hash;*/
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
        copyTextToClipboard(url_base+location.hash);
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