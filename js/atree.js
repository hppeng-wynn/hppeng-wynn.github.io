let abil_points_current;

/**
 * Update ability tree internal representation. (topologically sorted node list)
 *
 * Signature: AbilityTreeUpdateNode(build: Build) => ATree
 */
const atree_node = new (class extends ComputeNode {
    constructor() { super('builder-atree-update'); }

    compute_func(input_map) {
        if (input_map.size !== 1) { throw "AbilityTreeUpdateNode accepts exactly one input (build)"; }
        const [build] = input_map.values();  // Extract values, pattern match it into size one list and bind to first element

        const atree_raw = atrees[wep_to_class.get(build.weapon.statMap.get('type'))];
        if (!atree_raw) return null;

        let atree_map = new Map();
        let atree_head;
        for (const i of atree_raw) {
            atree_map.set(i.id, {children: [], node: i});
            if (i.parents.length == 0) {
                // Assuming there is only one head.
                atree_head = atree_map.get(i.id);
            }
        }
        for (const i of atree_raw) {
            let node = atree_map.get(i.id);
            let parents = [];
            for (const parent_id of node.node.parents) {
                let parent_node = atree_map.get(parent_id);
                parent_node.children.push(node);
                parents.push(parent_node);
            }
            node.parents = parents;
        }

        let atree_topo_sort = [];
        topological_sort_tree(atree_head, atree_topo_sort, new Map());
        atree_topo_sort.reverse();
        return atree_topo_sort;
    }
})();

/**
 * Display ability tree from topologically sorted list.
 *
 * Signature: AbilityTreeRenderNode(atree: ATree) => null
 */
const atree_render = new (class extends ComputeNode {
    constructor() { super('builder-atree-render'); this.fail_cb = true; }

    compute_func(input_map) {
        if (input_map.size !== 1) { throw "AbilityTreeRenderNode accepts exactly one input (atree)"; }
        const [atree] = input_map.values();  // Extract values, pattern match it into size one list and bind to first element
        
        //for some reason we have to cast to string 
        if (atree) { render_AT(document.getElementById("atree-ui"), document.getElementById("atree-active"), atree); }

        if (document.getElementById("toggle-atree").classList.contains("toggleOn")) {
            toggle_tab('atree-dropdown'); 
            toggleButton('toggle-atree');
        }
    }
})();

atree_render.link_to(atree_node);

/**
 * Create a reverse topological sort of the tree in the result list.
 *
 * https://en.wikipedia.org/wiki/Topological_sorting
 * @param tree: Root of tree to sort
 * @param res: Result list (reverse topological order)
 * @param mark_state: Bookkeeping. Call with empty Map()
 */
function topological_sort_tree(tree, res, mark_state) {
    const state = mark_state.get(tree);
    if (state === undefined) {
        // unmarked.
        mark_state.set(tree, false);    // temporary mark
        for (const child of tree.children) {
            topological_sort_tree(child, res, mark_state);
        }
        mark_state.set(tree, true);     // permanent mark
        res.push(tree);
    }
    // these cases are not needed. Case 1 does nothing, case 2 should never happen.
    // else if (state === true) {
    //     // permanent mark.
    //     return;
    // }
    // else if (state === false) {
    //     // temporary mark.
    // }
}


/** The main function for rendering an ability tree. 
 * 
 * @param {Element} UI_elem - the DOM element to draw the atree within.
 * @param {Element} list_elem - the DOM element to list selected abilities within.
 * @param {*} tree - the ability tree to work with.
 */
