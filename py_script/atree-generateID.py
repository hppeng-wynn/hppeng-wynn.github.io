"""
Generate a JSON Ability Tree [atree_constants_id.json] with:
 - All references replaced by numerical IDs
 - Extra JSON File with Class: [Original name as key and Assigned IDs as value].
given a JSON Ability Tree with reference as string.
"""
import json

abilDict = {}
with open("atree_constants.json") as f:
    data = json.loads(f.read())
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

    with open('atree_constants_id.json', 'w', encoding='utf-8') as abil_dest:
        json.dump(data, abil_dest, ensure_ascii=False, indent=4)
