import json
import sys
import os
import base64
import argparse

parser = argparse.ArgumentParser(description="Do a little trolling.")
parser.add_argument('infile', help='input file to read data from')
parser.add_argument('outfile', help='output file to dump clean data into')
args = parser.parse_args()
infile, outfile = args.infile, args.outfile