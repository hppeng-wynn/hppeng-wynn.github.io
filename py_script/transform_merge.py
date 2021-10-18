"""

NOTE!!!!!!!

DEMON TIDE 1.20 IS HARD CODED!

AMBIVALENCE IS REMOVED!

"""

import json

with open("dump.json", "r") as infile:
    data = json.load(infile)

with open("updated.json", "r") as oldfile:
    old_data = json.load(oldfile)

items = data["items"]
old_items = old_data["items"]
if "request" in data:
    del data["request"]

# import os
# sets = dict()
# for filename in os.listdir('sets'):
#     if "json" not in filename:
#         continue
#     set_name = filename[1:].split(".")[0].replace("+", " ").replace("%27", "'")
#     with open("sets/"+filename) as set_info:
#         set_obj = json.load(set_info)
#         for item in set_obj["items"]:
#             item_set_map[item] = set_name
#         sets[set_name] = set_obj
# 
# data["sets"] = sets
data["sets"] = old_data["sets"]
item_set_map = dict()
for set_name, set_data in data["sets"].items():
    for item_name in set_data["items"]:
        item_set_map[item_name] = set_name

must_mappings = [
    "strength",
    "dexterity",
    "intelligence",
    "agility",
    "defense",
    "strengthPoints",
    "dexterityPoints",
    "intelligencePoints",
    "agilityPoints",
    "defensePoints",
]

translate_mappings = {
    #"name": "name",
    #"displayName": "displayName",
    #"tier": "tier",
    #"set": "set",
    "sockets": "slots",
    #"type": "type",
    #"armorType": "armorType", (deleted)
    "armorColor": "color", #(deleted)
    "addedLore": "lore", #(deleted)
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
    #"addedLore",
    #"skin",
    #"armorType",
    #"armorColor",
    #"material"
]

id_map = {item["name"]: item["id"] for item in old_items}
used_ids = set([v for k, v in id_map.items()])
max_id = 0

known_item_names = set()

for item in items:
    known_item_names.add(item["name"])

old_items_map = dict()
unchanged_items = []
remap_items = []
for item in old_items:
    if "remapID" in item:
        remap_items.append(item)
    elif item["name"] not in known_item_names:
        unchanged_items.append(item)
    old_items_map[item["name"]] = item

for item in items:
    for key in delete_keys:
        if key in item:
            del item[key]
    
    for k in list(item.keys()):
        if (item[k] == 0 or item[k] is None) and not k in must_mappings:
            del item[k]

    for k, v in translate_mappings.items():
        if k in item:
            item[v] = item[k]
            del item[k]

    if not (item["name"] in id_map):
        while max_id in used_ids:
            max_id += 1
        used_ids.add(max_id)
        id_map[item["name"]] = max_id
        print(f'New item: {item["name"]} (id: {max_id})')
    item["id"] = id_map[item["name"]]

    item["type"] = item["type"].lower()
    if "displayName" in item:
        item_name = item["displayName"]
    else:
        item_name = item["name"]
    if item_name in item_set_map:
        item["set"] = item_set_map[item_name]
        if item["name"] in old_items_map:
            old_item = old_items_map[item["name"]]
            if "hideSet" in old_item:
                item["hideSet"] = old_item["hideSet"]

items.extend(unchanged_items)
items.extend(remap_items)
with open("id_map.json","w") as id_mapfile:
    print("{", file=id_mapfile)
    outputs = []
    for v, k in sorted((v, k) for k, v in id_map.items()):
        outputs.append(f' "{k}": {v}')
    print(',\n'.join(outputs), file=id_mapfile)
    print("}", file=id_mapfile)
with open("clean.json", "w") as outfile:
    json.dump(data, outfile, indent=2)
with open("compress.json", "w") as outfile:
    json.dump(data, outfile)
