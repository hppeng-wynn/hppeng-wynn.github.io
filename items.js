function init() {
    const searchDb = items.filter(i => !i.remapID).map(i => [i, expandItem(i, [])]);
    const searchField = document.getElementById('search-field');
    const searchError = document.getElementById('search-error');
    const itemList = document.getElementById('item-list');
    const itemListFooter = document.getElementById('item-list-footer');

    const ITEM_LIST_SIZE = 64;
    const itemEntries = [];
    for (let i = 0; i < ITEM_LIST_SIZE; i++) {
        const itemElem = document.createElement('div');
        itemElem.classList.add('box');
        itemElem.setAttribute('id', `item-entry-${i}`);
        itemElem.style.width = '20vw';
        itemElem.style.margin = '1vw';
        itemElem.style.verticalAlign = 'top';
        itemList.append(itemElem);
        itemEntries.push(itemElem);
    }

    let currentSearchStr = null;
    function updateSearch() {
        if (searchField.value === currentSearchStr) return;
        currentSearchStr = searchField.value;
        itemListFooter.innerText = '';
        try {
            for (const itemEntry of itemEntries) itemEntry.style.display = 'none';
            const searchState = ItemSearchState.parseSearchString(currentSearchStr);
            const searchResults = [];
            for (let i = 0; i < searchDb.length; i++) {
                if (searchState.test(searchDb[i][0], searchDb[i][1])) searchResults.push(searchDb[i]);
            }
            if (searchResults.length === 0) {
                itemListFooter.innerText = 'No results!';
            } else {
                searchResults.sort((a, b) => searchState.compare(a[0], a[1], b[0], b[1]));
                const searchMax = Math.min(searchResults.length, ITEM_LIST_SIZE);
                for (let i = 0; i < searchMax; i++) {
                    itemEntries[i].style.display = 'inline-block';
                    displayExpandedItem(searchResults[i][1], `item-entry-${i}`);
                }
                if (searchMax < searchResults.length) {
                    itemListFooter.innerText = `${searchResults.length - searchMax} more...`;
                }
            }
            searchError.innerText = '';
        } catch (e) {
            searchError.innerText = e.message;
        }
    }

    let updateSearchTask = null;
    searchField.addEventListener('input', e => {
        if (updateSearchTask !== null) {
            clearTimeout(updateSearchTask);
        }
        updateSearchTask = setTimeout(() => {
            updateSearchTask = null;
            updateSearch();
        }, 300);
    });
    updateSearch();
}

load_init(init);
