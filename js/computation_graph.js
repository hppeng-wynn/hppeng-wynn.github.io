let all_nodes = new Set();
let node_debug_stack = [];
let COMPUTE_GRAPH_DEBUG = true;

class NodeInput {
    /**
    * @property {ComputeNode} node - the actual parent node.
    * @property {string} translation - translation for some nodes. equals to node.name if no special handling is required.
    * @property {boolean} is_dirty - flag indicating whether the input was already marked dirty. Important when a node has
    * multiple simultanious update paths.
    */
    constructor(node, translation=node.name) {
        this.node = node;
        this.translation = translation;
        this.is_dirty = false;
    }
}

class ComputeNode {
    /**
     * Make a generic compute node.
     * Adds the node to the global map of nodenames to nodes (for calling from html listeners).
     *
     * @param name : Name of the node (string). Must be unique. Must "fit in" a JS string (terminated by single quotes).
     */
    constructor(name) {
        this.inputs = new Map();   // Map<string, NodeInput> parent nodes
        this.children = [];
        this.value = null;
        this.name = name;
        this.update_task = null;
        this.fail_cb = false;   // Set to true to force updates even if parent failed
        this.dirty = 2;         // 3 states:
                                // 2: dirty
                                // 1: possibly dirty
                                // 0: clean
        this.inputs_dirty_count = 0;
        if (COMPUTE_GRAPH_DEBUG) { all_nodes.add(this); }
    }

    /**
     * Request update of this compute node. Pushes updates to children.
     */
    update() {
        if (this.inputs_dirty_count != 0) {
            return this;
        }
        if (this.dirty === 0) {
            return this;
        }
        if (COMPUTE_GRAPH_DEBUG) { node_debug_stack.push(this.name); }
        if (this.dirty == 2) {
            let calc_inputs = new Map();
            for (const input of this.inputs.values()) {
                if (input.node.dirty) {
                    if (COMPUTE_GRAPH_DEBUG) {
                        console.log(node_debug_stack);
                        console.log(this);
                    }
                    throw "Invalid compute graph state!";
                }
                calc_inputs.set(input.translation, input.node.value);
            }
            this.value = this.compute_func(calc_inputs);
        }
        this.dirty = 0;
        for (const child of this.children) {
            child.mark_input_clean(this.name, this.value);
        }
        if (COMPUTE_GRAPH_DEBUG) { node_debug_stack.pop(); }
        return this;
    }

    /**
     * Mark parent as not dirty. Propagates calculation if all inputs are present.
     */
    mark_input_clean(input_name, value) {
        if (value !== null || this.fail_cb) {
            const input = this.inputs.get(input_name);
            if (input.is_dirty) {
                input.is_dirty = false;
                this.inputs_dirty_count -= 1;
            }
            if (this.inputs_dirty_count === 0) {
                this.update();
            }
        }
    }

    mark_input_dirty(input_name) {
        const input = this.inputs.get(input_name);
        if (!input.is_dirty) {
            input.is_dirty = true;
            this.inputs_dirty_count += 1;
        }
    }

    mark_dirty(dirty_state=2) {
        if (this.dirty < dirty_state) {
            this.dirty = dirty_state;
            for (const child of this.children) {
                child.mark_input_dirty(this.name);
                child.mark_dirty(dirty_state);
            }
        }
        return this;
    }

    /**
     * Get value of this compute node. Can't trigger update cascades (push based update, not pull based.)
     */
    get_value() {
        return this.value
    }

    /**
     * Abstract method for computing something. Return value is set into this.value
     */
    compute_func(input_map) {
        throw "no compute func specified";
    }

    /**
     * Add link to a parent compute node, optionally with an alias.
     */
    link_to(parent_node, link_name) {
        const input = new NodeInput(parent_node, link_name);
        if (parent_node.dirty || (parent_node.value === null && !this.fail_cb)) {
            this.inputs_dirty_count += 1;
            input.is_dirty = true;
        }
        this.inputs.set(parent_node.name, input);
        parent_node.children.push(this);
        return this;
    }

