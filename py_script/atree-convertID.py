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
    for abil in range(len(info)):
        info[abil]["id"] = id_data[_class][info[abil]["display_name"]]
        for ref in range(len(info[abil]["parents"])):
            info[abil]["parents"][ref] = id_data[_class][info[abil]["parents"][ref]]

        for ref in range(len(info[abil]["dependencies"])):
            info[abil]["dependencies"][ref] = id_data[_class][info[abil]["dependencies"][ref]]

        for ref in range(len(info[abil]["blockers"])):
            info[abil]["blockers"][ref] = id_data[_class][info[abil]["blockers"][ref]]

with open('atree_constants_idfied.json', 'w', encoding='utf-8') as abil_dest:
    json.dump(atree_data, abil_dest, ensure_ascii=False, indent=4)