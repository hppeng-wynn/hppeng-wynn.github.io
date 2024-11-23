# Updating Ability tree constants and MajorIds

Ability tree file: `atree_constants.json` 
Major IDs file: `major_ids_clean.json`

Make all your change only to those files! All other related files are automatically generated.

#### How to generate the minified files:

0. start in the `js/builder` directory
1. edit either of the files mentioned above.
2. run `python3 ../../py_script/atree-generateID.py
3. Copy the file into the correct version in `data/X.X...`
4. Rename the file according to the old existing file and delete the old file.
