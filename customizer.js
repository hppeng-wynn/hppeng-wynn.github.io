/*
 * TESTING SECTION
 */

 
const custom_url_base = location.href.split("#")[0];
const custom_url_tag = location.hash.slice(1);
// console.log(custom_url_base);
// console.log(custom_url_tag);

const CUSTOM_BUILD_VERSION = "7.0.1";

function setTitle() {
    let text = "WynnCustom version "+CUSTOM_BUILD_VERSION;
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




let roll_range_ids = ["neg_roll_range-choice-min","neg_roll_range-choice-max","pos_roll_range-choice-min","pos_roll_range-choice-max"];
        

function init_customizer() {

    try {
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
                            statMap.get("minRolls").set(id,Math.round(parseFloat(input.value)));
                            statMap.get("maxRolls").set(id,Math.round(parseFloat(input.value)));
                        } else {
                            statMap.set(id, Math.round(parseFloat(input.value)));
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
                    statMap.set(id, input.value.split("-").map(x=>Math.round(parseFloat(x))));
                }

                if(input.value === "" && input.placeholder && input.placeholder !== "") {
                    if (input.classList.contains("number-input") && parseFloat(input.placeholder)) {
                        statMap.set(id, Math.round(parseFloat(input.placeholder)));
                    } else if (input.classList.contains("string-input")) {
                        statMap.set(id, input.placeholder);
                    } else if (input.classList.contains("array-input")) {
                        statMap.set(id, input.placeholder.split("-").map(x=>Math.round(parseFloat(x))));
                    }
                }
            }
            statMap.set("fixID", true);

        } else { //not fixed
            for (const input of inputs) {
                if (input.id.includes("-fixed")) {
                    continue;
                }
                let id = input.id.replace("-choice", "");
                let rollMap = "";
                let oppMap = "";

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
                            statMap.get(rollMap).set(id, Math.round(parseFloat(input.value)));
                        } else {
                            statMap.set(id, Math.round(parseFloat(input.value)));
                        }
                    }
                } else if (input.classList.contains("string-input")) {
                    if(rolledIDs.includes(id)) {
                        statMap.get(rollMap).set(id, input.value);
                    } else {
                        statMap.set(id, input.value);
                    }
                } else if (input.classList.contains("array-input")) {
                    statMap.set(id, input.value.split("-").map(x=>Math.round(parseFloat(x))));
                }
 
                if(input.value === "" && input.placeholder && input.placeholder !== "") {
                    if (input.classList.contains("number-input")) {
                        if (rolledIDs.includes(id)) {
                            statMap.get(rollMap).set(id, Math.round(parseFloat(input.placeholder)));
                        } else {
                            statMap.set(id, Math.round(parseFloat(input.placeholder)));
                        }
                    } else if (input.classList.contains("string-input")){
                        if (rolledIDs.includes(id)) {
                            statMap.get(rollMap).set(id, input.placeholder);
                        } else {
                            statMap.set(id, input.placeholder);
                        }
                    } else if (input.classList.contains("array-input")) {
                        statMap.set(id, input.placeholder.split("-").map(x=>Math.round(parseFloat(x))));
                    }
                }
            }
        }


        player_custom_item = new Custom(statMap);

        document.getElementById("right-container").classList.remove("sticky-box");
        let custom_str = encodeCustom(player_custom_item.statMap, true);
        location.hash = custom_str;
        player_custom_item.setHash(custom_str);
        console.log(player_custom_item.statMap.get("hash"));

        
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

/**
 * @param {Map} custom - the statMap of the CI
 * @param {boolean} verbose - if we want lore and majorIds to display
 */
