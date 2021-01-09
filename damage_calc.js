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
    let neutralRemaining = spellConversions[0];
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
    damages[0][0] *= neutralRemaining / 100;
    damages[0][1] *= neutralRemaining / 100;
    console.log(damages);

    let damageMult = 1;
    // If we are doing melee calculations:
    if (spellMultiplier == 0) {
        spellMultiplier = 1;
    }
    else {
        damageMult *= spellMultiplier * baseDamageMultiplier[attackSpeeds.indexOf(stats.get("atkSpd"))];
    }

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
    return [totalDamNorm, totalDamCrit, damages_results];
}
