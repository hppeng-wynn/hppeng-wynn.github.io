import sys
import json
f1 = sys.argv[1]
f2 = sys.argv[2]

json1 = json.load(open(f1))
json2 = json.load(open(f2))

def shorten(v):
    if len(v) > 100:
        return v[:100] + "..."
    return v
def is_basic(t):
    return t is int or t is str or t is float or t is bool or t is list

def object_diff(obj1, obj2, path):
    for (k, v) in obj1.items():
        if k in obj2:
            obj = obj2[k]
            type1 = type(v)
            type2 = type(obj)
            if type1 != type2:
                print(f"{path}.{k}: Type difference [{str(type1)} != {str(type2)}]")
            elif type1 is list and type2 is list and not is_basic(type(v[0])):
                print(f"Encountered object list {path}.{k}, enter match key: ", end="", file=sys.stderr)
                key = input()
                if (key == ""):
                    if v != obj:
                        print(f"{path}.{k}: Value difference")
                        print(f"    Left: {shorten(str(v))}")
                        print(f"    Right: {shorten(str(obj))}")
                else:
                    left = {x[key]: x for x in obj1[k]}
                    right = {x[key]: x for x in obj2[k]}
                    object_diff(left, right, path+"."+k)
            elif (type1 is list and is_basic(type(v[0]))) or is_basic(type1) or v is None or obj2 is None:
                if v != obj:
                    print(f"{path}.{k}: Value difference")
                    print(f"    Left: {shorten(str(v))}")
                    print(f"    Right: {shorten(str(obj))}")
            else:
                object_diff(v, obj, path+"."+k)
        else:
            print(f"{path}.{k}: Contained in left but not right")
            print(f"    Value: {shorten(str(v))}")
    for (k, v) in obj2.items():
        if k not in obj1:
            print(f"{path}.{k}: Contained in right but not left")
            print(f"    Value: {shorten(str(v))}")

object_diff(json1, json2, "$")
