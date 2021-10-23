let equipment_keys = ['weapon', 'helmet', 'chestplate', 'leggings', 'boots', 'ring1', 'ring2', 'bracelet', 'necklace'];
let weapon_keys = ['dagger', 'wand', 'bow', 'relik', 'spear']
let skp_keys = ['str', 'dex', 'int', 'def', 'agi'];

document.addEventListener('DOMContentLoaded', function() {

    for (const i in equipment_keys) {
        document.querySelector("#"+equipment_keys[i]+"-choice").setAttribute("oninput", "update_fields('"+equipment_keys[i]+"'); calcBuildSchedule()");
        document.querySelector("#"+equipment_keys[i]+"-powder").setAttribute("oninput", "calcBuildSchedule()");
    }
    document.querySelector("#level-choice").setAttribute("oninput", "calcBuildSchedule()")

    let skp_fields = document.getElementsByClassName("skp-update");
    
    for (i = 0; i < skp_fields.length; i++) {
        skp_fields[i].setAttribute("oninput", "updateStatSchedule()");
    }
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
    }, 1000);
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
function update_fields(type, alt="") {
    let item = itemMap.get(document.querySelector("#"+type+"-choice").value);
    if (item && ((item.type == type.replace(/[0-9]/g, '')) || (item.category == type))) {
        // powder styling
        document.querySelector("#"+type+"-powder").setAttribute("placeholder", item["slots"]+" slots"+alt);

        if (item['slots'] == 0) {
            document.querySelector("#"+type+"-powder").disabled = true;
        } else {
            document.querySelector("#"+type+"-powder").disabled = false;
        }

        // input box styling
        document.querySelector("#"+type+"-choice").classList.remove("text-light", "is-invalid", 'Normal', 'Unique', 'Rare', 'Legendary', 'Fabled', 'Mythic', 'Set');
        document.querySelector("#"+type+"-choice").classList.add(item.tier);

        if (type == 'weapon') {
            document.querySelector("#"+type+"-img").setAttribute('src', 'media/items/new/generic-'+item.type+'.png');
        }
    } else if (document.querySelector("#"+type+"-choice").value == '') {
        document.querySelector("#"+type+"-choice").classList.remove("is-invalid", 'Normal', 'Unique', 'Rare', 'Legendary', 'Fabled', 'Mythic', 'Set');
        document.querySelector("#"+type+"-powder").setAttribute("placeholder", '0 slots');
    }
    else {
        document.querySelector("#"+type+"-choice").classList.remove('Normal', 'Unique', 'Rare', 'Legendary', 'Fabled', 'Mythic', 'Set');
        document.querySelector("#"+type+"-choice").classList.add("text-light", "is-invalid");
    }
}

function init_field_styles() {
    for (const i in equipment_keys) {
        update_fields(equipment_keys[i]);
    }
}

function get_item_color(item) {
    item = itemMap.get(item);
    if (item) {return item.tier} else {return ''}
}

// tabular stats
let tabs = ['all-stats', 'minimal-offensive-stats', 'minimal-defensive-stats'];

function show_tab(tab) {
    for (const i in tabs) {
        document.querySelector("#"+tabs[i]).style.display = "none";
    }
    document.querySelector("#"+tab).style.display = "";
}

// autocomplete initialize
function init_autocomplete() {
    let dropdowns = new Map()
    for (const i in equipment_keys) {
        // build dropdown
        let item_arr = [];
        if (equipment_keys[i] == 'weapon') {
            for (const weaponType of weapon_keys) {
                for (const weapon of itemLists.get(weaponType)) {
                    let item_obj = itemMap.get(weapon);
                    if (item_obj["restrict"] && item_obj["restrict"] === "DEPRECATED") {
                        continue;
                    }
                    item_arr.push(weapon);
                }
            }
        } else {
            for (const item of itemLists.get(equipment_keys[i].replace(/[0-9]/g, ''))) {
                let item_obj = itemMap.get(item);
                if (item_obj["restrict"] && item_obj["restrict"] === "DEPRECATED") {
                    continue;
                }
                item_arr.push(item)
            }
        }

        // create dropdown
        dropdowns.set(equipment_keys[i], new autoComplete({
            data: {
                src: item_arr
            },
            selector: "#"+ equipment_keys[i] +"-choice",
            wrapper: false,
            resultsList: {
                tabSelect: true,
                class: "search-box dark-7 rounded-bottom px-2 fw-bold dark-shadow-sm",
                element: (list, data) => {
                    // dynamic result loc
                    let position = document.getElementById(equipment_keys[i]+'-dropdown').getBoundingClientRect();
                    list.style.top = position.bottom + window.scrollY +"px";
                    list.style.left = position.x+"px";
                    list.style.width = position.width+"px";
                },
            },
            resultItem: {
                class: "scaled-font search-item",
                selected: "dark-5",
                element: (item, data) => {
                    item.classList.add(get_item_color(data.value));
                },
            },
            events: {
                input: {
                    selection: (event) => {
                        event.target.value = event.detail.selection.value;
                        update_fields(equipment_keys[i]);
                        calcBuildSchedule();
                    },
                },
            }
        }));
    }
}
