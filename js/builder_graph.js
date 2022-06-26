let armor_powder_node = new (class extends ComputeNode {
    constructor() { super('builder-armor-powder-input'); }

    compute_func(input_map) {
        let damage_boost = 0;
        let def_boost = 0;
        let statMap = new Map();
        for (const [e, elem] of zip2(skp_elements, skp_order)) {
            let val = parseInt(document.getElementById(elem+"_boost_armor").value);
            statMap.set(e+'DamPct', val);
        }
        return statMap;
    }
})().update();

/* Updates PASSIVE powder special boosts (armors)
*/
function update_armor_powder_specials(elem_id) {
    //we only update the powder special + external stats if the player has a build
    let wynn_elem = elem_id.split("_")[0]; //str, dex, int, def, agi

    //update the label associated w/ the slider 
    let elem = document.getElementById(elem_id);
    let label = document.getElementById(elem_id + "_label");
    let value = elem.value;

    label.textContent = label.textContent.split(":")[0] + ": " + value
    
    //update the slider's graphics
    let bg_color = elem_colors[skp_order.indexOf(wynn_elem)];
    let pct = Math.round(100 * value / powderSpecialStats[skp_order.indexOf(wynn_elem)].cap);
    elem.style.background = `linear-gradient(to right, ${bg_color}, ${bg_color} ${pct}%, #AAAAAA ${pct}%, #AAAAAA 100%)`;

    armor_powder_node.mark_dirty().update();
}


let boosts_node = new (class extends ComputeNode {
    constructor() { super('builder-boost-input'); }

    compute_func(input_map) {
        let damage_boost = 0;
        let def_boost = 0;
        for (const [key, value] of damageMultipliers) {
            let elem = document.getElementById(key + "-boost")
            if (elem.classList.contains("toggleOn")) {
                damage_boost += value;
                if (key === "warscream") { def_boost += .20 }
                if (key === "vanish") { def_boost += .15 }
            }
        }
        return [damage_boost, def_boost];
    }
})().update();

/* Updates all spell boosts
*/
function update_boosts(buttonId) {
    let elem = document.getElementById(buttonId);
    if (elem.classList.contains("toggleOn")) {
        elem.classList.remove("toggleOn");
    } else {
        elem.classList.add("toggleOn");
    }
    boosts_node.mark_dirty().update();
}

let specialNames = ["Quake", "Chain Lightning", "Curse", "Courage", "Wind Prison"];
let powder_special_input = new (class extends ComputeNode {
    constructor() { super('builder-powder-special-input'); }

    compute_func(input_map) {
        let powder_specials = []; // [ [special, power], [special, power]]
        for (const sName of specialNames) {
            for (let i = 1;i < 6; i++) {
                if (document.getElementById(sName.replace(" ","_") + "-" + i).classList.contains("toggleOn")) {
                    let powder_special = powderSpecialStats[specialNames.indexOf(sName.replace("_"," "))]; 
                    powder_specials.push([powder_special, i]);
                    break;
                }   
            }
        }
        return powder_specials;
    }
})();

function updatePowderSpecials(buttonId) {
    let prefix = (buttonId).split("-")[0].replace(' ', '_') + '-';
    let elem = document.getElementById(buttonId);
    if (elem.classList.contains("toggleOn")) { elem.classList.remove("toggleOn"); }
    else {
        for (let i = 1;i < 6; i++) { //toggle all pressed buttons of the same powder special off
            //name is same, power is i
            const elem2 = document.getElementById(prefix + i);
            if(elem2.classList.contains("toggleOn")) { elem2.classList.remove("toggleOn"); }
        }
        //toggle the pressed button on
        elem.classList.add("toggleOn"); 
    }
    powder_special_input.mark_dirty().update();
}

class PowderSpecialCalcNode extends ComputeNode {
    constructor() { super('builder-powder-special-apply'); }

    compute_func(input_map) {
        const powder_specials = input_map.get('powder-specials');
        let stats = new Map();
        for (const [special, power] of powder_specials) {
            if (special["weaponSpecialEffects"].has("Damage Boost")) { 
                let name = special["weaponSpecialName"];
                if (name === "Courage" || name === "Curse") { //courage and curse are is universal damage boost
                    stats.set("sdPct", special.weaponSpecialEffects.get("Damage Boost")[power-1]);
                    stats.set("mdPct", special.weaponSpecialEffects.get("Damage Boost")[power-1]);
                    stats.set("poisonPct", special.weaponSpecialEffects.get("Damage Boost")[power-1]);
                } else if (name === "Wind Prison") {
                    stats.set("aDamPct", special.weaponSpecialEffects.get("Damage Boost")[power-1]);
                }
            }
        }
        return stats;
    }
}

class PowderSpecialDisplayNode extends ComputeNode {
    // TODO: Refactor this entirely to be adding more spells to the spell list
    constructor() {
        super('builder-powder-special-display');
        this.fail_cb = true;
    }

    compute_func(input_map) {
        const powder_specials = input_map.get('powder-specials');
        const stats = input_map.get('stats');
        const weapon = input_map.get('build').weapon;
        displayPowderSpecials(document.getElementById("powder-special-stats"), powder_specials, stats, weapon.statMap, true); 
    }
}

