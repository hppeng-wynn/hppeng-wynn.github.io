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
    "Spell Damage Raw: ": "sdRaw",
    "Elem. Spell Damage Raw: ": "rSdRaw",
    "Neut. Spell Damage Raw: ": "nSdRaw",
    "Earth Spell Damage Raw: ": "eSdRaw",
    "Thunder Spell Damage Raw: ": "tSdRaw",
    "Water Spell Damage Raw: ": "wSdRaw",
    "Fire Spell Damage Raw: ": "fSdRaw",
    "Air Spell Damage Raw: ": "aSdRaw",
    "Spell Damage %: ": "sdPct",
    "Elem. Spell Damage %: ": "rSdPct",
    "Neut. Spell Damage %: ": "nSdPct",
    "Earth Spell Damage %: ": "eSdPct",
    "Thunder Spell Damage %: ": "tSdPct",
    "Water Spell Damage %: ": "wSdPct",
    "Fire Spell Damage %: ": "fSdPct",
    "Air Spell Damage %: ": "aSdPct",
    "Melee Damage Raw: ": "mdRaw",
    "Elem. Melee Damage Raw: ": "rMdRaw",
    "Neut. Melee Damage Raw: ": "nMdRaw",
    "Earth Melee Damage Raw: ": "eMdRaw",
    "Thunder Melee Damage Raw: ": "tMdRaw",
    "Water Melee Damage Raw: ": "wMdRaw",
    "Fire Melee Damage Raw: ": "fMdRaw",
    "Air Melee Damage Raw: ": "aMdRaw",
    "Melee Damage %: ": "mdPct",
    "Elem. Melee Damage %: ": "rMdPct",
    "Neut. Melee Damage %: ": "nMdPct",
    "Earth Melee Damage %: ": "eMdPct",
    "Thunder Melee Damage %: ": "tMdPct",
    "Water Melee Damage %: ": "wMdPct",
    "Fire Melee Damage %: ": "fMdPct",
    "Air Melee Damage %: ": "aMdPct",
    "Damage Raw: ": "damRaw",
    "Elemental Damage Raw: ": "rDamRaw",
    "Neutral Damage Raw: ": "nDamRaw",
    "Earth Damage Raw: ": "eDamRaw",
    "Thunder Damage Raw: ": "tDamRaw",
    "Water Damage Raw: ": "wDamRaw",
    "Fire Damage Raw: ": "fDamRaw",
    "Air Damage Raw: ": "aDamRaw",
    "Damage %: ": "damPct",
    "Elemental Damage %: ": "rDamPct",
    "Neutral Damage %: ": "nDamPct",
    "Earth Damage %: ": "eDamPct",
    "Thunder Damage %: ": "tDamPct",
    "Water Damage %: ": "wDamPct",
    "Fire Damage %: ": "fDamPct",
    "Air Damage %: ": "aDamPct",

    "% Fire Defense": "fDefPct",
    "% Water Defense": "wDefPct",
    "% Air Defense": "aDefPct",
    "% Thunder Defense": "tDefPct",
    "% Earth Defense": "eDefPct",
    "% Elemental Defense": "rDefPct",

    "1st Spell Cost %": "-spPct1",
    "1st Spell Cost Raw": "-spRaw1",
    "2nd Spell Cost %": "-spPct2",
    "2nd Spell Cost Raw": "-spRaw2",
    "3rd Spell Cost %": "-spPct3",
    "3rd Spell Cost Raw": "-spRaw3",
    "4th Spell Cost %": "-spPct4",
    "4th Spell Cost Raw": "-spRaw4",
    "Sprint": "sprint",
    "Sprint Regen": "sprintReg",
    "Jump Height": "jh",
    "Loot Quality": "lq",
    "Gather XP Bonus": "gXp",
    "Gather Speed Bonus": "gSpd",
    "Healing Efficiency": "healPct",
    "Knockback": "kb",
    "Weaken Enemy": "weakenEnemy",
    "Slow Enemy": "slowEnemy"
};

const special_mappings = {
    "Sum (skill points)": "str+dex+int+def+agi",
    "Sum (Mana Sustain)": "mr+ms",
    "Sum (Life Sustain)": "hpr+ls",
    "Sum (Health + Health Bonus)": "hp+hpBonus",
    "Base DPS": "(nDam+fDam+wDam+aDam+tDam+eDam) * atkspdmod(atkspd)"
};

for (let x in translate_mappings) {
    item_filters.push(x);
}
for (let x in special_mappings) {
    item_filters.push(x);
}

types = {bow: false, spear: false, wand: false, dagger: false, relik: false, helmet: false, chestplate: false, leggings: false, boots: false, ring: false, bracelet: false, necklace: false};
search_tiers = {normal: true, unique: true, set: true, rare: true, legendary: true, fabled: true, mythic: true};

function display(items_copy) {
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

function filter_types_tiers(queries) {
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
        return false;
    } else if (!allTypes) {
        queries.push(typeQuery.substring(0, typeQuery.length - 1) + ")");
    }

    // rarities
    let allRarities = true, noRarities = true;
    let rarityQuery = "f:("
    for (const rarity of Object.keys(search_tiers)) {
        if (search_tiers[rarity]) {
            rarityQuery += "tiername=\"" + rarity + "\"|";
            noRarities = false;
        } else {
            allRarities = false;
        }
    }
    if (noRarities) {
        document.getElementById("summary").innerHTML = "Error: Cannot search without at least 1 rarity selected";
        return false;
    } else if (!allRarities) {
        queries.push(rarityQuery.substring(0, rarityQuery.length - 1) + ")");
    }

    return true;
}

function init_values() {
    search_db = items.filter( i => ! i.remapID ).map( i => [i, expandItem(i, [])] );
    expr_parser = new ExprParser(itemQueryProps, queryFuncs);
}

(async function() {
    await Promise.resolve(load_init());
    init_search();
})();
