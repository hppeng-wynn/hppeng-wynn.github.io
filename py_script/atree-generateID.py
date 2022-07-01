"""
Generate a minified JSON Ability Tree [atree_constants_min.json] AND a minified .js form [atree_constants_min.js] of the Ability Tree with:
 - All references replaced by numerical IDs
 - Extra JSON File with Class: [Original name as key and Assigned IDs as value].
given [atree_constants.js] .js form of the Ability Tree with reference as string.
"""
import json

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

    for classType, info in data.items():
        for abil in range(len(info)):
            info[abil]["id"] = abilDict[classType][info[abil]["display_name"]]
            for ref in range(len(info[abil]["parents"])):
                info[abil]["parents"][ref] = abilDict[classType][info[abil]["parents"][ref]]

            for ref in range(len(info[abil]["dependencies"])):
                info[abil]["dependencies"][ref] = abilDict[classType][info[abil]["dependencies"][ref]]

            for ref in range(len(info[abil]["blockers"])):
                info[abil]["blockers"][ref] = abilDict[classType][info[abil]["blockers"][ref]]

    data_str = json.dumps(data, ensure_ascii=False, separators=(',', ':'))
    data_str = "const atrees=" + data_str
    with open('atree_constants_min.js', 'w', encoding='utf-8') as abil_dest:
        abil_dest.write(data_str)
    
    with open('atree_constants_min.json', 'w', encoding='utf-8') as json_dest:
        json.dump(data, json_dest, ensure_ascii=False, separators=(',', ':'))
