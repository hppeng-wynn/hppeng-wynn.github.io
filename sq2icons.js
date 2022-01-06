//which icons to use
let window_storage = window.localStorage;
console.log(window_storage);
icon_state_stored = window_storage.getItem("newicons");
newIcons = true;
if (icon_state_stored === "false") {toggleIcons()} 
