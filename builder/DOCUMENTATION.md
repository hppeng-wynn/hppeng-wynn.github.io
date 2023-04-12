# Builder
This section of the WynnBuilder source code is for the builder's HTML.  
The JavaScript can be found in the "js" folder.  

## CSS
Internally, the Builder uses Bootstrap CSS.
If you don't know what it is, Bootstrap CSS is a method of handling the CSS of a webpage without having to worry about exact CSS properties and rules.
Instead, you can use Bootstrap's utility classes, allowing you to quickly make buttons, sidebars, etc.
WynnBuilder also has some of it's own CSS found in the "css" directory.

## Divs and Elements
Each div has it's own purpose.  

### Divs for things such as navbars and banners:
- **discord-banner-dev** This div is responsible for advertising the discord.
- **main-sidebar** This is responsible for the sidebar that takes you to each of WynnBuilder's other tools, such as WynnCrafter and WynnCustom.
- **mobile-navbar** The same as the main sidebar, but allows it to work on mobile.

### Container divs that include other divs:
- **equipment-inputs** This div is responsible for containing all of the divs that allow for equipment input.

### Elements for the equipment inputs:
- **[item]-choice** This is responsible for holding the input of the item and it's powders if applicable.
- **[item]-dropdown** This allows for the items to have a dropdown list to predict what item you want based what item you're typing in.
- **[item]-img** This is the element that shows the image for each piece.

### Elements for skillpoints:
- **[shorthand element]-skp** This holds the value of each skillpoint.
- **[shorthand element]-skp-assign** Value of assigned skillpoints for that element.
- **[shorthand element]-skp-base** Value of base (given by gear) skillpoints for that element.
- **[shorthand element]-skp-pct** Value of the percentage that the skillpoint affects. (e.g 5% chance to crit for Dexterity)

### Handling of boosts:
- **[boost]-boost** A button that is either enabled/disabled to show if the boost is active or not.