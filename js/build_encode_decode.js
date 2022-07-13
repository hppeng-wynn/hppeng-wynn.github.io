let player_build;
let build_powders;

function getItemNameFromID(id) { return idMap.get(id); }
function getTomeNameFromID(id) { return tomeIDMap.get(id); }

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

let atree_data = null;

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
        else if (version_number <= 7) {
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
            setValue(equipment_inputs[i], equipment[i]);
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
        } else if (version_number <= 7){
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
        if (version >= 6) {
            //tome values do not appear in anything before v6.
            for (let i in tomes) {
                let tome_str = info[1].charAt(i);
                let tome_name = getTomeNameFromID(Base64.toInt(tome_str));
                console.log(tome_name);
                setValue(tomeInputs[i], tome_name);
            }
            info[1] = info[1].slice(7);
        }

        if (version >= 7) {
            // ugly af. only works since its the last thing. will be fixed with binary decode
            atree_data = new BitVector(info[1]);
        }
        else {
            atree_data = null;
        }

        for (let i in powder_inputs) {
            setValue(powder_inputs[i], powdering[i]);
        }
        for (let i in skillpoints) {
            setValue(skp_order[i] + "-skp", skillpoints[i]);
        }
    }
}

/*  Stores the entire build in a string using B64 encoding and adds it to the URL.
*/
function encodeBuild(build, powders, skillpoints, atree, atree_state) {

    if (build) {
        let build_string;
        
        //V6 encoding - Tomes
        //V7 encoding - ATree
        build_version = 5;
        build_string = "";
        tome_string = "";

        for (const item of build.items) {
            if (item.statMap.get("custom")) {
                let custom = "CI-"+encodeCustom(item, true);
                build_string += Base64.fromIntN(custom.length, 3) + custom;
                build_version = Math.max(build_version, 5);
            } else if (item.statMap.get("crafted")) {
                build_string += "CR-"+encodeCraft(item);
            } else if (item.statMap.get("category") === "tome") {
                let tome_id = item.statMap.get("id");
                if (tome_id <= 60) {
                    // valid normal tome. ID 61-63 is for NONE tomes.
                    build_version = Math.max(build_version, 6);
                }
                tome_string += Base64.fromIntN(tome_id, 1);
            } else {
                build_string += Base64.fromIntN(item.statMap.get("id"), 3);
            }
        }

        for (const skp of skillpoints) {
            build_string += Base64.fromIntN(skp, 2); // Maximum skillpoints: 2048
        }
        build_string += Base64.fromIntN(build.level, 2);
        for (const _powderset of powders) {
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

        if (atree.length > 0 && atree_state.get(atree[0].ability.id).active) {
            build_version = Math.max(build_version, 7);
            const bitvec = encode_atree(atree, atree_state);
            build_string += bitvec.toB64();
        }

        return build_version.toString() + "_" + build_string;
    }
}

function copyBuild() {
    copyTextToClipboard(url_base+location.hash);
    document.getElementById("copy-button").textContent = "Copied!";
}

function shareBuild(build) {
    if (build) {
        let text = url_base+location.hash+"\n"+
            "WynnBuilder build:\n"+
            "> "+build.items[0].statMap.get("displayName")+"\n"+
            "> "+build.items[1].statMap.get("displayName")+"\n"+
            "> "+build.items[2].statMap.get("displayName")+"\n"+
            "> "+build.items[3].statMap.get("displayName")+"\n"+
            "> "+build.items[4].statMap.get("displayName")+"\n"+
            "> "+build.items[5].statMap.get("displayName")+"\n"+
            "> "+build.items[6].statMap.get("displayName")+"\n"+
            "> "+build.items[7].statMap.get("displayName")+"\n"+
            "> "+build.items[15].statMap.get("displayName")+" ["+build_powders[4].map(x => powderNames.get(x)).join("")+"]";
        copyTextToClipboard(text);
        document.getElementById("share-button").textContent = "Copied!";
    }
}

/**
 * Ability tree encode and decode functions
 *
 * Based on a traversal, basically only uses bits to represent the nodes that are on (and "dark" outgoing edges).
 * credit: SockMower
 */

/**
 * Return: BitVector
 */
function encode_atree(atree, atree_state) {
    let ret_vec = new BitVector(0, 0);

    function traverse(head, atree_state, visited, ret) {
        for (const child of head.children) {
            if (visited.has(child.ability.id)) { continue; }
            visited.set(child.ability.id, true);
            if (atree_state.get(child.ability.id).active) {
                ret.append(1, 1);
                traverse(child, atree_state, visited, ret);
            }
            else {
                ret.append(0, 1);
            }
        }
    }

    traverse(atree[0], atree_state, new Map(), ret_vec);
    return ret_vec;
}

/**
 * Return: List of active nodes
 */
function decode_atree(atree, bits) {
    let i = 0;
    let ret = [];
    ret.push(atree[0]);
    function traverse(head, visited, ret) {
        for (const child of head.children) {
            if (visited.has(child.ability.id)) { continue; }
            visited.set(child.ability.id, true);
            if (bits.read_bit(i)) {
                i += 1;
                ret.push(child);
                traverse(child, visited, ret);
            }
            else {
                i += 1;
            }
        }
    }
    traverse(atree[0], new Map(), ret);
    return ret;
}
