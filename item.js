
/*
 * TESTING SECTION
 */

 
const item_url_base = location.href.split("#")[0];
const item_url_tag = location.hash.slice(1);
console.log(item_url_base);
console.log(item_url_tag);

const ITEM_BUILD_VERSION = "6.9.42";

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
            displayIDCosts(item, "identification-costs");
            displayAdditionalInfo(item, "additional-info");
            console.log(item);
        }
    } catch (error) {
        console.log(error);
    }
}



load_init(init);
//load_ing_init(init);