d3.select("#graph_body")
    .append("div")
    .attr("style", "width: 100%; height: 100%; min-height: 0px; flex-grow: 1")
    .append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .classed("svg-content-responsive", true);
let graph = d3.select("svg");
let svg = graph.append('g');
let margin = {top: 20, right: 20, bottom: 35, left: 40};

function bbox() {
    let ret = graph.node().parentNode.getBoundingClientRect();
    return ret;
}
let _bbox = bbox();

const colors = ['aqua', 'yellow', 'fuchsia', 'white', 'teal', 'olive', 'purple', 'gray', 'blue', 'lime', 'red', 'silver', 'navy', 'green', 'maroon'];
const n_colors = colors.length;

const view = svg.append("rect")
  .attr("class", "view")
  .attr("x", 0)
  .attr("y", 0);


function convert_data(nodes_raw) {
    let edges = [];
    let node_id = new Map();
    nodes = [];
    for (let i in nodes_raw) {
        node_id.set(nodes_raw[i], i);
        nodes.push({id: i, color: 0, data: nodes_raw[i]});
    }
    for (const node of nodes_raw) {
        const to = node_id.get(node);
        for (const input of node.inputs) {
            const from = node_id.get(input);
            let name = input.name;
            let link_name = node.input_translation.get(name);
            edges.push({
                source: from,
                target: to,
                name: link_name
            });
        }
    }
    return {
        nodes: nodes,
        links: edges
    }
}

function create_svg(data, redraw_func) {
    // Initialize the links
    var link = svg
      .selectAll("line")
      .data(data.links)
      .enter()
      .append("line")
        .style("stroke", "#aaa")

    // Initialize the nodes
    let node = svg
      .selectAll("g")
      .data(data.nodes);

    let node_enter = node.enter()
        .append('g')

    let circles = node_enter.append("circle")
        .attr("r", 20)
        .style("fill", ({id, color, data}) => colors[color])

    node_enter.append('text')
        .attr("dx", -20)
        .attr("dy", -22)
        .style('fill', 'white')
        .text(({id, color, data}) => data.name);

    // Let's list the force we wanna apply on the network
    var simulation = d3.forceSimulation(data.nodes)                 // Force algorithm is applied to data.nodes
        .force("link", d3.forceLink().strength(0.1)                   // This force provides links between nodes
              .id(function(d) { return d.id; })                     // This provide  the id of a node
              .links(data.links)                                    // and this the list of links
        )
        .force("charge", d3.forceManyBody().strength(-400))         // This adds repulsion between nodes. Play with the -400 for the repulsion strength
        //.force("center", d3.forceCenter(_bbox.width / 2, _bbox.height / 2).strength(0.1))     // This force attracts nodes to the center of the svg area
        .on("tick", ticked);
    // This function is run at each iteration of the force algorithm, updating the nodes position.
    let scale_transform = {k: 1, x: 0, y: 0}
    function ticked() {
      link
          .attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });

        node_enter.attr("transform", function (d) { return 'translate('+scale_transform.x+','+scale_transform.y+') scale('+scale_transform.k+') translate('+d.x+','+d.y+')' })
    }

    const drag = d3.drag()
      .on("start", dragstart)
      .on("drag", dragged);

    node_enter.call(drag).on('click', click);
    function click(event, d) {
      if (event.ctrlKey) {
          // Color cycle.
          d.color = (d.color + 1) % n_colors;
          d3.select(this).selectAll('circle').style("fill", ({id, color, data}) => colors[color])
      }
      else {
          delete d.fx;
          delete d.fy;
          d3.select(this).classed("fixed", false);
          simulation.alpha(0.5).restart();
      }
    }

    function dragstart() {
      d3.select(this).classed("fixed", true);
    }
    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
      simulation.alpha(0.5).restart();
    }

    const zoom = d3.zoom()
      .scaleExtent([0.01, 10])
      .translateExtent([[-10000, -10000], [10000, 10000]])
      .filter(filter)
      .on("zoom", zoomed);
    view.call(zoom);
    
    function zoomed({ transform }) {
        link.attr('transform', transform);
        scale_transform = transform;
        node_enter.attr("transform", function (d) { return 'translate('+scale_transform.x+','+scale_transform.y+') scale('+scale_transform.k+') translate('+d.x+','+d.y+')' })
        redraw_func();
    }
    // prevent scrolling then apply the default filter
    function filter(event) {
      event.preventDefault();
      return (!event.ctrlKey || event.type === 'wheel') && !event.button;
    }
}

set_export_button(svg, 'saveButton', 'saveLink');

(async function() {

// JANKY
while (edit_id_output === undefined) {
    await sleep(500);
}

function redraw() {
    _bbox = bbox();
    graph.attr("viewBox", [0, 0, _bbox.width, _bbox.height]);
    view.attr("width", _bbox.width - 1)
        .attr("height", _bbox.height - 1);
}

d3.select(window)
    .on("resize", function() {
        redraw();
  });
redraw();

const data = convert_data(all_nodes);
create_svg(data, redraw);

console.log("render");

})();
