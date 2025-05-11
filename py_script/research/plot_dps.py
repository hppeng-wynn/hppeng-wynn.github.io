"""
Generates data for dps_vis
"""

import matplotlib.pyplot as plt
import json
import numpy as np

#baselines_known_x = np.array([ 70, 72, 74, 75, 76, 78, 80, 82, 84, 85, 86, 89, 90, 91, 93, 95, 97, 98, 100 ])
#baselines_known_y = np.array([ 341.53, 358.29, 374.68, 383.35, 394.06, 410.75, 432.14, 453.45, 469.94, 480.93, 491.21, 524.26, 536.69, 546.26, 569.78, 592.45, 615.65, 626.75, 648.21 ]) / 2.05

item_type = "bow"
items_file = "../../data/2.1.1.6/items.json"
items_new_file = "../clean3.json"

min_level = 70
baselines_known_x = np.array([ 70, 75, 80, 85, 90, 95, 100 ])
baselines_known_y = np.array([ 341.53, 383.35, 432.14, 480.93, 536.69, 592.45, 648.21 ]) / 2.05
baselines_known_y_new = np.zeros(len(baselines_known_x))
for i, (x, y) in enumerate(zip(baselines_known_x, baselines_known_y)):
    baselines_known_y_new[i] = y * (1 - 0.01 * (x - 70))
baselines_known_y = baselines_known_y_new

def interpolate_baseline(level):
    i = 0
    while baselines_known_x[i] <= level:
        if baselines_known_x[i] == level:
            return baselines_known_y[i]
        i += 1
        if i == len(baselines_known_x):
            return baselines_known_y[-1]
    start = i - 1
    slope = ((baselines_known_y[i] - baselines_known_y[start])
                / (baselines_known_x[i] - baselines_known_x[start]))
    dx = level - baselines_known_x[start]
    return baselines_known_y[start] + slope * dx

reqs = ["dexReq", "strReq", "defReq", "agiReq", "intReq"]
# tefaw
powders_new = [ [4.5, 6.5, 8.5,  9,    10.5, 12.5, "T"],
                [4.5, 6.5, 8,    8.5,  10,   12, "E"],
                [3.5, 6,   7,    7.5,  9,    11, "F"],
                [4,   6.5, 7.5,  8,    9.5,  11, "A"],
                [3.5, 5,   6.5,  7,    8.5,  10, "W"]]
powders_old = [ [4.5, 6.5, 8.5,  9,    10.5, 22.5, "T"],    # LOL only updating the 6th col
                [4.5, 6.5, 8,    8.5,  10,   20, "E"],
                [3.5, 6,   7,    7.5,  9,    17, "F"],
                [4,   6.5, 7.5,  8,    9.5,  17, "A"],
                [3.5, 5,   6.5,  7,    8.5,  15, "W"]]
powders_old = powders_new
def get_appropriate_powder_idx(item):
    for i, req in enumerate(reqs):
        if req in item and item[req] > 0:
            return i
    return 0

def get_display_name(item):
    if "displayName" in item:
        return item["displayName"]
    return item["name"]
item_data = json.load(open(items_file))["items"]
item_map = {get_display_name(item): item for item in item_data}
#item_new_data = json.load(open(items_new_file))["items"]
#item_new_map = {get_display_name(item): item for item in item_new_data}

attack_speed_mods = {"SUPER_SLOW": 0.51, "VERY_SLOW": 0.83, "SLOW": 1.5, "NORMAL": 2.05, "FAST": 2.5, "VERY_FAST": 3.1, "SUPER_FAST": 4.3}
attack_speed_target_mult = {"SUPER_SLOW": 4, "VERY_SLOW": 2.5, "SLOW": 1.4, "NORMAL": 1, "FAST": 0.8, "VERY_FAST": 0.66, "SUPER_FAST": 0.48}
dps_to_baseline = dict()
min_mult = 10
max_mult = 0
for k in attack_speed_mods:
    mult = attack_speed_mods[k] * attack_speed_target_mult[k]
    if mult < min_mult:
        min_mult = mult
    if mult > max_mult:
        max_mult = mult
    dps_to_baseline[k] = 1/mult

weapon_type_mods = {"wand": 0.6, "spear": 0.8, "dagger": 1.0, "bow": 1.2, "relik": 1.2}
print((min_mult, max_mult))

tiers_mod = {"Normal": 0.8, "Unique": 1.0, "Rare": 1.1, "Legendary": 1.3, "Fabled": 1.5, "Mythic": 1.7, "Set": 1.05}
tiers_colors = {"Normal": (0.9, 0.9, 0.9), "Unique": (1, 1, 1/3), "Rare": (1, 1/3, 1), "Legendary": (1/3, 1, 1), "Fabled": (1, 1/3, 1/3), "Mythic": (2/3, 0, 2/3), "Set": (1/3, 1, 1/3)}