/**
 * Node for getting an item's stats from an item input field.
 *
 * Signature: ItemInputNode(powdering: Optional[list[powder]]) => Item | null
 */
class ItemInputNode extends InputNode {
    /**
     * Make an item stat pulling compute node.
     *
     * @param name: Name of this node.
     * @param item_input_field: Input field (html element) to listen for item names from.
     * @param none_item: Item object to use as the "none" for this field.
     */
    constructor(name, item_input_field, none_item) {
        super(name, item_input_field);
        this.none_item = new Item(none_item);
        this.category = this.none_item.statMap.get('category');
        if (this.category == 'armor' || this.category == 'weapon') {
            this.none_item.statMap.set('powders', []);
            apply_weapon_powders(this.none_item.statMap); // Needed to put in damagecalc zeros
        }
        this.none_item.statMap.set('NONE', true);
    }

    compute_func(input_map) {
        const powdering = input_map.get('powdering');

        // built on the assumption of no one will type in CI/CR letter by letter
        let item_text = this.input_field.value;
        if (!item_text) {
            return this.none_item;
        }

        let item;
        if (item_text.slice(0, 3) == "CI-") { item = getCustomFromHash(item_text); }
        else if (item_text.slice(0, 3) == "CR-") { item = getCraftFromHash(item_text); } 
        else if (itemMap.has(item_text)) { item = new Item(itemMap.get(item_text)); } 
        else if (tomeMap.has(item_text)) { item = new Item(tomeMap.get(item_text)); }

        if (item) {
            if (powdering !== undefined) {
                item.statMap.set('powders', powdering);
            }
            let type_match;
            if (this.category == 'weapon') {
                type_match = item.statMap.get('category') == 'weapon';
            } else {
                type_match = item.statMap.get('type') == this.none_item.statMap.get('type');
            }
            if (type_match) {
                if (item.statMap.get('category') == 'armor') {
                    applyArmorPowders(item.statMap);
                }
                else if (item.statMap.get('category') == 'weapon') {
                    apply_weapon_powders(item.statMap);
                }
                return item;
            }
        }
        else if (this.none_item.statMap.get('category') === 'weapon' && item_text.startsWith("Morph-")) {
            let replace_items = [ "Morph-Stardust",
                "Morph-Steel",
                "Morph-Iron",
                "Morph-Gold",
                "Morph-Topaz",
                "Morph-Emerald",
                "Morph-Amethyst",
                "Morph-Ruby",
                item_text.substring(6)
            ]

            for (const [i, x] of zip2(equipment_inputs, replace_items)) { setValue(i, x); }

            for (const node of item_nodes) { calcSchedule(node, 10); }
            return this.compute_func(input_map);
        }
        return null;
    }
}

/**
 * Node for updating item input fields from parsed items.
 *
 * Signature: ItemInputDisplayNode(item: Item) => null
 */
class ItemInputDisplayNode extends ComputeNode {

    constructor(name, eq, item_image) {
        super(name);
        this.input_field = document.getElementById(eq+"-choice");
        this.health_field = document.getElementById(eq+"-health");
        this.level_field = document.getElementById(eq+"-lv");
        this.powder_field = document.getElementById(eq+"-powder");  // possibly None
        this.image = item_image;
        this.fail_cb = true;
    }

    compute_func(input_map) {
        if (input_map.size !== 1) { throw "ItemInputDisplayNode accepts exactly one input (item)"; }
        const [item] = input_map.values();  // Extract values, pattern match it into size one list and bind to first element

        this.input_field.classList.remove("text-light", "is-invalid", 'Normal', 'Unique', 'Rare', 'Legendary', 'Fabled', 'Mythic', 'Set', 'Crafted', 'Custom');
        this.input_field.classList.add("text-light");
        this.image.classList.remove('Normal-shadow', 'Unique-shadow', 'Rare-shadow', 'Legendary-shadow', 'Fabled-shadow', 'Mythic-shadow', 'Set-shadow', 'Crafted-shadow', 'Custom-shadow');

        if (this.health_field) {
            // Doesn't exist for weapons.
            this.health_field.textContent = "0";
        }
        if (this.level_field) {
            // Doesn't exist for tomes.
            this.level_field.textContent = "0";
        }
        if (!item) {
            this.input_field.classList.add("is-invalid");
            return null;
        }
        if (item.statMap.has('powders')) {
            this.powder_field.placeholder = "powders";
        }

        if (item.statMap.has('NONE')) {
            return null;
        }

        if (item.statMap.has('powders')) {
            this.powder_field.placeholder = item.statMap.get('slots') + ' slots';
        }

        const tier = item.statMap.get('tier');
        this.input_field.classList.add(tier);
        if (this.health_field) {
            // Doesn't exist for weapons.
            this.health_field.textContent = item.statMap.get('hp');
        }
        if (this.level_field) {
            // Doesn't exist for tomes.
            this.level_field.textContent = item.statMap.get('lvl');
        }
        this.image.classList.add(tier + "-shadow");
        return null;
    }
}

/**
 * Node for rendering an item.
 *
 * Signature: ItemDisplayNode(item: Item) => null
 */
