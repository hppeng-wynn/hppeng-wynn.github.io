function getItemNameFromID(id) {
    if (redirectMap.has(id)) {
        return getItemNameFromID(redirectMap.get(id));
    }
    return idMap.get(id);
}

function getTomeNameFromID(id) {
    if (tomeRedirectMap.has(id)) {
        return getTomeNameFromID(tomeRedirectMap.get(id));
    }
    return tomeIDMap.get(id);
}

function parsePowdering(powder_info) {
    // TODO: Make this run in linear instead of quadratic time... ew
    let powdering = [];
    for (let i = 0; i < 5; ++i) {
        let powders = "";
        let n_blocks = Base64.toInt(powder_info.charAt(0));
        // console.log(n_blocks + " blocks");
        powder_info = powder_info.slice(1);
        for (let j = 0; j < n_blocks; ++j) {
            let block = powder_info.slice(0,5);
            console.log(block);
            let six_powders = Base64.toInt(block);
            for (let k = 0; k < 6 && six_powders != 0; ++k) {
                powders += powderNames.get((six_powders & 0x1f) - 1);
                six_powders >>>= 5;
            }
            powder_info = powder_info.slice(5);
        }
        powdering[i] = powders;
    }
    return [powdering, powder_info];
}

/*
 * Populate fields based on url, and calculate build.
 */
function decodeBuild(url_tag) {
    if (url_tag) {
        //default values
        let equipment = [null, null, null, null, null, null, null, null, null];
        let tomes = [null, null, null, null, null, null, null];
        let powdering = ["", "", "", "", ""];
        let info = url_tag.split("_");
        let version = info[0];
        let save_skp = false;
        let skillpoints = [0, 0, 0, 0, 0];
        let level = 106;

        let version_number = parseInt(version)
        //equipment (items)
        // TODO: use filters
        if (version_number < 4) {
            let equipments = info[1];
            for (let i = 0; i < 9; ++i ) {
                let equipment_str = equipments.slice(i*3,i*3+3);
                equipment[i] = getItemNameFromID(Base64.toInt(equipment_str));
            }
            info[1] = equipments.slice(27);
        }
        else if (version_number == 4) { 
            let info_str = info[1];
            let start_idx = 0;
            for (let i = 0; i < 9; ++i ) {
                if (info_str.charAt(start_idx) === "-") {
                    equipment[i] = "CR-"+info_str.slice(start_idx+1, start_idx+18);
                    start_idx += 18;
                }
                else {
                    let equipment_str = info_str.slice(start_idx, start_idx+3);
                    equipment[i] = getItemNameFromID(Base64.toInt(equipment_str));
                    start_idx += 3;
                }
            }
            info[1] = info_str.slice(start_idx);
        }
        else if (version_number <= 6) {
            let info_str = info[1];
            let start_idx = 0;
            for (let i = 0; i < 9; ++i ) {
                if (info_str.slice(start_idx,start_idx+3) === "CR-") {
                    equipment[i] = info_str.slice(start_idx, start_idx+20);
                    start_idx += 20;
                } else if (info_str.slice(start_idx+3,start_idx+6) === "CI-") {
                    let len = Base64.toInt(info_str.slice(start_idx,start_idx+3));
                    equipment[i] = info_str.slice(start_idx+3,start_idx+3+len);
                    start_idx += (3+len);
                } else {
                    let equipment_str = info_str.slice(start_idx, start_idx+3);
                    equipment[i] = getItemNameFromID(Base64.toInt(equipment_str));
                    start_idx += 3;
                }
            }
            info[1] = info_str.slice(start_idx);
        }
        //constant in all versions
        for (let i in equipment) {
            setValue(equipmentInputs[i], equipment[i]);
        }

        //level, skill point assignments, and powdering
        if (version_number == 1) {
            let powder_info = info[1];
            let res = parsePowdering(powder_info);
            powdering = res[0];
        } else if (version_number == 2) {
            save_skp = true;
            let skillpoint_info = info[1].slice(0, 10);
            for (let i = 0; i < 5; ++i ) {
                skillpoints[i] = Base64.toIntSigned(skillpoint_info.slice(i*2,i*2+2));
            }

            let powder_info = info[1].slice(10);
            let res = parsePowdering(powder_info);
            powdering = res[0];
        } else if (version_number <= 6){
            level = Base64.toInt(info[1].slice(10,12));
            setValue("level-choice",level);
            save_skp = true;
            let skillpoint_info = info[1].slice(0, 10);
            for (let i = 0; i < 5; ++i ) {
                skillpoints[i] = Base64.toIntSigned(skillpoint_info.slice(i*2,i*2+2));
            }

            let powder_info = info[1].slice(12);

            let res = parsePowdering(powder_info);
            powdering = res[0];
            info[1] = res[1];
        }
        // Tomes.
        if (version == 6) {
            //tome values do not appear in anything before v6.
            for (let i = 0; i < 7; ++i) {
                let tome_str = info[1].charAt(i);
                for (let i in tomes) {
                    setValue(tomeInputs[i], getTomeNameFromID(Base64.toInt(tome_str)));
                }
            }
            info[1] = info[1].slice(7);
        }

        for (let i in powderInputs) {
            setValue(powderInputs[i], powdering[i]);
        }
    }
}

