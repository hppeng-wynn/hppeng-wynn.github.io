/** 
 * This file defines computation graph nodes and display code relevant to the ability tree.
 * TODO: possibly split it up into compute and render... but its a bit complicated :/
 */

/**
ATreeNode spec:

ATreeNode: {
    children: List[ATreeNode]   // nodes that this node can link to downstream (or sideways)
    parents:  List[ATreeNode]   // nodes that can link to this one from upstream (or sideways)
    ability:  atree_node        // raw data from atree json
}

atree_node: {
    display_name:   str
    id:             int
    desc:           str
    archetype:      Optional[str]   // not present or empty string = no arch
    archetype_req:  Optional[int]   // default: 0
    req_archetype:  Optional[str]   // what the req is for if no archetype defined... maybe clean up this data format later...?
    base_abil:      Optional[int]   // Modify another abil? poorly defined...
    parents:        List[int]
    dependencies:   List[int]       // Hard reqs
    blockers:       List[int]       // If any in here are taken, i am invalid
    cost:           int             // cost in AP
    display: {                      // stuff for rendering ATree
        row: int
        col: int
        icon: str
    }
    properties:     Map[str, float] // Dynamic (modifiable) misc. properties; ex. AOE
    effects:        List[effect]
}

effect: replace_spell | add_spell_prop | convert_spell_conv | raw_stat | stat_scaling

replace_spell: {
    type:           "replace_spell"
    ... rest of fields are same as `spell` type (see: damage_calc.js)
}

add_spell_prop: {
    type:           "add_spell_prop"
    base_spell:     int             // spell identifier
    target_part:    Optional[str]   // Part of the spell to modify. Can be not present/empty for ex. cost modifier.
                                    //     If target part does not exist, a new part is created.
    behavior:       Optional[str]   // One of: "merge", "modify", "overwrite". default: merge
                                    //     merge: add if exist, make new part if not exist
                                    //     modify: increment existing part. do nothing if not exist
                                    //     overwrite: set part. do nothing if not exist
    cost:           Optional[int]   // change to spellcost. If the spell is not spell 1-4, this must be left empty.
    multipliers:    Optional[array[float, 6]]   // Additive changes to spellmult (for damage spell)
    power:          Optional[float] // Additive change to healing power (for heal spell)

    hits:           Optional[Map[str, Union[str, float]]]   // Additive changes to hits (for total entry)
                                                            // Can either be a raw value number, or a reference
                                                            //   of the format <ability_id>.propname
    display:        Optional[str]   // Optional change to the displayed entry. Replaces old
    hide:           Optional[str]   // Modify this part to be hidden.
}

convert_spell_conv: {
    type:           "convert_spell_conv"
    base_spell:     int             // spell identifier
    target_part:    "all" | str     // Part of the spell to modify. Can be not present/empty for ex. cost modifier.
                                    //      "all" means modify all parts.
    conversion:     element_str
}
raw_stat: {
    type:           "raw_stat"
    toggle:         Optional[bool | str]    // default: false; true means create anon. toggle,
                                            // string value means bind to (or create) named button
    behavior:       Optional[str]           // One of: "merge", "modify". default: merge
                                            //     merge: add if exist, make new part if not exist
                                            //     modify: increment existing part. do nothing if not exist
    bonuses:        List[stat_bonus]
}
stat_bonus: {
  type: "stat" | "prop",
  abil: Optional[int],
  name: str,
  value: float
}
stat_scaling: {
  type: "stat_scaling",
  slider: bool,
  positive: bool                            // True to keep stat above 0. False to ignore floor. Default: True for normal, False for scaling
  slider_name: Optional[str],
  slider_step: Optional[float],
  round:       Optional[bool]               // Control floor behavior. True for stats and false for slider by default
  behavior:    Optional[str]                // One of: "merge", "modify". default: merge
                                            //     merge: add if exist, make new part if not exist
                                            //     modify: change existing part, by incrementing properties. do nothing if not exist
                                            //     overwrite: set part. do nothing if not exist
  slider_max: Optional[int]                 // affected by behavior
  slider_default: Optional[int]             // affected by behavior
  inputs: Optional[list[scaling_target]]    // List of things to scale. Omit this if using slider

  output: Optional[scaling_target | List[scaling_target]] // One of the following:
                                            // 1. Single output scaling target
                                            // 2. List of scaling targets (all scaled the same)
                                            // 3. Omitted. no output (useful for modifying slider only without input or output)
  scaling: Optional[list[float]]            // One float for each input. Sums into output.
  max: float                                // Hardcap on this effect (slider value * slider_step). Can be negative if scaling is negative
}
scaling_target: {
  type: "stat" | "prop",
  abil: Optional[int],
  name: str
}
*/


// Space for big json data
let ATREES;
/*
 * Load atree info remote DB (aka a big json file).
 */
async function load_atree_data(version_str) {
    let getUrl = window.location;
    let baseUrl = `${getUrl.protocol}//${getUrl.host}/`;
    // No random string -- we want to use caching
    let url = `${baseUrl}/data/${version_str}/atree.json`;
    ATREES = await (await fetch(url)).json();
    console.log("Loaded ability tree data");
}

const elem_mastery_abil = { display_name: "Elemental Mastery", id: 998, properties: {}, effects: [] };

// TODO: Range numbers
const default_abils = {
    Mage: [{
        display_name: "Mage Melee",
        id: 999,
        desc: "Mage basic attack.",
        properties: {range: 5000},
        effects: [default_spells.wand[0]]
    }, elem_mastery_abil ],
    Warrior: [{
        display_name: "Warrior Melee",
        id: 999,
        desc: "Warrior basic attack.",
        properties: {range: 2},
        effects: [default_spells.spear[0]]
    }, elem_mastery_abil ],
    Archer: [{
        display_name: "Archer Melee",
        id: 999,
        desc: "Archer basic attack.",
        properties: {range: 20},
        effects: [default_spells.bow[0]]
    }, elem_mastery_abil ],
    Assassin: [{
        display_name: "Assassin Melee",
        id: 999,
        desc: "Assassin basic attack.",
        properties: {range: 2},
        effects: [default_spells.dagger[0]]
    }, elem_mastery_abil ],
    Shaman: [{
        display_name: "Shaman Melee",
        id: 999,
        desc: "Shaman basic attack.",
        properties: {range: 15, speed: 0},
        effects: [default_spells.relik[0]]
    }, elem_mastery_abil ],
};

/**
 * Given a json of raw atree data, and a wynn class name (ex. Archer, Mage),
 * sort out their ability tree and return it as a list in roughly topologically
 * sorted order.
 *
 * TODO: Why do we care about the toposort?
 * This is not a useful representation of the tree.
 * It's useless.
 * atree needs a cleanup and anything depending on the ordering of items
 *   coming out of this function is probably doing something wrong.
 * NOTE2: Actually this might be more complicated because some nodes do need
 *   an application ordering and that matters (esp. replace_spell nodes).
 *
 * Parameters:
 * --------------------------
 * atrees: Raw atree data. This is a parameter to allow oldversion shenanigans
 * player_class: Wynn class name (string)
 *
 * Return:
 * List of atree nodes.
 */
function get_sorted_class_atree(atrees, player_class) {
    const atree_raw = atrees[player_class];
    if (!atree_raw) return [];

    let atree_map = new Map();
    let atree_head;
    for (const i of atree_raw) {
        atree_map.set(i.id, {children: [], ability: i});
        if (i.parents.length == 0) {
            // Assuming there is only one head.
            atree_head = atree_map.get(i.id);
        }
    }
    for (const i of atree_raw) {
        let node = atree_map.get(i.id);
        let parents = [];
        for (const parent_id of node.ability.parents) {
            let parent_node = atree_map.get(parent_id);
            parent_node.children.push(node);
            parents.push(parent_node);
        }
        node.parents = parents;
    }

    let sccs = make_SCC_graph(atree_head, atree_map.values());
    let atree_topo_sort = [];
    for (const scc of sccs) {
        for (const node of scc.nodes) {
            delete node.visited;
            delete node.assigned;
            delete node.scc;
            atree_topo_sort.push(node);
        }
    }
    return atree_topo_sort;
}

