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
from items_common import translate_mappings, delete_keys

parser = argparse.ArgumentParser(description="Process raw pulled item data.")
parser.add_argument('infile', help='input file to read data from')
parser.add_argument('outfile', help='output file to dump clean data into')
args = parser.parse_args()
infile, outfile = args.infile, args.outfile

with open(infile, "r") as in_file:
    data = json.loads(in_file.read())


items = data["items"]
if "request" in data:
    del data["request"]

with open("../clean.json", "r") as oldfile:
    old_data = json.load(oldfile)
old_items = old_data['items']
id_map = {item["name"]: item["id"] for item in old_items}
with open("id_map.json", "r") as idmap_file:
    id_map = json.load(idmap_file)
used_ids = set([v for k, v in id_map.items()])
max_id = 0

known_item_names = set()

for item in items:
    known_item_names.add(item["name"])

remap_items = []
old_items_map = dict()
for item in old_items:
    if "remapID" in item:
        remap_items.append(item)
    elif item["name"] not in known_item_names:
        print(f'Unknown old item: {item["name"]}!!!')
    old_items_map[item["name"]] = item

for item in items:
    for key in delete_keys:
        if key in item:
            del item[key]
    
    for k in list(item.keys()):
        if (item[k] == 0 or item[k] is None):
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

items.extend(remap_items)

#write items back into data
data["items"] = items

data["sets"] = old_data["sets"]

#save id map
with open("id_map.json","w") as id_mapfile:
    json.dump(id_map, id_mapfile, indent=2)


#write the data back to the outfile
with open(outfile, "w+") as out_file:
    json.dump(data, out_file)