function render_AT(UI_elem, list_elem, tree) {
    console.log("constructing ability tree UI");
    list_elem.innerHTML = ""; //reset all atree actives - should be done in a more general way later
    UI_elem.innerHTML = ""; //reset the atree in the DOM

    // add in the "Active" title to atree
    let active_row = document.createElement("div");
    active_row.classList.add("row", "item-title", "mx-auto", "justify-content-center");
    abil_points_current = 0;
    let active_word = document.createElement("div");
    active_word.classList.add("col-auto");
    active_word.textContent = "Active Abilities:";

    let active_AP_container = document.createElement("div");
    active_AP_container.classList.add("col-auto");

    let active_AP_subcontainer = document.createElement("div");
    active_AP_subcontainer.classList.add("row");

    let active_AP_cost = document.createElement("div");
    active_AP_cost.classList.add("col-auto", "mx-0", "px-0");
    active_AP_cost.id = "active_AP_cost";
    active_AP_cost.textContent = "0";
    let active_AP_slash = document.createElement("div");
    active_AP_slash.classList.add("col-auto", "mx-0", "px-0");
    active_AP_slash.textContent = "/";
    let active_AP_cap = document.createElement("div");
    active_AP_cap.classList.add("col-auto", "mx-0", "px-0");
    active_AP_cap.id = "active_AP_cap";
    active_AP_cap.textContent = "45";
    let active_AP_end = document.createElement("div");
    active_AP_end.classList.add("col-auto", "mx-0", "px-0");
    active_AP_end.textContent = " AP";

    //I can't believe we can't pass in multiple children at once
    active_AP_subcontainer.appendChild(active_AP_cost);
    active_AP_subcontainer.appendChild(active_AP_slash);
    active_AP_subcontainer.appendChild(active_AP_cap);
    active_AP_subcontainer.appendChild(active_AP_end);
    active_AP_container.appendChild(active_AP_subcontainer);

    active_row.appendChild(active_word);
    active_row.appendChild(active_AP_container);
    list_elem.appendChild(active_row);

    let atree_map = new Map();
    let atree_connectors_map = new Map()
    let max_row = 0;
    for (const i of tree) {
        atree_map.set(i.node.id, {node: i.node, connectors: new Map(), active: false});
        if (i.node.display.row > max_row) {
            max_row = i.node.display.row;
        }
    }
    // Copy graph structure.
    for (const i of tree) {
        let node_wrapper = atree_map.get(i.node.id);
        node_wrapper.parents = [];
        node_wrapper.children = [];
        for (const parent of i.parents) {
            node_wrapper.parents.push(atree_map.get(parent.node.id));
        }
        for (const child of i.children) {
            node_wrapper.children.push(atree_map.get(child.node.id));
        }
    }

    // Setup grid.
    for (let j = 0; j <= max_row; j++) {
        let row = document.createElement('div');
        row.classList.add("row");
        row.id = "atree-row-" + j;

        for (let k = 0; k < 9; k++) {
            col = document.createElement('div');
            col.classList.add('col', 'px-0');
            row.appendChild(col);
        }
        UI_elem.appendChild(row);
    }

    for (const _node of tree) {
        let node_wrap = atree_map.get(_node.node.id);
        let node = _node.node;

        // create connectors based on parent location
        for (let parent of node_wrap.parents) {
            node_wrap.connectors.set(parent, []);

            let parent_node = parent.node;
            const parent_id = parent_node.id;

            let connect_elem = document.createElement("div");
            connect_elem.style = "background-size: cover; width: 100%; height: 100%;";
            // connect up
            for (let i = node.display.row - 1; i > parent_node.display.row; i--) {
                let connector = connect_elem.cloneNode();
                node_wrap.connectors.get(parent).push(i + "," + node.display.col);
                resolve_connector(atree_connectors_map, i + "," + node.display.col, {connector: connector, connections: [0, 0, 1, 1]});
            }
            // connect horizontally
            let min = Math.min(parent_node.display.col, node.display.col);
            let max = Math.max(parent_node.display.col, node.display.col);
            for (let i = min + 1; i < max; i++) {
                let connector = connect_elem.cloneNode();
                node_wrap.connectors.get(parent).push(parent_node.display.row + "," + i);
                resolve_connector(atree_connectors_map, parent_node.display.row + "," + i, {connector: connector, connections: [1, 1, 0, 0]});
            }

            // connect corners
            if (parent_node.display.row != node.display.row && parent_node.display.col != node.display.col) {
                let connector = connect_elem.cloneNode();
                node_wrap.connectors.get(parent).push(parent_node.display.row + "," + node.display.col);
                let connections = [0, 0, 0, 1];
                if (parent_node.display.col > node.display.col) {
                    connections[1] = 1;
                }
                else {// if (parent_node.display.col < node.display.col && (parent_node.display.row != node.display.row)) {
                    connections[0] = 1;
                }
                resolve_connector(atree_connectors_map, parent_node.display.row + "," + node.display.col, {connector: connector, connections: connections});
            }
        }

        // create node
        let node_elem = document.createElement('div');
        let icon = node.display.icon;
        if (icon === undefined) {
            icon = "node";
        }
        let node_img = document.createElement('img');
        node_img.src = '../media/atree/'+icon+'.png';
        node_img.style = "width: 100%; height: 100%;";
        node_elem.appendChild(node_img);
        node_elem.classList.add("atree-circle");

        // add tooltip
        node_elem.addEventListener('mouseover', function(e) {
            if (e.target !== this) {return;}
            let tooltip = this.children[0];
            tooltip.style.top = this.getBoundingClientRect().bottom + window.scrollY * 1.02 + "px";
            tooltip.style.left = this.parentElement.parentElement.getBoundingClientRect().left + (elem.getBoundingClientRect().width * .2 / 2) + "px";
            tooltip.style.display = "block";
        });

        node_elem.addEventListener('mouseout', function(e) {
            if (e.target !== this) {return;}
            let tooltip = this.children[0];
            tooltip.style.display = "none";
        });

        node_elem.classList.add("fake-button");

        let active_tooltip = document.createElement('div');
        active_tooltip.classList.add("rounded-bottom", "dark-4", "border", "p-0", "mx-2", "my-4", "dark-shadow");
        active_tooltip.style.display = "none";

        // tooltip text formatting

        let active_tooltip_title = document.createElement('b');
        active_tooltip_title.classList.add("scaled-font");
        active_tooltip_title.innerHTML = node.display_name;

        let active_tooltip_desc = document.createElement('p');
        active_tooltip_desc.classList.add("scaled-font-sm", "my-0", "mx-1", "text-wrap");
        active_tooltip_desc.textContent = node.desc;

        let active_tooltip_cost = document.createElement('p');
        active_tooltip_cost.classList.add("scaled-font-sm", "my-0", "mx-1", "text-start");
        active_tooltip_cost.textContent = "Cost: " + node.cost + " AP";

        active_tooltip.appendChild(active_tooltip_title);
        active_tooltip.appendChild(active_tooltip_desc);
        active_tooltip.appendChild(active_tooltip_cost);

        node_tooltip = active_tooltip.cloneNode(true);

        active_tooltip.id = "atree-ab-" + node.id;

        node_tooltip.style.position = "absolute";
        node_tooltip.style.zIndex = "100";

        node_elem.appendChild(node_tooltip);
        list_elem.appendChild(active_tooltip);

        node_elem.addEventListener('click', function(e) {
            if (e.target !== this && e.target!== this.children[0]) {return;}
            let tooltip = document.getElementById("atree-ab-" + node.id);
            if (tooltip.style.display == "block") {
                tooltip.style.display = "none";
                this.classList.remove("atree-selected");
                abil_points_current -= node.cost;
            } 
            else {
                tooltip.style.display = "block";
                this.classList.add("atree-selected");
                abil_points_current += node.cost;
            };
            document.getElementById("active_AP_cost").textContent = abil_points_current;
            atree_toggle_state(atree_connectors_map, node_wrap);
        });

        // add tooltip

        node_elem.addEventListener('mouseover', function(e) {
            if (e.target !== this && e.target!== this.children[0]) {return;}
            let tooltip = this.children[this.children.length - 1];
            tooltip.style.top = this.getBoundingClientRect().bottom + window.scrollY * 1.02 + "px";
            tooltip.style.left = this.parentElement.parentElement.getBoundingClientRect().left + (elem.getBoundingClientRect().width * .2 / 2) + "px";
            tooltip.style.maxWidth = UI_elem.getBoundingClientRect().width * .95 + "px";
            tooltip.style.display = "block";
        });

        node_elem.addEventListener('mouseout', function(e) {
            if (e.target !== this && e.target!== this.children[0]) {return;}
            let tooltip = this.children[this.children.length - 1];
            tooltip.style.display = "none";
        });

        document.getElementById("atree-row-" + node.display.row).children[node.display.col].appendChild(node_elem);
    };
    console.log(atree_connectors_map);
    atree_render_connection(atree_connectors_map);
};

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
    const connections = connector_info.connections;
    const connector_elem = connector_info.connector;
    if (connections[2]) {
        if (connections[0]) {
            connector_info.type = 'c'; // cross
            return;
        }
        connector_info.type = 'line';   // vert line
        return;
    }
    if (connections[3]) {   // if down:
        if (connections[0] && connections[1]) {
            connector_info.type = 't';   // all 3 t
            return;
        }
        connector_info.type = 'angle';   // elbow
        if (connections[1]) {
            connector_elem.classList.add("rotate-180");
        }
        else {
            connector_elem.classList.add("rotate-270");
        }
        return;
    }
    connector_info.type = 'line';   // horiz line
    connector_elem.classList.add("rotate-90");
}

