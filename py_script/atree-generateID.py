"""
Generate a minified JSON Ability Tree [atree_constants_min.json] AND a minified .js form [atree_constants_min.js] of the Ability Tree with:
 - All references replaced by numerical IDs
 - Extra JSON File with Class: [Original name as key and Assigned IDs as value].
given [atree_constants.js] .js form of the Ability Tree with reference as string.
"""
import json

def translate_id(id_data, atree_data):
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
                print("WARNING: abil missing 'effects' tag")
                print(info[abil])
                info[abil]["effects"] = []
            for effect in info[abil]["effects"]:
                if effect["type"] == "raw_stat":
                    for bonus in effect["bonuses"]:
                        if "abil" in bonus and bonus["abil"] in id_data[_class]:
                            bonus["abil"] = id_data[_class][bonus["abil"]]

                elif effect["type"] == "stat_scaling":
                    if "inputs" in effect:  # Might not exist for sliders
                        for _input in effect["inputs"]:
                            if "abil" in _input and _input["abil"] in id_data[_class]:
                                _input["abil"] = id_data[_class][_input["abil"]]
                    if "output" in effect:
                        if isinstance(effect["output"], list):
                            for output in effect["output"]:
                                if "abil" in output and output["abil"] in id_data[_class]:
                                    output["abil"] = id_data[_class][output["abil"]]
                        else:
                            if "abil" in effect["output"] and effect["output"]["abil"] in id_data[_class]:
                                effect["output"]["abil"] = id_data[_class][effect["output"]["abil"]]

abilDict = {}
with open("atree_constants.js") as f:
    data = f.read()
    data = data.replace("const atrees = ", "")
    data = json.loads(data)
    for classType, info in data.items():
        _id = 0
        abilDict[classType] = {}
        for abil in info:
            abilDict[classType][abil["display_name"]] = _id
            _id += 1

    with open("atree_ids.json", "w", encoding='utf-8') as id_dest:
        json.dump(abilDict, id_dest, ensure_ascii=False, indent=4)

    translate_id(abilDict, data)

    data_str = json.dumps(data, ensure_ascii=False, separators=(',', ':'))
    data_str = "const atrees=" + data_str
    with open('atree_constants_min.js', 'w', encoding='utf-8') as abil_dest:
        abil_dest.write(data_str)
    
    with open('atree_constants_min.json', 'w', encoding='utf-8') as json_dest:
        json.dump(data, json_dest, ensure_ascii=False, separators=(',', ':'))
