let equipment_keys = ['weapon', 'helmet', 'chestplate', 'leggings', 'boots', 'ring1', 'ring2', 'bracelet', 'necklace'];

$(document).ready(function(){
    // inits
    $("#column2").height($("#column1").height());
    $("#column3").height($("#column1").height());

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

    // update builds
    jQuery(document).on("keypress", '.skp-input', function(event){
        if (event.keyCode == 13) {
            updateStats();
        }
    });

    jQuery(document).on("keypress", '.search-field', function(event){
        if (event.keyCode == 13) {
            doItemSearch();
        }
    });

    // set search style
    $("#weapon-choice").on('input', function(){
        setTimeout(function() {
            set_input_style('weapon');
            check_item($("#weapon-choice").val());
            update_powder_count('weapon');
        }, 500);
    });

    $("#helmet-choice").on('input', function(){
        setTimeout(function() {
            set_input_style('helmet');
            check_item($("#helmet-choice").val());
            update_powder_count('helmet', '|example: t6t6');
        }, 500);
    });

    $("#chestplate-choice").on('input', function(){
        setTimeout(function() {
            set_input_style('chestplate');
            check_item($("#chestplate-choice").val());
            update_powder_count('chestplate');
        }, 500);
    });

    $("#leggings-choice").on('input', function(){
        setTimeout(function() {
            set_input_style('leggings');
            check_item($("#leggings-choice").val());
            update_powder_count('leggings');
        }, 500);

    });

    $("#boots-choice").on('input', function(){
        setTimeout(function() {
            set_input_style('boots');
            check_item($("#boots-choice").val());
            update_powder_count('boots');
        }, 500);
    });

    $("#ring1-choice").on('input', function(){
        setTimeout(function() {
            set_input_style('ring1');
            check_item($("#ring1-choice").val());
        }, 500);
    });

    $("#ring2-choice").on('input', function(){
        setTimeout(function() {
            set_input_style('ring2');
            check_item($("#ring2-choice").val());
        }, 500);
    });

    $("#bracelet-choice").on('input', function(){
        setTimeout(function() {
            set_input_style('bracelet');
            check_item($("#bracelet-choice").val());
        }, 500);
    });

    $("#necklace-choice").on('input', function(){
        setTimeout(function() {
            set_input_style('necklace');
            check_item($("#necklace-choice").val());
        }, 500);
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
    init_tooltip_loc()

    $("#weapon-img-loc").hover(function(event){
        $("#weapon-tooltip").show();
    }, function(){
        $("#weapon-tooltip").hide();
    });

    $("#helmet-img-loc").hover(function(event){
        $("#helmet-tooltip").show();
    }, function(){
        $("#helmet-tooltip").hide();
    });

    $("#chestplate-img-loc").hover(function(event){
        $("#chestplate-tooltip").show();
    }, function(){
        $("#chestplate-tooltip").hide();
    });

    $("#leggings-img-loc").hover(function(event){
        $("#leggings-tooltip").show();
    }, function(){
        $("#leggings-tooltip").hide();
    });

    $("#boots-img-loc").hover(function(event){
        $("#boots-tooltip").show();
    }, function(){
        $("#boots-tooltip").hide();
    });

    $("#ring1-img-loc").hover(function(event){
        $("#ring1-tooltip").show();
    }, function(){
        $("#ring1-tooltip").hide();
    });

    $("#ring2-img-loc").hover(function(event){
        $("#ring2-tooltip").show();
    }, function(){
        $("#ring2-tooltip").hide();
    });

    $("#bracelet-img-loc").hover(function(event){
        $("#bracelet-tooltip").show();
    }, function(){
        $("#bracelet-tooltip").hide();
    });

    $("#necklace-img-loc").hover(function(event){
        $("#necklace-tooltip").show();
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

function check_item(name) {
    if (itemMap.has(name)) {
        calculateBuild()
    }
}

function init_tooltip_loc(){
    for (const i in equipment_keys) {
        let ImgLoc = document.getElementById(equipment_keys[i]+'-img-loc').getBoundingClientRect();
        $("#"+equipment_keys[i]+"-tooltip").css('top', ImgLoc.bottom);
        $("#"+equipment_keys[i]+"-tooltip").css('left', ImgLoc.left);
    }
}


/*
        document.getElementById(armorType+"-choice").addEventListener("change", (event) => {
            let item_name = event.target.value;
            let nSlots = undefined;
            if (itemMap.has(item_name)) {
                let item = itemMap.get(item_name);
                nSlots = item["slots"];
                //console.log(item);
            }
            else {
                let crafted_custom_item = getCraftFromHash(item_name) !== undefined ? getCraftFromHash(item_name) : (getCustomFromHash(item_name) !== undefined ? getCustomFromHash(item_name) : undefined);
                if (crafted_custom_item !== undefined) {
                    nSlots = crafted_custom_item.statMap.get("slots");
                } 
            }
            if (nSlots !== undefined) {
                document.getElementById(armorType+"-slots").textContent = nSlots + " slots";
            }
            else {
                document.getElementById(armorType+"-slots").textContent = "X slots";
            }
        });*/

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