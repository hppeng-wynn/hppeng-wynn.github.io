"""

NOTE!!!!!!!

DEMON TIDE 1.20 IS HARD CODED!

AMBIVALENCE IS REMOVED!

"""

import json

with open("dump.json", "r") as infile:
    data = json.loads(infile.read())

items = data["items"]
del data["request"]

import os
sets = dict()
item_set_map = dict()
for filename in os.listdir('sets'):
    if "json" not in filename:
        continue
    set_name = filename[1:].split(".")[0].replace("+", " ").replace("%27", "'")
    with open("sets/"+filename) as set_info:
        set_obj = json.load(set_info)
        for item in set_obj["items"]:
            item_set_map[item] = set_name
        sets[set_name] = set_obj

data["sets"] = sets

translate_mappings = {
    #"name": "name",
    #"displayName": "displayName",
    #"tier": "tier",
    #"set": "set",
    "sockets": "slots",
    #"type": "type",
    #"armorType": "armorType", (deleted)
    #"armorColor": "color", (deleted)
    #"addedLore": "lore", (deleted)
    #"material": "material", (deleted)
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
    "exploding": "expd",
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
    #"sprint": "sprint",
    "sprintRegen": "sprintReg",
    "jumpHeight": "jh",
    "lootQuality": "lq",

    "gatherXpBonus": "gXp",
    "gatherSpeed": "gSpd",
}

delete_keys = [
    "addedLore",
    #"skin",
    "armorType",
    "armorColor",
    "material"
]

import os
if os.path.exists("id_map.json"):
    with open("id_map.json","r") as id_mapfile:
        id_map = json.load(id_mapfile)
else:
    id_map = {item["name"]: i for i, item in enumerate(items)}
        

texture_names = []

import base64
for item in items:
    for key in delete_keys:
        if key in item:
            del item[key]

    for k, v in translate_mappings.items():
        if k in item:
            item[v] = item[k]
            del item[k]

    if not (item["name"] in id_map):
        id_map[item["name"]] = len(id_map)
        print(f'New item: {item["name"]}')
    item["id"] = id_map[item["name"]]

    item["type"] = item["type"].lower()
    if item["name"] in item_set_map:
        item["set"] = item_set_map[item["name"]]

with open("1_20_ci.json", "r") as ci_file:
    ci_items = json.load(ci_file)
    items.extend(ci_items)

with open("id_map.json","w") as id_mapfile:
    json.dump(id_map, id_mapfile, indent=2)
with open("clean.json", "w") as outfile:
    json.dump(data, outfile, indent=2)
with open("compress.json", "w") as outfile:
    json.dump(data, outfile)