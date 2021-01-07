import json
import math
import copy

with open("clean.json") as infile:
    data = json.load(infile)

def clean_item(item):
    if not "displayName" in item:
        item["displayName"] = item["name"];
    return item

items = data["items"]
item_map = {clean_item(item)["displayName"]: item for item in items}

build_items_names = [
    "Cumulonimbus",
    "Soulflare",
    "Leictreach Makani",
    "Slayer",
    "Intensity",
    "Moon Pool Circlet",
    "Diamond Static Bracelet",
    "Royal Stormy Amulet"
]
build_items = [item_map[item] for item in build_items_names]
build_weapon_name = "Fatal"
build_weapon = item_map[build_weapon_name]

for item in build_items:
    print(item)
    print("-------------------------------")

print(build_weapon)

def is_reqless(item):
    return all(x == 0 for x in item["reqs"])

def setup(item):
    item["skillpoints"] = [item["str"], item["dex"], item["int"], item["def"], item["agi"]]
    item["has_negstat"] = any(x < 0 for x in item["skillpoints"])
    item["reqs"] = [item["strReq"], item["dexReq"], item["intReq"], item["defReq"], item["agiReq"]]

fixed = []
consider = []

for item in build_items:
    setup(item)
    if (is_reqless(item)):
        fixed.append(item)
    else:
        consider.append(item)
setup(build_weapon)

def apply_skillpoints(skillpoints, item):
    skillpoints[0] += item["str"]
    skillpoints[1] += item["dex"]
    skillpoints[2] += item["int"]
    skillpoints[3] += item["def"]
    skillpoints[4] += item["agi"]

def apply_to_fit(skillpoints, item):
    applied = [0, 0, 0, 0, 0]
    for i, req, cur in zip(range(5), item["reqs"], skillpoints):
        if req > cur:
            applied[i] += req - cur
    return applied

# Permutations in js reference (also cool algorithm):
# https://stackoverflow.com/a/41068709

static_skillpoints_base = [0, 0, 0, 0, 0]

for item in fixed:
    apply_skillpoints(static_skillpoints_base, item)

best = None
best_skillpoints = [0, 0, 0, 0, 0]
best_total = math.inf

import itertools
for permutation in itertools.permutations(consider):

    permutation += ( build_weapon, )

    skillpoints_applied = [0, 0, 0, 0, 0]
    skillpoints = copy.copy(static_skillpoints_base)
    for item in permutation:
        needed_skillpoints = apply_to_fit(skillpoints, item)
        for i in range(5):
            skillpoints_applied[i] += needed_skillpoints[i]
            skillpoints[i] += needed_skillpoints[i]
        apply_skillpoints(skillpoints, item)
    total_applied = sum(skillpoints_applied)
    if total_applied < best_total:
        best = permutation
        best_skillpoints = skillpoints_applied
        best_total = total_applied

print([i["displayName"] for i in fixed + list(best)])
print(best_skillpoints)
print(best_total)

#def attempt(skillpoints, items_in_order):
