/** 
 * File implementing core damage calculation logic.
 */

function get_base_dps(item) {
    const attack_speed_mult = baseDamageMultiplier[attackSpeeds.indexOf(item.get("atkSpd"))];
    //SUPER JANK @HPP PLS FIX
    if (item.get("tier") !== "Crafted") {
        let total_damage = 0;
        for (const damage_k of damage_keys) {
            damages = item.get(damage_k);
            total_damage += damages[0] + damages[1];
        }
        return total_damage * attack_speed_mult / 2;
    }
    else {
        let total_damage_min = 0;
        let total_damage_max = 0;
        for (const damage_k of damage_keys) {
            damages = item.get(damage_k);
            total_damage_min += damages[0][0] + damages[0][1];
            total_damage_max += damages[1][0] + damages[1][1];
        }
        total_damage_min = attack_speed_mult * total_damage_min / 2;
        total_damage_max = attack_speed_mult * total_damage_max / 2;
        return [total_damage_min, total_damage_max];
    }
}


function calculateSpellDamage(stats, weapon, _conversions, use_spell_damage, ignore_speed=false, part_filter=undefined) {
    // TODO: Roll all the loops together maybe

    // Array of neutral + ewtfa damages. Each entry is a pair (min, max).
    // 1. Get weapon damage (with powders).
    let weapon_damages;
    if (weapon.get('tier') === 'Crafted') {
        weapon_damages = damage_keys.map(x => weapon.get(x)[1]);
    }
    else {
        weapon_damages = damage_keys.map(x => weapon.get(x));
    }
    let present = deepcopy(weapon.get(damage_present_key));

    // Also theres prop and rainbow!!
    const damage_elements = ['n'].concat(skp_elements); // netwfa

    // 2. Conversions.
    // 2.0: First, modify conversions.
    let conversions = deepcopy(_conversions);
    if (part_filter !== undefined) {
        const conv_postfix = ':'+part_filter;
        for (let i in damage_elements) {
            const stat_name = damage_elements[i]+'ConvBase'+conv_postfix;
            if (stats.has(stat_name)) {
                conversions[i] += stats.get(stat_name);
            }
        }
    }
    for (let i in damage_elements) {
        const stat_name = damage_elements[i]+'ConvBase';
        if (stats.has(stat_name)) {
            conversions[i] += stats.get(stat_name);
        }
    }

    // 2.1. First, apply neutral conversion (scale weapon damage). Keep track of total weapon damage here.
    let damages = [];
    const neutral_convert = conversions[0] / 100;
    if (neutral_convert == 0) {
        present = [false, false, false, false, false, false]
    }
    let weapon_min = 0;
    let weapon_max = 0;
    for (const damage of weapon_damages) {
        let min_dmg = damage[0] * neutral_convert;
        let max_dmg = damage[1] * neutral_convert;
        damages.push([min_dmg, max_dmg]);
        weapon_min += damage[0];
        weapon_max += damage[1];
    }

    // 2.2. Next, apply elemental conversions using damage computed in step 1.1.
    // Also, track which elements are present. (Add onto those present in the weapon itself.)
    let total_convert = 0;
    for (let i = 1; i <= 5; ++i) {
        if (conversions[i] > 0) {
            const conv_frac = conversions[i]/100;
            damages[i][0] += conv_frac * weapon_min;
            damages[i][1] += conv_frac * weapon_max;
            present[i] = true;
            total_convert += conv_frac
        }
    }
    total_convert += conversions[0]/100;

    if (!ignore_speed) {
        // 3. Apply attack speed multiplier. Ignored for melee single hit
        const attack_speed_mult = baseDamageMultiplier[attackSpeeds.indexOf(weapon.get("atkSpd"))];
        for (let i = 0; i < 6; ++i) {
            damages[i][0] *= attack_speed_mult;
            damages[i][1] *= attack_speed_mult;
        }
    }

    // 4. Add additive damage. TODO: Is there separate additive damage?
    for (let i in damage_elements) {
        if (present[i]) {
            damages[i][0] += stats.get(damage_elements[i]+'DamAddMin');
            damages[i][1] += stats.get(damage_elements[i]+'DamAddMax');
        }
    }

    // 5. ID bonus.
    let specific_boost_str = 'Md';
    if (use_spell_damage) {
        specific_boost_str = 'Sd';
    }
    // 5.1: %boost application
    let skill_boost = [0];  // no neutral skillpoint booster
    for (let i in skp_order) {
        const skp = skp_order[i];
        skill_boost.push(skillPointsToPercentage(stats.get(skp)) * skillpoint_damage_mult[i]);
    }
    let static_boost = (stats.get(specific_boost_str.toLowerCase()+'Pct') + stats.get('damPct')) / 100;

    // These do not count raw damage. I think. Easy enough to change
    let total_min = 0;
    let total_max = 0;
    let save_prop = [];
    for (let i in damage_elements) {
        save_prop.push(damages[i].slice());
        total_min += damages[i][0];
        total_max += damages[i][1];

        let damage_specific = damage_elements[i] + specific_boost_str + 'Pct';
        let damageBoost = 1 + skill_boost[i] + static_boost
                            + ((stats.get(damage_specific) + stats.get(damage_elements[i]+'DamPct')) /100);
        if (i > 0) {
            damageBoost += (stats.get('r'+specific_boost_str+'Pct') + stats.get('rDamPct')) / 100;
        }
        damages[i][0] *= Math.max(damageBoost, 0);
        damages[i][1] *= Math.max(damageBoost, 0);
        // Collect total damage post %boost
    }

    let total_elem_min = total_min - damages[0][0];
    let total_elem_max = total_max - damages[0][1];

    // 5.2: Raw application.
    let prop_raw = stats.get(specific_boost_str.toLowerCase()+'Raw') + stats.get('damRaw');
    let rainbow_raw = stats.get('r'+specific_boost_str+'Raw') + stats.get('rDamRaw');
    for (let i in damages) {
        let save_obj = save_prop[i];
        let damages_obj = damages[i];
        let damage_prefix = damage_elements[i] + specific_boost_str;
        // Normie raw
        let raw_boost = 0;
        if (present[i]) {
            raw_boost += stats.get(damage_prefix+'Raw') + stats.get(damage_elements[i]+'DamRaw');
        }
        // Next, rainraw and propRaw
        let min_boost = raw_boost;
        let max_boost = raw_boost;
        if (total_max > 0) {    // TODO: what about total negative all raw?
            // TODO: compute actual chance of 0 damage. For now we just copy max ratio
            if (total_min === 0) {
                min_boost += (save_obj[1] / total_max) * prop_raw;
            }
            else {
                min_boost += (save_obj[0] / total_min) * prop_raw;
            }
            max_boost += (save_obj[1] / total_max) * prop_raw;
        }
        if (i != 0 && total_elem_max > 0) {   // rainraw    TODO above
            // TODO: compute actual chance of 0 damage. For now we just copy max ratio
            if (total_elem_min === 0) {
                min_boost += (save_obj[1] / total_elem_max) * rainbow_raw;
            }
            else {
                min_boost += (save_obj[0] / total_elem_min) * rainbow_raw;
            }
            max_boost += (save_obj[1] / total_elem_max) * rainbow_raw;
        }
        damages_obj[0] += min_boost * total_convert;
        damages_obj[1] += max_boost * total_convert;
    }

    // 6. Strength boosters
    // str/dex, as well as any other mutually multiplicative effects
    let strBoost = 1 + skill_boost[1];
    let total_dam_norm = [0, 0];
    let total_dam_crit = [0, 0];
    let damages_results = [];
    const mult_map = stats.get("damMult");
    let damage_mult = 1;
    for (const [k, v] of mult_map.entries()) {
        if (k.includes(':')) {
            // TODO: fragile... checking for specific part multipliers.
            const spell_match = k.split(':')[1];
            if (spell_match !== part_filter) {
                continue;
            }
        }
        damage_mult *= (1 + v/100);
    }

    const crit_mult = 1+(stats.get("critDamPct")/100);

    for (const damage of damages) {
        const res = [
            damage[0] * strBoost * damage_mult,       // Normal min
            damage[1] * strBoost * damage_mult,       // Normal max
            damage[0] * (strBoost + crit_mult) * damage_mult,       // Crit min
            damage[1] * (strBoost + crit_mult) * damage_mult,       // Crit max
        ];
        damages_results.push(res);
        total_dam_norm[0] += res[0];
        total_dam_norm[1] += res[1];
        total_dam_crit[0] += res[2];
        total_dam_crit[1] += res[3];
    }

    if (total_dam_norm[0] < 0) total_dam_norm[0] = 0;
    if (total_dam_norm[1] < 0) total_dam_norm[1] = 0;
    if (total_dam_crit[0] < 0) total_dam_crit[0] = 0;
    if (total_dam_crit[1] < 0) total_dam_crit[1] = 0;

    return [total_dam_norm, total_dam_crit, damages_results];
}

