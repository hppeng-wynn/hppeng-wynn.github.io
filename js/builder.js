let build_powders;

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
        const encodedBuild = encodeBuild(player_build);
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
    for (const i of powder_inputs) {
        setValue(i, "");
    }
    for (const i of equipment_inputs) {
        setValue(i, "");
    }
    setValue("str-skp", "0");
    setValue("dex-skp", "0");
    setValue("int-skp", "0");
    setValue("def-skp", "0");
    setValue("agi-skp", "0");
    for (const special_name of specialNames) {
        for (let i = 1; i < 6; i++) { //toggle all pressed buttons of the same powder special off
            //name is same, power is i
            let elem = document.getElementById(special_name.replace(" ", "_")+'-'+i);
            if (elem.classList.contains("toggleOn")) {
                elem.classList.remove("toggleOn");
            }
        }
    }
    for (const [key, value] of damageMultipliers) {
        let elem = document.getElementById(key + "-boost")
        if (elem.classList.contains("toggleOn")) {
            elem.classList.remove("toggleOn");
        }
    }
    for (const elem of skp_order) {
        console.log(document.getElementById(elem + "_boost_armor").value);
        document.getElementById(elem + "_boost_armor").value = 0;
        document.getElementById(elem + "_boost_armor_prev").value = 0;
        document.getElementById(elem + "_boost_armor").style.background = `linear-gradient(to right, #AAAAAA, #AAAAAA 0%, #AAAAAA 100%)`;
        document.getElementById(elem + "_boost_armor_label").textContent = `% ${damageClasses[skp_order.indexOf(elem)+1]} Damage Boost: 0`;
    }

    const nodes_to_reset = item_nodes.concat(powder_nodes).concat(edit_input_nodes).concat([powder_special_input, boosts_node, armor_powder_node]);
    for (const node of nodes_to_reset) {
        node.mark_dirty();
    }

    for (const node of nodes_to_reset) {
        node.update();
    }

    setValue("level-choice", "106");
    location.hash = "";
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

// toggle tab
function toggle_tab(tab) {
    if (document.querySelector("#"+tab).style.display == "none") {
        document.querySelector("#"+tab).style.display = "";
    } else {
        document.querySelector("#"+tab).style.display = "none";
    }
}

// toggle spell arrow
function toggle_spell_tab(tab) {
    let arrow_img = document.querySelector("#" + "arrow_" + tab + "Avg");
    if (document.querySelector("#"+tab).style.display == "none") {
        document.querySelector("#"+tab).style.display = "";
        arrow_img.src = arrow_img.src.replace("down", "up");
    } else {
        document.querySelector("#"+tab).style.display = "none";
        arrow_img.src = arrow_img.src.replace("up", "down");
    }
}

function toggle_boost_tab(tab) {
    for (const i of skp_order) {
        document.querySelector("#"+i+"-boost").style.display = "none";
        document.getElementById(i + "-boost-tab").classList.remove("selected-btn");
    }
    document.querySelector("#"+tab+"-boost").style.display = "";
    document.getElementById(tab + "-boost-tab").classList.add("selected-btn");

}

let tabs = ['overall-stats', 'offensive-stats', 'defensive-stats'];
function show_tab(tab) {
    //console.log(itemFilters)

    //hide all tabs, then show the tab of the div clicked and highlight the correct button
    for (const i in tabs) {
        document.querySelector("#" + tabs[i]).style.display = "none";
        document.getElementById("tab-" + tabs[i].split("-")[0] + "-btn").classList.remove("selected-btn");
    }
    document.querySelector("#" + tab).style.display = "";
    document.getElementById("tab-" + tab.split("-")[0] +  "-btn").classList.add("selected-btn");
}

