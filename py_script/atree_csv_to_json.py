import csv
import json
import re

with open('atree.csv', newline='') as csvfile:
    res = ""
    reader = csv.DictReader(csvfile)
    for row in reader:
        if not row["connector"]:
            row["connector"] = False
        else:
            row["connector"] = True
        row["row"] = int(row["row"])
        row["col"] = int(row["col"])
        if row["rotate"].isdigit():
            row["rotate"] = int(row["rotate"])
        else:
            row.pop("rotate")
        row["desc"] = re.sub("\n", " ", row["desc"])

        resjson = json.dumps(row)
        res += str(resjson) + ",\n"

    print(res)
