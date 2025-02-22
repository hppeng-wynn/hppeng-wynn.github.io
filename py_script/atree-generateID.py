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


def validate_atree_graph(atree):
    """
    Validate a single ability tree.
    """
    # Set up lookup mapping
    abil_lookup = {998: 'elemental master', 999: 'melee'}
    for abil in atree:
        # Sanity check for display.
        fatal_err = False
        if 'display' not in abil:
            print(f"ERROR: '{abil_name}' missing 'display'")
            fatal_err = True
        else:
            for field in ['row', 'col', 'icon']:
                if field not in abil['display']:
                    print(f"ERROR: '{abil_name}'.display missing '{field}'")
                    fatal_err = True
        if 'parents' not in abil:
            print(f"ERROR: '{abil_name}' missing 'parents'")
            fatal_err = True

        if fatal_err:
            print("Not adding ability to lookup -- it is fatally malformed.")
            continue
        abil_lookup[abil['id']] = abil

    def get_path_positions(parent, child):
        """
        Trace out grid positions between a parent and child ability tree node.
        Paths move out horizontally from parent to child, before descending vertically.
        """
        child_r, child_c = child['display']['row'], child['display']['col']
        parent_r, parent_c = parent['display']['row'], parent['display']['col']
        positions = []
        if child_c != parent_c:
            fill_direction = -1
            if child_c < parent_c:
                fill_direction = 1
            for col in range(child_c, parent_c, fill_direction):
                positions.append((parent_r, col))
        # For good measure, let's return the path in order, from parent to child.
        positions = positions[::-1]

        # Remove extra path placed at child's position.
        if child_r == parent_r:
            return positions[:-1]
        else:
            for row in range(parent_r + 1, child_r):
                positions.append((row, child_c))
        return positions

    # Occupancy grid, pair(row, col) -> (none, Set of parents).
    # Set if the tile has a "path".
    abil_path_parents = {}
    # Occupancy grid, pair(row, col) -> (none, Set of nodes).
    abil_node_positions = {}
    print("Validation Pass 1")
    for abil in atree:
        abil_name = abil['display_name']
        abil_id = abil['id']
        if abil_id not in abil_lookup:
            print("Skipping '{abil_name}'")
            continue

        # Existence checks.
        for list_name in ['parents', 'dependencies', 'blockers']:
            if list_name not in abil:
                print(f"WARNING: '{abil_name}' missing '{list_name}'")
                continue
            for target in abil[list_name]:
                if target not in abil_lookup:
                    print(f"WARNING: '{abil_name}'.{list_name} contains unrecognized ability '{target}'")
        if 'base_abil' in abil:
            if abil['base_abil'] not in abil_lookup:
                print(f"ERROR: '{abil_name}' has unrecognized base ability {abil['base_abil']}")

        # Graph structure/geometry check.
        # Atree graph is stored with pointers from children to parents.
        # Rules: (structure)
        #   Parents on the same row should be bidirectional
        #   Nodes should not exist on 'path' tiles
        #   Path tiles should propagate "parent-ness"
        #       Each path stores a list of parents.
        #       This will be checked in a second iteration after all parents are filled in.

        # Pass 1: Fill out node positions.
        abil_r, abil_c = abil['display']['row'], abil['display']['col']
        abil_pos = (abil_r, abil_c)
        if abil_pos not in abil_node_positions:
            abil_node_positions[abil_pos] = []
        abil_node_positions[abil_pos].append(abil)

        # Pass 1: Fill out paths and parents.
        for target in abil['parents']:
            if target not in abil_lookup:
                print(f"ERROR: '{abil_name}'.parents contains unrecognized ability '{target}'")
                continue
            parent = abil_lookup[target]
            parent_name = parent['display_name']
            parent_r = parent['display']['row']
            # Check invalid row
            if abil_r < parent_r:
                print(f"ERROR: '{abil_name}' is above parent '{parent_name}'")
                continue

            # Check same row
            if abil_r == parent_r:
                if abil_id not in parent['parents']:
                    print(f"WARNING: parent of '{abil_name}' ('{parent_name}') has same row but no path")
            
            for pos in get_path_positions(parent, abil):
                if pos not in abil_path_parents:
                    abil_path_parents[pos] = set()
                abil_path_parents[pos].add(parent['id'])


    # Pass 2.1: Check node position collisions
    for pos, abils in abil_node_positions.items():
        if len(abils) > 1:
            abil_names = [f"'{abil['displayName']}'" for abil in abils]
            print(f"ERROR: Position {pos} has multiple abilities! [{', '.join(abil_names)}]")
        
    # Pass 2.2: Check path geometry
    print("Validation Pass 2")
    for abil in atree:
        abil_name = abil['display_name']
        abil_id = abil['id']
        if abil_id not in abil_lookup:
            # Already warned previously.
            continue

        warned_parents = set()
        for target in abil['parents']:
            if target not in abil_lookup:
                # Already warned previously.
                continue
            parent = abil_lookup[target]
            parent_name = parent['display_name']
            parent_r = parent['display']['row']
            if abil_r < parent_r:
                # Already warned previously.
                continue

            for pos in get_path_positions(parent, abil):
                for path_parent_id in abil_path_parents[pos]:
                    if path_parent_id == abil_id:
                        continue
                    if path_parent_id not in abil['parents']:
                        if path_parent_id not in warned_parents:
                            path_parent = abil_lookup[path_parent_id]
                            print(f"ERROR: '{abil_name}' is connected to '{path_parent['display_name']}' visually but not in code")
                            warned_parents.add(path_parent_id)


def validate_atree_data(atree_data):
    """
    Walk through the ability tree graphs and check for potential errors.
    Assumes the data has already been translated with numeric IDs.
    """
    for _class, info in atree_data.items():
        print(f"Validate tree for class {_class}")
        validate_atree_graph(info)

def main():
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
        validate_atree_data(data)

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
        
        with open('atree_constants_min.json', 'w', encoding='utf-8') as json_dest:
            json.dump(data, json_dest, ensure_ascii=False, separators=(',', ':'))

if __name__ == "__main__":
    main()
