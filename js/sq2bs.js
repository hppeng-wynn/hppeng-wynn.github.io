let weapon_keys = ['dagger', 'wand', 'bow', 'relik', 'spear'];
let armor_keys = ['helmet', 'chestplate', 'leggings', 'boots'];
let skp_keys = ['str', 'dex', 'int', 'def', 'agi'];
let accessory_keys= ['ring1', 'ring2', 'bracelet', 'necklace'];
let powderable_keys = ['helmet', 'chestplate', 'leggings', 'boots', 'weapon'];
let equipment_keys = ['helmet', 'chestplate', 'leggings', 'boots', 'ring1', 'ring2', 'bracelet', 'necklace', 'weapon'];
let powder_keys = ['e', 't', 'w', 'f', 'a'];

let spell_disp = ['spell0-info', 'spell1-info', 'spell2-info', 'spell3-info'];
let other_disp = ['build-order', 'set-info', 'int-info'];

document.addEventListener('DOMContentLoaded', function() {

    for (const eq of equipment_keys) {
        document.querySelector("#"+eq+"-choice").setAttribute("oninput", "update_field('"+ eq +"'); calcBuildSchedule();");
        document.querySelector("#"+eq+"-tooltip").setAttribute("onclick", "collapse_element('#"+ eq +"-tooltip'); toggle_plus_minus('" + eq + "-pm'); ");
    }

    for (const eq of powderable_keys) {
        document.querySelector("#"+eq+"-powder").setAttribute("oninput", "calcBuildSchedule(); update_field('"+ eq +"');");
    }

    for (const i of spell_disp) {
        document.querySelector("#"+i+"Avg").setAttribute("onclick", "toggle_spell_tab('"+i+"')");
    }

    document.querySelector("#level-choice").setAttribute("oninput", "calcBuildSchedule()")
    document.querySelector("#weapon-choice").setAttribute("oninput", document.querySelector("#weapon-choice").getAttribute("oninput") + "resetArmorPowderSpecials();");
    // document.querySelector("#edit-IDs-button").setAttribute("onclick", "toggle_edit_id_tab()");

    let skp_fields = document.getElementsByClassName("skp-update");
    
    for (i = 0; i < skp_fields.length; i++) {
        skp_fields[i].setAttribute("oninput", "updateStatSchedule()");
    }

    let masonry = Macy({
        container: "#masonry-container",
        columns: 1,
        mobileFirst: true,
        breakAt: {
            1200: 4,
        },
        margin: {
            x: 20,
            y: 20,
        } 
        
    });

    let search_masonry = Macy({
        container: "#search-results",
        columns: 1,
        mobileFirst: true,
        breakAt: {
            1200: 4,
        },
        margin: {
            x: 20,
            y: 20,
        }
        
    });

    document.querySelector("#search-container").addEventListener("keyup", function(event) {
        if (event.key === "Escape") {
            document.querySelector("#search-container").style.display = "none";
        };
    });

});

// phanta scheduler
let calcBuildTask = null;
let updateStatTask = null;
let doSearchTask = null;

function calcBuildSchedule(){
    if (calcBuildTask !== null) {
        clearTimeout(calcBuildTask);
    }
    calcBuildTask = setTimeout(function(){
        calcBuildTask = null;
        resetEditableIDs(); 
        calculateBuild();
    }, 500);
}

function updateStatSchedule(){
    if (updateStatTask !== null) {
        clearTimeout(updateStatTask);
    }
    updateStatTask = setTimeout(function(){
        updateStatTask = null;
        updateStats();
    }, 500);
}

function doSearchSchedule(){
    console.log("Search Schedule called");
    if (doSearchTask !== null) {
        clearTimeout(doSearchTask);
    }
    doSearchTask = setTimeout(function(){
        doSearchTask = null;
        doItemSearch();
        window.dispatchEvent(new Event('resize'));
    }, 500);
}

