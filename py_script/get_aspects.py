import requests
import json
import re

from json_diff import json_diff

api_base_url = "https://beta-api.wynncraft.com/v3/aspects/"
def get_aspect_data(wynn_class):
    url = api_base_url + wynn_class.lower()
    aspect_data = requests.get(url).json()
    return aspect_data

replace_strings = {
    "\ue01f ": "", # duration
    "\ue01e ": "", # Positive number
    "\ue01d ": "", # AOE
    "\ue01c ": "", # Range
    "\ue01b ": "", # Negative number
    "\u2741 ": "", # Unsure?

    " \u27bd": "", # Focus
    " \u2699": "", # Discombobulated

    " \u2248": "", # Winded
    " \u273a": "", # Mana Bank

    " \u271c": "", # Marks
    " \u2042": "", # Clones

    " \u2695": "", # Blood Pool

    "\u00b0": " degrees", # Degree symbol

    "\ue005 ": "Neutral ", # Neutral just says "Damage"
    "\ue004 ": "", # Water
    "\ue003 ": "", # Thunder
    "\ue002 ": "", # Fire
    "\ue001 ": "", # Earth
    "\ue000 ": "", # Air
}

def clean_description(strings):
    # Source: https://stackoverflow.com/questions/37018475/python-remove-all-html-tags-from-string
    def sub(s):
        for k, v in replace_strings.items():
            s = re.sub(k, v, s)
        return s
    return ' '.join(sub(re.sub('<[^<]+?>', '', text)) for text in strings)


if __name__ == "__main__":
    with open("aspect_map.json", "r") as aspect_ids_file:
        aspect_ids = json.load(aspect_ids_file)

    classes = [
        "Archer",
        "Warrior",
        "Mage",
        "Assassin",
        "Shaman"
    ]
    
    empty_aspect = {
        "displayName": None,
        "id": 0,
        "class": None,
        "tier": None,
        "tiers": [
            {
                "threshold": 0,
                "description": None,
                "abilities": []
            }
        ]
    }

    with open("../js/builder/aspects.json", "r") as aspects_data_file:
        old_aspect_data = json.load(aspects_data_file)
    
    try:
        with open("api_aspects.json", "r") as old_api_file:
            old_api_data = json.load(old_api_file)
    except FileNotFoundError:
        old_api_data = {c: None for c in classes}

    api_data = {}

    aspect_changes = {c: [] for c in classes}
    all_output_unordered = {c: {} for c in classes}

    for wynn_class in classes:
        print(f"Processing aspects for {wynn_class}...")
        known_aspects = old_aspect_data[wynn_class]
        known_aspect_map = {aspect['displayName']: aspect for aspect in known_aspects}

        aspect_data = get_aspect_data(wynn_class)
        api_data[wynn_class] = aspect_data
        old_class_data = old_api_data[wynn_class]

        id_map = aspect_ids[wynn_class]
        for name, aspect in aspect_data.items():
            
            old_tier_data = None
            if name in known_aspect_map:
                old_tier_data = known_aspect_map[name]['tiers']

            tier_data = []
            for i in range(len(aspect['tiers'])):
                data = aspect['tiers'][str(i+1)]

                if old_tier_data is not None and len(old_tier_data) > i:
                    abils = old_tier_data[i]['abilities']
                else:
                    abils = []
                tier_data.append({
                    'threshold': data['threshold'],
                    'description': clean_description(data['description']),
                    'abilities': abils
                })

            if name not in id_map:
                print(f"New aspect: {name}")
                aspect_id = len(id_map)
                id_map[name] = aspect_id

            else:
                aspect_id = id_map[name]
                if old_class_data is not None:
                    if name not in old_class_data:
                        print(f"Already registered new aspect [{name}]? Likely a bug!")
                        continue
                    if json_diff(old_class_data[name], aspect):
                        aspect_changes[wynn_class].append(name)

            aspect_info = {
                "displayName": name,
                "id": aspect_id,
                "tier": aspect['rarity'][0].upper() + aspect['rarity'][1:],
                "tiers": tier_data
            }
            all_output_unordered[wynn_class][name] = aspect_info

    all_output = {c: [] for c in classes}
    for wynn_class in classes:
        known_aspects = old_aspect_data[wynn_class]
        new_aspects = all_output_unordered[wynn_class]
        for aspect in known_aspects:
            aspect_name = aspect['displayName']
            if aspect_name in new_aspects:
                all_output[wynn_class].append(new_aspects[aspect_name])
                del new_aspects[aspect_name]

        all_output[wynn_class].extend(new_aspects.values())
    
    print("Finished processing aspects")
    print("Summary of changed aspects:")
    for wynn_class in classes:
        print(wynn_class)
        print("---------------------")
        if len(aspect_changes[wynn_class]) > 0:
            print("\t", "\n\t".join(aspect_changes[wynn_class]))
        else:
            print("No Changes")
        print("---------------------")

    with open("api_aspects.json", "w") as api_file:
        json.dump(api_data, api_file, indent=2)

    with open("aspects.json", "w") as output_file:
        json.dump(all_output, output_file, indent=2)

    with open("aspect_map.json", "w") as aspect_ids_file:
        json.dump(aspect_ids, aspect_ids_file, indent=2)
