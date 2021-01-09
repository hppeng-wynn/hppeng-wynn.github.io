// Calculate spell damage given a spell elemental conversion table, and a spell multiplier.
// If spell mult is 0, its melee damage and we don't multiply by attack speed.
function calculateSpellDamage(stats, spellConversions, rawModifier, pctModifier, spellMultiplier, weapon, total_skillpoints) {
    // Array of neutral + ewtfa damages. Each entry is a pair (min, max).
    let damages = [];
    for (const damage_string of stats.get("damageRaw")) {
        const damage_vals = damage_string.split("-").map(Number);
        damages.push(damage_vals);
    }

    // Applying powder.
    let neutralBase = damages[0].slice();
    let neutralRemainingRaw = damages[0];
    for (let i = 0; i < 5; ++i) {
        let conversionRatio = spellConversions[i+1]/100;
        let min_diff = Math.min(neutralRemainingRaw[0], conversionRatio * neutralBase[0]);
        let max_diff = Math.min(neutralRemainingRaw[1], conversionRatio * neutralBase[1]);
        damages[i+1][0] = Math.floor(damages[i+1][0] + min_diff);
        damages[i+1][1] = Math.floor(damages[i+1][1] + max_diff);
        neutralRemainingRaw[0] = Math.floor(neutralRemainingRaw[0] - min_diff);
        neutralRemainingRaw[1] = Math.floor(neutralRemainingRaw[1] - max_diff);
    }
    let rawBoosts = [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]];
    for (const powderID of weapon.get("powders")) {
        const powder = powderStats[powderID];
        // Bitwise to force conversion to integer (integer division).
        const element = (powderID/6) | 0;
        let conversionRatio = powder.convert/100;
        if (neutralRemainingRaw[0] > 0) {
            let min_diff = Math.min(neutralRemainingRaw[0], conversionRatio * neutralBase[0]);
            let max_diff = Math.min(neutralRemainingRaw[1], conversionRatio * neutralBase[1]);
            damages[element+1][0] = Math.floor(damages[element+1][0] + min_diff);
            damages[element+1][1] = Math.floor(damages[element+1][1] + max_diff);
            neutralRemainingRaw[0] = Math.floor(neutralRemainingRaw[0] - min_diff);
            neutralRemainingRaw[1] = Math.floor(neutralRemainingRaw[1] - max_diff);
        }
        damages[element+1][0] += powder.min;
        damages[element+1][1] += powder.max;
    }

    let damageMult = 1;
    // If we are doing melee calculations:
    if (spellMultiplier == 0) {
        spellMultiplier = 1;
    }
    else {
        damageMult *= spellMultiplier * baseDamageMultiplier[attackSpeeds.indexOf(stats.get("atkSpd"))];
    }
    //console.log(damages);
    //console.log(damageMult);

    rawModifier *= spellMultiplier;

    let totalDamNorm = [rawModifier, rawModifier];
    let totalDamCrit = [rawModifier, rawModifier];
    let damages_results = [];
    // 0th skillpoint is strength, 1st is dex.
    let str = total_skillpoints[0];
    let staticBoost = (pctModifier / 100.)  + skillPointsToPercentage(str);
    let skillBoost = [0];
    for (let i in total_skillpoints) {
        skillBoost.push(skillPointsToPercentage(total_skillpoints[i]) + stats.get("damageBonus")[i] / 100.);
    }

    for (let i in damages) {
        let damageBoost = 1 + skillBoost[i] + staticBoost;
        damages_results.push([
            Math.max(damages[i][0] * damageBoost * damageMult, 0),       // Normal min
            Math.max(damages[i][1] * damageBoost * damageMult, 0),       // Normal max
            Math.max(damages[i][0] * (1 + damageBoost) * damageMult, 0), // Crit min
            Math.max(damages[i][1] * (1 + damageBoost) * damageMult, 0), // Crit max
        ]);
        totalDamNorm[0] += damages_results[i][0];
        totalDamNorm[1] += damages_results[i][1];
        totalDamCrit[0] += damages_results[i][2];
        totalDamCrit[1] += damages_results[i][3];
    }
    damages_results[0][0] += rawModifier;
    damages_results[0][1] += rawModifier;
    damages_results[0][2] += rawModifier;
    damages_results[0][3] += rawModifier;
    return [totalDamNorm, totalDamCrit, damages_results];
}