    /**
     * Delete a link to a parent node.
     * TODO: time complexity of list deletion (not super relevant but it hurts my soul)
     */
    remove_link(parent_node) {
        const was_dirty = this.inputs.get(parent_node.name).is_dirty;
        this.inputs.delete(parent_node.name);
        if (was_dirty) {
            this.inputs_dirty_count -= 1;
        }

        const idx = parent_node.children.indexOf(this);
        parent_node.children.splice(idx, 1);
        return this;
    }
}

class ValueCheckComputeNode extends ComputeNode {
    constructor(name) { super(name); this.valid_val = null; }

    /**
     * Request update of this compute node. Pushes updates to children,
     * but only if this node's value changed.
     */
    update() {
        if (this.inputs_dirty_count != 0) {
            return this;
        }
        if (this.dirty === 0) {
            return this;
        }
        if (COMPUTE_GRAPH_DEBUG) { node_debug_stack.push(this.name); }

        let calc_inputs = new Map();
        for (const input of this.inputs.values()) {
            calc_inputs.set(input.translation, input.node.value);
        }
        let val = this.compute_func(calc_inputs);
        if (val !== null) {
            if (val !== this.valid_val) { super.mark_dirty(2); } // don't mark dirty if NULL (no update)
            this.valid_val = val;
        }
        this.value = val;
        this.dirty = 0;
        for (const child of this.children) {
            child.mark_input_clean(this.name, this.value);
        }
        if (COMPUTE_GRAPH_DEBUG) { node_debug_stack.pop(this.name); }
        return this;
    }

    /**
     * Defaulting to "dusty" state.
     */
    mark_dirty(dirty_state="unused") {
        return super.mark_dirty(1);
    }
}

let graph_live_update = false;
/**
 * Schedule a ComputeNode to be updated.
 *
 * @param node : ComputeNode to schedule an update for.
 */
function calcSchedule(node, timeout) {
    if (node.update_task !== null) {
        clearTimeout(node.update_task);
    }
    node.mark_dirty();
    node.update_task = setTimeout(function() {
        if (COMPUTE_GRAPH_DEBUG) { node_debug_stack = []; }
        graph_live_update = false;
        node.update();
        node.update_task = null;
        graph_live_update = true;
    }, timeout);
}

class PrintNode extends ComputeNode {

    constructor(name) {
        super(name);
        this.fail_cb = true;
    }

    compute_func(input_map) {
        console.log([this.name, input_map]);
        return null;
    }
}

/**
 * Node for getting an input from an input field.
 * Fires updates whenever the input field is updated.
 *
 * Signature: InputNode() => str
 */
class InputNode extends ValueCheckComputeNode {
    constructor(name, input_field) {
        super(name);
        this.input_field = input_field;
        this.input_field.addEventListener("input", () => { if (graph_live_update) calcSchedule(this, 500) } );
        this.input_field.addEventListener("change", () => { if (graph_live_update) calcSchedule(this, 5) } );
        //calcSchedule(this);  Manually fire first update for better control
    }

    compute_func(input_map) {
        return this.input_field.value;
    }
}

/**
 * Passthrough node for simple aggregation.
 * Unfortunately if you use this too much you get layers and layers of maps...
 *
 * Signature: PassThroughNode(**kwargs) => Map[...]
 */
class PassThroughNode extends ComputeNode {
    constructor(name) {
        super(name);
        this.breakout_nodes = new Map();
    }

    compute_func(input_map) {
        return input_map;
    }

    /**
     * Get a ComputeNode that will "break out" one part of this aggregation input.
     * There is some overhead to this operation because ComputeNode is not exactly a free abstraction... oof
     * Also you will recv updates whenever any input that is part of the aggregation changes even
     * if the specific sub-input didn't change.
     *
     * Parameters:
     *      sub-input: The key to listen to
     */
    get_node(sub_input) {
        if (this.breakout_nodes.has(sub_input)) {
            return this.breakout_nodes.get(sub_input);
        }
        const _name = this.name;
        const ret = new (class extends ComputeNode {
                constructor() { super('passthrough-'+_name+'-'+sub_input); }
                compute_func(input_map) { return input_map.get(_name).get(sub_input); }
            })().link_to(this);
        this.breakout_nodes.set(sub_input, ret);
        return ret;
    }
}
