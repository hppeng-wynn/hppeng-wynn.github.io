function displaysq2BuildStats(parent_id,build,command_group){
    // Commands to "script" the creation of nice formatting.
    // #commands create a new element.
    // !elemental is some janky hack for elemental damage.
    // normals just display a thing.

    let display_commands = command_group;
    console.log(display_commands);

    // Clear the parent div.
    setHTML(parent_id, "");
    let parent_div = document.getElementById(parent_id);

    let stats = build.statMap;
    console.log(build.statMap);
    
    let active_elem;
    let elemental_format = false;

    //TODO this is put here for readability, consolidate with definition in build.js
    let staticIDs = ["hp", "eDef", "tDef", "wDef", "fDef", "aDef"];

    for (const command of display_commands) {
        // style instructions
        
        if (command.charAt(0) === "#") {
            if (command === "#defense-stats") {
                displaysq2DefenseStats(parent_div, build, true);
            }
        }
        if (command.charAt(0) === "!") {
            // TODO: This is sooo incredibly janky.....
            if (command === "!elemental") {
                elemental_format = !elemental_format;
            }
        }

        // id instruction
        else {
            let id = command;
            if (stats.get(id)) {
                let style = null;

                // TODO: add pos and neg style
                if (!staticIDs.includes(id)) {
                    style = "positive";
                    if (stats.get(id) < 0) {
                        style = "negative";
                    }
                }

                // ignore
                let id_val = stats.get(id);
                if (reversedIDs.includes(id)) {
                    style === "positive" ? style = "negative" : style = "positive"; 
                }
                if (id === "poison" && id_val > 0) {
                    id_val = Math.ceil(id_val*build.statMap.get("poisonPct")/100);
                }
                displaysq2FixedID(parent_div, id, id_val, elemental_format, style);
                if (id === "poison" && id_val > 0) {
                    let row = document.createElement('div');
                    row.classList.add("row")
                    let value_elem = document.createElement('div');
                    value_elem.classList.add('col');
                    value_elem.classList.add('text-end');

                    let prefix_elem = document.createElement('b');
                    prefix_elem.textContent = "\u279C With Strength: ";
                    let number_elem = document.createElement('b');
                    number_elem.classList.add(style);
                    number_elem.textContent = (id_val * (1+skillPointsToPercentage(build.total_skillpoints[0])) ).toFixed(0) + idSuffixes[id];
                    value_elem.append(prefix_elem);
                    value_elem.append(number_elem);
                    row.appendChild(value_elem);

                    parent_div.appendChild(row);
                }
                
            // sp thingy
            } else if (skp_order.includes(id)) {
                let total_assigned = build.total_skillpoints[skp_order.indexOf(id)];
                let base_assigned = build.base_skillpoints[skp_order.indexOf(id)];
                let diff = total_assigned - base_assigned;
                let style;
                if (diff > 0) {
                    style = "positive";
                } else if (diff < 0) {
                    style = "negative";
                }
                if (diff != 0) {
                    displaysq2FixedID(parent_div, id, diff, false, style);
                }
            }
        }
    }
}

