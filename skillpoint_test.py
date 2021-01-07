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

# build_items_names = [
#     "Cumulonimbus",
#     "Soulflare",
#     "Leictreach Makani",
#     "Slayer",
#     "Intensity",
#     "Moon Pool Circlet",
#     "Diamond Static Bracelet",
#     "Royal Stormy Amulet"
# ]
# build_weapon_name = "Fatal"
# build_items_names = [
#     "Morph-Stardust",
#     "Morph-Steel",
#     "Morph-Iron",
#     "Morph-Gold",
#     "Morph-Topaz",
#     "Morph-Emerald",
#     "Morph-Amethyst",
#     "Morph-Ruby"
# ]
# build_weapon_name = "Cascade"
build_items_names = [
    "Blue Mask",
    "Sparkling Plate",
    "Gemini",
    "Slayer",
    "Draoi Fair",
    "Moon Pool Circlet",
    "Prowess",
    "Diamond Fusion Necklace"
]
build_weapon_name = "Praesidium"
build_items = [item_map[item] for item in build_items_names]
build_weapon = item_map[build_weapon_name]

for item in build_items:
    print(item)
    print("-------------------------------")

print(build_weapon)

# Consolidate skillpoint and req into arrays for ease of processing.
def setup(item):
    item["skillpoints"] = [item["str"], item["dex"], item["int"], item["def"], item["agi"]]
    item["has_negstat"] = any(x < 0 for x in item["skillpoints"])
    item["reqs"] = [item["strReq"], item["dexReq"], item["intReq"], item["defReq"], item["agiReq"]]

fixed = []
consider = []
noboost = []

for item in build_items:
    setup(item)
    if all(x == 0 for x in item["reqs"]):
        fixed.append(item)
    elif all(x == 0 for x in item["skillpoints"]):
        noboost.append(item)
    else:
        consider.append(item)
setup(build_weapon)
fixed = tuple(fixed)
noboost = tuple(noboost)

# Apply the skillpoints an item gives to the build.
def apply_skillpoints(skillpoints, item):
    for i in range(5):
        skillpoints[i] += item["skillpoints"][i]

def remove_skillpoints(skillpoints, item):
    for i in range(5):
        skillpoints[i] -= item["skillpoints"][i]

# Figure out (naively) how many skillpoints need to be applied to get the current item to fit.
# Doesn't handle -skp.
def apply_to_fit(skillpoints, item):
    applied = [0, 0, 0, 0, 0]
    total = 0
    for i, req, cur in zip(range(5), item["reqs"], skillpoints):
        if req > cur:
            diff = req - cur
            applied[i] += diff
            total += diff
    return applied, total

# Permutations in js reference (also cool algorithm):
# https://stackoverflow.com/a/41068709

static_skillpoints_base = [0, 0, 0, 0, 0]

# Separate out the no req items and add them to the static skillpoint base.
for item in fixed:
    apply_skillpoints(static_skillpoints_base, item)

best = None
final_skillpoints = None
best_skillpoints = [0, 0, 0, 0, 0]
best_total = math.inf

# Try every combination and pick the best one.
import itertools
for permutation in itertools.permutations(consider):

    permutation += noboost

    skillpoints_applied = [0, 0, 0, 0, 0]
    skillpoints = copy.copy(static_skillpoints_base)
    total_applied = 0
    for item in permutation:
        needed_skillpoints, total_diff = apply_to_fit(skillpoints, item)
        for i in range(5):
            skillpoints_applied[i] += needed_skillpoints[i]
            skillpoints[i] += needed_skillpoints[i]
        apply_skillpoints(skillpoints, item)
        total_applied += total_diff
        if total_applied >= best_total:
            break
    if total_applied < best_total:
        for item in permutation:
            remove_skillpoints(skillpoints, item)
            needed_skillpoints, total_diff = apply_to_fit(skillpoints, item)
            for i in range(5):
                skillpoints_applied[i] += needed_skillpoints[i]
                skillpoints[i] += needed_skillpoints[i]
            apply_skillpoints(skillpoints, item)
            total_applied += total_diff
            if total_applied >= best_total:
                break

    needed_skillpoints, total_diff = apply_to_fit(skillpoints, build_weapon)
    for i in range(5):
        skillpoints_applied[i] += needed_skillpoints[i]
        skillpoints[i] += needed_skillpoints[i]
    apply_skillpoints(skillpoints, build_weapon)
    total_applied += total_diff

    if total_applied < best_total:
        best = permutation
        final_skillpoints = skillpoints
        best_skillpoints = skillpoints_applied
        best_total = total_applied

print([i["displayName"] for i in fixed + best])
print(best_skillpoints)
print(final_skillpoints)
print(best_total)

#def attempt(skillpoints, items_in_order):
