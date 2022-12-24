/**
 * File containing compute graph structure of the builder page.
 */

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
})();

const damageMultipliers = new Map([ ["totem", 0.2], ["warscream", 0.0], ["ragnarokkr", 0.30], ["fortitude", 0.60], ["radiance", 0.0] ]);

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
            }
        }
        let res = new Map();
        res.set('damMult.Potion', 100*damage_boost);
        res.set('defMult.Potion', 100*def_boost);
        return res;
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
                if (name === "Courage" || name === "Curse" || name == "Wind Prison") { // Master mod all the way
                    stats.set("damMult."+name, special.weaponSpecialEffects.get("Damage Boost")[power-1]);
                    // legacy
                    stats.set("poisonPct", special.weaponSpecialEffects.get("Damage Boost")[power-1]);
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
 * Signature: ItemInputNode() => Item | null
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
            let type_match;
            if (this.category == 'weapon') {
                type_match = item.statMap.get('category') == 'weapon';
            } else {
                type_match = item.statMap.get('type') == this.none_item.statMap.get('type');
            }
            if (type_match) {
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

            for (const node of item_nodes) { 
                if (node !== this) {
                    // save a tiny bit of compute
                    calcSchedule(node, 10);
                }
            }
            // Needed to push the weapon node's updates forward
            return this.compute_func(input_map);
        }
        return null;
    }
}

/**
 * Node for updating item input fields from parsed items.
 *
 * Signature: ItemInputDisplayNode(item: Item, powdering: List[powder]) => Item
 */
class ItemPowderingNode extends ComputeNode {
    constructor(name) { super(name); }

