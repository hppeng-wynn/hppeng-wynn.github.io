import requests
import json
import time

#used for requesting the api
'''response = requests.get("https://api.wynncraft.com/public_api.php?action=territoryList")
with open("terrs.json", "w") as outfile:
    outfile.write(json.dumps(response.json()))'''

#used for cleaning the data
'''with open("terrs.json", "r") as infile:
    data = json.load(infile)

data = data["territories"]
delkeys = ["territory","acquired","attacker"]

for t in data:
    for key in delkeys:
        del data[t][key]
    data[t]["neighbors"] = []


with open("terrs_compress.json", "w") as outfile:
    json.dump(data,outfile)
with open("terrs_clean.json", "w") as outfile:
    json.dump(data,outfile,indent = 2)'''

#used for pushing data to compress (edit in clean, move to compress)
'''with open("terrs.json", "r") as infile:
    data = json.load(infile)["territories"]'''

'''with open("terrs_clean.json", "r") as infile:
    newdata = json.load(infile)'''

'''for t in newdata:
    del newdata[t]["attacker"]
    del newdata[t]["acquired"]'''
    

'''response = requests.get("https://gist.githubusercontent.com/kristofbolyai/87ae828ecc740424c0f4b3749b2287ed/raw/0735f2e8bb2d2177ba0e7e96ade421621070a236/territories.json").json()
for t in data:
    data[t]["neighbors"] = response[t]["Routes"]
    data[t]["resources"] = response[t]["Resources"]
    data[t]["storage"] = response[t]["Storage"]
    data[t]["emeralds"] = response[t]["Emeralds"]
    data[t]["doubleemeralds"] = response[t]["DoubleEmerald"]
    data[t]["doubleresource"] = response[t]["DoubleResource"]'''

'''with open("terrs_clean.json", "w") as outfile:
    json.dump(newdata,outfile,indent=2) 

with open("terrs_compress.json", "w") as outfile:
    json.dump(newdata,outfile)'''

response = requests.get('https://api.wynncraft.com/public_api.php?action=mapLocations').json()
del response["request"]

with open("maploc.json", "w") as outfile:
    json.dump(response, outfile)
with open("maploc_clean.json", "w") as outfile:
    json.dump(response, outfile, indent = 2)
with open("maploc_compress.json", "w") as outfile:
    json.dump(response, outfile)