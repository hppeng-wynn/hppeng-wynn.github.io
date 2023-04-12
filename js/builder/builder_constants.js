/**
 * I kinda lied. Theres some listener stuff in here
 * but its mostly constants for builder page specifically.
 */

const url_tag = location.hash.slice(1);

// this is the current version of the builder, presumably used to check for backwards compatibility
const BUILD_VERSION = "7.0.19";


// THIS IS SUPER DANGEROUS, WE SHOULD NOT BE KEEPING THIS IN SO MANY PLACES
// also this is for every html ID that is editable by the user
let editable_item_fields = [ "sdPct", "sdRaw", "mdPct", "mdRaw", "poison",
                             "fDamPct", "wDamPct", "aDamPct", "tDamPct", "eDamPct",
                             "fDefPct", "wDefPct", "aDefPct", "tDefPct", "eDefPct",
                             "hprRaw", "hprPct", "hpBonus", "atkTier",
                             "spPct1", "spRaw1", "spPct2", "spRaw2",
                             "spPct3", "spRaw3", "spPct4", "spRaw4" ];

let editable_elems = [];

// for each in the editable fields, when the field is changed, highlight it
for (let i of editable_item_fields) {
    let elem = document.getElementById(i);
    elem.addEventListener("change", (event) => {
        elem.classList.add("highlight");
    });
    editable_elems.push(elem);
}

// when a skillpoint is changed, highlight it
for (let i of skp_order) {
    let elem = document.getElementById(i+"-skp");
    elem.addEventListener("change", (event) => {
        elem.classList.add("highlight");
    });
    editable_elems.push(elem);
}

// clear all highlights in the editable fields
function clear_highlights() {
    for (let i of editable_elems) {
        i.classList.remove("highlight");
    }
}

// name of each equipment field internally
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
// names of each tome field internally
let tome_fields = [
    "weaponTome1",
    "weaponTome2",
    "armorTome1",
    "armorTome2",
    "armorTome3",
    "armorTome4",
    "guildTome1",
]
// names of each slot of equipment shown to the user
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
// names of each tome shown to the user
let tome_names = [
    "Weapon Tome",
    "Weapon Tome",
    "Armor Tome",
    "Armor Tome",
    "Armor Tome",
    "Armor Tome",
    "Guild Tome",
]
let equipment_inputs = equipment_fields.map(x => x + "-choice");
let build_fields = equipment_fields.map(x => x+"-tooltip");
let tomeInputs = tome_fields.map(x => x + "-choice");

// powder input IDs internally
let powder_inputs = [
    "helmet-powder",
    "chestplate-powder",
    "leggings-powder",
    "boots-powder",
    "weapon-powder",
];

// each item in the items.json has a "category" and a "type" field
// these are referring to the "type" field
// this code should be self-explanatory knowing that
let weapon_keys = ['dagger', 'wand', 'bow', 'relik', 'spear'];
let armor_keys = ['helmet', 'chestplate', 'leggings', 'boots'];
let accessory_keys= ['ring1', 'ring2', 'bracelet', 'necklace'];
let powderable_keys = ['helmet', 'chestplate', 'leggings', 'boots', 'weapon'];
let equipment_keys = ['helmet', 'chestplate', 'leggings', 'boots', 'ring1', 'ring2', 'bracelet', 'necklace', 'weapon'];
let tome_keys = ['weaponTome1', 'weaponTome2', 'armorTome1', 'armorTome2', 'armorTome3', 'armorTome4', 'guildTome1'];

// TODO document whatever this is
let spell_disp = ['build-melee-stats', 'spell0-info', 'spell1-info', 'spell2-info', 'spell3-info'];
let other_disp = ['build-order', 'set-info', 'int-info'];
