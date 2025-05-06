import requests
import json
import re

from json_diff import json_diff

api_base_url = "https://api.wynncraft.com/v3/ability/tree/"
def get_tree_data(wynn_class):
    url = api_base_url + wynn_class.lower()
    tree_data = requests.get(url).json()
    return tree_data

cleaner = re.compile('<.*?>') 

# man...
replace_strings = {
    "\ue01f ": "</br>", # duration
    "\ue01e ": "</br>", # Positive number? (I see this used on "effects")
    "\ue01d ": "</br>", # AOE
    "\ue01c ": "</br>", # Range
    "\ue01b ": "", # Negative number
    "\u2741 ": "", # Unsure?
    "\ue007 ": "", # Mana
    "\ue027 ": "</br>", # Cooldown
    "\ue006 ": "</br>", # Heal

    " \ue01a": "", # Focus
    " \u2699": "", # Discombobulated
    " \ue018": "", # Corrupted
    " \u2727": "", # Holy Power/Sacred Surge
    " \ue025": "", # Provoke

    " \ue035": "", # Winded
    " \u273a": "", # Mana Bank
    " \u231a": "", # Timelocked

    " \ue019": "", # Marks
    " \ue030": "", # Clones
    " \ue013": "", # Momentum
    " \u2765": "", # Lured

    " \uE020": "", # Blood Pool
    " \uE031": "", # Bleeding
    " \u2698": "", # Puppets
    " \u265a": "", # Awakened
    " \u21f6": "", # Whipped

    " \\(\ue00d\\)": "", # Slowness
    " \\(\ue00b\\)": "", # Blindness
    " \\(\ue01b\\)": "", # "Damage Bonus" Reduction
    " \\(\ue015\\)": "", # Resistance Penalty

    " \\(\u2694\\)": "", # Damage Bonus
    " \\(\u2741\\)": "", # Resistance Bonus
    " \\(\u273e\\)": "", # Resistance Bonus (Only used for dissolution?)
    " \\(\u2748\\)": "", # ID Bonus/Radiance
    " \\(\u2617\\)": "", # Invincibility
    " \\(\u27b2\\)": "", # Speed Bonus (Time Dilation)
    " \u2764": "", # Overhealth

    "\u00b0": " degrees", # Degree symbol

    "Total Damage": "</br><span class='mc-white'>Total Damage</span>", # Total Damage Breakdown
    "\\(\ue005 Damage": "</br>&emsp;(<span class='Neutral'>Neutral</span>", # Neutral just says "Damage"
    "\\(\ue004 Water": "</br>&emsp;(<span class='Water'>Water</span>", # Water
    "\\(\ue003 Thunder": "</br>&emsp;(<span class='Thunder'>Thunder</span>", # Thunder
    "\\(\ue002 Fire": "</br>&emsp;(<span class='Fire'>Fire</span>", # Fire
    "\\(\ue001 Earth": "</br>&emsp;(<span class='Earth'>Earth</span>", # Earth
    "\\(\ue000 Air": "</br>&emsp;(<span class='Air'>Air</span>", # Air

    "\ue004 ": "</br>", # Water
    "\ue003 ": "</br>", # Thunder
    "\ue002 ": "</br>", # Fire
    "\ue001 ": "</br>", # Earth
    "\ue000 ": "</br>", # Air
}

def clean_description(string):
    return re.sub(cleaner, '', string)

def stylize_description(strings):
    def sub(s):
        for k, v in replace_strings.items():
            s = re.sub(k, v, s)
        return s
    result = []
    for text in strings:
        if '</br>' in text:
            result.append('</br>')
            continue
        if 'Archetype' in text or 'Ability Points' in text or 'Unlocking will block:' in text:
            break  
        result.append(sub(re.sub(cleaner, '', text)))

    if result[0] == "</br>":
        result[0] = ""
        
    if result[len(result)-1] == "</br>":
        result[len(result)-1] = ""

    return ' '.join(result).strip()


if __name__ == "__main__":
    with open("../js/builder/atree_ids.json", "r") as atree_ids_file:
        atree_ids = json.load(atree_ids_file)

    with open("../js/builder/atree_constants.json", "r") as tree_data_file:
        old_tree_data = json.load(tree_data_file)

    classes = [
        "Archer",
        "Warrior",
        "Mage",
        "Assassin",
        "Shaman"
    ]

    icon_dict = {
        "abilityTree.nodeWhite" : "node_0",
        "abilityTree.nodeYellow" : "node_1",
        "abilityTree.nodePurple" : "node_2",
        "abilityTree.nodeRed" : "node_3",
        "abilityTree.nodeBlue" : "node_4",
    }

    new_tree_data = old_tree_data

    for wynn_class in classes:
        print(f"Processing ability tree for {wynn_class}...")
        api_data = get_tree_data(wynn_class)
        known_nodes = old_tree_data[wynn_class]
        known_nodes_map = {node['display_name']: node for node in known_nodes}

        for page_num, page in api_data["pages"].items():
            for atree_id, ability in page.items():
                ability_name = clean_description(ability["name"])

                for old_ability in new_tree_data[wynn_class]:
                    if old_ability["display_name"] == ability_name:
                        color = ability["icon"]["value"]["name"]
                        if color in icon_dict and icon_dict[color] != old_ability["display"]["icon"]:
                            old_ability["display"]["icon"] = icon_dict[color]
                            print(f"Replaced color on node \"{ability_name}\", should be {icon_dict[color]}")
                        description = stylize_description(ability["description"])
                        old_ability["desc"] = description

    with open("../js/builder/atree_constants.json", "w") as output_file:
        json.dump(new_tree_data, output_file, indent=4)

