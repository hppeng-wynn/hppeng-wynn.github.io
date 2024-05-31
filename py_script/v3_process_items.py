"""
Used to process the raw item data pulled from the API.

Usage: 
- python process_items.py [infile] [outfile] 
OR
- python process_items.py [infile and outfile]


NOTE: id_map.json is due for change. Should be updated manually when Wynn2.0/corresponding WB version drops.
"""

import json
import sys
import os
import base64
import argparse
from items_common import translate_mappings

parser = argparse.ArgumentParser(description="Process raw pulled item data.")
parser.add_argument('infile', help='input file to read data from', default=None, nargs='?')
#parser.add_argument('outfile', help='output file to dump clean data into')
args = parser.parse_args()
if args.infile is None:
    print("Grabbing json data from wynn api")
    from item_wrapper import Items
    api_data = Items().get_all_items()
    json.dump(api_data, open('dump.json', 'w'))
else:
    with open(args.infile, "r") as in_file:
        api_data = json.load(in_file)

def translate_single_item(key, entry, name, directives, accumulate):
    ret = entry
    try:
        if 'min' in entry and 'max' in entry:
            if 'raw' in entry:
                ret = entry['raw']
            else:
                ret = [entry['min'], entry['max']]
    except:
        pass

    i = 0
    while i < len(directives):
        directive = directives[i]
        if directive == 'DELETE':
            ret = None
        elif directive == 'CAPS':
            ret = ret[0].upper() + ret[1:]
        elif directive == 'ALLCAPS':
            ret = ret.upper()
        elif directive == 'STR_RANGE':
            if 'min' in entry and 'max' in entry:
                ret = f"{entry['min']}-{entry['max']}"
        elif directive == 'UNWRAP':
            recursive_translate(entry, accumulate, name, translate_single_item)
            ret = None
        i += 1
    return ret

def translate_single_ing(key, entry, name, directives, accumulate):
    ret = entry
    try:
        if 'min' in entry and 'max' in entry:
            ret = {
                'minimum': entry['min'],
                'maximum': entry['max']
            }
    except:
        pass

    i = 0
    while i < len(directives):
        directive = directives[i]
        if directive == 'DELETE':
            ret = None
        elif directive == 'UNWRAP':
            recursive_translate(entry, accumulate, name, translate_single_ing)
            ret = None
        elif directive[:8] == 'RECURSE_':
            ret = recursive_translate(entry, {}, directive[8:], translate_single_ing)
        i += 1
    return ret

def recursive_translate(entry, result, path, translate_single):
    mapping = translate_mappings[path]

    for k, v in entry.items():
        # Translate the item.
        if k in mapping:
            tmp = mapping[k].split(';')
            directives, translated_name = tmp[:-1], tmp[-1]
            res = translate_single(k, v, translated_name, directives, result)
            if res is not None:
                result[translated_name] = res
            continue

        # pass it through unchanged.
        result[k] = v
    return result

armor_types = ['helmet', 'chestplate', 'leggings', 'boots']
tome_type_translation = {
    'gatheringxp': 'gatherXpTome',
    'dungeonxp': 'dungeonXpTome',
    'slayingxp': 'mobXpTome',
    'guildtome': 'guildTome',
    'mobdefence': 'armorTome',
    'mobdamage': 'weaponTome',
    'lootrun': 'lootrunTome',
}

def translate_entry(entry):
    """
    Convert an api entry into an appropriate parsed item.

    Returns a pair: (converted, type)
    where `type` is "item", "ingredient", "tome", "material", "charm", or None
    and converted might be None if the conversion failed.
    """
    # sketchily infer what kind of item we're dealing with, and translate it appropriately.
    if "type" in entry:
        # only items have this field.
        res = recursive_translate(entry, {}, "item", translate_single_item)
        if res['type'] in armor_types:
            res['category'] = 'armor'
        else:
            res['category'] = 'weapon'
            for element in 'netwfa':
                damage_key = element + 'Dam'
                if damage_key not in res:
                    res[damage_key] = '0-0'
        return res, 'item'
    if "accessoryType" in entry:
        # only accessories have this field.
        return recursive_translate(entry, {'category': 'accessory'}, "item", translate_single_item), "item"
    if "itemOnlyIDs" in entry:
        # only ingredients have this field.
        res = recursive_translate(entry, {}, "ingredient", translate_single_ing)
        return res, "ingredient"
        #return recursive_translate(entry, {}, "ing"), "ingredient"
    if "tomeType" in entry:
        # only tomes have this field.
        print(entry)
        res = recursive_translate(entry, {}, "tome", translate_single_item)
        res['category'] = 'tome'
        res['fixID'] = False
        res['type'] = tome_type_translation[res['type']]
        print(res)
        return res, "tome"
    if "craftable" in entry:
        return None, "material"
    
    # I think the only things left are charms, we just don't classify them.
    return None, None