class ItemDisplayNode extends ComputeNode {
    constructor(name, target_elem) {
        super(name);
        this.target_elem = target_elem;
    }

    compute_func(input_map) {
        if (input_map.size !== 1) { throw "ItemInputDisplayNode accepts exactly one input (item)"; }
        const [item] = input_map.values();  // Extract values, pattern match it into size one list and bind to first element

        displayExpandedItem(item.statMap, this.target_elem);
        collapse_element("#"+this.target_elem);
    }
}

/**
 * Change the weapon to match correct type.
 *
 * Signature: WeaponInputDisplayNode(item: Item) => null
 */
class WeaponInputDisplayNode extends ComputeNode {

    constructor(name, image_field, dps_field) {
        super(name);
        this.image = image_field;
        this.dps_field = dps_field;
    }

    compute_func(input_map) {
        if (input_map.size !== 1) { throw "WeaponDisplayNode accepts exactly one input (item)"; }
        const [item] = input_map.values();  // Extract values, pattern match it into size one list and bind to first element

        const type = item.statMap.get('type');
        this.image.setAttribute('src', '../media/items/new/generic-'+type+'.png');
        let dps = get_base_dps(item.statMap);
        if (isNaN(dps)) {
            dps = dps[1];
            if (isNaN(dps)) dps = 0;
        }
        this.dps_field.textContent = Math.round(dps);
        
        //as of now, we NEED to have the dropdown tab visible/not hidden in order to properly display atree stuff.
        if (!document.getElementById("toggle-atree").classList.contains("toggleOn")) {
            toggle_tab('atree-dropdown'); 
            toggleButton('toggle-atree');
        }
        
        //for some reason we have to cast to string 
        construct_AT(document.getElementById("atree-ui"), atrees[wep_to_class.get(type)]); 

        if (document.getElementById("toggle-atree").classList.contains("toggleOn")) {
            toggle_tab('atree-dropdown'); 
            toggleButton('toggle-atree');
        }
    }
}

/**
 * Encode the build into a url-able string.
 *
 * Signature: BuildEncodeNode(build: Build,
 *                            helmet-powder: List[powder],
 *                            chestplate-powder: List[powder],
 *                            leggings-powder: List[powder],
 *                            boots-powder: List[powder],
 *                            weapon-powder: List[powder]) => str
 */
class BuildEncodeNode extends ComputeNode {
    constructor() { super("builder-encode"); }

    compute_func(input_map) {
        const build = input_map.get('build');
        let powders = [
            input_map.get('helmet-powder'),
            input_map.get('chestplate-powder'),
            input_map.get('leggings-powder'),
            input_map.get('boots-powder'),
            input_map.get('weapon-powder')
        ];
        const skillpoints = [
            input_map.get('str'),
            input_map.get('dex'),
            input_map.get('int'),
            input_map.get('def'),
            input_map.get('agi')
        ];
        // TODO: grr global state for copy button..
        player_build = build;
        build_powders = powders;
        return encodeBuild(build, powders, skillpoints);
    }
}

/**
 * Update the window's URL.
 *
 * Signature: URLUpdateNode(build_str: str) => null
 */
class URLUpdateNode extends ComputeNode {
    constructor() { super("builder-url-update"); }

    compute_func(input_map) {
        if (input_map.size !== 1) { throw "URLUpdateNode accepts exactly one input (build_str)"; }
        const [build_str] = input_map.values();  // Extract values, pattern match it into size one list and bind to first element
        location.hash = build_str;
    }
}

/**
 * Create a "build" object from a set of equipments.
 * Returns a new Build object, or null if all items are NONE items.
 *
 * Signature: BuildAssembleNode(helmet-input: Item,
 *                              chestplate-input: Item,
 *                              leggings-input: Item,
 *                              boots-input: Item,
 *                              ring1-input: Item,
 *                              ring2-input: Item,
 *                              bracelet-input: Item,
 *                              necklace-input: Item,
 *                              weapon-input: Item,
 *                              level-input: int) => Build | null
 */
class BuildAssembleNode extends ComputeNode {
    constructor() { super("builder-make-build"); }

    compute_func(input_map) {
        let equipments = [
            input_map.get('helmet-input'),
            input_map.get('chestplate-input'),
            input_map.get('leggings-input'),
            input_map.get('boots-input'),
            input_map.get('ring1-input'),
            input_map.get('ring2-input'),
            input_map.get('bracelet-input'),
            input_map.get('necklace-input'),
            input_map.get('weaponTome1-input'),
            input_map.get('weaponTome2-input'),
            input_map.get('armorTome1-input'),
            input_map.get('armorTome2-input'),
            input_map.get('armorTome3-input'),
            input_map.get('armorTome4-input'),
            input_map.get('guildTome1-input')
        ];
        let weapon = input_map.get('weapon-input');
        let level = input_map.get('level-input');

        let all_none = weapon.statMap.has('NONE');
        for (const item of equipments) {
            all_none = all_none && item.statMap.has('NONE');
        }
        if (all_none && !location.hash) {
            return null;
        }
        return new Build(level, equipments, weapon);
    }
}

