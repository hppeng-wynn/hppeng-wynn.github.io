/**
 * File containing generic display code, ex. for displaying items and spell damage.
 * TODO: split this file into separate parts for each "component".
 */

const itemBGPositions = {"bow": "0 0", "spear": "9.090909090909088% 0", "wand": "18.181818181818183% 0", "dagger": "27.27272727272727% 0", "relik": "36.36363636363637% 0",
    "helmet": "45.45454545454546% 0", "chestplate": "54.54545454545454% 0", "leggings": "63.63636363636363% 0", "boots": "72.72727272727272% 0",
    "ring": "81.81818181818181% 0", "bracelet": "90.90909090909092% 0", "necklace": "100% 0",
    "potion": "25% 0", "scroll": "50% 0", "food": "75% 0"};

function apply_elemental_format(p_elem, id, suffix) {
    suffix = (typeof suffix !== 'undefined') ?  suffix : "";
    // THIS IS SO JANK BUT IM TOO LAZY TO FIX IT TODO
    let parts = idPrefixes[id].split(/ (.*)/);
    let element_prefix = parts[0];
    let desc = parts[1];
    let i_elem = make_elem('span', [element_prefix], {textContent: element_prefix});
    p_elem.appendChild(i_elem);

    let i_elem2 = make_elem('span', [], {textContent: " "+desc+suffix});
    p_elem.appendChild(i_elem2);
}

function displaySetBonuses(parent_id,build) {
    setHTML(parent_id, "");
    let parent_div = document.getElementById(parent_id);

    let set_summary_elem = make_elem('p', ['text-center'], {textContent: "Set Bonuses"});
    parent_div.append(set_summary_elem);

    for (const [setName, count] of build.activeSetCounts) {
        const active_set = sets.get(setName);
        if (active_set["hidden"]) { continue; }

        let set_elem = make_elem('p', [], {id: "set-"+setName});
        set_summary_elem.append(set_elem);
        
        const bonus = active_set.bonuses[count-1];
        let mock_item = new Map([["fixID", true],
                                 ["displayName", setName+" Set: "+count+"/"+sets.get(setName).bonuses.length]]);
        let mock_minRolls = new Map();
        let mock_maxRolls = new Map();
        mock_item.set("minRolls", mock_minRolls);
        mock_item.set("maxRolls", mock_maxRolls);
        for (const id in bonus) {
            if (rolledIDs.includes(id)) {
                mock_minRolls.set(id, bonus[id]);
                mock_maxRolls.set(id, bonus[id]);
            }
            else {
                mock_item.set(id, bonus[id]);
            }
        }
        mock_item.set("powders", []);
        displayExpandedItem(mock_item, set_elem.id);
    }
}

function displayBuildStats(parent_id,build,command_group,stats){
    // Commands to "script" the creation of nice formatting.
    // #commands create a new element.
    // !elemental is some janky hack for elemental damage.
    // normals just display a thing.

    let display_commands = command_group;
    let parent_div = document.getElementById(parent_id);
    // Clear the parent div.
    if (parent_div != null) {
        setHTML(parent_id, "");
    }
    
    let last_command;
    let elemental_format = false;

    //TODO this is put here for readability, consolidate with definition in `builder/build.js`
    // TODO amend: uuhhhhh these two constants have diverged too far...
    let staticIDs = ["hp", "eDef", "tDef", "wDef", "fDef", "aDef"];

    for (const command of display_commands) {
        // style instructions
        if (command.charAt(0) === "#") {
            if (command === "#defense-stats") {
                displayDefenseStats(parent_div, stats, true);
                last_command = command;
            }
        }
        if (command.charAt(0) === "!") {
            // TODO: This is sooo incredibly janky.....
            if (command === "!elemental") {
                elemental_format = !elemental_format;
            }
            else if (command === "!spacer" && last_command !== "!spacer") {
                let spacer = make_elem('hr', ["row", "my-2"], {});
                parent_div.appendChild(spacer);
                last_command = command;
                continue;
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
                displayFixedID(parent_div, id, id_val, elemental_format, style);
                if (id_val != 0) {
                    if(id === "ls"){
                        {
                            let row = make_elem('div', ['row']);
                            let value_elem = make_elem('div', ['col', 'text-end']);

                            let prefix_elem = make_elem('b', [], {textContent: "\u279C Effective LS: "});

                            let defStats = getDefenseStats(stats);
                            let number_elem = make_elem('b', [style], {
                                textContent: Math.round(defStats[1][0]*id_val/defStats[0]) + "/3s"
                            });
                            value_elem.append(prefix_elem);
                            value_elem.append(number_elem);
                            row.appendChild(value_elem);
                            parent_div.appendChild(row);
                        }
                        {
                            let row = make_elem('div', ['row']);
                            let value_elem = make_elem('div', ['col', 'text-end']);
        
                            let prefix_elem = make_elem('b', [], {textContent: "\u279C Life per hit: "});
        
                            let adjAtkSpd = attackSpeeds.indexOf(stats.get("atkSpd")) + stats.get("atkTier");
                            if(adjAtkSpd > 6) {
                                adjAtkSpd = 6;
                            } else if(adjAtkSpd < 0) {
                                adjAtkSpd = 0;
                            }

                            let number_elem = make_elem('b', [style], {
                                textContent: Math.round(id_val/3.0/baseDamageMultiplier[adjAtkSpd])
                            });
                            value_elem.append(prefix_elem);
                            value_elem.append(number_elem);
                            row.appendChild(value_elem);
                            parent_div.appendChild(row);
                        }
                    }
                    else if (id == "ms"){
                        let row = make_elem('div', ['row']);
                        let value_elem = make_elem('div', ['col', 'text-end']);
    
                        let prefix_elem = make_elem('b', [], {textContent: "\u279C Mana per hit: "});
    
                        let adjAtkSpd = attackSpeeds.indexOf(stats.get("atkSpd")) + stats.get("atkTier");
                        if(adjAtkSpd > 6) {
                            adjAtkSpd = 6;
                        } else if(adjAtkSpd < 0) {
                            adjAtkSpd = 0;
                        }

                        let number_elem = make_elem('b', [style], {
                            textContent: Math.round(id_val/3.0/baseDamageMultiplier[adjAtkSpd]*10)/10
                        });
                        value_elem.append(prefix_elem);
                        value_elem.append(number_elem);
                        row.appendChild(value_elem);
                        parent_div.appendChild(row);
                    }
                }
                last_command = command;
            }
            // sp thingy (WHY IS THIS HANDLED SEPARATELY TODO
            else if (skp_order.includes(id)) {
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
                    displayFixedID(parent_div, id, diff, false, style);
                }
            }
        }
    }
}


