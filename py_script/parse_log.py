"""
Used to parse a changelog at some point in the past. Could be used in the future.

Not a typically used file
"""

import json
import difflib

reqs = ["dexReq", "strReq", "defReq", "agiReq", "intReq"]

attack_speeds = ["SUPER_SLOW", "VERY_SLOW", "SLOW", "NORMAL", "FAST", "VERY_FAST", "SUPER_FAST"]

baseDamageMultiplier = [ 0.51, 0.83, 1.5, 2.05, 2.5, 3.1, 4.3 ];

# tefaw
powders = [ [4.5, 6.5, 8.5,  9,    10.5, 12.5, "T"],
            [4.5, 6.5, 8,    8.5,  10,   12, "E"],
            [3.5, 6,   7,    7.5,  9,    11, "F"],
            [4,   6.5, 7.5,  8,    9.5,  11, "A"],
            [3.5, 5,   6.5,  7,    8.5,  10, "W"]]

elements_damages = {
        "neutral": "nDam",
        "earth": "eDam",
        "thunder": "tDam",
        "water": "wDam",
        "fire": "fDam",
        "air": "aDam"
    }

def getDisplayName(item):
    if "displayName" in item:
        return item["displayName"]
    return item["name"]

with open("clean.json", "r") as infile:
    all_json = json.load(infile)
    old_items = all_json["items"]
    old_item_map = dict()
    for item in old_items:
        name = getDisplayName(item)
        max_i = 0
        for i, req in enumerate(reqs):
            if req in item and item[req] > 0:
                max_i = i
                break
        item["max_req_ind"] = max_i
        old_item_map[name.lower()] = item
        
    
items = []
state = 0

def file_iter(infile):
    for line in infile:
        yield line

with open("log.txt", "r") as infile:
    fiter = file_iter(infile)
    while True:
        line = next(fiter, None)
        if line is None:
            break
        line = line.strip()
        if line.lower() in old_item_map:
            item_name = line
            item = old_item_map[line.lower()]
            item["changed"] = True
            line = next(fiter, None).strip()
            if line:
                print("AAAAA ERROR")
                print(line)
                assert(False)
            # Skip original damage
            line = next(fiter, None).strip()
            while line:
                line = next(fiter, None).strip()

            line = next(fiter, None).strip()
            used_elements = []
            while line:
                parts = line.split(" ")
                if len(parts) == 3:
                    # Attack speed
                    speeds = difflib.get_close_matches(parts[2], attack_speeds, n=1)
                    if len(speeds) != 1:
                        print(f"ERROR UNRECOGNIZED ATKSPD FOR [{item_name}]: {parts[2]}")
                    speed = speeds[0]
                    oldSpeed = item["atkSpd"]
                    if oldSpeed != speed:
                        print(f"ATTACK SPEED CHANGE FOR [{item_name}]: {oldSpeed} -> {speed}")
                        item["atkSpd"] = speed
                elif len(parts) > 3:
                    print("ERROR MORE THAN 3 PARTS: " + line)
                damage = parts[0].strip("*")
                element = parts[1].lower().strip("*")
                if element == "all":
                    assert(not used_elements)
                    for e, v in elements_damages.items():
                        used_elements.append(e)
                        item[v] = damage
                elif element == "elemental":
                    for e, v in elements_damages.items():
                        if e not in used_elements:
                            used_elements.append(e)
                            item[v] = damage
                else:
                    elements = element.split("/")
                    if len(elements) == 0:
                        used_elements.append(element)
                        item[elements_damages[element]] = damage
                    else:
                        for element in elements:
                            used_elements.append(element)
                            item[elements_damages[element]] = damage
                line = next(fiter, None)
                if line is None:
                    break
                line = line.strip("\n *")

damage_translate = {
        "damage": "nDam",
        "fireDamage": "fDam",
        "waterDamage": "wDam",
        "airDamage": "aDam",
        "thunderDamage": "tDam",
        "earthDamage": "eDam",
    }
with open("spears.txt", "r") as infile:
    fiter = file_iter(infile)
    while True:
        line = next(fiter, None)
        if line is None:
            break
        line = line.strip()
        if line.lower() in old_item_map:
            item_name = line
            item = old_item_map[line.lower()]
            item["changed"] = True
            line = next(fiter, None).strip()
            if line:
                print("AAAAA ERROR")
                print(line)
                assert(False)
            line = next(fiter, None).strip()
            while line:
                parts = line.split(":")
                if len(parts) != 2:
                    print("???? " + line)
                    break

                if parts[0] == "attackSpeed":
                    new_speed_str = parts[1].split("->")[-1].strip()
                    speeds = difflib.get_close_matches(new_speed_str, attack_speeds, n=1)
                    if len(speeds) != 1:
                        print(f"ERROR UNRECOGNIZED ATKSPD FOR [{item_name}]: {new_speed_str}")
                    speed = speeds[0]
                    oldSpeed = item["atkSpd"]
                    if oldSpeed != speed:
                        print(f"ATTACK SPEED CHANGE FOR [{item_name}]: {oldSpeed} -> {speed}")
                        item["atkSpd"] = speed
                else:
                    damage_target = damage_translate[parts[0]]
                    damage_val = parts[1].split("->")[-1].strip()
                    item[damage_target] = damage_val
                line = next(fiter, None)
                if line is None:
                    break
                line = line.strip()


item_dps_by_type = {"dagger": [], "bow": [], "spear": [], "relik": [], "wand": []}

for i, item in enumerate(old_items):
    if "changed" in item:
        damage_total = 0
        for v in elements_damages.values():
            if v in item:
                dam = item[v].split("-")
                damage_total += int(dam[0]) + int(dam[1])
        damage_total /= 2
        idx = 5
        if item["lvl"] < 80:
            idx = 4

        if "slots" not in item:
            item["slots"] = 0
        damage_total += item["slots"] * powders[item["max_req_ind"]][idx]
        base_dps = damage_total * baseDamageMultiplier[attack_speeds.index(item["atkSpd"])]
        lst = item_dps_by_type[item["type"]]
        lst.append((-base_dps, i, powders[item["max_req_ind"]][6], item))
        del item["changed"]
    del item["max_req_ind"]

with open("raw.txt", "r") as infile:
    fiter = file_iter(infile)
    while True:
        line = next(fiter, None)
        if line is None:
            break
        line = line.strip(" \n:")
        if line.lower() in old_item_map:
            item_name = line
            item = old_item_map[line.lower()]
            line = next(fiter, None).strip()
            if line:
                print("AAAAA ERROR")
                print(line)
                assert(False)
            line = next(fiter, None).strip()
            while line:
                parts = line.split(":")
                if len(parts) != 2:
                    print("???? " + line)
                    break

                if "spell" in parts[0].lower():
                    item["sdRaw"] = int(parts[1].split("->")[-1].strip())
                elif parts[0] == "damageBonusRaw":
                    item["mdRaw"] = int(parts[1].split("->")[-1].strip())
                else:
                    print("!!!!"+line)
                line = next(fiter, None)
                if line is None:
                    break
                line = line.strip()

for k, v in item_dps_by_type.items():
    print(f"\n{k}:")
    v.sort()
    for i in range(50):
        dps, _, p, item = v[i]
        name = getDisplayName(item)
        print(f"{name}: {-dps:.2f}, {p}")

json.dump(all_json, open("nerf_items.json", "w"), indent=2)
