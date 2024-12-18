/**
 * @class Loader
 * @classdesc An interface encapsulating common behaviour in the loading of data from remote and local databases.
 *
 * Implementors must implement the following functions:
 * - process_remote
 * - process_local
 * - process_old_version
 * - init_maps
 * 
 * And the following getters:
 * - remote_paths
 * - old_data_paths
 *
 * You can check each of the functions for the description and required behaviour, and also look at some of the implementations.
 */
class Loader {
    constructor(db_name, store_names, db_version) {
        this.db = null;
        this.in_progress = false;
        this.complete = false;
        this.reload = false;
        this.db_name = db_name;
        this.store_names = store_names;
        this.db_version = db_version
    }

    /**
     * Load data from remote DB (aka a big json file) and process it, populating the local DB in the process. Calls init_maps() on success.
     * Loading is complete after calling this function.
     */
    async load() {
        const data = await Loader.load_json(this.remote_paths, 'no-cache');
        return new Promise((resolve, reject) => {
            let tsx = this.write_transaction();
            this.process_remote(data, tsx, reject);
            tsx.oncomplete = () => {
                this.init_maps();
                this.complete = true;
                this.db.close();
                resolve();
            }
        });
    }

    /*
     * Load data from local DB (aka indexedDB) and process it. Calls init_maps() on success.
     * Loading is complete after calling this function.
     */
    load_local() {
        return new Promise((resolve, reject) => {
            let tsx = this.read_transaction();
            this.process_local(tsx, reject);
            tsx.oncomplete = () => {
                this.init_maps();
                this.complete = true;
                this.db.close();
                resolve();
            }
        });
    }

    /**
     * Load data of a provided version (aka a big json file) and process it. Calls init_maps() on success.
     * Loading is complete after calling this function.
     *
     * @param {string} version_str - a string corresponding to a wynncraft version. must be one of `wynn_version_names`.
     */
    async load_old_version(version_str) {
        let paths = this.old_data_paths;
        if (Array.isArray(paths)) {
            paths = paths.map(path => `data/${version_str}/${path}`);
        } else {
            paths = `data/${version_str}/${paths}`;
        }
        const data = await Loader.load_json(paths);
        this.in_progress = true;
        this.process_old_version(data);
        this.init_maps();
        this.complete = true;
    }

    /**
     * Load one or multiple json files from a given path.
     * the path provided does not need to end with `.json`.
     * Returns a promise that resolves to the parsed json files in the order provided
     * in paths.
     *
     * @param {string | string[]} paths - A string or an array of json file paths without the MIME type.
     * @param {string} [cache_mode='default'] - caching mode. one of the modes of the fetch cache option, see: https://developer.mozilla.org/en-US/docs/Web/API/Request/cache.          
     *
     * @returns Promise<JSON | JSON[]>
     */
    static async load_json(paths, cache_mode='default') {
        const protocol = window.location.protocol;
        const host = window.location.host;
        const base_url = `${protocol}//${host}`

        if (typeof paths === "string") {
            let url = `${base_url}/${paths}.json`;
            return (await fetch(url, {cache: cache_mode})).json()
        } else if ([Symbol.iterator in paths]) {
            let promises = [];
            for (const path of paths) {
                let url = `${base_url}/${path}.json`;
                promises.push(await fetch(url, {cache: cache_mode}));
            }
            return Promise.all(promises.map(promise => promise.json()));
        } else {
            throw new TypeError("`Argument` must be an iterable or string.")
        }
    }

    /**
     * Returns a read-only transaction into all stores of the database linked to this loader.
     */
    read_transaction() {
        return this.db.transaction(this.store_names, 'readonly');
    }

    /**
     * Returns a read-write transaction into all stores of the database linked to this loader.
     */
    write_transaction() {
        return this.db.transaction(this.store_names, 'readwrite');
    }


    /**
     * Initializes the loading procedure.
     * Upgrades the linked database in case of a version change, then reads the data into memory.
     */
    async load_init() {
        return new Promise((resolve, reject) => {
            let request = window.indexedDB.open(this.db_name, this.db_version);

            request.onerror = () => {
                reject("DB failed to open...");
            };

            request.onsuccess = async (event) => {
                this.db = event.target.result;
                if (this.in_progress) {
                    while (!this.complete) {
                        await sleep(100);
                    }
                    console.log("Skipping load...")
                }
                else {
                    this.in_progress = true;
                    if (this.reload) {
                        console.log(`Populating ${this.db_name} and loading the new data...`)
                        await this.load();
                    }
                    else {
                        console.log(`Using existing ${this.db_name} data...`)
                        await this.load_local();
                    }
                }
                resolve();
            };

            request.onupgradeneeded = (event) => {
                this.reload = true;

                let db = event.target.result;
                
                try {
                    for (const existing_obj_store of db.objectStoreNames) {
                        db.deleteObjectStore(existing_obj_store);
                    }
                }
                catch (error) {
                    console.log("Could not delete item DB. This is probably fine");
                }

                for (const store_name of this.store_names) {
                    db.createObjectStore(store_name);
                }

                console.log("DB setup complete...");
            };
        });
    }

    /**
     * @abstract 
     * A getter returning the paths corresponding to the versioned data of the loader.
     * @returns {string | string[]}
     */
    get old_data_paths() {
        throw new Error(`Loader of ${this.db_name} does not implement the getter old_data_paths`);
    }

    /**
     * @abstract 
     * A method returning the paths corresponding to the versioned data of the loader.
     * @returns {string | string[]}
     */
    get remote_paths() {
        throw new Error(`Loader of ${this.db_name} does not implement the getter remote_paths`);
    }

    /**
     * @abstract 
     * A method for processing the payload returned remotely.
     * This method populates the local database with the remote data and loads it into memory.
     * Must be synchronous.
     *
     * @param {IDBTransaction} _tsx - a transaction to all the stores linked to this loader.
     * @param {any} _data - the data being processed.
     * @param {Promise.reject} _reject - the reject function of the promise this function is executing in.
     */
    process_remote(_data, _tsx, _reject) {
        throw new Error(`Loader of ${this.db_name} does not implement process_remote`);
    }

    /**
     * @abstract 
     * A method for processing the local user data.
     * This method loads the data from the local database into memory.
     * Must be synchronous.
     *
     * @param {IDBTransaction} _tsx - a transaction to all the stores linked to this loader.
     * @param {Promise.reject} _reject - the reject function of the promise this function is executing in.
     */
    process_local(_tsx, _reject) {
        throw new Error(`Loader of ${this.db_name} does not implement process_local`);
    }

    /**
     * @abstract 
     * A method for processing the returned versioned data.
     * This method loads the data into memory.
     * Must be synchronous.
     *
     * @param {IDBTransaction} _tsx - a transaction to all the stores linked to this loader.
     * @param {Promise.reject} _reject - the reject function of the promise this function is executing in.
     */
    process_old_version(_data) {
        throw new Error(`Loader of ${this.db_name} does not implement process_old_version`);
    }

    /**
     * @abstract 
     * This method operates on the in-memory data loaded by one of the processing functions
     * to initialize Wynnbuilder global maps that are used throughout the codebase.
     * Must be synchronous.
     *
     * @param {IDBTransaction} _tsx - a transaction to all the stores linked to this loader.
     * @param {Promise.reject} _reject - the reject function of the promise this function is executing in.
     */
    init_maps() {
        throw new Error(`Loader of ${this.db_name} does not implement init_maps`);
    }
}
