import json

with open("dump.json", "r") as infile:
    data = json.loads(infile.read())

items = data["items"]

translate_mappings = {
    "sockets": "slots",
    "addedLore": "lore",
    "damage": "nDam",
    "fireDamage": "fDam",
    "waterDamage": "wDam",
    "airDamage": "aDam",
    "thunderDamage": "tDam",
    "earthDamage": "eDam",
    "attackSpeed": "atkSpd",
    "health": "hp",
    "fireDefense": "fDef",
    "waterDefense": "wDef",
    "airDefense": "aDef",
    "thunderDefense": "tDef",
    "earthDefense": "eDef",
    "level": "lvl",
    "classRequirement": "classReq",
    "strength": "strReq",
    "dexterity": "dexReq",
    "intelligence": "intReq",
    "agility": "agiReq",
    "defense": "defReq",
    "healthRegen": "hprPct",
    "manaRegen": "mr",
    "spellDamage": "spellPct",
    "damageBonus": "meleePct",
    "lifeSteal": "ls",
    "manaSteal": "ms",
    "xpBonus": "xpb",
    "lootBonus": "lb",
    "reflection": "ref",
    "strengthPoints": "str",
    "dexterityPoints": "dex",
    "intelligencePoints": "int",
    "agilityPoints": "agi",
    "defensePoints": "def",
    #"thorns": "thorns",
    #"exploding": "expoding",
    "speed": "spd",
    "attackSpeedBonus": "attackTier",
    #"poison": "poison",
    "healthBonus": "hpBonus",
    "soulPoints": "spRegen",
    "emeraldStealing": "stealing",
    "healthRegenRaw": "hprRaw",
    "spellDamageRaw": "spellRaw",
    "damageBonusRaw": "meleeRaw",
    "bonusFireDamage": "fDamPct",
    "bonusWaterDamage": "wDamPct",
    "bonusAirDamage": "aDamPct",
    "bonusThunderDamage": "tDamPct",
    "bonusEarthDamage": "eDamPct",
    "bonusFireDefense": "fDefPct",
    "bonusWaterDefense": "wDefPct",
    "bonusAirDefense": "aDefPct",
    "bonusThunderDefense": "tDefPct",
    "bonusEarthDefense": "eDefPct",
    "identified": "fixID",

    "spellCostPct1": "spellPct1",
    "spellCostRaw1": "spellRaw1",
    "spellCostPct2": "spellPct2",
    "spellCostRaw2": "spellRaw2",
    "spellCostPct3": "spellPct3",
    "spellCostRaw3": "spellRaw3",
    "spellCostPct4": "spellPct4",
    "spellCostRaw4": "spellRaw4",

    "rainbowSpellDamageRaw": "rainbowSDRaw",
    "sprint": "sprint",
    "sprintRegen": "sprintReg",
    "jumpHeight": "jh",
    "lootQuality": "lq",
}

delete_keys = [
    "addedLore",
    "skin",
    "armorType",
    "armorColor"
]

for item in items:
    for key in delete_keys:
        if key in item:
            del item[key]

    for k, v in translate_mappings.items():
        if k in item:
            item[v] = item[k]
            del item[k]

with open("clean.json", "w") as outfile:
    outfile.write(json.dumps(data, indent=2))
with open("compress.json", "w") as outfile:
    outfile.write(json.dumps(data))
