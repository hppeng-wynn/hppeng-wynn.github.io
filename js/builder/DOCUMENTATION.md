Each file serves a unique purpose. Scroll down or Ctrl+F until you find the file you want information on.

## atree_constants.js
This stores the data of the ability tree of each and every class.  
The tree is split into each of the 5 Wynncraft Classes. Ctrl+F is useful for finding abilities on this tree.  
For each ability, it is an object with various flags:  
- **display_name** Name of the spell that is displayed to the user
- **desc** Description of the ability
- **parents** Nodes that connect to this ability
- **dependencies** What nodes are required to get this ability?
- **blockers** Defines what nodes are blocked after you get this ability
- **cost** Cost of the ability in AP
- **display** This is an object with subfields that define how the ability is displayed on the tree:
	- **row** The row the icon will be displayed on.
  	- **column** The column the icon will be displayed on.
  	- **icon** The image that will be displayed.
- **properties** This is an object with subfields that define properties of the ability. There's no specific field, it ranges from ability to ability. However, the properties should be self-explanatory.
- **effects** This is an array that has objects with subfields that essentially defines what this ability does to the builder:
	-   **type** This defines exactly what it's doing.
  		-  **replace_spell** Changes a spell box on the side completely.
      	-  **add_spell_prop** This adds a property to the spell box.
      	-  **stat_scaling** This adds a scale bar that allows you to change how much of an ability's "points" (focus, corrupted, etc.) you have.
    - **name** This is the name of the new spell box or spell property.
    - **base_spell** Chooses what number spell box the ability will change.
	- **display** How the property displays to the user.
  	- 
## atree_constants_min.js
A minified version of the above file, with whitespace removed.  
Files are minified to allow them to be sent to the server easier.