/**
 * Update ability tree internal representation. (topologically sorted node list)
 *
 * Signature: AbilityTreeUpdateNode(player-class: str) => ATree (List of atree nodes in topological order)
 */
const atree_node = new (class extends ComputeNode {
    constructor() { super('builder-atree-update'); }

    compute_func(input_map) {
        if (input_map.size !== 1) { throw "AbilityTreeUpdateNode accepts exactly one input (player-class)"; }
        const [player_class] = input_map.values();  // Extract values, pattern match it into size one list and bind to first element
        return get_sorted_class_atree(ATREES, player_class);
    }
})();

/**
 * Display ability tree from topologically sorted list.
 *
 * Signature: AbilityTreeRenderNode(atree: ATree) => RenderedATree ( Map[id, RenderedATNode] )
 */
const atree_render = new (class extends ComputeNode {
    constructor() {
        super('builder-atree-render');
        this.UI_elem = document.getElementById("atree-ui");
        this.list_elem = document.getElementById("atree-header");
    }

    compute_func(input_map) {
        if (input_map.size !== 1) { throw "AbilityTreeRenderNode accepts exactly one input (atree)"; }
        const [atree] = input_map.values();  // Extract values, pattern match it into size one list and bind to first element
        
        //for some reason we have to cast to string 
        this.list_elem.innerHTML = ""; //reset all atree actives - should be done in a more general way later
        this.UI_elem.innerHTML = ""; //reset the atree in the DOM

        let ret = null;
        if (atree) { ret = render_AT(this.UI_elem, this.list_elem, atree); }

        //Toggle on, previously was toggled off
        toggle_tab('atree-dropdown'); toggleButton('toggle-atree');

        return ret;
    }
})().link_to(atree_node);

// This exists so i don't have to re-render the UI to push atree updates.
const atree_state_node = new (class extends ComputeNode {
    constructor() { super('builder-atree-state'); }

    compute_func(input_map) {
        if (input_map.size !== 1) { throw "AbilityTreeStateNode accepts exactly one input (atree-rendered)"; }
        const [rendered_atree] = input_map.values();  // Extract values, pattern match it into size one list and bind to first element
        return rendered_atree;
    }
})().link_to(atree_render, 'atree-render');

/**
 * Check if an atree node can be activated.
 *
 * Return: [yes/no, hard error, reason]
 */
function abil_can_activate(atree_node, atree_state, reachable, archetype_count, points_remain) {
    const {parents, ability} = atree_node;
    if (parents.length === 0) {
        return [true, false, ""];
    }
    let failed_deps = [];
    for (const dep_id of ability.dependencies) {
        if (!reachable.has(dep_id)) { failed_deps.push(dep_id) }
    }
    if (failed_deps.length > 0) {
        const dep_strings = failed_deps.map(i => '"' + atree_state.get(i).ability.display_name + '"');
        return [false, true, 'missing dep: ' + dep_strings.join(", ")];
    }
    let blocking_ids = [];
    for (const blocker_id of ability.blockers) {
        if (reachable.has(blocker_id)) { blocking_ids.push(blocker_id); }
    }
    if (blocking_ids.length > 0) {
        const blockers_strings = blocking_ids.map(i => '"' + atree_state.get(i).ability.display_name + '"');
        return [false, true, 'blocked by: '+blockers_strings.join(", ")];
    }
    let node_reachable = false;
    for (const parent of parents) {
        if (reachable.has(parent.ability.id)) {
            node_reachable = true;
            break;
        }
    }
    if (!node_reachable) {
        return [false, false, 'not reachable'];
    }
    if ('archetype_req' in ability && ability.archetype_req !== 0) {
        let req_archetype;
        if ('req_archetype' in ability && ability.req_archetype !== "") {
            req_archetype = ability.req_archetype;
        }
        else {
            req_archetype = ability.archetype;
        }
        const others = (archetype_count.get(req_archetype) || 0);
        if (others < ability.archetype_req) {
            return [false, false, req_archetype+': '+others+' < '+ability.archetype_req];
        }
    }
    if (ability.cost > points_remain) {
        return [false, false, "not enough ability points left"];
    }
    return [true, false, ""];
}

/**
 * Validate ability tree.
 * Return list of errors for rendering.
 *
 * Signature: AbilityTreeMergeNode(atree: ATree, atree-state: RenderedATree) => List[str]
 */
const atree_validate = new (class extends ComputeNode {
    constructor() { super('atree-validator'); }

    compute_func(input_map) {
        const atree_state = input_map.get('atree-state');
        const atree_order = input_map.get('atree');
        const level = parseInt(input_map.get('level'));

        if (atree_order.length == 0) { return [0, false, ['no atree data']]; }

        let atree_to_add = [];
        let atree_not_present = [];
        // mark all selected nodes as bright, and mark all other nodes as dark.
        // also initialize the "to check" list, and the "not present" list.
        for (const node of atree_order) {
            const abil = node.ability;
            if (atree_state.get(abil.id).active) {
                atree_to_add.push([node, 'not reachable', false]);
                draw_atlas_image(atree_state.get(abil.id).img, atree_node_atlas_img, [atree_node_atlas_positions[abil.display.icon], 2], atree_node_tile_size);
            }
            else {
                atree_not_present.push(abil.id);
                draw_atlas_image(atree_state.get(abil.id).img, atree_node_atlas_img, [atree_node_atlas_positions[abil.display.icon], 0], atree_node_tile_size);
            }
        }

        let reachable = new Set();
        let abil_points_total = 0;
        let archetype_count = new Map();
        while (true) {
            let _add = [];
            for (const [node, fail_reason, fail_hardness] of atree_to_add) {
                const {ability} = node;
                const [success, hard_error, reason] = abil_can_activate(node, atree_state, reachable, archetype_count, 9999);
                if (!success) {
                    _add.push([node, reason, hard_error]);
                    continue;
                }
                if ('archetype' in ability && ability.archetype !== "") {
                    let val = 1;
                    if (archetype_count.has(ability.archetype)) {
                        val = archetype_count.get(ability.archetype) + 1;
                    }
                    archetype_count.set(ability.archetype, val);
                }
                abil_points_total += ability.cost;
                reachable.add(ability.id);
            }
            if (atree_to_add.length == _add.length) {
                atree_to_add = _add;
                break;
            }
            atree_to_add = _add;
        }
        const atree_level_table = ['lvl0wtf',1,2,2,3,3,4,4,5,5,6,6,7,8,8,9,9,10,11,11,12,12,13,14,14,15,16,16,17,17,18,18,19,19,20,20,20,21,21,22,22,23,23,23,24,24,25,25,26,26,27,27,28,28,29,29,30,30,31,31,32,32,33,33,34,34,34,35,35,35,36,36,36,37,37,37,38,38,38,38,39,39,39,39,40,40,40,40,41,41,41,41,42,42,42,42,43,43,43,43,44,44,44,44,45,45,45];
        let AP_cap;
        if (isNaN(level)) {
            AP_cap = 45;   
        }
        else {
            AP_cap = atree_level_table[level];
        }
        document.getElementById('active_AP_cap').textContent = AP_cap;
        document.getElementById("active_AP_cost").textContent = abil_points_total;
        const ap_left = AP_cap - abil_points_total;

        // using the "not present" list, highlight one-step reachable nodes.
        for (const node_id of atree_not_present) {
            const node = atree_state.get(node_id);
            const [success, hard_error, reason] = abil_can_activate(node, atree_state, reachable, archetype_count, ap_left);
            if (success) {
                draw_atlas_image(node.img, atree_node_atlas_img, [atree_node_atlas_positions[node.ability.display.icon], 1], atree_node_tile_size);
            }
        }

        let hard_error = false;
        let errors = [];
        if (abil_points_total > AP_cap) {
            errors.push('too many ability points assigned! ('+abil_points_total+' > '+AP_cap+')');
        }
        for (const [node, fail_reason, fail_hardness] of atree_to_add) {
            if (fail_hardness) { hard_error = true; }
            errors.push(node.ability.display_name + ": " + fail_reason);
        }

        return [hard_error, errors];
    }
})().link_to(atree_node, 'atree').link_to(atree_state_node, 'atree-state');