function displaysq2ExpandedItem(item, parent_id, mini=false){
    // Commands to "script" the creation of nice formatting.
    // #commands create a new element.
    // !elemental is some janky hack for elemental damage.
    // normals just display a thing.
    if (item.get("category") === "weapon") {
        let stats = new Map();
        stats.set("atkSpd", item.get("atkSpd"));
        stats.set("damageBonus", [0, 0, 0, 0, 0]);

        //SUPER JANK @HPP PLS FIX
        let damage_keys = [ "nDam_", "eDam_", "tDam_", "wDam_", "fDam_", "aDam_" ];
        if (item.get("tier") !== "Crafted") {
            stats.set("damageRaw", [item.get("nDam"), item.get("eDam"), item.get("tDam"), item.get("wDam"), item.get("fDam"), item.get("aDam")]);
            let results = calculateSpellDamage(stats, [100, 0, 0, 0, 0, 0], 0, 0, 0, item, [0, 0, 0, 0, 0], 1, undefined);
            let damages = results[2];
            let total_damage = 0;
            for (const i in damage_keys) {
                total_damage += damages[i][0] + damages[i][1];
                item.set(damage_keys[i], damages[i][0]+"-"+damages[i][1]);
            }
            total_damage = total_damage / 2;
            item.set("basedps", total_damage);
            
        } else {
            stats.set("damageRaw", [item.get("nDamLow"), item.get("eDamLow"), item.get("tDamLow"), item.get("wDamLow"), item.get("fDamLow"), item.get("aDamLow")]);
            stats.set("damageBases", [item.get("nDamBaseLow"),item.get("eDamBaseLow"),item.get("tDamBaseLow"),item.get("wDamBaseLow"),item.get("fDamBaseLow"),item.get("aDamBaseLow")]);
            let resultsLow = calculateSpellDamage(stats, [100, 0, 0, 0, 0, 0], 0, 0, 0, item, [0, 0, 0, 0, 0], 1, undefined);
            let damagesLow = resultsLow[2];
            stats.set("damageRaw", [item.get("nDam"), item.get("eDam"), item.get("tDam"), item.get("wDam"), item.get("fDam"), item.get("aDam")]);
            stats.set("damageBases", [item.get("nDamBaseHigh"),item.get("eDamBaseHigh"),item.get("tDamBaseHigh"),item.get("wDamBaseHigh"),item.get("fDamBaseHigh"),item.get("aDamBaseHigh")]);
            let results = calculateSpellDamage(stats, [100, 0, 0, 0, 0, 0], 0, 0, 0, item, [0, 0, 0, 0, 0], 1, undefined);
            let damages = results[2];
            console.log(damages);
            
            let total_damage_min = 0;
            let total_damage_max = 0;
            for (const i in damage_keys) {
                total_damage_min += damagesLow[i][0] + damagesLow[i][1];
                total_damage_max += damages[i][0] + damages[i][1];
                item.set(damage_keys[i], damagesLow[i][0]+"-"+damagesLow[i][1]+"\u279c"+damages[i][0]+"-"+damages[i][1]);
            }
            total_damage_min = total_damage_min / 2;
            total_damage_max = total_damage_max / 2;
            item.set("basedps", [total_damage_min, total_damage_max]);
        }
    } else if (item.get("category") === "armor") { 
    }

    let display_commands = item_display_commands;

    // Clear the parent div.
    setHTML(parent_id, "");
    let parent_div = document.getElementById(parent_id);
    
    let active_elem;
    let fix_id = item.has("fixID") && item.get("fixID");
    let elemental_format = false;
    for (let i = 0; i < display_commands.length; i++) {
        const command = display_commands[i];
        if (command.charAt(0) === "#") {
            if (command === "#cdiv") {
                active_elem = document.createElement('div');
                active_elem.classList.add('center');
            }
            else if (command === "#ldiv") {
                active_elem = document.createElement('div');
                active_elem.classList.add('left');
            }
            else if (command === "#table") {
                active_elem = document.createElement('table');
                active_elem.style.width = "100%";
            }
            
            active_elem.classList.add('item-margin');
            parent_div.appendChild(active_elem);
        }
        else if (command.charAt(0) === "!") {
            // TODO: This is sooo incredibly janky.....
            if (command === "!elemental") {
                elemental_format = !elemental_format;
            } 
        }
        else {
            let id = command; 
            if(nonRolledIDs.includes(id)){//nonRolledID & non-0/non-null/non-und ID
                if (!item.get(id)) {
                    if (! (item.get("crafted") && skp_order.includes(id) && 
                            (item.get("maxRolls").get(id) || item.get("minRolls").get(id)))) {
                        continue;
                    }
                }
                if (id === "slots") {
                    let p_elem = document.createElement("p");
                    p_elem.classList.add('itemp')
                    // PROPER POWDER DISPLAYING
                    let numerals = new Map([[1, "I"], [2, "II"], [3, "III"], [4, "IV"], [5, "V"], [6, "VI"]]);

                    let powderPrefix = document.createElement("b");
                    powderPrefix.classList.add("powderLeft"); powderPrefix.classList.add("left");
                    powderPrefix.textContent = "Powder Slots: " + item.get(id) + " [";
                    p_elem.appendChild(powderPrefix);
                    
                    let powders = item.get("powders");
                    for (let i = 0; i < powders.length; i++) {
                        let powder = document.createElement("b");
                        powder.textContent = numerals.get((powders[i]%6)+1)+" ";
                        powder.classList.add(damageClasses[Math.floor(powders[i]/6)+1]+"_powder");
                        p_elem.appendChild(powder);
                    }

                    let powderSuffix = document.createElement("b");
                    powderSuffix.classList.add("powderRight"); powderSuffix.classList.add("left"); 
                    powderSuffix.textContent = "]";
                    p_elem.appendChild(powderSuffix);
                    active_elem.appendChild(p_elem);
                } else if (id === "set") {
                    if (item.get("hideSet")) { continue; }

                    let p_elem = document.createElement("p");
                    p_elem.classList.add("itemp");
                    p_elem.textContent = "Set: " + item.get(id).toString();
                    active_elem.appendChild(p_elem);
                } else if (id === "majorIds") {
                    console.log(item.get(id));
                    for (let majorID of item.get(id)) {
                        let p_elem = document.createElement("p");
                        p_elem.classList.add("itemp");

                        let title_elem = document.createElement("b");
                        let b_elem = document.createElement("b");
                        if (majorID.includes(":")) {   
                            let name = majorID.substring(0, majorID.indexOf(":")+1);
                            let mid = majorID.substring(majorID.indexOf(":")+1);
                            if (name.charAt(0) !== "+") {name = "+" + name}
                            title_elem.classList.add("Legendary");
                            title_elem.textContent = name;
                            b_elem.classList.add("Crafted");
                            b_elem.textContent = mid;
                            p_elem.appendChild(title_elem);
                            p_elem.appendChild(b_elem);
                        } else {
                            let name = item.get(id).toString()
                            if (name.charAt(0) !== "+") {name = "+" + name}
                            b_elem.classList.add("Legendary");
                            b_elem.textContent = name;
                            p_elem.appendChild(b_elem);
                        }
                        active_elem.appendChild(p_elem);
                    }
                } else if (id === "lvl" && item.get("tier") === "Crafted") {
                    let p_elem = document.createElement("p");
                    p_elem.classList.add("itemp");
                    p_elem.textContent = "Combat Level Min: " + item.get("lvlLow") + "-" + item.get(id);
                    active_elem.appendChild(p_elem);
                } else if (id === "displayName") {
                    let p_elem = document.createElement("a");
                    p_elem.classList.add('itemp');
                    p_elem.classList.add("smalltitle");
                    p_elem.classList.add(item.has("tier") ? item.get("tier").replace(" ","") : "none");
                    
                    if (item.get("custom")) {
                        // p_elem.href = url_base.replace(/\w+.html/, "") + "customizer.html#" + item.get("hash");
                        p_elem.textContent = item.get("displayName");
                    } else if (item.get("crafted")) {
                        // p_elem.href = url_base.replace(/\w+.html/, "") + "crafter.html#" + item.get("hash");
                        p_elem.textContent = item.get(id);
                    } else {
                        // p_elem.href = url_base.replace(/\w+.html/, "") + "item.html#" + item.get("displayName");
                        p_elem.textContent = item.get("displayName");
                    }

                    p_elem.target = "_blank";
                    active_elem.appendChild(p_elem);
                    let img = document.createElement("img");
                    if (item && item.has("type")) {
                        img.src = "./media/items/" + (newIcons ? "new/":"old/") + "generic-" + item.get("type") + ".png";
                        img.alt = item.get("type");
                        if (mini) {
                            img.style = " z=index: 1;max-width: 32px; max-height: 32px; position: relative; top: 50%; transform: translateY(-50%);";
                        } else {
                            img.style = " z=index: 1;max-width: 48px; max-height: 48px; position: relative; top: 50%; transform: translateY(-50%);";
                        }
                        let bckgrd = document.createElement("p");
                        if  (mini) {
                            bckgrd.style = "width: 48px; height: 48px; border-radius: 50%;background-image: radial-gradient(closest-side, " + colorMap.get(item.get("tier")) + " 20%," + "#121516 80%); margin-left: auto; margin-right: auto;"
                        } else {
                            bckgrd.style = "width: 64px; height: 64px; border-radius: 50%;background-image: radial-gradient(closest-side, " + colorMap.get(item.get("tier")) + " 20%," + "#121516 80%); margin-left: auto; margin-right: auto;"
                        }
                        bckgrd.classList.add("center");
                        bckgrd.classList.add("itemp");
                        active_elem.appendChild(bckgrd);
                        bckgrd.appendChild(img);
                    }
                } else {
                    let p_elem;
                    if ( !(item.get("tier") === "Crafted" && item.get("category") === "armor" && id === "hp") && (!skp_order.includes(id)) || (skp_order.includes(id) && item.get("tier") !== "Crafted" && active_elem.nodeName === "DIV") ) { //skp warp
                        p_elem = displaysq2FixedID(active_elem, id, item.get(id), elemental_format);
                    } else if (item.get("tier") === "Crafted" && item.get("category") === "armor" && id === "hp") {
                        p_elem = displaysq2FixedID(active_elem, id, item.get(id+"Low")+"-"+item.get(id), elemental_format);
                    }
                    if (id === "lore") {
                        p_elem.style = "font-style: italic";
                        p_elem.classList.add("lore");
                    } else if (skp_order.includes(id)) { //id = str, dex, int, def, or agi
                        if ( item.get("tier") !== "Crafted" && active_elem.nodeName === "DIV") {
                            p_elem.textContent = "";
                            p_elem.classList.add("itemp");
                            row = document.createElement("p");
                            row.classList.add("left");
                            
                            let title = document.createElement("b");
                            title.textContent = idPrefixes[id] + " ";
                            let boost = document.createElement("b");
                            if (item.get(id) < 0) {
                                boost.classList.add("negative");
                            } else { //boost = 0 SHOULD not come up
                                boost.classList.add("positive");
                            }
                            boost.textContent = item.get(id);
                            row.appendChild(title);
                            row.appendChild(boost);
                            p_elem.appendChild(row);
                        } else if ( item.get("tier") === "Crafted" && active_elem.nodeName === "TABLE") {
                            let row = displaysq2RolledID(item, id, elemental_format);
                            active_elem.appendChild(row);
                        }
                    } else if (id === "restrict") {
                        p_elem.classList.add("restrict");
                    }
                }
            }
            else if ( rolledIDs.includes(id) &&
                        ((item.get("maxRolls") && item.get("maxRolls").get(id))
                        || (item.get("minRolls") && item.get("minRolls").get(id)))) {
                let style = "positive";
                if (item.get("minRolls").get(id) < 0) {
                    style = "negative";
                }
                if(reversedIDs.includes(id)){
                    style === "positive" ? style = "negative" : style = "positive"; 
                }
                if (fix_id) {
                    displaysq2FixedID(active_elem, id, item.get("minRolls").get(id), elemental_format, style);
                }
                else {
                    let row = displaysq2RolledID(item, id, elemental_format);
                    active_elem.appendChild(row);
                }
            }else{
              // :/  
            }
        }
    }
    //Show powder specials ;-;
    let nonConsumables = ["relik", "wand", "bow", "spear", "dagger", "chestplate", "helmet", "leggings", "boots", "ring", "bracelet", "necklace"];
    if(nonConsumables.includes(item.get("type"))) {
        let powder_special = document.createElement("p");
        powder_special.classList.add("left");
        let powders = item.get("powders");
        let element = "";
        let power = 0;
        for (let i = 0; i < powders.length; i++) {
            let firstPowderType = skp_elements[Math.floor(powders[i]/6)];
            if (element !== "") break;
            else if (powders[i]%6 > 2) { //t4+
                for (let j = i+1; j < powders.length; j++) {
                    let currentPowderType = skp_elements[Math.floor(powders[j]/6)]
                    if (powders[j] % 6 > 2 && firstPowderType === currentPowderType) {
                        element = currentPowderType;
                        power = Math.round(((powders[i] % 6 + powders[j] % 6 + 2) / 2 - 4) * 2);
                        break;
                    }
                }
            }
        }
        if (element !== "") {//powder special is "[e,t,w,f,a]+[0,1,2,3,4]"
            let powderSpecial = powderSpecialStats[ skp_elements.indexOf(element)];
            let specialSuffixes = new Map([ ["Duration", " sec"], ["Radius", " blocks"], ["Chains", ""], ["Damage", "%"], ["Damage Boost", "%"], ["Knockback", " blocks"] ]);
            let specialTitle = document.createElement("p");
            let specialEffects = document.createElement("p");
            addClasses(specialTitle, ["left", "itemp", damageClasses[skp_elements.indexOf(element) + 1]]);
            addClasses(specialEffects, ["left", "itemp", "nocolor"]);
            let effects;
            if (item.get("category") === "weapon") {//weapon
                effects = powderSpecial["weaponSpecialEffects"];
                specialTitle.textContent = powderSpecial["weaponSpecialName"];
            }else if (item.get("category") === "armor") {//armor
                effects = powderSpecial["armorSpecialEffects"];
                specialTitle.textContent += powderSpecial["armorSpecialName"] + ": ";
            }
            for (const [key,value] of effects.entries()) {
                if (key !== "Description") {
                    let effect = document.createElement("p");
                    effect.classList.add("itemp");
                    effect.textContent = key + ": " + value[power] + specialSuffixes.get(key);
                    if(key === "Damage"){
                        effect.textContent += elementIcons[skp_elements.indexOf(element)];
                    }
                    if (element === "w" && item.get("category") === "armor") {
                        effect.textContent += " / Mana Used";
                    }
                    specialEffects.appendChild(effect);
                }else{
                    specialTitle.textContent += "[ " + effects.get("Description") + " ]"; 
                }
            }
            powder_special.appendChild(specialTitle);
            powder_special.appendChild(specialEffects);
            parent_div.appendChild(powder_special);
        }
    }
    
    if(item.get("tier") && item.get("tier") === "Crafted") {
        let dura_elem = document.createElement("p");
        dura_elem.classList.add("itemp");
        let dura = [];
        let suffix = "";
        if(nonConsumables.includes(item.get("type"))) {
            dura = item.get("durability");
            dura_elem.textContent = "Durability: "
        } else {
            dura = item.get("duration");
            dura_elem.textContent = "Duration: "
            suffix = " sec."
            let charges = document.createElement("b");
            charges.textContent = "Charges: " + item.get("charges");
            charges.classList.add("spaceleft");
            active_elem.appendChild(charges);
        }

        if (typeof(dura) === "string") {
            dura_elem.textContent += dura + suffix;
        } else {
            dura_elem.textContent += dura[0]+"-"+dura[1] + suffix;
        }
        active_elem.append(dura_elem);

    }
    //Show item tier
    if (item.get("tier") && item.get("tier") !== " ") {
        let item_desc_elem = document.createElement("p");
        item_desc_elem.classList.add('itemp');
        item_desc_elem.classList.add(item.get("tier"));
        item_desc_elem.textContent = item.get("tier")+" "+item.get("type");
        active_elem.append(item_desc_elem);
    }

    //Show item hash if applicable
    if (item.get("crafted") || item.get("custom")) {
        let item_desc_elem = document.createElement("p");
        item_desc_elem.classList.add('itemp');
        item_desc_elem.style.maxWidth = "100%";
        item_desc_elem.style.wordWrap = "break-word";
        item_desc_elem.style.wordBreak = "break-word";
        item_desc_elem.textContent = item.get("hash");
        active_elem.append(item_desc_elem);
    }

    if (item.get("category") === "weapon") { 
        let damage_mult = baseDamageMultiplier[attackSpeeds.indexOf(item.get("atkSpd"))];
        let total_damages = item.get("basedps");
        let base_dps_elem = document.createElement("p");
        base_dps_elem.classList.add("left");
        base_dps_elem.classList.add("itemp");
        if (item.get("tier") === "Crafted") {
            let base_dps_min = total_damages[0] * damage_mult;
            let base_dps_max = total_damages[1] * damage_mult;

            base_dps_elem.textContent = "Base DPS: "+base_dps_min.toFixed(3)+"\u279c"+base_dps_max.toFixed(3);
        }
        else {
            base_dps_elem.textContent = "Base DPS: "+(total_damages * damage_mult);
        }
        parent_div.appendChild(document.createElement("p"));
        parent_div.appendChild(base_dps_elem);
    }
}

