import json

with open("clean.json") as infile:
    olds = json.load(infile)

items = olds["items"]

item_oldnames_map = dict()
item_newnames_map = dict()

VERSION_STR = " (1.20)"

max_old_id = 0

for item in items:
    item_id = item["id"]
    if "displayName" in item:
        displayName = item["displayName"]
    else:
        displayName = item["name"]
    item_name = displayName.replace(VERSION_STR, "")
    if item_id > 10000:
        map_name = item["name"].replace(VERSION_STR, "")
        item_newnames_map[map_name] = item
        item["displayName"] = item_name
    else:
        item_oldnames_map[item_name] = item
        if item_id > max_old_id:
            max_old_id = item_id

dummy_items = []

for (name, item) in item_newnames_map.items():
    if name in item_oldnames_map:
        old_item = item_oldnames_map[name]
        if "displayName" in item:
            displayName = item["displayName"].replace(VERSION_STR, "")
        else:
            displayName = name
        save_old = ["id","set","quest","drop","restrict", "name"]
        old_mappings = { k: old_item[k] for k in save_old if k in old_item }
        old_item.clear()

        if "restrict" in item:
            del item["restrict"]

        for k in item:
            old_item[k] = item[k]
        for k in old_mappings:
            old_item[k] = old_mappings[k]
        save_id = item["id"]
        item.clear()
        item["id"] = save_id
        item["name"] = str(save_id)
        item["remapID"] = old_item["id"]
    else:
        if "restrict" in item:
            in_str = input(name + " restriction: ").strip()
            if in_str:
                item["restrict"] = in_str
            else:
                del item["restrict"]
        item["name"] = name
        dummy_item = dict()
        dummy_item["id"] = item["id"]
        max_old_id += 1
        item["id"] = max_old_id
        dummy_item["remapID"] = item["id"]
        dummy_items.append(dummy_item)
        
items.extend(dummy_items)

sets = olds["sets"]

data = dict()
data["items"] = items
data["sets"] = sets

with open("updated.json", "w") as outfile:
    json.dump(data, outfile, indent=2)
