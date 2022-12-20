let window_storage = window.localStorage;
newIcons = true;
if (window_storage.getItem("newicons") === "false") {
    toggleIcons();
} 

/** Toggle icons on the ENTIRE page.
 * 
 */
function toggleIcons() {
    newIcons = !newIcons;
    window_storage.setItem("newicons", newIcons.toString());
    let newOrOld = (newIcons ? "new" : "old");

    let imgs = document.getElementsByTagName("img");
    let divs = document.getElementsByClassName("item-display-new-toggleable");
    let favicon = document.querySelector("link[rel~='icon']");
    favicon.href = favicon.href.replace("media/icons/" + (newIcons ? "old" : "new"), "media/icons/" + newOrOld);
    for (const img of imgs) {
        // if doesn't contain, replace() does nothing
        img.src = img.src.replace("media/icons/" + (newIcons ? "old" : "new"), "media/icons/" + newOrOld);
    }
    for (let i = 0; i < divs.length; i++) {
        divs.item(i).style.backgroundImage = "url('../media/items/" + (newIcons ? "new" : "old") + ".png')";
    }
}