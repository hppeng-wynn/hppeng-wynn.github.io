

import json

with open("../ingreds.json", "r") as infile:
    ing_data = json.loads(infile.read())
ings = ing_data
#this data does not have request :)

import os
if os.path.exists("../ing_map.json"):
    with open("../ing_map.json","r") as ing_mapfile:
        ing_map = json.load(ing_mapfile)
else:
    ing_map = {ing["name"]: i for i, ing in enumerate(ings)}
texture_names = []


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
    "JUMP_HEIGHT": "jh", 
    #"rainbowSpellDamageRaw": "rainbowRaw",
    "STAMINA": "sprint",
    "STAMINA_REGEN": "sprintReg",
    "GATHER_XP_BONUS": "gXp",
    "GATHER_SPEED": "gSpd",
    #"lootQuality": "lq",    
}
ing_delete_keys = [
    "sprite",

]

print("loaded all files.")

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
            print(ing['name'])
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
    
    if not (ing["name"] in ing_map):
        ing_map[ing["name"]] = len(ing_map)
        print(f'New Ingred: {ing["name"]}')
    ing["id"] = ing_map[ing["name"]]


with open("../ingreds_clean.json", "w") as outfile:
    json.dump(ing_data, outfile, indent = 2)
with open("../ingreds_compress.json", "w") as outfile:
    json.dump(ing_data, outfile)
with open("../ing_map.json", "w") as ing_mapfile:
    json.dump(ing_map, ing_mapfile, indent = 2)


print('All ing jsons updated.')