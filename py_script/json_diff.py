"""
Json diff checker for manual testing - mainly debug


"""

import argparse
import json
import sys

from recordclass import recordclass

JSONDiffReporter = recordclass('JSONDiffReporter', 'val_diff len_diff type_diff path_diff get_key')

def shorten(val):
    """Utility for printing large functions, auto shorten"""
    if len(val) > 100:
        return val[:100] + "..."
    return val

def is_basic(val):
    """Check if the given value is a "primitive" type in json (not object)."""
    return val is int or val is str or val is float or val is bool or val is list

def __custom_input(_):
    """Read from stdin unless user has cancelled"""
    if __custom_input.alive:
        try:
            return input()
        except KeyboardInterrupt:
            __custom_input.alive = False
    return ""
__custom_input.alive = True

def __print_val_diff(val1, val2, path):
    print(f"{path}: Value difference")
    print(f"    Left:  {shorten(str(val1))}")
    print(f"    Right: {shorten(str(val2))}")

def __print_len_diff(val1, val2, path):
    print(f"{path}: Length difference")
    print(f"    Left  (length {len(val1)}): {shorten(str(val1))}")
    print(f"    Right (length {len(val2)}): {shorten(str(val2))}")

def __print_type_diff(type1, type2, path):
    print(f"{path}: Type difference [{str(type1)} != {str(type2)}]")

#def __print_path_diff(left, right, key, path, side):
def __print_path_diff(_1, _2, key, path, side):
    if side:
        print(f"{path}.{key}: Contained in right but not left")
        print(f"    Value: {shorten(str(_2[key]))}")
    else:
        print(f"{path}.{key}: Contained in left but not right")
        print(f"    Value: {shorten(str(_1[key]))}")

# Default diff reporter (just prints everything)
JSON_DIFF_PRINTER = JSONDiffReporter(
    __print_val_diff,
    __print_len_diff,
    __print_type_diff,
    __print_path_diff,
    __custom_input
)
JSON_DIFF_PRINTER_KEYLESS = JSONDiffReporter(
    __print_val_diff,
    __print_len_diff,
    __print_type_diff,
    __print_path_diff,
    lambda path: ""
)

def __val_diff(val1, val2, path):
    errmsg = (f"{path}: Value difference\n"
            + f"    Left:  {shorten(str(val1))}\n"
            + f"    Right: {shorten(str(val2))}")
    raise ValueError(errmsg)

def __len_diff(val1, val2, path):
    errmsg = (f"{path}: Length difference\n"
            + f"    Left  (length {len(val1)}): {shorten(str(val1))}\n"
            + f"    Right (length {len(val2)}): {shorten(str(val2))}")
    raise ValueError(errmsg)

def __type_diff(type1, type2, path):
    raise TypeError(f"{path}: Type difference [{str(type1)} != {str(type2)}]")

#def __print_path_diff(left, right, key, path, side):
def __path_diff(_1, _2, key, path, side):
    if side:
        errmsg = f"{path}.{key}: Contained in right but not left\n"
        errmsg += f"    Value: {shorten(str(_2[key]))}"
    else:
        errmsg = f"{path}.{key}: Contained in left but not right\n"
        errmsg += f"    Value: {shorten(str(_1[key]))}"
    raise AttributeError(errmsg)

def get_test_diff_handler(get_key):
    """Make a JSON diff handler that throws errors on failure.

    :param: get_key: key getter func
    """
    return JSONDiffReporter(__val_diff, __len_diff, __type_diff, __path_diff, get_key)

def list_diff(reporter, list1, list2, path) -> bool:
    """Compute list difference between two object lists (compare by key)"""
    print(f"Encountered object list {path}, enter match key: ", end="", file=sys.stderr)
    key = reporter.get_key(path)
    if key == "":
        if list1 != list2:
            reporter.val_diff(list1, list2, path)
            return True
        return False
    else:
        left = {x[key]: x for x in list1}
        right = {x[key]: x for x in list2}
        return object_diff(reporter, left, right, path)

def object_diff(reporter, obj1, obj2, path) -> bool:
    """Compute object difference between two objects... kinda"""
    ret = False
    for (k, val) in obj1.items():
        if k in obj2:
            obj = obj2[k]
            type1 = type(val)
            type2 = type(obj)
            if type1 != type2:
                reporter.type_diff(type1, type2, f"{path}.{k}")
                ret = True
            elif type1 is list:
                if len(val) != len(obj):
                    reporter.len_diff(val, obj, f"{path}.{k}")
                    ret = True
                elif len(val) == 0:
                    continue
                elif is_basic(type(val[0])):
                    if val != obj:
                        reporter.val_diff(val, obj, f"{path}.{k}")
                        ret = True
                    continue
                ret2 = list_diff(reporter, val, obj, path+"."+k)
                ret = ret or ret2
            elif is_basic(type1) or val is None or obj2 is None:
                if val != obj:
                    reporter.val_diff(val, obj, f"{path}.{k}")
                    ret = True
            else:
                ret = ret or object_diff(reporter, val, obj, f"{path}.{k}")
            continue
        reporter.path_diff(obj1, obj2, k, path, False)
        ret = True
    for k in obj2:
        if k not in obj1:
            reporter.path_diff(obj1, obj2, k, path, True)
            ret = True
    return ret

def json_diff(json1, json2, reporter=JSON_DIFF_PRINTER_KEYLESS) -> bool:
    """Run the json diff tool on two json objects."""
    if isinstance(json1, list) and isinstance(json2, list):
        return list_diff(reporter, json1, json2, "$")
    return object_diff(reporter, json1, json2, "$")

if __name__ == "__main__":
    argparser = argparse.ArgumentParser(description="JSON diff utility")
    argparser.add_argument('file1', action='store', type=str,
        help="First file to compare"
    )
    argparser.add_argument('file2', action='store', type=str,
        help="Second file to compare"
    )

    args = argparser.parse_args()
    with open(args.file1, 'r', encoding="utf-8") as file1:
        json1 = json.load(file1)
    with open(args.file2, 'r', encoding="utf-8") as file2:
        json2 = json.load(file2)
    json_diff(json1, json2, reporter=JSON_DIFF_PRINTER)
