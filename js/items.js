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

let itemFilters = document.getElementById("filter-items");
if (itemFilters) {
    for (let x in translate_mappings) {
        let el = document.createElement("option");
        el.value = x;
        itemFilters.appendChild(el);
    }
    for (let x in special_mappings) {
        let el = document.createElement("option");
        el.value = x;
        itemFilters.appendChild(el);
    }
}

let itemCategories = [ "armor", "accessory", "weapon" ];

function applyQuery(items, query) {
    return items.filter(query.filter, query).sort(query.compare);
}

function displayItems(results) {
    let items_parent = document.getElementById("main");
    for (let i in results) {
        let item = results[i].itemExp;
        let box = document.createElement("div");
        box.classList.add("box");
        box.id = "item"+i;
        items_parent.appendChild(box);
        displayExpandedItem(item, box.id);
    }
}

let searchDb;

function doItemSearch() {
    window.scrollTo(0, 0);
    let queries = [];
    queries.push('f:name?="'+document.getElementById("item-name-choice").value.trim()+'"');

    let categoryOrType = document.getElementById("item-category-choice").value;
    if (itemTypes.includes(categoryOrType)) {
        queries.push('f:type="'+categoryOrType+'"');
    }
    else if (itemCategories.includes(categoryOrType)) {
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

    let level_dat = document.getElementById("item-level-choice").value.split("-");
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
    console.log(filterQuery);
    console.log(sortQueries);
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
    document.getElementById("summary").textContent = results.length + " results."
    displayItems(results);
}

function init_items() {
    searchDb = items.filter( i => ! i.remapID ).map( i => [i, expandItem(i, [])] );
    exprParser = new ExprParser(itemQueryProps, itemQueryFuncs);
}

load_init(init_items);
