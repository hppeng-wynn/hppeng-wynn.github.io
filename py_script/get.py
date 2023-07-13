"""
Used to GET data from the Wynncraft API. Has shorthand options and allows 
for requesting from a specific url.

Usage: python get.py [url or command] [outfile rel path]

Relevant page: https://docs.wynncraft.com/
"""

import argparse
import json

import numpy as np
import requests

parser = argparse.ArgumentParser(description="Pull data from wynn API.")
parser.add_argument('target', help='an API page, or preset [items, ings, recipes, terrs, maploc]')
parser.add_argument('outfile', help='output file to dump results into')
args = parser.parse_args()

req, outfile = args.target, args.outfile

CURR_WYNN_VERS = 2.0

#default to empty file output
response = {} 

if req.lower() == "items":
    response = requests.get("https://api.wynncraft.com/public_api.php?action=itemDB&category=all").json()
elif req.lower() == "ings":
    response = {"ings":[]}
    for i in range(4):
        response['ings'].extend(requests.get("https://api.wynncraft.com/v2/ingredient/search/tier/" + str(i)).json()['data'])
elif req.lower() == "recipes":
    import time
    temp = requests.get("https://api.wynncraft.com/v2/recipe/list").json()
    response = {"recipes":[]}
    for i in range(len(temp['data'])):
        response["recipes"].extend(requests.get("https://api.wynncraft.com/v2/recipe/get/" + temp['data'][i]).json()['data'])
        print("" + str(i) + " / " + str(len(temp['data'])))
        time.sleep(1)
elif req.lower() == "terrs":
    response = requests.get("https://api.wynncraft.com/public_api.php?action=territoryList").json()['territories']
    delkeys = ["territory","acquired","attacker"]
    for t in response:
        for key in delkeys:
            del response[t][key]
        response[t]["neighbors"] = []

    #Dependency on a third-party manually-collected data source. May not update in sync with API.
    terr_data = requests.get("https://gist.githubusercontent.com/kristofbolyai/87ae828ecc740424c0f4b3749b2287ed/raw/0735f2e8bb2d2177ba0e7e96ade421621070a236/territories.json").json()
    for t in data:
        response[t]["neighbors"] = data[t]["Routes"]
        response[t]["resources"] = data[t]["Resources"]
        response[t]["storage"] = data[t]["Storage"]
        response[t]["emeralds"] = data[t]["Emeralds"]
        response[t]["doubleemeralds"] = data[t]["DoubleEmerald"]
        response[t]["doubleresource"] = data[t]["DoubleResource"]

elif req.lower() == "maploc":
    response = requests.get('https://api.wynncraft.com/public_api.php?action=mapLocations')
else:
    response = requests.get(req)

data = response#.json()
data['version'] = CURR_WYNN_VERS

json.dump(data, open(outfile, "w+"))