/**
 * Collect abilities and condense them into a list of "final abils".
 * This is just for rendering purposes, and for collecting things that modify spells into one chunk.
 * I stg if wynn makes abils that modify multiple spells
 * ... well we can extend this by making `base_abil` a list instead but annoy
 *
 * Signature: AbilityTreeMergeNode(player-class: WeaponType, atree: ATree, atree-state: RenderedATree) => Map[id, Ability]
 */
const atree_merge = new (class extends ComputeNode {
    constructor() { super('builder-atree-merge'); }

    compute_func(input_map) {
        const [hard_error, errors] = input_map.get('atree-errors');
        if (hard_error) { return null; }
        const player_class = input_map.get('player-class');
        const build = input_map.get('build');
        const atree_state = input_map.get('atree-state');
        const atree_order = input_map.get('atree');

        let abils_merged = new Map();
        for (const abil of default_abils[player_class]) {
            let tmp_abil = deepcopy(abil);
            if (!('desc' in tmp_abil)) {
                tmp_abil.desc = [];
            }
            else if (!Array.isArray(tmp_abil.desc)) {
                tmp_abil.desc = [tmp_abil.desc];
            }
            abils_merged.set(abil.id, tmp_abil);
        }

        function merge_abil(abil) {
            if ('base_abil' in abil) {
                if (abils_merged.has(abil.base_abil)) {
                    // Merge abilities.
                    // TODO: What if there is more than one base abil?
                    let base_abil = abils_merged.get(abil.base_abil);
                    if (abil.desc) {
                        if (Array.isArray(abil.desc)) { base_abil.desc = base_abil.desc.concat(abil.desc); }
                        else { base_abil.desc.push(abil.desc); }
                    }

                    base_abil.effects = base_abil.effects.concat(abil.effects);
                    for (let propname in abil.properties) {
                        if (propname in base_abil.properties) {
                            base_abil.properties[propname] += abil.properties[propname];
                        }
                        else { base_abil.properties[propname] = abil.properties[propname]; }
                    }
                }
                // do nothing otherwise.
            }
            else {
                let tmp_abil = deepcopy(abil);
                if (!Array.isArray(tmp_abil.desc)) {
                    tmp_abil.desc = [tmp_abil.desc];
                }
                abils_merged.set(abil.id, tmp_abil);
            }
        }

        for (const node of atree_order) {
            const abil_id = node.ability.id;
            if (!atree_state.get(abil_id).active) {
                continue;
            }
            merge_abil(node.ability);
        }

        // Apply major IDs.
        const build_class = wep_to_class.get(build.weapon.statMap.get("type"));
        for (const major_id_name of build.statMap.get("activeMajorIDs")) {

            // Sometimes, something silly happens and we haven't implemented a major ID that
            //   exists. This makes sure we don't try to apply unimplemented major IDs.
            //
            // `major_ids` is a global map loaded from data json.
            if (major_id_name in MAJOR_IDS) {

                // A major ID can have multiple abilities, specified as atree nodes,
                //   as part of its effects. Apply each of them.
                for (const abil of MAJOR_IDS[major_id_name].abilities) {

                    // But only the ones that match the current class.
                    if (abil["class"] === build_class || abil["class"] === "Any") {

                        // Major IDs can have ability dependencies.
                        // By default they are always on.
                        if (abil.dependencies !== undefined) {

                            let dep_satisfied = true;
                            for (const dep_id of abil.dependencies) {
                                if (!atree_state.get(dep_id).active) {
                                    dep_satisfied = false;
                                    break;
                                }
                            }
                            if (!dep_satisfied) { continue; }
                        }
                        merge_abil(abil);
                    }
                }
            }
        }
        return abils_merged;
    }
})().link_to(atree_node, 'atree').link_to(atree_state_node, 'atree-state').link_to(atree_validate, 'atree-errors');

/**
 * Make interactive elements (sliders, buttons)
 *
 * Signature: AbilityActiveUINode(atree-merged: MergedATree) => Map<str, slider_info>
 *
 * ElemState: {
 *   value: int     // value for sliders; 0-1 for toggles
 * }
 */
const atree_make_interactives = new (class extends ComputeNode {
    constructor() { super('atree-make-interactives'); }

    compute_func(input_map) {
        const merged_abils = input_map.get('atree-merged');
        const atree_order = input_map.get('atree-order');

        const boost_slider_parent = document.getElementById("boost-sliders");
        const boost_toggle_parent = document.getElementById("boost-toggles");
        boost_slider_parent.innerHTML = "";
        boost_toggle_parent.innerHTML = "";

        /**
         * slider_info 
         *   label_name: str,
         *   max: int,
         *   step: int,
         *   id: str,
         *   abil: atree_node
         *   slider: html element
         * }
         */
        // Map<str, slider_info>
        const slider_map = new Map();
        const button_map = new Map();

        let to_process = [];
        for (const [abil_id, ability] of merged_abils) {
            for (const effect of ability.effects) {
                if (effect['type'] === "stat_scaling" && effect['slider'] === true) {
                    to_process.push([effect, abil_id, ability]);
                }
                if (effect['type'] === "raw_stat" && effect['toggle']) {
                    to_process.push([effect, abil_id, ability]);
                }
            }
        }
        let unprocessed = [];
        // first, pull out all the sliders and toggles.
        let k = to_process.length;
        for (let i = 0; i < k; ++i) {
            for (const [effect, abil_id, ability] of to_process) {
                if (effect['type'] === "stat_scaling" && effect['slider'] === true) {
                    const { slider_name, behavior = 'merge', slider_max = 0, slider_step, slider_default = 0, scaling = [0], max = 0} = effect;
                    if (slider_map.has(slider_name)) {
                        const slider_info = slider_map.get(slider_name);
                        if (behavior === 'overwrite') {
                            if('slider_max' in effect)
                                slider_info.max = slider_max;
                            if('slider_default' in effect)
                                slider_info.default_val = slider_default;
                            if('scaling' in effect){
                                for(let j = 0; j < slider_info.abil.effects.length; ++j){
                                    if('scaling' in slider_info.abil.effects[j] && slider_info.abil.effects[j] !== effect &&slider_info.abil.effects[j].output.name === effect.output.name){ 
                                        slider_info.abil.effects[j].scaling = [0];
                                    }
                                }
                            }
                        }
                        else{
                            slider_info.max += slider_max;
                            slider_info.default_val += slider_default;
                        }
                    }
                    else if (behavior === 'merge') {
                        slider_map.set(slider_name, {
                            label_name: slider_name+' ('+ability.display_name+')',
                            max: slider_max,
                            default_val: slider_default,
                            step: slider_step,
                            id: "ability-slider"+ability.id,
                            //color: effect['slider_color'] TODO: add colors to json
                            abil: ability
                        });
                    }
                    else {
                        unprocessed.push([effect, abil_id, ability]);
                    }
                }
                if (effect['type'] === "raw_stat" && effect['toggle']) {
                    const { toggle: toggle_name } = effect;
                    button_map.set(toggle_name, {
                        abil: ability
                    });
                }
            }
            if (unprocessed.length == to_process.length) { break; }
            to_process = unprocessed;
            unprocessed = [];
        }
        // next, render the sliders and toggles onto the abilities.
        for (const [slider_name, slider_info] of slider_map.entries()) {
            let slider_container = gen_slider_labeled(slider_info);
            boost_slider_parent.appendChild(slider_container);
            slider_info.slider = document.getElementById(slider_info.id);
            slider_info.slider.addEventListener("change", (e) => atree_scaling.mark_dirty().update());
        }
        for (const [button_name, button_info] of button_map.entries()) {
            let button = make_elem('button', ["button-boost", "border-0", "text-white", "dark-8u", "dark-shadow-sm", "m-1"], {
                id: button_info.abil.id,
                textContent: button_name
            });
            button.addEventListener("click", (e) => {
                if (button.classList.contains("toggleOn")) {
                    button.classList.remove("toggleOn");
                } else {
                    button.classList.add("toggleOn");
                }
                atree_scaling.mark_dirty().update()
            });
            button_info.button = button;
            boost_toggle_parent.appendChild(button);
        }
        return [slider_map, button_map];
    }
})().link_to(atree_node, 'atree-order').link_to(atree_merge, 'atree-merged');

