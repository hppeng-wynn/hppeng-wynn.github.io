/*
 * TESTING SECTION
 */

 
const custom_url_base = location.href.split("#")[0];
const custom_url_tag = location.hash.slice(1);
console.log(custom_url_base);
console.log(custom_url_tag);

const BUILD_VERSION = "6.9.40";

function setTitle() {
    let text = "WynnCustom version "+BUILD_VERSION;
    document.getElementById("header").classList.add("funnynumber");
    document.getElementById("header").textContent = text;
}

setTitle();




/*
 * END testing section
 */


let player_custom_item;
let base_item; //the item that a user starts from, if any
let pos_range = [0.3,1.3];
let neg_range = [1.3,0.7];


let itemMap = new Map();
/* Mapping from item names to set names. */
let idMap = new Map();
let redirectMap = new Map();

let roll_range_ids = ["neg_roll_range-choice-min","neg_roll_range-choice-max","pos_roll_range-choice-min","pos_roll_range-choice-max"];
        

function init() {

    try {
        //directly from builder.js. Removed irrelevant materials and no noneitems used here.
        for (const item of items) {
            if (item.remapID === undefined) {
                itemMap.set(item.displayName, item);
                idMap.set(item.id, item.displayName);
            }
            else {
                redirectMap.set(item.id, item.remapID);
            }
        }
        console.log(itemMap);

        populateFields();
        decodeCustom(custom_url_tag);

        for (const id of rolledIDs) {
            if (document.getElementById(id+"-choice-base")) {
                let base_elem = document.getElementById(id+"-choice-base");
                base_elem.addEventListener("focusout", (event) => {
                    base_to_range(id);
                });
                let min_elem = document.getElementById(id+"-choice-min");
                min_elem.addEventListener("focusout", (event) => {
                    range_to_base(id,"min");
                });
                let max_elem = document.getElementById(id+"-choice-max");
                max_elem.addEventListener("focusout", (event) => {
                    range_to_base(id,"max");
                });
            }
        }
        for (const id of roll_range_ids) {
            document.getElementById(id).addEventListener("focusout", (event) => {
                changeBaseValues();
            });
        }

        
    } catch (error) {
        console.log("If you are seeing this while building, do not worry. Oherwise, panic! (jk contact ferricles)");
        console.log(error);
    }
}

/** Create a custom item based on data input into the fields.
 * 
 */
