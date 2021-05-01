import os
import re

def parse_ci(infile):
    itemName = infile.split("/")[1].split(".")[0]

    print("-------------------------------")
    print(infile)
    print("-------------------------------")

    id_reverse_map = {
        "Neutral Damage": "nDam",
        "Fire Damage": "fDam",
        "Water Damage": "wDam",
        "Air Damage": "aDam",
        "Thunder Damage": "tDam",
        "Earth Damage": "eDam",

        "ealth": "hp", # HACKY
        "Fire Defense": "fDef",
        "Water Defense": "wDef",
        "Air Defense": "aDef",
        "Thunder Defense": "tDef",
        "Earth Defense": "eDef",

        "Combat Lv. Min": "lvl",
        "Strength Min": "strReq",
        "Dexterity Min": "dexReq",
        "Intelligence Min": "intReq",
        "Defense Min": "defReq",
        "Agility Min": "agiReq",

        "% Health Regen": "hprPct",
        "/4s Mana Regen": "mr",
        "% Spell Damage": "sdPct",
        "% Main Attack Damage": "mdPct",
        "/4s Life Steal": "ls",
        "/4s Mana Steal": "ms",
        "% XP Bonus": "xpb",
        "% Loot Bonus": "lb",
        "% Reflection": "ref",
        "Strength": "str",
        "Dexterity": "dex",
        "Intelligence": "int",
        "Agility": "agi",
        "Defense": "def",
        "% Thorns": "thorns",
        "% Exploding": "expd",
        "% Walk Speed": "spd",
        "tier Attack Speed": "atkTier",
        "/3s Poison": "poison",
        "Health": "hpBonus",
        "% Soul Point Regen": "spRegen",
        "% Stealing": "eSteal",
        "Health Regen": "hprRaw",
        "Spell Damage": "sdRaw",
        "Main Attack Damage": "mdRaw",
        "% Fire Damage": "fDamPct",
        "% Water Damage": "wDamPct",
        "% Air Damage": "aDamPct",
        "% Thunder Damage": "tDamPct",
        "% Earth Damage": "eDamPct",
        "% Fire Defense": "fDefPct",
        "% Water Defense": "wDefPct",
        "% Air Defense": "aDefPct",
        "% Thunder Defense": "tDefPct",
        "% Earth Defense": "eDefPct",

        "% 1st Spell Cost": "spPct1",
        "1st Spell Cost": "spRaw1",
        "% 2nd Spell Cost": "spPct2",
        "2nd Spell Cost": "spRaw2",
        "% 3rd Spell Cost": "spPct3",
        "3rd Spell Cost": "spRaw3",
        "% 4th Spell Cost": "spPct4",
        "4th Spell Cost": "spRaw4",

        "rainbowSpellDamageRaw": "rainbowRaw",
        "% Sprint": "sprint",
        "% Sprint Regen": "sprintReg",
        "Jump Height": "jh",
        "lootQuality": "lq",

        "gatherXpBonus": "gXp",
        "gatherSpeed": "gSpd",
    }

    weapons = [ "bow", "wand", "spear", "dagger", "relik" ]
    armors = [ "helmet", "chestplate", "leggings", "boots" ]
    accessories = [ "ring", "bracelet", "necklace" ]

    item_dict = dict()
    with open(infile, "r") as _infile:
        item_data = _infile.read()
    item_data = item_data.split("<p class='restrictions")[0]
    item_data = item_data.split("<p class='tier'>")[0].split("/items/v4//",1)[1]
    
    type_info = item_data.split("/", 1)[0]
    item_data = item_data.split("p class='name ",1)[1]
    tier_info = item_data.split("'",1)[0]

    item_dict["tier"] = tier_info
    item_dict["type"] = type_info

    item_dict["name"] = itemName + " (1.20)"
    item_dict["displayName"] = item_dict["name"]

    item_dict["set"] = None
    item_dict["quest"] = None
    item_dict["classReq"] = None    # Ignoring cause I'm not checking anyway
    item_dict["restrict"] = "1.20 item"
    
    static_info, id_info = item_data.split("table class='")
    fix_id = id_info[:3] == 'td2'
    item_dict["fixID"] = fix_id
    id_info = id_info.split("/thead",1)[-1]

    def process_reqs(req_info):
        req_info = [x.split("<",1)[0] for x in req_info.split('mark">')[1:]]
        for req in req_info:
            key, val = req.split(":")
            item_dict[id_reverse_map[key]] = int(val)

    item_dict["strReq"] = 0;
    item_dict["dexReq"] = 0;
    item_dict["intReq"] = 0;
    item_dict["defReq"] = 0;
    item_dict["agiReq"] = 0;
    if type_info in weapons:
        attack_speed, static_info = static_info.split(" Speed",1)
        attack_speed = attack_speed.split("attackSpeed'>",1)[1].split("Attack")[0].strip().replace(" ","_").upper()
        item_dict["atkSpd"] = attack_speed
        item_dict["category"] = "weapon"

        stat_info, req_info = static_info.split("Class Req: ")
        process_reqs(req_info)
        item_dict["nDam"] = "0-0";
        item_dict["eDam"] = "0-0";
        item_dict["tDam"] = "0-0";
        item_dict["wDam"] = "0-0";
        item_dict["fDam"] = "0-0";
        item_dict["aDam"] = "0-0";

    else:   # Armor and accessory both do health and eledef
        if type_info in accessories:
            item_dict["category"] = "accessory"
        else:
            item_dict["category"] = "armor"
            
        stat_info, req_info = static_info.split('requirements')
        process_reqs(req_info)

    stat_info = stat_info.split("i class='")[1:]
    for stat in stat_info:
        key, stat = stat.split(">",1)[1][2:].replace("</i>","",1).split("<",1)[0].split(": ")
        try:
            item_dict[id_reverse_map[key]] = int(stat)
        except:
            item_dict[id_reverse_map[key]] = stat

    if type_info not in accessories:
        id_info, slot_info = id_info.split("'bottom'>")
        if 'sockets' in slot_info:
            item_dict["slots"] = int(slot_info.split("/",1)[1].split("]",1)[0])
        else:
            item_dict["slots"] = 0

    number_regex = re.compile(r"(-?\d+)(.*)")
    id_info = id_info.split("<tr>")[1:]

    item_dict["str"] = 0;
    item_dict["dex"] = 0;
    item_dict["int"] = 0;
    item_dict["def"] = 0;
    item_dict["agi"] = 0;
    if fix_id:
        for id_row in id_info:
            label, high = re.split(r'<td', id_row)[1:]
            high = high.split(">")[1].split("<")[0]
            label = label.rsplit("<",1)[0][1:]
            if "i class" in label:
                _, two, three = label.split(">", 2)
                label = two.split("<")[0][2:] + three
            value_combine = high + " " + label
            result = re.match(number_regex, value_combine)
            high = int(result.group(1))
            key = result.group(2).strip()
            print(high, key)
            item_dict[id_reverse_map[key]] = high
    else:
        for id_row in id_info:
            low, label, high = re.split(r'<td', id_row)[1:]
            low = low.split(">")[1].split("<")[0]
            high = high.split(">")[1].split("<")[0]
            label = label.rsplit("<",1)[0][1:]
            if "i class" in label:
                _, two, three = label.split(">", 2)
                label = two.split("<")[0][2:] + three
            value_combine = high + " " + label
            result = re.match(number_regex, value_combine)
            _high = int(result.group(1))
            if low == "~":
                _low = _high
            else:
                _low = int(re.match(number_regex, low).group(1))
            key = result.group(2).strip()
            low = min(_low, _high)
            high = max(_low, _high)
            print(low, high, key)
            if low < 0:
                # negative range: 1.3 to 0.7
                base_guess = high
                while base_guess > low:
                    if abs(base_guess * 1.3 - low) <= 0.5:
                        break
                    base_guess -= 1
            else:
                # positive range: 0.3 to 1.3
                base_guess = low
                while base_guess < high:
                    if abs(base_guess * 1.3 - high) <= 0.5:
                        break
                    base_guess += 1
            item_dict[id_reverse_map[key]] = base_guess
    return item_dict

#import sys
#print(parse_ci(sys.argv[1]))
#exit(1)

items_all = []
id_start_number = 10398
for filename in os.listdir('ci.2'):
    item = parse_ci('ci.2/'+filename)
    item['id'] = id_start_number + len(items_all)
    items_all.append(item)

import json
with open("1_20_ci.json.2", "w") as outfile:
    json.dump(items_all, outfile, indent=2)

