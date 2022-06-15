"""
An old file.

"""

with open("sets.txt", "r") as setsFile:
    sets_split = (x.split("'", 2)[1][2:] for x in setsFile.read().split("a href=")[1:])
    with open("sets_list.txt", "w") as outFile:
        outFile.write("\n".join(sets_split))
