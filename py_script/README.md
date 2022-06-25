Process for getting new data:

1. Get new data from API with `get.py`
2. Clean the data (may have to do manually) with the `process` related py files
3. Check validity (json differ or whatever)
4. Create clean and compress versions and copy them into toplevel for usage (can use `clean_json.py` and `compress_json.py` for this).
