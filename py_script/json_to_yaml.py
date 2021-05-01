"""
README:

Python 3 required.

pyyaml required (pip3 install pyyaml, or pip install pyyaml)


USAGE:

python3 json_to_yaml.py <infile> <outfile>
"""

import sys
import json
import yaml
yaml.dump(json.load(open(sys.argv[1])), open(sys.argv[2], "w"), default_flow_style=False)
