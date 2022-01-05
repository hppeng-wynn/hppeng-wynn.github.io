Process for getting new data:

1. run `python3 dump.py`. This will overwrite `dump.json` and `../ingreds.json`
2. Copy `../old clean.json` or `../compress.json` into `updated.json`
3. Run `python3 transform_merge.py`
4. Run `python3 ing_transform_combine.py`
5. Check validity (json differ or whatever)
6. Copy `clean.json` and `compress.json` into toplevel for usage
