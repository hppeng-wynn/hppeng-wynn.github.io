
function apply_elemental_format(p_elem, id, suffix) {
    suffix = (typeof suffix !== 'undefined') ?  suffix : "";
    // THIS IS SO JANK BUT IM TOO LAZY TO FIX IT TODO
    let parts = idPrefixes[id].split(/ (.*)/);
    let element_prefix = parts[0];
    let desc = parts[1];
    let i_elem = make_elem('span', [element_prefix], {textContent: element_prefix});
    p_elem.appendChild(i_elem);

    let i_elem2 = make_elem('span', {textContent: " "+desc+suffix});
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
                                 ["displayName", setName+" Set: "+count+"/"+sets.get(setName).items.length]]);
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
    
    let active_elem;
    let elemental_format = false;

    //TODO this is put here for readability, consolidate with definition in build.js
    let staticIDs = ["hp", "eDef", "tDef", "wDef", "fDef", "aDef"];

    for (const command of display_commands) {
        // style instructions
        
        if (command.charAt(0) === "#") {
            if (command === "#defense-stats") {
                displayDefenseStats(parent_div, stats, true);
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
                    id_val = Math.ceil(id_val*stats.get("poisonPct")/100);
                }
                displayFixedID(parent_div, id, id_val, elemental_format, style);
                if (id === "poison" && id_val > 0) {
                    let row = make_elem('div', ['row']);
                    let value_elem = make_elem('div', ['col', 'text-end']);

                    let prefix_elem = make_elem('b', [], {textContent: "\u279C With Strength: "});
                    let number_elem = make_elem('b', [style], {
                        textContent: (id_val * (1+skillPointsToPercentage(stats.get('str'))) ).toFixed(0) + idSuffixes[id]
                    });
                    value_elem.append(prefix_elem);
                    value_elem.append(number_elem);
                    row.appendChild(value_elem);
                    parent_div.appendChild(row);
                }
                else if (id === "ls" && id_val != 0) {
                    let row = make_elem('div', ['row']);
                    let value_elem = make_elem('div', ['col', 'text-end']);

                    let prefix_elem = make_elem('b', {textContent: "\u279C Effective LS: "});

                    let defStats = getDefenseStats(stats);
                    let number_elem = ('b', [style], {
                        textContent: Math.round(defStats[1][0]*id_val/defStats[0]) + "/3s"
                    });
                    value_elem.append(prefix_elem);
                    value_elem.append(number_elem);
                    row.appendChild(value_elem);
                    parent_div.appendChild(row);
                }
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
    let elemental_format = false;
    for (let i = 0; i < display_commands.length; i++) {
        const command = display_commands[i];
        if (command.charAt(0) === "!") {
            // TODO: This is sooo incredibly janky.....
            if (command === "!elemental") {
                elemental_format = !elemental_format;
            }
            else if (command === "!spacer") {
                let spacer = document.createElement('div');
                spacer.classList.add("row", "my-2");
                parent_div.appendChild(spacer);
                continue;
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
                    let p_elem = document.createElement("div");
                    p_elem.classList.add("col");
                    
                    // PROPER POWDER DISPLAYING
                    let numerals = new Map([[1, "I"], [2, "II"], [3, "III"], [4, "IV"], [5, "V"], [6, "VI"]]);

                    let powderPrefix = document.createElement("b");
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
                    powderSuffix.textContent = "]";
                    p_elem.appendChild(powderSuffix);
                    parent_div.appendChild(p_elem);
                } else if (id === "set") {
                    if (item.get("hideSet")) { continue; }

                    let p_elem = document.createElement("div");
                    p_elem.classList.add("col");
                    p_elem.textContent = "Set: " + item.get(id).toString();
                    parent_div.appendChild(p_elem);
                } else if (id === "majorIds") {
                    //console.log(item.get(id));
                    for (let majorID of item.get(id)) {
                        let p_elem = document.createElement("div");
                        p_elem.classList.add("col");

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
                        parent_div.appendChild(p_elem);
                    }
                } else if (id === "lvl" && item.get("tier") === "Crafted") {
                    let p_elem = document.createElement("div");
                    p_elem.classList.add("col");
                    p_elem.textContent = "Combat Level Min: " + item.get("lvlLow") + "-" + item.get(id);
                    parent_div.appendChild(p_elem);
                } else if (id === "displayName") {
                    let row = document.createElement("div");

                    let a_elem = document.createElement("a");
                    row.classList.add("row", "justify-content-center");
                    a_elem.classList.add("col-auto", "text-center", "item-title", "p-0");
                    a_elem.classList.add(item.has("tier") ? item.get("tier").replace(" ","") : "Normal");
                    // a_elem.style.textGrow = 1;
                    
                    row.appendChild(a_elem);

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

                    if (item.get("custom")) {
                        a_elem.href = "../custom/#" + item.get("hash");
                        a_elem.textContent = item.get("displayName");
                    } else if (item.get("crafted")) {
                        a_elem.href = "../crafter/#" + item.get("hash");
                        a_elem.textContent = item.get(id);
                    } else {
                        a_elem.href = "../item/#" + item.get("displayName");
                        a_elem.textContent = item.get("displayName");
                    }
                    parent_div.appendChild(row);

                    let nolink_row = document.createElement("div");
                    let p_elem = document.createElement("p");
                    nolink_row.classList.add("row", "justify-content-center");
                    nolink_row.style.display = "none";
                    p_elem.classList.add("col-auto", "text-center", "item-title", "p-0");
                    p_elem.classList.add(item.has("tier") ? item.get("tier").replace(" ","") : "Normal");
                    if (item.get("custom")) {
                        p_elem.textContent = item.get("displayName");
                    } else if (item.get("crafted")) {
                        p_elem.textContent = item.get(id);
                    } else {
                        p_elem.textContent = item.get("displayName");
                    }
                    
                    nolink_row.appendChild(p_elem);
                    parent_div.appendChild(nolink_row);

                    let img = document.createElement("img");
                    if (item && item.has("type")) {
                        img.src = "../media/items/" + (newIcons ? "new/":"old/") + "generic-" + item.get("type") + ".png";
                        img.alt = item.get("type");
                        img.style = " z=index: 1; position: relative;";
                        let container = document.createElement("div");
                        
                        let bckgrd = document.createElement("div");
                        bckgrd.classList.add("col", "px-0", "d-flex", "align-items-center", "justify-content-center");// , "no-collapse");
                        bckgrd.style = "border-radius: 50%;background-image: radial-gradient(closest-side, " + colorMap.get(item.get("tier")) + " 20%," + "hsl(0, 0%, 16%) 80%); margin-left: auto; margin-right: auto;"
                        bckgrd.classList.add("scaled-bckgrd");
                        parent_div.appendChild(container);
                        container.appendChild(bckgrd);
                        bckgrd.appendChild(img);
                    }
                } else {
                    if (id.endsWith('Dam_')) {
                        // TODO: kinda jank but replacing lists with txt at this step
                        let damages = item.get(id);
                        if (item.get("tier") !== "Crafted") {
                            damages = damages.map(x => Math.round(x));
                            item.set(id, damages[0]+"-"+damages[1]);
                        }
                        else {
                            damages = damages.map(x => x.map(y => Math.round(y)));
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
                            row = document.createElement("div");
                            row.classList.add("col");
                            
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
            }else{
              // :/  
            }
        }
    }
    //Show powder specials ;-;
    let nonConsumables = ["relik", "wand", "bow", "spear", "dagger", "chestplate", "helmet", "leggings", "boots"];//, "ring", "bracelet", "necklace"];
    if(nonConsumables.includes(item.get("type"))) {
        let powder_special = document.createElement("div");
        powder_special.classList.add("col");
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
            let specialTitle = document.createElement("span");
            let specialEffects = document.createElement("span");
            addClasses(specialTitle, [damageClasses[skp_elements.indexOf(element) + 1]]);
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
                    effect.classList.add("m-0");
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
        let dura_elem = document.createElement("div");
        dura_elem.classList.add("col");
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
            parent_div.appendChild(charges);
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
        let item_desc_elem = document.createElement("div");
        item_desc_elem.classList.add("col");
        item_desc_elem.classList.add(item.get("tier"));
        if (tome_types.includes(item.get("type"))) {
            tome_type_map = new Map([["weaponTome", "Weapon Tome"],["armorTome", "Armor Tome"],["guildTome", "Guild Tome"]]);
            item_desc_elem.textContent = item.get("tier")+" "+tome_type_map.get(item.get("type"));
        } else {
            item_desc_elem.textContent = item.get("tier")+" "+item.get("type");
        }
        parent_div.append(item_desc_elem);
    }

    //Show item hash if applicable
    if (item.get("crafted") || item.get("custom")) {
        let item_desc_elem = document.createElement("p");
        item_desc_elem.classList.add('itemp');
        item_desc_elem.style.maxWidth = "100%";
        item_desc_elem.style.wordWrap = "break-word";
        item_desc_elem.style.wordBreak = "break-word";
        item_desc_elem.textContent = item.get("hash");
        parent_div.append(item_desc_elem);
    }

    if (item.get("category") === "weapon") { 
        let total_damages = item.get("basedps");
        let base_dps_elem = document.createElement("p");
        base_dps_elem.classList.add("left");
        base_dps_elem.classList.add("itemp");
        if (item.get("tier") === "Crafted") {
            let base_dps_min = total_damages[0];
            let base_dps_max = total_damages[1];

            base_dps_elem.textContent = "Base DPS: "+base_dps_min.toFixed(3)+"\u279c"+base_dps_max.toFixed(3);
        }
        else {
            base_dps_elem.textContent = "Base DPS: "+(total_damages);
        }
        parent_div.appendChild(document.createElement("p"));
        parent_div.appendChild(base_dps_elem);
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
                spacer.classList.add("row", "my-2");
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
    }else { //do math
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

function displayPoisonDamage(overallparent_elem, build) {
    overallparent_elem.textContent = "";

    //Title
    let title_elemavg = document.createElement("b");
    title_elemavg.textContent = "Poison Stats";
    overallparent_elem.append(title_elemavg);

    let overallpoisonDamage = document.createElement("p");
    let overallpoisonDamageFirst = document.createElement("span");
    let overallpoisonDamageSecond = document.createElement("span");
    let poison_tick = Math.ceil(build.statMap.get("poison") * (1+skillPointsToPercentage(build.total_skillpoints[0])) * (build.statMap.get("poisonPct"))/100 /3);
    overallpoisonDamageFirst.textContent = "Poison Tick: ";
    overallpoisonDamageSecond.textContent = Math.max(poison_tick,0);
    overallpoisonDamageSecond.classList.add("Damage");

    overallpoisonDamage.appendChild(overallpoisonDamageFirst);
    overallpoisonDamage.appendChild(overallpoisonDamageSecond);
    overallparent_elem.append(overallpoisonDamage);
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

function displayMeleeDamage(parent_elem, overallparent_elem, meleeStats) {
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
    for (let i = 8; i < 11; ++i) {
        stats[i] = stats[i].toFixed(2);
    }
    
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
    for (let i = 0; i < 6; i++) {
        if (stats[i][1] != 0) {
            let dmg = document.createElement("p");
            dmg.textContent = stats[i][0] + " \u2013 " + stats[i][1];
            dmg.classList.add(damageClasses[i]);
            dmg.classList.add("itemp");
            nonCritStats.append(dmg);
        }
    }

    let normalDamage = document.createElement("p");
    normalDamage.textContent = "Total: " + stats[6][0] + " \u2013 " + stats[6][1];
    nonCritStats.append(normalDamage);

    let normalDPS = document.createElement("p");
    normalDPS.textContent = "Normal DPS: " + stats[8];
    nonCritStats.append(normalDPS);

    //overall average DPS
    let singleHitDamage = document.createElement("p");
    let singleHitDamageFirst = document.createElement("span");
    singleHitDamageFirst.textContent = "Single Hit Average: ";
    let singleHitDamageSecond = document.createElement("span");
    singleHitDamageSecond.classList.add("Damage");
    singleHitDamageSecond.textContent = stats[12].toFixed(2);
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
            critStats.append(dmg);
        }
    }
    let critDamage = document.createElement("p");
    critDamage.textContent = "Total: " + stats[7][0] + " \u2013 " + stats[7][1];
    critStats.append(critDamage);

    let critDPS = document.createElement("p");
    critDPS.textContent = "Crit DPS: " + stats[9];
    critStats.append(critDPS);

    let critChance = document.createElement("p");
    critChance.textContent = "Crit Chance: " + (stats[7][2]*100).toFixed(2) + "%";
    critChance.append(document.createElement("br"));
    critChance.append(document.createElement("br"));
    critStats.append(critChance);

    parent_elem.append(critStats);
    addClickableArrow(overallparent_elem, parent_elem);
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

        let defRaw = statMap.get(skp_elements[i]+"Def");
        let defPct = statMap.get(skp_elements[i]+"DefPct")/100;
        if (defRaw < 0) {
            defPct >= 0 ? defPct = "- " + defPct: defPct = "+ " + defPct;
        } else {
            defPct >= 0 ? defPct = "+ " + defPct: defPct = "- " + defPct;
        }
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

function displayPowderSpecials(parent_elem, powderSpecials, stats, weapon, overall=false) {
    const skillpoints = [
        stats.get('str'),
        stats.get('dex'),
        stats.get('int'),
        stats.get('def'),
        stats.get('agi')
    ];
    parent_elem.textContent = ""
    let title = document.createElement("b");
    title.textContent = "Powder Specials";
    parent_elem.appendChild(title);
    let specials = powderSpecials.slice();
    let expandedStats = new Map();
    //each entry of powderSpecials is [ps, power]
    for (special of specials) {
        //iterate through the special and display its effects.
        let powder_special = document.createElement("p");
        let specialSuffixes = new Map([ ["Duration", " sec"], ["Radius", " blocks"], ["Chains", ""], ["Damage", "%"], ["Damage Boost", "%"], ["Knockback", " blocks"] ]);
        let specialTitle = document.createElement("p");
        let specialEffects = document.createElement("p");
        specialTitle.classList.add(damageClasses[powderSpecialStats.indexOf(special[0]) + 1]);
        let effects = special[0]["weaponSpecialEffects"];
        let power = special[1];
        specialTitle.textContent = special[0]["weaponSpecialName"] + " " + Math.floor((power-1)*0.5 + 4) + (power % 2 == 0 ? ".5" : "");  

        if (!overall || powderSpecialStats.indexOf(special[0]) == 2 || powderSpecialStats.indexOf(special[0]) == 3 || powderSpecialStats.indexOf(special[0]) == 4) {
            for (const [key,value] of effects) {
                let effect = document.createElement("p");
                effect.textContent += key + ": " + value[power-1] + specialSuffixes.get(key);
                if(key === "Damage"){
                    effect.textContent += elementIcons[powderSpecialStats.indexOf(special[0])];
                }
                if(special[0]["weaponSpecialName"] === "Wind Prison" && key === "Damage Boost") {
                    effect.textContent += " (only 1st hit)";
                }
                specialEffects.appendChild(effect);
            }
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

            let tmp_conv = [];
            for (let i in part.conversion) {
                tmp_conv.push(part.conversion[i] * part.multiplier[power-1] / 100);
            }
            console.log(tmp_conv);
            let _results = calculateSpellDamage(stats, weapon, tmp_conv, false, true);

            let critChance = skillPointsToPercentage(skillpoints[1]);
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

            let averageWrap = document.createElement("p");
            let averageLabel = document.createElement("span");
            averageLabel.textContent = "Average: ";
            
            let averageLabelDmg = document.createElement("span");
            averageLabelDmg.classList.add("Damage");
            averageLabelDmg.textContent = averageDamage.toFixed(2);

            averageWrap.appendChild(averageLabel);
            averageWrap.appendChild(averageLabelDmg);
            specialDamage.appendChild(averageWrap);
            
            if (!overall) {
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
            }

            powder_special.append(specialDamage);
        } 

        parent_elem.appendChild(powder_special);
    }
}

function getSpellCost(stats, spell) {
    return Math.max(1, getBaseSpellCost(stats, spell));
}

function getBaseSpellCost(stats, spell) {
                            // old intelligence:
    let cost = Math.ceil(spell.cost * (1 - skillPointsToPercentage(stats.get('int')) * skillpoint_final_mult[2]));
    cost += stats.get("spRaw"+spell.base_spell);
    return Math.floor(cost * (1 + stats.get("spPct"+spell.base_spell) / 100));
}
    

function displaySpellDamage(parent_elem, overallparent_elem, stats, spell, spellIdx, spell_results) {
    // TODO: remove spellIdx (just used to flag melee and cost)
    // TODO: move cost calc out
    parent_elem.textContent = "";

    let title_elem = document.createElement("p");

    overallparent_elem.textContent = "";
    let title_elemavg = document.createElement("b");

    if ('cost' in spell) {
        let first = document.createElement("span");
        first.textContent = spell.name + " (";
        title_elem.appendChild(first.cloneNode(true)); //cloneNode is needed here.
        title_elemavg.appendChild(first);

        let second = document.createElement("span");
        second.textContent = getSpellCost(stats, spell);
        second.classList.add("Mana");

        title_elem.appendChild(second.cloneNode(true));
        title_elemavg.appendChild(second);
        

        let third = document.createElement("span");
        third.textContent = ")";// [Base: " + getBaseSpellCost(stats, spellIdx, spell.cost) + " ]";
        title_elem.appendChild(third);
        let third_summary = document.createElement("span");
        third_summary.textContent = ")";
        title_elemavg.appendChild(third_summary);
    }
    else {
        title_elem.textContent = spell.name;
        title_elemavg.textContent = spell.name;
    }

    parent_elem.append(title_elem);
    overallparent_elem.append(title_elemavg);

    // if ('cost' in spell) {
    // :( ...... ?
    //     overallparent_elem.append(displayNextCosts(stats, spell, spellIdx));
    // }

    let critChance = skillPointsToPercentage(stats.get('dex'));

    let part_divavg = document.createElement("p");
    overallparent_elem.append(part_divavg);

    function _summary(text, val, fmt) {
        let overallaverageLabel = document.createElement("p");
        let first = document.createElement("span");
        let second = document.createElement("span");
        first.textContent = text;
        second.textContent = val.toFixed(2);
        overallaverageLabel.appendChild(first);
        overallaverageLabel.appendChild(second);
        second.classList.add(fmt);
        part_divavg.append(overallaverageLabel);
    }

    for (let i = 0; i < spell_results.length; ++i) {
        const spell_info = spell_results[i];

        let part_div = document.createElement("p");
        parent_elem.append(part_div);

        let subtitle_elem = document.createElement("p");
        subtitle_elem.textContent = spell_info.name
        part_div.append(subtitle_elem);

        if (spell_info.type === "damage") {
            let totalDamNormal = spell_info.normal_total;
            let totalDamCrit = spell_info.crit_total;

            let nonCritAverage = (totalDamNormal[0]+totalDamNormal[1])/2 || 0;
            let critAverage = (totalDamCrit[0]+totalDamCrit[1])/2 || 0;
            let averageDamage = (1-critChance)*nonCritAverage+critChance*critAverage || 0;

            let averageLabel = document.createElement("p");
            averageLabel.textContent = "Average: "+averageDamage.toFixed(2);
            // averageLabel.classList.add("damageSubtitle");
            part_div.append(averageLabel);


            if (spell_info.name === spell.display) {
                _summary(spell_info.name+ ": ", averageDamage, "Damage");
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
            let heal_amount = spell_info.heal_amount;
            let healLabel = document.createElement("p");
            healLabel.textContent = heal_amount;
            // healLabel.classList.add("damagep");
            part_div.append(healLabel);
            if (spell_info.name === spell.display) {
                _summary(spell_info.name+ ": ", heal_amount, "Set");
            }
        }
    }

    addClickableArrow(overallparent_elem, parent_elem);
}

/** Displays the ID costs of an item
 * 
 * @param {String} elemID - the id of the parent element.
 * @param {Map} item - the statMap of an item. 
 */
function displayIDCosts(elemID, item) {
    let parent_elem = document.getElementById(elemID);
    let tier = item.get("tier");
    if ( (item.has("fixID") && item.get("fixID")) || ["Normal","Crafted","Custom","none", " ",].includes(item.get("tier"))) {
        return;
    } else {
        /** Returns the number of inventory slots minimum an amount of emeralds would take up + the configuration of doing so.
         * Returns an array of [invSpace, E, EB, LE, Stx LE]
         * 
         * @param {number} ems - the total numerical value of emeralds to compact.
         */
        function emsToInvSpace(ems) {
            let stx = Math.floor(ems/262144);
            ems -= stx*4096*64;
            let LE = Math.floor(ems/4096);
            ems -= LE*4096;
            let EB = Math.floor(ems/64);
            ems -= EB*64;
            let e = ems;
            return [ stx + Math.ceil(LE/64) + Math.ceil(EB/64) + Math.ceil(e/64) , e, EB, LE, stx];
        }
        /**
         * 
         * @param {String} tier - item tier
         * @param {Number} lvl - item level 
         */
        function getIDCost(tier, lvl) {
            switch (tier) {
                case "Unique":
                    return Math.round(0.5*lvl + 3);
                case "Rare":
                    return Math.round(1.2*lvl + 8);
                case "Legendary":
                    return Math.round(4.5*lvl + 12);
                case "Fabled":
                    return Math.round(12*lvl + 26);
                case "Mythic":
                    return Math.round(18*lvl + 90);
                case "Set":
                    return Math.round(1.5*lvl + 8)
                default:
                    return -1;
            }
        }

        parent_elem.style = "display: visible";
        let lvl = item.get("lvl");
        if (typeof(lvl) === "string") { lvl = parseFloat(lvl); }
        
        let title_elem = document.createElement("p");
        title_elem.classList.add("smalltitle");
        title_elem.style.color = "white";
        title_elem.textContent = "Identification Costs";
        parent_elem.appendChild(title_elem);
        parent_elem.appendChild(document.createElement("br"));

        let grid_item = document.createElement("div");
        grid_item.style.display = "flex";
        grid_item.style.flexDirection = "rows";
        grid_item.style.flexWrap = "wrap";
        grid_item.style.gap = "5px";
        parent_elem.appendChild(grid_item);

        let IDcost = getIDCost(tier, lvl);
        let initIDcost = IDcost;
        let invSpace = emsToInvSpace(IDcost);
        let rerolls = 0;

        while(invSpace[0] <= 28 && IDcost > 0) {
            let container = document.createElement("div");
            container.classList.add("container");
            container.style = "grid-item-" + (rerolls+1);
            container.style.maxWidth = "max(120px, 15%)";
            
            let container_title = document.createElement("p");
            container_title.style.color = "white";
            if (rerolls == 0) {
                container_title.textContent = "Initial ID Cost: ";
            } else {
                container_title.textContent = "Reroll to [" + (rerolls+1) + "] Cost:";
            }
            container.appendChild(container_title);
            let total_cost_container = document.createElement("p");
            let total_cost_number = document.createElement("b");
            total_cost_number.classList.add("Set");
            total_cost_number.textContent = IDcost + " ";
            let total_cost_suffix = document.createElement("b");
            total_cost_suffix.textContent = "emeralds."
            total_cost_container.appendChild(total_cost_number);
            total_cost_container.appendChild(total_cost_suffix);
            container.appendChild(total_cost_container);

            let OR = document.createElement("p");
            OR.classList.add("center");
            OR.textContent = "OR";
            container.appendChild(OR);

            let esuffixes = ["", "emeralds.", "EB.", "LE.", "stacks of LE."];
            for (let i = 4; i > 0; i--) {
                let n_container = document.createElement("p");
                let n_number = document.createElement("b");
                n_number.classList.add("Set");
                n_number.textContent = invSpace[i] + " ";
                let n_suffix = document.createElement("b");
                n_suffix.textContent = esuffixes[i];
                n_container.appendChild(n_number);
                n_container.appendChild(n_suffix);
                container.appendChild(n_container);
            }
            grid_item.appendChild(container);
            
            rerolls += 1;
            IDcost = Math.round(initIDcost * (5 ** rerolls));
            invSpace = emsToInvSpace(IDcost);
        }
    }
}

/** Displays Additional Info for 
 * 
 * @param {String} elemID - the parent element's id 
 * @param {Map} item - the statMap of the item
 * @returns 
 */
function displayAdditionalInfo(elemID, item) {
    let parent_elem = document.getElementById(elemID);
    parent_elem.classList.add("left");

    let droptype_elem = document.createElement("div");
    droptype_elem.classList.add("container");
    droptype_elem.style.marginBottom = "5px";
    droptype_elem.textContent = "Drop type: " + (item.has("drop") ? item.get("drop"): "NEVER");
    parent_elem.appendChild(droptype_elem);

    let warning_elem = document.createElement("div");
    warning_elem.classList.add("container");
    warning_elem.style.marginBottom ="5px";
    warning_elem.textContent = "This page is incomplete. Will work on it later.";
    parent_elem.appendChild(warning_elem);

    return;
}


/** Displays the individual probabilities of each possible value of each rollable ID for this item.
 * 
 * @param {String} parent_id the document id of the parent element
 * @param {String} item expandedItem object
 * @param {String} amp the level of corkian amplifier used. 0 means no amp, 1 means Corkian Amplifier I, etc. [0,3]
 */
function displayIDProbabilities(parent_id, item, amp) {
    if (item.has("fixID") && item.get("fixID")) {return}
    let parent_elem = document.getElementById(parent_id);
    parent_elem.style.display = "";
    parent_elem.innerHTML = "";
    let title_elem = document.createElement("p");
    title_elem.textContent = "Identification Probabilities";
    title_elem.id = "ID_PROB_TITLE";
    title_elem.classList.add("Legendary");
    title_elem.classList.add("title");
    parent_elem.appendChild(title_elem);
    
    let disclaimer_elem = document.createElement("p");
    disclaimer_elem.textContent = "IDs are rolled on a uniform distribution. A chance of 0% means that either the minimum or maximum possible multiplier must be rolled to get this value."
    parent_elem.appendChild(disclaimer_elem);

    let amp_row = document.createElement("p");
    amp_row.id = "amp_row";
    let amp_text = document.createElement("b");
    amp_text.textContent = "Corkian Amplifier Used: "
    amp_row.appendChild(amp_text);
    let amp_1 = document.createElement("button");
    amp_1.id = "cork_amp_1";
    amp_1.textContent = "I";
    amp_row.appendChild(amp_1);
    let amp_2 = document.createElement("button");
    amp_2.id = "cork_amp_2";
    amp_2.textContent = "II";
    amp_row.appendChild(amp_2);
    let amp_3 = document.createElement("button");
    amp_3.id = "cork_amp_3";
    amp_3.textContent = "III";
    amp_row.appendChild(amp_3);
    amp_1.addEventListener("click", (event) => {toggleAmps(1)});
    amp_2.addEventListener("click", (event) => {toggleAmps(2)});
    amp_3.addEventListener("click", (event) => {toggleAmps(3)});
    parent_elem.appendChild(amp_row);
    
    if (amp != 0) {toggleButton("cork_amp_" + amp)}

    let item_name = item.get("displayName");
    console.log(itemMap.get(item_name))
    
    let table_elem = document.createElement("table");
    parent_elem.appendChild(table_elem);
    for (const [id,val] of Object.entries(itemMap.get(item_name))) {
        if (rolledIDs.includes(id)) {
            let min = item.get("minRolls").get(id);
            let max = item.get("maxRolls").get(id);
            //Apply corkian amps
            if (val > 0) {
                let base = itemMap.get(item_name)[id];
                if (reversedIDs.includes(id)) {max = Math.max( Math.round((0.3 + 0.05*amp) * base), 1)} 
                else {min = Math.max( Math.round((0.3 + 0.05*amp) * base), 1)}
            }

            let row_title = document.createElement("tr");
            //row_title.style.textAlign = "left";
            let title_left = document.createElement("td");
            let left_elem = document.createElement("p");
            let left_val_title = document.createElement("b");
            let left_val_elem = document.createElement("b");
            title_left.style.textAlign = "left";
            left_val_title.textContent = idPrefixes[id] + "Base ";
            left_val_elem.textContent = val + idSuffixes[id];
            if (val > 0 == !reversedIDs.includes(id)) {
                left_val_elem.classList.add("positive");
            } else if (val > 0 == reversedIDs.includes(id)) {
                left_val_elem.classList.add("negative");
            }
            left_elem.appendChild(left_val_title);
            left_elem.appendChild(left_val_elem);
            title_left.appendChild(left_elem);
            row_title.appendChild(title_left);

            let title_right = document.createElement("td");
            let title_right_text = document.createElement("b");
            title_right.style.textAlign = "left";
            title_right_text.textContent = "[ " + min + idSuffixes[id] + ", " + max + idSuffixes[id] + " ]";
            if ( (min > 0 && max > 0 && !reversedIDs.includes(id)) || (min < 0 && max < 0 && reversedIDs.includes(id)) ) {
                title_right_text.classList.add("positive");
            } else if ( (min < 0 && max < 0 && !reversedIDs.includes(id)) || (min > 0 && max > 0 && reversedIDs.includes(id)) ) {
                title_right_text.classList.add("negative");
            }
            title_right.appendChild(title_right_text);

            let title_input = document.createElement("td");
            let title_input_slider = document.createElement("input");
            title_input_slider.type = "range";
            title_input_slider.id = id+"-slider";
            if (!reversedIDs.includes(id)) {
                title_input_slider.step = 1;
                title_input_slider.min = `${min}`;
                title_input_slider.max = `${max}`;
                title_input_slider.value = `${max}`;
            } else {
                title_input_slider.step = 1;
                title_input_slider.min = `${-1*min}`;
                title_input_slider.max = `${-1*max}`;
                title_input_slider.value = `${-1*max}`;
            }
            let title_input_textbox = document.createElement("input");
            title_input_textbox.type = "text";
            title_input_textbox.value = `${max}`;
            title_input_textbox.id = id+"-textbox";
            title_input_textbox.classList.add("small-input");
            title_input.appendChild(title_input_slider);
            title_input.appendChild(title_input_textbox);
            
            row_title.appendChild(title_left);
            row_title.appendChild(title_right);
            row_title.appendChild(title_input);

            let row_chances = document.createElement("tr");
            let chance_cdf = document.createElement("td");
            let chance_pdf = document.createElement("td");
            let cdf_p = document.createElement("p");
            cdf_p.id = id+"-cdf";
            let pdf_p = document.createElement("p");
            pdf_p.id = id+"-pdf";

            chance_cdf.appendChild(cdf_p);
            chance_pdf.appendChild(pdf_p);
            row_chances.appendChild(chance_cdf);
            row_chances.appendChild(chance_pdf);

            table_elem.appendChild(row_title);
            table_elem.appendChild(row_chances);

            

            stringPDF(id, max, val, amp); //val is base roll
            stringCDF(id, max, val, amp); //val is base roll
            title_input_slider.addEventListener("change", (event) => {
                let id_name = event.target.id.split("-")[0];
                let textbox_elem = document.getElementById(id_name+"-textbox");

                if (reversedIDs.includes(id_name)) {
                    if (event.target.value < -1*min) { event.target.value = -1*min}
                    if (event.target.value > -1*max) { event.target.value = -1*max}
                    stringPDF(id_name, -1*event.target.value, val, amp); //val is base roll
                    stringCDF(id_name, -1*event.target.value, val, amp); //val is base roll
                } else {    
                    if (event.target.value < min) { event.target.value = min}
                    if (event.target.value > max) { event.target.value = max}
                    stringPDF(id_name, 1*event.target.value, val, amp); //val is base roll
                    stringCDF(id_name, 1*event.target.value, val, amp); //val is base roll
                }

                if (textbox_elem && textbox_elem.value !== event.target.value) {
                    if (reversedIDs.includes(id_name)) {
                        textbox_elem.value = -event.target.value;
                    } else {
                        textbox_elem.value = event.target.value;
                    }
                }
                
                
            });
            title_input_textbox.addEventListener("change", (event) => {
                let id_name = event.target.id.split("-")[0];
                if (reversedIDs.includes(id_name)) {
                    if (event.target.value > min) { event.target.value = min}
                    if (event.target.value < max) { event.target.value = max}
                } else {    
                    if (event.target.value < min) { event.target.value = min}
                    if (event.target.value > max) { event.target.value = max}
                }
                let slider_elem = document.getElementById(id_name+"-slider");
                if (slider_elem.value !== event.target.value) {
                    slider_elem.value = -event.target.value;    
                }

                stringPDF(id_name, 1*event.target.value, val, amp); 
                stringCDF(id_name, 1*event.target.value, val, amp); 
            });
        }
    }
}

//helper functions. id - the string of the id's name, val - the value of the id, base - the base value of the item for this id
function stringPDF(id,val,base,amp) {
    /** [0.3b,1.3b] positive normal
     *  [1.3b,0.3b] positive reversed
     *  [1.3b,0.7b] negative normal
     *  [0.7b,1.3b] negative reversed
     * 
     *  [0.3, 1.3] minr, maxr [0.3b, 1.3b] min, max
     *  the minr/maxr decimal roll that corresponds to val -> minround, maxround
     */
    let p; let min; let max; let minr; let maxr; let minround; let maxround;
    if (base > 0) {
        minr = 0.3 + 0.05*amp; maxr = 1.3;
        min = Math.max(1, Math.round(minr*base)); max = Math.max(1, Math.round(maxr*base));
        minround = (min == max) ? (minr) : ( Math.max(minr, (val-0.5) / base) );
        maxround = (min == max) ? (maxr) : ( Math.min(maxr, (val+0.5) / base) );
    } else {
        minr = 1.3; maxr = 0.7;
        min = Math.min(-1, Math.round(minr*base)); max = Math.min(-1, Math.round(maxr*base));
        minround = (min == max) ? (minr) : ( Math.min(minr, (val-0.5) / base) );
        maxround = (min == max) ? (maxr) : ( Math.max(maxr, (val+0.5) / base) );
    }
    
    p = Math.abs(maxround-minround)/Math.abs(maxr-minr)*100;
    p = p.toFixed(3);

    let b1 = document.createElement("b");
    b1.textContent = "Roll exactly ";
    let b2 = document.createElement("b");
    b2.textContent = val + idSuffixes[id];
    if (val > 0 == !reversedIDs.includes(id)) {b2.classList.add("positive")}
    if (val > 0 == reversedIDs.includes(id)) {b2.classList.add("negative")}
    let b3 = document.createElement("b");
    b3.textContent = ": " + p + "%";
    document.getElementById(id + "-pdf").innerHTML = "";
    document.getElementById(id + "-pdf").appendChild(b1);
    document.getElementById(id + "-pdf").appendChild(b2);
    document.getElementById(id + "-pdf").appendChild(b3);
}

function stringCDF(id,val,base,amp) {
    let p; let min; let max; let minr; let maxr; let minround; let maxround;
    if (base > 0) {
        minr = 0.3 + 0.05*amp; maxr = 1.3;
        min = Math.max(1, Math.round(minr*base)); max = Math.max(1, Math.round(maxr*base));
        minround = (min == max) ? (minr) : ( Math.max(minr, (val-0.5) / base) );
        maxround = (min == max) ? (maxr) : ( Math.min(maxr, (val+0.5) / base) );
    } else {
        minr = 1.3; maxr = 0.7;
        min = Math.min(-1, Math.round(minr*base)); max = Math.min(-1, Math.round(maxr*base));
        minround = (min == max) ? (minr) : ( Math.min(minr, (val-0.5) / base) );
        maxround = (min == max) ? (maxr) : ( Math.max(maxr, (val+0.5) / base) );
    }

    if (reversedIDs.includes(id)) {
        p = Math.abs(minr-maxround)/Math.abs(maxr-minr)*100;
    } else {
        p = Math.abs(maxr-minround)/Math.abs(maxr-minr)*100;
    }
    p = p.toFixed(3);
    
    let b1 = document.createElement("b");
    b1.textContent = "Roll ";
    let b2 = document.createElement("b");
    b2.textContent = val + idSuffixes[id];
    if (val > 0 == !reversedIDs.includes(id)) {b2.classList.add("positive")}
    if (val > 0 == reversedIDs.includes(id)) {b2.classList.add("negative")}
    let b3 = document.createElement("b");
    b3.textContent= " or better: " + p + "%";
    document.getElementById(id + "-cdf").innerHTML = "";
    document.getElementById(id + "-cdf").appendChild(b1);
    document.getElementById(id + "-cdf").appendChild(b2);
    document.getElementById(id + "-cdf").appendChild(b3);
}

function addClickableArrow(elem, target) {
    //up and down arrow - done ugly
    let arrow = document.createElement("img");
    arrow.id = "arrow_" + elem.id;
    arrow.style.maxWidth = document.body.clientWidth > 900 ? "3rem" : "10rem";
    arrow.src = "../media/icons/" + (newIcons ? "new" : "old") + "/toggle_down.png";
    elem.appendChild(arrow);
    arrow.addEventListener("click", () => toggle_spell_tab(arrow, target));
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
