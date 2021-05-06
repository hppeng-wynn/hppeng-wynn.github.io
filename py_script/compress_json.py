import sys
import json
infile = sys.argv[1]
outfile = sys.argv[2]
if len(sys.argv) > 3 and sys.argv[3] == "decompress":
    json.dump(json.load(open(infile)), open(outfile, "w"), indent=4)
else:
    json.dump(json.load(open(infile)), open(outfile, "w"))