function encodeCustom(custom, verbose) {
    if (custom) {
        if (custom.statMap) {
            custom = custom.statMap; 
        }
        let hash = "1";
        //version 1
        if (custom.has("fixID") && custom.get("fixID")) {
            hash += "1";
        } else {
            hash += "0";
        }
        for (const i in ci_save_order) {
            let id = ci_save_order[i];
            if (rolledIDs.includes(id)) {
                let val_min = custom.get("minRolls").has(id) ? custom.get("minRolls").get(id) : 0;
                let val_max = custom.get("maxRolls").has(id) ? custom.get("maxRolls").get(id) : 0;
                let sign = (Boolean(val_min / Math.abs(val_min) < 0) | 0) + 2*(Boolean(val_max / Math.abs(val_max) < 0) | 0) // 0 - both pos 1 - min neg max pos 2 - min pos max neg (how?) 3 - min neg max neg 
                //console.log(id + ": " + sign);
                let min_len = Math.max(1,Math.ceil(log(64,Math.abs(val_min))));
                let max_len = Math.max(1,Math.ceil(log(64,Math.abs(val_max))));
                let len = Math.max(min_len,max_len);
                val_min = Math.abs(val_min);
                val_max = Math.abs(val_max);

                if ( val_min != 0 || val_max != 0 ) {
                    //hash += Base64.fromIntN(i,2) + Base64.fromIntN(val_min,Math.max(1,Math.ceil(log(64,Math.abs(val_min))))) + ":" + Base64.fromIntN(val_max,Math.max(1,Math.ceil(log(64,Math.abs(val_min))))) + "_";
                    if (custom.get("fixID")) {
                        hash += Base64.fromIntN(i,2) + Base64.fromIntN(len,2) + sign + Base64.fromIntN(val_min, len);
                    } else {
                        hash += Base64.fromIntN(i,2) + Base64.fromIntN(len,2) + sign + Base64.fromIntN(val_min, len) + Base64.fromIntN(val_max,len);
                    }
                }
            } else {
                let damages = ["nDam", "eDam", "tDam", "wDam", "fDam", "aDam","nDam_", "eDam_", "tDam_", "wDam_", "fDam_", "aDam_"];
                let val = custom.get(id);

                if (typeof(val) === "string" && val !== "") {
                    if ((damages.includes(id) && val === "0-0") || (!verbose && ["lore","majorIds","quest","materials","drop","set"].includes(id))) { continue; }
                    if (id === "type") {
                        hash += Base64.fromIntN(i,2) + Base64.fromIntN(types.indexOf(val.substring(0,1).toUpperCase()+val.slice(1)),1);
                    } else if (id === "tier") {
                        hash += Base64.fromIntN(i,2) + Base64.fromIntN(tiers.indexOf(val),1);
                    } else if (id === "atkSpd") {
                        hash += Base64.fromIntN(i,2) + Base64.fromIntN(attackSpeeds.indexOf(val),1);
                    } else if (id === "classReq") {
                        hash += Base64.fromIntN(i,2) + Base64.fromIntN(classes.indexOf(val),1);
                    } else {
                        hash += Base64.fromIntN(i,2) + Base64.fromIntN(val.replaceAll(" ", "%20").length,2) + val.replaceAll(" ", "%20"); //values cannot go above 4096 chars!!!! Is this ok?
                    }
                } else if (typeof(val) === "number" && val != 0) {
                    let len = Math.max(1,Math.ceil(log(64,Math.abs(val))));
                    let sign = Boolean(val / Math.abs(val) < 0) | 0;
                    //console.log(sign);
                    //hash += Base64.fromIntN(i,2) + Base64.fromIntN(val,Math.max(1,Math.ceil(log(64,Math.abs(val))))) + "_";
                    hash += Base64.fromIntN(i,2) + Base64.fromIntN(len,2) + sign + Base64.fromIntN(Math.abs(val),len);
                } 
            }
        }

        return hash;
    }
    return "";
}