/*  Stores the entire build in a string using B64 encoding and adds it to the URL.
*/
function encodeBuild() {

    if (player_build) {
        let build_string;
        
        //V6 encoding - Tomes
        build_version = 4;
        build_string = "";
        tome_string = "";

        let crafted_idx = 0;
        let custom_idx = 0;
        for (const item of player_build.items) {
            
            if (item.get("custom")) {
                let custom = "CI-"+encodeCustom(player_build.customItems[custom_idx],true);
                build_string += Base64.fromIntN(custom.length, 3) + custom;
                custom_idx += 1;
                build_version = Math.max(build_version, 5);
            } else if (item.get("crafted")) {
                build_string += "CR-"+encodeCraft(player_build.craftedItems[crafted_idx]);
                crafted_idx += 1;
            } else if (item.get("category") === "tome") {
                let tome_id = item.get("id");
                if (tome_id <= 60) {
                    // valid normal tome. ID 61-63 is for NONE tomes.
                    build_version = Math.max(build_version, 6);
                }
                tome_string += Base64.fromIntN(tome_id, 1);
            } else {
                build_string += Base64.fromIntN(item.get("id"), 3);
            }
        }

        for (const skp of skp_order) {
            build_string += Base64.fromIntN(getValue(skp + "-skp"), 2); // Maximum skillpoints: 2048
        }
        build_string += Base64.fromIntN(player_build.level, 2);
        for (const _powderset of player_build.powders) {
            let n_bits = Math.ceil(_powderset.length / 6);
            build_string += Base64.fromIntN(n_bits, 1); // Hard cap of 378 powders.
            // Slice copy.
            let powderset = _powderset.slice();
            while (powderset.length != 0) {
                let firstSix = powderset.slice(0,6).reverse();
                let powder_hash = 0;
                for (const powder of firstSix) {
                    powder_hash = (powder_hash << 5) + 1 + powder; // LSB will be extracted first.
                }
                build_string += Base64.fromIntN(powder_hash, 5);
                powderset = powderset.slice(6);
            }
        }
        build_string += tome_string;

        return build_version.toString() + "_" + build_string;
    }
}

function copyBuild() {
    if (player_build) {
        copyTextToClipboard(url_base+location.hash);
        document.getElementById("copy-button").textContent = "Copied!";
    }
}

function shareBuild() {
    if (player_build) {
        let text = url_base+location.hash+"\n"+
            "WynnBuilder build:\n"+
            "> "+player_build.helmet.get("displayName")+"\n"+
            "> "+player_build.chestplate.get("displayName")+"\n"+
            "> "+player_build.leggings.get("displayName")+"\n"+
            "> "+player_build.boots.get("displayName")+"\n"+
            "> "+player_build.ring1.get("displayName")+"\n"+
            "> "+player_build.ring2.get("displayName")+"\n"+
            "> "+player_build.bracelet.get("displayName")+"\n"+
            "> "+player_build.necklace.get("displayName")+"\n"+
            "> "+player_build.weapon.get("displayName")+" ["+player_build.weapon.get("powders").map(x => powderNames.get(x)).join("")+"]";
        copyTextToClipboard(text);
        document.getElementById("share-button").textContent = "Copied!";
    }
}

