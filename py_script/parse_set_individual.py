"""
Parses a set from a single file.

Usage: python parse_set_individual.py [infile]
"""

import sys

set_infile = sys.argv[1]

print("-------------------------------")
print(set_infile)
print("-------------------------------")

id_reverse_map = {
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

with open(set_infile, "r") as setFile:
    set_data = setFile.read()
    set_items, set_bonus = set_data.split("Set Bonuses:")
    items = [x.split("<",1)[0].strip() for x in set_items.split("name Set'>")[1:]]
    print(items)
    set_increment = set_bonus.split("div class='set-box'>")[1:]
    set_bonuses = []
    import re
    number_regex = re.compile(r"([+-]\d+)(.*)")
    for set_bonus in set_increment:
        print(len(set_bonuses)+1, "items:")
        bonuses = dict()
        if "Set Bonus" in set_bonus:
            bonus_string = set_bonus.split("Set Bonus:</i></p>")[1]
            for bonus in bonus_string.split("</p><p>")[:-1]:
                val_bunch, label = bonus.split("</span> ")
                if "i class" in label:
                    _, two, three = label.split(">")
                    label = two.split("<")[0][2:] + three
                value = val_bunch.split(">")[-1]
                print(value, label);
                value_combine = value+" "+label
                result = re.match(number_regex, value_combine)
                number = result.group(1)
                key = result.group(2).strip()
                bonuses[id_reverse_map[key]] = int(number)
                
        set_bonuses.append(bonuses)
    import json
    with open(set_infile+".json", "w") as outFile:
        json.dump({"items": items, "bonuses": set_bonuses}, outFile, indent=2)
