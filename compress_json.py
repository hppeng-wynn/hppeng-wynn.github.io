import sys
import json
infile = sys.argv[1]
outfile = sys.argv[2]
json.dump(json.load(open(infile)), open(outfile, "w"))
