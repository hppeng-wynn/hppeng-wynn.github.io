d3.select("body")
    .append("div")
    .attr("style", "width: 100%; min-height: 0px; flex-grow: 1")
    .append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .classed("svg-content-responsive", true);
let graph = d3.select("svg");

console.log(graph);
let margin = {top: 20, right: 20, bottom: 35, left: 40};

function bbox() {
    return graph.node().parentNode.getBoundingClientRect();
}

function xAxis(g, x) {
    let _bbox = bbox();
    g.attr("transform", `translate(0,${_bbox.height - margin.bottom})`)
     .call(d3.axisBottom(x).ticks(_bbox.width / 80, ","))
     .call(g => g.select(".domain").remove())
     .call(g => g.select("text")
         .attr("x", _bbox.width)
         .attr("y", margin.bottom - 4)
         .attr("fill", "currentColor")
         .attr("text-anchor", "end")
         .text("Combat Level"));
}

function yAxis(g, y) {
    g.attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y))
    .call(g => g.select(".domain").remove())
    .call(g => g.select("text")
        .attr("x", -margin.left)
        .attr("y", 10)
        .attr("fill", "currentColor")
        .attr("text-anchor", "start")
        .text("Base DPS"));
}

function grid(g1, g2, x, y) {
    let _bbox = bbox();
    g1.attr("stroke", "currentColor")
      .attr("stroke-opacity", 0.1)
      .selectAll("line")
      .data(x.ticks())
      .join("line")
        .attr("x1", d => 0.5 + x(d))
        .attr("x2", d => 0.5 + x(d))
        .attr("y1", margin.top)
        .attr("y2", _bbox.height - margin.bottom)
      .exit(g => g.remove());
    g2.attr("stroke", "currentColor")
      .attr("stroke-opacity", 0.1)
      .selectAll("line")
      .data(y.ticks())
      .join("line")
        .attr("y1", d => 0.5 + y(d))
        .attr("y2", d => 0.5 + y(d))
        .attr("x1", margin.left)
        .attr("x2", _bbox.width - margin.right)
      .exit(g => g.remove());
}

let _xAxis = graph.append("g");
_xAxis.append("text");
let _yAxis = graph.append("g");
_yAxis.append("text");
let _grid1 = graph.append("g");
let _grid2 = graph.append("g");

let baseUrl = getUrl.protocol + "//" + getUrl.host + "/";// + getUrl.pathname.split('/')[1];
(async function() {
    let dps_data = await (await fetch(baseUrl + "/dps_data_compress.json")).json()
    console.log(dps_data)

    let colorMap = new Map(
        [
            ["Normal", "#fff"],
            ["Unique", "#ff5"],
            ["Rare","#f5f"],
            ["Legendary","#5ff"],
            ["Fabled","#f55"],
            ["Mythic","#a0a"],
            ["Crafted","#0aa"],
            ["Custom","#0aa"],
            ["Set","#5f5"]
        ]
    );

    const item_points = graph.append("g")
          .attr("stroke", "black")
        .selectAll("circle")
        .data(dps_data.wand, d => d[2])
        .join("circle")
          .attr("fill", d => colorMap.get(d[3]))
          .attr("r", d => 5)
          .call(circle => circle.append("title")
            .text(d => [d[0], d[2]].join("\n")));

    function redraw(data) {
        let max_dps_base = 0;
        for (let x of data) {
            if (x[4] > max_dps_base) {
                max_dps_base = x[4];
            }
        }
        let x = d3.scaleLinear([70, 105], [margin.left, bbox().width - margin.right]);
        let y = d3.scaleLinear([0, max_dps_base * 1.1], [bbox().height - margin.bottom, margin.top]);
        let _bbox = bbox();
        graph.attr("viewBox", [0, 0, _bbox.width, _bbox.height]);
        xAxis(_xAxis, x);
        yAxis(_yAxis, y);
        grid(_grid1, _grid2, x, y);
        item_points.data(data, d => d[2])
          .attr("cx", d => x(d[1]))
          .attr("cy", d => y(d[4]));
    }
    d3.select(window)
        .on("resize", function() {
            redraw(dps_data.wand);
      });
    redraw(dps_data.wand);
}) ();