damage_types = ["nDam", "eDam", "tDam", "wDam", "fDam", "aDam"]

# tefaw
damage_baseline_modifiers = [0.05, 0.05, -0.05, 0, -0.05]
def guess_design_modifier(item, base_dps):
    level = item["lvl"]
    tier = item["tier"]
    nominal_baseline = interpolate_baseline(level) * weapon_type_mods[item["type"]] * tiers_mod[tier]
    explanation = []
    num_reqs = 0
    total_modifier = 0
    for i, req in enumerate(reqs):
        if req in item and item[req] > 0:
            num_reqs += 1
            total_modifier += damage_baseline_modifiers[i]
            explanation.append((req, damage_baseline_modifiers[i]))

    num_damage_types = 0
    for damage_type in damage_types[1:]:
        if damage_type in item:
            damages = item[damage_type].split("-")
            if int(damages[1]) != 0:
                num_damage_types += 1

    is_rainbow = num_damage_types == 5 or num_reqs == 5
    if is_rainbow:
        total_modifier = 0.15
        explanation = [("rainbow", 0.15)]
    elif num_reqs > 1 or num_damage_types > 1:
        total_modifier += 0.05
        explanation.append(("multi_element", 0.05))
        #total_modifier = 0.05
        #explanation = [("multi_element", 0.05)]

    nslots = 0
    if "slots" in item:
        nslots = item["slots"]
    if nslots == 0:
        total_modifier += 0.1
        explanation.append(("zero_slot", 0.1))
    elif nslots == 1:
        total_modifier += 0.05
        explanation.append(("one_slot", 0.05))
    
    item_baseline = dps_to_baseline[item["atkSpd"]] * base_dps
    actual_modifier = (item_baseline - nominal_baseline) / nominal_baseline
    explained_baseline = nominal_baseline * (1 + total_modifier)
    delta = (item_baseline - explained_baseline) / nominal_baseline
    if delta >= 0.04 and delta < 0.075:
        total_modifier += 0.05
        explanation.append(("offensive", 0.05))
    elif delta >= 0.075:
        total_modifier += 0.1
        explanation.append(("hyper_offensive", 0.1))
    elif delta <= -0.04 and delta > -0.075:
        total_modifier -= 0.05
        explanation.append(("defensive", -0.05))
    elif delta <= -0.075:
        total_modifier -= 0.1
        explanation.append(("hyper_defensive", -0.1))
    if abs(delta) > 0.2:
        print("LARGE BASELINE ERROR FOR ITEM " + get_display_name(item))
    return total_modifier, actual_modifier, explanation

def get_data(item, powders):
    total_damage = 0
    for damage_type in damage_types:
        if damage_type in item:
            damages = item[damage_type].split("-")
            total_damage += int(damages[0]) + int(damages[1])
    total_damage /= 2
    attack_speed_mod = attack_speed_mods[item["atkSpd"]]
    dps = total_damage * attack_speed_mod
    postpowder_damage = total_damage
    if "slots" in item:
        powder = powders[get_appropriate_powder_idx(item)][5]   # Assume tier6 always.
        postpowder_damage += powder * item["slots"]
    return (dps, postpowder_damage * attack_speed_mod)

item_dat = {cat: [] for cat in weapon_type_mods}
for name, item in item_map.items():
    if "lvl" not in item:
        continue
    if item["lvl"] >= min_level and item["category"] == "weapon":
        dps, postpowder_dps = get_data(item, powders_old)
        # new_item = item_new_map[name]
        # new_dps, new_postpowder_dps = get_data(new_item, powders_new)
        total, actual, explain = guess_design_modifier(item, dps)
        item_dat[item["type"]].append((get_display_name(item), item["lvl"], item["id"], item["tier"],
                                        dps, postpowder_dps,
                                        total, actual, explain))
item_dat["baseline_xs"] = baselines_known_x.tolist()
item_dat["baseline_ys"] = baselines_known_y.tolist()
#item_dat["baseline_ys_new"] = baselines_known_y_new.tolist()
json.dump(item_dat, open("dps_data.json", "w"), indent=2)
json.dump(item_dat, open("dps_data_compress.json", "w"))
# item_lvl, item_dps, item_tiercolor = zip(*item_dat)
# plt.scatter(item_lvl, item_dps, color=item_tiercolor)
# 
# for tier, mod in tiers_mod.items():
#     plt.plot(baselines_known_x, baselines_known_y * max_mult * mod, '--', color=tiers_colors[tier])
#     plt.plot(baselines_known_x, baselines_known_y * min_mult * mod, '--', color=tiers_colors[tier])
# plt.xticks([70, 75, 80, 85, 90, 95, 100])
# plt.xlabel("Combat level")
# plt.ylabel("Base dps")
# plt.title(f"{item_type} base dps vs level")
# plt.grid()
# plt.show()