// equipment field dynamic styling
function update_field(field) {
    // built on the assumption of no one will type in CI/CR letter by letter
    // resets 
    document.querySelector("#"+field+"-choice").classList.remove("text-light", "is-invalid", 'Normal', 'Unique', 'Rare', 'Legendary', 'Fabled', 'Mythic', 'Set', 'Crafted', 'Custom');
    document.querySelector("#" + field + "-img").classList.remove('Normal-shadow', 'Unique-shadow', 'Rare-shadow', 'Legendary-shadow', 'Fabled-shadow', 'Mythic-shadow', 'Set-shadow', 'Crafted-shadow', 'Custom-shadow');

    item = document.querySelector("#"+field+"-choice").value
    let powder_slots;
    let tier;
    let category;
    let type;

    // get item info
    if (item.slice(0, 3) == "CI-") {
        item = getCustomFromHash(item);
        powder_slots = item.statMap.get("slots");
        tier = item.statMap.get("tier");
        category = item.statMap.get("category");
        type = item.statMap.get("type");
    }
    else if (item.slice(0, 3) == "CR-") {
        item = getCraftFromHash(item);
        powder_slots = item.statMap.get("slots");
        tier = item.statMap.get("tier");
        category = item.statMap.get("category");
        type = item.statMap.get("type");
    } 
    else if (itemMap.get(item)) {
        item = itemMap.get(item);
        if (!item) {return false;}
        powder_slots = item.slots;
        tier = item.tier;
        category = item.category;
        type = item.type;
    } 
    else {
        // item not found
        document.querySelector("#"+field+"-choice").classList.add("text-light");
        if (item) { document.querySelector("#"+field+"-choice").classList.add("is-invalid"); }

        /*if (!accessory_keys.contains(type.toLowerCase())) {
            document.querySelector("#"+type+"-powder").disabled = true;
        }*/
        return false;
    }


    if ((type != field.replace(/[0-9]/g, '')) && (category != field.replace(/[0-9]/g, ''))) {
        document.querySelector("#"+field+"-choice").classList.add("text-light");
        if (item) { document.querySelector("#"+field+"-choice").classList.add("is-invalid"); }

        //document.querySelector("#"+equipment_keys[i]+"-powder").disabled = true;
        return false;
    }

    // set item color
    document.querySelector("#"+field+"-choice").classList.add(tier);
    document.querySelector("#"+field+"-img").classList.add(tier + "-shadow");



    if (powderable_keys.includes(field)) {
        // set powder slots
        document.querySelector("#"+field+"-powder").setAttribute("placeholder", powder_slots+" slots");

        if (powder_slots == 0) {
            document.querySelector("#"+field+"-powder").disabled = true;
        } else {
            document.querySelector("#"+field+"-powder").disabled = false;
        }

        // powder error handling
        document.querySelector("#" + field + "-powder").classList.remove("is-invalid");
        let powder_string = document.querySelector("#"+field+"-powder").value;

        if (powder_string.length % 2 != 0 || powder_string.length / 2 > powder_slots) {
            document.querySelector("#"+field+"-powder").classList.add("is-invalid");
        } else {
            for (i = 0; i < powder_string.length / 2; i++) {
                if (powder_keys.includes(powder_string.substring(i*2, i*2+2).split("")[0]) == false || isNaN(powder_string.substring(i*2, i*2+2).split("")[1]) || parseInt(powder_string.substring(i*2, i*2+2).split("")[1]) < 1 || parseInt(powder_string.substring(i*2, i*2+2).split("")[1]) > 6) {
                    document.querySelector("#"+field+"-powder").classList.add("is-invalid");
                }
            }
        };
    }

    // set weapon img
    if (category == 'weapon') {
        document.querySelector("#weapon-img").setAttribute('src', '../media/items/new/generic-'+type+'.png');
    }
}
/* tabulars | man i hate this code but too lazy to fix /shrug */

let tabs = ['overall-stats', 'offensive-stats', 'defensive-stats'];

function show_tab(tab) {
    //console.log(itemFilters)

    //hide all tabs, then show the tab of the div clicked and highlight the correct button
    for (const i in tabs) {
        document.querySelector("#" + tabs[i]).style.display = "none";
        document.getElementById("tab-" + tabs[i].split("-")[0] + "-btn").classList.remove("selected-btn");
    }
    document.querySelector("#" + tab).style.display = "";
    document.getElementById("tab-" + tab.split("-")[0] +  "-btn").classList.add("selected-btn");
}

function toggle_spell_tab(tab) {
    if (document.querySelector("#"+tab).style.display == "none") {
        document.querySelector("#"+tab).style.display = "";
    } else {
        document.querySelector("#"+tab).style.display = "none";
    }
}

function toggle_boost_tab(tab) {
    for (const i of skp_keys) {
        document.querySelector("#"+i+"-boost").style.display = "none";
        document.getElementById(i + "-boost-tab").classList.remove("selected-btn");
    }
    document.querySelector("#"+tab+"-boost").style.display = "";
    document.getElementById(tab + "-boost-tab").classList.add("selected-btn");

}

// toggle tab
function toggle_tab(tab) {
    if (document.querySelector("#"+tab).style.display == "none") {
        document.querySelector("#"+tab).style.display = "";
    } else {
        document.querySelector("#"+tab).style.display = "none";
    }
}

function collapse_element(elmnt) {
    elem_list = document.querySelector(elmnt).children;
    if (elem_list) {
        for (elem of elem_list) {
            if (elem.classList.contains("no-collapse")) { continue; }   
            if (elem.style.display == "none") {
                elem.style.display = "";
            } else {
                elem.style.display = "none";
            }   
        }
    }
    // macy quirk
    window.dispatchEvent(new Event('resize'));
    // weird bug where display: none overrides??
    document.querySelector(elmnt).style.removeProperty('display');
}