function displaysq2RolledID(item, id, elemental_format) {
    let row = document.createElement('tr');
    let min_elem = document.createElement('td');
    min_elem.classList.add('shaded-table');
    min_elem.classList.add('left');
    let id_min = item.get("minRolls").get(id)
    let style = id_min < 0 ? "negative" : "positive";
    if(reversedIDs.includes(id)){
        style === "positive" ? style = "negative" : style = "positive"; 
    }
    min_elem.classList.add(style);
    min_elem.textContent = id_min + idSuffixes[id];
    row.appendChild(min_elem);

    let desc_elem = document.createElement('td');
    desc_elem.classList.add('center');
    desc_elem.classList.add('shaded-table')
    //TODO elemental format jank
    if (elemental_format) {
        apply_elemental_format(desc_elem, id);
    }
    else {
        desc_elem.textContent = idPrefixes[id];
    }
    row.appendChild(desc_elem);

    let max_elem = document.createElement('td');
    let id_max = item.get("maxRolls").get(id)
    max_elem.classList.add('right');
    max_elem.classList.add('shaded-table')
    style = id_max < 0 ? "negative" : "positive";
    if(reversedIDs.includes(id)){
        style === "positive" ? style = "negative" : style = "positive"; 
    }
    max_elem.classList.add(style);
    max_elem.textContent = id_max + idSuffixes[id];
    row.appendChild(max_elem);
    return row;
}