function displayExpandedItem(item, parent_id){
    // Commands to "script" the creation of nice formatting.
    // #commands create a new element.
    // !elemental is some janky hack for elemental damage.
    // normals just display a thing.
    item = new Map(item);   // shallow copy
    if (item.get("category") === "weapon") {
        item.set('basedps', get_base_dps(item));
    } else if (item.get("category") === "armor") { 
    }

    let display_commands = sq2_item_display_commands;

    // Clear the parent div.
    setHTML(parent_id, "");
    let parent_div = document.getElementById(parent_id);
    parent_div.classList.add("border", "border-2", "border-dark");
    
    let fix_id = item.has("fixID") && item.get("fixID");
    let last_command;
    let elemental_format = false;
    for (let i = 0; i < display_commands.length; i++) {
        const command = display_commands[i];
        if (command.charAt(0) === "!") {
            // TODO: This is sooo incredibly janky.....
            if (command === "!elemental") {
                elemental_format = !elemental_format;
            }
            else if (command === "!spacer" && last_command !== "!spacer") {
                let spacer = make_elem('div', ["row", "my-2"], {});
                parent_div.appendChild(spacer);
                last_command = command;
                continue;
            }
        }
        else {
            let id = command; 
            if(nonRolledIDs.includes(id)){//nonRolledID & non-0/non-null/non-und ID
                if (!item.get(id)) {
                    if (!(item.get("crafted") && skp_order.includes(id) && 
                            (item.get("maxRolls").get(id) || item.get("minRolls").get(id)))) {
                        continue;
                    }
                }
                if (id === "slots") {
                    let p_elem = make_elem("div", ["col"]);

                    // PROPER POWDER DISPLAYING
                    let numerals = new Map([[1, "I"], [2, "II"], [3, "III"], [4, "IV"], [5, "V"], [6, "VI"]]);

                    p_elem.appendChild(make_elem("b", [], {
                        textContent: "Powder Slots: " + item.get(id) + " ["
                    }));
                    
                    let powders = item.get("powders");
                    for (let i = 0; i < powders.length; i++) {
                        p_elem.appendChild(make_elem("b", [damageClasses[Math.floor(powders[i]/6)+1]+"_powder"], {
                            textContent: numerals.get((powders[i]%6)+1)+" "
                        }));
                    }

                    p_elem.appendChild(make_elem("b", [], { textContent: "]" }));
                    parent_div.appendChild(p_elem);
                } else if (id === "set") {
                    if (item.get("hideSet")) { continue; }

                    parent_div.appendChild(make_elem("div", ["col"], { textContent: "Set: " + item.get(id).toString() }));
                } else if (id === "majorIds") {
                    //console.log(item.get(id));
                    for (let major_id_str of item.get(id)) {
                        if (major_id_str in MAJOR_IDS) {
                            let major_id_info = MAJOR_IDS[major_id_str];
                            if(!MAJOR_IDS[major_id_str].hidden)
                                major_id_str = `+${major_id_info.displayName}: ${major_id_info.description}`;
                        }
                        let p_elem = make_elem("div", ['col']);

                        let title_elem = make_elem("b");
                        let b_elem = make_elem("b");
                        if (major_id_str.includes(":")) {
                            let name = major_id_str.substring(0, major_id_str.indexOf(":")+1);
                            let mid = major_id_str.substring(major_id_str.indexOf(":")+1);
                            if (name.charAt(0) !== "+") {name = "+" + name}
                            title_elem.classList.add("Legendary");
                            title_elem.textContent = name;
                            b_elem.classList.add("Crafted");
                            b_elem.textContent = mid;
                            b_elem.innerHTML = b_elem.innerHTML
                                .replaceAll("[neutral]", "<span class='Neutral'></span>")
                                .replaceAll("[earth]", "<span class='Earth'></span>")
                                .replaceAll("[thunder]", "<span class='Thunder'></span>")
                                .replaceAll("[water]", "<span class='Water'></span>")
                                .replaceAll("[fire]", "<span class='Fire'></span>")
                                .replaceAll("[air]", "<span class='Air'></span>");
                            p_elem.appendChild(title_elem);
                            p_elem.appendChild(b_elem);
                        } else {
                            if (major_id_str.charAt(0) !== "+") {major_id_str = "+" + major_id_str}
                            b_elem.classList.add("Legendary");
                            b_elem.textContent = major_id_str;
                            p_elem.appendChild(b_elem);
                        }
                        parent_div.appendChild(p_elem);
                    }
                } else if (id === "lvl" && item.get("tier") === "Crafted") {
                    parent_div.appendChild(make_elem("div", ["col"], {
                        textContent: "Combat Level Min: " + item.get("lvlLow") + "-" + item.get(id)
                    }));
                } else if (id === "displayName") {
                    let row = make_elem("div", ["row", "justify-content-center"]);

                    let nolink_row = make_elem("div", ["row", "justify-content-center"]);
                    nolink_row.style.display = "none";

                    const tier_class = item.has("tier") ? item.get("tier").replace(" ","") : "Normal";
                    let item_link;
                    if (item.get("custom")) {
                        item_link = "../custom/#" + item.get("hash");
                    } else if (item.get("crafted")) {
                        item_link = "../crafter/#" + item.get("hash");
                    } else {
                        item_link = "../item/#" + item.get("displayName");
                    }
                    const item_name_elem = make_elem("a", ["col-auto", "text-center", "item-title", "p-0", tier_class], {
                        textContent: item.get('displayName')
                    });
                    nolink_row.appendChild(item_name_elem.cloneNode(true));
                    item_name_elem.href = item_link;
                    row.appendChild(item_name_elem);

                    /* 
                    FUNCTIONALITY FOR THIS FEATURE HAS SINCE BEEN REMOVED (WITH SQ2).
                    IF WE WANT TO USE IT IN THE FUTURE, I'VE LEFT THE CODE TO ADD IT IN HERE
                    */

                    //allow the plus minus element to toggle upon click: ➕➖
                    //let plusminus = document.createElement("div");
                    //plusminus.id = parent_div.id.split("-")[0] + "-pm";
                    //plusminus.classList.add("col", "plus_minus", "text_end");
                    //plusminus.style.flexGrow = 0;
                    //plusminus.textContent = "\u2795";
                    //row.appendChild(plusminus);
                    parent_div.appendChild(row);
                    parent_div.appendChild(nolink_row);

                    if (item.has("type")) {
                        let img = make_elem("div", [], {
                            alt: item.get("type"),
                            style: "z-index: 1; position: relative; image-rendering: pixelated; width: 50%; height: 50%; background-position: " + itemBGPositions[item.get("type")] + ";"
                        });
                        if (["potion", "scroll", "food"].includes(item.get("type"))) {
                            img.style.backgroundImage = "url('../media/items/common.png')";
                            img.style.backgroundSize = "500% 100%";
                        } else {
                            img.style.backgroundImage = "url('../media/items/" + (newIcons ? "new.png')" : "old.png')");
                            img.style.backgroundSize = "1200% 100%";
                        }

                        let container = make_elem("div");
                        
                        let bckgrd = make_elem("div", ["col", "px-0", "d-flex", "align-items-center", "justify-content-center", 'scaled-bckgrd'], { // , "no-collapse"
                            style: "border-radius: 50%;background-image: radial-gradient(closest-side, " + colorMap.get(item.get("tier")) + " 20%," + "hsl(0, 0%, 16%) 80%); margin-left: auto; margin-right: auto;"
                        });
                        bckgrd.appendChild(img);
                        container.appendChild(bckgrd);
                        parent_div.appendChild(container);
                    }
                } else {
                    if (id.endsWith('Dam_')) {
                        // TODO: kinda jank but replacing lists with txt at this step
                        let damages = item.get(id);
                        if (item.get("tier") !== "Crafted") {
                            damages = damages.map(x => Math.floor(x));
                            item.set(id, damages[0]+"-"+damages[1]);
                        }
                        else {
                            damages = damages.map(x => x.map(y => Math.floor(y)));
                            item.set(id, damages[0][0]+"-"+damages[0][1]+"\u279c"+damages[1][0]+"-"+damages[1][1]);
                        }
                    }

                    let p_elem;
                    // TODO: wtf is this if statement
                    if ( !(item.get("tier") === "Crafted" && item.get("category") === "armor" && id === "hp") && (!skp_order.includes(id)) || (skp_order.includes(id) && item.get("tier") !== "Crafted" && parent_div.nodeName === "table") ) { //skp warp
                        p_elem = displayFixedID(parent_div, id, item.get(id), elemental_format);
                    } else if (item.get("tier") === "Crafted" && item.get("category") === "armor" && id === "hp") {
                        p_elem = displayFixedID(parent_div, id, item.get(id+"Low")+"-"+item.get(id), elemental_format);
                    }
                    if (id === "lore") {
                        p_elem.style = "font-style: italic";
                    } else if (skp_order.includes(id)) { //id = str, dex, int, def, or agi
                        if ( item.get("tier") !== "Crafted") {
                            row = make_elem("div", ["col"]);
                            
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
                            parent_div.appendChild(row);
                        } else if ( item.get("tier") === "Crafted") {
                            let row = displayRolledID(item, id, elemental_format);
                            parent_div.appendChild(row);
                        }
                    } else if (id === "restrict") {
                        p_elem.classList.add("restrict");
                    }
                }
                last_command = id;
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
                    p_elem = document.createElement("div");
                    p_elem.classList.add("col", "text-nowrap");
                    if (id == "dex") {
                        console.log("dex activated at fix_id")
                    }
                    displayFixedID(p_elem, id, item.get("minRolls").get(id), elemental_format, style);
                    parent_div.appendChild(p_elem);
                }
                else {
                    let row = displayRolledID(item, id, elemental_format);
                    parent_div.appendChild(row);
                }
                last_command = id;
            }else{
              // :/  
            }
        }
    }
    //Show powder specials ;-;
    let powder_specials_check = ["relik", "wand", "bow", "spear", "dagger", "chestplate", "helmet", "leggings", "boots"];
    if(powder_specials_check.includes(item.get("type"))) {
        let powder_special = make_elem("div", ['col']);
        let powders = item.get("powders");
        let element;
        let power_index;
        for (let i = 0; i < powders.length; i++) {
            const firstPowderType = skp_elements[Math.floor(powders[i]/6)];
            const powder1_power = powders[i] % 6;
            if (powder1_power > 2) { //t4+
                for (let j = i+1; j < powders.length; j++) {
                    const currentPowderType = skp_elements[Math.floor(powders[j]/6)]
                    const powder2_power = powders[j] % 6;
                    if (powder2_power > 2 && firstPowderType === currentPowderType) {
                        element = currentPowderType;
                        power_index = powder1_power + powder2_power - 6;
                        break;
                    }
                }
            }
            if (element) { break; } // terminate early if already found.
        }
        if (element) {//powder special is "[e,t,w,f,a]+[0,1,2,3,4]"
            const powderSpecial = powderSpecialStats[skp_elements.indexOf(element)];
            const specialSuffixes = new Map([ ["Duration", " sec"], ["Radius", " blocks"], ["Chains", ""], ["Damage", "%"], ["Damage Boost", "%"], ["Knockback", " blocks"] ]);
            const specialTitle = make_elem("span", [damageClasses[skp_elements.indexOf(element) + 1]]);
            const specialEffects = document.createElement("span");
            let effects;
            if (item.get("category") === "weapon") {//weapon
                effects = powderSpecial["weaponSpecialEffects"];
                specialTitle.textContent = powderSpecial["weaponSpecialName"];
            } else if (item.get("category") === "armor") {//armor
                effects = powderSpecial["armorSpecialEffects"];
                specialTitle.textContent += powderSpecial["armorSpecialName"] + ": ";
            }
            for (const [key,value] of effects.entries()) {
                if (key !== "Description") {
                    let effect = make_elem("p", ["m-0"], {
                        textContent: key + ": " + value[power_index] + specialSuffixes.get(key)
                    });
                    if(key === "Damage"){
                        effect.textContent += elementIcons[skp_elements.indexOf(element)];
                    }
                    if (element === "w" && item.get("category") === "armor") {
                        effect.textContent += " / Mana Used";
                    }
                    specialEffects.appendChild(effect);
                } else {
                    specialTitle.textContent += "[ " + effects.get("Description") + " ]"; 
                }
            }
            powder_special.append(specialTitle, specialEffects);
            parent_div.appendChild(powder_special);
        }
    }
    
    let nonConsumables = ["relik", "wand", "bow", "spear", "dagger", "chestplate", "helmet", "leggings", "boots", "ring", "bracelet", "necklace"];
    if(item.get("tier") && item.get("tier") === "Crafted") {
        let dura_elem = make_elem("div", ["col"]);
        let dura;
        let suffix = "";
        if(nonConsumables.includes(item.get("type"))) {
            dura = item.get("durability");
            dura_elem.textContent = "Durability: "
        } else {
            dura = item.get("duration");
            dura_elem.textContent = "Duration: "
            suffix = " sec."
            parent_div.appendChild(make_elem('b', [], {
                textContent: "Charges: " + item.get("charges")
            }));
        }

        if (typeof(dura) === "string") {
            dura_elem.textContent += dura + suffix;
        } else {
            dura_elem.textContent += dura[0]+"-"+dura[1] + suffix;
        }
        parent_div.append(dura_elem);

    }
    //Show item tier
    if (item.get("tier") && item.get("tier") !== " ") {
        let item_desc_elem = make_elem("div", ["col", item.get("tier")]);
        if (tome_types.includes(item.get("type"))) {
            item_desc_elem.textContent = item.get("tier")+" "+tome_type_map.get(item.get("type"));
        } else {
            item_desc_elem.textContent = item.get("tier")+" "+item.get("type");
        }
        parent_div.append(item_desc_elem);
    }

    //Show item hash if applicable
    if (item.get("crafted") || item.get("custom")) {
        parent_div.append(make_elem('p', ['itemp'], {
            style: {
                maxWidth: '100%',
                wordWrap: 'break-word',
                wordBreak: 'break-word'
            },
            textContent: item.get('hash')
        }));
    }

    if (item.get("category") === "weapon") { 
        let total_damages = item.get("basedps");
        let base_dps_elem = make_elem("p", ["left", "itemp"]);
        if (item.get("tier") === "Crafted") {
            let base_dps_min = total_damages[0];
            let base_dps_max = total_damages[1];

            base_dps_elem.textContent = "Base DPS: "+base_dps_min.toFixed(3)+"\u279c"+base_dps_max.toFixed(3);
        }
        else {
            base_dps_elem.textContent = "Base DPS: "+(total_damages.toFixed(3));
        }
        parent_div.append(make_elem("p"), base_dps_elem);
    }
}

