document.addEventListener("DOMContentLoaded", function() {
    let filterInputs = new Map([["category", ["ALL", "armor", "helmet", "chestplate", "leggings", "boots", "accessory", "ring", "bracelet", "weapon", "wand", "spear", "bow", "dagger", "relik"]],
                                ["rarity", ["ANY", "Normal", "Unique", "Set", "Rare", "Legendary", "Fabled", "Mythic", "Sane"]],
                                ["filter1", sq2ItemFilters],
                                ["filter2", sq2ItemFilters],
                                ["filter3", sq2ItemFilters],
                                ["filter4", sq2ItemFilters]]);
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
    };
});

const sq2_translate_mappings = {
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

    "1st Spell Cost %": "spPct1",
    "1st Spell Cost Raw": "spRaw1",
    "2nd Spell Cost %": "spPct2",
    "2nd Spell Cost Raw": "spRaw2",
    "3rd Spell Cost %": "spPct3",
    "3rd Spell Cost Raw": "spRaw3",
    "4th Spell Cost %": "spPct4",
    "4th Spell Cost Raw": "spRaw4",

    "Rainbow Spell Damage": "rainbowRaw",
    "Sprint": "sprint",
    "Sprint Regen": "sprintReg",
    "Jump Height": "jh",
    "Loot Quality": "lq",

    "Gather XP Bonus": "gXp",
    "Gather Speed Bonus": "gSpd",
};

const sq2_special_mappings = {
    "Sum (skill points)": new SumQuery(["str", "dex", "int", "def", "agi"]),
    "Sum (Mana Sustain)": new SumQuery(["mr", "ms"]),
    "Sum (Life Sustain)": new SumQuery(["hpr", "ls"]),
    "Sum (Health + Health Bonus)": new SumQuery(["hp", "hpBonus"]),
    "No Strength Req": new NegateQuery("strReq"),
    "No Dexterity Req": new NegateQuery("dexReq"),
    "No Intelligence Req": new NegateQuery("intReq"),
    "No Agility Req": new NegateQuery("agiReq"),
    "No Defense Req": new NegateQuery("defReq"),
};

let sq2ItemFilters = []
for (let x in sq2_translate_mappings) {
    sq2ItemFilters.push(x);
}
for (let x in sq2_special_mappings) {
    sq2ItemFilters.push(x);
}

function applyQuery(items, query) {
    return items.filter(query.filter, query).sort(query.compare);
}

function displayItems(items_copy) {
    let items_parent = document.getElementById("search-results");
    for (let i in items_copy) {
        if (i > 200) {break;}
        let item = items_copy[i];
        let box = document.createElement("div");
        box.classList.add("col-lg-3", "col-sm-6", "p-2");
        box.id = "item"+i;
        box.addEventListener("dblclick", function() {set_item(item);});
        
        let bckgrdbox = document.createElement("div");
        bckgrdbox.classList.add("dark-7", "rounded", "px-2", "col-auto");
        box.appendChild(bckgrdbox);
        bckgrdbox.id = "item"+i+"b";
        items_parent.appendChild(box);
        displaysq2ExpandedItem(item, bckgrdbox.id);
    }
}

let items_expanded;

function doItemSearch() {
    // window.scrollTo(0, 0);
    let queries = [];
    queries.push(new NameQuery(document.getElementById("name-choice").value.trim()));

    let categoryOrType = document.getElementById("category-choice").value;
    if (itemTypes.includes(categoryOrType)) {
        queries.push(new IdMatchQuery("type", categoryOrType));
    }
    else if (itemCategories.includes(categoryOrType)) {
        queries.push(new IdMatchQuery("category", categoryOrType));
    }

    let rarity = document.getElementById("rarity-choice").value;
    if (rarity) {
        if (rarity === "ANY") {

        }
        else {
            queries.push(new IdMatchQuery("tier", rarity));
        }
    }

    let level_dat = document.getElementById("level-choice").value ? document.getElementById("level-choice").value.split("-") : [1, 106];
    queries.push(new LevelRangeQuery(parseInt(level_dat[0]), parseInt(level_dat[1])));
    
    for (let i = 1; i <= 4; ++i) {
        let raw_dat = document.getElementById("filter"+i+"-choice").value;
        let filter_dat = translate_mappings[raw_dat];
        if (filter_dat !== undefined) {
            queries.push(new IdQuery(filter_dat));
            continue;
        }
        filter_dat = special_mappings[raw_dat];
        if (filter_dat !== undefined) {
            queries.push(filter_dat);
            continue;
        }
    }

    let items_copy = items_expanded.slice();
    document.getElementById("search-results").textContent = "";
    for (const query of queries) {
        console.log(items_copy.length);
        console.log(query);
        console.log(query.filter);
        items_copy = applyQuery(items_copy, query);
        console.log(items_copy.length);
    }
    document.getElementById("summary").textContent = items_copy.length + " results:"
    displayItems(items_copy);
}

function resetItemSearch() {
    resetFields = ["name-choice", "category-choice", "rarity-choice", "level-choice", "filter1-choice", "filter2-choice", "filter3-choice", "filter4-choice"]
    for (const field of resetFields) {
        document.getElementById(field).value = "";
    }
}

function init_items() {
    items_expanded = items.filter( (i) => !("remapID" in i) ).map( (i) => expandItem(i, []) );
}

load_init(init_items);