function displaysq2WeaponBase(build) {
    // let base_damage = build.get('damageRaw');
    let damage_keys = [ "nDam", "eDam", "tDam", "wDam", "fDam", "aDam" ];

    // pP base calc (why do i still use pP)
    let item = build.weapon;
    let stats = new Map();
    stats.set("atkSpd", item.get("atkSpd"));
    stats.set("damageBonus", [0, 0, 0, 0, 0]);
    stats.set("damageRaw", [item.get("nDam"), item.get("eDam"), item.get("tDam"), item.get("wDam"), item.get("fDam"), item.get("aDam")]);

    let results = calculateSpellDamage(stats, [100, 0, 0, 0, 0, 0], 0, 0, 0, build.weapon, [0, 0, 0, 0, 0], 1, undefined);
    let powdered_base = results[2];

    const powdered_map = new Map();
    powdered_map.set('nDam', powdered_base[0][0]+'-'+powdered_base[0][1]);
    powdered_map.set('eDam', powdered_base[1][0]+'-'+powdered_base[1][1]);
    powdered_map.set('tDam', powdered_base[2][0]+'-'+powdered_base[2][1]);
    powdered_map.set('wDam', powdered_base[3][0]+'-'+powdered_base[3][1]);
    powdered_map.set('fDam', powdered_base[4][0]+'-'+powdered_base[4][1]);
    powdered_map.set('aDam', powdered_base[5][0]+'-'+powdered_base[5][1]);

    // display
    for (const i in damage_keys) {
        document.getElementById(damage_keys[i]+"-base").textContent = powdered_map.get(damage_keys[i]);
    }
}

function displaysq2FixedID(active, id, value, elemental_format, style) {
    if (style) {
        let row = document.createElement('div');
        row.classList.add("row");
        let desc_elem = document.createElement('div');
        desc_elem.classList.add('col');
        desc_elem.classList.add('text-start');

        if (elemental_format) {
            apply_elemental_format(desc_elem, id);
        }
        else {
            desc_elem.textContent = idPrefixes[id];
        }
        row.appendChild(desc_elem);

        let value_elem = document.createElement('div');
        value_elem.classList.add('col');
        value_elem.classList.add('text-end');
        value_elem.classList.add(style);
        value_elem.textContent = value + idSuffixes[id];
        row.appendChild(value_elem);
        active.appendChild(row);
        return row;
    }
    else {
        // HACK TO AVOID DISPLAYING ZERO DAMAGE! TODO
        if (value === "0-0" || value === "0-0\u279c0-0") {
            return;
        }
        let p_elem = document.createElement('p');
        p_elem.classList.add('itemp');
        if (elemental_format) {
            apply_elemental_format(p_elem, id, value);
        }
        else {
            p_elem.textContent = idPrefixes[id].concat(value, idSuffixes[id]);
        }
        active.appendChild(p_elem);
        return p_elem;
    }
}

function displaysq2PoisonDamage(overallparent_elem, build) {
    overallparent_elem.textContent = "";

    //Title
    let title_elemavg = document.createElement("b");
    title_elemavg.textContent = "Poison Stats";
    overallparent_elem.append(title_elemavg);

    let overallpoisonDamage = document.createElement("p");
    let overallpoisonDamageFirst = document.createElement("span");
    let overallpoisonDamageSecond = document.createElement("span");
    let poison_tick = Math.ceil(build.statMap.get("poison") * (1+skillPointsToPercentage(build.total_skillpoints[0])) * (build.statMap.get("poisonPct") + build.externalStats.get("poisonPct"))/100 /3);
    overallpoisonDamageFirst.textContent = "Poison Tick: ";
    overallpoisonDamageSecond.textContent = Math.max(poison_tick,0);
    overallpoisonDamageSecond.classList.add("Damage");

    overallpoisonDamage.appendChild(overallpoisonDamageFirst);
    overallpoisonDamage.appendChild(overallpoisonDamageSecond);
    overallparent_elem.append(overallpoisonDamage);
}

