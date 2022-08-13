const translate_mappings = {
    //"Name": "name",
    //"Display Name": "displayName",
    //"tier"Tier": ",
    //"Set": "set",
    "Powder Slots": "slots",
    //"Type": "type",
    //"armorType", (deleted)
    //"color", (deleted)
    //"lore", (deleted)
    //"material", (deleted)
    "Drop type": "drop",
    "Quest requirement": "quest",
    "Restriction": "restrict",
    //"Base Neutral Damage": "nDam",
    //"Base Fire Damage": "fDam",
    //"Base Water Damage": "wDam",
    //"Base Air Damage": "aDam",
    //"Base Thunder Damage": "tDam",
    //"Base Earth Damage": "eDam",
    //"Base Attack Speed": "atkSpd",
    "Health": "hp",
    "Raw Fire Defense": "fDef",
    "Raw Water Defense": "wDef",
    "Raw Air Defense": "aDef",
    "Raw Thunder Defense": "tDef",
    "Raw Earth Defense": "eDef",
    "Combat Level": "lvl",
    //"Class Requirement": "classReq",
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
    "Fixed IDs": "fixID",
    "Custom Skin": "skin",
    //"Item Category": "category",

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
    "Gather Speed Bonus": "gSpd",
};

const special_mappings = {
    "Sum (skill points)": "s:str+dex+int+def+agi",
    "Sum (Mana Sustain)": "s:mr+ms",
    "Sum (Life Sustain)": "s:hpr+ls",
    "Sum (Health + Health Bonus)": "s:hp+hpBonus",
    "No Strength Req": "f:strReq=0",
    "No Dexterity Req": "f:dexReq=0",
    "No Intelligence Req": "f:intReq=0",
    "No Agility Req": "f:agiReq=0",
    "No Defense Req": "f:defReq=0",
};

let item_filters = []
for (let x in translate_mappings) {
    item_filters.push(x);
}
for (let x in special_mappings) {
    item_filters.push(x);
}

let item_categories = ["armor", "accessory", "weapon"];

const types = {bow: true, spear: true, wand: true, dagger: true, relik: true, helmet: true, chestplate: true, leggings: true, boots: true, ring: true, bracelet: true, necklace: true};
const rarities = {normal: true, unique: true, set: true, rare: true, legendary: true, fabled: true, mythic: true};
const filters = [];

function displayItems(items_copy) {
    let items_parent = document.getElementById("search-results");
    for (let i in items_copy) {
        if (i > 200) {break;}
        let item = items_copy[i].itemExp;
        let box = make_elem('div', ['col-lg-3', 'col-sm-6', 'p-2'], {id: 'item'+i});
        //box.addEventListener("dblclick", function() {set_item(item);}); TODO: ??

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
    window.scrollTo(0, 0);
    let queries = [];

    // name
    if (document.getElementById("item-name-choice").value != "") {
        queries.push("f:name?=\"" + document.getElementById("item-name-choice").value.trim() + "\"");
    }

    // types
    let allTypes = true;
    let typeQuery = "f:("
    for (const type of Object.keys(types)) {
        if (types[type]) {
            typeQuery += "type=\"" + type + "\"|";
        } else {
            allTypes = false;
        }
    }
    if (!allTypes) {
        queries.push(typeQuery.substring(0, typeQuery.length - 1) + ")");
    }

    // rarities
    let allRarities = true;
    let rarityQuery = "f:("
    for (const rarity of Object.keys(rarities)) {
        if (rarities[rarity]) {
            rarityQuery += "tiername=\"" + rarity + "\"|";
        } else {
            allRarities = false;
        }
    }
    if (!allRarities) {
        queries.push(rarityQuery.substring(0, rarityQuery.length - 1) + ")");
    }
    
    // filters
    // for (let i = 1; i <= 4; ++i) {
    //     let raw_dat = document.getElementById("filter"+i+"-choice").value;
    //     let filter_dat = translate_mappings[raw_dat];
    //     if (filter_dat !== undefined) {
    //         queries.push("s:"+filter_dat);
    //         queries.push("f:"+filter_dat+"!=0");
    //         continue;
    //     }
    //     filter_dat = special_mappings[raw_dat];
    //     if (filter_dat !== undefined) {
    //         queries.push(filter_dat);
    //         continue;
    //     }
    // }

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
    document.getElementById("summary").textContent = results.length + " results:"
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
}

function reset_item_search() {
    document.getElementById("item-name-choice").value = "";
    document.getElementById("all-types").click();
    document.getElementById("all-rarities").click();
}

function initFilterDropdown(filter) {
    let field_choice = filter.input_elem;
    field_choice.onclick = function() {field_choice.dispatchEvent(new Event('input', {bubbles:true}));};
    filter.autoComplete = new autoComplete({
        data: {
            src: item_filters,
        },  
        threshold: 0,
        selector: "#"+ field +"-choice",
        wrapper: false,
        resultsList: {
            maxResults: 100,
            tabSelect: true,
            noResults: true,
            class: "search-box dark-7 rounded-bottom px-2 fw-bold dark-shadow-sm",
            element: (list, data) => {
                let position = document.getElementById(field+'-choice').getBoundingClientRect();
                list.style.top = position.bottom + window.scrollY +"px";
                list.style.left = position.x+"px";
                list.style.width = position.width+"px";
                list.style.maxHeight = position.height * 4 +"px";

                if (!item_filters.results.length) {
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
