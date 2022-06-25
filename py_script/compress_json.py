'''
A generic file used for turning a json into a compressed version of itself (minimal whitespaces).
Compressed files are useful for lowering the amount of data sent.

Usage: python compress_json.py [infile rel path] [outfile rel path]
'''

if __name__ == "__main__":
    import sys
    import json
    infile = sys.argv[1]
    outfile = sys.argv[2]
    json.dump(json.load(open(infile)), open(outfile, "w"))
