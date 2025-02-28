let ASPECT_DB_VERSION = 1;
let aspects = {};

// Map<className, Map<string, AspectSpec>>
// Maps aspect names to aspect specs.
let aspect_map = new Map();

// Map<className, Map<number, AspectSpec>>
// Maps aspect IDs to aspect specs.
let aspect_id_map  = new Map();

class AspectLoader extends Loader {
    get remote_paths() {
        return 'js/builder/aspects';
    }

    get old_data_paths() {
        return 'aspects';
    }

    process_remote(data, tsx, reject) {
        aspects = data;
        tsx.onabort = () => {
            reject("Not enough space...")
        };
        for (const [c, aspect_arr] of Object.entries(aspects)) {
            const class_store = tsx.objectStore(c, 'readonly');
            for (const aspect_spec of aspect_arr) {
                class_store.add(aspect_spec, aspect_spec.displayName);
            }
        }
    }

    process_old_version(data) {
        aspects = data;
    }

    process_local(tsx, reject) {
        // The aspect DB stores aspects on a per-class basis.
        for (const c of classes) {
            const class_store = tsx.objectStore(c, 'readonly');
            const req = class_store.getAll();
            req.onerror = () => {
                reject(`Could not read local object store for ${c}.`);
            }
            req.onsuccess = (event) => {
                aspects[c] = event.target.result;
                console.log(`Successfully read local aspect db for ${c}.`);
            }
        }
    }

    init_maps() {
        for (const c of Object.keys(aspects)) {
            aspect_map.set(c, new Map());
            aspect_id_map.set(c, new Map());
            for (const aspect of aspects[c]) {
                aspect_id_map.get(c).set(aspect.id, aspect);
                aspect_map.get(c).set(aspect.displayName, aspect);
            }
        }
    }
}

const aspect_loader = new AspectLoader('aspect_db', classes, ASPECT_DB_VERSION)