function displaysq2MeleeDamage(parent_elem, overallparent_elem, meleeStats){
    // console.log("Melee Stats");
    // console.log(meleeStats);
    let tooltipinfo = meleeStats[13];
    let attackSpeeds = ["Super Slow", "Very Slow", "Slow", "Normal", "Fast", "Very Fast", "Super Fast"];
    //let damagePrefixes = ["Neutral Damage: ","Earth Damage: ","Thunder Damage: ","Water Damage: ","Fire Damage: ","Air Damage: "];
    parent_elem.textContent = "";
    overallparent_elem.textContent = "";
    const stats = meleeStats.slice();
    
    for (let i = 0; i < 6; ++i) {
        for (let j in stats[i]) {
            stats[i][j] = stats[i][j].toFixed(2);
        }
    }
    for (let i = 6; i < 8; ++i) {
        for (let j = 0; j < 2; j++) {
            stats[i][j] = stats[i][j].toFixed(2);
        }
    }
    for (let i = 8; i < 11; ++i){
        stats[i] = stats[i].toFixed(2);
    }
    //tooltipelem, tooltiptext
    let tooltip; let tooltiptext;
    
    //title
    let title_elem = document.createElement("p");
    title_elem.classList.add("title");
    title_elem.textContent = "Melee Stats";
    parent_elem.append(title_elem);
    parent_elem.append(document.createElement("br"));

    //overall title
    let title_elemavg = document.createElement("b");
    title_elemavg.textContent = "Melee Stats";
    overallparent_elem.append(title_elemavg);
    
    //average DPS
    let averageDamage = document.createElement("p");
    averageDamage.classList.add("left");
    averageDamage.textContent = "Average DPS: " + stats[10];
    tooltiptext = `= ((${stats[8]} * ${(stats[6][2]).toFixed(2)}) + (${stats[9]} * ${(stats[7][2]).toFixed(2)}))`
    tooltip = createTooltip(tooltip, "p", tooltiptext, averageDamage, ["melee-tooltip"]);
    averageDamage.appendChild(tooltip);
    parent_elem.append(averageDamage);

    //overall average DPS
    let overallaverageDamage = document.createElement("p");
    let overallaverageDamageFirst = document.createElement("span");
    overallaverageDamageFirst.textContent = "Average DPS: "

    let overallaverageDamageSecond = document.createElement("span");
    overallaverageDamageSecond.classList.add("Damage");
    overallaverageDamageSecond.textContent = stats[10];
    overallaverageDamage.appendChild(overallaverageDamageFirst);
    overallaverageDamage.appendChild(overallaverageDamageSecond);

    overallparent_elem.append(overallaverageDamage);
    //overallparent_elem.append(document.createElement("br"));

    //attack speed
    let atkSpd = document.createElement("p");
    atkSpd.classList.add("left");
    atkSpd.textContent = "Attack Speed: " + attackSpeeds[stats[11]];
    parent_elem.append(atkSpd);
    parent_elem.append(document.createElement("br"));

    //overall attack speed
    let overallatkSpd = document.createElement("p");
    let overallatkSpdFirst = document.createElement("span");
    overallatkSpdFirst.textContent = "Attack Speed: ";
    let overallatkSpdSecond = document.createElement("span");
    overallatkSpdSecond.classList.add("Damage");
    overallatkSpdSecond.textContent =  attackSpeeds[stats[11]];
    overallatkSpd.appendChild(overallatkSpdFirst);
    overallatkSpd.appendChild(overallatkSpdSecond);
    overallparent_elem.append(overallatkSpd);

    //Non-Crit: n->elem, total dmg, DPS
    let nonCritStats = document.createElement("p");
    nonCritStats.classList.add("left");
    nonCritStats.textContent = "Non-Crit Stats: ";
    nonCritStats.append(document.createElement("br"));
    for (let i = 0; i < 6; i++){
        if(stats[i][1] != 0){
            let dmg = document.createElement("p");
            dmg.textContent = stats[i][0] + " \u2013 " + stats[i][1];
            dmg.classList.add(damageClasses[i]);
            dmg.classList.add("itemp");
            tooltiptext = tooltipinfo.get("damageformulas")[i].slice(0,2).join("\n");
            tooltip = createTooltip(tooltip, "p", tooltiptext, dmg, ["melee-tooltip"]);
            nonCritStats.append(dmg);
        }
    }

    let normalDamage = document.createElement("p");
    normalDamage.textContent = "Total: " + stats[6][0] + " \u2013 " + stats[6][1];
    let tooltiparr = ["Min: = ", "Max: = "]
    let arr = []; let arr2 = [];
    for (let i = 0; i < 6; i++) {
        if (stats[i][0] != 0) {
            arr.push(stats[i][0]);
            arr2.push(stats[i][1]);
        }
    }
    tooltiptext = tooltiparr[0] + arr.join(" + ") + "\n" + tooltiparr[1] + arr2.join(" + ");
    tooltip = createTooltip(tooltip, "p", tooltiptext, normalDamage, ["melee-tooltip"]);
    nonCritStats.append(normalDamage);

    let normalDPS = document.createElement("p");
    normalDPS.textContent = "Normal DPS: " + stats[8];
    normalDPS.classList.add("tooltip");
    tooltiptext = ` = ((${stats[6][0]} + ${stats[6][1]}) / 2) * ${baseDamageMultiplier[stats[11]]}`;
    tooltip = createTooltip(tooltip, "p", tooltiptext, normalDPS, ["melee-tooltip"]);
    nonCritStats.append(normalDPS);

    //overall average DPS
    let singleHitDamage = document.createElement("p");
    let singleHitDamageFirst = document.createElement("span");
    singleHitDamageFirst.textContent = "Single Hit Average: ";
    let singleHitDamageSecond = document.createElement("span");
    singleHitDamageSecond.classList.add("Damage");
    singleHitDamageSecond.textContent = stats[12].toFixed(2);
    tooltiptext = ` = ((${stats[6][0]} + ${stats[6][1]}) / 2) * ${stats[6][2].toFixed(2)} + ((${stats[7][0]} + ${stats[7][1]}) / 2) * ${stats[7][2].toFixed(2)}`;
    // tooltip = createTooltip(tooltip, "p", tooltiptext, singleHitDamage, ["melee-tooltip", "summary-tooltip"]);

    singleHitDamage.appendChild(singleHitDamageFirst);
    singleHitDamage.appendChild(singleHitDamageSecond);
    overallparent_elem.append(singleHitDamage);
    
    let normalChance = document.createElement("p");
    normalChance.textContent = "Non-Crit Chance: " + (stats[6][2]*100).toFixed(2) + "%"; 
    normalChance.append(document.createElement("br"));
    normalChance.append(document.createElement("br"));
    nonCritStats.append(normalChance);

    parent_elem.append(nonCritStats);
    parent_elem.append(document.createElement("br"));

    //Crit: n->elem, total dmg, DPS
    let critStats = document.createElement("p");
    critStats.classList.add("left");
    critStats.textContent = "Crit Stats: ";
    critStats.append(document.createElement("br"));
    for (let i = 0; i < 6; i++){
        if(stats[i][3] != 0) {
            dmg = document.createElement("p");
            dmg.textContent = stats[i][2] + " \u2013 " + stats[i][3];
            dmg.classList.add(damageClasses[i]);
            dmg.classList.add("itemp");
            tooltiptext = tooltipinfo.get("damageformulas")[i].slice(2,4).join("\n");
            tooltip = createTooltip(tooltip, "p", tooltiptext, dmg, ["melee-tooltip"]);
            critStats.append(dmg);
        }
    }
    let critDamage = document.createElement("p");
    critDamage.textContent = "Total: " + stats[7][0] + " \u2013 " + stats[7][1];
    tooltiparr = ["Min: = ", "Max: = "]
    arr = []; arr2 = [];
    for (let i = 0; i < 6; i++) {
        if (stats[i][0] != 0) {
            arr.push(stats[i][2]);
            arr2.push(stats[i][3]);
        }
    }
    tooltiptext = tooltiparr[0] + arr.join(" + ") + "\n" + tooltiparr[1] + arr2.join(" + ");
    tooltip = createTooltip(tooltip, "p", tooltiptext, critDamage, ["melee-tooltip"]);
    
    critStats.append(critDamage);

    let critDPS = document.createElement("p");
    critDPS.textContent = "Crit DPS: " + stats[9];
    tooltiptext = ` = ((${stats[7][0]} + ${stats[7][1]}) / 2) * ${baseDamageMultiplier[stats[11]]}`;
    tooltip = createTooltip(tooltip, "p", tooltiptext, critDPS, ["melee-tooltip"]);
    critStats.append(critDPS);

    let critChance = document.createElement("p");
    critChance.textContent = "Crit Chance: " + (stats[7][2]*100).toFixed(2) + "%";
    critChance.append(document.createElement("br"));
    critChance.append(document.createElement("br"));
    critStats.append(critChance);

    parent_elem.append(critStats);
}

function displaysq2ArmorStats(build) {
    let armor_keys = ['helmet', 'chestplate', 'leggings', 'boots', 'ring1', 'ring2', 'bracelet', 'necklace'];

    for (const i in armor_keys) {
        document.getElementById(armor_keys[i]+'-health').textContent = build[armor_keys[i]].get('hp');
        document.getElementById(armor_keys[i]+'-lv').textContent = build[armor_keys[i]].get('lvl');
    }
}

