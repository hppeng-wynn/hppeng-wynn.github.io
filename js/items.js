// commented out filters
    //"Name": "name",
    //"Display Name": "displayName",
    //"Tier": "tier",
    //"Set": "set",
    //"Type": "type",
    //"Drop type": "drop",             BROKEN
    //"Quest requirement": "quest",    BROKEN
    //"Restriction": "restrict",       BROKEN
    //"Base Neutral Damage": "nDam",
    //"Base Fire Damage": "fDam",
    //"Base Water Damage": "wDam",
    //"Base Air Damage": "aDam",
    //"Base Thunder Damage": "tDam",
    //"Base Earth Damage": "eDam",
    //"Base Attack Speed": "atkSpd",
    //"Class Requirement": "classReq",
    // "Fixed IDs": "fixID",          BROKEN
    // "Custom Skin": "skin",         BROKEN
    //"Item Category": "category",

const translate_mappings = {
    "Powder Slots": "slots",
    "Health": "hp",
    "Raw Fire Defense": "fDef",
    "Raw Water Defense": "wDef",
    "Raw Air Defense": "aDef",
    "Raw Thunder Defense": "tDef",
    "Raw Earth Defense": "eDef",
    "Combat Level": "lvl",
    "Req Strength": "strReq",
    "Req Dexterity": "dexReq",
    "Req Intelligence": "intReq",
    "Req Agility": "agiReq",
    "Req Defense": "defReq",
    "% Health Regen": "hprPct",
    "Mana Regen": "mr",
    "% Spell Damage": "sdPct",
    "% Melee Damage": "mdPct",
    "Life Steal": "ls",
    "Mana Steal": "ms",
    "XP Bonus": "xpb",
    "Loot Bonus": "lb",
    "Reflection": "ref",
    "Strength": "str",
    "Dexterity": "dex",
    "Intelligence": "int",
    "Agility": "agi",
    "Defense": "def",
    "Thorns": "thorns",
    "Exploding": "expd",
    "Walk Speed": "spd",
    "Attack Speed Bonus": "atkTier",
    "Poison": "poison",
    "Health Bonus": "hpBonus",
    "Soul Point Regen": "spRegen",
    "Stealing": "eSteal",
    "Raw Health Regen": "hprRaw",
    "Raw Spell": "sdRaw",
    "Raw Melee": "mdRaw",
    "% Fire Damage": "fDamPct",
    "% Water Damage": "wDamPct",
    "% Air Damage": "aDamPct",
    "% Thunder Damage": "tDamPct",
    "% Earth Damage": "eDamPct",
    "% Fire Defense": "fDefPct",
    "% Water Defense": "wDefPct",
    "% Air Defense": "aDefPct",
    "% Thunder Defense": "tDefPct",
    "% Earth Defense": "eDefPct",
    "1st Spell Cost %": "-spPct1",
    "1st Spell Cost Raw": "-spRaw1",
    "2nd Spell Cost %": "-spPct2",
    "2nd Spell Cost Raw": "-spRaw2",
    "3rd Spell Cost %": "-spPct3",
    "3rd Spell Cost Raw": "-spRaw3",
    "4th Spell Cost %": "-spPct4",
    "4th Spell Cost Raw": "-spRaw4",
    "Rainbow Spell Damage": "rainbowRaw",
    "Sprint": "sprint",
    "Sprint Regen": "sprintReg",
    "Jump Height": "jh",
    "Loot Quality": "lq",
    "Gather XP Bonus": "gXp",
    "Gather Speed Bonus": "gSpd"
};

const special_mappings = {
    "Sum (skill points)": "str+dex+int+def+agi",
    "Sum (Mana Sustain)": "mr+ms",
    "Sum (Life Sustain)": "hpr+ls",
    "Sum (Health + Health Bonus)": "hp+hpBonus"
};

let item_filters = [];
for (let x in translate_mappings) {
    item_filters.push(x);
}
for (let x in special_mappings) {
    item_filters.push(x);
}

let item_categories = ["armor", "accessory", "weapon"];

const types = {bow: false, spear: false, wand: false, dagger: false, relik: false, helmet: false, chestplate: false, leggings: false, boots: false, ring: false, bracelet: false, necklace: false};
const rarities = {normal: true, unique: true, set: true, rare: true, legendary: true, fabled: true, mythic: true};
const filters = [], excludes = [];
let filter_id_counter = 0;

