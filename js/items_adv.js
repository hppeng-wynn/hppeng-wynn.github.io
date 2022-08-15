function isIdentifierChar(character) {
    return /[\w\d%]/i.test(character);
}

function isIdentifierFirstChar(character) {
    return /\w/i.test(character);
}

class AutocompleteContext {
    constructor(field) {
        this.field = field;
        this.text = field.value;
        this.cursorPos = this.startIndex = this.endIndex = field.selectionEnd;
        while (this.startIndex > 0 && isIdentifierChar(this.text.charAt(this.startIndex - 1))) {
            --this.startIndex;
        }
        if (!isIdentifierFirstChar(this.text.charAt(this.startIndex))) {
            this.startIndex = this.cursorPos;
            return;
        }
        while (this.endIndex < this.text.length && isIdentifierChar(this.text.charAt(this.endIndex))) {
            ++this.endIndex;
        }
    }

    get valid() {
        return this.endIndex > this.startIndex;
    }

    get complText() {
        return this.text.substring(this.startIndex, this.cursorPos);
    }

    insert(completion, supplant) {
        this.field.setRangeText(completion, this.startIndex, supplant ? this.endIndex : this.cursorPos, 'end');
        this.field.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
        this.startIndex = this.endIndex = -1;
        setTimeout(() => this.field.focus(), 5); // no idea why i need a delay here
    }
}

class AutocompleteController {
    constructor(ctx, completions, exprField) {
        this.ctx = ctx;
        this.completions = completions;
        this.exprField = exprField;
        this.currentFocus = null;

        for (const completion of completions) {
            const complElem = document.createElement('div');
            complElem.classList.add('search-field-compl-entry')
            complElem.setAttribute('data-compl', completion);
            complElem.innerText = completion;
            complElem.addEventListener('mousemove', e => this.focus(complElem));
            complElem.addEventListener('mousedown', e => this.complete(completion, true));
            exprField.completions.append(complElem);
        }
    }

    get valid() {
        return this.ctx.valid && this.completions.length > 0;
    }

    focus(complElem) {
        if (this.currentFocus !== null) {
            this.currentFocus.classList.remove('focused');
        }
        this.currentFocus = complElem;
        complElem.classList.add('focused');
        complElem.scrollIntoView({ block: 'nearest' });
    }

    focusNext() {
        if (this.currentFocus === null || !this.currentFocus.nextSibling) {
            this.focus(this.exprField.completions.firstChild);
        } else {
            this.focus(this.currentFocus.nextSibling);
        }
    }

    focusPrev() {
        if (this.currentFocus === null || !this.currentFocus.previousSibling) {
            this.focus(this.exprField.completions.lastChild);
        } else {
            this.focus(this.currentFocus.previousSibling);
        }
    }

    complete(completion, supplant) {
        if (completion === null) {
            completion = this.currentFocus.getAttribute('data-compl');
            if (completion === null) {
                return;
            }
        }
        this.ctx.insert(completion, supplant);
        this.exprField.clearAutocomplete();
    }
}

const getQueryIdentifiers = (function() {
    let identCache = null;
    return function() {
        if (identCache === null) {
            const idents = new Set();
            for (const ident of Object.keys(itemQueryProps)) {
                idents.add(ident);
            }
            for (const ident of Object.keys(itemQueryFuncs)) {
                idents.add(ident);
            }
            identCache = [...idents].sort(); // might use a trie optimally, but the set is probably small enough...
        }
        return identCache;
    };
})();

// represents a field containing a query expression string
class ExprField {
    constructor(key, compiler) {
        this.field = document.getElementById(`search-${key}-field`);
        this.completions = document.getElementById(`search-${key}-compl`);
        this.errorText = document.getElementById(`search-${key}-error`);
        this.prevComplText = null;
        this.prevComplPos = null;
        this.complCtrl = null;
        this.compiler = compiler;
        this.output = null;
        this.text = null;

        this.field.addEventListener('focus', e => this.scheduleAutocomplete());
        this.field.addEventListener('change', e => this.scheduleAutocomplete());
        this.field.addEventListener('keydown', e => {
            if (this.complCtrl !== null && this.complCtrl.valid) {
                switch (e.key) {
                    case 'Up':
                    case 'ArrowUp':
                        this.complCtrl.focusPrev();
                        break;
                    case 'Down':
                    case 'ArrowDown':
                        this.complCtrl.focusNext();
                        break;
                    case 'Tab':
                        this.complCtrl.complete(null, true);
                        break;
                    case 'Enter':
                        this.complCtrl.complete(null, false);
                        break;
                    case 'Escape':
                        this.clearAutocomplete();
                        break;
                    default:
                        this.scheduleAutocomplete();
                        return;
                }
                e.preventDefault();
            } else {
                switch (e.key) {
                    case 'Spacebar':
                    case ' ':
                        if (e.ctrlKey) {
                            this.autocomplete();
                            return;
                        }
                        break;
                }
            }
            this.scheduleAutocomplete()
        });
        this.field.addEventListener('mousedown', e => this.scheduleAutocomplete());
        this.field.addEventListener('blur', e => this.clearAutocomplete());
    }

    get value() {
        return this.field.value;
    }

