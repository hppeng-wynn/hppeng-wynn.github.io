function optimizeStrDex() {
    if (!player_build) {
        return;
    }
    const remaining = levelToSkillPoints(player_build.level) - player_build.assigned_skillpoints;
    const base_skillpoints = player_build.base_skillpoints;
    const max_str_boost = 100 - base_skillpoints[0];
    const max_dex_boost = 100 - base_skillpoints[1];
    if (Math.min(remaining, max_str_boost, max_dex_boost) < 0) return; // Unwearable

    const base_total_skillpoints = player_build.total_skillpoints;
    let str_bonus = remaining;
    let dex_bonus = 0;
    let best_skillpoints = player_build.total_skillpoints;
    let best_damage = 0;
    for (let i = 0; i <= remaining; ++i) {
        let total_skillpoints = base_total_skillpoints.slice();
        total_skillpoints[0] += Math.min(max_str_boost, str_bonus);
        total_skillpoints[1] += Math.min(max_dex_boost, dex_bonus);

        // Calculate total 3rd spell damage
        let spell = spell_table[player_build.weapon.statMap.get("type")][2];
        const stats = player_build.statMap;
        let critChance = skillPointsToPercentage(total_skillpoints[1]);
        let save_damages = [];
        let spell_parts;
        if (spell.parts) {
            spell_parts = spell.parts;
        }
        else {
            spell_parts = spell.variants.DEFAULT;
            for (const majorID of stats.get("activeMajorIDs")) {
                if (majorID in spell.variants) {
                    spell_parts = spell.variants[majorID];
                    break;
                }
            }
        }
        let total_damage = 0;
        for (const part of spell_parts) {
            if (part.type === "damage") {
                let _results = calculateSpellDamage(stats, part.conversion,
                                        stats.get("sdRaw"), stats.get("sdPct"), 
                                        part.multiplier / 100, player_build.weapon.statMap, total_skillpoints, 1);
                let totalDamNormal = _results[0];
                let totalDamCrit = _results[1];
                let results = _results[2];
                let tooltipinfo = _results[3];
                
                for (let i = 0; i < 6; ++i) {
                    for (let j in results[i]) {
                        results[i][j] = results[i][j].toFixed(2);
                    }
                }
                let nonCritAverage = (totalDamNormal[0]+totalDamNormal[1])/2 || 0;
                let critAverage = (totalDamCrit[0]+totalDamCrit[1])/2 || 0;
                let averageDamage = (1-critChance)*nonCritAverage+critChance*critAverage || 0;

                save_damages.push(averageDamage);
                if (part.summary == true) {
                    total_damage = averageDamage;
                }
            } else if (part.type === "total") {
                total_damage = 0;
                for (let i in part.factors) {
                    total_damage += save_damages[i] * part.factors[i];
                }
            }
        }        // END Calculate total 3rd spell damage (total_damage)
        if (total_damage > best_damage) {
            best_damage = total_damage;
            best_skillpoints = total_skillpoints.slice();
        }

        str_bonus -= 1;
        dex_bonus += 1;
    }
    console.log(best_skillpoints);

    // TODO do not merge for performance reasons
    for (let i in skp_order) {
        skp_inputs[i].input_field.value = best_skillpoints[i];
        skp_inputs[i].mark_dirty();
    }
    for (let i in skp_order) {
        skp_inputs[i].update();
    }
}

