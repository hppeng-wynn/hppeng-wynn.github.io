import requests
import json

response = requests.get("https://api.wynncraft.com/public_api.php?action=itemDB&category=all")

with open("dump.json", "w") as outfile:
    outfile.write(json.dumps(response.json()))