/**
 * Scaling stats from ability tree.
 * Return StatMap of added stats,
 *
 * Signature: AbilityTreeScalingNode(atree-merged: MergedATree, scale-scats: StatMap,
 *                                 atree-interactive: [Map<str, slider_info>, Map<str, button_info>]) => (ATree, StatMap)
 */
const atree_scaling = new (class extends ComputeNode {
    constructor() { super('atree-scaling-collector'); }

    compute_func(input_map) {
        const atree_merged = input_map.get('atree-merged');
        const pre_scale_stats = input_map.get('scale-stats');
        const [slider_map, button_map] = input_map.get('atree-interactive');

        const atree_edit = new Map();
        for (const [abil_id, abil] of atree_merged.entries()) {
            atree_edit.set(abil_id, deepcopy(abil));
        }
        let ret_effects = new Map();

        // Apply a stat bonus.
        function apply_bonus(bonus_info, value) {
            const { type, name, abil = null} = bonus_info;
            if (type === 'stat') {
                merge_stat(ret_effects, name, atree_translate(atree_merged, value));
            } else if (type === 'prop') {
                const merge_abil = atree_edit.get(abil);
                if (merge_abil) {
                    merge_abil.properties[name] += value;
                }
            }
        }
        for (const [abil_id, abil] of atree_merged.entries()) {
            if (abil.effects.length == 0) { continue; }

            for (const effect of abil.effects) {
                switch (effect.type) {
                case 'raw_stat':
                    if (effect.toggle) {
                        const button = button_map.get(effect.toggle).button;
                        if (!button.classList.contains("toggleOn")) { continue; }
                        for (const bonus of effect.bonuses) {
                            apply_bonus(bonus, bonus.value);
                        }
                    } else {
                        for (const bonus of effect.bonuses) {
                            // Stat was applied earlier...
                            if (bonus.type === 'stat') { continue; }
                            apply_bonus(bonus, bonus.value);
                        }
                    }
                    continue;
                case 'stat_scaling':
                    let total = 0;
                    const {slider = false, scaling = [0], behavior="merge"} = effect;
                    let { positive = true, round = true } = effect;
                    if (slider) {
                        if (behavior == "modify" && !slider_map.has(effect.slider_name)) {
                            // Dangerous control flow.. early continue
                            continue;
                        }
                        const slider_val = slider_map.get(effect.slider_name).slider.value;
                        total = parseInt(slider_val) * atree_translate(atree_merged, scaling[0]);
                        round = false;
                        positive = false;
                    }
                    else {
                        // TODO: type: prop?
                        for (const [_scaling, input] of zip2(scaling, effect.inputs)) {
                            total += pre_scale_stats.get(input.name) * atree_translate(atree_merged, _scaling);
                        }
                    }

                    if ('output' in effect) { // sometimes nodes will modify slider without having effect.
                        if (round) { total = Math.floor(round_near(total)); }
                        if (positive && total < 0) { total = 0; }   // Normal stat scaling will not go negative.
                        if ('max' in effect) {
                            let effect_max = atree_translate(atree_merged, effect.max);
                            if (effect_max > 0 && total > effect_max) { total = effect.max; }
                            if (effect_max < 0 && total < effect_max) { total = effect.max; }
                        }
                        if (Array.isArray(effect.output)) {
                            for (const output of effect.output) {
                                apply_bonus(output, total);
                            }
                        }
                        else {
                            apply_bonus(effect.output, total);
                        }
                    }
                    continue;
                }
            }
        }
        return [atree_edit, ret_effects];
    }
})().link_to(atree_merge, 'atree-merged').link_to(atree_make_interactives, 'atree-interactive');

/**
 * These following two nodes are just boilerplate that breaks down the scaling node.
 */
const atree_scaling_tree = new (class extends ComputeNode {
    constructor() { super('atree-scaling-tree'); }

    compute_func(input_map) {
        const [[tree, stats]] = input_map.values();
        return tree;
    }
})().link_to(atree_scaling, 'atree-scaling');
const atree_scaling_stats = new (class extends ComputeNode {
    constructor() { super('atree-scaling-stats'); }

    compute_func(input_map) {
        const [[tree, stats]] = input_map.values();
        return stats;
    }
})().link_to(atree_scaling, 'atree-scaling');

const atree_render_errors = new (class extends ComputeNode {
    constructor() {
        super('atree-render-errors');
        this.list_elem = document.getElementById("atree-warning");
    }

    compute_func(input_map) {
        const [hard_error, errors] = input_map.get('atree-errors');

        this.list_elem.innerHTML = ""; //reset all atree actives - should be done in a more general way later
        // TODO: move to display?
        if (errors.length > 0) {
            const errorbox = make_elem('div', ['rounded-bottom', 'dark-4', 'border', 'p-0', 'mx-2', 'mb-0', 'mt-4', 'dark-shadow']);
            this.list_elem.append(errorbox);

            const error_title = make_elem('b', ['warning', 'scaled-font'], { innerHTML: "ATree Error!" });
            errorbox.append(error_title);

            for (let i = 0; i < 5 && i < errors.length; ++i) {
                errorbox.append(make_elem("p", ["warning", "small-text"], {textContent: errors[i]}));
            }
            if (errors.length > 5) {
                const error = '... ' + (errors.length-5) + ' errors not shown';
                errorbox.append(make_elem("p", ["warning", "small-text"], {textContent: error}));
            }
        }
    }
})().link_to(atree_validate, 'atree-errors');

/**
 * Render ability tree.
 * Return map of id -> corresponding html element.
 *
 * Signature: AbilityTreeRenderActiveNode(atree-merged: MergedATree, atree-order: ATree, atree-errors: List[str]) => Map[int, ATreeNode]
 */
const atree_render_active = new (class extends ComputeNode {
    constructor() {
        super('atree-render-active');
        this.list_elem = document.getElementById("atree-active");
    }

    compute_func(input_map) {
        const merged_abils = input_map.get('atree-merged');
        const atree_order = input_map.get('atree-order');

        this.list_elem.innerHTML = ""; //reset all atree actives - should be done in a more general way later
        const ret_map = new Map();
        const to_render_id = [999, 998];
        for (const node of atree_order) {
            if (!merged_abils.has(node.ability.id)) {
                continue;
            }
            to_render_id.push(node.ability.id);
        }
        for (const id of to_render_id) {
            const abil = merged_abils.get(id);

            const active_tooltip = make_elem('div', ['rounded-bottom', 'dark-4', 'border', 'p-0', 'mx-2', 'my-4', 'dark-shadow']);
            active_tooltip.append(make_elem('b', ['scaled-font'], { innerHTML: abil.display_name }));

            for (const desc of abil.desc) {
                active_tooltip.append(make_elem('p', ['scaled-font-sm', 'my-0', 'mx-1', 'text-wrap'], { innerHTML: desc }));
            }
            ret_map.set(abil.id, active_tooltip);

            this.list_elem.append(active_tooltip);
        }
        return ret_map;
    }
})().link_to(atree_node, 'atree-order').link_to(atree_scaling_tree, 'atree-merged');

/**
 * Parse out "parametrized entries".
 * Straight replace.
 *
 * Format: ability_id.propname
 */
function atree_translate(atree_merged, v) {
    if (typeof v === 'string') {
        const [id_str, propname] = v.split('.');
        const id = parseInt(id_str);
        const ret = atree_merged.get(id).properties[propname];
        return ret;
    }
    return v;
}

