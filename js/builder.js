function getItemNameFromID(id) {
    if (redirectMap.has(id)) {
        return getItemNameFromID(redirectMap.get(id));
    }
    return idMap.get(id);
}

function getTomeNameFromID(id) {
    if (tomeRedirectMap.has(id)) {
        return getTomeNameFromID(tomeRedirectMap.get(id));
    }
    return tomeIDMap.get(id);
}

function populateBuildList() {
    const buildList = document.getElementById("build-choice");
    const savedBuilds = window.localStorage.getItem("builds") === null ? {} : JSON.parse(window.localStorage.getItem("builds"));

    for (const buildName of Object.keys(savedBuilds).sort()) {
        const buildOption = document.createElement("option");
        buildOption.setAttribute("value", buildName);
        buildList.appendChild(buildOption);
    }
}

function saveBuild() {
    if (player_build) {
        const savedBuilds = window.localStorage.getItem("builds") === null ? {} : JSON.parse(window.localStorage.getItem("builds"));
        const saveName = document.getElementById("build-name").value;
        const encodedBuild = encodeBuild(player_build);
        if ((!Object.keys(savedBuilds).includes(saveName)
                || document.getElementById("saved-error").textContent !== "") && encodedBuild !== "") {
            savedBuilds[saveName] = encodedBuild.replace("#", "");
            window.localStorage.setItem("builds", JSON.stringify(savedBuilds));

            document.getElementById("saved-error").textContent = "";
            document.getElementById("saved-build").textContent = "Build saved locally";
            
            const buildList = document.getElementById("build-choice");
            const buildOption = document.createElement("option");
            buildOption.setAttribute("value", saveName);
            buildList.appendChild(buildOption);
        } else {
            document.getElementById("saved-build").textContent = "";
            if (encodedBuild === "") {
                document.getElementById("saved-error").textContent = "Empty build";
            }
            else {
                document.getElementById("saved-error").textContent = "Exists. Overwrite?";
            }
        }
    }
}

function loadBuild() {
    let savedBuilds = window.localStorage.getItem("builds") === null ? {} : JSON.parse(window.localStorage.getItem("builds"));
    let saveName = document.getElementById("build-name").value;

    if (Object.keys(savedBuilds).includes(saveName)) { 
        decodeBuild(savedBuilds[saveName])
        document.getElementById("loaded-error").textContent = "";
        document.getElementById("loaded-build").textContent = "Build loaded";
    } else {
        document.getElementById("loaded-build").textContent = "";
        document.getElementById("loaded-error").textContent = "Build doesn't exist";
    }
}

function resetFields(){
    for (let i in powderInputs) {
        setValue(powderInputs[i], "");
    }
    for (let i in equipmentInputs) {
        setValue(equipmentInputs[i], "");
    }
    setValue("str-skp", "0");
    setValue("dex-skp", "0");
    setValue("int-skp", "0");
    setValue("def-skp", "0");
    setValue("agi-skp", "0");
    setValue("level-choice", "106");
    location.hash = "";
    calculateBuild();
}

function toggleID() {
    let button = document.getElementById("show-id-button");
    let targetDiv = document.getElementById("id-edit");
    if (button.classList.contains("toggleOn")) { //toggle the pressed button off
        targetDiv.style.display = "none";
        button.classList.remove("toggleOn");
    }
    else {
        targetDiv.style.display = "block";
        button.classList.add("toggleOn");
    }
}

function toggleButton(button_id) {
    let button = document.getElementById(button_id);
    if (button) {
        if (button.classList.contains("toggleOn")) {
            button.classList.remove("toggleOn");
        } else {
            button.classList.add("toggleOn");
        }
    }
}

// toggle tab
function toggle_tab(tab) {
    if (document.querySelector("#"+tab).style.display == "none") {
        document.querySelector("#"+tab).style.display = "";
    } else {
        document.querySelector("#"+tab).style.display = "none";
    }
}


let tabs = ['overall-stats', 'offensive-stats', 'defensive-stats'];
function show_tab(tab) {
    //console.log(itemFilters)

    //hide all tabs, then show the tab of the div clicked and highlight the correct button
    for (const i in tabs) {
        document.querySelector("#" + tabs[i]).style.display = "none";
        document.getElementById("tab-" + tabs[i].split("-")[0] + "-btn").classList.remove("selected-btn");
    }
    document.querySelector("#" + tab).style.display = "";
    document.getElementById("tab-" + tab.split("-")[0] +  "-btn").classList.add("selected-btn");
}


// TODO: Learn and use await
function init() {
    console.log("builder.js init");
    init_autocomplete();
    decodeBuild(url_tag);
}

//load_init(init3);
(async function() {
    let load_promises = [ load_init(), load_ing_init(), load_tome_init() ];
    await Promise.all(load_promises);
    init();
})();
