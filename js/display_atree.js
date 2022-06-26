let atree_map;
let atree_connectors_map;
let atree_active_connections = [];
function construct_AT(elem, tree) {
    console.log("constructing ability tree UI");
    document.getElementById("atree-active").innerHTML = ""; //reset all atree actives - should be done in a more general way later
    elem.innerHTML = ""; //reset the atree in the DOM
    
    if (tree === undefined) {return false;}

    // add in the "Active" title to atree
    let active_row = document.createElement("div");
    active_row.classList.add("row", "item-title", "mx-auto", "justify-content-center");
    active_row.textContent = "Active:";
    document.getElementById("atree-active").appendChild(active_row);

    atree_map = new Map();
    atree_connectors_map = new Map()
    for (let i of tree) {
        atree_map.set(i.display_name, {display: i.display, parents: i.parents, connectors: new Map(), active: false});
    }

    for (let i = 0; i < tree.length; i++) {
        let node = tree[i];
        
        // create rows if not exist
        let missing_rows = [node.display.row];

        for (let parent of node.parents) {
            missing_rows.push(tree.find(object => {return object.display_name === parent;}).display.row);
        }
        for (let missing_row of missing_rows) {
            if (document.getElementById("atree-row-" + missing_row) == null) {
                for (let j = 0; j <= missing_row; j++) {
                    if (document.getElementById("atree-row-" + j) == null) {
                        let row = document.createElement('div');
                        row.classList.add("row");
                        row.id = "atree-row-" + j;
                        //was causing atree rows to be 0 height
                        row.style.minHeight = elem.scrollWidth / 9 + "px";
                        //row.style.minHeight = elem.getBoundingClientRect().width / 9 + "px";

                        for (let k = 0; k < 9; k++) {
                            col = document.createElement('div');
                            col.classList.add('col', 'px-0');
                            col.style.minHeight = elem.scrollWidth / 9 + "px";
                            row.appendChild(col);

                            atree_connectors_map.set(j + "," + k, [])
                        };
                        elem.appendChild(row);
                    };
                };
            };
        }


        // create connectors based on parent location
        for (let parent of node.parents) {
            atree_map.get(node.display_name).connectors.set(parent, []);

            let parent_node = atree_map.get(parent);

            let connect_elem = document.createElement("div");
            connect_elem.style = "background-size: cover; width: 100%; height: 100%;";
            // connect up
            for (let i = node.display.row - 1; i > parent_node.display.row; i--) {
                let connector = connect_elem.cloneNode();
                connector.style.backgroundImage = "url('../media/atree/connect_line.png')";
                atree_map.get(node.display_name).connectors.get(parent).push(i + "," + node.display.col);
                atree_connectors_map.get(i + "," + node.display.col).push({connector: connector, type: "line", owner: [node.display_name, parent]});
                resolve_connector(i + "," + node.display.col, node);
            }
            // connect horizontally
            let min = Math.min(parent_node.display.col, node.display.col);
            let max = Math.max(parent_node.display.col, node.display.col);
            for (let i = min + 1; i < max; i++) {
                let connector = connect_elem.cloneNode();
                connector.style.backgroundImage = "url('../media/atree/connect_line.png')";
                connector.classList.add("rotate-90");
                atree_map.get(node.display_name).connectors.get(parent).push(parent_node.display.row + "," + i);
                atree_connectors_map.get(parent_node.display.row + "," + i).push({connector: connector, type: "line", owner: [node.display_name, parent]});
                resolve_connector(parent_node.display.row + "," + i, node);
            }

            // connect corners

            if (parent_node.display.row != node.display.row && parent_node.display.col != node.display.col) {
                let connector = connect_elem.cloneNode();
                connector.style.backgroundImage = "url('../media/atree/connect_angle.png')";
                atree_map.get(node.display_name).connectors.get(parent).push(parent_node.display.row + "," + node.display.col);
                atree_connectors_map.get(parent_node.display.row + "," + node.display.col).push({connector: connector, type: "angle", owner: [node.display_name, parent]});
                if (parent_node.display.col > node.display.col) {
                    connector.classList.add("rotate-180");
                }
                else {// if (parent_node.display.col < node.display.col && (parent_node.display.row != node.display.row)) {
                    connector.classList.add("rotate-270");
                }
                resolve_connector(parent_node.display.row + "," + node.display.col, node);
            }
        }

        // create node
        let node_elem = document.createElement('div');
        let icon = node.display.icon;
        if (icon === undefined) {
            icon = "node";
        }
        node_elem.style = "background-image: url('../media/atree/"+icon+".png'); background-size: cover; width: 100%; height: 100%;";
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
        //was causing active element boxes to be 0 width 
        // active_tooltip.style.width = elem.getBoundingClientRect().width * .80 + "px";
        active_tooltip.style.display = "none";

        // tooltip text formatting

        let active_tooltip_title = document.createElement('b');
        active_tooltip_title.classList.add("scaled-font");
        active_tooltip_title.innerHTML = node.display_name;

        let active_tooltip_text = document.createElement('p');
        active_tooltip_text.classList.add("scaled-font-sm");
        active_tooltip_text.textContent = node.desc;

        active_tooltip.appendChild(active_tooltip_title);
        active_tooltip.appendChild(active_tooltip_text);

        node_tooltip = active_tooltip.cloneNode(true);

        active_tooltip.id = "atree-ab-" + node.display_name.replaceAll(" ", "");

        node_tooltip.style.position = "absolute";
        node_tooltip.style.zIndex = "100";

        node_elem.appendChild(node_tooltip);
        document.getElementById("atree-active").appendChild(active_tooltip);

        node_elem.addEventListener('click', function(e) {
            if (e.target !== this) {return;}
            let tooltip = document.getElementById("atree-ab-" + node.display_name.replaceAll(" ", ""));
            if (tooltip.style.display == "block") {
                tooltip.style.display = "none";
                this.classList.remove("atree-selected");
            } 
            else {
                tooltip.style.display = "block";
                this.classList.add("atree-selected");
            }
            atree_toggle_state(node);
            atree_update_connector(node);
        });
        document.getElementById("atree-row-" + node.display.row).children[node.display.col].appendChild(node_elem);
    };

    atree_render_connection();
};