with open("id_map.json", "r") as id_map_file:
    id_map = json.load(id_map_file)
used_ids = set([v for k, v in id_map.items()])
max_id = 0

with open("ing_map.json","r") as ing_map_file:
    ing_map = json.load(ing_map_file)
with open("../tome_map.json","r") as tome_map_file:
    tome_map = json.load(tome_map_file)

items = []
ingreds = []
tomes = []
for name, entry in api_data.items():
    entry['name'] = name
    res, entry_type = translate_entry(entry)
    print(f"Parsed {name}, type {entry_type}")
    if res is None:
        continue
    # TODO: make this a map or smth less ugly code
    if entry_type == 'item':
        items.append(res)
    elif entry_type == 'ingredient':
        ingreds.append(res)
    elif entry_type == 'tome':
        tomes.append(res)

with open("../clean.json", "r") as oldfile:
    old_data = json.load(oldfile)
    old_items = old_data['items']
with open("../ingreds_clean.json", "r") as ingfile:
    old_ingreds = json.load(ingfile)
with open("../tomes.json", "r") as tomefile:
    old_tome_data = json.load(tomefile)
    old_tomes = old_tome_data['tomes']

known_item_names = set()
known_ingred_names = set()
known_tome_names = set()
for item in items:
    known_item_names.add(item["name"])
for ingred in ingreds:
    known_ingred_names.add(ingred["name"])
for tome in tomes:
    known_tome_names.add(tome["name"])

tome_value_map = {}
for item in old_items:
    if item["name"] not in known_item_names:
        print(f'Unknown old item: {item["name"]}!!!')
for ingred in old_ingreds:
    if ingred["name"] not in known_ingred_names:
        print(f'Unknown old ingred: {ingred["name"]}!!!')
for tome in old_tomes:
    if tome["name"] not in known_tome_names:
        print(f'Unknown old tome: {tome["name"]}!!!')
    tome_value_map[tome['name']] = tome

# TODO hack pull the major id file
major_ids_filename = "../js/builder/major_ids_clean.json"
with open(major_ids_filename, 'r') as major_ids_file:
    major_ids_map = json.load(major_ids_file)
    major_ids_reverse_map = { v['displayName'] : k for k, v in major_ids_map.items() }

for item in items:
    # NOTE: HACKY ITEM FIXES!
    if 'majorIds' in item:
        item['majorIds'] = [ major_ids_reverse_map[item['majorIds']['name']] ]
    if item['tier'] == 'Common':
        item['tier'] = 'Normal'

    if not (item["name"] in id_map):
        while max_id in used_ids:
            max_id += 1
        used_ids.add(max_id)
        id_map[item["name"]] = max_id
        print(f'New item: {item["name"]} (id: {max_id})')
    item["id"] = id_map[item["name"]]

for ingred in ingreds:
    # HACKY ING FIXES!
    ingred['itemIDs']['dura'] = int(ingred['itemIDs']['dura'] / 1000)
    ingred['skills'] = [x.upper() for x in ingred['skills']]
    if 'ids' not in ingred:
        ingred['ids'] = dict()
        print(f"ing missing 'ids': {ingred['name']}")
    if 'consumableIDs' not in ingred:
        ingred['consumableIDs'] = {'dura': 0, 'charges': 0}
        print(f"ing missing 'consumableIDs': {ingred['name']}")

    if not (ingred["name"] in ing_map):
        new_id = len(ing_map)
        ing_map[ingred["name"]] = new_id
        print(f'New ingred: {ingred["name"]} (id: {new_id})')
    ingred["id"] = ing_map[ingred["name"]]

for tome in tomes:
    if not (tome['name'] in tome_map):
        new_id = len(tome_map)
        tome_map[tome['name']] = new_id
        print(f'New tome: {tome["name"]} (id: {new_id})')
        tome['alias'] = 'NO_ALIAS'
    else:
        old_tome = tome_value_map[tome['name']]
        tome['alias'] = old_tome['alias']
    tome['id'] = tome_map[tome['name']]

#write items back into data
old_data["items"] = items

#save id map
with open("id_map.json","w") as id_map_file:
    json.dump(id_map, id_map_file, indent=2)
with open("ing_map.json","w") as ing_map_file:
    json.dump(ing_map, ing_map_file, indent=2)
with open("../tome_map.json","w") as tome_map_file:
    json.dump(tome_map, tome_map_file, indent=2)


#write the data back to the outfile
with open('item_out.json', "w+") as out_file:
    json.dump(old_data, out_file, ensure_ascii=False, separators=(',', ':'))

with open('ing_out.json', "w+") as out_file:
    json.dump(ingreds, out_file, ensure_ascii=False, separators=(',', ':'))

with open('tome_out.json', "w+") as out_file:
    json.dump({'tomes': tomes}, out_file, ensure_ascii=False, separators=(',', ':'))
