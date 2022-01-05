import os

'''takes the data in updated.json and tomes.json to update the tomes in the db.'''

with open("updated.json", "r") as oldfile:
    data = json.load(oldfile)
with open("tomes.json", "r") as tomesfile:
    tome_data = json.load(tomesfile)

#This probably does not work. I have not checked :)
tomes = dict()
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

with open("clean.json", "w") as outfile:
    json.dump(data, outfile, indent=2)
with open("compress.json", "w") as outfile:
    json.dump(data, outfile)