function calculateCustom() {
    try {
        //Make things display.
        for (let i of document.getElementsByClassName("hide-container-block")) {
            i.style.display = "block";
        }
        for (let i of document.getElementsByClassName("hide-container-grid")) {
            i.style.display = "grid";
        }

        let statMap = new Map();
        statMap.set("minRolls", new Map());
        statMap.set("maxRolls", new Map());
        let inputs = document.getElementsByTagName("input");

        if (document.getElementById("fixID-choice").textContent === "yes") {//Fixed IDs
            for (const input of inputs) {
                if (input.id.includes("-min") || input.id.includes("-max")) {
                    continue;
                }

                let id = input.id.replace("-choice", "");

                id = id.replace("-fixed", "");
                id = id.replace("-min", "");
                id = id.replace("-max", "");

                if (input.classList.contains("number-input")) {
                    if (parseFloat(input.value)) {
                        if(rolledIDs.includes(id)) {
                            statMap.get("minRolls").set(id,parseFloat(input.value));
                            statMap.get("maxRolls").set(id,parseFloat(input.value));
                        } else {
                            statMap.set(id, parseFloat(input.value));
                        }
                    }
                } else if (input.classList.contains("string-input")) {
                    if(rolledIDs.includes(id)) {
                        statMap.get("minRolls").set(id,input.value);
                        statMap.get("maxRolls").set(id,input.value);
                    } else {
                        statMap.set(id, input.value);
                    }
                } else if (input.classList.contains("array-input")) {
                    statMap.set(id, input.value.split("-").map(x=>parseFloat(x)));
                }

                if(input.value === "" && input.placeholder && input.placeholder !== "") {
                    if (input.classList.contains("number-input") && parseFloat(input.placeholder)) {
                        statMap.set(id, parseFloat(input.placeholder));
                    } else if (input.classList.contains("string-input")) {
                        statMap.set(id, input.placeholder);
                    } else if (input.classList.contains("array-input")) {
                        statMap.set(id, input.placeholder.split("-").map(x=>parseFloat(x)));
                    }
                }
            }
            statMap.set("fixID", true);

        } else { //rolled IDs!
            for (const input of inputs) {
                if (input.id.includes("-fixed")) {
                    continue;
                }
                //FIXs
                let id = input.id.replace("-choice", "");
                let rollMap = "";

                //If it's a minimum, it's -min
                if(id.includes("-min")) {
                    rollMap = "minRolls";
                }
                //If it's a maximum, it's -max
                else if(id.includes("-max")) {
                    rollMap = "maxRolls";
                }

                id = id.replace("-fixed", "");
                id = id.replace("-min", "");
                id = id.replace("-max", "");

                if (input.classList.contains("number-input")) {
                    if (parseFloat(input.value)) {
                        if (rolledIDs.includes(id)) {
                            statMap.get(rollMap).set(id, parseFloat(input.value));
                        } else {
                            statMap.set(id, parseFloat(input.value));
                        }
                    }
                } else if (input.classList.contains("string-input")) {
                    if(rolledIDs.includes(id)) {
                        statMap.get(rollMap).set(id, input.value);
                    } else {
                        statMap.set(id, input.value);
                    }
                } else if (input.classList.contains("array-input")) {
                    statMap.set(id, input.value.split("-").map(x=>parseFloat(x)));
                }
 
                if(input.value === "" && input.placeholder && input.placeholder !== "") {
                    if (input.classList.contains("number-input")) {
                        if (rolledIDs.includes(id)) {
                            statMap.get(rollMap).set(id, parseFloat(input.placeholder));
                        } else {
                            statMap.set(id, parseFloat(input.placeholder));
                        }
                    } else if (input.classList.contains("string-input")){
                        if (rolledIDs.includes(id)) {
                            statMap.get(rollMap).set(id, input.placeholder);
                        } else {
                            statMap.set(id, input.placeholder);
                        }
                    } else if (input.classList.contains("array-input")) {
                        statMap.set(id, input.placeholder.split("-").map(x=>parseFloat(x)));
                    }
                }
            }
        }
       


        player_custom_item = new Custom(statMap);
        displayExpandedItem(player_custom_item.statMap, "custom-stats");
        console.log(player_custom_item.statMap);

    }catch (error) {
        //USE THE ERROR <p>S!

        let msg = error.stack;
        let lines = msg.split("\n");
        let header = document.getElementById("header");
        header.textContent = "";
        for (const line of lines) {
            let p = document.createElement("p");
            p.classList.add("itemp");
            p.textContent = line;
            header.appendChild(p);
        }
        let p2 = document.createElement("p");
        p2.textContent = "If you believe this is an error, contact hppeng on forums or discord.";
        header.appendChild(p2);
    }
    
}

function encodeCustom(custom) {
    
    return "";
}

function decodeCustom(custom_url_tag) {
    if (custom_url_tag) {
        console.log(custom_url_tag);
        let version = custom_url_tag.charAt(0);
        let tag = custom_url_tag.substring(1);
        if (version === "1") {
            //do the things
            
            calculateCustom();
        }
    }
}

