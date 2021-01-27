import json
import requests

#Nothing to ingreds.json

arr = []
for i in range(4):
    response = requests.get("https://api.wynncraft.com/v2/ingredient/search/tier/" + str(i))
    arr.append(response.json())

with open("ingreds.json", "w") as outfile:
    outfile.write(json.dumps(arr))



'''with open("ingreds_compress.json", "w") as infile:
    data = json.loads(infile.read())

with open("ingreds_clean.json", "w") as outfile:
    json.dump(data, outfile,indent = 2) #needs further cleaning'''
