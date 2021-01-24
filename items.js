
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

function init() {
    let items_copy = items.slice();
    //let query = new NameQuery("Bob's");
    let query1 = new IdQuery("poison");
    items_copy = applyQuery(items_copy, query1);

    let query2 = new TypeQuery("boots");
    items_copy = applyQuery(items_copy, query2);

    displayItems(items_copy);
}

load_init(init);