function displaysq2DefenseStats(parent_elem, build, insertSummary){
    let defenseStats = build.getDefenseStats();
    insertSummary = (typeof insertSummary !== 'undefined') ? insertSummary : false;
    if (!insertSummary) {
        parent_elem.textContent = "";
    }
    const stats = defenseStats.slice();    

    // parent_elem.append(document.createElement("br"));
    let statsTable = document.createElement("div");

    //[total hp, ehp, total hpr, ehpr, [def%, agi%], [edef,tdef,wdef,fdef,adef]]
    for(const i in stats){
        if(typeof stats[i] === "number"){
            stats[i] = stats[i].toFixed(2);
        }else{
            for(const j in stats[i]){
                stats[i][j] = stats[i][j].toFixed(2);
            }
        }
    }
    
    //total HP
    let hpRow = document.createElement("div");
    hpRow.classList.add('row');
    let hp = document.createElement("div");
    hp.classList.add('col');
    hp.classList.add("Health");
    hp.classList.add("text-start");
    hp.textContent = "Total HP:";  
    let boost = document.createElement("div");
    boost.classList.add('col');
    boost.textContent = stats[0];
    boost.classList.add("text-end");
    
    hpRow.appendChild(hp);
    hpRow.append(boost);

    if (insertSummary) {
        parent_elem.appendChild(hpRow);
    } else {
        statsTable.appendChild(hpRow);
    }

    let tooltip; let tooltiptext;

    let defMult = build.statMap.get("defMult");
    if (!defMult) {defMult = 1}

    //EHP
    let ehpRow = document.createElement("div");
    ehpRow.classList.add("row");
    let ehp = document.createElement("div");
    ehp.classList.add("col");
    ehp.classList.add("text-start");
    ehp.textContent = "Effective HP:";

    boost = document.createElement("div");
    boost.textContent = stats[1][0];
    boost.classList.add("col");
    boost.classList.add("text-end");
    tooltiptext = `= ${stats[0]} / ((1 - ${skillPointsToPercentage(build.total_skillpoints[3]).toFixed(3)}) * (1 - ${skillPointsToPercentage(build.total_skillpoints[4]).toFixed(3)}) * (2 - ${defMult}) * (2 - ${build.defenseMultiplier}))`
    // tooltip = createTooltip(tooltip, "p", tooltiptext, boost, ["def-tooltip"]);

    ehpRow.appendChild(ehp);
    ehpRow.append(boost);

    if (insertSummary) {
        parent_elem.appendChild(ehpRow)
    } else {
        statsTable.append(ehpRow);
    }

    ehpRow = document.createElement("div");
    ehpRow.classList.add("row");
    ehp = document.createElement("div");
    ehp.classList.add("col");
    ehp.classList.add("text-start");
    ehp.textContent = "Effective HP (no agi):";

    boost = document.createElement("div");
    boost.textContent = stats[1][1];
    boost.classList.add("col");
    boost.classList.add("text-end");
    tooltiptext = `= ${stats[0]} / ((1 - ${skillPointsToPercentage(build.total_skillpoints[3]).toFixed(3)}) * (2 - ${defMult}) * (2 - ${build.defenseMultiplier}))`
    // tooltip = createTooltip(tooltip, "p", tooltiptext, boost, ["def-tooltip"]);

    ehpRow.appendChild(ehp);
    ehpRow.append(boost);
    statsTable.append(ehpRow);

    //total HPR
    let hprRow = document.createElement("div");
    hprRow.classList.add("row")
    let hpr = document.createElement("div");
    hpr.classList.add("Health");
    hpr.classList.add("col");
    hpr.classList.add("text-start");
    hpr.textContent = "HP Regen (Total):";
    boost = document.createElement("div");
    boost.textContent = stats[2];
    boost.classList.add("col");
    boost.classList.add("text-end");

    hprRow.appendChild(hpr);
    hprRow.appendChild(boost);

    if (insertSummary) {
        parent_elem.appendChild(hprRow);
    } else {
        statsTable.appendChild(hprRow);
    }

    //EHPR
    let ehprRow = document.createElement("div");
    ehprRow.classList.add("row")
    let ehpr = document.createElement("div");
    ehpr.classList.add("col");
    ehpr.classList.add("text-start");
    ehpr.textContent = "Effective HP Regen:";

    boost = document.createElement("div");
    boost.textContent = stats[3][0];
    boost.classList.add("col");
    boost.classList.add("text-end");
    tooltiptext = `= ${stats[2]} / ((1 - ${skillPointsToPercentage(build.total_skillpoints[3]).toFixed(3)}) * (1 - ${skillPointsToPercentage(build.total_skillpoints[4]).toFixed(3)}) * (2 - ${defMult}) * (2 - ${build.defenseMultiplier}))`
    // tooltip = createTooltip(tooltip, "p", tooltiptext, boost, ["def-tooltip"]);

    ehprRow.appendChild(ehpr);
    ehprRow.append(boost);
    statsTable.append(ehprRow);
    /*
    ehprRow = document.createElement("tr");
    ehpr = document.createElement("td");
    ehpr.classList.add("left");
    ehpr.textContent = "Effective HP Regen (no agi):";

    boost = document.createElement("td");
    boost.textContent = stats[3][1];
    boost.classList.add("right");

    ehprRow.appendChild(ehpr);
    ehprRow.append(boost);
    statsTable.append(ehprRow); */

    //eledefs
    let eledefs = stats[5];
    for (let i = 0; i < eledefs.length; i++){
        let eledefElemRow = document.createElement("div");
        eledefElemRow.classList.add("row")

        let eledef = document.createElement("div");
        eledef.classList.add("col");
        eledef.classList.add("text-start");
        let eledefTitle = document.createElement("span");
        eledefTitle.textContent = damageClasses[i+1];
        eledefTitle.classList.add(damageClasses[i+1]);

        let defense = document.createElement("span");
        defense.textContent = " Def (Total): ";

        eledef.appendChild(eledefTitle);
        eledef.appendChild(defense);
        eledefElemRow.appendChild(eledef);

        let boost = document.createElement("div");
        boost.textContent = eledefs[i];
        boost.classList.add(eledefs[i] >= 0 ? "positive" : "negative");
        boost.classList.add("col");
        boost.classList.add("text-end");

        let defRaw = build.statMap.get("defRaw")[i];
        let defPct = build.statMap.get("defBonus")[i]/100;
        if (defRaw < 0) {
            defPct >= 0 ? defPct = "- " + defPct: defPct = "+ " + defPct;
            tooltiptext = `= min(0, ${defRaw} * (1 ${defPct}))`
        } else {
            defPct >= 0 ? defPct = "+ " + defPct: defPct = "- " + defPct;
            tooltiptext = `= ${defRaw} * (1 ${defPct})`
        }
        // tooltip = createTooltip(tooltip, "p", tooltiptext, boost, ["def-tooltip"]);

        eledefElemRow.appendChild(boost);
        
        if (insertSummary) {
            parent_elem.appendChild(eledefElemRow);
        } else {
            statsTable.appendChild(eledefElemRow);
        }
    }

    if (!insertSummary) {
        //skp
        let defRow = document.createElement("div");
        defRow.classList.add("row");
        let defElem = document.createElement("div");
        defElem.classList.add("col");
        defElem.classList.add("text-start");
        defElem.textContent = "Damage Absorbed %:";
        boost = document.createElement("div");
        boost.classList.add("col");
        boost.classList.add("text-end");
        boost.textContent = stats[4][0] + "%";
        defRow.appendChild(defElem);
        defRow.appendChild(boost);
        statsTable.append(defRow);

        let agiRow = document.createElement("div");
        agiRow.classList.add("row");
        let agiElem = document.createElement("div");
        agiElem.classList.add("col");
        agiElem.classList.add("text-start");
        agiElem.textContent = "Dodge Chance %:";
        boost = document.createElement("div");
        boost.classList.add("col");
        boost.classList.add("text-end");
        boost.textContent = stats[4][1] + "%";
        agiRow.appendChild(agiElem);
        agiRow.appendChild(boost);
        statsTable.append(agiRow);
    }

    if (!insertSummary) {
        parent_elem.append(statsTable);
    }
}

