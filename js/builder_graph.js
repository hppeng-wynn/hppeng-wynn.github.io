

class BuildEncodeNode extends ComputeNode {
    constructor() {
        super("builder-encode");
    }

    compute_func(input_map) {
        if (input_map.size !== 1) { throw "BuildEncodeNode accepts exactly one input (build)"; }
        const [build] = input_map.values();  // Extract values, pattern match it into size one list and bind to first element
        return encodeBuild(build);
    }
}

class URLUpdateNode extends ComputeNode {
    constructor() {
        super("builder-url-update");
    }

    compute_func(input_map) {
        if (input_map.size !== 1) { throw "URLUpdateNode accepts exactly one input (build_str)"; }
        const [build_str] = input_map.values();  // Extract values, pattern match it into size one list and bind to first element
        location.hash = build_str;
    }
}

class BuildAssembleNode extends ComputeNode {
    constructor() {
        super("builder-make-build");
    }

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

class PowderInputNode extends InputNode {

    constructor(name, input_field) {
        super(name, input_field);
    }

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

class SpellDamageCalcNode extends ComputeNode {
    constructor(spell_num) {
        super("builder-spell"+spell_num+"-calc");
        this.spell_idx = spell_num;
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

let item_nodes = [];
let powder_nodes = [];
let spelldmg_nodes = [];

document.addEventListener('DOMContentLoaded', function() {
    // Bind item input fields to input nodes, and some display stuff (for auto colorizing stuff).
    for (const [eq, none_item] of zip(equipment_fields, none_items)) {
        let input_field = document.getElementById(eq+"-choice");
        let item_image = document.getElementById(eq+"-img");

        let item_input = new ItemInputNode(eq+'-input', input_field, none_item);
        item_nodes.push(item_input);
        new ItemInputDisplayNode(eq+'-display', input_field, item_image).link_to(item_input);
        //new PrintNode(eq+'-debug').link_to(item_input);
        //document.querySelector("#"+eq+"-tooltip").setAttribute("onclick", "collapse_element('#"+ eq +"-tooltip');"); //toggle_plus_minus('" + eq + "-pm'); 
    }

    // weapon image changer node.
    let weapon_image = document.getElementById("weapon-img");
    new WeaponDisplayNode('weapon-type', weapon_image).link_to(item_nodes[8]);

    // Level input node.
    let level_input = new InputNode('level-input', document.getElementById('level-choice'));

    // "Build" now only refers to equipment and level (no powders). Powders are injected before damage calculation / stat display.
    let build_node = new BuildAssembleNode();
    for (const input of item_nodes) {
        build_node.link_to(input);
    }
    build_node.link_to(level_input);


    for (const input of powder_inputs) {
        powder_nodes.push(new PowderInputNode(input, document.getElementById(input)));
    }

    for (let i = 0; i < 4; ++i) {
        let spell_node = new SpellSelectNode(i);
        spell_node.link_to(build_node, 'build');

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

    console.log("Set up graph");

    let masonry = Macy({
        container: "#masonry-container",
        columns: 1,
        mobileFirst: true,
        breakAt: {
            1200: 4,
        },
        margin: {
            x: 20,
            y: 20,
        } 
        
    });

    let search_masonry = Macy({
        container: "#search-results",
        columns: 1,
        mobileFirst: true,
        breakAt: {
            1200: 4,
        },
        margin: {
            x: 20,
            y: 20,
        }
        
    });
});

// autocomplete initialize
function init_autocomplete() {
    let dropdowns = new Map();
    for (const eq of equipment_keys) {
        if (tome_keys.includes(eq)) {
            continue;
        }
        // build dropdown
        let item_arr = [];
        if (eq == 'weapon') {
            for (const weaponType of weapon_keys) {
                for (const weapon of itemLists.get(weaponType)) {
                    let item_obj = itemMap.get(weapon);
                    if (item_obj["restrict"] && item_obj["restrict"] === "DEPRECATED") {
                        continue;
                    }
                    if (item_obj["name"] == 'No '+ eq.charAt(0).toUpperCase() + eq.slice(1)) {
                        continue;
                    }
                    item_arr.push(weapon);
                }
            }
        } else {
            for (const item of itemLists.get(eq.replace(/[0-9]/g, ''))) {
                let item_obj = itemMap.get(item);
                if (item_obj["restrict"] && item_obj["restrict"] === "DEPRECATED") {
                    continue;
                }
                if (item_obj["name"] == 'No '+ eq.charAt(0).toUpperCase() + eq.slice(1)) {
                    continue;
                }
                item_arr.push(item)
            }
        }

        // create dropdown
        dropdowns.set(eq, new autoComplete({
            data: {
                src: item_arr
            },
            selector: "#"+ eq +"-choice",
            wrapper: false,
            resultsList: {
                maxResults: 1000,
                tabSelect: true,
                noResults: true,
                class: "search-box dark-7 rounded-bottom px-2 fw-bold dark-shadow-sm",
                element: (list, data) => {
                    // dynamic result loc
                    let position = document.getElementById(eq+'-dropdown').getBoundingClientRect();
                    list.style.top = position.bottom + window.scrollY +"px";
                    list.style.left = position.x+"px";
                    list.style.width = position.width+"px";
                    list.style.maxHeight = position.height * 2 +"px";

                    if (!data.results.length) {
                        message = document.createElement('li');
                        message.classList.add('scaled-font');
                        message.textContent = "No results found!";
                        list.prepend(message);
                    }
                },
            },
            resultItem: {
                class: "scaled-font search-item",
                selected: "dark-5",
                element: (item, data) => {
                    item.classList.add(itemMap.get(data.value).tier);
                },
            },
            events: {
                input: {
                    selection: (event) => {
                        if (event.detail.selection.value) {
                            event.target.value = event.detail.selection.value;
                        }
                        event.target.dispatchEvent(new Event('input'));
                    },
                },
            }
        }));
    }

    for (const eq of tome_keys) {
        // build dropdown
        let tome_arr = [];
        for (const tome of tomeLists.get(eq.replace(/[0-9]/g, ''))) {
            let tome_obj = tomeMap.get(tome);
            if (tome_obj["restrict"] && tome_obj["restrict"] === "DEPRECATED") {
                continue;
            }
            //this should suffice for tomes - jank
            if (tome_obj["name"].includes('No ' + eq.charAt(0).toUpperCase())) {
                continue;
            }
            let tome_name = tome;
            tome_arr.push(tome_name);
        }

        // create dropdown
        dropdowns.set(eq, new autoComplete({
            data: {
                src: tome_arr
            },
            selector: "#"+ eq +"-choice",
            wrapper: false,
            resultsList: {
                maxResults: 1000,
                tabSelect: true,
                noResults: true,
                class: "search-box dark-7 rounded-bottom px-2 fw-bold dark-shadow-sm",
                element: (list, data) => {
                    // dynamic result loc
                    let position = document.getElementById(eq+'-dropdown').getBoundingClientRect();
                    list.style.top = position.bottom + window.scrollY +"px";
                    list.style.left = position.x+"px";
                    list.style.width = position.width+"px";
                    list.style.maxHeight = position.height * 2 +"px";

                    if (!data.results.length) {
                        message = document.createElement('li');
                        message.classList.add('scaled-font');
                        message.textContent = "No results found!";
                        list.prepend(message);
                    }
                },
            },
            resultItem: {
                class: "scaled-font search-item",
                selected: "dark-5",
                element: (tome, data) => {
                    tome.classList.add(tomeMap.get(data.value).tier);
                },
            },
            events: {
                input: {
                    selection: (event) => {
                        if (event.detail.selection.value) {
                            event.target.value = event.detail.selection.value;
                        }
                    },
                },
            }
        }));
    }

    let filter_loc = ["filter1", "filter2", "filter3", "filter4"];
    for (const i of filter_loc) {
        dropdowns.set(i+"-choice", new autoComplete({
            data: {
                src: sq2ItemFilters,
            },
            selector: "#"+i+"-choice",
            wrapper: false,
            resultsList: {
                tabSelect: true,
                noResults: true,
                class: "search-box dark-7 rounded-bottom px-2 fw-bold dark-shadow-sm",
                element: (list, data) => {
                    // dynamic result loc
                    console.log(i);
                    list.style.zIndex = "100";
                    let position = document.getElementById(i+"-dropdown").getBoundingClientRect();
                    window_pos = document.getElementById("search-container").getBoundingClientRect();
                    list.style.top = position.bottom - window_pos.top + 5 +"px";
                    list.style.left = position.x - window_pos.x +"px";
                    list.style.width = position.width+"px";

                    if (!data.results.length) {
                        message = document.createElement('li');
                        message.classList.add('scaled-font');
                        message.textContent = "No filters found!";
                        list.prepend(message);
                    }
                },
            },
            resultItem: {
                class: "scaled-font search-item",
                selected: "dark-5",
            },
            events: {
                input: {
                    selection: (event) => {
                        if (event.detail.selection.value) {
                            event.target.value = event.detail.selection.value;
                        }
                    },
                },
            }
        }));
    }
}
