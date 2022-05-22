class ComputeNode {
    /**
     * Make a generic compute node.
     * Adds the node to the global map of nodenames to nodes (for calling from html listeners).
     *
     * @param name : Name of the node (string). Must be unique. Must "fit in" a JS string (terminated by single quotes).
     */
    constructor(name) {
        this.inputs = [];
        this.children = [];
        this.value = 0;
        this.name = name;
        this.update_task = null;
        this.update_time = Date.now();
        this.fail_cb = false;   // Set to true to force updates even if parent failed.
    }

    /**
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
        this.value = this.compute_func(value_map);
        for (const child of this.children) {
            if (this.value || child.fail_cb) {
                child.update();
            }
        }
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

    link_to(parent_node) {
        this.inputs.push(parent_node)
        parent_node.children.push(this);
    }
}

/**
 * Schedule a ComputeNode to be updated.
 *
 * @param node : ComputeNode to schedule an update for.
 */
function calcSchedule(node) {
    if (node.update_task !== null) {
        clearTimeout(node.update_task);
    }
    node.update_task = setTimeout(function() {
        const timestamp = Date.now();
        node.update(timestamp);
        node.update_task = null;
    }, 500);
}

/**
 * Node for getting an item's stats from an item input field.
 */
class ItemInputNode extends ComputeNode {
    /**
     * Make an item stat pulling compute node.
     *
     * @param name: Name of this node.
     * @param item_input_field: Input field (html element) to listen for item names from.
     * @param none_item: Item object to use as the "none" for this field.
     */
    constructor(name, item_input_field, none_item) {
        super(name);
        this.input_field.setAttribute("input", () => calcSchedule(this));
        this.input_field = item_input_field;
        this.none_item = expandItem(none_item);
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
            item = Item(itemMap.get(item_text));
        } 
        else if (tomeMap.has(item_text)) {
            item = Item(tomeMap.get(item_text));
        }

        if (!item || item.statMap.get('type') !== this.none_item.statMap.get('type')) {
            return null;
        }
        return item;
    }
}

/**
 * Node for updating item input fields from parsed items.
 */
class ItemInputDisplayNode extends ComputeNode {

    constructor(name, item_input_field, item_image) {
        super(name);
        this.input_field = item_input_field;
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

        const tier = item.statMap.get('tier');
        this.input_field.classList.add(tier);
        this.image.classList.add(tier + "-shadow");
    }
}

/**
 * Change the weapon to match correct type.
 */
class WeaponDisplayNode extends ComputeNode {

    constructor(name, image_field) {
        super(name);
        this.image = image_field;
    }

    compute_func(input_map) {
        if (input_map.size !== 1) { throw "WeaponDisplayNode accepts exactly one input (item)"; }
        const [item] = input_map.values();  // Extract values, pattern match it into size one list and bind to first element

        const type = item.statMap.get('type');
        this.image_field.setAttribute('src', '../media/items/new/generic-'+type+'.png');
    }
}
