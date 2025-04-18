const ING_DB_VERSION = 38;

let ings;
let recipes;

let ingMap = new Map();
let ingList = [];

let recipeMap;
let recipeList = [];

let ingIDMap = new Map();
let recipeIDMap;

class IngredientLoader extends Loader {
    process_local(tsx, reject) {
        let ings_store = tsx.objectStore('ing_db');
        let recipes_store = tsx.objectStore('recipe_db');

        let ing_req = ings_store.getAll();
        ing_req.onerror = ()  => {
            reject("Could not read local ingredient db...");
        }
        ing_req.onsuccess = (event) => {
            ings = event.target.result;
            console.log("Successfully read local ingredient db.");
        }

        let recipe_req = recipes_store.getAll();
        recipe_req.onerror = () => {
            reject("Could not read local recipe db...");
        }
        recipe_req.onsuccess = (event) => {
            recipes = event.target.result;
            console.log("Successfully read local recipe db.");
        }
    }

    get old_data_paths() {
        return ['ingreds', 'recipes'];
    }

    async process_old_version(data) {
        ings = data[0];
        for (const id in ings) {
            clean_ing(ings[id]);
        }
        recipes = data[1].recipes;
    }

    get remote_paths() {
        return [`ingreds_compress`, `recipes_compress`];
    }

    process_remote(data, tsx, reject) {
        ings = data[0];
        recipes = data[1].recipes;
        const ings_store = tsx.objectStore('ing_db');
        for (const id in ings) {
            clean_ing(ings[id]);
            const add_ing_req = ings_store.add(ings[id], id);
            add_ing_req.onerror = (err) => {
                reject("ADD INGREDIENT ERROR? " + err)
            }
        }
        const recipes_store = tsx.objectStore('recipe_db');
        for (const recipe in recipes) {
            recipes_store.add(recipes[recipe], recipe);
            recipes_store.onerror = (err) => {
                reject("ADD INGREDIENT ERROR? " + err)
            }
        }
    }

    init_maps() {
        recipeMap = new Map();
        recipeIDMap = new Map();

        let ing = {
            name: "No Ingredient",
            displayName: "No Ingredient",
            tier: 0,
            lvl: 0,
            skills: ["ARMOURING", "TAILORING", "WEAPONSMITHING", "WOODWORKING", "JEWELING", "COOKING", "ALCHEMISM", "SCRIBING"],
            ids: {},
            itemIDs: {"dura": 0, "strReq": 0, "dexReq": 0,"intReq": 0,"defReq": 0,"agiReq": 0,},
            consumableIDs: {"dura": 0, "charges": 0},
            posMods: {"left": 0, "right": 0, "above": 0, "under": 0, "touching": 0, "notTouching": 0},
            id: 4000
        };

        ingMap.set(ing.displayName, ing);
        ingList.push(ing.displayName);
        ingIDMap.set(ing.id, ing.displayName);
        let numerals = new Map([[1, "I"], [2, "II"], [3, "III"], [4, "IV"], [5, "V"], [6, "VI"]]);

        // pairs of (dura, req)
        let powder_ing_info = [
            [-35,0],[-52.5,0],[-70,10],[-91,20],[-112,28],[-133,36]
        ];
        for (let i = 0; i < 5; i ++) {
            for (let powder_tier = 0; powder_tier < 6; ++powder_tier) {
                let powder_info = powder_ing_info[powder_tier];
                let ing = {
                    name: "" + damageClasses[i+1] + " Powder " + numerals.get(powder_tier + 1),
                    tier: 0,
                    lvl: 0,
                    skills: ["ARMOURING", "TAILORING", "WEAPONSMITHING", "WOODWORKING", "JEWELING"],
                    ids: {},
                    isPowder: true,
                    pid: 6*i + powder_tier,
                    itemIDs: {"dura": powder_info[0], "strReq": 0, "dexReq": 0,"intReq": 0,"defReq": 0,"agiReq": 0},
                    consumableIDs: {"dura": 0, "charges": 0},
                    posMods: {"left": 0, "right": 0, "above": 0, "under": 0, "touching": 0, "notTouching": 0}
                };
                ing.id = 4001 + ing.pid;
                ing.displayName = ing.name;
                ing.itemIDs[skp_order[i] + "Req"] = powder_info[1];
                ingMap.set(ing.displayName, ing);
                ingList.push(ing.displayName);
                ingIDMap.set(ing.id, ing.displayName);
            }
        }
        

        for (const ing of ings) {
            ingMap.set(ing.displayName, ing);
            ingList.push(ing.displayName);
            ingIDMap.set(ing.id, ing.displayName);
        }
        for (const recipe of recipes) {
            recipeMap.set(recipe.name, recipe);
            recipeList.push(recipe.name);
            recipeIDMap.set(recipe.id, recipe.name);
        }
    }
}

function clean_ing(ing) {
    if (ing.remapID === undefined) {
        if (ing.displayName === undefined) {
            ing.displayName = ing.name;
        }
    }
}

const ingredient_loader = new IngredientLoader('ing_db', ['ing_db', 'recipe_db'], ING_DB_VERSION);

