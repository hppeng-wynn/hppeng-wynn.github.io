"""
README:

Python 3 required.

pyyaml required (pip3 install pyyaml, or pip install pyyaml)


USAGE:

python3 yaml_to_json.py <infile> <outfile>
"""

import sys
import json
import yaml
json.dump(yaml.load(open(sys.argv[1])), open(sys.argv[2], "w"), indent=2)
