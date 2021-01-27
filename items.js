// represents a field containing a query expression string
class ExprField {
    constructor(fieldId, errorTextId, compiler) {
        this.field = document.getElementById(fieldId);
        this.errorText = document.getElementById(errorTextId);
        this.compiler = compiler;
        this.output = null;
        this.text = null;
    }

    compile() {
        if (this.field.value === this.text) return;
        this.text = this.field.value;
        this.errorText.innerText = '';
        try {
            this.output = this.compiler(this.text);
        } catch (e) {
            this.errorText.innerText = e.message;
            this.output = null;
        }
    }
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
        return function(a, ae, b, be) {
            for (let i = 0; i < subExprs.length; i++) {
                let aKey = subExprs[i](a, ae), bKey = subExprs[i](b, be);
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
            return b.lvl - a.lvl;
        }
    });

    // updates the current search state from the search query input boxes
    function updateSearch() {
        // hide old search results
        itemListFooter.innerText = '';
        for (const itemEntry of itemEntries) itemEntry.style.display = 'none';

        // compile query expressions, aborting if either fails to compile
        searchFilterField.compile();
        searchSortField.compile();
        if (searchFilterField.output === null || searchSortField.output === null) return;

        // index and sort search results
        const searchResults = [];
        try {
            for (let i = 0; i < searchDb.length; i++) {
                if (checkBool(searchFilterField.output(searchDb[i][0], searchDb[i][1]))) searchResults.push(searchDb[i]);
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
            searchResults.sort((a, b) => searchSortField.output(a[0], a[1], b[0], b[1]));
        } catch (e) {
            searchSortField.errorText.innerText = e.message;
            return;
        }

        // display search results
        const searchMax = Math.min(searchResults.length, ITEM_LIST_SIZE);
        for (let i = 0; i < searchMax; i++) {
            itemEntries[i].style.display = 'inline-block';
            displayExpandedItem(searchResults[i][1], `item-entry-${i}`);
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

    // display initial items and focus the filter field
    updateSearch();
    searchFilterField.field.focus();
    searchFilterField.field.select();
}

load_init(init);
