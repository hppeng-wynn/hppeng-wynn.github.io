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

with open("recipes_compress.json", "r") as infile:
    recipe_data = json.loads(infile.read())
recipes = recipe_data["recipes"]
#this data does not have request :)
with open("ingreds_compress.json", "r") as infile:
    ing_data = json.loads(infile.read())
ings = ing_data["ingredients"]
#this data does not have request :)
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

translate_mappings = { #this is used for items.
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

ing_translate_mappings = {
    #"name" : "name",
    #"tier" :"tier",
    "level" : "lvl",
    #"skills" : "skills",
    "identifications" : "ids",
    "itemOnlyIDs" : "itemIDs",
    "consumableOnlyIDs" : "consumableIDs",
    "ingredientPositionModifiers" : "posMods",
}
ing_metaID_mappings = {
#item only IDs
    "durabilityModifier": "dura",
    "strengthRequirement": "strReq",
    "dexterityRequirement": "dexReq",
    "intelligenceRequirement": "intReq",
    "defenceRequirement": "defReq",
    "agilityRequirement": "agiReq",
    "attackSpeedModifier": "atkTier",
    "powderSlotModifier": "slotMod",
#consumable only IDs
    "duration": "dura",
    #"charges": "charges",
#position modifiers
    #"left": "left",
    #"right": "right",
    #"above": "above",
    #"under": "under",
    #"touching": "touching",
    #"notTouching": "notTouching",
}
ing_id_mappings = { #specifically for the id field of an ingredient.
    #"name": "name",
    #"displayName": "displayName",
    #"tier": "tier",
    #"set": "set",
    #"sockets": "slots",
    #"type": "type",
    #"armorType": "armorType", (deleted)
    #"armorColor": "color", (deleted)
    #"addedLore": "lore", (deleted)
    #"material": "material", (deleted)
    #"dropType": "drop",
    #"quest": "quest",
    #"restrictions": "restrict",
    #"damage": "nDam",
    #"fireDamage": "fDam",
    #"waterDamage": "wDam",
    #"airDamage": "aDam",
    #"thunderDamage": "tDam",
    #"earthDamage": "eDam",
    #"ATTACKSPEED": "atkSpd",
    #"health": "hp",
    "FIREDEFENSE": "fDefPct",
    "WATERDEFENSE": "wDefPct",
    "AIRDEFENSE": "aDefPct",
    "THUNDERDEFENSE": "tDefPct",
    "EARTHDEFENSE": "eDefPct",
    #"level": "lvl",
    #"classRequirement": "classReq",
    #"strength": "strReq",
    #"dexterity": "dexReq",
    #"intelligence": "intReq",
    #"agility": "agiReq",
    #"defense": "defReq",
    "HEALTHREGEN": "hprPct",
    "MANAREGEN": "mr",
    "SPELLDAMAGE": "sdPct",
    "DAMAGEBONUS": "mdPct",
    "LIFESTEAL": "ls",
    "MANASTEAL": "ms",
    "XPBONUS": "xpb",
    "LOOTBONUS": "lb",
    "LOOT_QUALITY": "lq",
    "REFLECTION": "ref",
    "STRENGTHPOINTS": "str",
    "DEXTERITYPOINTS": "dex",
    "INTELLIGENCEPOINTS": "int",
    "AGILITYPOINTS": "agi",
    "DEFENSEPOINTS": "def",
    "THORNS": "thorns",
    "EXPLODING": "expd",
    "SPEED": "spd",
    "ATTACKSPEED": "atkTier",
    "POISON": "poison",
    "HEALTHBONUS": "hpBonus",
    "SOULPOINTS": "spRegen",
    "EMERALDSTEALING": "eSteal",
    "HEALTHREGENRAW": "hprRaw",
    "SPELLDAMAGERAW": "sdRaw",
    "DAMAGEBONUSRAW": "mdRaw",
    "FIREDAMAGEBONUS": "fDamPct",
    "WATERDAMAGEBONUS": "wDamPct",
    "AIRDAMAGEBONUS": "aDamPct",
    "THUNDERDAMAGEBONUS": "tDamPct",
    "EARTHDAMAGEBONUS": "eDamPct",
    #"accessoryType": "type",
    #"identified": "fixID",
    #"skin": "skin",
    #"category": "category",
    #THESE ARE NOT IN ANY INGREDIENT YET. THEY MAY NOT HAVE THE CORRECT ID NAME
    "SPELLCOSTPCT1": "spPct1",
    "SPELLCOSTRAW1": "spRaw1",
    "SPELLCOSTPCT2": "spPct2",
    "SPELLCOSTRAW2": "spRaw2",
    "SPELLCOSTPCT3": "spPct3",
    "SPELLCOSTRAW3": "spRaw3",
    "SPELLCOSTPCT4": "spPct4",
    "SPELLCOSTRAW4": "spRaw4",
    "JUMPHEIGHT": "jh", 
    #"rainbowSpellDamageRaw": "rainbowRaw",
    "SPRINT": "sprint",
    "SPRINGREGEN": "sprintReg",
    "GATHERXPBONUS": "gXp",
    "GATHERSPEED": "gSpd",
    #"lootQuality": "lq",    
}
ing_delete_keys = [
    "sprite",

]

recipe_translate_mappings = { 
    "level" : "lvl",
}
recipe_delete_keys = [ #lol

]

import os
if os.path.exists("id_map.json"):
    with open("id_map.json","r") as id_mapfile:
        id_map = json.load(id_mapfile)
else:
    id_map = {item["name"]: i for i, item in enumerate(items)}
# wtf is this hpp

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

print(ings[0])
for ing in ings:
    for key in ing_delete_keys:
        if key in ing:
            del ing[key]

    for k, v in ing_translate_mappings.items():
        if k in ing:
            ing[v] = ing[k]
            del ing[k]
    
    for k, v in ing_metaID_mappings.items():
        if k in ing['itemIDs']:
            print(ing['itemIDs'])
            ing['itemIDs'][v] = ing['itemIDs'][k]
            del ing['itemIDs'][k]
        elif k in ing['consumableIDs']:
            ing['consumableIDs'][v] = ing['consumableIDs'][k]
            del ing['consumableIDs'][k]     
        '''elif k in ing.posMods: #Not subbing, if we do sub uncomment this.
            ing.posMods[v] = ing.posMods[k]
            del ing.posMods[k]  ''' 

    for k, v in ing_id_mappings.items():
        if k in ing['ids']: #yes this is dumb
            ing['ids'][v] = ing['ids'][k]
            del ing['ids'][k]


for recipe in recipes:
    for key in recipe_delete_keys:
        if key in recipe:
            del recipe[key]

    for k, v in recipe_translate_mappings.items():
        if k in recipe:
            recipe[v] = recipe[k]
            del recipe[k]


with open("1_20_ci.json", "r") as ci_file:
    ci_items = json.load(ci_file)
    items.extend(ci_items)

'''with open("id_map.json","w") as id_mapfile:
    json.dump(id_map, id_mapfile, indent=2)
with open("clean.json", "w") as outfile:
    json.dump(data, outfile, indent=2)
with open("compress.json", "w") as outfile:
    json.dump(data, outfile)'''
with open("ingreds_clean.json", "w") as outfile:
    json.dump(ing_data, outfile, indent = 2)
with open("ingreds_compress2.json", "w") as outfile:
    json.dump(ing_data, outfile)
with open("recipes_clean.json", "w") as outfile:
    json.dump(recipe_data, outfile, indent = 2)
with open("recipes_compress2.json", "w") as outfile:
    json.dump(recipe_data, outfile)