/**
 * Collect spells from abilities.
 *
 * Signature: AbilityCollectSpellsNode(atree-merged: Map[id, Ability]) => List[Spell]
 */
const atree_collect_spells = new (class extends ComputeNode {
    constructor() { super('atree-spell-collector'); }

    compute_func(input_map) {
        const atree_merged = input_map.get('atree-merged');
        
        let ret_spells = new Map();
        for (const [abil_id, abil] of atree_merged.entries()) {
            // TODO: Possibly, make a better way for detecting "spell abilities"?
            for (const effect of abil.effects) {
                if (effect.type === 'replace_spell') {
                    // replace_spell just replaces all (defined) aspects.
                    let ret_spell = ret_spells.get(effect.base_spell);
                    if (ret_spell) {
                        // NOTE: do not mutate results of previous steps!
                        for (const key in effect) {
                            ret_spell[key] = deepcopy(effect[key]);
                        }
                    }
                    else {
                        ret_spell = deepcopy(effect);
                        ret_spells.set(effect.base_spell, ret_spell);
                    }
                    for (const part of ret_spell.parts) {
                        if ('hits' in part) {
                            for (const idx in part.hits) {
                                part.hits[idx] = atree_translate(atree_merged, part.hits[idx]);
                            }
                        }
                    }
                }
            }
        }

        for (const [abil_id, abil] of atree_merged.entries()) {
            for (const effect of abil.effects) {
                switch (effect.type) {
                case 'replace_spell':
                    // Already handled above.
                    continue;
                case 'add_spell_prop': {
                    const { base_spell, target_part = null, cost = 0, behavior = 'merge'} = effect;
                    if (!ret_spells.has(base_spell)) {
                        continue;
                    }

                    const ret_spell = ret_spells.get(base_spell);

                    // :enraged:
                    // NOTE to hpp: this is out here because:
                    // target_part doesn't exist for spell cost modification abilities
                    // except when it does... in which case it should apply exactly once.
                    if ('cost' in ret_spell) { ret_spell.cost += cost; }

                    // NOTE: see above comment for the weird placement of this code block.
                    if (target_part === null) { continue; }

                    let found_part = false;
                    for (let part of ret_spell.parts) { // TODO: replace with Map? to avoid this linear search... idk prolly good since its not more verbose to type in json
                        if (part.name !== target_part) {
                            continue;
                        }
                        // we found the part. merge or modify it!
                        if ('multipliers' in effect) {
                            for (const [idx, v] of effect.multipliers.entries()) {  // python: enumerate()
                                if (behavior === 'overwrite') { part.multipliers[idx] = v; }
                                else { part.multipliers[idx] += v; }
                            }
                        }
                        else if ('power' in effect) {
                            if (behavior === 'overwrite') { part.power = effect.power; }
                            else { part.power += effect.power; }
                        }
                        else if ('hits' in effect) {
                            for (const [idx, _v] of Object.entries(effect.hits)) { // looks kinda similar to multipliers case... hmm... can we unify all of these three? (make healpower a list)
                                let v = atree_translate(atree_merged, _v);
                                if (behavior === 'overwrite') { part.hits[idx] = v; }
                                else {
                                    if (idx in part.hits) { part.hits[idx] += v; }
                                    else { part.hits[idx] = v; }
                                }
                            }
                        }
                        else {
                            throw "uhh invalid spell add effect";
                        }
                        if ('hide' in effect) {
                            part.display = false;
                        }
                        found_part = true;
                        break;
                    }
                    if (!found_part && behavior === 'merge') { // add part. if behavior is merge
                        let spell_part = deepcopy(effect);
                        spell_part.name = target_part;  // has some extra fields but whatever
                        if ('hits' in spell_part) {
                            for (const idx in spell_part.hits) {
                                spell_part.hits[idx] = atree_translate(atree_merged, spell_part.hits[idx]);
                            }
                        }
                        if ('hide' in effect) {
                            spell_part.display = false;
                        }
                        ret_spell.parts.push(spell_part);
                    }
                    if ('display' in effect) {
                        ret_spell.display = effect.display;
                    }
                    continue;
                }
                // NOTE: Legacy support
                case 'convert_spell_conv':
                    const { base_spell, target_part, conversion } = effect;
                    const ret_spell = ret_spells.get(base_spell);
                    const elem_idx = damageClasses.indexOf(conversion);
                    let filter = target_part === 'all';
                    for (let part of ret_spell.parts) { // TODO: replace with Map? to avoid this linear search... idk prolly good since its not more verbose to type in json
                        if (filter || part.name === target_part) {
                            if ('multipliers' in part) {
                                let total_conv = 0;
                                for (let i = 1; i < 6; ++i) {   // skip neutral
                                    total_conv += part.multipliers[i];
                                }
                                let new_conv = [part.multipliers[0], 0, 0, 0, 0, 0];
                                new_conv[elem_idx] = total_conv;
                                part.multipliers = new_conv;
                            }
                        }
                    }
                    continue;
                }
            }
        }
        return ret_spells;
    }
})().link_to(atree_scaling_tree, 'atree-merged');

/**
 * Collect raw stats from ability tree.
 * Return StatMap of added stats.
 *
 * Signature: AbilityTreeStatsNode(atree-merged: MergedATree) => StatMap
 */
const atree_raw_stats = new (class extends ComputeNode {
    constructor() { super('atree-raw-stats-collector'); }

    compute_func(input_map) {
        const atree_merged = input_map.get('atree-merged');

        let ret_effects = new Map();
        for (const [abil_id, abil] of atree_merged.entries()) {
            if (abil.effects.length == 0) { continue; }

            for (const effect of abil.effects) {
                switch (effect.type) {
                case 'raw_stat':
                    // toggles are handled in atree_scaling.
                    if (effect.toggle) { continue; }
                    for (const bonus of effect.bonuses) {
                        const { type, name, abil = "", value } = bonus;
                        // TODO: prop
                        if (type === "stat") {
                            merge_stat(ret_effects, name, value);
                        }
                    }
                    continue;
                }
            }
        }
        return ret_effects;
    }
})().link_to(atree_merge, 'atree-merged');

/**
 * Construct compute nodes to link builder items and edit IDs to the appropriate display outputs.
 * To make things a bit cleaner, the compute graph structure goes like
 * [builder, build stats] -> [one agg node that is just a passthrough] -> all the spell calc nodes
 * This way, when things have to be deleted i can just delete one node from the dependencies of builder/build stats...
 * thats the idea anyway.
 *
 * Whenever this is updated, it forces an update of all the newly created spell nodes (if the build is clean).
 *
 * Signature: AbilityEnsureSpellsNodes(spells: Map[id, Spell]) => null
 */
class AbilityTreeEnsureNodesNode extends ComputeNode {
    
    /**
     * Kinda "hyper-node": Constructor takes nodes that should be linked to (build node and stat agg node)
     */
    constructor(build_node, stat_agg_node) {
        super('atree-make-nodes');
        this.build_node = build_node;
        this.stat_agg_node = stat_agg_node;
        // Slight amount of wasted compute to keep internal state non-changing.
        this.passthrough = new PassThroughNode('spell-calc-buffer').link_to(this.build_node, 'build').link_to(this.stat_agg_node, 'stats');
        this.spelldmg_nodes = [];   // debugging use
        this.spell_display_elem = document.getElementById("all-spells-display");
    }