function populateFields() {
    /*Ex
    let recipe_list = document.getElementById("recipe-choices");
    for (const recipe of recipeTypes) {
        let el = document.createElement("option");
        el.value = recipe.charAt(0) + recipe.substring(1).toLowerCase();
        recipe_list.appendChild(el);
    }
    */
   let tier_list = document.getElementById("tier-list");
   for (const tier of tiers) {
       let el = document.createElement("option");
       el.value = tier;
       tier_list.appendChild(el);
   }
   let type_list = document.getElementById("type-list");
   for (const type of types) {
        let el = document.createElement("option");
        el.value = type;
        type_list.appendChild(el);
   }
   let atkSpd_list = document.getElementById("atkSpd-list");
   for (const atkSpd of attackSpeeds) {
        let el = document.createElement("option");
        el.value = atkSpd;
        atkSpd_list.appendChild(el);
   }
   let class_list = document.getElementById("class-list");
   for (const className of classes) {
        let el = document.createElement("option");
        el.value = className;
        class_list.appendChild(el);
    }
    let item_list = document.getElementById("base-list");
    for (const [baseItem,value] of itemMap) {
        let el = document.createElement("option");
        el.value = baseItem;
        item_list.appendChild(el);
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

/* Changes an element's text content from yes to no or vice versa
*/
function toggleYN(elemId) {
    let elem = document.getElementById(elemId);
    if (elem.textContent && elem.textContent === "no") {
        elem.textContent = "yes";
    } else if (elem.textContent === "yes") {
        elem.textContent = "no";
    } else {
        elem.textContent = "no";
    }
}

/**
 * @param fixed : a boolean for the state of the fixID button. True -> make all the variable IDs 2 inputs, False -> make them all 1 input
 */
function toggleFixed(fixed) {
    for (const id of rolledIDs) {
        let elem = document.getElementById(id);
        if (elem) {    
            if (fixed.textContent === "yes") { //now fixed IDs -> go to 1 input
                document.getElementById(id+"-choice-fixed-container").style = "";
                document.getElementById(id+"-choice-container").style = "display:none";
            } else { //now rollable -> go to 2 inputs
                document.getElementById(id+"-choice-fixed-container").style = "display:none";
                document.getElementById(id+"-choice-container").style = "";
            }
        }
    }
}

/** Make a custom item
 * 
 * @param {elem} : The elem with value item to base off of. A string input.
 */
function useBaseItem(elem) {
    let itemName = getValue(elem);
    let baseItem;

    //Check items db.
    for (const [name,itemObj] of itemMap) {
        if (itemName === name) {
            baseItem = expandItem(itemObj, []);
            break;
        }
    }

    //If it starts with CR-, try creating a craft
    if(!baseItem) {
        baseItem = getCraftFromHash(itemName).statMap;
        console.log(baseItem);
    }
    //If it starts with CI-, try creating a custom (TODO)

    //If the item exists, go through stats and assign to values!
    if(baseItem) {
        resetFields();

        //Rolled IDs
        if (document.getElementById("fixID-choice").textContent === "yes") { //fixed IDs
            for (const id of rolledIDs) { //use maxrolls
                if (baseItem.get("maxRolls").get(id) && document.getElementById(id+"-choice-fixed")) {
                    setValue(id+"-choice-fixed", baseItem.get("maxRolls").get(id));
                    setValue(id+"-choice-min", baseItem.get("maxRolls").get(id));
                    setValue(id+"-choice-max", baseItem.get("maxRolls").get(id));
                }
            }
        } else { //use both
            for (const id of rolledIDs) {
                if (baseItem.get("maxRolls").get(id) && document.getElementById(id+"-choice-fixed")) {
                    setValue(id+"-choice-fixed", baseItem.get("maxRolls").get(id));
                    setValue(id+"-choice-min", baseItem.get("minRolls").get(id));
                    setValue(id+"-choice-max", baseItem.get("maxRolls").get(id));
                }
            }
        }

        //Static IDs
        for (const id of nonRolledIDs) {
            if (baseItem.get(id) && document.getElementById(id+"-choice")) {
                setValue(id+"-choice", baseItem.get(id));
            }
        }
        //Take care of durability, duration, and charges.
        if (baseItem.get("tier") === "Crafted") {
            let specialIDs = ["duration", "durability"];
            setValue("charges-choice", baseItem.get("charges"));
            for (const id of specialIDs) {
                setValue(id+"-choice", baseItem.get(id)[0]+"-"+baseItem.get(id)[1]);
            }
        }
        

    }

    //Don't do anything if nothing is met
    calculateCustom();
}

/* Copy the link
*/
function copyCustom(){
    if (player_custom_item) {
        copyTextToClipboard(custom_url_base+location.hash);
        document.getElementById("copy-button").textContent = "Copied!";
    }
}



/* Reset all fields
*/
function resetFields() {
    let inputs = document.getElementsByTagName('input');
    for (const input of inputs) {
        input.textContent = "";
        input.value = "";
    }

    let elem = document.getElementById("fixID-choice")
    if (elem.textContent === "yes") {
        elem.textContent = "no";
        elem.classList.remove("toggleOn");
    }
}

/** Takes the base value for an id and attempts to autofill the corresponding min and maxes.
 * 
 * @param {String} id - the id to do the math for (ex: hprPct) 
 */
function base_to_range(id) {
    let base = parseFloat(getValue(id+"-choice-base"));
    if(base) {
        //This version allows overriding of min and max.
        if (base < 0) {
            setValue(id+"-choice-min", Math.min(Math.round(neg_range[0]*base),-1));
        } else {
            setValue(id+"-choice-min", Math.max(Math.round(pos_range[0]*base),1));
        }
        if (base < 0) {
            setValue(id+"-choice-max", Math.min(Math.round(neg_range[1]*base),-1));
        } else {
            setValue(id+"-choice-max", Math.max(Math.round(pos_range[1]*base),1));
        }
        /* No overiding min/max version
        if (!getValue(id+"-choice-min")) {
            if (base < 0) {
                setValue(id+"-choice-min", Math.min(Math.round(neg_range[0]*base),-1));
            } else {
                setValue(id+"-choice-min", Math.max(Math.round(pos_range[0]*base),1));
            }
        }
        if (!getValue(id+"-choice-max")) {
            if (base < 0) {
                setValue(id+"-choice-max", Math.min(Math.round(neg_range[1]*base),-1));
            } else {
                setValue(id+"-choice-max", Math.max(Math.round(pos_range[1]*base),1));
            }
        }
        */
    }
}

/** Takes min/max value(s) and attempts to autofill the corresponding base and min/max
 * 
 * @param {String} id - the id to do the math for (ex: hprPct) 
 * @param {String} mode - the tabbed value (min or max)
 */
function range_to_base(id, mode) {
    let value;
    try {
        value = parseFloat(getValue(id+"-choice-"+mode));
    } catch (error) {
        console.log("Error in range_to_base.");
        console.log(error);
    }

    if (mode === "min") { //base and max
        if (value && !getValue(id+"-choice-base")) {
            if (value < 0) {
                setValue(id+"-choice-base", Math.min(Math.round(1/neg_range[0]*value),-1));
            } else {
                setValue(id+"-choice-base", Math.max(Math.round(1/pos_range[0]*value),1));
            }
        }
        if (value && !getValue(id+"-choice-max")) {
            if (value < 0) {
                setValue(id+"-choice-max", Math.min(Math.round(neg_range[1]/neg_range[0]*value),-1));
            } else {
                setValue(id+"-choice-max", Math.max(Math.round(pos_range[1]/pos_range[0]*value),1));
            }
        }
    } else if (mode === "max") { //min and base
        if (value && !getValue(id+"-choice-base")) {
            if (value < 0) {
                setValue(id+"-choice-base", Math.min(Math.round(1/neg_range[1]*value),-1));
            } else {
                setValue(id+"-choice-base", Math.max(Math.round(1/pos_range[1]*value),1));
            }
        }
        if (value && !getValue(id+"-choice-min")) {
            if (value < 0) {
                setValue(id+"-choice-min", Math.min(Math.round(neg_range[0]/neg_range[1]*value),-1));
            } else {
                setValue(id+"-choice-min", Math.max(Math.round(pos_range[0]/pos_range[1]*value),1));
            }
        }
    }
}

/** Uses the base value input fields and changes the base values.
 * 
 */
function changeBaseValues() {
    for (const id of roll_range_ids) {
        if (getValue(id)) {
            if (id.includes("neg")) {
                if (id.includes("min")) {
                    neg_range[0] = parseFloat(getValue(id));
                } else {
                    neg_range[1] = parseFloat(getValue(id));
                }
            } else {
                if (id.includes("min")) {
                    pos_range[0] = parseFloat(getValue(id));
                } else {
                    pos_range[1] = parseFloat(getValue(id));
                }
            }
        }
    }
    for (const identification of rolledIDs) {
        if (document.getElementById(identification)) {
            base_to_range(identification);
        }
    }
}

function resetBaseValues() {
    pos_range = [0.3,1.3];
    neg_range = [1.3,0.7];
    for (const id of roll_range_ids) {
        setValue(id,"");
    }
}

load_init(init);
load_ing_init(init);
