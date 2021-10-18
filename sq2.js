let equipment_keys = ['weapon', 'helmet', 'chestplate', 'leggings', 'boots', 'ring1', 'ring2', 'bracelet', 'necklace'];

$(document).ready(function(){
    // inits

    $("#overall-window").toggle();
    $("#search-container").toggle();
    $("#boost-container").toggle();

    // pot/base damage switch for weap display
    /*
    $(".damage-size").click(function(){
        $(".damage-size").hide();
        $(".potency").show();
    });
    $(".potency").click(function(){
        $(".potency").hide();
        $(".damage-size").show();
    });*/

    // windows
    $("#overall-window").draggable({
        handle: '#overall-window-header',
    }).resizable({
        alsoResize: "#all-stats",
        handles: 'n, e, s ,w'
    });

    $("#search-container").draggable({
        handle: '#search-container-header',
    });

    $("#boost-container").draggable({
        handle: '#boost-container-header',
    });

    // window priority
    $("#overall-window").mousedown(function() {
        $(".window-container").css("z-index", 10);
        $(this).css("z-index", 11);
    });

    $("#search-container").mousedown(function() {
        $(".window-container").css("z-index", 10);
        $(this).css("z-index", 11);
    });

    $("#boost-container").mousedown(function() {
        $(".window-container").css("z-index", 10);
        $(this).css("z-index", 11);
    });

    // update builds
    jQuery(document).on("input", '.skp-input', function(event){
        updateStatSchedule();
    });

    jQuery(document).on("input", '.search-field', function(event){
        doSearchSchedule();
    });

    // set listeners/checks
    $("#weapon-choice").on('input', function(){
        set_input_style('weapon');
        calcBuildSchedule();
        update_powder_count('weapon');
    });

    $("#weapon-powder").on('input', function(){
        calcBuildSchedule();
    });

    $("#helmet-choice").on('input', function(){
        set_input_style('helmet');
        calcBuildSchedule();
        update_powder_count('helmet', '|example: t6t6');
    });

    $("#helmet-powder").on('input', function(){
        calcBuildSchedule();
    });

    $("#chestplate-choice").on('input', function(){
        set_input_style('chestplate');
        calcBuildSchedule();
        update_powder_count('chestplate');
    });

    $("#chestplate-powder").on('input', function(){
        calcBuildSchedule();
    });

    $("#leggings-choice").on('input', function(){
        set_input_style('leggings');
        calcBuildSchedule();
        update_powder_count('leggings');
    });

    $("#leggings-powder").on('input', function(){
        calcBuildSchedule();
    });

    $("#boots-choice").on('input', function(){
        set_input_style('boots');
        calcBuildSchedule();
        update_powder_count('boots');
    });

    $("#boots-powder").on('input', function(){
        calcBuildSchedule();
    });

    $("#ring1-choice").on('input', function(){
        set_input_style('ring1');
        calcBuildSchedule();
    });

    $("#ring2-choice").on('input', function(){
        set_input_style('ring2');
        calcBuildSchedule();
    });

    $("#bracelet-choice").on('input', function(){
        set_input_style('bracelet');
        calcBuildSchedule();
    });

    $("#necklace-choice").on('input', function(){
        set_input_style('necklace');
        calcBuildSchedule();
    });
    
    // control vars
    let basic_stats_ctrl = true;
    let off_stats_ctrl = false;
    let def_stats_ctrl = false;

    $("#basic-stats-btn").click(function(){
        basic_stats_ctrl = true;
        off_stats_ctrl = false;
        def_stats_ctrl = false;

        $("#minimal-stats").show();
        $("#minimal-offensive-stats").hide();
        $("#minimal-defensive-stats").hide();

        $("#off-stats-btn").css("background-color", "rgb(45, 45, 45)");
        $("#def-stats-btn").css("background-color", "rgb(45, 45, 45)");
    });
    $("#basic-stats-btn").hover(
        function(){
        $("#basic-stats-btn").css("background-color", "rgb(40, 40, 40)");
    },function(){
        if (basic_stats_ctrl) {
            $("#basic-stats-btn").css("background-color", "rgb(30, 30, 30)");
        } else {
            $("#basic-stats-btn").css("background-color", "rgb(45, 45, 45)");
        }
    });

    $("#off-stats-btn").click(function(){
        basic_stats_ctrl = false;
        off_stats_ctrl = true;
        def_stats_ctrl = false;

        $("#minimal-stats").hide();
        $("#minimal-offensive-stats").show();
        $("#minimal-defensive-stats").hide();

        $("#basic-stats-btn").css("background-color", "rgb(45, 45, 45)");
        $("#def-stats-btn").css("background-color", "rgb(45, 45, 45)");
    });
    $("#off-stats-btn").hover(
        function(){
        $("#off-stats-btn").css("background-color", "rgb(40, 40, 40)");
    },function(){
        if (off_stats_ctrl) {
          $("#off-stats-btn").css("background-color", "rgb(30, 30, 30)");
        } else {
          $("#off-stats-btn").css("background-color", "rgb(45, 45, 45)");
        }
    });

    $("#def-stats-btn").click(function(){
        basic_stats_ctrl = false;
        off_stats_ctrl = false;
        def_stats_ctrl = true;

        $("#minimal-stats").hide();
        $("#minimal-offensive-stats").hide();
        $("#minimal-defensive-stats").show();

        $("#off-stats-btn").css("background-color", "rgb(45, 45, 45)");
        $("#basic-stats-btn").css("background-color", "rgb(45, 45, 45)");
    });
    $("#def-stats-btn").hover(
        function(){
        $("#def-stats-btn").css("background-color", "rgb(40, 40, 40)");
    },function(){
        if (def_stats_ctrl) {
            $("#def-stats-btn").css("background-color", "rgb(30, 30, 30)");
        } else {
            $("#def-stats-btn").css("background-color", "rgb(45, 45, 45)");
        }
    });


    // item tooltip

    $("#weapon-img-loc").hover(function(event){
        $("#weapon-tooltip").show();
        init_tooltip_loc('weapon');
    }, function(){
        $("#weapon-tooltip").hide();
    });

    $("#helmet-img-loc").hover(function(event){
        $("#helmet-tooltip").show();
        init_tooltip_loc('helmet');
    }, function(){
        $("#helmet-tooltip").hide();
    });

    $("#chestplate-img-loc").hover(function(event){
        $("#chestplate-tooltip").show();
        init_tooltip_loc('chestplate');
    }, function(){
        $("#chestplate-tooltip").hide();
    });

    $("#leggings-img-loc").hover(function(event){
        $("#leggings-tooltip").show();
        init_tooltip_loc('leggings');
    }, function(){
        $("#leggings-tooltip").hide();
    });

    $("#boots-img-loc").hover(function(event){
        $("#boots-tooltip").show();
        init_tooltip_loc('boots');
    }, function(){
        $("#boots-tooltip").hide();
    });

    $("#ring1-img-loc").hover(function(event){
        $("#ring1-tooltip").show();
        init_tooltip_loc('ring1');
    }, function(){
        $("#ring1-tooltip").hide();
    });

    $("#ring2-img-loc").hover(function(event){
        $("#ring2-tooltip").show();
        init_tooltip_loc('ring2');
    }, function(){
        $("#ring2-tooltip").hide();
    });

    $("#bracelet-img-loc").hover(function(event){
        $("#bracelet-tooltip").show();
        init_tooltip_loc('bracelet');
    }, function(){
        $("#bracelet-tooltip").hide();
    });

    $("#necklace-img-loc").hover(function(event){
        $("#necklace-tooltip").show();
        init_tooltip_loc('necklace');
    }, function(){
        $("#necklace-tooltip").hide();
    });

});