/*
Spell schema:

spell: {
    name:           str             internal string name for the spell. Unique identifier, also display
    cost:           Optional[int]   ignored for spells that are not id 1-4
    base_spell:     int             spell index. 0-4 are reserved (0 is melee, 1-4 is common 4 spells)
    spell_type:     str             [TODO: DEPRECATED/REMOVE] "healing" or "damage"
    scaling:        Optional[str]   [DEFAULT: "spell"] "melee" or "spell"
    use_atkspd:     Optional[bool]  [DEFAULT: true] true to factor attack speed, false otherwise.
    display:        Optional[str]   [DEFAULT: "total"] "total" to sum all parts. Or, the name of a spell part
    parts:          List[part]      Parts of this spell (different stuff the spell does basically)
}

NOTE: when using `replace_spell` on an existing spell, all fields become optional.
Specified fields overwrite existing fields; unspecified fields are left unchanged.


There are three possible spell "part" types: damage, heal, and total.

part: spell_damage | spell_heal | spell_total

spell_damage: {
    name:           str != "total"  Name of the part.
    type:           "damage"        [TODO: DEPRECATED/REMOVE] flag signaling what type of part it is. Can infer from fields
    multipliers:    array[num, 6]   floating point spellmults (though supposedly wynn only supports integer mults)
    display:        bool            To show part or not (for some spells there are too many intermediate calc parts). Default: True
}
spell_heal: {
    name:           str != "total"  Name of the part.
    type:           "heal"          [TODO: DEPRECATED/REMOVE] flag signaling what type of part it is. Can infer from fields
    power:          num             floating point healing power (1 is 100% of max hp).
    display:        bool            To show part or not (for some spells there are too many intermediate calc parts). Default: True
}
spell_total: {
    name:           str != "total"  Name of the part.
    type:           "total"         [TODO: DEPRECATED/REMOVE] flag signaling what type of part it is. Can infer from fields
    hits:           Map[str, Union[str, num]]   Keys are other part names, numbers are the multipliers. Undefined behavior if subparts
                                                are not the same type of spell. Can only pull from spells defined before it.
                                                Alternatively, a property reference of the format <ability_id>.propname
    display:        bool            To show part or not (for some spells there are too many intermediate calc parts). Default: True
}


Before passing to display, use the following structs.
NOTE: total is collapsed into damage or healing.

spell_damage: {
    type:           "damage"        Internal use
    name:           str             Display name of part. Should be human readable
    normal_min:     array[num, 6]   floating point damages (no crit, min), can be less than zero. Order: NETWFA
    normal_max:     array[num, 6]   floating point damages (no crit, max)
    normal_total:   array[num, 2]   (min, max) noncrit total damage (not negative)
    crit_min:       array[num, 6]   floating point damages (crit, min), can be less than zero. Order: NETWFA
    crit_max:       array[num, 6]   floating point damages (crit, max)
    crit_total:     array[num, 2]   (min, max) crit total damage (not negative)
}
spell_heal: {
    type:           "heal"          Internal use
    name:           str             Display name of part. Should be human readable
    heal_amount:    num             floating point HP healed (self)
}

*/

