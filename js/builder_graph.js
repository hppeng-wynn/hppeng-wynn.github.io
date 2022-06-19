

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
        console.log('build node run');
        return new Build(level, equipments, [], weapon);
    }
}

let item_nodes = [];

document.addEventListener('DOMContentLoaded', function() {
    for (const [eq, none_item] of zip(equipment_fields, none_items)) {
        let input_field = document.getElementById(eq+"-choice");
        let item_image = document.getElementById(eq+"-img");

        let item_input = new ItemInputNode(eq+'-input', input_field, none_item);
        item_nodes.push(item_input);
        new ItemInputDisplayNode(eq+'-display', input_field, item_image).link_to(item_input);
        new PrintNode(eq+'-debug').link_to(item_input);
        //document.querySelector("#"+eq+"-tooltip").setAttribute("onclick", "collapse_element('#"+ eq +"-tooltip');"); //toggle_plus_minus('" + eq + "-pm'); 

    }
    let weapon_image = document.getElementById("weapon-img");
    new WeaponDisplayNode('weapon-type', weapon_image).link_to(item_nodes[8]);
    let level_input = new InputNode('level-input', document.getElementById('level-choice'));
    new PrintNode('lvl-debug').link_to(level_input);

    let build_node = new BuildAssembleNode();
    for (const input of item_nodes) {
        build_node.link_to(input);
    }
    build_node.link_to(level_input);
    console.log("Set up graph");

});

// autocomplete initialize
function init_autocomplete() {
    console.log("autocomplete init");
    console.log(itemLists)
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