/*
*  Displays stats about a recipe that are NOT displayed in the craft stats. 
*  Includes: mat name and amounts, ingred names in an "array" with ingred effectiveness
*/
function displayRecipeStats(craft, parent_id) {
    let elem = document.getElementById(parent_id);

    //local vars 
    elem.textContent = "";
    recipe = craft["recipe"];
    mat_tiers = craft["mat_tiers"];
    ingreds = [];
    for (const n of craft["ingreds"]) {
        ingreds.push(n.get("name"));
    }
    let effectiveness = craft["statMap"].get("ingredEffectiveness");

    let title = document.createElement("div");
    title.classList.add("col", "box-title", "fw-bold", "justify-content-center", "scaled-font");
    title.textContent = "Recipe Stats";
    elem.appendChild(title);

    let mats = document.createElement("div");
    mats.classList.add("col");
    mats.textContent = "Crafting Materials: ";
    elem.appendChild(mats);

    for (let i = 0; i < 2; i++) {
        let tier = mat_tiers[i];
        let col = document.createElement("div");
        col.classList.add("col", "ps-4");
        let b = document.createElement("span");
        let mat = recipe.get("materials")[i];
        b.textContent = "- " + mat.get("amount") + "x " + mat.get("item").split(" ").slice(1).join(" ");
        b.classList.add("col");
        col.appendChild(b);

        let starsContainer = document.createElement("span");
        let starsB = document.createElement("span");
        starsB.classList.add("T1-bracket", "px-0");
        starsB.textContent = "[";
        starsContainer.appendChild(starsB);
        for(let j = 0; j < 3; j ++) {
            let star = document.createElement("span");
            star.classList.add("px-0");
            star.textContent = "\u272B";
            if(j < tier) {
                star.classList.add("T1");
            } else {
                star.classList.add("T0");
            }
            starsContainer.append(star);
        }
        let starsE = document.createElement("span");
        starsE.classList.add("T1-bracket", "px-0");
        starsE.textContent = "]";
        starsContainer.appendChild(starsE);

        col.appendChild(starsContainer);

        elem.appendChild(col);
    }

    let ingredTable = document.createElement("div");
    ingredTable.classList.add("col", "mt-2");

    let ingredContainer = document.createElement("div");
    ingredContainer.classList.add("row", "row-cols-2", "g-3");
    for (let i = 0; i < 6; i++) {
        let ingredCell = document.createElement("div");
        ingredCell.classList.add("col");

        let ingredTextContainer = document.createElement("div");
        ingredTextContainer.classList.add("border", "border-3", "rounded")

        let ingredName = ingreds[i];
        let ingred_text = document.createElement("p");
        ingred_text.classList.add("mb-2", "ps-2");
        ingred_text.textContent = ingredName;
        ingredTextContainer.appendChild(ingred_text);

        let eff_div = document.createElement("p");
        eff_div.classList.add("mb-2", "ps-2");
        let e = effectiveness[i];
        if (e > 0) {
            eff_div.classList.add("positive");
        } else if (e < 0) {
            eff_div.classList.add("negative");
        }
        eff_div.textContent = "[" + e + "%]";
        ingredTextContainer.appendChild(eff_div);

        ingredCell.appendChild(ingredTextContainer);

        ingredContainer.appendChild(ingredCell);
    }
    ingredTable.appendChild(ingredContainer);
    elem.appendChild(ingredTable);
}