    compute_func(input_map) {
        const powdering = input_map.get('powdering');
        const input_item = input_map.get('item');
        const item = input_item.copy(); // TODO: performance

        const max_slots = item.statMap.get('slots');
        item.statMap.set('powders', powdering.slice(0, max_slots));
        if (item.statMap.get('category') == 'armor') {
            applyArmorPowders(item.statMap);
        }
        else if (item.statMap.get('category') == 'weapon') {
            apply_weapon_powders(item.statMap);
        }
        return item;
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

        if (item.statMap.has('NONE')) {
            return null;
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
        this.image.style.backgroundPosition = itemBGPositions[type];
        
        let dps = get_base_dps(item.statMap);
        if (isNaN(dps)) {
            dps = dps[1];
            if (isNaN(dps)) dps = 0;
        }
        this.dps_field.textContent = Math.round(dps);
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
        const atree = input_map.get('atree');
        const atree_state = input_map.get('atree-state');
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
        return encodeBuild(build, powders, skillpoints, atree, atree_state);
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
 * Signature: BuildAssembleNode(helmet: Item,
 *                              chestplate: Item,
 *                              leggings: Item,
 *                              boots: Item,
 *                              ring1: Item,
 *                              ring2: Item,
 *                              bracelet: Item,
 *                              necklace: Item,
 *                              weapon: Item,
 *                              level: int) => Build | null
 */
class BuildAssembleNode extends ComputeNode {
    constructor() { super("builder-make-build"); }

    compute_func(input_map) {
        let equipments = [
            input_map.get('helmet'),
            input_map.get('chestplate'),
            input_map.get('leggings'),
            input_map.get('boots'),
            input_map.get('ring1'),
            input_map.get('ring2'),
            input_map.get('bracelet'),
            input_map.get('necklace'),
            input_map.get('weaponTome1'),
            input_map.get('weaponTome2'),
            input_map.get('armorTome1'),
            input_map.get('armorTome2'),
            input_map.get('armorTome3'),
            input_map.get('armorTome4'),
            input_map.get('guildTome1')
        ];
        let weapon = input_map.get('weapon');
        let level = parseInt(input_map.get('level-input'));
        if (isNaN(level)) {
            level = 106;
        }

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

class PlayerClassNode extends ValueCheckComputeNode {
    constructor(name) { super(name); }

    compute_func(input_map) {
        if (input_map.size !== 1) { throw "PlayerClassNode accepts exactly one input (build)"; }
        const [build] = input_map.values();  // Extract values, pattern match it into size one list and bind to first element
        if (build.weapon.statMap.has('NONE')) { return null; }
        return wep_to_class.get(build.weapon.statMap.get('type'));
    }
}

/**
 * Read an input field and parse into a list of powderings.
 * Every two characters makes one powder. If parsing fails, NULL is returned.
 *
 * Signature: PowderInputNode(item: Item) => List[powder] | null
 */
class PowderInputNode extends InputNode {

    constructor(name, input_field) { super(name, input_field); this.fail_cb = true; }

    compute_func(input_map) {
        if (input_map.size !== 1) { throw "PowderInputNode accepts exactly one input (item)"; }
        const [item] = input_map.values();  // Extract values, pattern match it into size one list and bind to first element
        if (item === null) {
            this.input_field.placeholder = 'powders';
            return [];
        }

        if (item.statMap.has('slots')) {
            this.input_field.placeholder = item.statMap.get('slots') + ' slots';
        }

        // TODO: haha improve efficiency to O(n) dumb
        let input = this.input_field.value.trim();
        let powdering = [];
        let errorederrors = [];
        while (input) {
            let first = input.slice(0, 2);
            let powder = powderIDs.get(first);
            if (powder === undefined) {
                if (first.length > 0) {
                    errorederrors.push(first);
                } else {
                    break;
                }
            } else {
                powdering.push(powder);
            }
            input = input.slice(2);
        }

        if (this.input_field.getAttribute("placeholder") != null) {
            if (item.statMap.get('slots') < powdering.length) {
                errorederrors.push("Too many powders: " + powdering.length);
            }
        }

        if (errorederrors.length) {
            this.input_field.classList.add("is-invalid");
        } else {
            this.input_field.classList.remove("is-invalid");
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
    constructor(spell) {
        super("builder-spell"+spell.base_spell+"-select");
        this.spell = spell;
    }

    compute_func(input_map) {
        const build = input_map.get('build');
        let stats = build.statMap;
        // TODO: apply major ids... DOOM.....

        return [this.spell, this.spell.parts];
    }
}

/*
 * Get all defensive stats for this build.
 */
function getDefenseStats(stats) {
    let defenseStats = [];
    let def_pct = skillPointsToPercentage(stats.get('def')) * skillpoint_final_mult[3];
    let agi_pct = skillPointsToPercentage(stats.get('agi')) * skillpoint_final_mult[4];
    //total hp
    let totalHp = stats.get("hp") + stats.get("hpBonus");
    if (totalHp < 5) totalHp = 5;
    defenseStats.push(totalHp);
    //EHP
    let ehp = [totalHp, totalHp];
    let defMult = (2 - stats.get("classDef"));
    for (const [k, v] of stats.get("defMult").entries()) {
        defMult *= (1 - v/100);
    }
    // newehp = oldehp / [0.1 * A(x) + (1 - A(x)) * (1 - D(x))]
    ehp[0] = ehp[0] / (0.1*agi_pct + (1-agi_pct) * (1-def_pct));
    ehp[0] /= defMult;
    // ehp[0] /= (1-def_pct)*(1-agi_pct)*defMult;
    ehp[1] /= (1-def_pct)*defMult;
    defenseStats.push(ehp);
    //HPR
    let totalHpr = rawToPct(stats.get("hprRaw"), stats.get("hprPct")/100.);
    defenseStats.push(totalHpr);
    //EHPR
    let ehpr = [totalHpr, totalHpr];
    ehpr[0] = ehpr[0] / (0.1*agi_pct + (1-agi_pct) * (1-def_pct));
    ehpr[0] /= defMult;
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
        const spell = spell_info[0];
        const spell_parts = spell_info[1];
        const stats = input_map.get('stats');
        const skillpoints = [
            stats.get('str'),
            stats.get('dex'),
            stats.get('int'),
            stats.get('def'),
            stats.get('agi')
        ];
        let spell_results = []
        let spell_result_map = new Map();
        const use_speed = (('use_atkspd' in spell) ? spell.use_atkspd : true);
        const use_spell = (('scaling' in spell) ? spell.scaling === 'spell' : true);

        // TODO: move preprocessing to separate node/node chain
        for (const part of spell_parts) {
            let spell_result;
            const part_id = spell.base_spell + '.' + part.name
            if ('multipliers' in part) { // damage type spell
                let results = calculateSpellDamage(stats, weapon, part.multipliers, use_spell, !use_speed, part_id);
                spell_result = {
                    type: "damage",
                    normal_min: results[2].map(x => x[0]),
                    normal_max: results[2].map(x => x[1]),
                    normal_total: results[0],
                    crit_min: results[2].map(x => x[2]),
                    crit_max: results[2].map(x => x[3]),
                    crit_total: results[1],
                }
            } else if ('power' in part) {
                // TODO: wynn2 formula
                let _heal_amount = (part.power * getDefenseStats(stats)[0] * (1+stats.get('healPct')/100));
                if (stats.has('healPct:'+part_id)) {
                    _heal_amount *= 1+(stats.get('healPct:'+part_id)/100);
                }
                spell_result = {
                    type: "heal",
                    heal_amount: _heal_amount
                }
            }
            else {
                continue;
            }
            const {name, display = true} = part;
            spell_result.name = name;
            spell_result.display = display;
            spell_results.push(spell_result);
            spell_result_map.set(name, spell_result);
        }
        for (const part of spell_parts) {
            if (!('hits' in part)) { continue; }
            let spell_result = {
                normal_min: [0, 0, 0, 0, 0, 0],
                normal_max: [0, 0, 0, 0, 0, 0],
                normal_total: [0, 0],
                crit_min: [0, 0, 0, 0, 0, 0],
                crit_max: [0, 0, 0, 0, 0, 0],
                crit_total: [0, 0],
                heal_amount: 0
            }
            const dam_res_keys = ['normal_min', 'normal_max', 'normal_total', 'crit_min', 'crit_max', 'crit_total'];
            for (const [subpart_name, hits] of Object.entries(part.hits)) {
                const subpart = spell_result_map.get(subpart_name);
                if (!subpart) { continue; }
                if (spell_result.type) {
                    if (subpart.type !== spell_result.type) {
                        throw "SpellCalc total subpart type mismatch";
                    }
                }
                else {
                    spell_result.type = subpart.type;
                }
                if (spell_result.type === 'damage') {
                    for (const key of dam_res_keys) {
                        for (let i in spell_result.normal_min) {
                            spell_result[key][i] += subpart[key][i] * hits;
                        }
                    }
                }
                else {
                    spell_result.heal_amount += subpart.heal_amount * hits;
                }
            }
            const {name, display = true} = part;
            spell_result.name = name;
            spell_result.display = display;
            spell_results.push(spell_result);
            spell_result_map.set(name, spell_result);
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

        const i = this.spell_idx;
        let parent_elem = document.getElementById("spell"+i+"-info");
        let overallparent_elem = document.getElementById("spell"+i+"-infoAvg");
        displaySpellDamage(parent_elem, overallparent_elem, stats, spell, i, damages);
    }
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
        displayBuildStats('summary-stats', build, build_overall_display_commands, stats);
        displayBuildStats("detailed-stats", build, build_detailed_display_commands, stats);
        displaySetBonuses("set-info", build);
        // TODO: move weapon out?
        // displayDefenseStats(document.getElementById("defensive-stats"), stats);

        displayPoisonDamage(document.getElementById("build-poison-stats"), stats);
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
        let skp_effects = ["% damage","% crit","% cost red.","% resist","% dodge"];
        let total_assigned = 0;
        for (let i in skp_order){ //big bren
            const assigned = skillpoints[i] - base_totals[i] + min_assigned[i]
            setText(skp_order[i] + "-skp-base", "Original: " + base_totals[i]);
            setText(skp_order[i] + "-skp-assign", "Assign: " + assigned);
            setValue(skp_order[i] + "-skp", skillpoints[i]);
            let linebreak = document.createElement("br");
            linebreak.classList.add("itemp");
            setText(skp_order[i] + "-skp-pct", (skillPointsToPercentage(skillpoints[i])*100*skillpoint_final_mult[i]).toFixed(1).concat(skp_effects[i]));
            document.getElementById(skp_order[i]+"-warnings").textContent = ''
            if (assigned > 100) {
                let skp_warning = document.createElement("p");
                skp_warning.classList.add("warning", "small-text");
                skp_warning.textContent += "Cannot assign " + assigned + " skillpoints in " + ["Strength","Dexterity","Intelligence","Defense","Agility"][i] + " manually.";
                document.getElementById(skp_order[i]+"-warnings").appendChild(skp_warning);
            }
            total_assigned += assigned;
        }

        let summarybox = document.getElementById("summary-box");
        summarybox.textContent = "";

        let remainingSkp = make_elem("p", ['scaled-font', 'my-0']);
        let remainingSkpTitle = make_elem("b", [], { textContent: "Assigned " + total_assigned + " skillpoints. Remaining skillpoints: " });
        let remainingSkpContent = document.createElement("b");
        remainingSkpContent.textContent = "" + (levelToSkillPoints(build.level) - total_assigned);
        remainingSkpContent.classList.add(levelToSkillPoints(build.level) - total_assigned < 0 ? "negative" : "positive");

        remainingSkp.append(remainingSkpTitle);
        remainingSkp.append(remainingSkpContent);

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
    constructor(name) { super(name); }

    compute_func(input_map) {
        const output_stats = new Map();
        for (const [k, v] of input_map.entries()) {
            for (const [k2, v2] of v.entries()) {
                merge_stat(output_stats, k2, v2);
            }
        }
        return output_stats;
    }
}

let radiance_affected = [ /*"hp"*/, "fDef", "wDef", "aDef", "tDef", "eDef", "hprPct", "mr", "sdPct", "mdPct", "ls", "ms", "xpb", "lb", "ref",
/*"str", "dex", "int", "agi", "def",*/
"thorns", "expd", "spd", "atkTier", "poison", "hpBonus", "spRegen", "eSteal", "hprRaw", "sdRaw", "mdRaw", "fDamPct", "wDamPct", "aDamPct", "tDamPct", "eDamPct", "fDefPct", "wDefPct", "aDefPct", "tDefPct", "eDefPct", "fixID", "category", "spPct1", "spRaw1", "spPct2", "spRaw2", "spPct3", "spRaw3", "spPct4", "spRaw4", "rSdRaw", "sprint", "sprintReg", "jh", "lq", "gXp", "gSpd",

// wynn2 damages.
"eMdPct","eMdRaw","eSdPct","eSdRaw",/*"eDamPct,"*/"eDamRaw",//"eDamAddMin","eDamAddMax",
"tMdPct","tMdRaw","tSdPct","tSdRaw",/*"tDamPct,"*/"tDamRaw",//"tDamAddMin","tDamAddMax",
"wMdPct","wMdRaw","wSdPct","wSdRaw",/*"wDamPct,"*/"wDamRaw",//"wDamAddMin","wDamAddMax",
"fMdPct","fMdRaw","fSdPct","fSdRaw",/*"fDamPct,"*/"fDamRaw",//"fDamAddMin","fDamAddMax",
"aMdPct","aMdRaw","aSdPct","aSdRaw",/*"aDamPct,"*/"aDamRaw",//"aDamAddMin","aDamAddMax",
"nMdPct","nMdRaw","nSdPct","nSdRaw","nDamPct","nDamRaw",//"nDamAddMin","nDamAddMax",      // neutral which is now an element
/*"mdPct","mdRaw","sdPct","sdRaw",*/"damPct","damRaw",//"damAddMin","damAddMax",          // These are the old ids. Become proportional.
"rMdPct","rMdRaw","rSdPct",/*"rSdRaw",*/"rDamPct","rDamRaw",//"rDamAddMin","rDamAddMax",  // rainbow (the "element" of all minus neutral). rSdRaw is rainraw
"critDamPct",
//"spPct1Final", "spPct2Final", "spPct3Final", "spPct4Final"
];
/**
 * Scale stats if radiance is enabled.
 * TODO: skillpoints...
 */
const radiance_node = new (class extends ComputeNode {
    constructor() { super('radiance-node->:('); }

    compute_func(input_map) {
        const [statmap] = input_map.values();  // Extract values, pattern match it into size one list and bind to first element
        let elem = document.getElementById('radiance-boost');
        if (elem.classList.contains("toggleOn")) {
            const ret = new Map(statmap);
            for (const val of radiance_affected) {
                if (reversedIDs.includes(val)) {
                    if ((ret.get(val) || 0) < 0) {
                        ret.set(val, Math.floor((ret.get(val) || 0) * 1.2));
                    }
                }
                else {
                    if ((ret.get(val) || 0) > 0) {
                        ret.set(val, Math.floor((ret.get(val) || 0) * 1.2));
                    }
                }
            }
            const dam_mults = new Map(ret.get('damMult'));
            dam_mults.set('tome', dam_mults.get('tome') * 1.2)
            ret.set('damMult', dam_mults)
            const def_mults = new Map(ret.get('defMult'));
            def_mults.set('tome', def_mults.get('tome') * 1.2)
            ret.set('defMult', def_mults)
            return ret;
        }
        else {
            return statmap;
        }
    }
})();

/* Updates all spell boosts
*/
function update_radiance() {
    let elem = document.getElementById('radiance-boost');
    if (elem.classList.contains("toggleOn")) {
        elem.classList.remove("toggleOn");
    } else {
        elem.classList.add("toggleOn");
    }
    radiance_node.mark_dirty().update();
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

        const output_stats = new Map(build.statMap);
        for (const [k, v] of input_map.entries()) {
            output_stats.set(k, v);
        }

        output_stats.set('classDef', classDefenseMultipliers.get(build.weapon.statMap.get("type")));
        return output_stats;
    }
}

let edit_id_output;
function resetEditableIDs() {
    edit_id_output.mark_dirty().update();
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
        for (const child of this.notify_nodes) {
            child.link_to(this);
            child.fail_cb = true;
        }
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
        for (const child of this.notify_nodes) {
            child.link_to(this);
            child.fail_cb = true;
            // This is needed because initially there is a value mismatch possibly... due to setting skillpoints manually
            child.mark_input_clean(this.name, null);
        }
    }

    compute_func(input_map) {
        if (input_map.size !== 1) { throw "SkillPointSetterNode accepts exactly one input (build)"; }
        const [build] = input_map.values();  // Extract values, pattern match it into size one list and bind to first element
        for (const [idx, elem] of skp_order.entries()) {
            document.getElementById(elem+'-skp').value = build.total_skillpoints[idx];
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
        let value = this.input_field.value;
        if (value === "") { value = "0"; }

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
let item_nodes_map = new Map();
let powder_nodes = [];
let edit_input_nodes = [];
let skp_inputs = [];
let equip_inputs = [];
let build_node;
let stat_agg_node;
let edit_agg_node;
let atree_graph_creator;

/**
 * Parameters:
 *  save_skp:   bool    True if skillpoints are modified away from skp engine defaults.
 */
function builder_graph_init(save_skp) {
    // Phase 1/3: Set up item input, propagate updates, etc.

    // Level input node.
    let level_input = new InputNode('level-input', document.getElementById('level-choice'));

    // "Build" now only refers to equipment and level (no powders). Powders are injected before damage calculation / stat display.
    build_node = new BuildAssembleNode();
    build_node.link_to(level_input);

    let build_encode_node = new BuildEncodeNode();
    build_encode_node.link_to(build_node, 'build');

    // Bind item input fields to input nodes, and some display stuff (for auto colorizing stuff).
    for (const [eq, display_elem, none_item] of zip3(equipment_fields, build_fields, none_items)) {
        let input_field = document.getElementById(eq+"-choice");
        let item_image = document.getElementById(eq+"-img");

        let item_input = new ItemInputNode(eq+'-input', input_field, none_item);
        equip_inputs.push(item_input);
        if (powder_inputs.includes(eq+'-powder')) { // TODO: fragile
            const powder_name = eq+'-powder';
            let powder_node = new PowderInputNode(powder_name, document.getElementById(powder_name))
                    .link_to(item_input, 'item');
            powder_nodes.push(powder_node);
            build_encode_node.link_to(powder_node, powder_name);
            let item_powdering = new ItemPowderingNode(eq+'-powder-apply')
                    .link_to(powder_node, 'powdering').link_to(item_input, 'item');
            item_input = item_powdering;
        }
        item_nodes.push(item_input);
        item_nodes_map.set(eq, item_input);
        new ItemInputDisplayNode(eq+'-input-display', eq, item_image).link_to(item_input);
        new ItemDisplayNode(eq+'-item-display', display_elem).link_to(item_input);
        //new PrintNode(eq+'-debug').link_to(item_input);
        //document.querySelector("#"+eq+"-tooltip").setAttribute("onclick", "collapse_element('#"+ eq +"-tooltip');"); //toggle_plus_minus('" + eq + "-pm'); 
        build_node.link_to(item_input, eq);
    }

    for (const [eq, none_item] of zip2(tome_fields, [none_tomes[0], none_tomes[0], none_tomes[1], none_tomes[1], none_tomes[1], none_tomes[1], none_tomes[2]])) {
        let input_field = document.getElementById(eq+"-choice");
        let item_image = document.getElementById(eq+"-img");

        let item_input = new ItemInputNode(eq+'-input', input_field, none_item);
        equip_inputs.push(item_input);
        item_nodes.push(item_input);
        new ItemInputDisplayNode(eq+'-input-display', eq, item_image).link_to(item_input);
        build_node.link_to(item_input, eq);
    }

    // weapon image changer node.
    let weapon_image = document.getElementById("weapon-img");
    let weapon_dps = document.getElementById("weapon-dps");
    new WeaponInputDisplayNode('weapon-type', weapon_image, weapon_dps).link_to(item_nodes[8]);

    // linking to atree verification
    atree_validate.link_to(level_input, 'level');

    let url_update_node = new URLUpdateNode();
    url_update_node.link_to(build_encode_node, 'build-str');

    // Phase 2/3: Set up editable IDs, skill points; use decodeBuild() skill points, calculate damage

    // Create one node that will be the "aggregator node" (listen to all the editable id nodes, as well as the build_node (for non editable stats) and collect them into one statmap)
    pre_scale_agg_node = new AggregateStatsNode('pre-scale-stats');
    stat_agg_node = new AggregateStatsNode('final-stats');
    edit_agg_node = new AggregateEditableIDNode();
    edit_agg_node.link_to(build_node, 'build');
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
    edit_agg_node.link_to(edit_id_output, 'edit-id-setter');

    for (const skp of skp_order) {
        const elem = document.getElementById(skp+'-skp');
        const node = new SumNumberInputNode('builder-'+skp+'-input', elem);

        edit_agg_node.link_to(node, skp);
        build_encode_node.link_to(node, skp);
        edit_input_nodes.push(node);
        skp_inputs.push(node);
    }
    pre_scale_agg_node.link_to(edit_agg_node);

    // Phase 3/3: Set up atree stuff.

    let class_node = new PlayerClassNode('builder-class').link_to(build_node);
    // These two are defined in `builder/atree.js`
    atree_node.link_to(class_node, 'player-class');
    atree_merge.link_to(class_node, 'player-class');
    pre_scale_agg_node.link_to(atree_raw_stats, 'atree-raw-stats');
    radiance_node.link_to(pre_scale_agg_node, 'stats');
    atree_scaling.link_to(radiance_node, 'scale-stats');
    stat_agg_node.link_to(radiance_node, 'pre-scaling');
    stat_agg_node.link_to(atree_scaling_stats, 'atree-scaling');

    build_encode_node.link_to(atree_node, 'atree').link_to(atree_state_node, 'atree-state');

    // ---------------------------------------------------------------
    //  Trigger the update cascade for build!
    // ---------------------------------------------------------------
    for (const input_node of equip_inputs) {
        input_node.update();
    }
    armor_powder_node.update();
    level_input.update();

    atree_graph_creator = new AbilityTreeEnsureNodesNode(build_node, stat_agg_node)
                                    .link_to(atree_collect_spells, 'spells');

    // kinda janky, manually set atree and update. Some wasted compute here
    if (atree_data !== null && atree_node.value !== null) { // janky check if atree is valid
        const atree_state = atree_state_node.value;
        if (atree_data.length > 0) {
            try {
                const active_nodes = decode_atree(atree_node.value, atree_data);
                for (const node of active_nodes) {
                    atree_set_state(atree_state.get(node.ability.id), true);
                }
                atree_state_node.mark_dirty().update();
            } catch (e) {
                console.log("Failed to decode atree. This can happen when updating versions. Give up!")
            }
        }
    }

    // Powder specials.
    let powder_special_calc = new PowderSpecialCalcNode().link_to(powder_special_input, 'powder-specials');
    new PowderSpecialDisplayNode().link_to(powder_special_input, 'powder-specials')
        .link_to(stat_agg_node, 'stats').link_to(build_node, 'build');
    pre_scale_agg_node.link_to(powder_special_calc, 'powder-boost');
    stat_agg_node.link_to(armor_powder_node, 'armor-powder');
    powder_special_input.update();

    // Potion boost.
    stat_agg_node.link_to(boosts_node, 'potion-boost');

    // Also do something similar for skill points

    let build_disp_node = new BuildDisplayNode()
    build_disp_node.link_to(build_node, 'build');
    build_disp_node.link_to(stat_agg_node, 'stats');

    for (const node of edit_input_nodes) {
        node.update();
    }

    let skp_output = new SkillPointSetterNode(skp_inputs);
    skp_output.link_to(build_node);
    if (!save_skp) {
        skp_output.update().mark_dirty().update();
    }

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
    graph_live_update = true;
}