// resolve connector conflict
function resolve_connector(pos, node) {
    if (atree_connectors_map.get(pos).length < 2) {return false;}

    let line = false;
    let angle = false;
    let t = false;
    let owners = [];
    for (let i of atree_connectors_map.get(pos)) {
        if (i.type == "line") {
            line = true;
        } else if (i.type == "angle") {
            angle = true;
        } else if (i.type == "t") {
            t = true;
        }
        owners = owners.concat(i.owner);
    }

    owners = [...new Set(owners)]

    let connect_elem = document.createElement("div");

    if ((line && angle)) {
        connect_elem.style = "background-image: url('../media/atree/connect_t.png'); background-size: cover; width: 100%; height: 100%;";
        atree_connectors_map.set(pos, [{connector: connect_elem, type: "t", owner: owners, connector_state: {up: 0, left: 0, right: 0, down: 0}}]);
    }
    if (node.parents.length == 3 && t && atree_same_row(node)) {
        connect_elem.style = "background-image: url('../media/atree/connect_c.png'); background-size: cover; width: 100%; height: 100%;";
        atree_connectors_map.set(pos, [{connector: connect_elem, type: "c", owner: owners, connector_state: {up: 0, left: 0, right: 0, down: 0}}]);
    }
    // override the conflict with the first children
    atree_connectors_map.set(pos, [atree_connectors_map.get(pos)[0]]);
    atree_connectors_map.get(pos)[0].owner = owners;
}