//Displays a craft. If things change, this function should be modified.
function displayCraftStats(craft, parent_id) {
    let mock_item = craft.statMap;
    displayExpandedItem(mock_item,parent_id);
}

/*
* Displays an ingredient in item format. 
* However, an ingredient is too far from a normal item to display as one.
*/
function displayExpandedIngredient(ingred, parent_id) {
    let parent_elem = document.getElementById(parent_id);
    parent_elem.textContent = "";
    
    let item_order = [
        "dura",
        "strReq",
        "dexReq",
        "intReq",
        "defReq",
        "agiReq"
    ]
    let consumable_order = [
        "dura",
        "charges"
    ]
    let posMods_order = [
        "above",
        "under",
        "left",
        "right",
        "touching",
        "notTouching"
    ];
    let id_display_order = [ 
        "eDefPct", 
        "tDefPct", 
        "wDefPct", 
        "fDefPct", 
        "aDefPct", 
        "eDamPct", 
        "tDamPct", 
        "wDamPct", 
        "fDamPct", 
        "aDamPct", 
        "str", 
        "dex", 
        "int", 
        "agi", 
        "def",
        "hpBonus",
        "mr", 
        "ms", 
        "ls",
        "hprRaw", 
        "hprPct", 
        "sdRaw", 
        "sdPct", 
        "mdRaw", 
        "mdPct",  
        "xpb",
        "lb", 
        "lq", 
        "ref",  
        "thorns", 
        "expd", 
        "spd", 
        "atkTier", 
        "poison",  
        "spRegen", 
        "eSteal", 
        "spRaw1",
        "spRaw2", 
        "spRaw3", 
        "spRaw4", 
        "spPct1", 
        "spPct2", 
        "spPct3", 
        "spPct4",
        "jh", 
        "sprint", 
        "sprintReg", 
        "gXp", 
        "gSpd",
    ];
    let active_elem;
    let elemental_format = false;
    let style;
    for (const command of sq2_ing_display_order) {
        if (command.charAt(0) === "!") {
            // TODO: This is sooo incredibly janky.....
            if (command === "!elemental") {
                elemental_format = !elemental_format;
            }
            else if (command === "!spacer") {
                let spacer = document.createElement('div');
                spacer.classList.add("div", "my-2");
                parent_elem.appendChild(spacer);
                continue;
            }
        } else {
            let div = document.createElement("div");
            div.classList.add("row");
            if (command === "displayName") {
                div.classList.add("box-title");
                let title_elem = document.createElement("div");
                title_elem.classList.add("col-auto", "justify-content-center", "pr-1");
                title_elem.textContent = ingred.get("displayName");
                div.appendChild(title_elem);

                let tier = ingred.get("tier"); //tier in [0,3]
                let begin = document.createElement("b");
                begin.classList.add("T"+tier+"-bracket", "col-auto", "px-0");
                begin.textContent = "[";
                div.appendChild(begin);

                for (let i = 0; i < 3; i++) {
                    let tier_elem = document.createElement("b");
                    if (i < tier) {
                        tier_elem.classList.add("T"+tier);
                    } else {
                        tier_elem.classList.add("T0");
                    }
                    tier_elem.classList.add("px-0", "col-auto");
                    tier_elem.textContent = "\u272B";
                    div.appendChild(tier_elem);
                }
                let end = document.createElement("b");
                end.classList.add("T"+tier+"-bracket", "px-0", "col-auto");
                end.textContent = "]";
                div.appendChild(end);   
            }else if (command === "lvl") {
                div.textContent = "Crafting Lvl Min: " + ingred.get("lvl");
            }else if (command === "posMods") {
                for (const [key,value] of ingred.get("posMods")) {
                    let posModRow = document.createElement("div");
                    posModRow.classList.add("row");
                    if (value != 0) {
                        let posMod = document.createElement("div");
                        posMod.classList.add("col-auto");
                        posMod.textContent = posModPrefixes[key];
                        posModRow.appendChild(posMod);

                        let val = document.createElement("div");
                        val.classList.add("col-auto", "px-0");
                        val.textContent = value + posModSuffixes[key];
                        if(value > 0) {
                            val.classList.add("positive");
                        } else {
                            val.classList.add("negative");
                        }
                        posModRow.appendChild(val);
                        div.appendChild(posModRow);
                    }
                }
            } else if (command === "itemIDs") { //dura, reqs
                for (const [key,value] of ingred.get("itemIDs")) {
                    let idRow = document.createElement("div");
                    idRow.classList.add("row");                        
                    if (value != 0) {
                        let title = document.createElement("div");
                        title.classList.add("col-auto");
                        title.textContent = itemIDPrefixes[key];
                        idRow.appendChild(title);
                    }
                    let desc = document.createElement("div");
                    desc.classList.add("col-auto");
                    if(value > 0) {
                        if(key !== "dura") {
                            desc.classList.add("negative");
                        } else{
                            desc.classList.add("positive");
                        }
                        desc.textContent = "+"+value;
                    } else if (value < 0){
                        if(key !== "dura") {
                            desc.classList.add("positive");
                        } else{
                            desc.classList.add("negative");
                        }
                        desc.textContent = value; 
                    }
                    if(value != 0){
                        idRow.appendChild(desc);
                    }
                    div.appendChild(idRow);
                }
            } else if (command === "consumableIDs") { //dura, charges
                for (const [key,value] of ingred.get("consumableIDs")) {
                    let idRow = document.createElement("div");
                    idRow.classList.add("row");                        
                    if (value != 0) {
                        let title = document.createElement("div");
                        title.classList.add("col-auto");
                        title.textContent = consumableIDPrefixes[key];
                        idRow.appendChild(title);
                    }
                    let desc = document.createElement("div");
                    desc.classList.add("col-auto");
                    if(value > 0) {
                        desc.classList.add("positive");
                        desc.textContent = "+"+value;
                    } else if (value < 0){
                        desc.classList.add("negative");
                        desc.textContent = value; 
                    }
                    if(value != 0){
                        idRow.appendChild(desc);
                        let suffix = document.createElement("div");
                        suffix.classList.add("col-auto");
                        suffix.textContent = consumableIDSuffixes[key];
                        idRow.appendChild(suffix);
                    }
                    div.appendChild(idRow);
                }
            }else if (command === "skills") {
                let row = document.createElement("div");
                row.classList.add("row");
                let title = document.createElement("div");
                title.classList.add("row");
                title.textContent = "Used in:";
                row.appendChild(title);
                for(const skill of ingred.get("skills")) {
                    let skill_div = document.createElement("div");
                    skill_div.classList.add("row", "ps-4");
                    skill_div.textContent = skill.charAt(0) + skill.substring(1).toLowerCase();
                    row.appendChild(skill_div);
                }
                div.appendChild(row);
            } else if (command === "ids") { //warp
                for (let [key,value] of ingred.get("ids").get("maxRolls")) {
                    if (value !== undefined && value != 0) {
                        let row = displayRolledID(ingred.get("ids"), key, elemental_format);
                        row.classList.remove("col");
                        row.classList.remove("col-12");
                        div.appendChild(row);
                    }
                }
            } else {//this shouldn't be happening        
            }

            parent_elem.appendChild(div);
        }
    }    
}

