/*
 * Display commands
 */
let build_all_display_commands = [
    "#table",
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
    '#table',
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

