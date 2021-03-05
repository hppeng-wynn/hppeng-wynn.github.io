

tiers = ["Normal", "Unique", "Rare", "Legendary", "Fabled", "Mythic", "Set", "Crafted"] //I'm not sure why you would make a custom crafted but if you do you should be able to use it w/ the correct powder formula
types = armorTypes.concat(accessoryTypes).concat(weaponTypes).concat(consumableTypes).map(x => x.substring(0,1).toUpperCase() + x.substring(1));


//constructs a CI from a hash 'CI-qwoefsabaoe' or 'qwoefsaboe'
function getCustomFromHash(hash) {
    
}


/** An object representing a Custom Item. Mostly for vanity purposes.
 * @dep Requires the use of nonRolledIDs and rolledIDs from display.js.
 * @dep Requires the use of attackSpeeds from build.js.   
*/
class Custom{
    /**
     * @description Construct a custom item (CI) from a statMap. 
     * @param {statMap}: A map with keys from rolledIDs or nonRolledIDs or minRolls/maxRolls and values befitting the keys. minRolls and maxRolls are their own maps and have the same keys, but with minimum and maximum values (for rolls). 
     * 
     */
    constructor(statMap){
        this.statMap = statMap;
        this.initCustomStats();
    }

    //Applies powders to the CI
    applyPowders() {
        if (this.statMap.get("category") === "armor") {
            //double apply armor powders
            for(const id of this.statMap.get("powders")){
                let powder = powderStats[id];
                let name = powderNames.get(id);
                this.statMap.set(name.charAt(0) + "Def", (this.statMap.get(name.charAt(0)+"Def") || 0) + 2 * powder["defPlus"]);
                this.statMap.set(skp_elements[(skp_elements.indexOf(name.charAt(0)) + 4 )% 5] + "Def", (this.statMap.get(skp_elements[(skp_elements.indexOf(name.charAt(0)) + 4 )% 5]+"Def") || 0) - 2 * powder["defMinus"]);
            }
        }else if (this.statMap.get("category") === "weapon") {
            //do nothing - weapon powders are handled in displayExpandedItem
        }
    }

    //Sets the "Hash" of the CI. YOU SHOULD NEVER BE CHANGING THE HASH.
    setHash(hash) {
        this.hash = hash;
        //this.statMap.set("displayName", "CI-" + this.hash);
        this.statMap.set("hash", this.hash);
    }

    //TODO
    setHash() {
        this.statMap.set("hash", "Custom Item"); 
    }

    updateName(name) {
        this.name = name;
        this.displayName = name; //name overrides hash
    }

    /* Get all stats for this CI. 
     * Stores in this.statMap.
     * Follows the expandedItem item structure, similar to a crafted item.
     * TODO: Check if this is even useful
    */
    initCustomStats(){
        if (this.statMap.get("tier") === "Crafted") {
            this.statMap.set("Crafted", true);
            for (const e of skp_elements) {
                this.statMap.set(e+"DamLow", this.statMap.get(e+"Dam"));
            }
            this.statMap.set("nDamLow", this.statMap.get("nDam"));
        }
        
        if (this.statMap.get("type")) {
            this.statMap.set("type",this.statMap.get("type").toLowerCase());
            if (armorTypes.includes(this.statMap.get("type"))) {
                this.statMap.set("category","armor");
            } else if (accessoryTypes.includes(this.statMap.get("type"))) {
                this.statMap.set("category","accessory");
            } else if (weaponTypes.includes(this.statMap.get("type"))) {
                this.statMap.set("category","weapon");
            } else if (consumableTypes.includes(this.statMap.get("type"))) {
                this.statMap.set("category","consumable")
            }
        }
        if(this.statMap.get("category") !== "weapon") {
            this.statMap.set("atkSpd", "");
        }

        this.setHash();
        if (this.statMap.get("name") && this.statMap.get("name") !== "") {
            this.statMap.set("displayName", this.statMap.get("name"));
        } else {
            this.statMap.set("displayName", this.statMap.get("hash"));
        }

        this.statMap.set("reqs",[this.statMap.get("strReq"),this.statMap.get("dexReq"),this.statMap.get("intReq"),this.statMap.get("defReq"),this.statMap.get("agiReq")]);
        this.statMap.set("powders", []);
        this.statMap.set("restrict", "Custom Item")
    }

}