    compute_func(input_map) {
        this.passthrough.remove_link(this.build_node);
        this.passthrough.remove_link(this.stat_agg_node);
        this.passthrough = new PassThroughNode('spell-calc-buffer').link_to(this.build_node, 'build').link_to(this.stat_agg_node, 'stats');
        this.spell_display_elem.textContent = "";
        const build_node = this.passthrough.get_node('build');   // aaaaaaaaa performance... savings... help.... 
        const stat_agg_node = this.passthrough.get_node('stats');

        const spell_map = input_map.get('spells');  // TODO: is this gonna need more? idk...
                                                    // TODO shortcut update path for sliders

        for (const [spell_id, spell] of new Map([...spell_map].sort((a, b) => a[0] - b[0])).entries()) {
            let calc_node = new SpellDamageCalcNode(spell)
                .link_to(build_node, 'build')
                .link_to(stat_agg_node, 'stats');
            this.spelldmg_nodes.push(calc_node);

            let display_elem = make_elem('div', ["col", "pe-0"]);
            // TODO: just pass these elements into the display node instead of juggling the raw IDs...
            let spell_summary = make_elem('div', ["col", "spell-display", "fake-button", "dark-5", "rounded", "dark-shadow", "pt-2", "border", "border-dark"],
                    { id: "spell"+spell.base_spell+"-infoAvg" }); 
            let spell_detail = make_elem('div', ["col", "spell-display", "dark-5", "rounded", "dark-shadow", "py-2"],
                    { id: "spell"+spell.base_spell+"-info", style: { display: 'none' } });

            display_elem.append(spell_summary, spell_detail);

            let display_node = new SpellDisplayNode(spell)
                .link_to(stat_agg_node, 'stats')
                .link_to(calc_node, 'spell-damage');

            this.spell_display_elem.appendChild(display_elem);
        }
        this.passthrough.mark_dirty().update(); // Force update once.
    }
}

/** The main function for rendering an ability tree. 
 * 
 * @param {Element} UI_elem - the DOM element to draw the atree within.
 * @param {Element} list_elem - the DOM element to list selected abilities within.
 * @param {*} tree - the ability tree to work with.
 */
function render_AT(UI_elem, list_elem, tree) {
    console.log("constructing ability tree UI");

    // increase padding, since images are larger than the space provided
    UI_elem.style.paddingRight = "calc(var(--bs-gutter-x) * 1)";
    UI_elem.style.paddingLeft = "calc(var(--bs-gutter-x) * 1)";
    UI_elem.style.paddingTop = "calc(var(--bs-gutter-x) * .5)";

    // add in the "Active" title to atree
    const active_row = make_elem("div", ["row", "item-title", "mx-auto", "justify-content-center"]);
    const active_word = make_elem("div", ["col-auto"], {textContent: "Active Abilities:"});

    const active_AP_container = make_elem("div", ["col-auto"]);
    const active_AP_subcontainer = make_elem("div", ["row"]);
    const active_AP_cost = make_elem("div", ["col-auto", "mx-0", "px-0"], {id: "active_AP_cost", textContent: "0"});

    const active_AP_slash = make_elem("div", ["col-auto", "mx-0", "px-0"], {textContent: "/"});
    const active_AP_cap = make_elem("div", ["col-auto", "mx-0", "px-0"], {id: "active_AP_cap"});
    const active_AP_end = make_elem("div", ["col-auto", "mx-0", "px-0"], {textContent: " AP"});

    active_AP_container.append(active_AP_subcontainer);
    active_AP_subcontainer.append(active_AP_cost, active_AP_slash, active_AP_cap, active_AP_end);

    active_row.append(active_word, active_AP_container);
    list_elem.append(active_row);

    const atree_map = new Map();
    const atree_connectors_map = new Map()
    let max_row = 0;
    for (const i of tree) {
        atree_map.set(i.ability.id, {ability: i.ability, connectors: new Map(), active: false});
        if (i.ability.display.row > max_row) {
            max_row = i.ability.display.row;
        }
    }
    // Copy graph structure.
    for (const i of tree) {
        let node_wrapper = atree_map.get(i.ability.id);
        node_wrapper.parents = [];
        node_wrapper.children = [];
        for (const parent of i.parents) {
            node_wrapper.parents.push(atree_map.get(parent.ability.id));
        }
        for (const child of i.children) {
            node_wrapper.children.push(atree_map.get(child.ability.id));
        }
    }

    // Setup grid.
    for (let j = 0; j <= max_row; j++) {
        const row = make_elem('div', ['row'], { id: "atree-row-"+j });
        for (let k = 0; k < 9; k++) {
            row.append(make_elem('div', ['col', 'px-0'], { style: "position: relative; aspect-ratio: 1/1;" }));
        }
        UI_elem.append(row);
    }

    for (const _node of tree) {
        let node_wrap = atree_map.get(_node.ability.id);
        let ability = _node.ability;

        // create connectors based on parent location
        for (let parent of node_wrap.parents) {
            node_wrap.connectors.set(parent, []);

            let parent_abil = parent.ability;
            const parent_id = parent_abil.id;

            let connect_elem = make_elem("canvas", [], {style: "width: 112.5%; height: 112.5%; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); image-rendering: pixelated;", width: "18", height: "18"});

            // connect up
            for (let i = ability.display.row - 1; i > parent_abil.display.row; i--) {
                const coord = i + "," + ability.display.col;
                let connector = connect_elem.cloneNode();
                node_wrap.connectors.get(parent).push(coord);
                resolve_connector(atree_connectors_map, coord, {connector: connector, connections: [0, 0, 1, 1]});
            }
            // connect horizontally
            let min = Math.min(parent_abil.display.col, ability.display.col);
            let max = Math.max(parent_abil.display.col, ability.display.col);
            for (let i = min + 1; i < max; i++) {
                const coord = parent_abil.display.row + "," + i;
                let connector = connect_elem.cloneNode();
                node_wrap.connectors.get(parent).push(coord);
                resolve_connector(atree_connectors_map, coord, {connector: connector, connections: [1, 1, 0, 0]});
            }

            // connect corners
            if (parent_abil.display.row != ability.display.row && parent_abil.display.col != ability.display.col) {
                const coord = parent_abil.display.row + "," + ability.display.col;
                let connector = connect_elem.cloneNode();
                node_wrap.connectors.get(parent).push(coord);
                let connections = [0, 0, 0, 1];
                if (parent_abil.display.col > ability.display.col) {
                    connections[1] = 1;
                }
                else {// if (parent_node.display.col < node.display.col && (parent_node.display.row != node.display.row)) {
                    connections[0] = 1;
                }
                resolve_connector(atree_connectors_map, coord, {connector: connector, connections: connections});
            }
        }

        // create node
        let node_elem = document.getElementById("atree-row-" + ability.display.row).children[ability.display.col];
        node_wrap.img = make_elem("canvas", [], {style: "width: 200%; height: 200%; position: absolute; top: -50%; left: -50%; image-rendering: pixelated; z-index: 1;", width: "32", height: "32"})
        node_elem.appendChild(node_wrap.img);

        // create hitbox
        // this is necessary since images exceed the size of their square, but should only be interactible within that square
        let hitbox = make_elem('div', [], {
            style: 'position: absolute; cursor: pointer; left: 0; top: 0; width: 100%; height: 100%; z-index: 2;'
        });
        node_elem.appendChild(hitbox);

        node_wrap.elem = node_elem;
        node_wrap.all_connectors_ref = atree_connectors_map;

        // add listeners
        // listeners differ between mobile and desktop since hovering is a bit fucky on mobile
        if (!isMobile) { // desktop
            hitbox.addEventListener('click', function(e) {
                atree_set_state(node_wrap, !node_wrap.active);
                atree_state_node.mark_dirty().update();
            });

            // add tooltip
            hitbox.addEventListener('mouseover', function(e) {
                if (node_wrap.tooltip_elem) {
                    node_wrap.tooltip_elem.remove();
                    delete node_wrap.tooltip_elem;
                }

                node_wrap.tooltip_elem = make_elem("div", ["rounded-bottom", "dark-4", "border", "mx-2", "my-4", "dark-shadow", "text-start"], {
                    style: {
                        position: "absolute",
                        zIndex: "100",
                        top: (node_elem.getBoundingClientRect().top + window.pageYOffset + 50) + "px",
                        left: UI_elem.getBoundingClientRect().left + "px",
                        width: (UI_elem.getBoundingClientRect().width * 0.95) + "px"
                    }
                });
                generateTooltip(node_wrap.tooltip_elem, node_elem, ability, atree_map);
                UI_elem.appendChild(node_wrap.tooltip_elem);
            });

            hitbox.addEventListener('mouseout', function(e) {
                if (node_wrap.tooltip_elem) {
                    node_wrap.tooltip_elem.remove();
                    delete node_wrap.tooltip_elem;
                }
            });
        } else { // mobile
            // tap to toggle
            // long press to make a popup with the tooltip and a button to turn off/on
            let touchTimer = null;
            let didLongPress = false;

            hitbox.addEventListener("touchstart", function(e) {
                clearTimeout(touchTimer);
                touchTimer = setTimeout(function() {
                    let popup = make_elem("div", [], {style: "position: fixed; z-index: 10000; top: 0; left: 0; width: 100vw; height: 100vh; background-color: rgba(0, 0, 0, 0.6); padding-top: 10vh; padding-left: 2.5vw; user-select: none;"});
                    popup.addEventListener("click", function(e) {
                        // close popup if the background is clicked
                        if (e.target !== this) {return;} // e.target is the lowest element that was the target of the event
                        popup.remove();
                    });

                    let tooltip = make_elem("div", ["rounded-bottom", "dark-4", "border", "dark-shadow", "text-start"], {"style": "width: 95vw; max-height: 80vh; overflow-y: scroll;"});
                    generateTooltip(tooltip, node_elem, ability, atree_map);
                    popup.appendChild(tooltip);

                    let toggleButton = make_elem("button", ["scaled-font", "disable-select"], {innerHTML: (node_wrap.active ? "Unselect Ability" : "Select Ability"), style: "width: 95vw; height: 8vh; margin-top: 2vh; text-align: center;"});
                    toggleButton.addEventListener("click", function(e) {
                        atree_set_state(node_wrap, !node_wrap.active);
                        atree_state_node.mark_dirty().update();
                        popup.remove();
                    });
                    popup.appendChild(toggleButton);

                    document.body.appendChild(popup);

                    didLongPress = true;
                    touchTimer = null;
                }, 500);
            });
            hitbox.addEventListener("touchend", function(e) {
                if (!didLongPress) {
                    clearTimeout(touchTimer);
                    touchTimer = null;
                    atree_set_state(node_wrap, !node_wrap.active);
                    atree_state_node.mark_dirty().update();
                } else {
                    didLongPress = false;
                }
            });
        }
    };
    atree_render_connection(atree_connectors_map);

    return atree_map;
};