function displayExpandedSet(set_name, set_value, parent_id, shown_tier){
    let display_commands = sq2_item_display_commands;

    // Clear the parent div.
    setHTML(parent_id, "");
    let parent_div = document.getElementById(parent_id);
    parent_div.classList.add("border", "border-2", "border-dark");
    
    let last_command;
    let elemental_format = false;

    for (let i = 0; i < display_commands.length; i++) {
        const command = display_commands[i];
        if (command.charAt(0) === "!") {
            if (command === "!elemental") {
                elemental_format = !elemental_format;
            }
            else if (command === "!spacer" && last_command !== "!spacer") {
                let spacer = make_elem('div', ["row", "my-2"], {});
                parent_div.appendChild(spacer);
                last_command = command;
                continue;
            }
        }
        else {
            let id = command;
            let div = document.createElement("div");
            div.classList.add("row");

            if (command === "displayName") {
                div.classList.add("box-title", "justify-content-center");
                let title_elem = document.createElement("a");
                title_elem.classList.add("col-auto", "text-center", "justify-content-center", "pr-1");
                title_elem.textContent = set_name + " Set: " + (shown_tier + 1) + "/" + set_value.bonuses.length;
                title_elem.href = "../items_adv/?f=set=\""+set_name+"\"";
                div.appendChild(title_elem);
            }
            else if (nonRolledIDs.includes(id) || rolledIDs.includes(id)) {
                if (set_value.bonuses[shown_tier] === undefined || set_value.bonuses[shown_tier][id] === undefined)
                    continue;

                let style = "positive";
                if (set_value.bonuses[shown_tier][id] < 0) {
                    style = "negative";
                }
                if(reversedIDs.includes(id)){
                    style === "positive" ? style = "negative" : style = "positive"; 
                }
                p_elem = document.createElement("div");
                p_elem.classList.add("col", "text-nowrap");
                displayFixedID(p_elem, id, set_value.bonuses[shown_tier][id], elemental_format, style);
                parent_div.appendChild(p_elem);
                last_command = id;
            }
            parent_div.appendChild(div);
        }
    }
    let change_tier = make_elem('button', ["button", "row", "row-cols-1", "rounded", "dark-5", "text-light", "fw-bold"], {textContent:"Next Tier"});
    change_tier.onclick = function() {displayExpandedSet(set_name, set_value, parent_id, (shown_tier+1) % set_value.bonuses.length)};
    parent_div.appendChild(change_tier);
}