function set_input_style(type) {
    let item = itemMap.get($("#"+type+"-choice").val());
    if (item) {
        $("#"+type+"-choice").addClass(item.tier);
        if (type == 'weapon') {
            $("#"+type+"-img").attr('src', 'media/items/new/generic-'+item.type+'.png');
        }
    } else {
        $("#"+type+"-choice").attr('class', 'item-name');
    }
}

function init_tooltip_loc(equipment){
    let ImgLoc = document.getElementById(equipment+'-img-loc').getBoundingClientRect();
    let tooltipRect = document.getElementById(equipment+"-tooltip").getBoundingClientRect();
    let windowHeight = $(window).height()

    $("#"+equipment+"-tooltip").css('top', Math.min(ImgLoc.top, windowHeight - (tooltipRect.bottom - tooltipRect.top)));
    $("#"+equipment+"-tooltip").css('left', ImgLoc.right);
}

function update_powder_count(type, alt="") {
    let item = itemMap.get($("#"+type+"-choice").val());
    if (item) {
        $("#"+type+"-powder").attr("placeholder", item["slots"]+" slots"+alt);
    }
}

function init_equipUI() {
    for (const i in equipment_keys) {
        set_input_style(equipment_keys[i]);
    }
    update_powder_count('weapon');
    update_powder_count('helmet', '|example: t6t6');
    update_powder_count('chestplate');
    update_powder_count('leggings');
    update_powder_count('boots');
}

// phanta method of handling input <3
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