    scheduleAutocomplete() {
        setTimeout(() => {
            if (this.field.value !== this.prevComplText || this.field.selectionEnd !== this.prevComplPos) {
                this.prevComplText = this.field.value;
                this.prevComplPos = this.field.selectionEnd;
                this.autocomplete();
            }
        }, 1);
    }

    autocomplete() {
        while (this.completions.lastChild) {
            this.completions.removeChild(this.completions.lastChild);
        }

        const complCtx = new AutocompleteContext(this.field);
        if (!complCtx.valid) {
            this.clearAutocomplete();
            return;
        }

        const complText = complCtx.complText;
        const completions = getQueryIdentifiers().filter(ident => ident.startsWith(complText));
        if (completions.length === 0) {
            this.clearAutocomplete();
            return;
        }

        this.complCtrl = new AutocompleteController(complCtx, completions, this);
        this.complCtrl.focusNext();
        this.completions.classList.add('visible');
    }

    clearAutocomplete() {
        this.completions.classList.remove('visible');
        this.prevComplText = this.field.value;
        this.prevComplPos = this.field.selectionEnd;
        this.complCtrl = null;
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

function stringify(v) {
    return typeof v === 'number' ? (Math.round(v * 100) / 100).toString() : v;
}

function init_items_adv() {
    const itemList = document.getElementById('item-list');
    const itemListFooter = document.getElementById('item-list-footer');

    // compile the search db from the item db
    const searchDb = items.filter(i => !i.remapID).map(i => [i, expandItem(i)]);

    // init item list elements
    const ITEM_LIST_SIZE = 64;
    const itemEntries = [];
    for (let i = 0; i < ITEM_LIST_SIZE; i++) {
        const itemElem = document.createElement('div');
        itemElem.classList.add('col-lg-3', 'col-sm-auto', "p-2");
        // itemElem.setAttribute('id', `item-entry-${i}`);
        itemList.append(itemElem);
        itemEntries.push(itemElem);

        const itemElemContained = document.createElement("div");
        itemElemContained.classList.add("dark-7", "rounded", "px-2", "col-auto");
        itemElemContained.setAttribute('id', `item-entry-${i}`);
        itemElem.appendChild(itemElemContained);
    }

    // create the expression parser
    const exprParser = new ExprParser(itemQueryProps, itemQueryFuncs);

    // the two search query input boxes
    const searchFilterField = new ExprField('filter', function(exprStr) {
        const expr = exprParser.parse(exprStr);
        return expr !== null ? expr : new BoolLitTerm(true);
    });
    const searchSortField = new ExprField('sort', function(exprStr) {
        const subExprs = exprStr.split(';').map(e => exprParser.parse(e)).filter(f => f != null);
        return {
            type: 'array',
            resolve(i, ie) {
                const sortKeys = [];
                for (let k = 0; k < subExprs.length; k++) sortKeys.push(subExprs[k].resolve(i, ie));
                return sortKeys;
            }
        };
    });

    // updates the current search state from the search query input boxes
    function updateSearch() {
        // compile query expressions, aborting if nothing has changed or either fails to compile
        const changed = searchFilterField.compile() | searchSortField.compile();
        if (!changed || searchFilterField.output === null || searchSortField.output === null) return;

        // update url query string
        const newUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}`
            + `?f=${encodeURIComponent(searchFilterField.value)}&s=${encodeURIComponent(searchSortField.value)}`;
        window.history.pushState({ path: newUrl }, '', newUrl);

        // hide old search results
        itemListFooter.innerText = '';
        for (const itemEntry of itemEntries) itemEntry.classList.remove('visible');

        // index and sort search results
        const searchResults = [];
        try {
            for (let i = 0; i < searchDb.length; i++) {
                const item = searchDb[i][0], itemExp = searchDb[i][1];
                if (checkBool(searchFilterField.output.resolve(item, itemExp))) {
                    searchResults.push({ item, itemExp, sortKeys: searchSortField.output.resolve(item, itemExp) });
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
            searchResults.sort((a, b) => {
                try {
                    return compareLexico(a.item, a.sortKeys, b.item, b.sortKeys);
                } catch (e) {
                    console.log(a.item, b.item);
                    throw e;
                }
            });
        } catch (e) {
            searchSortField.errorText.innerText = e.message;
            return;
        }

        // display search results
        const searchMax = Math.min(searchResults.length, ITEM_LIST_SIZE);
        for (let i = 0; i < searchMax; i++) {
            const result = searchResults[i];
            itemEntries[i].classList.add('visible');
            result.itemExp.set("powders", []);
            if (result.itemExp.get("category") == "weapon") {
                apply_weapon_powders(result.itemExp);
            }
            displayExpandedItem(result.itemExp, `item-entry-${i}`);
            if (result.sortKeys.length > 0) {
                const sortKeyListContainer = document.createElement('div');
                sortKeyListContainer.classList.add('row');
                const sortKeyList = document.createElement('ul');
                sortKeyList.classList.add('item-entry-sort-key', 'itemp', 'T0');
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

    // scroll-to-top button
    document.getElementById('scroll-up')
        .addEventListener('mousedown', e => scrollTo({ top: 0, behavior: 'smooth' }));
}

(async function() {
    await Promise.resolve(load_init());
    init_items_adv();
})();