const spell_table = {
    "wand": [
        { title: "Heal", cost: 6, parts: [
                { subtitle: "First Pulse", type: "heal", strength: 0.2 },
                { subtitle: "Second and Third Pulses", type: "heal", strength: 0.05 },
                { subtitle: "Total Heal", type: "heal", strength: 0.3 }
            ] },
        { title: "Teleport", cost: 4, parts: [
                { subtitle: "", type: "damage", multiplier: 100, conversion: [60, 0, 40, 0, 0, 0] },
            ] },
        { title: "Meteor", cost: 8, parts: [
                { subtitle: "Blast Damage", type: "damage", multiplier: 500, conversion: [40, 30, 0, 0, 30, 0] },
                { subtitle: "Burn Damage", type: "damage", multiplier: 125, conversion: [40, 30, 0, 0, 30, 0] },
            ] },
        { title: "Ice Snake", cost: 4, parts: [
                { subtitle: "", type: "damage", multiplier: 70, conversion: [50, 0, 0, 50, 0, 0] },
            ] },
    ],
    "spear": [
        { title: "Bash", cost: 6, parts: [
                { subtitle: "First Damage", type: "damage", multiplier: 130, conversion: [60, 40, 0, 0, 0, 0]},
                { subtitle: "Explosion Damage", type: "damage", multiplier: 130, conversion: [100, 0, 0, 0, 0, 0]},
            ] },
        { title: "Charge", cost: 4, parts: [
                { subtitle: "", type: "damage", multiplier: 150, conversion: [60, 0, 0, 0, 40, 0] },
            ] },
        { title: "Uppercut", cost: 10, parts: [
                { subtitle: "First Damage", type: "damage", multiplier: 300, conversion: [70, 20, 10, 0, 0, 0] },
                { subtitle: "Fireworks Damage", type: "damage", multiplier: 50, conversion: [60, 0, 40, 0, 0, 0] },
                { subtitle: "Crash Damage", type: "damage", multiplier: 50, conversion: [80, 0, 20, 0, 0, 0] },
            ] },
        { title: "War Scream", cost: 6, parts: [
                { subtitle: "Area Damage", type: "damage", multiplier: 50, conversion: [0, 0, 0, 0, 75, 25] },
                { subtitle: "Air Shout (Per Hit)", type: "damage", multiplier: 30, conversion: [0, 0, 0, 0, 75, 25] },
            ] },
    ],
    "bow": [
        { title: "Arrow Storm", cost: 6, parts: [
                { subtitle: "Total Damage", type: "damage", multiplier: 600, conversion: [60, 0, 25, 0, 15, 0]},
                { subtitle: "Per Arrow", type: "damage", multiplier: 10, conversion: [60, 0, 25, 0, 15, 0]},
            ] },
        { title: "Escape", cost: 3, parts: [
                { subtitle: "Landing Damage", type: "damage", multiplier: 100, conversion: [50, 0, 0, 0, 0, 50] },
            ] },
        { title: "Bomb Arrow", cost: 8, parts: [
                { subtitle: "", type: "damage", multiplier: 250, conversion: [60, 25, 0, 0, 15, 0] },
            ] },
        { title: "Arrow Shield", cost: 10, parts: [
                { subtitle: "Shield Damage", type: "damage", multiplier: 100, conversion: [70, 0, 0, 0, 0, 30] },
                { subtitle: "Arrow Rain Damage", type: "damage", multiplier: 200, conversion: [70, 0, 0, 0, 0, 30] },
            ] },
    ],
    "dagger": [
        { title: "Spin Attack", cost: 6, parts: [
                { subtitle: "", type: "damage", multiplier: 150, conversion: [70, 0, 30, 0, 0, 0]},
            ] },
        { title: "Vanish", cost: 1, parts: [
                { subtitle: "No Damage", type: "none" }
            ] },
        { title: "Multihit", cost: 8, parts: [
                { subtitle: "1st to 10th Hit", type: "damage", multiplier: 27, conversion: [100, 0, 0, 0, 0, 0] },
                { subtitle: "Fatality", type: "damage", multiplier: 120, conversion: [20, 0, 30, 50, 0, 0] },
                { subtitle: "Total Damage", type: "total", factors: [10, 1] },
            ] },
        { title: "Smoke Bomb", cost: 8, parts: [
                { subtitle: "Tick Damage", type: "damage", multiplier: 60, conversion: [45, 25, 0, 0, 0, 30] },
                { subtitle: "Total Damage", type: "damage", multiplier: 600, conversion: [45, 25, 0, 0, 0, 30] },
            ] },
    ],
    "relik": [
        { title: "Totem", cost: 4, parts: [
                { subtitle: "Smash Damage", type: "damage", multiplier: 100, conversion: [80, 0, 0, 0, 20, 0]},
                { subtitle: "Damage Tick", type: "damage", multiplier: 100, conversion: [80, 0, 0, 0, 0, 20]},
                { subtitle: "Heal Tick", type: "heal", strength: 0.04 },
            ] },
        { title: "Haul", cost: 1, parts: [
                { subtitle: "", type: "damage", multiplier: 100, conversion: [80, 0, 20, 0, 0, 0] },
            ] },
        { title: "Aura", cost: 8, parts: [
                { subtitle: "One Wave", type: "damage", multiplier: 200, conversion: [70, 0, 0, 30, 0, 0] },
            ] },
        { title: "Uproot", cost: 6, parts: [
                { subtitle: "", type: "damage", multiplier: 50, conversion: [70, 30, 0, 0, 0, 0] },
            ] },
    ]
}
