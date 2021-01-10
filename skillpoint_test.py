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
    elif all(x == 0 for x in item["skillpoints"]) and item["set"] is None:
        noboost.append(item)
    else:
        consider.append(item)
setup(build_weapon)
fixed = tuple(fixed)
noboost = tuple(noboost)
consider = tuple(consider)

"""
The way this code expects this to work:
sets is a map: setName -> setObject {
    bonuses: array[bonusObject]
}

where each bonusObject is a mapping from id to boost value.
And the bonuses array describes the effect of equipping set items (0 index = 1 item).
"""
sets = dict()

# Apply the skillpoints an item gives to the build.
"""
skillPoints: current skillpoint totals.
item: Item in uestion.
activeSetCounts: Mapping from setname to number of items currently worn (not including this one).
"""
def apply_skillpoints(skillpoints, item, activeSetCounts):
    for i in range(5):
        skillpoints[i] += item["skillpoints"][i]

    if item["set"] is not None:
        setName = item["set"]
        old_bonus = dict()
        if setName in activeSetCounts:
            setCount = activeSetCounts[setName]
            old_bonus = sets[setName]["bonuses"][setCount-1]
            activeSetCounts[setName] = setCount + 1
        else:
            setCount = 0
            activeSetCounts[setName] = 1
        new_bonus = sets[setName]["bonuses"][setCount]
        skp_order = ["str","dex","int","def","agi"]
        for i, skp in enumerate(skp_order):
            delta = new_bonus[skp] - old_bonus[skp]
            skillpoints[i] += delta

# Figure out (naively) how many skillpoints need to be applied to get the current item to fit.
# Doesn't handle -skp.
def apply_to_fit(skillpoints, item, skillpoint_filter, activeSetCounts):
    applied = [0, 0, 0, 0, 0]
    total = 0
    for i, req, cur in zip(range(5), item["reqs"], skillpoints):
        if item["skillpoints"][i] < 0 and skillpoint_filter[i]:
            applied[i] -= item["skillpoints"][i]
            total -= item["skillpoints"][i]
        if (item["reqs"][i] == 0):
            continue
        skillpoint_filter[i] = True
        if req > cur:
            diff = req - cur
            applied[i] += diff
            total += diff

    if item["set"] is not None:
        setName = item["set"]
        old_bonus = dict()
        if setName in activeSetCounts:
            setCount = activeSetCounts[setName]
            old_bonus = sets[setName]["bonuses"][setCount-1]
            activeSetCounts[setName] = setCount + 1
        else:
            setCount = 0;
            activeSetCounts[setName] = 1
        new_bonus = sets[setName]["bonuses"][setCount]
        skp_order = ["str","dex","int","def","agi"]
        for i, skp in enumerate(skp_order):
            delta = new_bonus[skp] - old_bonus[skp]
            if delta < 0 and skillpoint_filter[i]:
                applied[i] -= delta
                total -= delta
    return applied, total

# Permutations in js reference (also cool algorithm):
# https://stackoverflow.com/a/41068709

static_skillpoints_base = [0, 0, 0, 0, 0]
static_activeSetCounts = dict()

# Separate out the no req items and add them to the static skillpoint base.
for item in fixed:
    apply_skillpoints(static_skillpoints_base, item, static_activeSetCounts)

best = consider + noboost;
final_skillpoints = static_skillpoints_base[:]
best_skillpoints = [0, 0, 0, 0, 0]
best_total = math.inf
best_activeSetCounts = dict()

allFalse = [False] * 5

if len(consider) or len(noboost):

    # Try every combination and pick the best one.
    import itertools
    for permutation in itertools.permutations(consider):
        activeSetCounts = dict(best_activeSetCounts)
        has_skillpoint = allFalse[:]

        permutation += noboost

        skillpoints_applied = [0, 0, 0, 0, 0]
        skillpoints = static_skillpoints_base[:]
        total_applied = 0
        for item in permutation:
            needed_skillpoints, total_diff = apply_to_fit(skillpoints, item, has_skillpoint, activeSetCounts)
            for i in range(5):
                skillpoints_applied[i] += needed_skillpoints[i]
                skillpoints[i] += needed_skillpoints[i]
            apply_skillpoints(skillpoints, item, activeSetCounts)
            total_applied += total_diff
            if total_applied >= best_total:
                break

        needed_skillpoints, total_diff = apply_to_fit(skillpoints, build_weapon, has_skillpoint, activeSetCounts)
        for i in range(5):
            skillpoints_applied[i] += needed_skillpoints[i]
            skillpoints[i] += needed_skillpoints[i]
        apply_skillpoints(skillpoints, build_weapon, activeSetCounts)
        total_applied += total_diff

        if total_applied < best_total:
            best = permutation
            final_skillpoints = skillpoints
            best_skillpoints = skillpoints_applied
            best_total = total_applied
            best_activeSetCounts = activeSetCounts
else:
    best_total = 0
    needed_skillpoints, total_diff = apply_to_fit(skillpoints, build_weapon, allFalse, best_activeSetCounts)
    for i in range(5):
        best_skillpoints[i] += needed_skillpoints[i]
        final_skillpoints[i] += needed_skillpoints[i]
    apply_skillpoints(skillpoints, build_weapon, best_activeSetCounts)
    best_total += total_diff

equip_order = fixed + best
results = [equip_order, best_skillpoints, final_skillpoints, best_total, best_activeSetCounts];

print([i["displayName"] for i in fixed + best])
print(best_skillpoints)
print(final_skillpoints)
print(best_total)

#def attempt(skillpoints, items_in_order):
