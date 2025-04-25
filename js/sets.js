(async function() {
    await Promise.resolve(item_loader.load_init(), load_major_id_data(wynn_version_names[WYNN_VERSION_LATEST]));
    init_sets();
})();

function init_sets(){
    let set_parent = document.getElementById("search-results");
    for (const [key, value] of sets) {
        if(value.hidden == true)
            continue;

        let box = make_elem('div', ['ing-stats', 'col-lg-3', 'p-2', 'col-sm-6'], {id: 'set'+key});

        let bckgrdbox = make_elem('div', ["rounded", "g-0", "dark-7", "border", "border-dark", "dark-shadow", "p-3", "col-auto"], {id: 'set'+key+'b'});
        box.append(bckgrdbox);
        set_parent.appendChild(box);

        displayExpandedSet(key, value, bckgrdbox.id, value.bonuses.length - 1);
    }
}