function displayItems(items_copy) {
    let items_parent = document.getElementById("search-results");
    for (let i in items_copy) {
        if (i > 200) {break;}
        let item = items_copy[i].itemExp;
        let box = make_elem('div', ['col-lg-3', 'col-sm-6', 'p-2'], {id: 'item'+i});

        let bckgrdbox = make_elem("div", ["dark-7", "rounded", "px-2", "col-auto"], {id: 'item'+i+'b'});
        box.append(bckgrdbox);
        items_parent.appendChild(box);
        item.set("powders", []);
        if (item.get("category") == "weapon") {
            apply_weapon_powders(item);
        }
        displayExpandedItem(item, bckgrdbox.id, true);
    }
}

let search_db;
let expr_parser;

function do_item_search() {
    document.getElementById("summary").style.color = "red"; // to display errors, changed to white if search successful
    window.scrollTo(0, 0);
    let queries = [];

    // name
    if (document.getElementById("item-name-choice").value != "") {
        queries.push("f:name?=\"" + document.getElementById("item-name-choice").value.trim() + "\"");
    }

    // types
    let allTypes = true, noTypes = true;
    let typeQuery = "f:("
    for (const type of Object.keys(types)) {
        if (types[type]) {
            typeQuery += "type=\"" + type + "\"|";
            noTypes = false;
        } else {
            allTypes = false;
        }
    }
    if (noTypes) {
        document.getElementById("summary").innerHTML = "Error: Cannot search without at least 1 type selected";
        return;
    } else if (!allTypes) {
        queries.push(typeQuery.substring(0, typeQuery.length - 1) + ")");
    }

    // rarities
    let allRarities = true, noRarities = true;
    let rarityQuery = "f:("
    for (const rarity of Object.keys(rarities)) {
        if (rarities[rarity]) {
            rarityQuery += "tiername=\"" + rarity + "\"|";
            noRarities = false;
        } else {
            allRarities = false;
        }
    }
    if (noRarities) {
        document.getElementById("summary").innerHTML = "Error: Cannot search without at least 1 rarity selected";
        return;
    } else if (!allRarities) {
        queries.push(rarityQuery.substring(0, rarityQuery.length - 1) + ")");
    }
    
    // filters
    for (const filter of filters) {
        let min = parseInt(filter.min_elem.value);
        let max = parseInt(filter.max_elem.value);
        if (min > max) {
            document.getElementById("summary").innerHTML = "Error: The minimum of filter " + filter.input_elem.value + " (" + min + ") is greater than its maximum (" + max + ")";
            return;
        }
        let zero_in_min_max = (isNaN(min) || min < 0) && (isNaN(max) || max > 0);

        let raw_name = filter.input_elem.value;
        if (raw_name == "") {
            continue; // empty
        }
        let filter_name = translate_mappings[raw_name];
        if (filter_name === undefined) {
            filter_name = special_mappings[raw_name];
            if (filter_name === undefined) {
                document.getElementById("summary").innerHTML = "Error: The filter \"" + filter.input_elem.value + "\" is not recognized";
                return;
            }
            filter_name = "(" + filter_name + ")";
        }

        if (!isNaN(min)) {
            queries.push("f:" + filter_name + ">=" + min);
        }
        if (!isNaN(max)) {
            queries.push("f:" + filter_name + "<=" + max);
        }
        if (zero_in_min_max) {
            queries.push("f:" + filter_name + "!=0");
        }
        queries.push("s:" + (filter.ascending ? "0-" : "") + filter_name);
    }

    // excludes
    for (const exclude of excludes) {
        let raw_name = exclude.input_elem.value;
        if (raw_name == "") {
            continue; // empty
        }
        let filter_name = translate_mappings[raw_name];
        if (filter_name === undefined) {
            document.getElementById("summary").innerHTML = "Error: The excluded filter \"" + exclude.input_elem.value + "\" is not recognized";
            return;
        }
        queries.push("f:" + filter_name + "=0");
    }

    let filter_query = "true";
    let sort_queries = [];
    console.log(queries);
    for (const query of queries) {
        if (query.startsWith("s:")) {
            sort_queries.push(query.slice(2));
        }
        else if (query.startsWith("f:")) {
            filter_query = filter_query + "&" + query.slice(2);
        }
    }
    document.getElementById("search-results").textContent = "";
    let results = [];
    try {
        const filter_expr = expr_parser.parse(filter_query);
        const sort_exprs = sort_queries.map(q => expr_parser.parse(q));
        for (let i = 0; i < search_db.length; ++i) {
            const item = search_db[i][0];
            const itemExp = search_db[i][1];
            if (checkBool(filter_expr.resolve(item, itemExp))) {
                results.push({ item, itemExp, sortKeys: sort_exprs.map(e => e.resolve(item, itemExp)) });
            }
        }
        results.sort((a, b) => {
            return compareLexico(a.item, a.sortKeys, b.item, b.sortKeys);
        });
    } catch (e) {
        document.getElementById("summary").textContent = e.message;
        return;
    }
    document.getElementById("summary").textContent = results.length + " results:";
    document.getElementById("summary").style.color = "white";
    displayItems(results);
}