// search misc
function set_item(item) {
    document.querySelector("#search-container").style.display = "none";
    let type;
    // if (!player_build) {return false;}
    if (item.get("category") === "weapon") {
        type = "weapon";
    } else if (item.get("type") === "ring") {
        if (!document.querySelector("#ring1-choice").value) {
            type = "ring1";
        } else {
            type = "ring2";
        }
    } else {
        type = item.get("type");
    }
    document.querySelector("#"+type+"-choice").value = item.get("displayName");
    calcBuildSchedule();
    update_field(type);
}

// disable boosts

function reset_powder_specials() {
    let specials = ["Quake", "Chain_Lightning", "Curse", "Courage", "Wind_Prison"]
    for (const special of specials) {
        for (i = 1; i < 6; i++) {
            if (document.querySelector("#"+special+"-"+i).classList.contains("toggleOn")) {
                document.querySelector("#"+special+"-"+i).classList.remove("toggleOn");
            }
        }
    }
}

// autocomplete initialize
function init_autocomplete() {
    let dropdowns = new Map()
    for (const eq of equipment_keys) {
        // build dropdown
        let item_arr = [];
        if (eq == 'weapon') {
            for (const weaponType of weapon_keys) {
                for (const weapon of itemLists.get(weaponType)) {
                    let item_obj = itemMap.get(weapon);
                    if (item_obj["restrict"] && item_obj["restrict"] === "DEPRECATED") {
                        continue;
                    }
                    if (item_obj["name"] == 'No '+ eq.charAt(0).toUpperCase() + eq.slice(1)) {
                        continue;
                    }
                    item_arr.push(weapon);
                }
            }
        } else {
            for (const item of itemLists.get(eq.replace(/[0-9]/g, ''))) {
                let item_obj = itemMap.get(item);
                if (item_obj["restrict"] && item_obj["restrict"] === "DEPRECATED") {
                    continue;
                }
                if (item_obj["name"] == 'No '+ eq.charAt(0).toUpperCase() + eq.slice(1)) {
                    continue;
                }
                item_arr.push(item)
            }
        }

        // create dropdown
        dropdowns.set(eq, new autoComplete({
            data: {
                src: item_arr
            },
            selector: "#"+ eq +"-choice",
            wrapper: false,
            resultsList: {
                maxResults: 1000,
                tabSelect: true,
                noResults: true,
                class: "search-box dark-7 rounded-bottom px-2 fw-bold dark-shadow-sm",
                element: (list, data) => {
                    // dynamic result loc
                    let position = document.getElementById(eq+'-dropdown').getBoundingClientRect();
                    list.style.top = position.bottom + window.scrollY +"px";
                    list.style.left = position.x+"px";
                    list.style.width = position.width+"px";
                    list.style.maxHeight = position.height * 2 +"px";

                    if (!data.results.length) {
                        message = document.createElement('li');
                        message.classList.add('scaled-font');
                        message.textContent = "No results found!";
                        list.prepend(message);
                    }
                },
            },
            resultItem: {
                class: "scaled-font search-item",
                selected: "dark-5",
                element: (item, data) => {
                    item.classList.add(itemMap.get(data.value).tier);
                },
            },
            events: {
                input: {
                    selection: (event) => {
                        if (event.detail.selection.value) {
                            event.target.value = event.detail.selection.value;
                        }
                        update_field(eq);
                        calcBuildSchedule();
                    },
                },
            }
        }));
    }
    let filter_loc = ["filter1", "filter2", "filter3", "filter4"];
    for (const i of filter_loc) {
        dropdowns.set(i+"-choice", new autoComplete({
            data: {
                src: sq2ItemFilters,
            },
            selector: "#"+i+"-choice",
            wrapper: false,
            resultsList: {
                tabSelect: true,
                noResults: true,
                class: "search-box dark-7 rounded-bottom px-2 fw-bold dark-shadow-sm",
                element: (list, data) => {
                    // dynamic result loc
                    console.log(i);
                    list.style.zIndex = "100";
                    let position = document.getElementById(i+"-dropdown").getBoundingClientRect();
                    window_pos = document.getElementById("search-container").getBoundingClientRect();
                    list.style.top = position.bottom - window_pos.top + 5 +"px";
                    list.style.left = position.x - window_pos.x +"px";
                    list.style.width = position.width+"px";

                    if (!data.results.length) {
                        message = document.createElement('li');
                        message.classList.add('scaled-font');
                        message.textContent = "No filters found!";
                        list.prepend(message);
                    }
                },
            },
            resultItem: {
                class: "scaled-font search-item",
                selected: "dark-5",
            },
            events: {
                input: {
                    selection: (event) => {
                        if (event.detail.selection.value) {
                            event.target.value = event.detail.selection.value;
                        }
                        doSearchSchedule();
                    },
                },
            }
        }));
    }
}

