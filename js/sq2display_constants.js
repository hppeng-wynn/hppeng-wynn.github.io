let powder_chars = [
    '\u2724',
    '\u2726',
    '\u2749',
    '\u2739',
    '\u274b'
]
let subscript_nums = [
    '\u2081',
    '\u2082',
    '\u2083',
    '\u2084',
    '\u2085',
    '\u2086',
]

let skp_names = [
    'str',
    'dex',
    'int',
    'def',
    'agi'
]

let elem_chars = [
    'e',
    't',
    'w',
    'f',
    'a'
]

let elem_colors = [
    "#00AA00",
    "#FFFF55",
    "#55FFFF",
    "#FF5555",
    "#FFFFFF"
]

/*
 * Display commands
 */
let build_all_display_commands = [
    "#defense-stats",
    "str", "dex", "int", "def", "agi",
    "mr", "ms",
    "hprRaw", "hprPct",
    "sdRaw", "sdPct",
    "mdRaw", "mdPct",
    "ref", "thorns",
    "ls",
    "poison",
    "expd",
    "spd",
    "atkTier",
    "!elemental",
    "fDamPct", "wDamPct", "aDamPct", "tDamPct", "eDamPct",
    "!elemental",
    "spPct1", "spRaw1", "spPct2", "spRaw2", "spPct3", "spRaw3", "spPct4", "spRaw4",
    "rainbowRaw",
    "sprint", "sprintReg",
    "jh",
    "xpb", "lb", "lq",
    "spRegen",
    "eSteal",
    "gXp", "gSpd",
];

let build_offensive_display_commands = [
    "str", "dex", "int", "def", "agi",
    "mr", "ms",
    "sdRaw", "sdPct",
    "mdRaw", "mdPct",
    "ref", "thorns",
    "ls",
    "poison",
    "expd",
    "spd",
    "atkTier",
    "rainbowRaw",
    "!elemental",
    "fDamPct", "wDamPct", "aDamPct", "tDamPct", "eDamPct",
    "!elemental",
    "spPct1", "spRaw1", "spPct2", "spRaw2", "spPct3", "spRaw3", "spPct4", "spRaw4",
];

let build_basic_display_commands = [
    '#defense-stats',
    // defense stats [hp, ehp, hpr, ]
    // "sPot", // base * atkspd + spell raws
    // melee potential
    // "mPot", // melee% * (base * atkspd) + melee raws
    "mr", "ms",
    "ls",
    "poison",
    "spd",
    "atkTier",
]

let sq2_item_display_commands = [
    "displayName",
    "atkSpd",
    "!elemental",
    "hp",
    "nDam_", "fDam_", "wDam_", "aDam_", "tDam_", "eDam_",
    "!spacer",
    "fDef", "wDef", "aDef", "tDef", "eDef",
    "!elemental",
    "classReq",
    "lvl",
    "strReq", "dexReq", "intReq", "defReq","agiReq",
    "!spacer",
    "str", "dex", "int", "def", "agi",
    "hpBonus",
    "hprRaw", "hprPct",
    "sdRaw", "sdPct",
    "mdRaw", "mdPct",
    "mr", "ms",
    "ref", "thorns",
    "ls",
    "poison",
    "expd",
    "spd",
    "atkTier",
    "!elemental",
    "fDamPct", "wDamPct", "aDamPct", "tDamPct", "eDamPct",
    "fDefPct", "wDefPct", "aDefPct", "tDefPct", "eDefPct",
    "!elemental",
    "spPct1", "spRaw1", "spPct2", "spRaw2", "spPct3", "spRaw3", "spPct4", "spRaw4",
    "rainbowRaw",
    "sprint", "sprintReg",
    "jh",
    "xpb", "lb", "lq",
    "spRegen",
    "eSteal",
    "gXp", "gSpd",
    "majorIds",
    "!spacer",
    "slots",
    "!spacer",
    "set",
    "lore",
    "quest",
    "restrict"
];

let sq2_ing_display_order = [
    "displayName", //tier will be displayed w/ name
    "!spacer",
    "ids",
    "!spacer",
    "posMods",
    "itemIDs",
    "consumableIDs",
    "!spacer",
    "lvl",
    "skills",
]