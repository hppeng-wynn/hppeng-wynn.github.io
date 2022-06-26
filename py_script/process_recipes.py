"""
Used to process the raw data about crafting recipes pulled from the API.

Usage: 
- python process_recipes.py [infile] [outfile] 
OR
- python process_recipes.py [infile and outfile]
"""

import json
import sys
import os
import base64
import argparse

parser = argparse.ArgumentParser(description="Process raw pulled recipe data.")
parser.add_argument('infile', help='input file to read data from')
parser.add_argument('outfile', help='output file to dump clean data into')
args = parser.parse_args()
infile, outfile = args.infile, args.outfile

with open(infile, "r") as in_file:
    recipe_data = json.loads(in_file.read())
recipes = recipe_data["recipes"]

if os.path.exists("recipe_map.json"):
    with open("recipe_map.json","r") as recipe_mapfile:
        recipe_map = json.load(recipe_mapfile)
else:
    recipe_map = {recipe["name"]: i for i, recipe in enumerate(recipes)}

recipe_translate_mappings = { 
    "level" : "lvl",
    "id" : "name",
}
recipe_delete_keys = [ #lol

]

for recipe in recipes:
    for key in recipe_delete_keys:
        if key in recipe:
            del recipe[key]
    for k, v in recipe_translate_mappings.items():
        if k in recipe:
            recipe[v] = recipe[k]
            del recipe[k]
    if not (recipe["name"] in recipe_map):
        recipe_map[recipe["name"]] = len(recipe_map)
        print(f'New Recipe: {recipe["name"]}')
    recipe["id"] = recipe_map[recipe["name"]]

#save recipe id map
with open("recipe_map.json", "w") as recipe_mapfile:
    json.dump(recipe_map, recipe_mapfile, indent = 2)

#save recipe data
with open(outfile, "w+") as out_file:
    json.dump(recipe_data, out_file)