//which icons to use
let window_storage = window.localStorage;
console.log(window_storage);
icon_state_stored = window_storage.getItem("newicons");
newIcons = true;
if (icon_state_stored === "false") {toggleIcons()} 


/** Toggle icons on the ENTIRE page.
 * 
 */
 function toggleIcons() {
    newIcons = !newIcons;
    let imgs = document.getElementsByTagName("img");
    let divs = document.getElementsByTagName("div");
    let favicon = document.querySelector("link[rel~='icon']");

    if (newIcons) { //switch to new
        favicon.href = favicon.href.replace("media/icons/old","media/icons/new");
        for (const img of imgs) {
            if (img.src.includes("media/icons/old")) {img.src = img.src.replace("media/icons/old","media/icons/new");}
        }
        for (const div of divs) {
            if (div.style.backgroundImage.includes("media/items/old")) {div.style.backgroundImage = div.style.backgroundImage.replace("media/items/old","media/items/new");}
        }
        //toggleiconbutton.textContent = "Use Old Icons";
        window_storage.setItem("newicons","true");
    } else { //switch to old
        favicon.href = favicon.href.replace("media/icons/new","media/icons/old");
        for (const img of imgs) {
            if (img.src.includes("media/icons/new")) {img.src = img.src.replace("media/icons/new","media/icons/old");}
        }
        for (const div of divs) {
            if (div.style.backgroundImage.includes("media/items/new")) {div.style.backgroundImage = div.style.backgroundImage.replace("media/items/new","media/items/old");}
        }
        //toggleiconbutton.textContent = "Use New Icons";
        window_storage.setItem("newicons","false");
    }
}