/**
 * Read an input field and parse into a list of powderings.
 * Every two characters makes one powder. If parsing fails, NULL is returned.
 *
 * Signature: PowderInputNode() => List[powder] | null
 */
class PowderInputNode extends InputNode {

    constructor(name, input_field) { super(name, input_field); }

    compute_func(input_map) {
        // TODO: haha improve efficiency to O(n) dumb
        // also, error handling is missing
        let input = this.input_field.value.trim();
        let powdering = [];
        let errorederrors = [];
        while (input) {
            let first = input.slice(0, 2);
            let powder = powderIDs.get(first);
            if (powder === undefined) {
                return null;
            } else {
                powdering.push(powder);
            }
            input = input.slice(2);
        }
        return powdering;
    }
}

/**
 * Select a spell+spell "variation" based on a build / spell idx.
 * Right now this isn't much logic and is only used to abstract away major id interactions
 * but will become significantly more complex in wynn2.
 *
 * Signature: SpellSelectNode<int>(build: Build) => [Spell, SpellParts]
 */
class SpellSelectNode extends ComputeNode {
    constructor(spell_num) {
        super("builder-spell"+spell_num+"-select");
        this.spell_idx = spell_num;
    }

    compute_func(input_map) {
        const build = input_map.get('build');

        const i = this.spell_idx;
        let spell = spell_table[build.weapon.statMap.get("type")][i];
        let stats = build.statMap;

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
        return [spell, spell_parts];
    }
}

/*
 * Get all defensive stats for this build.
 */
function getDefenseStats(stats) {
    let defenseStats = [];
    let def_pct = skillPointsToPercentage(stats.get('def'));
    let agi_pct = skillPointsToPercentage(stats.get('agi'));
    //total hp
    let totalHp = stats.get("hp") + stats.get("hpBonus");
    if (totalHp < 5) totalHp = 5;
    defenseStats.push(totalHp);
    //EHP
    let ehp = [totalHp, totalHp];
    let defMult = (2 - stats.get("classDef")) * stats.get("defMultiplier");
    ehp[0] /= (1-def_pct)*(1-agi_pct)*defMult;
    ehp[1] /= (1-def_pct)*defMult;
    defenseStats.push(ehp);
    //HPR
    let totalHpr = rawToPct(stats.get("hprRaw"), stats.get("hprPct")/100.);
    defenseStats.push(totalHpr);
    //EHPR
    let ehpr = [totalHpr, totalHpr];
    ehpr[0] /= (1-def_pct)*(1-agi_pct)*defMult;
    ehpr[1] /= (1-def_pct)*defMult;
    defenseStats.push(ehpr);
    //skp stats
    defenseStats.push([ def_pct*100, agi_pct*100]);
    //eledefs - TODO POWDERS
    let eledefs = [0, 0, 0, 0, 0];
    for(const i in skp_elements){ //kinda jank but ok
        eledefs[i] = rawToPct(stats.get(skp_elements[i] + "Def"), stats.get(skp_elements[i] + "DefPct")/100.);
    }
    defenseStats.push(eledefs);
    
    //[total hp, [ehp w/ agi, ehp w/o agi], total hpr, [ehpr w/ agi, ehpr w/o agi], [def%, agi%], [edef,tdef,wdef,fdef,adef]]
    return defenseStats;
}

/**
 * Compute spell damage of spell parts.
 * Currently kinda janky / TODO while we rework the internal rep. of spells.
 *
 * Signature: SpellDamageCalcNode(weapon-input: Item,
 *                                stats: StatMap,
 *                                spell-info: [Spell, SpellParts]) => List[SpellDamage]
 */
class SpellDamageCalcNode extends ComputeNode {
    constructor(spell_num) {
        super("builder-spell"+spell_num+"-calc");
    }

    compute_func(input_map) {
        const weapon = input_map.get('build').weapon.statMap;
        const spell_info = input_map.get('spell-info');
        const spell_parts = spell_info[1];
        const stats = input_map.get('stats');
        const damage_mult = stats.get('damageMultiplier');
        const skillpoints = [
            stats.get('str'),
            stats.get('dex'),
            stats.get('int'),
            stats.get('def'),
            stats.get('agi')
        ];
        let spell_results = []

        for (const part of spell_parts) {
            if (part.type === "damage") {
                let tmp_conv = [];
                for (let i in part.conversion) {
                    tmp_conv.push(part.conversion[i] * part.multiplier/100);
                }
                let results = calculateSpellDamage(stats, weapon, tmp_conv, true);
                spell_results.push(results);
            } else if (part.type === "heal") {
                // TODO: wynn2 formula
                let heal_amount = (part.strength * getDefenseStats(stats)[0] * Math.max(0.5,Math.min(1.75, 1 + 0.5 * stats.get("wDamPct")/100))).toFixed(2);
                spell_results.push(heal_amount);
            } else if (part.type === "total") {
                // TODO: remove "total" type
                spell_results.push(null);
            }
        }
        return spell_results;
    }
}


/**
 * Display spell damage from spell parts.
 * Currently kinda janky / TODO while we rework the internal rep. of spells.
 *
 * Signature: SpellDisplayNode(stats: StatMap,
 *                             spell-info: [Spell, SpellParts],
 *                             spell-damage: List[SpellDamage]) => null
 */
