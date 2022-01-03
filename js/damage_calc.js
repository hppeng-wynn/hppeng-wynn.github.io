const damageMultipliers = new Map([ ["allytotem", .15], ["yourtotem", .35], ["vanish", 0.80], ["warscream", 0.10], ["bash", 0.50] ]);
// Calculate spell damage given a spell elemental conversion table, and a spell multiplier.
// If spell mult is 0, its melee damage and we don't multiply by attack speed.
// externalStats should be a map
function calculateSpellDamage(stats, spellConversions, rawModifier, pctModifier, spellMultiplier, weapon, total_skillpoints, damageMultiplier, externalStats) {
    let buildStats = new Map(stats);
    let tooltipinfo = new Map();
    //6x for damages, normal min normal max crit min crit max
    let damageformulas = [["Min: = ","Max: = ","Min: = ","Max: = "],["Min: = ","Max: = ","Min: = ","Max: = "],["Min: = ","Max: = ","Min: = ","Max: = "],["Min: = ","Max: = ","Min: = ","Max: = "],["Min: = ","Max: = ","Min: = ","Max: = "],["Min: = ","Max: = ","Min: = ","Max: = "]];

    if(externalStats) { //if nothing is passed in, then this hopefully won't trigger
        for (const entry of externalStats) {
            const key = entry[0];
            const value = entry[1];
            if (typeof value === "number") {
                buildStats.set(key, buildStats.get(key) + value);
            } else if (Array.isArray(value)) {
                arr = [];
                for (let j = 0; j < value.length; j++) {
                    arr[j] = buildStats.get(key)[j] + value[j];
                }
                buildStats.set(key, arr);
            }
        }
    }

    let powders = weapon.get("powders").slice();
    
    // Array of neutral + ewtfa damages. Each entry is a pair (min, max).
    let damages = [];
    const rawDamages = buildStats.get("damageRaw");
    for (let i = 0; i < rawDamages.length; i++) {
        const damage_vals = rawDamages[i].split("-").map(Number);
        damages.push(damage_vals);
    }

    // Applying spell conversions
    let neutralBase = damages[0].slice();
    let neutralRemainingRaw = damages[0].slice();

  
    //powder application for custom crafted weapons is inherently fucked because there is no base. Unsure what to do.

    //Powder application for Crafted weapons - this implementation is RIGHT YEAAAAAAAAA
    //1st round - apply each as ingred, 2nd round - apply as normal
    if (weapon.get("tier") === "Crafted") {
        let damageBases = buildStats.get("damageBases").slice();
        for (const p of powders.concat(weapon.get("ingredPowders"))) {
            let powder = powderStats[p];  //use min, max, and convert
            let element = Math.floor((p+0.01)/6); //[0,4], the +0.01 attempts to prevent division error
            let diff = Math.floor(damageBases[0] * powder.convert/100);
            damageBases[0] -= diff;
            damageBases[element+1] += diff + Math.floor( (powder.min + powder.max) / 2 );
        }
        //update all damages
        if(!weapon.get("custom")) {
            for (let i = 0; i < damages.length; i++) {
                damages[i] = [Math.floor(damageBases[i] * 0.9), Math.floor(damageBases[i] * 1.1)];
            }
        }
        
        neutralRemainingRaw = damages[0].slice();
        neutralBase = damages[0].slice();
    }
    
    for (let i = 0; i < 5; ++i) {
        let conversionRatio = spellConversions[i+1]/100;
        let min_diff = Math.min(neutralRemainingRaw[0], conversionRatio * neutralBase[0]);
        let max_diff = Math.min(neutralRemainingRaw[1], conversionRatio * neutralBase[1]);
        damages[i+1][0] = Math.floor(round_near(damages[i+1][0] + min_diff));
        damages[i+1][1] = Math.floor(round_near(damages[i+1][1] + max_diff));
        neutralRemainingRaw[0] = Math.floor(round_near(neutralRemainingRaw[0] - min_diff));
        neutralRemainingRaw[1] = Math.floor(round_near(neutralRemainingRaw[1] - max_diff));
    }

    //apply powders to weapon
    for (const powderID of powders) {
        const powder = powderStats[powderID];
        // Bitwise to force conversion to integer (integer division).
        const element = (powderID/6) | 0;
        let conversionRatio = powder.convert/100;
        if (neutralRemainingRaw[1] > 0) {
            let min_diff = Math.min(neutralRemainingRaw[0], conversionRatio * neutralBase[0]);
            let max_diff = Math.min(neutralRemainingRaw[1], conversionRatio * neutralBase[1]);
            damages[element+1][0] = Math.floor(round_near(damages[element+1][0] + min_diff));
            damages[element+1][1] = Math.floor(round_near(damages[element+1][1] + max_diff));
            neutralRemainingRaw[0] = Math.floor(round_near(neutralRemainingRaw[0] - min_diff));
            neutralRemainingRaw[1] = Math.floor(round_near(neutralRemainingRaw[1] - max_diff));
        }
        damages[element+1][0] += powder.min;
        damages[element+1][1] += powder.max;
    }

    

    
    //console.log(tooltipinfo);

    damages[0] = neutralRemainingRaw;
    tooltipinfo.set("damageBases", damages);

    let damageMult = damageMultiplier;
    let melee = false;
    // If we are doing melee calculations:
    tooltipinfo.set("dmgMult", damageMult);
    if (spellMultiplier == 0) {
        spellMultiplier = 1;
        melee = true;
    }
    else {
        tooltipinfo.set("dmgMult", `(${tooltipinfo.get("dmgMult")} * ${spellMultiplier} * ${baseDamageMultiplier[attackSpeeds.indexOf(buildStats.get("atkSpd"))]})`)
        damageMult *= spellMultiplier * baseDamageMultiplier[attackSpeeds.indexOf(buildStats.get("atkSpd"))];
    }
    //console.log(damages);
    //console.log(damageMult);
    tooltipinfo.set("rawModifier", `(${rawModifier} * ${spellMultiplier} * ${damageMultiplier})`);
    rawModifier *= spellMultiplier * damageMultiplier;
    let totalDamNorm = [0, 0];
    let totalDamCrit = [0, 0];
    let damages_results = [];
    // 0th skillpoint is strength, 1st is dex.
    let str = total_skillpoints[0];
    let strBoost = 1 + skillPointsToPercentage(str);
    if(!melee){
        let baseDam = rawModifier * strBoost;
        let baseDamCrit = rawModifier * (1 + strBoost);
        totalDamNorm = [baseDam, baseDam];
        totalDamCrit = [baseDamCrit, baseDamCrit];
        for (let arr of damageformulas) {
            arr = arr.map(x => x + " + " +tooltipinfo.get("rawModifier"));
        }
    }
    let staticBoost = (pctModifier / 100.);
    tooltipinfo.set("staticBoost", `${(pctModifier/ 100.).toFixed(2)}`);
    tooltipinfo.set("skillBoost",["","","","","",""]);
    let skillBoost = [0];
    for (let i in total_skillpoints) {
        skillBoost.push(skillPointsToPercentage(total_skillpoints[i]) + buildStats.get("damageBonus")[i] / 100.);
        tooltipinfo.get("skillBoost")[parseInt(i,10)+1] = `(${skillPointsToPercentage(total_skillpoints[i]).toFixed(2)} + ${(buildStats.get("damageBonus")[i]/100.).toFixed(2)})`
    }
    tooltipinfo.get("skillBoost")[0] = undefined;

    for (let i in damages) {
        let damageBoost = 1 + skillBoost[i] + staticBoost;
        tooltipinfo.set("damageBoost", `(1 + ${(tooltipinfo.get("skillBoost")[i] ? tooltipinfo.get("skillBoost")[i] + " + " : "")} ${tooltipinfo.get("staticBoost")})`)
        damages_results.push([
            Math.max(damages[i][0] * strBoost * Math.max(damageBoost,0) * damageMult, 0),       // Normal min
            Math.max(damages[i][1] * strBoost * Math.max(damageBoost,0) * damageMult, 0),       // Normal max
            Math.max(damages[i][0] * (strBoost + 1) * Math.max(damageBoost,0) * damageMult, 0),       // Crit min
            Math.max(damages[i][1] * (strBoost + 1) * Math.max(damageBoost,0) * damageMult, 0),       // Crit max
        ]);
        damageformulas[i][0] += `(max((${tooltipinfo.get("damageBases")[i][0]} * ${strBoost} * max(${tooltipinfo.get("damageBoost")}, 0) * ${tooltipinfo.get("dmgMult")}), 0))`
        damageformulas[i][1] += `(max((${tooltipinfo.get("damageBases")[i][1]} * ${strBoost} * max(${tooltipinfo.get("damageBoost")}, 0) * ${tooltipinfo.get("dmgMult")}), 0))`
        damageformulas[i][2] += `(max((${tooltipinfo.get("damageBases")[i][0]} * ${strBoost} * 2 * max(${tooltipinfo.get("damageBoost")}, 0) * ${tooltipinfo.get("dmgMult")}), 0))`
        damageformulas[i][3] += `(max((${tooltipinfo.get("damageBases")[i][1]} * ${strBoost} * 2 * max(${tooltipinfo.get("damageBoost")}, 0) * ${tooltipinfo.get("dmgMult")}), 0))`
        totalDamNorm[0] += damages_results[i][0];
        totalDamNorm[1] += damages_results[i][1];
        totalDamCrit[0] += damages_results[i][2];
        totalDamCrit[1] += damages_results[i][3];
    }
    if (melee) {
        totalDamNorm[0] += Math.max(strBoost*rawModifier, -damages_results[0][0]);
        totalDamNorm[1] += Math.max(strBoost*rawModifier, -damages_results[0][1]);
        totalDamCrit[0] += Math.max((strBoost+1)*rawModifier, -damages_results[0][2]);
        totalDamCrit[1] += Math.max((strBoost+1)*rawModifier, -damages_results[0][3]);
    }
    damages_results[0][0] += strBoost*rawModifier;
    damages_results[0][1] += strBoost*rawModifier;
    damages_results[0][2] += (strBoost + 1)*rawModifier;
    damages_results[0][3] += (strBoost + 1)*rawModifier;
    for (let i = 0; i < 2; i++) {
        damageformulas[0][i] += ` + (${strBoost} * ${tooltipinfo.get("rawModifier")})`
    }
    for (let i = 2; i < 4; i++) {
        damageformulas[0][i] += ` + (2 * ${strBoost} * ${tooltipinfo.get("rawModifier")})`
    }

    if (totalDamNorm[0] < 0) totalDamNorm[0] = 0;
    if (totalDamNorm[1] < 0) totalDamNorm[1] = 0;
    if (totalDamCrit[0] < 0) totalDamCrit[0] = 0;
    if (totalDamCrit[1] < 0) totalDamCrit[1] = 0;

    tooltipinfo.set("damageformulas", damageformulas);
    return [totalDamNorm, totalDamCrit, damages_results, tooltipinfo];
}



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