// autocomplete initialize
function init_autocomplete() {
    let dropdowns = new Map();
    for (const eq of equipment_keys) {
        if (tome_keys.includes(eq)) {
            continue;
        }
        // build dropdown
        let item_arr = [];
        if (eq == 'weapon') {
            for (const weaponType of weapon_keys) {
                for (const weapon of itemLists.get(weaponType)) {
                    let item_obj = itemMap.get(weapon);
                    if (item_obj["restrict"] && item_obj["restrict"] === "DEPRECATED") {
                        continue;
                    }
                    if (item_obj["name"] == 'No '+ eq.charAt(0).toUpperCase() + eq.slice(1)) {
                        continue;
                    }
                    item_arr.push(weapon);
                }
            }
        } else {
            for (const item of itemLists.get(eq.replace(/[0-9]/g, ''))) {
                let item_obj = itemMap.get(item);
                if (item_obj["restrict"] && item_obj["restrict"] === "DEPRECATED") {
                    continue;
                }
                if (item_obj["name"] == 'No '+ eq.charAt(0).toUpperCase() + eq.slice(1)) {
                    continue;
                }
                item_arr.push(item)
            }
        }

        // create dropdown
        dropdowns.set(eq, new autoComplete({
            data: {
                src: item_arr
            },
            selector: "#"+ eq +"-choice",
            wrapper: false,
            resultsList: {
                maxResults: 1000,
                tabSelect: true,
                noResults: true,
                class: "search-box dark-7 rounded-bottom px-2 fw-bold dark-shadow-sm",
                element: (list, data) => {
                    // dynamic result loc
                    let position = document.getElementById(eq+'-dropdown').getBoundingClientRect();
                    list.style.top = position.bottom + window.scrollY +"px";
                    list.style.left = position.x+"px";
                    list.style.width = position.width+"px";
                    list.style.maxHeight = position.height * 2 +"px";

                    if (!data.results.length) {
                        message = document.createElement('li');
                        message.classList.add('scaled-font');
                        message.textContent = "No results found!";
                        list.prepend(message);
                    }
                },
            },
            resultItem: {
                class: "scaled-font search-item",
                selected: "dark-5",
                element: (item, data) => {
                    item.classList.add(itemMap.get(data.value).tier);
                },
            },
            events: {
                input: {
                    selection: (event) => {
                        if (event.detail.selection.value) {
                            event.target.value = event.detail.selection.value;
                        }
                        event.target.dispatchEvent(new Event('change'));
                    },
                },
            }
        }));
    }

    for (const eq of tome_keys) {
        // build dropdown
        let tome_arr = [];
        for (const tome of tomeLists.get(eq.replace(/[0-9]/g, ''))) {
            let tome_obj = tomeMap.get(tome);
            if (tome_obj["restrict"] && tome_obj["restrict"] === "DEPRECATED") {
                continue;
            }
            //this should suffice for tomes - jank
            if (tome_obj["name"].includes('No ' + eq.charAt(0).toUpperCase())) {
                continue;
            }
            let tome_name = tome;
            tome_arr.push(tome_name);
        }

        // create dropdown
        dropdowns.set(eq, new autoComplete({
            data: {
                src: tome_arr
            },
            selector: "#"+ eq +"-choice",
            wrapper: false,
            resultsList: {
                maxResults: 1000,
                tabSelect: true,
                noResults: true,
                class: "search-box dark-7 rounded-bottom px-2 fw-bold dark-shadow-sm",
                element: (list, data) => {
                    // dynamic result loc
                    let position = document.getElementById(eq+'-dropdown').getBoundingClientRect();
                    list.style.top = position.bottom + window.scrollY +"px";
                    list.style.left = position.x+"px";
                    list.style.width = position.width+"px";
                    list.style.maxHeight = position.height * 2 +"px";

                    if (!data.results.length) {
                        message = document.createElement('li');
                        message.classList.add('scaled-font');
                        message.textContent = "No results found!";
                        list.prepend(message);
                    }
                },
            },
            resultItem: {
                class: "scaled-font search-item",
                selected: "dark-5",
                element: (tome, data) => {
                    tome.classList.add(tomeMap.get(data.value).tier);
                },
            },
            events: {
                input: {
                    selection: (event) => {
                        if (event.detail.selection.value) {
                            event.target.value = event.detail.selection.value;
                        }
                        event.target.dispatchEvent(new Event('change'));
                    },
                },
            }
        }));
    }

    let filter_loc = ["filter1", "filter2", "filter3", "filter4"];
    for (const i of filter_loc) {
        dropdowns.set(i+"-choice", new autoComplete({
            data: {
                src: sq2ItemFilters,
            },
            selector: "#"+i+"-choice",
            wrapper: false,
            resultsList: {
                tabSelect: true,
                noResults: true,
                class: "search-box dark-7 rounded-bottom px-2 fw-bold dark-shadow-sm",
                element: (list, data) => {
                    // dynamic result loc
                    console.log(i);
                    list.style.zIndex = "100";
                    let position = document.getElementById(i+"-dropdown").getBoundingClientRect();
                    window_pos = document.getElementById("search-container").getBoundingClientRect();
                    list.style.top = position.bottom - window_pos.top + 5 +"px";
                    list.style.left = position.x - window_pos.x +"px";
                    list.style.width = position.width+"px";

                    if (!data.results.length) {
                        message = document.createElement('li');
                        message.classList.add('scaled-font');
                        message.textContent = "No filters found!";
                        list.prepend(message);
                    }
                },
            },
            resultItem: {
                class: "scaled-font search-item",
                selected: "dark-5",
            },
            events: {
                input: {
                    selection: (event) => {
                        if (event.detail.selection.value) {
                            event.target.value = event.detail.selection.value;
                        }
                    },
                },
            }
        }));
    }
}

function collapse_element(elmnt) {
    elem_list = document.querySelector(elmnt).children;
    if (elem_list) {
        for (elem of elem_list) {
            if (elem.classList.contains("no-collapse")) { continue; }   
            if (elem.style.display == "none") {
                elem.style.display = "";
            } else {
                elem.style.display = "none";
            }  
        }
    }
    // macy quirk
    window.dispatchEvent(new Event('resize'));
    // weird bug where display: none overrides??
    document.querySelector(elmnt).style.removeProperty('display');
}

// TODO: Learn and use await
function init() {
    console.log("builder.js init");
    init_autocomplete();

    // Other "main" stuff
    // Spell dropdowns
    for (const i of spell_disp) {
        document.querySelector("#"+i+"Avg").addEventListener("click", () => toggle_spell_tab(i));
    }
    for (const eq of equipment_keys) {
        document.querySelector("#"+eq+"-tooltip").addEventListener("click", () => collapse_element('#'+eq+'-tooltip'));
    }

    // Masonry setup
    let masonry = Macy({
        container: "#masonry-container",
        columns: 1,
        mobileFirst: true,
        breakAt: {
            1200: 4,
        },
        margin: {
            x: 20,
            y: 20,
        } 
        
    });

    let search_masonry = Macy({
        container: "#search-results",
        columns: 1,
        mobileFirst: true,
        breakAt: {
            1200: 4,
        },
        margin: {
            x: 20,
            y: 20,
        }
        
    });
    decodeBuild(url_tag);
    builder_graph_init();
}

(async function() {
    let load_promises = [ load_init(), load_ing_init(), load_tome_init() ];
    await Promise.all(load_promises);
    init();
})();
