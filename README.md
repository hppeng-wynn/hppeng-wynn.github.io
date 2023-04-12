# WynnBuilder
Wynncraft class building calculator & general utility site

![Builder Screenshot](https://user-images.githubusercontent.com/110062564/192047798-d8583fe1-b188-4bc4-85a9-0eecbf10aeef.PNG)

## Features

### WynnBuilder

Takes a build's items as input and returns all relevant information
- Damage numbers
- Spellcosts
- Equip order
- Skillpoints required & left over
- Defensive stats (EHP, EleDefs, etc.)

It also features an ability tree!
![wynnbuilder ability tree](https://user-images.githubusercontent.com/110062564/192048561-2ec91ba7-1793-4d4f-b4d5-6d7c05cfae99.PNG)

Boosts and Powder specials
- Spell boosts, such as Vanish and War Scream
- Powder special buffs
- Damage numbers for specials like Quake and Wind Prison

and more...

### WynnCrafter
![wynncrafter screenshot](https://user-images.githubusercontent.com/110062564/192048366-5112d334-f44b-4853-b337-4184628e505e.PNG)
Crafting recipe calculator


### WynnAtlas
![wynnatlas screenshot](https://user-images.githubusercontent.com/110062564/192048258-23bc0dd7-b417-4c0c-9437-4392315bf85d.PNG)
Fully featured item search!
Use different filters based on:
- Name
- Rarity
- IDs
And more, to find what item suits your build best!

### WynnCustom

Custom item creator


## Why Use It?
- Client sided = no dependence on server requests
- Correct calculations with the correct formulas
- Comprehensive features
- Constantly maintained by class builders

## Documentation
You can find more precise documentation in each individual folder. Here is some general, over-arching patterns in the code to keep an eye out for.  

**Wynn Element Shorthands**
Internally, every wynncraft element has a shortened version in WynnBuilder:
- Dexterity => dex
- Intelligence => int
- Defense => def
- Agility => agi
- Strength => str
These shorthands are commonly used internally
