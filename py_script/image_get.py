import os
import json

weapon_types = ["wand", "bow", "spear", "dagger", "relik"]
element_types = ["generic", "fire", "water", "air", "thunder", "earth"] # default1 default2

armor_types = ["helmet", "chestplate", "leggings", "boots"]
armor_tiers = ["leather", "golden", "chain", "iron", "diamond"]

_base_url = "https://www.wynndata.tk/assets/images/items/v4/"

root_loc = "textures/items/"

def grab_texture(base_url, file_name, target_loc):
    os.system("curl "+base_url+file_name+" > "+target_loc+"/"+file_name)
    #os.system("mv "+target_loc+file_name+" "+target_loc+"/"+file_name)

for wep in weapon_types:
    base_url = _base_url+"/"+wep+"/"
    target_loc = root_loc+wep
    os.system("mkdir "+target_loc)
    for elem in element_types:
        for i in range(1,4):
            file_name = wep+"--"+elem+str(i)+".png"
            grab_texture(base_url, file_name, target_loc)
    for i in ["default1", "default2"]:
        file_name = wep+"--"+i+".png"
        grab_texture(base_url, file_name, target_loc)

for armor in armor_types:
    base_url = _base_url+armor+"/"
    target_loc = root_loc+armor
    os.system("mkdir "+target_loc)
    for tier in armor_tiers:
        file_name = armor+"--"+tier+".png"
        grab_texture(base_url, file_name, target_loc)
