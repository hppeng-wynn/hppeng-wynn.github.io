
function init() {
    let items_copy = items.slice();
    let query = new NameQuery("Bob's");
    items_copy = items_copy.filter(query.filter, query).sort(query.compare);
    let item = items_copy[0];
    console.log(item);
    displayExpandedItem(expandItem(item, []), "test");
}

load_init(init);