function populateBuildList() {
    const buildList = document.getElementById("build-choice");
    const savedBuilds = window.localStorage.getItem("builds") === null ? {} : JSON.parse(window.localStorage.getItem("builds"));

    for (const buildName of Object.keys(savedBuilds).sort()) {
        const buildOption = document.createElement("option");
        buildOption.setAttribute("value", buildName);
        buildList.appendChild(buildOption);
    }
}

function saveBuild() {
    if (player_build) {
        const savedBuilds = window.localStorage.getItem("builds") === null ? {} : JSON.parse(window.localStorage.getItem("builds"));
        const saveName = document.getElementById("build-name").value;
        const encodedBuild = encodeBuild();
        if ((!Object.keys(savedBuilds).includes(saveName)
                || document.getElementById("saved-error").textContent !== "") && encodedBuild !== "") {
            savedBuilds[saveName] = encodedBuild.replace("#", "");
            window.localStorage.setItem("builds", JSON.stringify(savedBuilds));

            document.getElementById("saved-error").textContent = "";
            document.getElementById("saved-build").textContent = "Build saved locally";
            
            const buildList = document.getElementById("build-choice");
            const buildOption = document.createElement("option");
            buildOption.setAttribute("value", saveName);
            buildList.appendChild(buildOption);
        } else {
            document.getElementById("saved-build").textContent = "";
            if (encodedBuild === "") {
                document.getElementById("saved-error").textContent = "Empty build";
            }
            else {
                document.getElementById("saved-error").textContent = "Exists. Overwrite?";
            }
        }
    }
}

function loadBuild() {
    let savedBuilds = window.localStorage.getItem("builds") === null ? {} : JSON.parse(window.localStorage.getItem("builds"));
    let saveName = document.getElementById("build-name").value;

    if (Object.keys(savedBuilds).includes(saveName)) { 
        decodeBuild(savedBuilds[saveName])
        document.getElementById("loaded-error").textContent = "";
        document.getElementById("loaded-build").textContent = "Build loaded";
    } else {
        document.getElementById("loaded-build").textContent = "";
        document.getElementById("loaded-error").textContent = "Build doesn't exist";
    }
}

function resetFields(){
    for (let i in powderInputs) {
        setValue(powderInputs[i], "");
    }
    for (let i in equipmentInputs) {
        setValue(equipmentInputs[i], "");
    }
    setValue("str-skp", "0");
    setValue("dex-skp", "0");
    setValue("int-skp", "0");
    setValue("def-skp", "0");
    setValue("agi-skp", "0");
    setValue("level-choice", "106");
    location.hash = "";
    calculateBuild();
}

function toggleID() {
    let button = document.getElementById("show-id-button");
    let targetDiv = document.getElementById("id-edit");
    if (button.classList.contains("toggleOn")) { //toggle the pressed button off
        targetDiv.style.display = "none";
        button.classList.remove("toggleOn");
    }
    else {
        targetDiv.style.display = "block";
        button.classList.add("toggleOn");
    }
}

function toggleButton(button_id) {
    let button = document.getElementById(button_id);
    if (button) {
        if (button.classList.contains("toggleOn")) {
            button.classList.remove("toggleOn");
        } else {
            button.classList.add("toggleOn");
        }
    }
}

// TODO: Learn and use await
function init() {
    console.log("builder.js init");
    init_autocomplete();
    decodeBuild(url_tag);
    for (const i of equipment_keys) {
        update_field(i);
    }
}

function init2() {
    load_ing_init(init);
}
function init3() {
    load_tome_init(init2)
}

load_init(init3);
