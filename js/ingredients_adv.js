const getQueryIdentifiers = (function() {
    let identCache = null;
    return function() {
        if (identCache === null) {
            const idents = new Set();
            for (const ident of Object.keys(ingredientQueryProps)) {
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
        itemElem.classList.add('col-lg-3', 'col-sm-6', "p-2", "ing-stats");
        // itemElem.setAttribute('id', `item-entry-${i}`);
        itemList.append(itemElem);
        itemEntries.push(itemElem);

        const itemElemContained = document.createElement("div");
        itemElemContained.classList.add("dark-7", "rounded", "p-3", "col-auto", "g-0", "border", "border-dark", "dark-shadow");
    
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
    searchDb = ings.filter(i => !i.remapID).map(i => [i, expandIngredient(i)]);

    // create the expression parser
    exprParser = new ExprParser(ingredientQueryProps, queryFuncs);
}

function display(itemExp, id) {
    displayExpandedIngredient(itemExp, id);
}

(async function() {
    await Promise.resolve(ingredient_loader.load_init());
    init_items_adv();
})();
