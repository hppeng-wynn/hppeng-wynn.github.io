import json

with open("dump.json", "r") as infile:
    data = json.loads(infile.read())

items = data["items"]
del data["request"]

translate_mappings = {
    #"name": "name",
    #"displayName": "displayName",
    #"tier": "tier",
    #"set": "set",
    "sockets": "slots",
    #"type": "type",
    #"armorType": "armorType",
    "armorColor": "color",
    "addedLore": "lore",
    #"material": "material",
    "dropType": "drop",
    #"quest": "quest",
    "restrictions": "restrict",
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
    "spellDamage": "sdPct",
    "damageBonus": "mdPct",
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
    "attackSpeedBonus": "atkTier",
    #"poison": "poison",
    "healthBonus": "hpBonus",
    "soulPoints": "spRegen",
    "emeraldStealing": "eSteal",
    "healthRegenRaw": "hprRaw",
    "spellDamageRaw": "sdRaw",
    "damageBonusRaw": "mdRaw",
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
    "accessoryType": "type",
    "identified": "fixID",
    #"skin": "skin",
    #"category": "category",

    "spellCostPct1": "spPct1",
    "spellCostRaw1": "spRaw1",
    "spellCostPct2": "spPct2",
    "spellCostRaw2": "spRaw2",
    "spellCostPct3": "spPct3",
    "spellCostRaw3": "spRaw3",
    "spellCostPct4": "spPct4",
    "spellCostRaw4": "spRaw4",

    "rainbowSpellDamageRaw": "rainbowRaw",
    "sprint": "sprint",
    "sprintRegen": "sprintReg",
    "jumpHeight": "jh",
    "lootQuality": "lq",

    "gatherXpBonus": "gXp",
    "gatherSpeed": "gSpd",
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

    item["type"] = item["type"].lower()

with open("clean.json", "w") as outfile:
    outfile.write(json.dumps(data, indent=2))
with open("compress.json", "w") as outfile:
    outfile.write(json.dumps(data))
