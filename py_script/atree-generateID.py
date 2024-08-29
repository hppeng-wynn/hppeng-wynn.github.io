"""
Generate a minified JSON Ability Tree [atree_constants_min.json] AND a minified .js form [atree_constants_min.js] of the Ability Tree with:
 - All references replaced by numerical IDs
 - Extra JSON File with Class: [Original name as key and Assigned IDs as value].
given [atree_constants.js] .js form of the Ability Tree with reference as string.
"""
import json

def translate_spell_part(id_data, part):
    if 'hits' in part:    # Translate parametrized hits...
        hits_mapping = part['hits']
        keys = list(hits_mapping.keys())
        for k in keys:
            v = hits_mapping[k]
            if isinstance(v, str):
                abil_id, propname = v.split('.')
                hits_mapping[k] = str(id_data[abil_id])+'.'+propname

def translate_effect(id_data, effect):
    if effect["type"] == "raw_stat":
        for bonus in effect["bonuses"]:
            if "abil" in bonus and bonus["abil"] in id_data:
                bonus["abil"] = id_data[bonus["abil"]]
    elif effect["type"] == "replace_spell":
        for part in effect['parts']:
            translate_spell_part(id_data, part)
    elif effect["type"] == "add_spell_prop":
        translate_spell_part(id_data, effect)
    elif effect["type"] == "stat_scaling":
        if "inputs" in effect:  # Might not exist for sliders
            for _input in effect["inputs"]:
                if "abil" in _input and _input["abil"] in id_data:
                    _input["abil"] = id_data[_input["abil"]]
        if "output" in effect:
            if isinstance(effect["output"], list):
                for output in effect["output"]:
                    if "abil" in output and output["abil"] in id_data:
                        output["abil"] = id_data[output["abil"]]
            else:
                if "abil" in effect["output"] and effect["output"]["abil"] in id_data:
                    effect["output"]["abil"] = id_data[effect["output"]["abil"]]
        if "scaling" in effect:
            if isinstance(effect["scaling"], list):
                for i, val in enumerate(effect["scaling"]):
                    if isinstance(val, str):
                        abil_id, propname = val.split('.')
                        effect["scaling"][i] = str(id_data[abil_id])+'.'+propname
            else:
                val = effect["scaling"]
                if isinstance(val, str):
                    abil_id, propname = val.split('.')
                    effect["scaling"] = str(id_data[abil_id])+'.'+propname
        if "max" in effect:
            val = effect["max"]
            if isinstance(val, str):
                abil_id, propname = val.split('.')
                effect["max"] = str(id_data[abil_id])+'.'+propname

def translate_abil(id_data, abil, tree=True):
    def translate(path, ref):
        ref_dict = abil
        for x in path:
            ref_dict = ref_dict[x]
        ref_dict[ref] = id_data[ref_dict[ref]]

    for optional_key in ["parents", "dependencies", "blockers"]:
        if optional_key not in abil:
            if tree:
                print(f"WARNING: atree node missing required key [{optional_key}]")
            continue
        for ref in range(len(abil[optional_key])):
            translate([optional_key], ref)

    if "base_abil" in abil:
        base_abil_name = abil["base_abil"]
        if base_abil_name in id_data:
            translate([], "base_abil")

    if "effects" not in abil:
        print("WARNING: abil missing 'effects' tag")
        print(abil)
        abil["effects"] = []
    for effect in abil["effects"]:
        translate_effect(id_data, effect)

def translate_all(id_data, atree_data):
    for _class, info in atree_data.items():
        for abil in info:
            abil["id"] = id_data[_class][abil["display_name"]]
            translate_abil(id_data[_class], abil)


abilDict = {}
with open("atree_constants.json") as f:
    data = json.load(f)
    for classType, info in data.items():
        _id = 0
        abilDict[classType] = {}
        for abil in info:
            abilDict[classType][abil["display_name"]] = _id
            _id += 1

    with open("atree_ids.json", "w", encoding='utf-8') as id_dest:
        json.dump(abilDict, id_dest, ensure_ascii=False, indent=4)

    translate_all(abilDict, data)

    with open("major_ids_clean.json") as maj_id_file:
        maj_id_dat = json.load(maj_id_file)
        for k, v in maj_id_dat.items():
            for abil in v['abilities']:
                clazz = abil['class']
                translate_abil(abilDict[clazz], abil, tree=False)
        with open("major_ids_min.json", "w", encoding='utf-8') as maj_id_out:
            json.dump(maj_id_dat, maj_id_out, ensure_ascii=False, separators=(',', ':'))

    with open("aspects.json") as aspects_file:
        aspect_dat = json.load(aspects_file)
        for clazz, aspects in aspect_dat.items():
            for aspect in aspects:
                for aspect_tier in aspect['tiers']:
                    for abil in aspect_tier['abilities']:
                        translate_abil(abilDict[clazz], abil, tree=False)
        with open("aspects_min.json", "w", encoding='utf-8') as aspects_out:
            json.dump(aspect_dat, aspects_out, ensure_ascii=False, separators=(',', ':'))

    #data_str = json.dumps(data, ensure_ascii=False, separators=(',', ':'))
    #data_str = "const atrees=" + data_str
    #with open('atree_constants_min.js', 'w', encoding='utf-8') as abil_dest:
    #    abil_dest.write(data_str)
    
    with open('atree_constants_min.json', 'w', encoding='utf-8') as json_dest:
        json.dump(data, json_dest, ensure_ascii=False, separators=(',', ':'))
