"""
Generate a JSON Ability Tree with:
 - All references replaced by numerical IDs
 - Extra JSON File with Original name as key and Assigned IDs as value.
given a JSON Ability Tree.
"""
import json

id = 0
abilDict = {}
with open("atree-parse.json") as f:
    data = json.loads(f.read())
    for classType, info in data.items():
        #reset IDs for every class and start at 1
        id = 1
        for abil in info:
            abilDict[abil["display_name"]] = id
            id += 1

    with open("atree-ids.json", "w", encoding='utf-8') as id_dest:
        json.dump(abilDict, id_dest, ensure_ascii=False, indent=4)

    for classType, info in data.items():
        for abil in range(len(info)):
            info[abil]["id"] = abilDict[info[abil]["display_name"]]
            for ref in range(len(info[abil]["parents"])):
                info[abil]["parents"][ref] = abilDict[info[abil]["parents"][ref]]

            for ref in range(len(info[abil]["dependencies"])):
                info[abil]["dependencies"][ref] = abilDict[info[abil]["dependencies"][ref]]

            for ref in range(len(info[abil]["blockers"])):
                info[abil]["blockers"][ref] = abilDict[info[abil]["blockers"][ref]]
        data[classType] = info

    with open('atree-constants-id.json', 'w', encoding='utf-8') as abil_dest:
        json.dump(data, abil_dest, ensure_ascii=False, indent=4)