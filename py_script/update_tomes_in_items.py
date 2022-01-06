import os
import json

'''takes updated data in tomes.json and updates the tome map'''

#read in tomes json file
with open("../tomes.json", "r") as tomesfile: 
    tome_data = json.load(tomesfile)

tomes = dict()
tome_mapping = dict()


max_id = 0
for tome in tome_data:
    if "tomeID" in tome:
        if tome["tomeID"] > max_id: 
            max_id = tome["tomeID"]
        tome_mapping[tome["name"]] = tome["tomeID"]
i = max_id + 1

for tome in tome_data:
    if "tomeID" not in tome:
        tome["tomeID"] = i
        tome_mapping[tome["name"]] = i
        i += 1
    
    tomes[tome["name"]] = tome


'''
with open("clean.json", "w") as outfile:
    json.dump(data, outfile, indent=2)
with open("compress.json", "w") as outfile:
    json.dump(data, outfile)
'''
with open("tome_map.json", "w") as outfile:
    json.dump(tome_mapping, outfile, indent = 2)
with open("../tomes2.json", "w") as outfile:
    json.dump(tome_data, outfile, indent = 2)


