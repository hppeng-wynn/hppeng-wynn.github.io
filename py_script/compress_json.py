'''
A generic file used for turning a json into a compressed version of itself (minimal whitespaces).
Compressed files are useful for lowering the amount of data sent.

Usage: python compress_json.py [infile rel path] [outfile rel path]
'''

if __name__ == "__main__":
    import json
    import argparse

    parser = argparse.ArgumentParser(description="Pull data from wynn API.")
    parser.add_argument('infile', help='input file to read data from')
    parser.add_argument('outfile', help='output file to dump clean data into')
    args = parser.parse_args()

    infile, outfile = args.infile, args.outfile
    json.dump(json.load(open(infile)), open(outfile, "w"), ensure_ascii=False, separators=(',', ':'))
