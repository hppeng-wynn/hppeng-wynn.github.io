
class ComputeNode() {
    constructor(name) {
        this.inputs = [];
        this.children = [];
        this.value = 0;
        this.compute_func = null;
        this.callback_func = null;
        this.name = name;
    }

    update() {
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
