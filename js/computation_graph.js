class ComputeNode {
    /**
     * Make a generic compute node.
     * Adds the node to the global map of nodenames to nodes (for calling from html listeners).
     *
     * @param name : Name of the node (string). Must be unique. Must "fit in" a JS string (terminated by single quotes).
     */
    constructor(name) {
        this.inputs = [];   // parent nodes
        this.input_translation = new Map();
        this.children = [];
        this.value = null;
        this.name = name;
        this.update_task = null;
        this.update_time = Date.now();
        this.fail_cb = false;   // Set to true to force updates even if parent failed.
        this.dirty = true;
        this.inputs_dirty = new Map();
        this.inputs_dirty_count = 0;
    }

    /**
     * Request update of this compute node. Pushes updates to children.
     */
    update(timestamp) {
        if (timestamp <= this.update_time) {
            return;
        }
        this.update_time = timestamp;

        if (this.inputs_dirty_count != 0) {
            return;
        }
        let calc_inputs = new Map();
        for (const input of this.inputs) {
            calc_inputs.set(this.input_translation.get(input.name), input.value);
        }
        this.value = this.compute_func(calc_inputs);
        this.dirty = false;
        for (const child of this.children) {
            child.mark_input_clean(this.name, this.value, timestamp);
        }
    }

    /**
     * Mark parent as not dirty. Propagates calculation if all inputs are present.
     */
    mark_input_clean(input_name, value, timestamp) {
        if (value !== null || this.fail_cb) {
            if (this.inputs_dirty.get(input_name)) {
                this.inputs_dirty.set(input_name, false);
                this.inputs_dirty_count -= 1;
            }
            if (this.inputs_dirty_count === 0) {
                this.update(timestamp);
            }
        }
    }

    mark_input_dirty(input_name) {
        if (!this.inputs_dirty.get(input_name)) {
            this.inputs_dirty.set(input_name, true);
            this.inputs_dirty_count += 1;
        }
    }

    mark_dirty() {
        if (!this.dirty) {
            this.dirty = true;
            for (const child of this.children) {
                child.mark_input_dirty(this.name);
                child.mark_dirty();
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

    link_to(parent_node, link_name) {
        this.inputs.push(parent_node)
        link_name = (link_name !== undefined) ? link_name : parent_node.name;
        this.input_translation.set(parent_node.name, link_name);
        this.inputs_dirty.set(parent_node.name, parent_node.dirty);
        if (parent_node.dirty) {
            this.inputs_dirty_count += 1;
        }
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
    node.mark_dirty();
    node.update_task = setTimeout(function() {
        const timestamp = Date.now();
        node.update(timestamp);
        node.update_task = null;
    }, 500);
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
 */
class InputNode extends ComputeNode {
    constructor(name, input_field) {
        super(name);
        this.input_field = input_field;
        this.input_field.addEventListener("input", () => calcSchedule(this));
        calcSchedule(this);
    }

    compute_func(input_map) {
        return this.input_field.value;
    }
}

/**
 * Node for getting an item's stats from an item input field.
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

        if (item.statMap.has('NONE')) {
            return null;
        }
        const tier = item.statMap.get('tier');
        this.input_field.classList.add(tier);
        this.image.classList.add(tier + "-shadow");
        return null;
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
        this.image.setAttribute('src', '../media/items/new/generic-'+type+'.png');
    }
}
