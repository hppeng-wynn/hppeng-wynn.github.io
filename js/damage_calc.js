const damageMultipliers = new Map([ ["allytotem", .15], ["yourtotem", .35], ["vanish", 0.80], ["warscream", 0.10], ["bash", 0.50] ]);

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


function calculateSpellDamage(stats, weapon, conversions, use_spell_damage, ignore_speed=false, part=undefined) {
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

    // 2. Conversions.
    // 2.1. First, apply neutral conversion (scale weapon damage). Keep track of total weapon damage here.
    let damages = [];
    const neutral_convert = conversions[0] / 100;
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
    let total_convert = 0;  //TODO get confirmation that this is how raw works.
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

    // Also theres prop and rainbow!!
    const damage_elements = ['n'].concat(skp_elements); // netwfa

    if (!ignore_speed) {
        // 3. Apply attack speed multiplier. Ignored for melee single hit
        const attack_speed_mult = baseDamageMultiplier[attackSpeeds.indexOf(weapon.get("atkSpd"))];
        for (let i = 0; i < 6; ++i) {
            damages[i][0] *= attack_speed_mult;
            damages[i][1] *= attack_speed_mult;
        }
    }

    // 4. Add additive damage. TODO: Is there separate additive damage?
    for (let i = 0; i < 6; ++i) {
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
    for (let i in damages) {
        let damage_prefix = damage_elements[i] + specific_boost_str;
        let damageBoost = 1 + skill_boost[i] + static_boost
                            + ((stats.get(damage_prefix+'Pct') + stats.get(damage_elements[i]+'DamPct')) /100);
        damages[i][0] *= Math.max(damageBoost, 0);
        damages[i][1] *= Math.max(damageBoost, 0);
        // Collect total damage post %boost
        total_min += damages[i][0];
        total_max += damages[i][1];
    }

    let total_elem_min = total_min - damages[0][0];
    let total_elem_max = total_max - damages[0][1];

    // 5.2: Raw application.
    let prop_raw = stats.get(specific_boost_str.toLowerCase()+'Raw') + stats.get('damRaw');
    let rainbow_raw = stats.get('r'+specific_boost_str+'Raw') + stats.get('rDamRaw');
    for (let i in damages) {
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
            if (total_min > 0) {
                min_boost += (damages_obj[0] / total_min) * prop_raw;
            }
            max_boost += (damages_obj[1] / total_max) * prop_raw;
        }
        if (i != 0 && total_elem_max > 0) {   // rainraw    TODO above
            if (total_elem_min > 0) {
                min_boost += (damages_obj[0] / total_elem_min) * rainbow_raw;
            }
            max_boost += (damages_obj[1] / total_elem_max) * rainbow_raw;
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
    console.log(mult_map);
    let damage_mult = 1;
    for (const [k, v] of mult_map.entries()) {
        damage_mult *= (1 + v/100);
    }
    console.log(damage_mult);


    for (const damage of damages) {
        const res = [
            damage[0] * strBoost * damage_mult,       // Normal min
            damage[1] * strBoost * damage_mult,       // Normal max
            damage[0] * (strBoost + 1) * damage_mult,       // Crit min
            damage[1] * (strBoost + 1) * damage_mult,       // Crit max
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
}
spell_heal: {
    name:           str != "total"  Name of the part.
    type:           "heal"          [TODO: DEPRECATED/REMOVE] flag signaling what type of part it is. Can infer from fields
    power:          num             floating point healing power (1 is 100% of max hp).
}
spell_total: {
    name:           str != "total"  Name of the part.
    type:           "total"         [TODO: DEPRECATED/REMOVE] flag signaling what type of part it is. Can infer from fields
    hits:           Map[str, num]   Keys are other part names, numbers are the multipliers. Undefined behavior if subparts
                                        are not the same type of spell. Can only pull from spells defined before it.
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
    }, {
        name: "Heal",  // TODO: name for melee attacks? // JUST FOR TESTING...
        base_spell: 1,
        display: "Total Heal",
        parts: [
            { name: "First Pulse", power: 0.12 },
            { name: "Second and Third Pulses", power: 0.06 },
            { name: "Total Heal", hits: { "First Pulse": 1, "Second and Third Pulses": 2 } }
        ]
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
    "wand": [
        { title: "Heal", cost: 6, parts: [
                { subtitle: "First Pulse", type: "heal", strength: 0.12 },
                { subtitle: "Second and Third Pulses", type: "heal", strength: 0.06 },
                { subtitle: "Total Heal", type: "heal", strength: 0.24, summary: true },
                { subtitle: "First Pulse (Ally)", type: "heal", strength: 0.20 },
                { subtitle: "Second and Third Pulses (Ally)", type: "heal", strength: 0.1 },
                { subtitle: "Total Heal (Ally)", type: "heal", strength: 0.4 }
            ] },
        { title: "Teleport", cost: 4, parts: [
                { subtitle: "Total Damage", type: "damage", multiplier: 150, conversion: [60, 0, 40, 0, 0, 0], summary: true },
            ] },
        { title: "Meteor", cost: 8, parts: [
                { subtitle: "Blast Damage", type: "damage", multiplier: 500, conversion: [40, 30, 0, 0, 30, 0], summary: true },
                { subtitle: "Burn Damage", type: "damage", multiplier: 125, conversion: [100, 0, 0, 0, 0, 0] },
            ] },
        { title: "Ice Snake", cost: 4, parts: [
                { subtitle: "Total Damage", type: "damage", multiplier: 70, conversion: [50, 0, 0, 50, 0, 0], summary: true },
            ] },
    ],
    "spear": [
        { title: "Bash", cost: 6, parts: [
                { subtitle: "First Damage", type: "damage", multiplier: 130, conversion: [60, 40, 0, 0, 0, 0]},
                { subtitle: "Explosion Damage", type: "damage", multiplier: 130, conversion: [100, 0, 0, 0, 0, 0]},
                { subtitle: "Total Damage", type: "total", factors: [1, 1], summary: true },
            ] },
        { title: "Charge", cost: 4, variants: {
            DEFAULT: [
                { subtitle: "Total Damage", type: "damage", multiplier: 150, conversion: [60, 0, 0, 0, 40, 0], summary: true }
            ],
            RALLY: [
                { subtitle: "Self Heal", type: "heal", strength: 0.07, summary: true },
                { subtitle: "Ally Heal", type: "heal", strength: 0.15 }
            ]
            } },
        { title: "Uppercut", cost: 9, parts: [
                { subtitle: "First Damage", type: "damage", multiplier: 300, conversion: [70, 20, 10, 0, 0, 0] },
                { subtitle: "Fireworks Damage", type: "damage", multiplier: 50, conversion: [60, 0, 40, 0, 0, 0] },
                { subtitle: "Crash Damage", type: "damage", multiplier: 50, conversion: [80, 0, 20, 0, 0, 0] },
                { subtitle: "Total Damage", type: "total", factors: [1, 1, 1], summary: true },
            ] },
        { title: "War Scream", cost: 6, parts: [
                { subtitle: "Area Damage", type: "damage", multiplier: 50, conversion: [0, 0, 0, 0, 75, 25], summary: true },
                { subtitle: "Air Shout (Per Hit)", type: "damage", multiplier: 30, conversion: [0, 0, 0, 0, 75, 25] },
            ] },
    ],
    "bow": [
        { title: "Arrow Storm", cost: 6, variants: {
            DEFAULT: [
                { subtitle: "Total Damage", type: "damage", multiplier: 600, conversion: [60, 0, 25, 0, 15, 0], summary: true },
                { subtitle: "Per Arrow (60)", type: "damage", multiplier: 10, conversion: [60, 0, 25, 0, 15, 0]}
            ],
            HAWKEYE: [
                { subtitle: "Total Damage (Hawkeye)", type: "damage", multiplier: 400, conversion: [60, 0, 25, 0, 15, 0], summary: true },
                { subtitle: "Per Arrow (5)", type: "damage", multiplier: 80, conversion: [60, 0, 25, 0, 15, 0]}
            ],
            } },
        { title: "Escape", cost: 3, parts: [
                { subtitle: "Landing Damage", type: "damage", multiplier: 100, conversion: [50, 0, 0, 0, 0, 50], summary: true },
            ] },
        { title: "Bomb Arrow", cost: 8, parts: [
                { subtitle: "Total Damage", type: "damage", multiplier: 250, conversion: [60, 25, 0, 0, 15, 0], summary: true },
            ] },
        { title: "Arrow Shield", cost: 10, parts: [
                { subtitle: "Shield Damage", type: "damage", multiplier: 100, conversion: [70, 0, 0, 0, 0, 30], summary: true },
                { subtitle: "Arrow Rain Damage", type: "damage", multiplier: 200, conversion: [70, 0, 0, 0, 0, 30] },
            ] },
    ],
    "dagger": [
        { title: "Spin Attack", cost: 6, parts: [
                { subtitle: "Total Damage", type: "damage", multiplier: 150, conversion: [70, 0, 30, 0, 0, 0], summary: true},
            ] },
        { title: "Vanish", cost: 2, parts: [
                { subtitle: "No Damage", type: "none", summary: true }
            ] },
        { title: "Multihit", cost: 8, parts: [
                { subtitle: "1st to 10th Hit", type: "damage", multiplier: 27, conversion: [100, 0, 0, 0, 0, 0] },
                { subtitle: "Fatality", type: "damage", multiplier: 120, conversion: [20, 0, 30, 50, 0, 0] },
                { subtitle: "Total Damage", type: "total", factors: [10, 1], summary: true },
            ] },
        { title: "Smoke Bomb", cost: 8, variants: {
            DEFAULT: [
                { subtitle: "Tick Damage (10 max)", type: "damage", multiplier: 60, conversion: [50, 25, 0, 0, 0, 25] },
                { subtitle: "Total Damage", type: "damage", multiplier: 600, conversion: [50, 25, 0, 0, 0, 25], summary: true },
            ],
            CHERRY_BOMBS: [
                { subtitle: "Total Damage (Cherry Bombs)", type: "damage", multiplier: 330, conversion: [50, 25, 0, 0, 0, 25], summary: true },
                { subtitle: "Per Bomb", type: "damage", multiplier: 110, conversion: [50, 25, 0, 0, 0, 25] }
            ]
            } },
    ],
    "relik": [
        { title: "Totem", cost: 4, parts: [
                { subtitle: "Smash Damage", type: "damage", multiplier: 100, conversion: [80, 0, 0, 0, 20, 0]},
                { subtitle: "Damage Tick", type: "damage", multiplier: 20, conversion: [80, 0, 0, 0, 0, 20]},
                { subtitle: "Heal Tick", type: "heal", strength: 0.03, summary: true },
            ] },
        { title: "Haul", cost: 1, parts: [
                { subtitle: "Total Damage", type: "damage", multiplier: 100, conversion: [80, 0, 20, 0, 0, 0], summary: true },
            ] },
        { title: "Aura", cost: 8, parts: [
                { subtitle: "One Wave", type: "damage", multiplier: 200, conversion: [70, 0, 0, 30, 0, 0], summary: true },
            ] },
        { title: "Uproot", cost: 6, parts: [
                { subtitle: "Total Damage", type: "damage", multiplier: 100, conversion: [70, 30, 0, 0, 0, 0], summary: true },
            ] },
    ],
    "sword": [
        { title: "Successive Strikes", cost: 5, parts: [
                { subtitle: "Damage", type: "damage", multiplier: 65, conversion: [70, 0, 15, 0, 0, 15]},
                { subtitle: "Final Strike", type: "damage", multiplier: 120, conversion: [70, 0, 15, 0, 0, 15]},
                { subtitle: "Total Damage (Normal)", type: "total", factors: [2, 0], summary: true },
            ] },
        { title: "Dash", cost: 3, parts: [
                { subtitle: "Damage", type: "damage", multiplier: 120, conversion: [60, 0, 0, 0, 0, 40], summary: true },
            ] },
        { title: "Execute", cost: 8, parts: [
                { subtitle: "Minimum Damage", type: "damage", multiplier: 100, conversion: [60, 0, 20, 0, 20, 0]},
                { subtitle: "Maximum Damage", type: "damage", multiplier: 1200, conversion: [60, 0, 20, 0, 20, 0], summary: true },
            ] },
        { title: "Blade Echo", cost: 4, parts: [
                { subtitle: "Damage", type: "damage", multiplier: 125, conversion: [60, 0, 0, 20, 0, 20], summary: true },
            ] },
    ],
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
