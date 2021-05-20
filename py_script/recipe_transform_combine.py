
import os

with open("../recipes_compress.json", "r") as infile:
    recipe_data = json.loads(infile.read())
recipes = recipe_data["recipes"]

if os.path.exists("recipe_map.json"):
    with open("recipe_map.json","r") as recipe_mapfile:
        recipe_map = json.load(recipe_mapfile)
else:
    recipe_map = {recipe["name"]: i for i, recipe in enumerate(recipes)}

recipe_translate_mappings = { 
    "level" : "lvl",
    "id" : "name",
}
recipe_delete_keys = [ #lol

]

print("loaded all files.")

for recipe in recipes:
    for key in recipe_delete_keys:
        if key in recipe:
            del recipe[key]
    for k, v in recipe_translate_mappings.items():
        if k in recipe:
            recipe[v] = recipe[k]
            del recipe[k]
    if not (recipe["name"] in recipe_map):
        recipe_map[recipe["name"]] = len(recipe_map)
        print(f'New Recipe: {recipe["name"]}')
    recipe["id"] = recipe_map[recipe["name"]]


with open("../recipes_clean.json", "w") as outfile:
    json.dump(recipe_data, outfile, indent = 2)
with open("../recipes_compress.json", "w") as outfile:
    json.dump(recipe_data, outfile)
with open("../recipe_map.json", "w") as recipe_mapfile:
    json.dump(recipe_map,recipe_mapfile,indent = 2)


print('All ing jsons updated.')