
/*
 * TESTING SECTION
 */

 
const item_url_base = location.href.split("#")[0];
const item_url_tag = location.hash.slice(1);
console.log(item_url_base);
console.log(item_url_tag);

const ITEM_BUILD_VERSION = "7";

function setTitle() {
    let text = "WynnInfo version "+ITEM_BUILD_VERSION;
    document.getElementById("header").classList.add("funnynumber");
    document.getElementById("header").textContent = text;
}

setTitle();




/*
 * END testing section
 */


let item;


function init() {
    //console.log(item_url_tag);

    //displayExpandedItem(expandItem(itemMap.get(item_url_tag).statMap, []), "item-view");
    try{ 
        if(itemMap) {
            item = expandItem(itemMap.get(item_url_tag.replaceAll("%20"," ")), []);
            displayExpandedItem(item, "item-view");
            displayAdditionalInfo("additional-info", item);
            displayIDCosts("identification-costs", item);
            if (item.get("set") && sets[item.get("set")]) {
                displayAllSetBonuses("set-bonus-info",item.get("set"));
            }
            console.log(item);
            displayIDProbabilities("identification-probabilities", item);
        }
    } catch (error) {
        console.log(error);
    }
}



load_init(init);
//load_ing_init(init);