function generateTooltip(container, node_elem, ability, atree_map) {
    // title
    let title = make_elem("b", ["scaled-font", "mx-1"], {});
    title.innerHTML = ability.display_name;
    switch(ability.display.icon) {
        case "node_0":
            // already white
            break;
        case "node_1": // Yellow nodes
            title.classList.add("mc-gold");
            break;
        case "node_2": // Purple nodes
            title.classList.add("mc-light-purple");
            break;
        case "node_3": // Red nodes
            title.classList.add("mc-red");
            break;
        case "node_4": // Blue nodes
            title.classList.add("mc-aqua");
            break;
        case "node_warrior":
        case "node_archer":
        case "node_mage":
        case "node_assassin":
        case "node_shaman":
            title.classList.add("mc-green");
            break;
    }
    container.appendChild(title);

    container.innerHTML += "<br/><br/>";

    // description
    let description = make_elem("p", ["scaled-font", "my-0", "mx-1", "text-wrap", "mc-gray"], {});
    let numberRegex = /[+-]?\d+(\.\d+)?[%+s]?/g; // +/- (optional), 1 or more digits, period followed by 1 or more digits (optional), %/+/s (optional)
    description.innerHTML = ability.desc.replaceAll(numberRegex, (m) => { return "<span class = 'mc-white'>" + m + "</span>" });
    container.appendChild(description);

    container.appendChild(make_elem('br'));

    // archetype
    if ("archetype" in ability && ability.archetype !== "") {
        let archetype = make_elem("p", ["scaled-font", "my-0", "mx-1"], {});
        archetype.innerHTML = ability.archetype + " Archetype";
        switch(ability.archetype) {
            case "Riftwalker":
            case "Paladin":
                archetype.classList.add("mc-aqua");
                break;
            case "Fallen":
                archetype.classList.add("mc-red");
                break;
            case "Boltslinger":
            case "Battle Monk":
                archetype.classList.add("mc-yellow");
                break;
            case "Trapper":
                archetype.classList.add("mc-dark-green");
                break;
            case "Trickster":
            case "Sharpshooter":
                archetype.classList.add("mc-light-purple");
                break;
            case "Arcanist":
                archetype.classList.add("mc-dark-purple");
                break;
            case "Acrobat":
            case "Light Bender":
                // already white
                break;
            case "Shadestepper":
                archetype.classList.add("mc-dark-red");
                break;
        }
        container.appendChild(archetype);
        container.appendChild(make_elem('br'));
    }

    // calculate if requirements are satisfied
    let apUsed = 0;
    let maxAP = parseInt(document.getElementById("active_AP_cap").innerHTML);
    let arch_chosen = 0;
    const node_arch = ability.req_archetype || ability.archetype;
    let satisfiedDependencies = [];
    let blockedBy = [];
    for (let [id, node_wrap] of atree_map.entries()) {
        if (!node_wrap.active || id == ability.id) {
            continue; // we don't want to count abilities that are not selected, and an ability should not count towards itself
        }
        apUsed += node_wrap.ability.cost;
        if (node_wrap.ability.archetype == node_arch) {
            arch_chosen++;
        }
        if (ability.dependencies.includes(id)) {
            satisfiedDependencies.push(id);
        }
        if (ability.blockers.includes(id)) {
            blockedBy.push(node_wrap.ability.display_name);
        }
    }

    let reqYes = "<span class = 'mc-green'>&#10004;</span>" // green check mark
    let reqNo = "<span class = 'mc-red'>&#10006;</span>" // red x

    // cost
    let cost = make_elem("p", ["scaled-font", "my-0", "mx-1"], {});
    if (apUsed + ability.cost > maxAP) {
        cost.innerHTML = reqNo;
    } else {
        cost.innerHTML = reqYes;
    }
    cost.innerHTML += "<span class = 'mc-gray'>Ability Points:</span> " + (maxAP - apUsed) + "<span class = 'mc-gray'>/" + ability.cost;
    container.appendChild(cost);

    // archetype req
    if (ability.archetype_req > 0) {
        let arch_req = make_elem("p", ["scaled-font", "my-0", "mx-1"], {});
        if ('req_archetype' in ability && ability.req_archetype !== "") {
            req_archetype = ability.req_archetype;
        }
        else {
            req_archetype = ability.archetype;
        }
        if (arch_chosen >= ability.archetype_req) {
            arch_req.innerHTML = reqYes;
        } else {
            arch_req.innerHTML = reqNo;
        }
        arch_req.innerHTML += "<span class = 'mc-gray'>Min " + req_archetype+ " Archetype:</span> " + arch_chosen + "<span class = 'mc-gray'>/" + ability.archetype_req;
        container.appendChild(arch_req);
    }

    // dependencies
    for (let i = 0; i < ability.dependencies.length; i++) {
        let dependency = make_elem("p", ["scaled-font", "my-0", "mx-1"], {});
        if (satisfiedDependencies.includes(ability.dependencies[i])) {
            dependency.innerHTML = reqYes;
        } else {
            dependency.innerHTML = reqNo;
        }
        dependency.innerHTML += "<span class = 'mc-gray'>Required Ability:</span> " + atree_map.get(ability.dependencies[i]).ability.display_name;
        container.appendChild(dependency);
    }

    // blockers
    for (let i = 0; i < blockedBy.length; i++) {
        let blocker = make_elem("p", ["scaled-font", "my-0", "mx-1"], {});
        blocker.innerHTML = reqNo + "<span class = 'mc-gray'>Blocked By:</span> " + blockedBy[i];
        container.appendChild(blocker);
    }
}