// draw the connector onto the screen
function atree_render_connection(atree_connectors_map) {
    for (let i of atree_connectors_map.keys()) {
        let connector_info = atree_connectors_map.get(i);
        let connector_elem = connector_info.connector;
        let connector_img = document.createElement('img');
        set_connector_type(connector_info);
        connector_img.src = '../media/atree/connect_'+connector_info.type+'.png';
        connector_img.style = "width: 100%; height: 100%;"
        connector_elem.replaceChildren(connector_img);
        connector_info.highlight = [0, 0, 0, 0];
        console.log(i + ", " + connector_info.type);
        let target_elem = document.getElementById("atree-row-" + i.split(",")[0]).children[i.split(",")[1]];
        if (target_elem.children.length != 0) {
            // janky special case...
            connector_elem.style.display = 'none';
        }
        target_elem.appendChild(connector_elem);
    };
};

// toggle the state of a node.
function atree_toggle_state(atree_connectors_map, node_wrapper) {
    let node = node_wrapper.node;
    const new_state = !node_wrapper.active;
    node_wrapper.active = new_state
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

// refresh all connector to default state, then try to calculate the connector for all node
function atree_update_connector() {
    atree_connectors_map.forEach((v) => {
        if (v.length != 0) {
            let connector_elem = document.createElement("img");
            connector_elem.style = "width: 100%; height: 100%;";
            connector_elem.src = '../media/atree/connect_' + v[0].type + '.png'
            v[0].replaceChildren(connector_elem);
        }
    });
    atree_map.forEach((v) => {
        atree_compute_highlight(v);
    });
}

function atree_set_edge(atree_connectors_map, parent, child, state) {
    const connectors = child.connectors.get(parent);
    const parent_row = parent.node.display.row;
    const parent_col = parent.node.display.col;
    const child_row = child.node.display.row;
    const child_col = child.node.display.col;

    let state_delta = (state ? 1 : -1);
    let child_side_idx = (parent_col > child_col ? 0 : 1);
    let parent_side_idx = 1 - child_side_idx;
    for (const connector_label of connectors) {
        let connector_info = atree_connectors_map.get(connector_label);
        let connector_elem = connector_info.connector;
        let highlight_state = connector_info.highlight; // left right up down
        let connector_img_elem = document.createElement("img");
        connector_img_elem.style = "width: 100%; height: 100%;";
        const ctype = connector_info.type;
        if (ctype === 't' || ctype === 'c') {
            // c, t
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

            let render_state = highlight_state.map(x => (x > 0 ? 1 : 0));

            let connector_img = atree_parse_connector(render_state, ctype);
            connector_img_elem.src = connector_img.img
            connector_elem.className = "";
            connector_elem.classList.add("rotate-" + connector_img.rotate);
            connector_elem.replaceChildren(connector_img_elem);
            continue;
        }
        // lol bad overloading, [0] is just the whole state
        highlight_state[0] += state_delta;
        if (highlight_state[0] > 0) {
            connector_img_elem.src = '../media/atree/highlight_'+ctype+'.png';
            connector_elem.replaceChildren(connector_img_elem);
        }
        else {
            connector_img_elem.src = '../media/atree/connect_'+ctype+'.png';
            connector_elem.replaceChildren(connector_img_elem);
        }
    }
}

// parse a sequence of left, right, up, down to appropriate connector image
function atree_parse_connector(orient, type) {
    // left, right, up, down

    let c_connector_dict = {
        "1100": {attrib: "_2_l", rotate: 0},
        "1010": {attrib: "_2_a", rotate: 0},
        "1001": {attrib: "_2_a", rotate: 270},
        "0110": {attrib: "_2_a", rotate: 90},
        "0101": {attrib: "_2_a", rotate: 180},
        "0011": {attrib: "_2_l", rotate: 90},
        "1110": {attrib: "_3", rotate: 0},
        "1101": {attrib: "_3", rotate: 180},
        "1011": {attrib: "_3", rotate: 270},
        "0111": {attrib: "_3", rotate: 90},
        "1111": {attrib: "", rotate: 0}
    };

    let t_connector_dict = {
        "1100": {attrib: "_2_l", rotate: 0},
        "1001": {attrib: "_2_a", rotate: "flip"},
        "0101": {attrib: "_2_a", rotate: 0},
        "1101": {attrib: "_3", rotate: 0}
    };

    let res = "";  
    for (let i of orient) {
        res += i;
    }
    if (res === "0000") {
        return {img: "../media/atree/connect_" + type + ".png", rotate: 0};
    }

    let ret;
    if (type == "c") {
        ret = c_connector_dict[res];
    } else {
        ret = t_connector_dict[res];
    };
    ret.img = "../media/atree/highlight_" + type + ret.attrib + ".png";
    return ret;
};
