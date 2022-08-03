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

let item_categories = [ "armor", "accessory", "weapon" ];

function applyQuery(items, query) {
    return items.filter(query.filter, query).sort(query.compare);
}

function displayItems(items_copy) {
    let items_parent = document.getElementById("search-results");
    for (let i in items_copy) {
        if (i > 200) {break;}
        let item = items_copy[i].itemExp;
        let box = document.createElement("div");
        box.classList.add("col-lg-3", "col-sm-6", "p-2");
        box.id = "item"+i;
        //box.addEventListener("dblclick", function() {set_item(item);}); TODO: ??

        let bckgrdbox = document.createElement("div");
        bckgrdbox.classList.add("dark-7", "rounded", "px-2", "col-auto");
        box.appendChild(bckgrdbox);
        bckgrdbox.id = "item"+i+"b";
        items_parent.appendChild(box);
        item.set("powders", []);
        if (item.get("category") == "weapon") {
            apply_weapon_powders(item);
        }
        displayExpandedItem(item, bckgrdbox.id, true);
    }
}

let searchDb;

function doItemSearch() {
    window.scrollTo(0, 0);
    let queries = [];
    queries.push('f:name?="'+document.getElementById("item-name-choice").value.trim()+'"');

    let categoryOrType = document.getElementById("item-category-choice").value;
    if (item_types.includes(categoryOrType)) {
        queries.push('f:type="'+categoryOrType+'"');
    }
    else if (item_categories.includes(categoryOrType)) {
        queries.push('f:cat="'+categoryOrType+'"');
    }

    let rarity = document.getElementById("item-rarity-choice").value;
    if (rarity) {
        if (rarity === "ANY") {

        }
        else if (rarity === "Sane") {
            queries.push('f:tiername!="mythic"');
        }
        else {
            queries.push('f:tiername="'+rarity+'"');
        }
    }

    let level_raw = document.getElementById("item-level-choice").value;
    if (!level_raw) { level_raw = '1-106'; };
    const level_dat = level_raw.split("-");
    queries.push('f:(lvl>='+parseInt(level_dat[0])+'&lvl<='+parseInt(level_dat[1])+')');
    
    for (let i = 1; i <= 4; ++i) {
        let raw_dat = document.getElementById("filter"+i+"-choice").value;
        let filter_dat = translate_mappings[raw_dat];
        if (filter_dat !== undefined) {
            queries.push("s:"+filter_dat);
            queries.push("f:"+filter_dat+"!=0");
            continue;
        }
        filter_dat = special_mappings[raw_dat];
        if (filter_dat !== undefined) {
            queries.push(filter_dat);
            continue;
        }
    }

    let filterQuery = "true";
    let sortQueries = [];
    console.log(queries);
    for (const query of queries) {
        if (query.startsWith("s:")) {
            sortQueries.push(query.slice(2));
        }
        else if (query.startsWith("f:")) {
            filterQuery = filterQuery + "&" + query.slice(2);
        }
    }
    document.getElementById("search-results").textContent = "";
    let results = [];
    try {
        const filterExpr = exprParser.parse(filterQuery);
        const sortExprs = sortQueries.map(q => exprParser.parse(q));
        for (let i = 0; i < searchDb.length; ++i) {
            const item = searchDb[i][0];
            const itemExp = searchDb[i][1];
            if (checkBool(filterExpr.resolve(item, itemExp))) {
                results.push({ item, itemExp, sortKeys: sortExprs.map(e => e.resolve(item, itemExp)) });
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

function resetItemSearch() {
    resetFields = ["item-name-choice", "item-category-choice", "item-rarity-choice", "item-level-choice", "filter1-choice", "filter2-choice", "filter3-choice", "filter4-choice"]
    for (const field of resetFields) {
        document.getElementById(field).value = "";
    }
}

function init_items() {
    searchDb = items.filter( i => ! i.remapID ).map( i => [i, expandItem(i, [])] );
    exprParser = new ExprParser(itemQueryProps, itemQueryFuncs);
    //init dropdowns
    let filterInputs = new Map([["item-category", ["ALL", "armor", "helmet", "chestplate", "leggings", "boots", "accessory", "ring", "bracelet", "necklace", "weapon", "wand", "spear", "bow", "dagger", "relik"]],
                                ["item-rarity", ["ANY", "Normal", "Unique", "Set", "Rare", "Legendary", "Fabled", "Mythic", "Sane"]],
                                ["filter1", item_filters],
                                ["filter2", item_filters],
                                ["filter3", item_filters],
                                ["filter4", item_filters]]);
    for (const [field, data] of filterInputs) {
        let field_choice = document.getElementById(field+"-choice");
        // show dropdown on click
        field_choice.onclick = function() {field_choice.dispatchEvent(new Event('input', {bubbles:true}));};
        filterInputs.set(field, new autoComplete({
            data: {
                src: data,
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

                    if (!data.results.length) {
                        message = document.createElement('li');
                        message.classList.add('scaled-font');
                        message.textContent = "No results found!";
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
        }));
    }
}

(async function() {
    await Promise.resolve(load_init());
    init_items();
})();
