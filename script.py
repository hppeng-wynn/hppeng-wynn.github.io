import requests
import json
response = requests.get("https://api.wynncraft.com/public_api.php?action=itemDB&search=atlas").json()
atlas = response['items'][0]

with open('test.json',"w") as outfile:
    json.dump(atlas, outfile, indent = 2)

print(atlas)
