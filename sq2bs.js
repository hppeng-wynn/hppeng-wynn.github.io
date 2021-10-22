let equipment_keys = ['weapon', 'helmet', 'chestplate', 'leggings', 'boots', 'ring1', 'ring2', 'bracelet', 'necklace'];
let skp_keys = ['str', 'dex', 'int', 'def', 'agi'];

document.addEventListener('DOMContentLoaded', function() {
    for (const i in equipment_keys) {
        document.querySelector("#"+equipment_keys[i]+"-choice").setAttribute("oninput", "update_fields('"+equipment_keys[i]+"'); calcBuildSchedule()");
        document.querySelector("#"+equipment_keys[i]+"-powder").setAttribute("oninput", "calcBuildSchedule()");
    }

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
function update_fields(type, alt="") {
    let item = itemMap.get(document.querySelector("#"+type+"-choice").value);
    if (item) {
        document.querySelector("#"+type+"-powder").setAttribute("placeholder", item["slots"]+" slots"+alt);
        document.querySelector("#"+type+"-choice").classList.remove("text-light", "is-invalid");
        document.querySelector("#"+type+"-choice").classList.add(item.tier);

        if (type == 'weapon') {
            document.querySelector("#"+type+"-img").setAttribute('src', 'media/items/new/generic-'+item.type+'.png');
        }
    } else if (document.querySelector("#"+type+"-choice").value == '') {
        document.querySelector("#"+type+"-choice").classList.remove("is-invalid");
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

// tabular stats
let tabs = ['minimal-stats', 'minimal-offensive-stats', 'minimal-defensive-stats'];

function show_tab(tab) {
    for (const i in tabs) {
        document.querySelector("#"+tabs[i]).style.display = "none";
    }
    document.querySelector("#"+tab).style.display = "";
}