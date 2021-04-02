
let storage = window.localStorage;
//resets rickroll
const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}
//storage.removeItem("rick");
let roll = storage.getItem("rick");
if (roll === "true") {
    console.log("rick on")
} else {
    storage.setItem("rick","true"); 
    sleep(2000);
    window.location.assign("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
}