function displayNextCosts(_stats, spell, spellIdx) { 
    let stats = new Map(_stats);
    let intel = stats.get('int');

    let row = document.createElement("div");
    row.classList.add("spellcost-tooltip");
    let init_cost = document.createElement("b");
    init_cost.textContent = getSpellCost(stats, spellIdx, spell.cost);
    init_cost.classList.add("Mana");
    let arrow = document.createElement("b");
    arrow.textContent = "\u279C";
    let next_cost = document.createElement("b");
    next_cost.textContent = (init_cost.textContent === "1" ? 1 : getSpellCost(stats, spellIdx, spell.cost) - 1);
    next_cost.classList.add("Mana");
    let int_needed = document.createElement("b");
    if (init_cost.textContent === "1") {
        int_needed.textContent = ": n/a (+0)";
    } else { //do math
        let target = getSpellCost(stats, spellIdx, spell.cost) - 1;
        let needed = intel;
        let noUpdate = false;
        //forgive me... I couldn't inverse ceil, floor, and max.
        while (getSpellCost(stats, spellIdx, spell.cost) > target) {
            if(needed > 150) {
                noUpdate = true;
                break;
            }
            needed++;
            stats.set('int', stats.get('int') + 1);
        }
        let missing = needed - intel;  
        //in rare circumstances, the next spell cost can jump.
        if (noUpdate) {
            next_cost.textContent = (init_cost.textContent === "1" ? 1 : getSpellCost(stats, spellIdx, spell.cost)-1); 
        }else {
            next_cost.textContent = (init_cost.textContent === "1" ? 1 : getSpellCost(stats, spellIdx, spell.cost)); 
        }
        
        
        int_needed.textContent = ": " + (needed > 150 ? ">150" : needed) + " int (+" + (needed > 150 ? "n/a" : missing) + ")"; 
    }
    
    // row.appendChild(init_cost);
    row.appendChild(arrow);
    row.appendChild(next_cost);
    row.appendChild(int_needed);
    return row;
}

function displayRolledID(item, id, elemental_format) {
    let row = document.createElement('div');
    row.classList.add('col');

    let item_div = document.createElement('div');
    item_div.classList.add('row');

    let min_elem = document.createElement('div');
    min_elem.classList.add('col', 'text-start');
    min_elem.style.cssText += "flex-grow: 0";
    let id_min = item.get("minRolls").get(id)
    let style = id_min < 0 ? "negative" : "positive";
    if(reversedIDs.includes(id)){
        style === "positive" ? style = "negative" : style = "positive"; 
    }
    min_elem.classList.add(style);
    min_elem.textContent = id_min + idSuffixes[id];
    item_div.appendChild(min_elem);

    let desc_elem = document.createElement('div');
    desc_elem.classList.add('col', 'text-center');//, 'text-nowrap');
    desc_elem.style.cssText += "flex-grow: 1";
    //TODO elemental format jank
    if (elemental_format) {
        apply_elemental_format(desc_elem, id);
    }
    else {
        desc_elem.textContent = idPrefixes[id];
    }
    item_div.appendChild(desc_elem);

    let max_elem = document.createElement('div');
    let id_max = item.get("maxRolls").get(id)
    max_elem.classList.add('col', 'text-end');
    max_elem.style.cssText += "flex-grow: 0";
    style = id_max < 0 ? "negative" : "positive";
    if (reversedIDs.includes(id)) {
        style === "positive" ? style = "negative" : style = "positive"; 
    }
    max_elem.classList.add(style);
    max_elem.textContent = id_max + idSuffixes[id];
    item_div.appendChild(max_elem);
    row.appendChild(item_div);
    return row;
}