// resolve connector conflict, when they occupy the same cell.
function resolve_connector(atree_connectors_map, pos, new_connector) {
    if (!atree_connectors_map.has(pos)) {
        atree_connectors_map.set(pos, new_connector);
        return;
    }
    let existing = atree_connectors_map.get(pos).connections;
    for (let i = 0; i < 4; ++i) {
        existing[i] += new_connector.connections[i];
    }
}

function set_connector_type(connector_info) {  // left right up down
    connector_info.type = "";
    for (let i = 0; i < 4; i++) {
        connector_info.type += connector_info.connections[i] == 0 ? "0" : "1";
    }
}

// toggle the state of a node.
function atree_set_state(node_wrapper, new_state) {
    let icon = node_wrapper.ability.display.icon;
    if (icon === undefined) {
        icon = "node";
    }
    if (new_state) {
        node_wrapper.active = true;
        draw_atlas_image(node_wrapper.img, atree_node_atlas_img, [atree_node_atlas_positions[icon], 2], atree_node_tile_size);
    } 
    else {
        node_wrapper.active = false;
        draw_atlas_image(node_wrapper.img, atree_node_atlas_img, [atree_node_atlas_positions[icon], 1], atree_node_tile_size);
    }
    let atree_connectors_map = node_wrapper.all_connectors_ref;
    for (const parent of node_wrapper.parents) {
        if (parent.active) {
            atree_set_edge(atree_connectors_map, parent, node_wrapper, new_state);  // self->parent state only changes if parent is on
        }
    }
    for (const child of node_wrapper.children) {
        if (child.active) {
            atree_set_edge(atree_connectors_map, node_wrapper, child, new_state);   // Same logic as above.
        }
    }
};

// atlas vars

// first key is connector type, second key is highlight, then [x, y] pair of 0-index positions in the tile atlas
const atree_connector_atlas_positions = {
    "1100": {"0000": [0, 0], "1100": [1, 0]},
    "1010": {"0000": [2, 0], "1010": [3, 0]},
    "0110": {"0000": [4, 0], "0110": [5, 0]},
    "1001": {"0000": [6, 0], "1001": [7, 0]},
    "0101": {"0000": [8, 0], "0101": [9, 0]},
    "0011": {"0000": [10, 0], "0011": [11, 0]},
    "1101": {"0000": [0, 1], "1101": [1, 1], "1100": [2, 1], "1001": [3, 1], "0101": [4, 1]},
    "0111": {"0000": [5, 1], "0111": [6, 1], "0110": [7, 1], "0101": [8, 1], "0011": [9, 1]},
    "1110": {"0000": [0, 2], "1110": [1, 2], "1100": [2, 2], "1010": [3, 2], "0110": [4, 2]},
    "1011": {"0000": [5, 2], "1011": [6, 2], "1010": [7, 2], "1001": [8, 2], "0011": [9, 2]},
    "1111": {"0000": [0, 3], "1111": [1, 3], "1110": [2, 3], "1101": [3, 3], "1100": [4, 3], "1011": [5, 3], "1010": [6, 3], "1001": [7, 3], "0111": [8, 3], "0110": [9, 3], "0101": [10, 3], "0011": [11, 3]}
}
const atree_connector_tile_size = 18;
const atree_connector_atlas_img = make_elem("img", [], {src: "../media/atree/connectors.png", loaded: false});
atree_connector_atlas_img.addEventListener("load", () => {
    atree_connector_atlas_img.loaded = true;
    for (const to_draw of atlas_to_draw.get(atree_connector_atlas_img)) {
        draw_atlas_image(to_draw[0], atree_connector_atlas_img, to_draw[1], to_draw[2]);
    }
    atlas_to_draw.set(atree_connector_atlas_img, []);
});

// just has the x position, y is based on state
const atree_node_atlas_positions = {
    "node_0": 0,
    "node_1": 1,
    "node_2": 2,
    "node_3": 4, // node_3 and node_4 are reversed to maintain backwards compat
    "node_4": 3, // TODO(orgold): Change sprite sheet so this ugliness does not need to happen
    "node_archer": 5,
    "node_warrior": 6,
    "node_mage": 7,
    "node_assassin": 8,
    "node_shaman": 9
}
const atree_node_tile_size = 32;
const atree_node_atlas_img = make_elem("img", [], {src: "../media/atree/icons.png", loaded: false});
atree_node_atlas_img.addEventListener("load", () => {
    atree_node_atlas_img.loaded = true;
    for (const to_draw of atlas_to_draw.get(atree_node_atlas_img)) {
        draw_atlas_image(to_draw[0], atree_node_atlas_img, to_draw[1], to_draw[2]);
    }
    atlas_to_draw.set(atree_node_atlas_img, []);
});

const atlas_to_draw = new Map();
atlas_to_draw.set(atree_connector_atlas_img, []);
atlas_to_draw.set(atree_node_atlas_img, []);
function draw_atlas_image(canvas, img, pos, tile_size) {
    if (!img.loaded) {
        atlas_to_draw.get(img).push([canvas, pos, tile_size]);
        return;
    }
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, tile_size, tile_size);
    ctx.drawImage(img, tile_size * pos[0], tile_size * pos[1], tile_size, tile_size, 0, 0, tile_size, tile_size);
}

// draw the connector onto the screen
function atree_render_connection(atree_connectors_map) {
    for (let i of atree_connectors_map.keys()) {
        let connector_info = atree_connectors_map.get(i);
        let connector_elem = connector_info.connector;
        set_connector_type(connector_info);
        connector_info.highlight = [0, 0, 0, 0];
        draw_atlas_image(connector_elem, atree_connector_atlas_img, atree_connector_atlas_positions[connector_info.type]["0000"], atree_connector_tile_size);
        let target_elem = document.getElementById("atree-row-" + i.split(",")[0]).children[i.split(",")[1]];
        if (target_elem.children.length != 0) {
            // janky special case... sometimes the ability tree tries to draw a link on top of a node...
            connector_elem.style.display = 'none';
        }
        target_elem.appendChild(connector_elem);
    };
};

// update the connector (after being drawn the first time by atree_render_connection)
function atree_set_edge(atree_connectors_map, parent, child, state) {
    const connectors = child.connectors.get(parent);
    const parent_row = parent.ability.display.row;
    const parent_col = parent.ability.display.col;
    const child_row = child.ability.display.row;
    const child_col = child.ability.display.col;

    let state_delta = (state ? 1 : -1);
    let child_side_idx = (parent_col > child_col ? 0 : 1);
    let parent_side_idx = 1 - child_side_idx;
    for (const connector_label of connectors) {
        let connector_info = atree_connectors_map.get(connector_label);
        let connector_elem = connector_info.connector;
        let highlight_state = connector_info.highlight; // left right up down
        const ctype = connector_info.type;
        let num_1s = 0;
        for (let i = 0; i < 4; i++) {
            if (ctype.charAt(i) == "1") {
                num_1s++;
            }
        }
        if (num_1s > 2) { // t branch or 4-way
            const [connector_row, connector_col] = connector_label.split(',').map(x => parseInt(x));

            if (connector_row === parent_row) {
                highlight_state[parent_side_idx] += state_delta;
            }
            else {
                highlight_state[2] += state_delta;  // up connection guaranteed.
            }
            if (connector_col === child_col) {
                highlight_state[3] += state_delta;
            }
            else {
                highlight_state[child_side_idx] += state_delta;
            }

            let render = "";
            for (let i = 0; i < 4; i++) {
                render += highlight_state[i] === 0 ? "0" : "1";
            }
            draw_atlas_image(connector_elem, atree_connector_atlas_img, atree_connector_atlas_positions[ctype][render], atree_connector_tile_size);
            continue;
        } else {
            // lol bad overloading, [0] is just the whole state
            highlight_state[0] += state_delta;
            if (highlight_state[0] > 0) {
                draw_atlas_image(connector_elem, atree_connector_atlas_img, atree_connector_atlas_positions[ctype][ctype], atree_connector_tile_size);
            } else {
                draw_atlas_image(connector_elem, atree_connector_atlas_img, atree_connector_atlas_positions[ctype]["0000"], atree_connector_tile_size);
            }
        }
    }
}