function init_items() {
    search_db = items.filter( i => ! i.remapID ).map( i => [i, expandItem(i, [])] );
    expr_parser = new ExprParser(itemQueryProps, itemQueryFuncs);

    // init type buttons
    for (const type of Object.keys(types)) {
        document.getElementById("type-" + type).addEventListener("click", function() {
            types[type] = !types[type];
            this.classList.toggle("type-selected");
        });
    }
    document.getElementById("all-types").addEventListener("click", function() {
        for (const type of Object.keys(types)) {
            types[type] = true;
            document.getElementById("type-" + type).classList.add("type-selected");
        }
    });
    document.getElementById("none-types").addEventListener("click", function() {
        for (const type of Object.keys(types)) {
            types[type] = false;
            document.getElementById("type-" + type).classList.remove("type-selected");
        }
    });
    
    // init rarity buttons
    for (const rarity of Object.keys(rarities)) {
        document.getElementById("rarity-" + rarity).addEventListener("click", function() {
            rarities[rarity] = !rarities[rarity];
            this.classList.toggle("rarity-selected");
        });
    }
    document.getElementById("all-rarities").addEventListener("click", function() {
        for (const rarity of Object.keys(rarities)) {
            rarities[rarity] = true;
            document.getElementById("rarity-" + rarity).classList.add("rarity-selected");
        }
    });
    document.getElementById("none-rarities").addEventListener("click", function() {
        for (const rarity of Object.keys(rarities)) {
            rarities[rarity] = false;
            document.getElementById("rarity-" + rarity).classList.remove("rarity-selected");
        }
    });

    // filters
    document.getElementById("add-filter").addEventListener("click", create_filter);
    document.getElementById("add-exclude").addEventListener("click", create_exclude);
    create_filter();
    filters[0].input_elem.value = "Combat Level";
    init_filter_drag();
}

function reset_item_search() {
    document.getElementById("item-name-choice").value = "";
    document.getElementById("all-types").click();
    document.getElementById("all-rarities").click();
}

function create_filter() {
    let data = {ascending: false};

    let row = make_elem("div", ["row", "filter-row"], {});
    let col = make_elem("div", ["col"], {});
    row.appendChild(col);
    data.div = row;

    let reorder_img = make_elem("img", ["reorder-filter"], {src: "../media/icons/3-lines.svg", draggable: "true"});
    col.appendChild(reorder_img);

    let filter_input = make_elem("input",
        ["col", "border-dark", "text-light", "dark-5", "rounded", "scaled-font", "form-control", "form-control-sm", "filter-input"],
        {id: "filter-input-" + filter_id_counter, type: "text", placeholder: "Filter"}
    );
    filter_id_counter++;
    col.appendChild(filter_input);
    data.input_elem = filter_input;

    let asc_desc = make_elem("div", [], {style: "cursor: pointer; display: inline-block;"});
    asc_desc.appendChild(make_elem("img", ["desc-icon", "asc-sel"], {src: "../media/icons/triangle.svg"}));
    asc_desc.appendChild(make_elem("img", ["asc-icon"], {src: "../media/icons/triangle.svg"}));
    asc_desc.addEventListener("click", function() {
        data.ascending = !data.ascending;
        asc_desc.children[0].classList.toggle("asc-sel");
        asc_desc.children[1].classList.toggle("asc-sel");
    });
    col.appendChild(asc_desc);

    let min = make_elem("input",
        ["col", "border-dark", "text-light", "dark-5", "rounded", "scaled-font", "form-control", "form-control-sm", "min-max-input"],
        {type: "number", placeholder: "-\u221E"}
    );
    col.appendChild(min);
    data.min_elem = min;

    let to = make_elem("span", [], {innerHTML: "&nbsp;to&nbsp;"});
    col.appendChild(to);

    let max = make_elem("input",
        ["col", "border-dark", "text-light", "dark-5", "rounded", "scaled-font", "form-control", "form-control-sm", "min-max-input"],
        {type: "number", placeholder: "\u221E"}
    );
    col.appendChild(max);
    data.max_elem = max;

    let trash = make_elem("img", ["delete-filter"], {src: "../media/icons/trash.svg"});
    trash.addEventListener("click", function() {
        filters.splice(Array.from(row.parentElement.children).indexOf(row) - 1, 1);
        row.remove();
    });
    col.appendChild(trash);

    document.getElementById("filter-container").insertBefore(row, document.getElementById("add-filter").parentElement);
    filters.push(data);
    init_filter_dropdown(data);
}