class SpellDisplayNode extends ComputeNode {
    constructor(spell_num) {
        super("builder-spell"+spell_num+"-display");
        this.spell_idx = spell_num;
    }

    compute_func(input_map) {
        const stats = input_map.get('stats');
        const spell_info = input_map.get('spell-info');
        const damages = input_map.get('spell-damage');
        const spell = spell_info[0];
        const spell_parts = spell_info[1];

        const i = this.spell_idx;
        let parent_elem = document.getElementById("spell"+i+"-info");
        let overallparent_elem = document.getElementById("spell"+i+"-infoAvg");
        displaySpellDamage(parent_elem, overallparent_elem, stats, spell, i+1, spell_parts, damages);
    }
}

/*  Get melee stats for build.
    Returns an array in the order:
*/
function getMeleeStats(stats, weapon) {
    stats = new Map(stats); // Shallow copy
    const weapon_stats = weapon.statMap;
    const skillpoints = [
            stats.get('str'),
            stats.get('dex'),
            stats.get('int'),
            stats.get('def'),
            stats.get('agi')
        ];
    if (weapon_stats.get("tier") === "Crafted") {
        stats.set("damageBases", [weapon_stats.get("nDamBaseHigh"),weapon_stats.get("eDamBaseHigh"),weapon_stats.get("tDamBaseHigh"),weapon_stats.get("wDamBaseHigh"),weapon_stats.get("fDamBaseHigh"),weapon_stats.get("aDamBaseHigh")]);
    }
    let adjAtkSpd = attackSpeeds.indexOf(stats.get("atkSpd")) + stats.get("atkTier");
    if(adjAtkSpd > 6){
        adjAtkSpd = 6;
    }else if(adjAtkSpd < 0){
        adjAtkSpd = 0;
    }

    if (weapon_stats.get("type") === "relik") {
        stats.set('damageMultiplier', 0.99); // CURSE YOU WYNNCRAFT
        //One day we will create WynnWynn and no longer have shaman 99% melee injustice.
        //In all seriousness 99% is because wynn uses 0.33 to estimate dividing the damage by 3 to split damage between 3 beams.
    }
    let results = calculateSpellDamage(stats, weapon_stats, [100, 0, 0, 0, 0, 0], false, true);
    
    let dex = skillpoints[1];

    let totalDamNorm = results[0];
    let totalDamCrit = results[1];
    totalDamNorm.push(1-skillPointsToPercentage(dex));
    totalDamCrit.push(skillPointsToPercentage(dex));
    let damages_results = results[2];
    
    let singleHitTotal = ((totalDamNorm[0]+totalDamNorm[1])*(totalDamNorm[2])
                        +(totalDamCrit[0]+totalDamCrit[1])*(totalDamCrit[2]))/2;

    //Now do math
    let normDPS = (totalDamNorm[0]+totalDamNorm[1])/2 * baseDamageMultiplier[adjAtkSpd];
    let critDPS = (totalDamCrit[0]+totalDamCrit[1])/2 * baseDamageMultiplier[adjAtkSpd];
    let avgDPS = (normDPS * (1 - skillPointsToPercentage(dex))) + (critDPS * (skillPointsToPercentage(dex)));
    //[[n n n n] [e e e e] [t t t t] [w w w w] [f f f f] [a a a a] [lowtotal hightotal normalChance] [critlowtotal crithightotal critChance] normalDPS critCPS averageDPS adjAttackSpeed, singleHit] 
    return damages_results.concat([totalDamNorm,totalDamCrit,normDPS,critDPS,avgDPS,adjAtkSpd, singleHitTotal]).concat(results[3]);
}

/**
 * Display build stats.
 *
 * Signature: BuildDisplayNode(build: Build) => null
 */
class BuildDisplayNode extends ComputeNode {
    constructor() { super("builder-stats-display"); }

    compute_func(input_map) {
        const build = input_map.get('build');
        const stats = input_map.get('stats');
        displayBuildStats('overall-stats', build, build_all_display_commands, stats);
        displayBuildStats("offensive-stats", build, build_offensive_display_commands, stats);
        displaySetBonuses("set-info", build);
        let meleeStats = getMeleeStats(stats, build.weapon);
        // TODO: move weapon out?
        displayMeleeDamage(document.getElementById("build-melee-stats"), document.getElementById("build-melee-statsAvg"), meleeStats);

        displayDefenseStats(document.getElementById("defensive-stats"), stats);

        displayPoisonDamage(document.getElementById("build-poison-stats"), build);
        displayEquipOrder(document.getElementById("build-order"), build.equip_order);
    }
}

/**
 * Show warnings for skillpoints, level, set bonus for a build
 * Also shosw skill point remaining and other misc. info
 *
 * Signature: DisplayBuildWarningNode(build: Build, str: int, dex: int, int: int, def: int, agi: int) => null
 */
class DisplayBuildWarningsNode extends ComputeNode {
    constructor() { super("builder-show-warnings"); }

