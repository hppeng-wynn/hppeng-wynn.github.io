
function applyQuery(items, query) {
    return items.filter(query.filter, query).sort(query.compare);
}

function displayItems(items_copy) {
    let items_parent = document.getElementById("main");
    for (let i in items_copy) {
        let item = items_copy[i];
        let box = document.createElement("div");
        box.classList.add("box");
        box.id = "item"+i;
        items_parent.appendChild(box);
        displayExpandedItem(expandItem(item, []), box.id);
    }
}

function doItemSearch() {
    window.scrollTo(0, 0);
    let input_json = document.getElementById("query-json").value;
    let input = JSON.parse(input_json);
    let items_copy = items.slice();
    document.getElementById("main").textContent = "";
    for (const _query of input) {
        const query = queryTypeMap.get(_query.queryType)(_query.value);
        items_copy = applyQuery(items_copy, query);
    }
    document.getElementById("summary").textContent = items_copy.length + " results."
    displayItems(items_copy);
}

function init() {
    return;
    let items_copy = items.slice();
    //let query = new NameQuery("Bob's");
    let query1 = new IdQuery("sdRaw");
    items_copy = applyQuery(items_copy, query1);

    let query2 = new TypeQuery("helmet");
    items_copy = applyQuery(items_copy, query2);

    displayItems(items_copy);
}

load_init(init);
