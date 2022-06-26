"""
Used to validate item file - searches for duplicate items. Does not change the file.

TODO: Eventually integrate this into the process scripts, including ings and recipes

Usage:
python validate.py [input file]
"""

import json
import sys

with open(sys.argv[1]) as infile:
    data = json.load(infile)

duplicate_map = dict()
for item in data["items"]:
    if item["name"] in duplicate_map:
        print("DUPLICATE: " + str(item["id"]) + " <-> " + str(duplicate_map[item["name"]]["id"]))
    else:
        duplicate_map[item["name"]] = item