    compute_func(input_map) {
        const build = input_map.get('build');
        const min_assigned = build.base_skillpoints;
        const base_totals = build.total_skillpoints;
        const skillpoints = [
                input_map.get('str'),
                input_map.get('dex'),
                input_map.get('int'),
                input_map.get('def'),
                input_map.get('agi')
            ];
        let skp_effects = ["% more damage dealt.","% chance to crit.","% spell cost reduction.","% less damage taken.","% chance to dodge."];
        let total_assigned = 0;
        for (let i in skp_order){ //big bren
            const assigned = skillpoints[i] - base_totals[i] + min_assigned[i]
            setText(skp_order[i] + "-skp-assign", "Assign: " + assigned);
            setValue(skp_order[i] + "-skp", skillpoints[i]);
            let linebreak = document.createElement("br");
            linebreak.classList.add("itemp");
            setText(skp_order[i] + "-skp-pct", (skillPointsToPercentage(skillpoints[i])*100).toFixed(1).concat(skp_effects[i]));
            document.getElementById(skp_order[i]+"-warnings").textContent = ''
            if (assigned > 100) {
                let skp_warning = document.createElement("p");
                skp_warning.classList.add("warning"); skp_warning.classList.add("small-text");
                skp_warning.textContent += "Cannot assign " + assigned + " skillpoints in " + ["Strength","Dexterity","Intelligence","Defense","Agility"][i] + " manually.";
                document.getElementById(skp_order[i]+"-warnings").appendChild(skp_warning);
            }
            total_assigned += assigned;
        }

        let summarybox = document.getElementById("summary-box");
        summarybox.textContent = "";
        let skpRow = document.createElement("p");

        let remainingSkp = document.createElement("p");
        remainingSkp.classList.add("scaled-font");
        let remainingSkpTitle = document.createElement("b");
        remainingSkpTitle.textContent = "Assigned " + total_assigned + " skillpoints. Remaining skillpoints: ";
        let remainingSkpContent = document.createElement("b");
        remainingSkpContent.textContent = "" + (levelToSkillPoints(build.level) - total_assigned);
        remainingSkpContent.classList.add(levelToSkillPoints(build.level) - total_assigned < 0 ? "negative" : "positive");

        remainingSkp.appendChild(remainingSkpTitle);
        remainingSkp.appendChild(remainingSkpContent);

        summarybox.append(skpRow);
        summarybox.append(remainingSkp);
        if(total_assigned > levelToSkillPoints(build.level)){
            let skpWarning = document.createElement("span");
            //skpWarning.classList.add("itemp");
            skpWarning.classList.add("warning");
            skpWarning.textContent = "WARNING: Too many skillpoints need to be assigned!";
            let skpCount = document.createElement("p");
            skpCount.classList.add("warning");
            skpCount.textContent = "For level " + (build.level>101 ? "101+" : build.level)  + ", there are only " + levelToSkillPoints(build.level) + " skill points available.";
            summarybox.append(skpWarning);
            summarybox.append(skpCount);
        }
        let lvlWarning;
        for (const item of build.items) {
            let item_lvl;
            if (item.statMap.get("crafted")) {
                //item_lvl = item.get("lvlLow") + "-" + item.get("lvl");
                item_lvl = item.statMap.get("lvlLow");
            }
            else {
                item_lvl = item.statMap.get("lvl");
            }

            if (build.level < item_lvl) {
                if (!lvlWarning) {
                    lvlWarning = document.createElement("p");
                    lvlWarning.classList.add("itemp"); lvlWarning.classList.add("warning");
                    lvlWarning.textContent = "WARNING: A level " + build.level + " player cannot use some piece(s) of this build."
                }
                let baditem = document.createElement("p"); 
                    baditem.classList.add("nocolor"); baditem.classList.add("itemp"); 
                    baditem.textContent = item.statMap.get("displayName") + " requires level " + item_lvl + " to use.";
                    lvlWarning.appendChild(baditem);
            }
        }
        if(lvlWarning){
            summarybox.append(lvlWarning);
        }
        for (const [setName, count] of build.activeSetCounts) {
            const bonus = sets.get(setName).bonuses[count-1];
            if (bonus["illegal"]) {
                let setWarning = document.createElement("p");
                setWarning.classList.add("itemp"); setWarning.classList.add("warning");
                setWarning.textContent = "WARNING: illegal item combination: " + setName
                summarybox.append(setWarning);
            }
        }
    }
}

/**
 * Aggregate stats from all inputs (merges statmaps).
 *
 * Signature: AggregateStatsNode(*args) => StatMap
 */
class AggregateStatsNode extends ComputeNode {
    constructor() { super("builder-aggregate-stats"); }

    compute_func(input_map) {
        const output_stats = new Map();
        for (const [k, v] of input_map.entries()) {
            for (const [k2, v2] of v.entries()) {
                if (output_stats.has(k2)) {
                    // TODO: ugly AF
                    if (k2 === 'damageMultiplier' || k2 === 'defMultiplier') {
                        output_stats.set(k2, v2 * output_stats.get(k2));
                    }
                    else {
                        output_stats.set(k2, v2 + output_stats.get(k2));
                    }
                }
                else {
                    output_stats.set(k2, v2);
                }
            }
        }
        console.log(output_stats);
        return output_stats;
    }
}

