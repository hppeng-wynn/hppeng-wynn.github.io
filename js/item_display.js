/*
 * File for display commands specific to the single item page.
 */

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
    droptype_elem.style.whiteSpace = "pre";

    let item_clone = itemMap.get(item.get("displayName"));

    if(item_clone.dropInfo === undefined){
        droptype_elem.textContent = "Drop type: " + (item.has("drop") ? item.get("drop") : "NEVER");
    }
    else{
        console.log(item_clone.dropInfo);
        droptype_elem.textContent = "Drops from: " + item_clone.dropInfo.name;
        if(item_clone.dropInfo.type !== undefined)
            droptype_elem.textContent += "\nType: " + item_clone.dropInfo.type;
        if(item_clone.dropInfo.coordinates !== undefined)
            droptype_elem.textContent += "\nCoordinates: " + item_clone.dropInfo.coordinates;
    }
    parent_elem.appendChild(droptype_elem);
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

    let table_elem = document.createElement("table");
    parent_elem.appendChild(table_elem);
    for (const [id,val] of Object.entries(itemMap.get(item_name))) {
        if (rolledIDs.includes(id)) {
            if (!item.get("maxRolls").get(id)) { continue; }
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
