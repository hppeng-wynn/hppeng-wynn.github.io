let _ALL_NODES = new Map();

class ComputeNode {
    /***
     * Make a generic compute node.
     * Adds the node to the global map of nodenames to nodes (for calling from html listeners).
     *
     * @param name : Name of the node (string). Must be unique. Must "fit in" a JS string (terminated by single quotes).
     */
    constructor(name) {
        if (_ALL_NODES.has(name)) {
            throw 'Duplicate node name: ' + name;
        }
        _ALL_NODES.set(name, this)
        this.inputs = [];
        this.children = [];
        this.value = 0;
        this.compute_func = null;
        this.callback_func = null;
        this.name = name;
        this.update_task = null;
        this.update_time = Date.now();
    }

    update(timestamp) {
        if (timestamp < this.update_time) {
            return;
        }
        this.update_time = timestamp;

        let value_map = Map();
        for (const input of this.inputs) {
            value_map.set(input.name, input.get_value());
        }
        this.value = this.compute_func(this.value_map);
        for (const child of this.children) {
            child.update();
        }
        this.callback_func(this.value);
    }

    get_value() {
        return this.value
    }
}

/***
 * Schedule a ComputeNode to be updated.
 *
 * @param node_name : ComputeNode name to schedule an update for.
 */
function calcSchedule(node_name) {
    node = _ALL_NODES.get(node_name);
    if (node.update_task !== null) {
        clearTimeout(node.update_task);
    }
    node.update_task = setTimeout(function() {
        const timestamp = Date.now();
        node.update(timestamp);
        node.update_task = null;
    }, 500);
}

/***
 * Node for getting an item's stats from an item input field.
 */
class ItemStats extends ComputeNode {
    /***
     * Make an item stat pulling compute node.
     *
     * @param name: Name of this node.
     * @oaram item_input_field: Input field (html element) to listen for item names from.
     */
    constructor(name, item_input_field) {
        super(name);
        this.input_field.setAttribute("onInput", "calcSchedule('"+name+"');");
        this.input_field = item_input_field;
    }
}

