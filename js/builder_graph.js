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
        this.none_item.statMap.set('NONE', true);
    }

    compute_func(input_map) {
        // built on the assumption of no one will type in CI/CR letter by letter

        let item_text = this.input_field.value;
        if (!item_text) {
            return this.none_item;
        }

        let item;

        if (item_text.slice(0, 3) == "CI-") {
            item = getCustomFromHash(item_text);
        }
        else if (item_text.slice(0, 3) == "CR-") {
            item = getCraftFromHash(item_text);
        } 
        else if (itemMap.has(item_text)) {
            item = new Item(itemMap.get(item_text));
        } 
        else if (tomeMap.has(item_text)) {
            item = new Item(tomeMap.get(item_text));
        }

        if (item) {
            let type_match;
            if (this.none_item.statMap.get('category') === 'weapon') {
                type_match = item.statMap.get('category') === 'weapon';
            } else {
                type_match = item.statMap.get('type') === this.none_item.statMap.get('type');
            }
            if (type_match) { return item; }
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
        this.image = item_image;
        this.fail_cb = true;
    }

    compute_func(input_map) {
        if (input_map.size !== 1) { throw "ItemInputDisplayNode accepts exactly one input (item)"; }
        const [item] = input_map.values();  // Extract values, pattern match it into size one list and bind to first element

        this.input_field.classList.remove("text-light", "is-invalid", 'Normal', 'Unique', 'Rare', 'Legendary', 'Fabled', 'Mythic', 'Set', 'Crafted', 'Custom');
        this.input_field.classList.add("text-light");
        this.image.classList.remove('Normal-shadow', 'Unique-shadow', 'Rare-shadow', 'Legendary-shadow', 'Fabled-shadow', 'Mythic-shadow', 'Set-shadow', 'Crafted-shadow', 'Custom-shadow');

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
        this.level_field.textContent = item.statMap.get('lvl');
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

    constructor(name, image_field) {
        super(name);
        this.image = image_field;
    }

    compute_func(input_map) {
        if (input_map.size !== 1) { throw "WeaponDisplayNode accepts exactly one input (item)"; }
        const [item] = input_map.values();  // Extract values, pattern match it into size one list and bind to first element

        const type = item.statMap.get('type');
        this.image.setAttribute('src', '../media/items/new/generic-'+type+'.png');
    }
}

/**
 * Encode the build into a url-able string.
 *
 * Signature: BuildEncodeNode(build: Build,
                              helmet-powder: List[powder],
                              chestplate-powder: List[powder],
                              leggings-powder: List[powder],
                              boots-powder: List[powder],
                              weapon-powder: List[powder]) => str
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
        // TODO: grr global state for copy button..
        player_build = build;
        build_powders = powders;
        return encodeBuild(build, powders);
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
 * TODO: add tomes
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
            input_map.get('necklace-input')
        ];
        let weapon = input_map.get('weapon-input');
        let level = input_map.get('level-input');

        let all_none = weapon.statMap.has('NONE');
        for (const item of equipments) {
            all_none = all_none && item.statMap.has('NONE');
        }
        if (all_none) {
            return null;
        }
        return new Build(level, equipments, [], weapon);
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
        //console.log("POWDERING: " + powdering);
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

/**
 * Compute spell damage of spell parts.
 * Currently kinda janky / TODO while we rework the internal rep. of spells.
 *
 * Signature: SpellDamageCalcNode(weapon-input: Item,
 *                                build: Build,
 *                                weapon-powder: List[powder],
 *                                spell-info: [Spell, SpellParts]) => List[SpellDamage]
 */
class SpellDamageCalcNode extends ComputeNode {
    constructor(spell_num) {
        super("builder-spell"+spell_num+"-calc");
    }

    compute_func(input_map) {
        const weapon = new Map(input_map.get('weapon-input').statMap);
        const build = input_map.get('build');
        const weapon_powder = input_map.get('weapon-powder');
        const damage_mult = 1; // TODO: hook up
        const spell_info = input_map.get('spell-info');
        const spell_parts = spell_info[1];

        weapon.set("powders", weapon_powder);
        let spell_results = []
        let stats = build.statMap;

        for (const part of spell_parts) {
            if (part.type === "damage") {
                let results = calculateSpellDamage(stats, part.conversion,
                                        stats.get("sdRaw") + stats.get("rainbowRaw"), stats.get("sdPct"), 
                                        part.multiplier / 100, weapon, build.total_skillpoints, damage_mult);
                spell_results.push(results);
            } else if (part.type === "heal") {
                // TODO: wynn2 formula
                let heal_amount = (part.strength * build.getDefenseStats()[0] * Math.max(0.5,Math.min(1.75, 1 + 0.5 * stats.get("wDamPct")/100))).toFixed(2);
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
 * Signature: SpellDisplayNode(build: Build,
 *                             spell-info: [Spell, SpellParts],
 *                             spell-damage: List[SpellDamage]) => null
 */
class SpellDisplayNode extends ComputeNode {
    constructor(spell_num) {
        super("builder-spell"+spell_num+"-display");
        this.spell_idx = spell_num;
    }

    compute_func(input_map) {
        const build = input_map.get('build');
        const spell_info = input_map.get('spell-info');
        const damages = input_map.get('spell-damage');
        const spell = spell_info[0];
        const spell_parts = spell_info[1];

        const i = this.spell_idx;
        let parent_elem = document.getElementById("spell"+i+"-info");
        let overallparent_elem = document.getElementById("spell"+i+"-infoAvg");
        displaySpellDamage(parent_elem, overallparent_elem, build, spell, i+1, spell_parts, damages);
    }
}

/**
 * Display build stats.
 *
 * Signature: BuildDisplayNode(build: Build) => null
 */
class BuildDisplayNode extends ComputeNode {
    constructor(spell_num) { super("builder-stats-display"); }

    compute_func(input_map) {
        if (input_map.size !== 1) { throw "BuildDisplayNode accepts exactly one input (build)"; }
        const [build] = input_map.values();  // Extract values, pattern match it into size one list and bind to first element
        displayBuildStats('overall-stats', build, build_all_display_commands);
        displayBuildStats("offensive-stats", build, build_offensive_display_commands);
        displaySetBonuses("set-info", build);
        let meleeStats = build.getMeleeStats();
        displayMeleeDamage(document.getElementById("build-melee-stats"), document.getElementById("build-melee-statsAvg"), meleeStats);

        displayDefenseStats(document.getElementById("defensive-stats"), build);

        displayPoisonDamage(document.getElementById("build-poison-stats"), build);
        displayEquipOrder(document.getElementById("build-order"), build.equip_order);
    }
}

/**
 * Set the editble id fields.
 */
class EditableIDSetterNode extends ComputeNode {

}

let item_nodes = [];
let powder_nodes = [];
let spelldmg_nodes = [];

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

    // weapon image changer node.
    let weapon_image = document.getElementById("weapon-img");
    new WeaponInputDisplayNode('weapon-type', weapon_image).link_to(item_nodes[8]);

    // Level input node.
    let level_input = new InputNode('level-input', document.getElementById('level-choice'));

    // "Build" now only refers to equipment and level (no powders). Powders are injected before damage calculation / stat display.
    let build_node = new BuildAssembleNode();
    for (const input of item_nodes) {
        build_node.link_to(input);
    }
    build_node.link_to(level_input);
    new BuildDisplayNode().link_to(build_node, 'build');

    let build_encode_node = new BuildEncodeNode();
    build_encode_node.link_to(build_node, 'build');

    let url_update_node = new URLUpdateNode();
    url_update_node.link_to(build_encode_node, 'build-str');


    for (const input of powder_inputs) {
        let powder_node = new PowderInputNode(input, document.getElementById(input));
        powder_nodes.push(powder_node);
        build_encode_node.link_to(powder_node, input);
    }

    for (const input_node of item_nodes.concat(powder_nodes)) {
        input_node.update();
    }
    level_input.update();

    // Phase 2/2: Set up editable IDs, skill points; use decodeBuild() skill points, calculate damage

    // Create one node that will be the "aggregator node" (listen to all the editable id nodes, as well as the build_node (for non editable stats) and collect them into one statmap)
    // let stat_agg_node = 
    for (const field of editable_elems) {
        // Create nodes that listens to each editable id input, the node name should match the "id"

        // stat_agg_node.link_to( ... )
    }

    // Also do something similar for skill points

    for (let i = 0; i < 4; ++i) {
        let spell_node = new SpellSelectNode(i);
        spell_node.link_to(build_node, 'build');
        // link and rewrite spell_node to the stat agg node
        // spell_node.link_to(stat_agg_node, 'stats')

        let calc_node = new SpellDamageCalcNode(i);
        calc_node.link_to(item_nodes[8], 'weapon-input');
        calc_node.link_to(build_node, 'build');
        calc_node.link_to(powder_nodes[4], 'weapon-powder');
        calc_node.link_to(spell_node, 'spell-info');
        spelldmg_nodes.push(calc_node);

        let display_node = new SpellDisplayNode(i);
        display_node.link_to(build_node, 'build');
        display_node.link_to(spell_node, 'spell-info');
        display_node.link_to(calc_node, 'spell-damage');
    }
    
    // Create a node that binds the build to the edit ids text boxes
    // (make it export to the textboxes)
    // This node is a bit tricky since it has to make a "weak link" (directly mark dirty and call update() for each of the stat nodes).
    // IMPORTANT: mark all children dirty, then update each child, in that order (2 loops). else performance issues will be bad
    // let id_exporter_node = ...
    // id_exporter_node.link_to(build_node, 'build')

    // call node.update() for each skillpoint node and stat edit listener node manually
    // NOTE: the text boxes for skill points are already filled out by decodeBuild() so this will fix them
    // this will propagate the update to the `stat_agg_node`, and then to damage calc

    console.log("Set up graph");
}

