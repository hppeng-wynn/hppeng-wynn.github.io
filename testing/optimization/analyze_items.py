import json

import numpy as np
import matplotlib.pyplot as plt

def max_id(item, id_name, invert=False):
    """
    Calculate the "max roll" for a given ID.

    Parameters
        Name        type        desc
        ----------------------------------------------------------
        item        json        Item json data
        id_name     string      name of the ID to get
        invert      bool        Whether to "invert" (raw cost and %cost have funny
                                0.7-1.3 positive roll and 0.3-1.3 negative roll)
    
    Return:
        val: float -- max roll id value.
    """
    id_val = item.get(id_name, 0)
    if id_val == 0: # if the ID isn't present, its just going to be zero
        return 0

    if item.get('fixID', False):
        # If the item is a fixed roll item, don't roll the ID.
        return id_val

    # roll the ID. Negative roll (and invert) max roll is 0.7; positive max is 1.3.
    if bool(id_val < 0) != bool(invert):    # logical XOR
        val = round(id_val * 0.7)
    else:   #if bool(id_val > 0) != bool(invert):
        val = round(id_val * 1.3)

    if val == 0:    # if we rounded to zero, then restore the id as sign(base_val).
        val = id_val / abs(id_val)
    return val

def mv(item, base_costs):
    """
    Compute mana value for an item.
    Takes a maximum mana value
        - assuming 1 melee value (3/3 mana steal = 1 mana value)
        - assuming spells 1, 3, and 4 are cycle spells.
    Ignores spell 2 for spell cost purposes.

    Parameters
        Name        type            desc
        ----------------------------------------------------------
        item        json            Item json data
        base_costs  list[float]     base spell cost [spell1, spell2, spell3, spell4]

    Return:
        val: float -- mana value.
    """
    cost_reductions = sorted([
        max_id(item, 'spRaw1', True) + base_costs[0]*max_id(item, 'spPct1', True)/100,
        #max_id(item, 'spRaw2', True) + base_costs[1]*max_id(item, 'spPct2', True)/100,
        max_id(item, 'spRaw3', True) + base_costs[2]*max_id(item, 'spPct3', True)/100,
        max_id(item, 'spRaw4', True) + base_costs[3]*max_id(item, 'spPct4', True)/100,
    ])
    cost_mv = -sum(cost_reductions[:2])

    return (
        max_id(item, 'ms')/3
        + max_id(item, 'mr')/5
        + cost_mv
    )

###########################
# constants for damage calc.
elements = 'rnetwfa'
raw_ids = ['sdRaw'] + [x+'SdRaw' for x in elements] + [x+'DamRaw' for x in elements]

# these %boosts apply to all damages.
percent_all_ids = ['sdPct', 'rSdPct']

# this one  is a list of lists.
# the mini lists are sub-sums, the big list gets max'd over (elemental damage works like this.)
percent_max_id_groups = list(zip([x+'DamPct' for x in 'etwfa'] + [x+'SdPct' for x in 'etwfa']))  # exclude neutral lel
###########################
def damage(item, weapon_base):
    """
    Compute effective damage bonus.
    Note that this assumes the weapon aligns with whatever bonus this item is giving.

    Parameters
        Name            type        desc
        ----------------------------------------------------------
        item            json        Item json data
        weapon_base     float       weapon base dps

    Return:
        val: float -- raw damage bonus given (approximate) for the weapon.
    """
    total = sum(max_id(item, x) for x in raw_ids)
    total += weapon_base * sum(max_id(item, x) for x in percent_all_ids) / 100
    total += weapon_base * max(sum(max_id(item, y) for y in x) for x in percent_max_id_groups) / 100
    return total


#################################
# NOTE: Edit these parameters! LOL i was lazy to make a CLI
level_threshold = 80
weapon_base = 700
base_costs = [35, 20, 35, 35]
item_type = 'leggings'

# TODO: Changeme to point to a copy of wynnbuilder's compress.json file!
items = json.load(open("../../compress.json"))['items']
#################################


# collect data from items.
points = []
names = dict()
for item in items:
    if item['type'] == item_type and item['lvl'] > level_threshold:
        # Edit me to see other comparisons!
        #point = (mv(item, base_costs), damage(item, weapon_base))
        point = (max_id(item, 'spd'), item.get('hp', 0) + max_id(item, 'hpBonus'))

        points.append(point)
        # just some shenanigans to aggregate text that happens to fall on the same point.
        if point in names:
            names[point] += '\n'+item.get('displayName', item['name'])
        else:
            names[point] = item.get('displayName', item['name'])
points = np.array(points)

# plot points.
plt.figure()
plt.scatter(points[:, 0], points[:, 1])
# and add annotations.
for point, txt in names.items(): 
    plt.annotate(txt, point)
plt.show()
