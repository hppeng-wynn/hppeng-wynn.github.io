"""
Generate a JSON Ability Tree [atree_constants_idfied.json] with:
 - All references replaced by numerical IDs
given a JSON Ability Tree with reference as string AND a JSON Ability Names to IDs.
"""
import json

# Ability names to IDs data
with open("atree_ids.json") as f:
    id_data = json.loads(f.read())

# Ability tree data with reference as string
with open("atree_constants.json") as f:
    atree_data = json.loads(f.read())

for _class, info in atree_data.items():
    def translate(path, ref):
        ref_dict = info
        for x in path:
            ref_dict = ref_dict[x]
        ref_dict[ref] = id_data[_class][ref_dict[ref]]
    
    for abil in range(len(info)):
        info[abil]["id"] = id_data[_class][info[abil]["display_name"]]
        for ref in range(len(info[abil]["parents"])):
            translate([abil, "parents"], ref)

        for ref in range(len(info[abil]["dependencies"])):
            translate([abil, "dependencies"], ref)

        for ref in range(len(info[abil]["blockers"])):
            translate([abil, "blockers"], ref)

        if "base_abil" in info[abil]:
            base_abil_name = info[abil]["base_abil"]
            if base_abil_name in id_data[_class]:
                translate([abil], "base_abil")

        if "effects" not in info[abil]:
            print(info[abil])
            info[abil]["effects"] = []
        for effect in info[abil]["effects"]:
            if effect["type"] == "raw_stat":
                for bonus in effect["bonuses"]:
                    if "abil" in bonus:
                        bonus["abil"] = id_data[_class][bonus["abil"]]

            elif effect["type"] == "stat_scaling":
                if "inputs" in effect:  # Might not exist for sliders
                    for _input in effect["inputs"]:
                        if "abil" in _input:
                            _input["abil"] = id_data[_class][_input["abil"]]

                if "abil" in effect["output"]:
                    effect["output"]["abil"] = id_data[_class][effect["output"]["abil"]]


with open('atree_constants_idfied.json', 'w', encoding='utf-8') as abil_dest:
    json.dump(atree_data, abil_dest, ensure_ascii=False, indent=4)
