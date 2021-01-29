// represents a field containing a query expression string
class ExprField {
    constructor(fieldId, errorTextId, compiler) {
        this.field = document.getElementById(fieldId);
        this.errorText = document.getElementById(errorTextId);
        this.compiler = compiler;
        this.output = null;
        this.text = null;
    }
    
    get value() {
        return this.field.value;
    }

    compile() {
        if (this.value === this.text) return false;
        this.text = this.value;
        this.errorText.innerText = '';
        try {
            this.output = this.compiler(this.text);
        } catch (e) {
            this.errorText.innerText = e.message;
            this.output = null;
        }
        return true;
    }
}

function compareLexico(ia, keysA, ib, keysB) {
    for (let i = 0; i < keysA.length; i++) { // assuming keysA and keysB are the same length
        let aKey = keysA[i], bKey = keysB[i];
        if (typeof aKey !== typeof bKey) throw new Error(`Incomparable types ${typeof aKey} and ${typeof bKey}`); // can this even happen?
        switch (typeof aKey) {
            case 'string':
                aKey = aKey.toLowerCase();
                bKey = bKey.toLowerCase();
                if (aKey < bKey) return -1;
                if (aKey > bKey) return 1;
                break;
            case 'number': // sort numeric stuff in reverse order
                if (aKey < bKey) return 1;
                if (aKey > bKey) return -1;
                break;
            default:
                throw new Error(`Incomparable type ${typeof aKey}`);
        }
    }
    return ib.lvl - ia.lvl;
}

function stringify(v) {
    return typeof v === 'number' ? (Math.round(v * 100) / 100).toString() : v;
}

function init() {
    const itemList = document.getElementById('item-list');
    const itemListFooter = document.getElementById('item-list-footer');

    // compile the search db from the item db
    const searchDb = items.filter(i => !i.remapID).map(i => [i, expandItem(i, [])]);

    // init item list elements
    const ITEM_LIST_SIZE = 64;
    const itemEntries = [];
    for (let i = 0; i < ITEM_LIST_SIZE; i++) {
        const itemElem = document.createElement('div');
        itemElem.classList.add('box');
        itemElem.setAttribute('id', `item-entry-${i}`);
        itemElem.style.display = 'none';
        itemElem.style.width = '20vw';
        itemElem.style.margin = '1vw';
        itemElem.style.verticalAlign = 'top';
        itemList.append(itemElem);
        itemEntries.push(itemElem);
    }

    // the two search query input boxes
    const searchFilterField = new ExprField('search-filter-field', 'search-filter-error', function(exprStr) {
        const expr = compileQueryExpr(exprStr);
        return expr !== null ? expr : (i, ie) => true;
    });
    const searchSortField = new ExprField('search-sort-field', 'search-sort-error', function(exprStr) {
        const subExprs = exprStr.split(';').map(compileQueryExpr).filter(f => f != null);
        return function(i, ie) {
            const sortKeys = [];
            for (let k = 0; k < subExprs.length; k++) sortKeys.push(subExprs[k](i, ie));
            return sortKeys;
        };
    });

    // updates the current search state from the search query input boxes
    function updateSearch() {
        // hide old search results
        itemListFooter.innerText = '';
        for (const itemEntry of itemEntries) itemEntry.style.display = 'none';

        // compile query expressions, aborting if nothing has changed or either fails to compile
        const changed = searchFilterField.compile() | searchSortField.compile();
        if (!changed || searchFilterField.output === null || searchSortField.output === null) return;

        // update url query string
        const newUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}`
            + `?f=${encodeURIComponent(searchFilterField.value)}&s=${encodeURIComponent(searchSortField.value)}`;
        window.history.pushState({ path: newUrl }, '', newUrl);

        // index and sort search results
        const searchResults = [];
        try {
            for (let i = 0; i < searchDb.length; i++) {
                const item = searchDb[i][0], itemExp = searchDb[i][1];
                if (checkBool(searchFilterField.output(item, itemExp))) {
                    searchResults.push({ item, itemExp, sortKeys: searchSortField.output(item, itemExp) });
                }
            }
        } catch (e) {
            searchFilterField.errorText.innerText = e.message;
            return;
        }
        if (searchResults.length === 0) {
            itemListFooter.innerText = 'No results!';
            return;
        }
        try {
            searchResults.sort((a, b) => compareLexico(a.item, a.sortKeys, b.item, b.sortKeys));
        } catch (e) {
            searchSortField.errorText.innerText = e.message;
            return;
        }

        // display search results
        const searchMax = Math.min(searchResults.length, ITEM_LIST_SIZE);
        for (let i = 0; i < searchMax; i++) {
            const result = searchResults[i];
            itemEntries[i].style.display = 'inline-block';
            displayExpandedItem(result.itemExp, `item-entry-${i}`);
            if (result.sortKeys.length > 0) {
                const sortKeyListContainer = document.createElement('div');
                sortKeyListContainer.classList.add('itemleft');
                const sortKeyList = document.createElement('ul');
                sortKeyList.classList.add('itemp', 'T0');
                sortKeyList.style.marginLeft = '1.75em';
                sortKeyListContainer.append(sortKeyList);
                for (let j = 0; j < result.sortKeys.length; j++) {
                    const sortKeyElem = document.createElement('li');
                    sortKeyElem.innerText = stringify(result.sortKeys[j]);
                    sortKeyList.append(sortKeyElem);
                }
                itemEntries[i].append(sortKeyListContainer);
            }
        }
        if (searchMax < searchResults.length) {
            itemListFooter.innerText = `${searchResults.length - searchMax} more...`;
        }
    }

    // updates the search state from the input boxes after a brief delay, to prevent excessive DOM updates
    let updateSearchTask = null;
    function scheduleSearchUpdate() {
        if (updateSearchTask !== null) {
            clearTimeout(updateSearchTask);
        }
        updateSearchTask = setTimeout(() => {
            updateSearchTask = null;
            updateSearch();
        }, 500);
    }
    searchFilterField.field.addEventListener('input', e => scheduleSearchUpdate());
    searchSortField.field.addEventListener('input', e => scheduleSearchUpdate());

    // parse query string, display initial search results
    if (window.location.search.startsWith('?')) {
        for (const entryStr of window.location.search.substring(1).split('&')) {
            const ndx = entryStr.indexOf('=');
            if (ndx !== -1) {
                console.log(entryStr.substring(0, ndx));
                console.log(entryStr.substring(ndx + 1));
                switch (entryStr.substring(0, ndx)) {
                    case 'f':
                        searchFilterField.field.value = decodeURIComponent(entryStr.substring(ndx + 1));
                        break;
                    case 's':
                        searchSortField.field.value = decodeURIComponent(entryStr.substring(ndx + 1));
                        break;
                }
            }
        }
    }
    updateSearch();

    // focus the query filter text box
    searchFilterField.field.focus();
    searchFilterField.field.select();
}

load_init(init);
