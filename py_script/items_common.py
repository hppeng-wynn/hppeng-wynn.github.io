import itertools
import json

with open("translate_mappings.json", 'r') as infile:
    translate_mappings = json.load(infile)

delete_keys = [
    #"addedLore",
    #"skin",
    #"armorType",
    #"armorColor",
    #"material"
]

if __name__ == "__main__":
    # SELF TEST: compare dict keys with `item_metadata.json`.
    from item_wrapper import Items
    local_metadata_file = "item_metadata.json"

    def debug(*args, **kwargs):
        print(*args, **kwargs)

    try:
        debug("updating item metadata...")
        metadata_check = Items().get_metadata()
        with open(local_metadata_file, 'w') as outfile:
            json.dump(metadata_check, outfile, indent=2)
    except:
        debug("Could not update item metadata. using local wynn metadata")
        with open(local_metadata_file, 'r') as infile:
            metadata_check = json.load(infile)

    checklist = set(x for x in itertools.chain(
            translate_mappings['identifications'].keys(),
            translate_mappings['item.base'].keys(),
            translate_mappings['requirements'].keys(),
        ))
    debug(f"Checking {len(checklist)} identifications")
    n = 0
    for identification in metadata_check['identifications'].keys():
        if identification in checklist:
            checklist.remove(identification)
        else:
            print(f"WARNING: id not accounted for: {identification}")
            n += 1
    debug(f"{n} unmapped API identifications.")

    for identification in checklist:
        print(f"WARNING: unused translate map entry {identification}")
    debug(f"{len(checklist)} unused translation entries.")