/**
 * Aggregate editable ID stats with build and weapon type.
 *
 * Signature: AggregateEditableIDNode(build: Build, weapon: Item, *args) => StatMap
 */
class AggregateEditableIDNode extends ComputeNode {
    constructor() { super("builder-aggregate-inputs"); }

    compute_func(input_map) {
        const build = input_map.get('build'); input_map.delete('build');
        const weapon = input_map.get('weapon'); input_map.delete('weapon');

        const output_stats = new Map(build.statMap);
        for (const [k, v] of input_map.entries()) {
            output_stats.set(k, v);
        }

        output_stats.set('classDef', classDefenseMultipliers.get(weapon.statMap.get("type")));
        return output_stats;
    }
}

let edit_id_output;
function resetEditableIDs() {
    edit_id_output.notify();
}
/**
 * Set the editble id fields.
 *
 * Signature: EditableIDSetterNode(build: Build) => null
 */
class EditableIDSetterNode extends ComputeNode {
    constructor(notify_nodes) {
        super("builder-id-setter");
        this.notify_nodes = notify_nodes.slice();
    }

    compute_func(input_map) {
        if (input_map.size !== 1) { throw "EditableIDSetterNode accepts exactly one input (build)"; }
        const [build] = input_map.values();  // Extract values, pattern match it into size one list and bind to first element
        for (const id of editable_item_fields) {
            const val = build.statMap.get(id);
            document.getElementById(id).value = val;
            document.getElementById(id+'-base').textContent = 'Original Value: ' + val;
        }
    }

    notify() {
        this.mark_dirty();
        this.update();
        // NOTE: DO NOT merge these loops for performance reasons!!!
        for (const node of this.notify_nodes) {
            node.mark_dirty();
        }
        for (const node of this.notify_nodes) {
            node.update();
        }
    }
}

/**
 * Set skillpoint fields from build.
 * This is separate because..... because of the way we work with edit ids vs skill points during the load sequence....
 *
 * Signature: SkillPointSetterNode(build: Build) => null
 */
class SkillPointSetterNode extends ComputeNode {
    constructor(notify_nodes) {
        super("builder-skillpoint-setter");
        this.notify_nodes = notify_nodes.slice();
    }

    compute_func(input_map) {
        if (input_map.size !== 1) { throw "SkillPointSetterNode accepts exactly one input (build)"; }
        const [build] = input_map.values();  // Extract values, pattern match it into size one list and bind to first element
        for (const [idx, elem] of skp_order.entries()) {
            setText(elem + "-skp-base", "Original: " + build.base_skillpoints[idx]);
            document.getElementById(elem+'-skp').value = build.total_skillpoints[idx];
        }
        // NOTE: DO NOT merge these loops for performance reasons!!!
        for (const node of this.notify_nodes) {
            node.mark_dirty();
        }
        for (const node of this.notify_nodes) {
            node.update();
        }
    }
}

/**
 * Get number (possibly summed) from a text input.
 *
 * Signature: SumNumberInputNode() => int
 */
class SumNumberInputNode extends InputNode {
    compute_func(input_map) {
        const value = this.input_field.value;
        if (value === "") { value = 0; }

        let input_num = 0;
        if (value.includes("+")) {
            let skp = value.split("+");
            for (const s of skp) {
                const val = parseInt(s,10);
                if (isNaN(val)) {
                    return null;
                }
                input_num += val;
            }
        } else {
            input_num = parseInt(value,10);
            if (isNaN(input_num)) {
                return null;
            }
        }
        return input_num;
    }
}

let item_nodes = [];
let powder_nodes = [];
let spelldmg_nodes = [];
let edit_input_nodes = [];
let skp_inputs = [];