function displaysq2PowderSpecials(parent_elem, powderSpecials, build) {
    parent_elem.textContent = "Powder Specials";
    let specials = powderSpecials.slice();
    let stats = build.statMap;
    let expandedStats = new Map();
    //each entry of powderSpecials is [ps, power]
    for (special of specials) {
        //iterate through the special and display its effects.
        let powder_special = document.createElement("p");
        powder_special.classList.add("left");
        let specialSuffixes = new Map([ ["Duration", " sec"], ["Radius", " blocks"], ["Chains", ""], ["Damage", "%"], ["Damage Boost", "%"], ["Knockback", " blocks"] ]);
        let specialTitle = document.createElement("p");
        let specialEffects = document.createElement("p");
        specialTitle.classList.add("left");
        specialTitle.classList.add(damageClasses[powderSpecialStats.indexOf(special[0]) + 1]);
        specialEffects.classList.add("left");
        let effects = special[0]["weaponSpecialEffects"];
        let power = special[1];
        specialTitle.textContent = special[0]["weaponSpecialName"] + " " + Math.floor((power-1)*0.5 + 4) + (power % 2 == 0 ? ".5" : "");  
        for (const [key,value] of effects) {
            let effect = document.createElement("p");
            effect.classList.add("item-margin");
            effect.textContent += key + ": " + value[power-1] + specialSuffixes.get(key);
            if(key === "Damage"){
                effect.textContent += elementIcons[powderSpecialStats.indexOf(special[0])];
            }
            if(special[0]["weaponSpecialName"] === "Wind Prison" && key === "Damage Boost") {
                effect.textContent += " (only 1st hit)";
            }
            specialEffects.appendChild(effect);
        }

        powder_special.appendChild(specialTitle);
        powder_special.appendChild(specialEffects);

        //if this special is an instant-damage special (Quake, Chain Lightning, Courage Burst), display the damage.
        let specialDamage = document.createElement("p");
        // specialDamage.classList.add("item-margin");
        let spells = spell_table["powder"];
        if (powderSpecialStats.indexOf(special[0]) == 0 || powderSpecialStats.indexOf(special[0]) == 1 || powderSpecialStats.indexOf(special[0]) == 3) { //Quake, Chain Lightning, or Courage
            let spell = (powderSpecialStats.indexOf(special[0]) == 3 ? spells[2] : spells[powderSpecialStats.indexOf(special[0])]);
            let part = spell["parts"][0];
            let _results = calculateSpellDamage(stats, part.conversion,
                stats.get("mdRaw"), stats.get("mdPct") + build.externalStats.get("mdPct"), 
                0, build.weapon, build.total_skillpoints, build.damageMultiplier * ((part.multiplier[power-1] / 100)), build.externalStats);//part.multiplier[power] / 100

            let critChance = skillPointsToPercentage(build.total_skillpoints[1]);
            let save_damages = [];
            
            let totalDamNormal = _results[0];
            let totalDamCrit = _results[1];
            let results = _results[2];
            for (let i = 0; i < 6; ++i) {
                for (let j in results[i]) {
                    results[i][j] = results[i][j].toFixed(2);
                }
            }
            let nonCritAverage = (totalDamNormal[0]+totalDamNormal[1])/2 || 0;
            let critAverage = (totalDamCrit[0]+totalDamCrit[1])/2 || 0;
            let averageDamage = (1-critChance)*nonCritAverage+critChance*critAverage || 0;

            let averageLabel = document.createElement("p");
            averageLabel.textContent = "Average: "+averageDamage.toFixed(2);
            averageLabel.classList.add("damageSubtitle");
            averageLabel.classList.add("item-margin");
            specialDamage.append(averageLabel);


            let nonCritLabel = document.createElement("p");
            nonCritLabel.textContent = "Non-Crit Average: "+nonCritAverage.toFixed(2);
            nonCritLabel.classList.add("damageSubtitle");
            nonCritLabel.classList.add("item-margin");
            specialDamage.append(nonCritLabel);
            
            for (let i = 0; i < 6; i++){
                if (results[i][1] > 0){
                    let p = document.createElement("p");
                    p.classList.add("damagep");
                    p.classList.add(damageClasses[i]);
                    p.textContent = results[i][0]+"-"+results[i][1];
                    specialDamage.append(p);
                }
            }
            let normalDamage = document.createElement("p");
            normalDamage.textContent = "Total: " + totalDamNormal[0].toFixed(2) + "-" + totalDamNormal[1].toFixed(2);
            normalDamage.classList.add("itemp");
            specialDamage.append(normalDamage);

            let nonCritChanceLabel = document.createElement("p");
            nonCritChanceLabel.textContent = "Non-Crit Chance: " + ((1-critChance)*100).toFixed(2)  + "%";
            specialDamage.append(nonCritChanceLabel);

            let critLabel = document.createElement("p");
            critLabel.textContent = "Crit Average: "+critAverage.toFixed(2);
            critLabel.classList.add("damageSubtitle");
            critLabel.classList.add("item-margin");
            
            specialDamage.append(critLabel);
            for (let i = 0; i < 6; i++){
                if (results[i][1] > 0){
                    let p = document.createElement("p");
                    p.classList.add("damagep");
                    p.classList.add(damageClasses[i]);
                    p.textContent = results[i][2]+"-"+results[i][3];
                    specialDamage.append(p);
                }
            }
            let critDamage = document.createElement("p");
            critDamage.textContent = "Total: " + totalDamCrit[0].toFixed(2) + "-" + totalDamCrit[1].toFixed(2);
            critDamage.classList.add("itemp");
            specialDamage.append(critDamage);

            let critChanceLabel = document.createElement("p");
            critChanceLabel.textContent = "Crit Chance: " + (critChance*100).toFixed(2) + "%";
            specialDamage.append(critChanceLabel);

            save_damages.push(averageDamage);

            powder_special.append(specialDamage);
        } 

        parent_elem.appendChild(powder_special);
    }
}

