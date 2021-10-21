$().ready(function(){
    // test

    // sp fields
    jQuery(document).on("input", '.skp-update', function(){
        updateStatSchedule();
    });

    // equipment fields
    $("#weapon-choice").on('input', function(e){
        update_fields('weapon');
        calcBuildSchedule();
    });

    $("#weapon-powder").on('input', function(e){
        calcBuildSchedule();
    });

    $("#helmet-choice").on('input', function(e){
        update_fields('helmet', '|example: t6t6');
        calcBuildSchedule();
    });

    $("#helmet-powder").on('input', function(e){
        calcBuildSchedule();
    });

    $("#chestplate-choice").on('input', function(e){
        update_fields('chestplate');
        calcBuildSchedule();
    });

    $("#chestplate-powder").on('input', function(e){
        calcBuildSchedule();
    });

    $("#leggings-choice").on('input', function(e){
        update_fields('leggings');
        calcBuildSchedule();
    });

    $("#leggings-powder").on('input', function(e){
        calcBuildSchedule();
    });

    $("#boots-choice").on('input', function(e){
        update_fields('boots');
        calcBuildSchedule();
    });

    $("#boots-powder").on('input', function(e){
        calcBuildSchedule();
    });

    $("#ring1-choice").on('input', function(e){
        update_fields('ring1');
        calcBuildSchedule();
    });

    $("#ring2-choice").on('input', function(e){
        update_fields('ring2');
        calcBuildSchedule();
    });

    $("#bracelet-choice").on('input', function(e){
        update_fields('bracelet');
        calcBuildSchedule();
    });

    $("#necklace-choice").on('input', function(e){
        update_fields('necklace');
        calcBuildSchedule();
    });

    $("#level-choice").on('input', function(e){
        calcBuildSchedule();
    });

    // tabular stats view
    let tabs = ['minimal-stats', 'minimal-offensive-stats', 'minimal-defensive-stats'];
    let btns = ['tab-basic-btn', 'tab-offense-btn', 'tab-defense-btn'];

    $(".fake-button").on('click' ,function(e){
        let target_tab;

        if (e.target.id == 'tab-basic-btn') {
            target_tab = 'minimal-stats';
        }
        else if (e.target.id == 'tab-offense-btn') {
            target_tab = 'minimal-offensive-stats';
        }
        else if (e.target.id == 'tab-defense-btn') {
            target_tab = 'minimal-defensive-stats';
        }
        for (const i in tabs) {
            $("#"+tabs[i]).hide();
            $("#"+btns[i]).removeClass("dark-6").addClass("dark-4");
        }
        $("#"+e.target.id).addClass("dark-6");
        $("#"+target_tab).show();
    });
});
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

function update_fields(type, alt="") {
    let item = itemMap.get($("#"+type+"-choice").val());
    if (item) {
        $("#"+type+"-powder").attr("placeholder", item["slots"]+" slots"+alt);
        $("#"+type+"-choice").removeClass("text-light is-invalid").addClass(item.tier);
        if (type == 'weapon') {
            $("#"+type+"-img").attr('src', 'media/items/new/generic-'+item.type+'.png');
        }
    } else if ($("#"+type+"-choice").val() == '') {
        $("#"+type+"-choice").removeClass("is-invalid");
    }
    else {
        $("#"+type+"-choice").removeClass('Normal Unique Rare Legendary Fabled Mythic Set').addClass("text-light is-invalid");
    }
}

function init_field_styles() {
    let equipment_keys = ['weapon', 'helmet', 'chestplate', 'leggings', 'boots', 'ring1', 'ring2', 'bracelet', 'necklace'];
    for (const i in equipment_keys) {
        update_fields(equipment_keys[i]);
    }
}