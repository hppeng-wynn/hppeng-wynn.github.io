"""
Used to GET data from the Wynncraft API. Has shorthand options and allows 
for requesting from a specific url.

Usage: python get.py [url or command] [outfile rel path]

Relevant page: https://docs.wynncraft.com/
"""

if __name__ == "__main__":
    import requests
    import json
    import numpy as np
    import sys

    #req can either be a link to an API page OR a preset default
    req = sys.argv[1]
    outfile = sys.argv[2]
    response = {} #default to empty file output

    if req.lower() is "items":
        response = requests.get("https://api.wynncraft.com/public_api.php?action=itemDB&category=all")
    elif req.lower() is "ings":
        response = requests.get("https://api.wynncraft.com/v2/ingredient/list")
    elif req.lower() is "recipes":
        response = requests.get("https://api.wynncraft.com/v2/recipe/list")
    else:
        response = requests.get(req)

    with open("dump.json", "w") as outfile:
        outfile.write(json.dumps(response.json()))

    json.dump(response.json(), open(outfile, "w"))