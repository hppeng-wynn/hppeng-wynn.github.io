let equipment_keys = ['helmet', 'chestplate', 'leggings', 'boots', 'ring1', 'ring2', 'bracelet', 'necklace', 'weapon'];
let weapon_keys = ['dagger', 'wand', 'bow', 'relik', 'spear']
let skp_keys = ['str', 'dex', 'int', 'def', 'agi'];

document.addEventListener('DOMContentLoaded', function() {

    for (const eq of equipment_keys) {
        document.querySelector("#"+eq+"-choice").setAttribute("oninput", "update_field('"+ eq +"'); calcBuildSchedule();");
        document.querySelector("#"+eq+"-powder").setAttribute("oninput", "calcBuildSchedule();");
        document.querySelector("#"+eq+"-tooltip").setAttribute("onclick", "collapse_element('"+ eq +"')");
    }
    document.querySelector("#level-choice").setAttribute("oninput", "calcBuildSchedule()")

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
    if (doSearchTask !== null) {
        clearTimeout(doSearchTask);
    }
    doSearchTask = setTimeout(function(){
        doSearchTask = null;
        doItemSearch();
    }, 500);
}

// equipment field dynamic styling
function update_field(field) {
    // built on the assumption of no one will type in CI/CR letter by letter
    // resets 
    document.querySelector("#"+field+"-choice").classList.remove("text-light", "is-invalid", 'Normal', 'Unique', 'Rare', 'Legendary', 'Fabled', 'Mythic', 'Set');

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

        document.querySelector("#"+equipment_keys[i]+"-powder").disabled = true;
        return false;
    }

    // set item color
    document.querySelector("#"+field+"-choice").classList.add(tier);

    // set powder slots
    document.querySelector("#"+field+"-powder").setAttribute("placeholder", powder_slots+" slots");

    if (powder_slots == 0) {
        document.querySelector("#"+field+"-powder").disabled = true;
    } else {
        document.querySelector("#"+field+"-powder").disabled = false;
    }

    // set weapon img
    if (category == 'weapon') {
        document.querySelector("#weapon-img").setAttribute('src', 'media/items/new/generic-'+type+'.png');
    }

    // call calc build
}


let tabs = ['all-stats', 'minimal-offensive-stats', 'minimal-defensive-stats'];

function show_tab(tab) {
    collapse_element("helmet");
    for (const i in tabs) {
        document.querySelector("#"+tabs[i]).style.display = "none";
    }
    document.querySelector("#"+tab).style.display = "";
}

function toggle_boost_tab(tab) {
    for (const i of skp_keys) {
        document.querySelector("#"+i+"-boost").style.display = "none";
    }
    document.querySelector("#"+tab+"-boost").style.display = "";
}

function collapse_element(eq) {
    elem_list = document.querySelector("#"+eq+"-tooltip").children
    for (elem of elem_list) {
        if (elem.classList.contains("no-collapse")) { continue; }
        if (elem.style.display == "none") {
            elem.style.display = "";
        } else {
            elem.style.display = "none";
        }   
    }
    // macy quirk
    window.dispatchEvent(new Event('resize'));
    // weird bug where display: none overrides??
    document.querySelector("#"+eq+"-tooltip").style.display = "";
}

// autocomplete initialize
function init_autocomplete() {
    let dropdowns = new Map()
    for (const eq of equipment_keys) {
        // build dropdown
        console.log('init dropdown for '+ eq)
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
                tabSelect: true,
                noResults: true,
                class: "search-box dark-7 rounded-bottom px-2 fw-bold dark-shadow-sm",
                element: (list, data) => {
                    // dynamic result loc
                    let position = document.getElementById(eq+'-dropdown').getBoundingClientRect();
                    list.style.top = position.bottom + window.scrollY +"px";
                    list.style.left = position.x+"px";
                    list.style.width = position.width+"px";

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
}