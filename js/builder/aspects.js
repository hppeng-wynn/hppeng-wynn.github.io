let aspect_inputs = [];
let aspect_agg_node;
const aspect_tiers = ["Legendary", "Fabled", "Mythic"] // @TODO(orgold): Move to constants file

// HACK(@orgold): The autocomplete package doesn't have any nice API for dynamically
// populating the result list, therefore we must store the context themselves to avoid
// recreating them on any weapon input.
//
// If the weapon was kept as state somewhere along the way, we could have the data.src
// be a function that picks off that, but because we don't tend to store build state outside
// of computegraph we don't have that luxury.
let aspect_inputs_dropdowns_ctx = new Map(); // Map<className, autoCompleteJs>
let active_aspects = null; // Map<AspectName, AspecSpec>

/**
 * Populate the aspect autocomplete list dynamically based on the choice of weapon.
 *
 * Signature: AspectAutocompleteInitNode() => null
 */
class AspectAutocompleteInitNode extends ComputeNode {
    constructor(name, input_field) {
        super(name);
        this.input_field = input_field;
    }

    compute_func(input_map) {
        const active_class = input_map.get("player-class");
        if (active_class === null) return;

        active_aspects = aspect_map.get(active_class);
        const class_aspect_names = active_aspects.keys().toArray();

        if (!aspect_inputs_dropdowns_ctx.has(this.name)) {
            aspect_inputs_dropdowns_ctx.set(this.name, create_autocomplete(class_aspect_names, active_aspects, this.input_field, v => v));
        } else {
            // This is a janky way of manually editing the data of the inner to make dynamic autocomplete lists
            const autocomplete_ctx = aspect_inputs_dropdowns_ctx.get(this.name);
            autocomplete_ctx.data.src = class_aspect_names;
            autocomplete_ctx.resultItem.element = (item, data) => {
                item.classList.add(active_aspects.get(data.value).tier);
            }
        }
    }
}

/**
 * A node to validate and fetch aspects from a linked aspect input field
 *
 * Signature: AspectInputNode(input_field) => AspectSpec
 */
class AspectInputNode extends InputNode {
    compute_func(input_map) {
        if (this.input_field.value === "" || active_aspects === null) return none_aspect;
        return active_aspects.get(this.input_field.value);
    }
}

/**
 * Get a specific tier from the aspect given aspect.
 * defaults to the max tier.
 *
 * Signature: AspectInputNode(input_field) => AspectTierSpec
 */
class AspectTierInputNode extends InputNode {
    compute_func(input_map) {
        const aspect = input_map.get("aspect-spec");
        if (!aspect || aspect.NONE) {
            this.input_field.value = "";
            return none_aspect;
        }

        const tier_num = this.input_field.value;
        if (tier_num == "" || tier_num <= 0 || tier_num > aspect.tiers.length) {
            this.input_field.value = input_map.get("aspect-spec").tiers.length;
        }
        return aspect.tiers[this.input_field.value - 1];
    }
}

/**
 * Aggregate all aspects into a single array.
 * The order of the array is irrelevant.
 *
 * Signature: AspectAggregateNode() => Array<AspectTierSpec> 
 */
class AspectAggregateNode extends ComputeNode {
    compute_func(input_map) {
        const aspects = [];
        for (const [i, field] of Object.entries(aspect_fields)) {
            if (input_map.get(field+"-tiered").NONE) continue;
            aspects.push(input_map.get(field+"-tiered"));
        }
        console.log(aspects);
        return aspects;
    }
}

/**
 * Display the image and color of the aspect based on it's tier.
 *
 * Signature: AspectInputDisplayNode(name, input_field, image_div) => null
 */
class AspectInputDisplayNode extends ComputeNode {
    constructor(name, input_field, image_div) {
        super(name);
        this.input_field = input_field;
        this.image_div = image_div;
    }

    compute_func(input_map) {
        const aspect = input_map.get("aspect-spec");
        this.input_field.classList.remove(...aspect_tiers); 
        this.image_div.classList.remove(...["aspect-image-Legendary", "aspect-image-Fabled", "aspect-image-Mythic", "aspect-image-None", "Legendary-shadow", "Fabled-shadow", "Mythic-shadow"]);
        if (aspect && !aspect.NONE) { 
            this.input_field.classList.add(aspect.tier); 
            this.image_div.classList.add("aspect-image-" + aspect.tier);
            this.image_div.classList.add(aspect.tier + "-shadow");
        }
        else {
            this.image_div.classList.add("aspect-image-None");
        }
    }
}
