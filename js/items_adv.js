const getQueryIdentifiers = (function() {
    let identCache = null;
    return function() {
        if (identCache === null) {
            const idents = new Set();
            for (const ident of Object.keys(itemQueryProps)) {
                idents.add(ident);
            }
            for (const ident of Object.keys(queryFuncs)) {
                idents.add(ident);
            }
            identCache = [...idents].sort(); // might use a trie optimally, but the set is probably small enough...
        }
        return identCache;
    };
})();

function generateEntries(size, itemList, itemEntries) {
    for (let i = 0; i < size; i++) {
        const itemElem = document.createElement('div');
        itemElem.classList.add('col-lg-3', 'col-sm-auto', "p-2");
        // itemElem.setAttribute('id', `item-entry-${i}`);
        itemList.append(itemElem);
        itemEntries.push(itemElem);

        const itemElemContained = document.createElement("div");
        itemElemContained.classList.add("dark-7", "rounded", "px-2", "col-auto");
        itemElemContained.setAttribute('id', `item-entry-${i}`);
        itemElem.appendChild(itemElemContained);

        const sortKeyListContainer = document.createElement('div');
        sortKeyListContainer.classList.add('row');
        sortKeyListContainer.setAttribute('id', `item-sort-entry-${i}`);
        itemEntries[i].append(sortKeyListContainer);
    }
}

function init_values() {
    // compile the search db from the item db
    searchDb = items.filter(i => !i.remapID).map(i => [i, expandItem(i)]);

    // create the expression parser
    exprParser = new ExprParser(itemQueryProps, queryFuncs);
}

function display(itemExp, id) {
    itemExp.set("powders", []);
    if (itemExp.get("category") == "weapon") {
        apply_weapon_powders(itemExp);
    }

    displayExpandedItem(itemExp, id);
}

(async function() {
    await Promise.resolve(load_init(), load_major_id_data(wynn_version_names[WYNN_VERSION_LATEST]));
    init_items_adv();
})();