// check if a node doesn't have same row w/ its parents (used to solve conflict)
function atree_same_row(node) {
    for (let i of node.parents) {
        if (node.display.row == atree_map.get(i).display.row) { return false; }
    }
    return true;
}

// draw the connector onto the screen
function atree_render_connection() {
    for (let i of atree_connectors_map.keys()) {
        if (atree_connectors_map.get(i).length != 0) {
            document.getElementById("atree-row-" + i.split(",")[0]).children[i.split(",")[1]].appendChild(atree_connectors_map.get(i)[0].connector);
        }
    }
}

function atree_toggle_state(node) {
    if (atree_map.get(node.display_name).active) {
        atree_map.get(node.display_name).active = false;
    } else {
        atree_map.get(node.display_name).active = true;
    }
}

function atree_update_connector() {
    atree_map.forEach((v) => {
        atree_compute_highlight(v);
    });
}

function atree_compute_highlight(node) {
    node.connectors.forEach((v, k) => {
        console.log(node.active);
        if (node.active && atree_map.get(k).active) {
            for (let i of v) {
                connector_data = atree_connectors_map.get(i)[0];
                if (connector_data.type == "c" || connector_data.type == "t") {
                    connector_data.connector_state = atree_get_state(i);
                    let connector_img = atree_parse_connector(connector_data.connector_state, connector_data.type)
                    connector_data.connector.className = "";
                    connector_data.connector.classList.add("rotate-" + connector_img.rotate);
                    connector_data.connector.style.backgroundImage = "url('../media/atree/highlight_" + connector_data.type + connector_img.attrib + ".png')";
                } else {
                    connector_data.connector.style.backgroundImage = "url('../media/atree/highlight_" + connector_data.type + ".png')";
                }
            } 
        } else {
            for (let i of v) {
                connector_data = atree_connectors_map.get(i)[0];
                if (connector_data.type == "c" || connector_data.type == "t") {
                    connector_data.connector_state = atree_get_state(i);
                    let connector_img = atree_parse_connector(connector_data.connector_state, connector_data.type)
                    if (!connector_img) {
                        connector_data.connector.className = "";
                        connector_data.connector.style.backgroundImage = "url('../media/atree/connect_" + connector_data.type + ".png')";
                    } else {
                        connector_data.connector.className = "";
                        connector_data.connector.classList.add("rotate-" + connector_img.rotate);
                        connector_data.connector.style.backgroundImage = "url('../media/atree/highlight_" + connector_data.type + connector_img.attrib + ".png')";
                    };
                } else {
                    connector_data.connector.style.backgroundImage = "url('../media/atree/connect_" + connector_data.type + ".png')";
                }
            } 
        }
    });
}

function atree_get_state(connector) {
    let connector_state = {left: 0, right: 0, up: 0, down: 0}

    for (let abil_name of atree_connectors_map.get(connector)[0].owner) {
        state = atree_map.get(abil_name).active;
        if (atree_map.get(abil_name).display.col > parseInt(connector.split(",")[1])) {
            if (state) {
                connector_state.right = 1;
            } else {
                connector_state.right = 0;
            }
        }
        if (atree_map.get(abil_name).display.col < parseInt(connector.split(",")[1])) {
            if (state) {
                connector_state.left = 1;
            } else {
                connector_state.left = 0;
            }
        }
        if (atree_map.get(abil_name).display.row < parseInt(connector.split(",")[0])) {
            if (state) {
                connector_state.up = 1;
            } else {
                connector_state.up = 0;
            }
        }
        if (atree_map.get(abil_name).display.row > parseInt(connector.split(",")[0])) {
            if (state) {
                connector_state.down = 1;
            } else {
                connector_state.down = 0;
            }
        }
    }
    return connector_state;
}

function atree_parse_connector(orient, type) {
    // left, right, up, down
    // todo 
    let connector_dict = {
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
    }

    let res = ""    
    for (let i in orient) {
        res += orient[i];
    }

    return connector_dict[res];
}
