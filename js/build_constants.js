/**
 * I kinda lied. Theres some listener stuff in here
 * but its mostly constants for builder page specifically.
 */

const url_tag = location.hash.slice(1);

const BUILD_VERSION = "7.0.19";

let player_build;


// THIS IS SUPER DANGEROUS, WE SHOULD NOT BE KEEPING THIS IN SO MANY PLACES
let editable_item_fields = [ "sdPct", "sdRaw", "mdPct", "mdRaw", "poison",
                             "fDamPct", "wDamPct", "aDamPct", "tDamPct", "eDamPct",
                             "fDefPct", "wDefPct", "aDefPct", "tDefPct", "eDefPct",
                             "hprRaw", "hprPct", "hpBonus", "atkTier",
                             "spPct1", "spRaw1", "spPct2", "spRaw2",
                             "spPct3", "spRaw3", "spPct4", "spRaw4" ];

let editable_elems = [];

for (let i of editable_item_fields) {
    let elem = document.getElementById(i);
    elem.addEventListener("change", (event) => {
        elem.classList.add("highlight");
    });
    editable_elems.push(elem);
}

for (let i of skp_order) {
    let elem = document.getElementById(i+"-skp");
    elem.addEventListener("change", (event) => {
        elem.classList.add("highlight");
    });
    editable_elems.push(elem);
}

function clear_highlights() {
    for (let i of editable_elems) {
        i.classList.remove("highlight");
    }
}


let equipment_fields = [
    "helmet",
    "chestplate",
    "leggings",
    "boots",
    "ring1",
    "ring2",
    "bracelet",
    "necklace",
    "weapon"
];
let tome_fields = [
    "weaponTome1",
    "weaponTome2",
    "armorTome1",
    "armorTome2",
    "armorTome3",
    "armorTome4",
    "guildTome1",
]
let equipment_names = [
    "Helmet",
    "Chestplate",
    "Leggings",
    "Boots",
    "Ring 1",
    "Ring 2",
    "Bracelet",
    "Necklace",
    "Weapon"
];

let tome_names = [
    "Weapon Tome",
    "Weapon Tome",
    "Armor Tome",
    "Armor Tome",
    "Armor Tome",
    "Armor Tome",
    "Guild Tome",
]
let equipmentInputs = equipment_fields.map(x => x + "-choice");
let buildFields = equipment_fields.map(x => x+"-tooltip").concat(tome_fields.map(x => x + "-tooltip"));
let tomeInputs = tome_fields.map(x => x + "-choice");

let powder_inputs = [
    "helmet-powder",
    "chestplate-powder",
    "leggings-powder",
    "boots-powder",
    "weapon-powder",
];

let weapon_keys = ['dagger', 'wand', 'bow', 'relik', 'spear'];
let armor_keys = ['helmet', 'chestplate', 'leggings', 'boots'];
let accessory_keys= ['ring1', 'ring2', 'bracelet', 'necklace'];
let powderable_keys = ['helmet', 'chestplate', 'leggings', 'boots', 'weapon'];
let equipment_keys = ['helmet', 'chestplate', 'leggings', 'boots', 'ring1', 'ring2', 'bracelet', 'necklace', 'weapon'].concat(tome_keys);

let spell_disp = ['spell0-info', 'spell1-info', 'spell2-info', 'spell3-info'];
let other_disp = ['build-order', 'set-info', 'int-info'];
