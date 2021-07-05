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