function builder_graph_init() {
    // Phase 1/2: Set up item input, propagate updates, etc.

    // Bind item input fields to input nodes, and some display stuff (for auto colorizing stuff).
    for (const [eq, display_elem, none_item] of zip3(equipment_fields, build_fields, none_items)) {
        let input_field = document.getElementById(eq+"-choice");
        let item_image = document.getElementById(eq+"-img");

        let item_input = new ItemInputNode(eq+'-input', input_field, none_item);
        item_nodes.push(item_input);
        new ItemInputDisplayNode(eq+'-input-display', eq, item_image).link_to(item_input);
        new ItemDisplayNode(eq+'-item-display', display_elem).link_to(item_input);
        //new PrintNode(eq+'-debug').link_to(item_input);
        //document.querySelector("#"+eq+"-tooltip").setAttribute("onclick", "collapse_element('#"+ eq +"-tooltip');"); //toggle_plus_minus('" + eq + "-pm'); 
    }
    for (const [eq, none_item] of zip2(tome_fields, [none_tomes[0], none_tomes[0], none_tomes[1], none_tomes[1], none_tomes[1], none_tomes[1], none_tomes[2]])) {
        let input_field = document.getElementById(eq+"-choice");
        let item_image = document.getElementById(eq+"-img");

        let item_input = new ItemInputNode(eq+'-input', input_field, none_item);
        item_nodes.push(item_input);
        new ItemInputDisplayNode(eq+'-input-display', eq, item_image).link_to(item_input);
    }

    // weapon image changer node.
    let weapon_image = document.getElementById("weapon-img");
    let weapon_dps = document.getElementById("weapon-dps");
    new WeaponInputDisplayNode('weapon-type', weapon_image, weapon_dps).link_to(item_nodes[8]);

    // Level input node.
    let level_input = new InputNode('level-input', document.getElementById('level-choice'));

    // "Build" now only refers to equipment and level (no powders). Powders are injected before damage calculation / stat display.
    let build_node = new BuildAssembleNode();
    for (const input of item_nodes) {
        build_node.link_to(input);
    }
    build_node.link_to(level_input);

    let build_encode_node = new BuildEncodeNode();
    build_encode_node.link_to(build_node, 'build');

    let url_update_node = new URLUpdateNode();
    url_update_node.link_to(build_encode_node, 'build-str');


    for (const input of powder_inputs) {
        let powder_node = new PowderInputNode(input, document.getElementById(input));
        powder_nodes.push(powder_node);
        build_encode_node.link_to(powder_node, input);
    }

    item_nodes[0].link_to(powder_nodes[0], 'powdering');
    item_nodes[1].link_to(powder_nodes[1], 'powdering');
    item_nodes[2].link_to(powder_nodes[2], 'powdering');
    item_nodes[3].link_to(powder_nodes[3], 'powdering');
    item_nodes[8].link_to(powder_nodes[4], 'powdering');

    // Phase 2/2: Set up editable IDs, skill points; use decodeBuild() skill points, calculate damage

    let build_disp_node = new BuildDisplayNode()
    build_disp_node.link_to(build_node, 'build');

    // Create one node that will be the "aggregator node" (listen to all the editable id nodes, as well as the build_node (for non editable stats) and collect them into one statmap)
    let stat_agg_node = new AggregateStatsNode();
    let edit_agg_node = new AggregateEditableIDNode();
    edit_agg_node.link_to(build_node, 'build').link_to(item_nodes[8], 'weapon');
    for (const field of editable_item_fields) {
        // Create nodes that listens to each editable id input, the node name should match the "id"
        const elem = document.getElementById(field);
        const node = new SumNumberInputNode('builder-'+field+'-input', elem);

        edit_agg_node.link_to(node, field);
        edit_input_nodes.push(node);
    }
    // Edit IDs setter declared up here to set ids so they will be populated by default.
    edit_id_output = new EditableIDSetterNode(edit_input_nodes);    // Makes shallow copy of list.
    edit_id_output.link_to(build_node);

    for (const skp of skp_order) {
        const elem = document.getElementById(skp+'-skp');
        const node = new SumNumberInputNode('builder-'+skp+'-input', elem);

        edit_agg_node.link_to(node, skp);
        build_encode_node.link_to(node, skp);
        edit_input_nodes.push(node);
        skp_inputs.push(node);
    }
    stat_agg_node.link_to(edit_agg_node);
    build_disp_node.link_to(stat_agg_node, 'stats');

    for (const input_node of item_nodes.concat(powder_nodes)) {
        input_node.update();
    }
    level_input.update();

    // Powder specials.
    let powder_special_calc = new PowderSpecialCalcNode().link_to(powder_special_input, 'powder-specials');
    new PowderSpecialDisplayNode().link_to(powder_special_input, 'powder-specials')
        .link_to(stat_agg_node, 'stats').link_to(build_node, 'build');
    stat_agg_node.link_to(powder_special_calc, 'powder-boost');
    stat_agg_node.link_to(armor_powder_node, 'armor-powder');
    powder_special_input.update();

    // Potion boost.
    stat_agg_node.link_to(boosts_node, 'potion-boost');

    // Also do something similar for skill points

    for (let i = 0; i < 4; ++i) {
        let spell_node = new SpellSelectNode(i);
        spell_node.link_to(build_node, 'build');
        // TODO: link and rewrite spell_node to the stat agg node
        spell_node.link_to(stat_agg_node, 'stats')

        let calc_node = new SpellDamageCalcNode(i);
        calc_node.link_to(build_node, 'build').link_to(stat_agg_node, 'stats')
            .link_to(spell_node, 'spell-info');
        spelldmg_nodes.push(calc_node);

        let display_node = new SpellDisplayNode(i);
        display_node.link_to(stat_agg_node, 'stats'); // TODO: same here..
        display_node.link_to(spell_node, 'spell-info');
        display_node.link_to(calc_node, 'spell-damage');
    }
    for (const node of edit_input_nodes) {
        node.update();
    }
    
    let skp_output = new SkillPointSetterNode(edit_input_nodes);
    skp_output.link_to(build_node);

    let build_warnings_node = new DisplayBuildWarningsNode();
    build_warnings_node.link_to(build_node, 'build');
    for (const [skp_input, skp] of zip2(skp_inputs, skp_order)) {
        build_warnings_node.link_to(skp_input, skp);
    }
    build_warnings_node.update();

    // call node.update() for each skillpoint node and stat edit listener node manually
    // NOTE: the text boxes for skill points are already filled out by decodeBuild() so this will fix them
    // this will propagate the update to the `stat_agg_node`, and then to damage calc

    console.log("Set up graph");
}

