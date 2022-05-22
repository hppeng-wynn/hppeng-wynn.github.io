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
        this.name = name;
        this.update_task = null;
        this.update_time = Date.now();
    }

    /***
     * Request update of this compute node. Pushes updates to children.
     */
    update(timestamp) {
        if (timestamp <= this.update_time) {
            return;
        }
        this.update_time = timestamp;

        let value_map = Map();
        for (const input of this.inputs) {
            value_map.set(input.name, input.get_value());
        }
        this.value = this.compute_func();
        for (const child of this.children) {
            child.update();
        }
    }

    /***
     * Get value of this compute node. Can't trigger update cascades (push based update, not pull based.)
     */
    get_value() {
        return this.value
    }

    /***
     * Abstract method for computing something. Return value is set into this.value
     */
    compute_func() {
        throw "no compute func specified";
    }

    link_to(parent_node) {
        this.inputs.push(parent_node)
        parent_node.children.push(this);
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
     * @param item_input_field: Input field (html element) to listen for item names from.
     * @param none_item: Item object to use as the "none" for this field.
     */
    constructor(name, item_input_field, none_item) {
        super(name);
        this.input_field.setAttribute("onInput", "calcSchedule('"+name+"');");
        this.input_field = item_input_field;
        this.none_item = none_item;
    }

    compute_func() {
        // built on the assumption of no one will type in CI/CR letter by letter

        let item_text = this.input_field.value;
        let item;

        if (item_text.slice(0, 3) == "CI-") {
            item = getCustomFromHash(item_text);
        }
        else if (item_text.slice(0, 3) == "CR-") {
            item = getCraftFromHash(item_text);
        } 
        else if (itemMap.has(item_text)) {
            item = itemMap.get(item_text);
        } 
        else if (tomeMap.has(item_text)) {
            item = tomeMap.get(item_text);
        }

        if (!item) {
            return this.none_item;
        }
        return item;
    }
}