function displayFixedID(active, id, value, elemental_format, style) {
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
        let p_elem = document.createElement('div');
        p_elem.classList.add('col');
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

function displayPoisonDamage(overallparent_elem, statMap) {
    overallparent_elem.textContent = "";
    if (statMap.get('poison') <= 0) {
        overallparent_elem.style = "display: none";
        return;
    }
    overallparent_elem.style = "";

    let container = make_elem('div', ['col', 'pe-0']);
    let spell_summary = make_elem('div', ["col", "spell-display", "dark-5", "rounded", "dark-shadow", "py-2", "border", "border-dark"]); 

    //Title
    let title_elemavg = make_elem("b");
    title_elemavg.append(make_elem('span', [], { textContent: "Poison Stats" }));
    spell_summary.append(title_elemavg);

    let poison_tick = Math.floor(statMap.get("poison")/3);
    //let poison_tick = Math.ceil(statMap.get("poison") * (1+skillPointsToPercentage(statMap.get('str'))) * (statMap.get("poisonPct"))/100 /3);

    let overallpoisonDamage = make_elem("p");
    overallpoisonDamage.append(
        make_elem("span", [], { textContent: "Poison Tick: " }),
        make_elem("span", ["Damage"], { textContent: Math.max(poison_tick,0) })
    );
    spell_summary.append(overallpoisonDamage);
    container.append(spell_summary);
    overallparent_elem.append(container);
}

function displayEquipOrder(parent_elem, buildOrder){
    parent_elem.textContent = "";
    const order = buildOrder.slice();
    let title_elem = document.createElement("b");
    title_elem.textContent = "Equip order ";
    title_elem.classList.add("Normal", "text-center");
    parent_elem.append(title_elem);
    for (const item of order) {
        let p_elem = document.createElement("b");
        p_elem.textContent = item.get("displayName");
        parent_elem.append(p_elem);
    }
}

function displayDefenseStats(parent_elem, statMap, insertSummary){
    let defenseStats = getDefenseStats(statMap);
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
    ehpRow.appendChild(ehp);
    ehpRow.append(boost);
    if (insertSummary) {
        parent_elem.appendChild(ehpRow)
    } else {
        statsTable.append(ehpRow);
    }

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
    ehprRow.appendChild(ehpr);
    ehprRow.append(boost);

    if (insertSummary) {
        parent_elem.appendChild(ehprRow);
    } else {
        statsTable.appendChild(ehprRow);
    }

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

function displayPowderSpecials(parent_elem, powderSpecials, stats, weapon) {
    parent_elem.textContent = "";
    if (powderSpecials.length === 0) {
        parent_elem.style = "display: none";
        return;
    }
    parent_elem.style = "";

    const skillpoints = [
        stats.get('str'),
        stats.get('dex'),
        stats.get('int'),
        stats.get('def'),
        stats.get('agi')
    ];
    parent_elem.append(make_elem("b", [], { textContent: "Powder Specials" }));
    let specials = powderSpecials.slice();
    //each entry of powderSpecials is [ps, power]
    for (special of specials) {
        //iterate through the special and display its effects.
        let powder_special_elem = make_elem("p", ["pt-3"]);
        let specialSuffixes = new Map([ ["Duration", " sec"], ["Radius", " blocks"], ["Chains", ""], ["Damage", "%"], ["Damage Boost", "%"], ["Knockback", " blocks"] ]);
        let specialTitle = make_elem("p");
        let specialEffects = make_elem("p");
        // TODO janky and depends on the order of powder specials being ETWFA. This should be encoded in the powder special object.
        let element_num = powderSpecialStats.indexOf(special[0]) + 1;
        specialTitle.classList.add(damageClasses[element_num]);
        let powder_special = special[0];
        let power = special[1];
        specialTitle.textContent = powder_special.weaponSpecialName + " " + Math.floor((power-1)*0.5 + 4) + (power % 2 == 0 ? ".5" : "");  

        for (const [key,value] of powder_special.weaponSpecialEffects) {
            if(key === "Damage"){
                //if this special is an instant-damage special (Quake, Chain Lightning, Courage Burst), display the damage.
                let specialDamage = document.createElement("p");
                // specialDamage.classList.add("item-margin");
                let conversions = [0, 0, 0, 0, 0, 0];
                conversions[element_num] = powder_special.weaponSpecialEffects.get("Damage")[power-1];
                let _results = calculateSpellDamage(stats, weapon, conversions, false, true, "0.Powder Special");

                let critChance = skillPointsToPercentage(skillpoints[1]);
                
                let totalDamNormal = _results[0];
                let totalDamCrit = _results[1];

                // NOTE(orgold): This prevents powder specials that have both instant damage and
                // a damage boost to apply on themselves (i.e Courage). This fix only works because
                // multiplicative effects are added last.
                const damage_boost = powder_special.weaponSpecialEffects.get("Damage Boost");
                if (damage_boost !== undefined) {
                  totalDamNormal.forEach((_, i, a) => a[i] /= 1 + (damage_boost[power-1]) / 100);
                  totalDamCrit.forEach((_, i, a) => a[i] /= 1 + (damage_boost[power-1]) / 100);
                }
                
                let nonCritAverage = (totalDamNormal[0]+totalDamNormal[1])/2 || 0;
                let critAverage = (totalDamCrit[0]+totalDamCrit[1])/2 || 0;
                let averageDamage = (1-critChance)*nonCritAverage+critChance*critAverage || 0;

                let averageLabel = document.createElement("p");
                averageLabel.innerHTML = "Average: <span class='Damage'>" + averageDamage.toFixed(2) + "</span>";

                let critAverageLabel = document.createElement("p");
                critAverageLabel.innerHTML = "Crit Average: <span class='Damage'>" + critAverage.toFixed(2) + "</span>";

                let nonCritAverageLabel = document.createElement("p");
                nonCritAverageLabel.innerHTML = "Non-Crit Average: <span class='Damage'>" + nonCritAverage.toFixed(2) + "</span>";

                specialDamage.appendChild(averageLabel);
                specialDamage.appendChild(critAverageLabel);
                specialDamage.appendChild(nonCritAverageLabel);
                
                specialEffects.append(specialDamage);
            }
            else {
                let effect = document.createElement("p");
                effect.textContent += key + ": " + value[power-1] + specialSuffixes.get(key);
                specialEffects.appendChild(effect);
            }
        }

        powder_special_elem.appendChild(specialTitle);
        powder_special_elem.appendChild(specialEffects);

        parent_elem.appendChild(powder_special_elem);
    }
}

function getSpellCost(stats, spell) {
    return Math.max(1, getBaseSpellCost(stats, spell) * (1 + stats.get('spPct'+spell.base_spell+'Final')/100));
}

function getBaseSpellCost(stats, spell) {
    let cost = spell.cost * (1 - skillPointsToPercentage(stats.get('int')) * skillpoint_final_mult[2]);
    cost += stats.get("spRaw"+spell.base_spell);
    return cost * (1 + stats.get("spPct"+spell.base_spell) / 100);
}
    

function displaySpellDamage(parent_elem, _overallparent_elem, stats, spell, spellIdx, spell_results) {
    // TODO: remove spellIdx (just used to flag melee and cost)
    // TODO: move cost calc out
    parent_elem.textContent = "";

    let title_elem = make_elem("p");

    _overallparent_elem.textContent = "";
    const overallparent_elem = make_elem("div", ['col'])
    let title_elemavg = document.createElement("b");

    if ('cost' in spell) {
        let first = make_elem("span", [], { textContent: spell.name + " (" });
        title_elem.appendChild(first.cloneNode(true)); //cloneNode is needed here.
        title_elemavg.appendChild(first);

        let second = make_elem("span", ["Mana"], { textContent: getSpellCost(stats, spell).toFixed(2) });
        title_elem.appendChild(second.cloneNode(true));
        title_elemavg.appendChild(second);

        let third = make_elem("span", [], { textContent: ")" });// " + getBaseSpellCost(stats, spellIdx, spell.cost) + " ]";
        title_elem.appendChild(third.cloneNode(true));
        title_elemavg.appendChild(third);
    }
    else {
        title_elem.textContent = spell.name;
        title_elemavg.textContent = spell.name;
    }

    parent_elem.append(title_elem);
    overallparent_elem.append(title_elemavg);

    // if ('cost' in spell) {
        // overallparent_elem.append(displayNextCosts(stats, spell, spellIdx));
    // }

    let critChance = skillPointsToPercentage(stats.get('dex'));

    let part_divavg = make_elem("p");
    overallparent_elem.append(part_divavg);

    function add_summary(text, val, fmt) {
        if (typeof(val) === 'number') { val = val.toFixed(2); }
        let summary_elem = make_elem("p");
        summary_elem.append(
            make_elem("span", [], { textContent: text }),
            make_elem("span", [fmt], { textContent: val })
        );
        part_divavg.append(summary_elem);
    }

    for (let i = 0; i < spell_results.length; ++i) {
        const spell_info = spell_results[i];
        if (!spell_info.display) { continue; }

        let part_div = make_elem("p", ["pt-3"]);
        parent_elem.append(part_div);

        part_div.append(make_elem("p", [], { textContent: spell_info.name }));

        if (spell_info.type === "damage") {
            let totalDamNormal = spell_info.normal_total;
            let totalDamCrit = spell_info.crit_total;

            let nonCritAverage = (totalDamNormal[0]+totalDamNormal[1])/2 || 0;
            let critAverage = (totalDamCrit[0]+totalDamCrit[1])/2 || 0;
            let averageDamage = (1-critChance)*nonCritAverage+critChance*critAverage || 0;

            if ('multipliers' in spell_info) {
                let multipliersLabel = make_elem("p", [], {});
                let totalMultiplier = 0;
                for (let i = 0; i < 6; i++) {
                    if (spell_info.multipliers[i] <= 0)
                        continue;

                    totalMultiplier += spell_info.multipliers[i]
                    multipliersLabel.innerHTML += "<span class='" + damageClasses[i] + "'>" + Math.round(spell_info.multipliers[i]*10)/10 +"%</span> "
                }
                multipliersLabel.innerHTML += "<span class='mc-gray'>(" + Math.round(totalMultiplier*10)/10 +"%)</span> "

                if ('is_spell' in spell_info)
                    multipliersLabel.innerHTML += spell_info.is_spell ? " Spell" : " Melee"
                part_div.append(multipliersLabel);
            }

            let averageLabel = make_elem("p", [], { textContent: "Average: "+averageDamage.toFixed(2) });
            // averageLabel.classList.add("damageSubtitle");
            part_div.append(averageLabel);

            if (spell_info.name === spell.display) {
                if (spellIdx === 0) {
                    let display_attack_speeds = ["Super Slow", "Very Slow", "Slow", "Normal", "Fast", "Very Fast", "Super Fast"];
                    let adjAtkSpd = attackSpeeds.indexOf(stats.get("atkSpd")) + stats.get("atkTier");
                    if(adjAtkSpd > 6) {
                        adjAtkSpd = 6;
                    } else if(adjAtkSpd < 0) {
                        adjAtkSpd = 0;
                    }
                    add_summary("Average DPS: ", averageDamage * baseDamageMultiplier[adjAtkSpd], "Damage");
                    add_summary("Attack Speed: ", display_attack_speeds[adjAtkSpd], "Damage");
                    add_summary("Per Attack: ", averageDamage, "Damage");
                }
                else {
                    add_summary(spell_info.name+ ": ", averageDamage, "Damage");
                }
            }
            
            function _damage_display(label_text, average, dmg_min, dmg_max) {
                let label = document.createElement("p");
                label.textContent = label_text+average.toFixed(2);
                part_div.append(label);
                
                for (let i = 0; i < 6; i++){
                    if (dmg_max[i] != 0){
                        let p = document.createElement("p");
                        p.classList.add(damageClasses[i]);
                        p.textContent = dmg_min[i].toFixed(2)+" \u2013 "+dmg_max[i].toFixed(2);
                        part_div.append(p);
                    }
                }
            }
            _damage_display("Non-Crit Average: ", nonCritAverage, spell_info.normal_min, spell_info.normal_max);
            _damage_display("Crit Average: ", critAverage, spell_info.crit_min, spell_info.crit_max);
        } else if (spell_info.type === "heal") {
            let heal_amount = spell_info.heal_amount > 0 ? spell_info.heal_amount : 0;
            let healLabel = make_elem("p", ["Set"], {textContent: heal_amount.toFixed(2)});
            part_div.append(healLabel);
            if (spell_info.name === spell.display) {
                add_summary(spell_info.name+ ": ", heal_amount, "Set");
            }
        }
    }

    addClickableArrow(overallparent_elem, parent_elem);
    _overallparent_elem.append(overallparent_elem);
}

function addClickableArrow(elem, target) {
    //up and down arrow - done ugly
    let arrow = make_elem("img", [], { id: "arrow_" + elem.id, src: "../media/icons/" + (newIcons ? "new" : "old") + "/toggle_down.png" });
    arrow.style.maxWidth = document.body.clientWidth > 900 ? "3rem" : "10rem";
    elem.appendChild(arrow);
    elem.addEventListener("click", () => toggle_spell_tab(arrow, target));
}

// toggle arrow thinger
function toggle_spell_tab(arrow_img, target) {
    if (target.style.display == "none") {
        target.style.display = "";
        arrow_img.src = arrow_img.src.replace("down", "up");
    } else {
        target.style.display = "none";
        arrow_img.src = arrow_img.src.replace("up", "down");
    }
}