let currently_dragging = null;
function init_filter_drag() {
    let container = document.getElementById("filter-container");

    container.addEventListener("dragstart", function(e) {
        if (e.path[0].classList.contains("reorder-filter")) {
            currently_dragging = filters[Array.from(e.path[3].children).indexOf(e.path[2]) - 1];
        } else {
            e.preventDefault();
        }
    });

    container.addEventListener("dragenter", function(e) {
        e.preventDefault();
    });

    container.addEventListener("dragleave", function(e) {
        e.preventDefault();
    });

    container.addEventListener("dragend", function(e) {
        e.preventDefault();
        for (const el of document.getElementsByClassName("filter-dragged-over")) {
            el.classList.remove("filter-dragged-over");
        }
        currently_dragging = null;
    });

    container.addEventListener("dragover", function(e) {
        e.preventDefault();
        for (const el of document.getElementsByClassName("filter-dragged-over")) {
            el.classList.remove("filter-dragged-over");
        }
        if (!e.path.includes(currently_dragging.div)) {
            for (let i = 0; i < e.path.length; i++) {
                if (e.path[i].classList.contains("filter-row")) {
                    e.path[i].classList.add("filter-dragged-over");
                    break;
                }
            }
        }
    });

    container.addEventListener("drop", function(e) {
        e.preventDefault();
        for (const el of document.getElementsByClassName("filter-dragged-over")) {
            el.classList.remove("filter-dragged-over");
        }
        if (!e.path.includes(currently_dragging.div)) {
            for (let i = 0; i < e.path.length; i++) {
                if (e.path[i].classList.contains("filter-row")) {
                    let old_index = filters.indexOf(currently_dragging);
                    let new_index = Array.from(e.path[i + 1].children).indexOf(e.path[i]) - 1;
                    filters.splice(old_index, 1);
                    filters.splice(new_index, 0, currently_dragging);
                    currently_dragging.div.remove();
                    container.insertBefore(currently_dragging.div, container.children[new_index + 1]);
                    break;
                }
            }
        }
        currently_dragging = null;
    });
}

function create_exclude() {
    let data = {};

    let row = make_elem("div", ["row", "filter-row"], {});
    let col = make_elem("div", ["col"], {});
    row.appendChild(col);
    data.div = row;

    let filter_input = make_elem("input",
        ["col", "border-dark", "text-light", "dark-5", "rounded", "scaled-font", "form-control", "form-control-sm", "filter-input"],
        {id: "filter-input-" + filter_id_counter, type: "text", placeholder: "Excluded Filter"}
    );
    filter_id_counter++;
    col.appendChild(filter_input);
    data.input_elem = filter_input;

    let trash = make_elem("img", ["delete-filter"], {src: "../media/icons/trash.svg"});
    trash.addEventListener("click", function() {
        excludes.splice(Array.from(row.parentElement.children).indexOf(row) - 1, 1);
        row.remove();
    });
    col.appendChild(trash);

    document.getElementById("exclude-container").insertBefore(row, document.getElementById("add-exclude").parentElement);
    excludes.push(data);
    init_filter_dropdown(data);
}

function init_filter_dropdown(filter) {
    let field_choice = filter.input_elem;
    field_choice.onclick = function() {field_choice.dispatchEvent(new Event('input', {bubbles:true}));};
    filter.autoComplete = new autoComplete({
        data: {
            src: item_filters,
        },  
        threshold: 0,
        selector: "#" + field_choice.id,
        wrapper: false,
        resultsList: {
            maxResults: 100,
            tabSelect: true,
            noResults: true,
            class: "search-box dark-7 rounded-bottom px-2 fw-bold dark-shadow-sm",
            element: (list, data) => {
                let position = field_choice.getBoundingClientRect();
                list.style.top = position.bottom + window.scrollY +"px";
                list.style.left = position.x+"px";
                list.style.width = position.width+"px";
                list.style.maxHeight = position.height * 4 +"px";
                if (!data.results.length) {
                    const message = make_elem('li', ['scaled-font'], {textContent: "No results found!"});
                    list.prepend(message);
                };
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
                    };
                },
            },
        }
    });
}

(async function() {
    await Promise.resolve(load_init());
    init_items();
})();
