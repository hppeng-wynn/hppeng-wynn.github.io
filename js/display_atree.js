// placeholder name, follow new schema
function construct_AT(elem, tree) {
    console.log("constructing ability tree UI");
    document.getElementById("atree-active").innerHTML = ""; //reset all atree actives - should be done in a more general way later
    elem.innerHTML = ""; //reset the atree in the DOM

    // add in the "Active" title to atree
    let active_row = document.createElement("div");
    active_row.classList.add("row", "item-title", "mx-auto", "justify-content-center");
    active_row.textContent = "Active:";
    document.getElementById("atree-active").appendChild(active_row);

    for (let i = 0; i < tree.length; i++) {
        let node = tree[i];
        
        // create rows if not exist
        if (document.getElementById("atree-row-" + node.display.row) == null) {
            for (let j = 0; j <= node.display.row; j++) {
                if (document.getElementById("atree-row-" + j) == null) {
                    let row = document.createElement('div');
                    row.classList.add("row");
                    row.id = "atree-row-" + j;
                    //was causing atree rows to be 0 height
                    console.log(elem.scrollWidth / 9);
                    row.style.minHeight = elem.scrollWidth / 9 + "px";
                    //row.style.minHeight = elem.getBoundingClientRect().width / 9 + "px";


                    for (let k = 0; k < 9; k++) {
                        col = document.createElement('div');
                        col.classList.add('col', 'px-0');
                        col.style.minHeight = elem.scrollWidth / 9 + "px";
                        row.appendChild(col);
                    };
                    elem.appendChild(row);
                };
            };
        };

        let connector_list = []
        // create connectors based on parent location
        for (let parent of node.parents) {
            let parent_node = tree.find(object => {
                return object.display_name === parent;
            });

            let connect_elem = document.createElement("div");
            connect_elem.style = "background-size: cover; width: 100%; height: 100%;";
            // connect up
            for (let i = node.display.row - 1; i > parent_node.display.row; i--) {
                let connector = connect_elem.cloneNode()
                connector.style.backgroundImage = "url('../media/atree/connect_line.png')";
                connector.id = "r" + i + "-c" + node.display.col + "-line"
                document.getElementById("atree-row-" + i).children[node.display.col].appendChild(connector);
                resolve_connector(document.getElementById("atree-row-" + i).children[node.display.col]);
            }
            // connect horizontally
            let min = Math.min(parent_node.display.col, node.display.col);
            let max = Math.max(parent_node.display.col, node.display.col);
            for (let i = min + 1; i < max; i++) {
                let connector = connect_elem.cloneNode()
                connector.style.backgroundImage = "url('../media/atree/connect_line.png')";
                connector.classList.add("rotate-90");
                connector.id = "r" + parent_node.display.row + "-c" + i + "-line"
                document.getElementById("atree-row-" + parent_node.display.row).children[i].appendChild(connector); 
                resolve_connector(document.getElementById("atree-row-" + parent_node.display.row).children[i]);
            }

            // connect corners

            if (parent_node.display.row != node.display.row && parent_node.display.col != node.display.col) {
                let connector = connect_elem.cloneNode()
                connector.style.backgroundImage = "url('../media/atree/connect_angle.png')";
                connector.id = "r" + parent_node.display.row + "-c" + node.display.col + "-angle"
                document.getElementById("atree-row-" + parent_node.display.row).children[node.display.col].appendChild(connector);
                if (parent_node.display.col > node.display.col) {
                    connector.classList.add("rotate-180");
                }
                else {// if (parent_node.display.col < node.display.col && (parent_node.display.row != node.display.row)) {
                    connector.classList.add("rotate-270");
                }
                resolve_connector(document.getElementById("atree-row-" + parent_node.display.row).children[node.display.col]);
            }
        }

        // create node
        let node_elem = document.createElement('div')
        node_elem.style = "background-image: url('../media/atree/node.png'); background-size: cover; width: 100%; height: 100%;";

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
        active_tooltip.classList.add("rounded-bottom", "dark-7", "border", "mb-2", "mx-auto");
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
                this.style.backgroundImage = 'url("../media/atree/node.png")';
            } 
            else {
                tooltip.style.display = "block";
                this.classList.add("atree-selected");
                this.style.backgroundImage = 'url("../media/atree/node-selected.png")';
            }

            toggle_connectors(connector_list);
        });
        document.getElementById("atree-row-" + node.display.row).children[node.display.col].appendChild(node_elem);
    };
};

// resolve connector conflict
function resolve_connector(elem) {
    if (elem.children.length < 2) {return false;}
    let line = 0;
    let angle = 0;
    let t = 0
    for (let child of elem.children) {
        let type = child.id.split("-")[2]
        if (type == "line") {
            line += 1;
        } else if (type == "angle") {
            angle += 1;
        } else if (type == "t") {
            t += 1;
        }
    }

    let connect_elem = document.createElement("div");

    if ((line == angle) || (angle == 1 && t == 1)) {
        connect_elem.style = "background-image: url('../media/atree/connect_t.png'); background-size: cover; width: 100%; height: 100%;"
        connect_elem.classList.add("rotate-180")
        connect_elem.id = elem.children[0].id.split("-")[0] + "-" + elem.children[0].id.split("-")[1] + "-t"
        elem.replaceChildren(connect_elem);
    }
    if (line > 1 && angle == 0) {
        elem.replaceChildren(elem.children[0])
    }
    if (t == 1 && line == 1) {
        connect_elem.style = "background-image: url('../media/atree/connect_c.png'); background-size: cover; width: 100%; height: 100%;"
        elem.replaceChildren(connect_elem);
    }
}