const default_spells = {
    wand: [{
        type: "replace_spell",  // not needed but makes this usable as an "abil part"
        name: "Wand Melee",  // TODO: name for melee attacks?
        base_spell: 0,
        scaling: "melee", use_atkspd: false,
        display: "Melee",
        parts: [{ name: "Melee", multipliers: [100, 0, 0, 0, 0, 0] }]
    }],
    spear: [{
        type: "replace_spell",  // not needed but makes this usable as an "abil part"
        name: "Melee",  // TODO: name for melee attacks?
        base_spell: 0,
        scaling: "melee", use_atkspd: false,
        display: "Melee",
        parts: [{ name: "Melee", multipliers: [100, 0, 0, 0, 0, 0] }]
    }],
    bow: [{
        type: "replace_spell",  // not needed but makes this usable as an "abil part"
        name: "Bow Shot",  // TODO: name for melee attacks?
        base_spell: 0,
        scaling: "melee", use_atkspd: false,
        display: "Single Shot",
        parts: [{ name: "Single Shot", multipliers: [100, 0, 0, 0, 0, 0] }]
    }],
    dagger: [{
        type: "replace_spell",  // not needed but makes this usable as an "abil part"
        name: "Melee",  // TODO: name for melee attacks?
        base_spell: 0,
        scaling: "melee", use_atkspd: false,
        display: "Melee",
        parts: [{ name: "Melee", multipliers: [100, 0, 0, 0, 0, 0] }]
    }],
    relik: [{
        type: "replace_spell",  // not needed but makes this usable as an "abil part"
        name: "Relik Melee",  // TODO: name for melee attacks?
        base_spell: 0,
        spell_type: "damage",
        scaling: "melee", use_atkspd: false,
        display: "Total",
        parts: [
            { name: "Single Beam", multipliers: [33, 0, 0, 0, 0, 0] },
            { name: "Total", hits: { "Single Beam": 3 } }
        ]
    }]
};

const spell_table = {
    "powder": [ //This is how instant-damage powder specials are implemented. 
        { title: "Quake", cost: 0, parts:[
                { subtitle: "Total Damage", type: "damage", multiplier: [155, 220, 285, 350, 415], conversion: [0,100,0,0,0,0], summary: true},
            ] },
        { title: "Chain Lightning", cost: 0, parts: [
                { subtitle: "Total Damage", type: "damage", multiplier: [200, 225, 250, 275, 300], conversion: [0,0,100,0,0,0], summary: true},
            ]},
        { title: "Courage", cost: 0, parts: [
                { subtitle: "Total Damage", type: "damage", multiplier: [75, 87.5, 100, 112.5, 125], conversion: [0,0,0,0,100,0], summary: true},
            ]}, //[75, 87.5, 100, 112.5, 125]
    ]
};
