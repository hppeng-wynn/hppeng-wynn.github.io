import json
import requests
import numpy as np
#Nothing to ingreds.json

arr = np.array([])
for i in range(4):
    response = requests.get("https://api.wynncraft.com/v2/ingredient/search/tier/" + str(i))
    arr = np.append(arr, np.array(response.json()['data']))


with open("../ingreds.json", "w") as outfile:
    outfile.write(json.dumps(list(arr)))

with open("../ingreds_compress.json", "w") as outfile:
    outfile.write(json.dumps(list(arr)))

with open("../ingreds_clean.json", "w") as outfile:
    json.dump(list(arr), outfile, indent = 2) #needs further cleaning