function decodeCustom(custom_url_tag) {
    if (custom_url_tag) {
        if (custom_url_tag.slice(0,3) === "CI-") {
            custom_url_tag = custom_url_tag.substring(3);
            location.hash = location.hash.substring(3);
        } 
        let version = custom_url_tag.charAt(0);
        let fixID = Boolean(parseInt(custom_url_tag.charAt(1),10));
        let tag = custom_url_tag.substring(2);
        let statMap = new Map();
        statMap.set("minRolls", new Map());
        statMap.set("maxRolls", new Map());

        if (version === "1") {
            //do the things
            if (fixID) {
                statMap.set("fixId", true);
                toggleButton("fixID-choice");
                toggleYN("fixID-choice");
                toggleFixed(document.getElementById("fixID-choice"));
            }
            while (tag !== "") {
                let id = ci_save_order[Base64.toInt(tag.slice(0,2))];
                let len = Base64.toInt(tag.slice(2,4));
                if (rolledIDs.includes(id)) {
                    let sign = parseInt(tag.slice(4,5),10);
                    let minRoll = Base64.toInt(tag.slice(5,5+len));
                    if (!fixID) {
                        let maxRoll = Base64.toInt(tag.slice(5+len,5+2*len));
                        if (sign > 1) {
                            maxRoll *= -1;
                        }
                        if (sign % 2 == 1) {
                            minRoll *= -1;
                        }
                        setValue(id+"-choice-min", minRoll);
                        setValue(id+"-choice-max", maxRoll);
                        statMap.get("minRolls").set(id,minRoll);
                        statMap.get("maxRolls").set(id,maxRoll);
                        tag = tag.slice(5+2*len);
                    } else {
                        if (sign != 0) {
                            minRoll *= -1;
                        }
                        setValue(id+"-choice-fixed", minRoll);
                        statMap.get("minRolls").set(id,minRoll);
                        statMap.get("maxRolls").set(id,minRoll);
                        tag = tag.slice(5+len);
                    }
                } else {
                    let val;
                    //let elem = document.getElementById(id+"-choice");
                    if (nonRolled_strings.includes(id)) {
                        if (id === "tier") {
                            val = tiers[Base64.toInt(tag.charAt(2))];
                            len = -1;
                        } else if (id === "type") {
                            val = types[Base64.toInt(tag.charAt(2))];
                            len = -1;
                        } else if (id === "atkSpd") {
                            val = attackSpeeds[Base64.toInt(tag.charAt(2))];
                            len = -1;
                        } else if (id === "classReq") {
                            val = classes[Base64.toInt(tag.charAt(2))];
                            len = -1;
                        } else { //general case
                            val = tag.slice(4,4+len).replaceAll("%20"," ");
                        }
                        tag = tag.slice(4+len);
                    } else {
                        let sign = parseInt(tag.slice(4,5),10);
                        val = Base64.toInt(tag.slice(5,5+len));
                        if (sign == 1) {
                            val *= -1;
                        }
                        tag = tag.slice(5+len);
                    }
                    statMap.set(id, val);
                    setValue(id+"-choice", val);
                }
            }
            statMap.set("hash",custom_url_tag);
            calculateCustom();
            player_custom_item.setHash(custom_url_tag);
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
    for (const name of itemMap.keys()) {
        let el = document.createElement("option");
        el.value = name;
        item_list.appendChild(el);
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
 * @param fixed : a boolean for the state of the fixID button.
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
        baseItem = getCraftFromHash(itemName) ? getCraftFromHash(itemName) : (getCustomFromHash(itemName) ? getCustomFromHash(itemName) : null);
        baseItem = baseItem.statMap;    
        console.log(baseItem);
    }

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
function copyCustom() {
    if (player_custom_item) {
        copyTextToClipboard(custom_url_base+location.hash);
        document.getElementById("copy-button").textContent = "Copied!";
    }
}

function copyHash() {
    if (player_custom_item) {
        let hash = player_custom_item.statMap.get("hash");
        console.log(hash);
        copyTextToClipboard(hash);
        document.getElementById("copy-button-hash").textContent = "Copied!";
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
        if (reversedIDs.includes(id)) {
            if (base < 0) {
                setValue(id+"-choice-min", Math.min(Math.round(neg_range[1]*base),-1));
            } else {
                setValue(id+"-choice-min", Math.max(Math.round(pos_range[1]*base),1));
            }
            if (base < 0) {
                setValue(id+"-choice-max", Math.min(Math.round(neg_range[0]*base),-1));
            } else {
                setValue(id+"-choice-max", Math.max(Math.round(pos_range[0]*base),1));
            }
        } else {
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

function _init_customizer() {
    load_ing_init(init_customizer);
}

load_init(_init_customizer);