function displaysq2SpellDamage(parent_elem, overallparent_elem, build, spell, spellIdx) {
    parent_elem.textContent = "";


    let tooltip; let tooltiptext;
    const stats = build.statMap;
    let title_elem = document.createElement("p");

    overallparent_elem.textContent = "";
    let title_elemavg = document.createElement("b");

    if (spellIdx != 0) {
        let first = document.createElement("span");
        first.textContent = spell.title + " (";
        title_elem.appendChild(first.cloneNode(true)); //cloneNode is needed here.
        title_elemavg.appendChild(first);

        let second = document.createElement("span");
        second.textContent = build.getSpellCost(spellIdx, spell.cost);
        second.classList.add("Mana");

        let int_redux = skillPointsToPercentage(build.total_skillpoints[2]).toFixed(2);
        let spPct_redux = (build.statMap.get("spPct" + spellIdx)/100).toFixed(2);
        let spRaw_redux = (build.statMap.get("spRaw" + spellIdx)).toFixed(2);
        spPct_redux >= 0 ? spPct_redux = "+ " + spPct_redux : spPct_redux = "- " + Math.abs(spPct_redux);
        spRaw_redux >= 0 ? spRaw_redux = "+ " + spRaw_redux : spRaw_redux = "- " + Math.abs(spRaw_redux);

        // tooltiptext = `= max(1, floor((ceil(${spell.cost} * (1 - ${int_redux})) ${spRaw_redux}) * (1 ${spPct_redux})))`;
        // tooltip = createTooltip(tooltip, "p", tooltiptext, second, ["spellcostcalc"]);
        // second.appendChild(tooltip);
        title_elem.appendChild(second.cloneNode(true));
        title_elemavg.appendChild(second);
        

        let third = document.createElement("p");
        third.classList.add('no-newline');
        third.textContent = ") [Base: " + build.getBaseSpellCost(spellIdx, spell.cost) + " ]";
        title_elem.appendChild(third);
        let third_summary = document.createElement("span");
        third_summary.textContent = ")";
        title_elemavg.appendChild(third_summary);
    }
    else {
        title_elem.textContent = spell.title;
        title_elemavg.textContent = spell.title;
    }

    parent_elem.append(title_elem);
    overallparent_elem.append(title_elemavg);

    let critChance = skillPointsToPercentage(build.total_skillpoints[1]);

    let save_damages = [];

    let part_divavg = document.createElement("p");
    overallparent_elem.append(part_divavg);

    let spell_parts;
    if (spell.parts) {
        spell_parts = spell.parts;
    }
    else {
        spell_parts = spell.variants.DEFAULT;
        for (const majorID of stats.get("activeMajorIDs")) {
            if (majorID in spell.variants) {
                spell_parts = spell.variants[majorID];
                break;
            }
        }
    }
    //console.log(spell_parts);

    for (const part of spell_parts) {
        // parent_elem.append(document.createElement("br"));
        let part_div = document.createElement("p");
        parent_elem.append(part_div);

        let subtitle_elem = document.createElement("p");
        subtitle_elem.textContent = part.subtitle;
        part_div.append(subtitle_elem);

        if (part.type === "damage") {
            //console.log(build.expandedStats);
            let _results = calculateSpellDamage(stats, part.conversion,
                                    stats.get("sdRaw") + stats.get("rainbowRaw"), stats.get("sdPct") + build.externalStats.get("sdPct"), 
                                    part.multiplier / 100, build.weapon, build.total_skillpoints, build.damageMultiplier, build.externalStats);
            let totalDamNormal = _results[0];
            let totalDamCrit = _results[1];
            let results = _results[2];
            let tooltipinfo = _results[3];
            
            for (let i = 0; i < 6; ++i) {
                for (let j in results[i]) {
                    results[i][j] = results[i][j].toFixed(2);
                }
            }
            let nonCritAverage = (totalDamNormal[0]+totalDamNormal[1])/2 || 0;
            let critAverage = (totalDamCrit[0]+totalDamCrit[1])/2 || 0;
            let averageDamage = (1-critChance)*nonCritAverage+critChance*critAverage || 0;

            let averageLabel = document.createElement("p");
            averageLabel.textContent = "Average: "+averageDamage.toFixed(2);
            tooltiptext = ` = ((1 - ${critChance}) * ${nonCritAverage.toFixed(2)}) + (${critChance} * ${critAverage.toFixed(2)})`
            // averageLabel.classList.add("damageSubtitle");
            // tooltip = createTooltip(tooltip, "p", tooltiptext, averageLabel, ["spell-tooltip"]);
            part_div.append(averageLabel);


            if (part.summary == true) {
                let overallaverageLabel = document.createElement("p");
                let first = document.createElement("span");
                let second = document.createElement("span");
                first.textContent = part.subtitle + " Average: "; 
                second.textContent = averageDamage.toFixed(2);
                overallaverageLabel.appendChild(first);
                overallaverageLabel.appendChild(second);
                // tooltip = createTooltip(tooltip, "p", tooltiptext, overallaverageLabel, ["spell-tooltip", "summary-tooltip"]);
                second.classList.add("Damage");
                overallaverageLabel.classList.add("itemp");
                part_divavg.append(overallaverageLabel);
            }
            
            function _damage_display(label_text, average, result_idx) {
                let label = document.createElement("p");
                label.textContent = label_text+average.toFixed(2);
                label.classList.add("damageSubtitle");
                part_div.append(label);
                
                let arrmin = [];
                let arrmax = [];
                for (let i = 0; i < 6; i++){
                    if (results[i][1] != 0){
                        let p = document.createElement("p");
                        p.classList.add("damagep");
                        p.classList.add(damageClasses[i]);
                        p.textContent = results[i][result_idx] + " \u2013 " + results[i][result_idx + 1];
                        tooltiptext = tooltipinfo.get("damageformulas")[i].slice(0,2).join("\n");
                        // tooltip = createTooltip(tooltip, "p", tooltiptext, p, ["spell-tooltip"]);
                        arrmin.push(results[i][result_idx]);
                        arrmax.push(results[i][result_idx + 1]);
                        part_div.append(p);
                    }
                }
                tooltiptext = ` = ((${arrmin.join(" + ")}) + (${arrmax.join(" + ")})) / 2`;
                // tooltip = createTooltip(tooltip, "p", tooltiptext, label, ["spell-tooltip"]);
            }
            _damage_display("Non-Crit Average: ", nonCritAverage, 0);
            _damage_display("Crit Average: ", critAverage, 2);

            save_damages.push(averageDamage);
        } else if (part.type === "heal") {
            let heal_amount = (part.strength * build.getDefenseStats()[0] * Math.max(0.5,Math.min(1.75, 1 + 0.5 * stats.get("wDamPct")/100))).toFixed(2);
            tooltiptext = ` = ${part.strength} * ${build.getDefenseStats()[0]} * max(0.5, min(1.75, 1 + 0.5 * ${stats.get("wDamPct")/100}))`;
            let healLabel = document.createElement("p");
            healLabel.textContent = heal_amount;
            // healLabel.classList.add("damagep");
            // tooltip = createTooltip(tooltip, "p", tooltiptext, healLabel, ["spell-tooltip"]);
            part_div.append(healLabel);
            if (part.summary == true) {
                let overallhealLabel = document.createElement("p");
                let first = document.createElement("span");
                let second = document.createElement("span");
                first.textContent = part.subtitle + ": ";
                second.textContent = heal_amount;
                overallhealLabel.appendChild(first);
                second.classList.add("Set");
                overallhealLabel.appendChild(second);
                part_divavg.append(overallhealLabel);
            }
        } else if (part.type === "total") {
            let total_damage = 0;
            tooltiptext = "";
            for (let i in part.factors) {
                total_damage += save_damages[i] * part.factors[i];
            }

            let dmgarr = part.factors.slice();
            dmgarr = dmgarr.map(x => "(" + x + " * " + save_damages[dmgarr.indexOf(x)].toFixed(2) + ")");
            tooltiptext = " = " + dmgarr.join(" + ");


            let averageLabel = document.createElement("p");
            averageLabel.textContent = "Average: "+total_damage.toFixed(2);
            averageLabel.classList.add("damageSubtitle");
            tooltip = createTooltip(tooltip, "p", tooltiptext, averageLabel, ["spell-tooltip"]);
            part_div.append(averageLabel);

            let overallaverageLabel = document.createElement("p");
            let overallaverageLabelFirst = document.createElement("span");
            let overallaverageLabelSecond = document.createElement("span");
            overallaverageLabelFirst.textContent = "Average: ";
            overallaverageLabelSecond.textContent = total_damage.toFixed(2);
            overallaverageLabelSecond.classList.add("Damage");


            overallaverageLabel.appendChild(overallaverageLabelFirst);
            overallaverageLabel.appendChild(overallaverageLabelSecond);
            part_divavg.append(overallaverageLabel);
        }
    }
}
