
/*
 * TESTING SECTION
 */

 
const map_url_base = location.href.split("#")[0];
const map_url_tag = location.hash.slice(1);
// console.log(map_url_base);
// console.log(map_url_tag);




/*
 * END testing section
 */

var map;
var image;


var marker;
var guilds = [];
var guildTags = new Map(); //guild name : guild tag. Ex: Atlas Inc : AIn
var guildColors = new Map();

let terrObjs = [];
let claimObjs = [];
//let guildObjs = [];
let routeObjs = [];
let resourceObjs = [];
let locationObjs = [];

let drawterrs = false;
let drawclaims = false;
let drawroutes = false;
let drawresources = false;
let drawlocations = false;

//latitude, longitude is y, x!!!!
const bounds = [[0,0], [6484, 4090]];
const resourceColors = new Map([
    ["Emeralds","#4ae024"],
    ["Ore","#7d7b74"],
    ["Wood","#855E42"],
    ["Crops","#e3cea6"],
    ["Fish","#a6d8e3"]
]);

/** Thanks to kristofbolyai's github page for showing me how to do all of this.
 * 
 */
function init_map(){ //async just in case we need async stuff
    map_elem = document.getElementById("mapdiv");
    let coordx_elem = document.getElementById("coord-x");
    let coordz_elem = document.getElementById("coord-z");

    map = L.map("mapdiv", {
        crs: L.CRS.Simple,
        minZoom: -4,
        maxZoom: 2,
        zoomControl: false,
        zoom: 1
    }).setView([0,0], 1);
    L.imageOverlay("../media/maps/world-map.png", bounds).addTo(map);

    map.fitBounds(bounds);

    L.control.zoom({
        position: 'topleft'
    }).addTo(map);

    
    if (map_url_tag) {
        let coords = map_url_tag.split(",");
        let x = parseFloat(coords[0]);
        let y = parseFloat(coords[1]);
        if (parseFloat(coords[0]) && parseFloat(coords[1])) {
            placeMarker(xytolatlng(x,y)[0], xytolatlng(x,y)[1]);
        }    
    }

    map.addEventListener('mousemove', function(ev) {
        lat = Math.round(ev.latlng.lat);
        lng = Math.round(ev.latlng.lng);
        let coords = latlngtoxy(lat,lng); 
        coordx_elem.textContent = coords[0];
        coordz_elem.textContent = coords[1];
    });

    map.on('contextmenu', function(ev) {
        if (ev.originalEvent.which == 3) {
            lat = Math.round(ev.latlng.lat);
            lng = Math.round(ev.latlng.lng);
            console.log([lat,lng]);
            placeMarker(lat, lng);
        }
        
    });
    map_elem.style.background = "#121516";
    
    try {
        refreshData();
        pullguilds();
        //save_map_data();
    } catch (error) {
        console.log(error);
        let header = document.getElementById("header");
        let warning = document.createElement("p");
        warning.classList.add("center");
        warning.style.color = "red";
        warning.textContent = "";
        header.append(warning);
    }
    console.log("Territory locations:", terrs);
    console.log("Claims:", claims);
    console.log("Territory Neighbors:", neighbors);
    console.log("Territory Resources", resources);
    console.log("List of guilds on the map:", guilds);
    console.log("Guilds and their guild tags:", guildTags);
    console.log("Map locations:", maplocs);
}

/** Places the marker at x, y.
 * 
 * @param {Number} lng - longitude
 * @param {Number} lat - latitude
 */
function placeMarker(lat, lng) {
    let coords = latlngtoxy(lat,lng); 
    if (marker) {
        map.removeLayer(marker);
    }

    marker = L.marker([lat, lng], {icon: L.icon({
        iconUrl: '../media/icons/' + (newIcons ? "new/" : "old/" ) + 'marker.png',
        iconSize: [32, 32], 
        iconAnchor: [16, 32], 
        shadowUrl: '../media/icons/' + (newIcons ? "new/" : "old/" ) + 'shadow.png',
        shadowSize: [1,1],
        shadowAnchor: [16, 32],
        className: "marker"
    })});

    let mcdx = document.getElementById("marker-coord-x");
    mcdx.textContent = coords[0];
    mcdx.style.display = "grid-item-7";
    let mcdi = document.getElementById("marker-coord-img");
    mcdi.style.display = "grid-item-8";
    let mcdz = document.getElementById("marker-coord-z");
    mcdz.textContent = coords[1];
    mcdz.style.display = "grid-item-9";
    location.hash = coords[0] + "," + coords[1];
    marker.addTo(map);
}


//Wynn coordinates: down right = ++
//Leaflet coordinates: up right = ++
//may not be 100% accurate, but "close enough."
function xytolatlng(x, y) {
    return [-y-123, x+2392]; //lat, lng
}

function latlngtoxy(lat, lng) {
    return [lng-2392, -lat-123]; //x, y
}

/** Toggles a button on and off
 * 
 * @param {String} elemID - element ID of button
 */
function toggleButton(elemID) {
    let elem = document.getElementById(elemID);
    if (elem.classList.contains("toggleOn")) {
        elem.classList.remove("toggleOn");
        elem.textContent = elem.textContent.replace("Hide","Show");
    } else {
        elem.classList.add("toggleOn");
        elem.textContent = elem.textContent.replace("Show","Hide");
    }

}



/** Pulls data from the API and overrides all of the current stuff with it. Do NOT call this too often. Called once, upon initialization.
 * 
 */
async function refreshData() { 
    //terrs = new Map();
    claims = new Map();
    terrdata;
    guilds = [];


    const url='https://api.wynncraft.com/public_api.php?action=territoryList';
    fetch(url) 
    .then(data => {return data.json()})
    .then(res => { //success
        terrdata = Object.entries(res['territories']);
        guilds = [];
        for (const terr of terrdata) {
            //terrs.set(terr[0], terr[1].location) //bounds shouldnt change
            claims.set(terr[0], terr[1].guild)
            if (!guilds.includes(terr[1].guild)) {
                guilds.push(terr[1].guild);
            }
        }
        console.log("terrdata \n", terrdata);
        console.log("claims \n", claims);
        console.log("guilds \n", guilds);
        pullguilds();
        console.log("Succesfully pulled and loaded territory data.")
        //save_guild_data();
        console.log("Succesfully saved territory data.")
    })
    .catch(error => { //failure
        console.log(error)
        console.log("Something went wrong pulling and loading territory data. Attempting to load from file...")
        /* @hpp could we eventually get something that writes to local cache on success and attempts to pull from local cache if fails
        */
    })
}


function pullguilds() {
    let guild_url_base = "https://api.wynncraft.com/public_api.php?action=guildStats&command=";
    for (const guild of guilds) {
        fetch(guild_url_base + guild.replaceAll(" ", "%20"))
        .then(data => {return data.json()})
        .then(res => {
            guildTags.set(guild, res.prefix);
            guildColors.set(guild, randomColorHSL([0,1],[0,1],[0.4,1]));
            // console.log("Succesfully pulled guild data for " + guild + ".");
        })
        .catch(error => {
            console.log(error);
            console.log("Something went wrong pulling guild data for " + guild + ".");
        })
    }
}

/** Toggles all location icons/markers on the map.
 * 
 */
 function toggleLocations() {
    let key_elem = document.getElementById("locationlist");
    function drawLocations() {
        let imgs = ["Content_Dungeon.png", "Content_CorruptedDungeon.png", "Content_Quest.png", "Merchant_Emerald.png", "NPC_Blacksmith.png", "NPC_ItemIdentifier.png", "NPC_PowderMaster.png", "Merchant_Potion.png", "Merchant_Armour.png", "Merchant_Weapon.png", "Merchant_Liquid.png", "Merchant_Other.png", "Merchant_Scroll.png", "Merchant_Accessory.png", "Merchant_Tool.png", "painting.png", "Profession_Weaponsmithing.png", "Profession_Armouring.png", "Profession_Alchemism.png", "Profession_Jeweling.png", "Profession_Tailoring.png", "Profession_Scribing.png", "Profession_Cooking.png", "Profession_Woodworking.png", "Content_Miniquest.png", "Special_RootsOfCorruption.png", "Special_FastTravel.png", "Special_LightRealm.png", "Special_Rune.png", "Content_UltimateDiscovery.png", "Merchant_KeyForge.png", "NPC_GuildMaster.png", "Content_GrindSpot.png", "Content_Cave.png", "NPC_TradeMarket.png", "Content_BossAltar.png", "Content_Raid.png", "Merchant_Dungeon.png", "tnt.png", "Merchant_Seasail.png", "Merchant_Horse.png"];
        
        for (const loc of maplocs) {
            //loc has name, icon, x, y, z. don't care about y
            if (loc.icon) {
                let latlng = xytolatlng(loc.x,loc.z);

                let locObj = L.marker(latlng, {icon: L.icon({
                    //iconUrl: '/media/icons/' + (newIcons ? "new/" : "old/" ) + loc.icon,
                    iconUrl: '/media/icons/locations/' + loc.icon,
                    iconSize: [24,24], 
                    iconAnchor: [12,12], 
                    shadowUrl: '/media/icons/' + (newIcons ? "new/" : "old/" ) + 'shadow.png',
                    shadowSize: [1,1],
                    shadowAnchor: [12,12],
                    className: "marker"
                })});
                locObj.addTo(map);

                locationObjs.push(locObj);
            }
        }

        document.getElementById("locations-key").style.display = "";
        for (const img of imgs) {
            let li = document.createElement("li");

            let i = document.createElement("img");
            i.src = "../media/icons/locations/"  + img;
            i.style.maxWidth = "32px";
            i.style.maxHeight = "32px";
            li.appendChild(i);

            let name = img.replace(".png","");
            let type = "";
            if (name.includes("_")) {type = name.split("_")[0]; name = name.split("_")[1]}
            name = name.replaceAll(/([A-Z])/g, ` $1`).trim() + (type ? " (" + type + ") ": "");
            li.innerHTML = li.innerHTML + name;

            key_elem.appendChild(li);
        }
        console.log("Drew all map locations");
    }
    function deleteLocations() {
        for (const location of locationObjs) {
            map.removeLayer(location);
        }
        locationObjs = [];
        key_elem.innerHTML = "";
        document.getElementById("locations-key").style.display = "none";
        console.log("Erased all map locations");
    }

    drawlocations = !drawlocations;
    if (drawlocations) {drawLocations()} 
    else {deleteLocations()}

}


/** These functions toggle drawing of their related objects 
 * 
 */

function toggleTerritories() {

    function drawTerritories() {
        for (const [terr,terrbounds] of terrs) {
            let coords = [xytolatlng(terrbounds.startX,terrbounds.startY), xytolatlng(terrbounds.startX,terrbounds.endY), xytolatlng(terrbounds.endX,terrbounds.endY), xytolatlng(terrbounds.endX,terrbounds.startY)];
            let terrObj = L.polygon(coords, {color: '#f6c328'}).on('mouseover',function(e){displayTerritoryStats(terr)}).on('mouseoff',function(e){eraseTerritoryStats()}).addTo(map);
            terrObj.bindTooltip(`<p class = 'labelp' style = "color:#f6c328">${terr}</p>`, {sticky: true, className:"labelp", interactive: false, permanent: true, direction: 'center'});
            terrObjs.push(terrObj);
        }
        console.log("Drew all territories");
    }
    function deleteTerritories() {
        for (const terr of terrObjs) {
            map.removeLayer(terr);
        }
        terrObjs = [];
        console.log("Erased all territories");
    }

    drawterrs = !drawterrs;

    if (drawterrs) {drawTerritories()} 
    else {deleteTerritories()}
}

function toggleClaims() {
    if(drawterrs) {toggleTerritories(); toggleButton("territories-button")}
    let guildkey = document.getElementById("guild-key");
    let guildkeylist = document.getElementById("guildkeylist");

    function drawClaims() {
        for (const [terr,terrbounds] of terrs) {
            let guild = claims.get(terr);
            let coords = [xytolatlng(terrbounds.startX,terrbounds.startY), xytolatlng(terrbounds.startX,terrbounds.endY), xytolatlng(terrbounds.endX,terrbounds.endY), xytolatlng(terrbounds.endX,terrbounds.startY)];
            let claimObj = L.polygon(coords, {color: `${guildColors.get(guild)}`}).on('mouseover',function(e){displayTerritoryStats(terr)}).on('mouseoff',function(e){eraseTerritoryStats()}).addTo(map);
            claimObj.bindTooltip(`<p class = 'labelp' style = "color:${guildColors.get(guild)}"><b>${terr}</b><br><b>${guildTags.get(guild)}</b></p>`, {sticky: true, className:"labelp", interactive: false, permanent: true, direction: 'center'});
            
            claimObjs.push(claimObj);
        }
        guildkey.style.display = "";
        for (const guild of guilds) {
            let guildLI = document.createElement("li");
            guildLI.style.color = guildColors.get(guild);
            guildLI.textContent = guildTags.get(guild) + " | " + guild;
            guildkeylist.appendChild(guildLI);
        }
        console.log("Drew all claims")
    }
    function deleteClaims() {
        for (const claim of claimObjs) {
            map.removeLayer(claim);
        }
        claimObjs = [];
        guildkeylist.innerHTML = "";
        guildkey.style.display = "none";
        console.log("Erased all claims");
    }

    drawclaims = !drawclaims;
    if (drawclaims) {drawClaims()}
    else {deleteClaims()}
}

function toggleRoutes() {
    function drawRoutes() {
        let drawnRoutes = [];
        for (const [terr,terrbounds] of terrs) {
            for (const neighbor of neighbors.get(terr)) {
                if (!drawnRoutes.includes([neighbor,terr])) {
                    let coords = [xytolatlng( (terrbounds.startX + terrbounds.endX)/2,(terrbounds.startY + terrbounds.endY)/2 ),xytolatlng( (terrs.get(neighbor).startX + terrs.get(neighbor).endX)/2, (terrs.get(neighbor).startY + terrs.get(neighbor).endY)/2)];
                    let routeObj = L.polyline(coords, {color: '#990000'}).addTo(map);
                    drawnRoutes.push([terr,neighbor]);
                    routeObjs.push(routeObj);
                }
            }
        }
        console.log("Drew all territories");
    }
    function deleteRoutes() {
        for (const route of routeObjs) {
            map.removeLayer(route);
        }
        routeObjs = [];
        console.log("Erased all routes");
    }

    drawroutes = !drawroutes;
    if (!drawterrs && !drawclaims && drawroutes) {
        toggleTerritories();
        toggleButton("territories-button");
    } else if (drawterrs && drawclaims && drawroutes) { //this shouldn't happen
        toggleClaims();
        toggleButton("claims-button");
    }

    if (drawroutes) {drawRoutes()} 
    else {deleteRoutes()}
}

function toggleResources() {
    let resourcekeyelem = document.getElementById("resources-key");
    function drawResources() {

        for (const terr of terrs.keys()) {
            //get resources of territory, dupe if doubleresources
            let terr_resources = resources.get(terr).resources.slice();
            let terr_storage = resources.get(terr).storage.slice();
            if (resources.get(terr).doubleresource) {
                let temp = [];
                for (const resource of terr_resources) {
                    temp.push(resource);
                    temp.push(resource);
                }
                terr_resources = temp.slice();
            }
            if (resources.get(terr).emeralds) {
                terr_resources.push("Emeralds");
                if (resources.get(terr).doubleemeralds) {
                    terr_resources.push("Emeralds");
                }
            }

            //territory bounds from bottom left to top right
            let bounds = [ [terrs.get(terr).startX, terrs.get(terr).startY], [terrs.get(terr).endX, terrs.get(terr).endY] ];
            if (bounds[0][0] > bounds[1][0]) {
                let temp = bounds[1][0];
                bounds[1][0] = bounds[0][0];
                bounds[0][0] = temp;
            }
            if (bounds[0][1] < bounds[1][1]) {
                let temp = bounds[1][1];
                bounds[1][1] = bounds[0][1];
                bounds[0][1] = temp;
            }
            let TRcorner = bounds[1];
            let DRcorner = [bounds[1][0],bounds[0][1]];
            let gap = 3;

            //draw resource generation
            for (const n in terr_resources) {
                let resource = terr_resources[n];
                
                let imgBounds = [ [ TRcorner[0]-(16*n)-20-gap*n,TRcorner[1]+4], [ TRcorner[0]-(16*n)-4-gap*n,TRcorner[1]+20] ];
                imgBounds = [xytolatlng(imgBounds[0][0],imgBounds[0][1]), xytolatlng(imgBounds[1][0],imgBounds[1][1])];

                let resourceObj = L.imageOverlay("../media/icons/" + (newIcons ? "new/" : "old/" ) +resource+".png", imgBounds, {className: `${resource} resourceimg`}).addTo(map);
                resourceObjs.push(resourceObj);
            }
            let gearObj = L.imageOverlay("../media/icons/" + (newIcons ? "new/" : "old/" ) + "Gears.png", [xytolatlng(TRcorner[0]-(16*terr_resources.length)-20-gap*terr_resources.length,TRcorner[1]+4), xytolatlng(TRcorner[0]-(16*terr_resources.length)-4-gap*terr_resources.length,TRcorner[1]+20)], {className: `Ore resourceimg`}).addTo(map);
            resourceObjs.push(gearObj);
            //draw resource storage
            for (const n in terr_storage) {
                let storage = terr_storage[n];

                let imgBounds = [ [ DRcorner[0]-(16*n)-20-gap*n,DRcorner[1]-20], [ DRcorner[0]-(16*n)-4-gap*n,DRcorner[1]-4] ];
                imgBounds = [xytolatlng(imgBounds[0][0],imgBounds[0][1]), xytolatlng(imgBounds[1][0],imgBounds[1][1])];
                
                let resourceObj = L.imageOverlay("../media/icons/" + (newIcons ? "new/" : "old/" ) +storage+".png", imgBounds, {alt: `${storage}`, className: `${storage} resourceimg`}).addTo(map);
                resourceObjs.push(resourceObj);
            }
            let chestObj = L.imageOverlay("../media/icons/" + (newIcons ? "new/" : "old/" ) + "Chest.png", [xytolatlng(DRcorner[0]-(16*terr_storage.length)-20-gap*terr_storage.length,DRcorner[1]-20), xytolatlng(DRcorner[0]-(16*terr_storage.length)-4-gap*terr_storage.length,DRcorner[1]-4)], {className: `Wood resourceimg`}).addTo(map);
            resourceObjs.push(chestObj);
        }

        resourcekeyelem.style.display = "";
        console.log("Drew all resources");
    }
    function deleteResources() {
        for (const resourceObj of resourceObjs) {
            console.log(resourceObj);
            map.removeLayer(resourceObj);
        }
        resourceObjs = [];
        resourcekeyelem.style.display = "none";
        console.log("Erased all resources")
    }

    drawresources = !drawresources;
    if (!drawterrs && !drawclaims && drawresources) {
        toggleTerritories();
        toggleButton("territories-button");
    } else if (drawterrs && drawclaims && drawresources) { //this shouldn't happen
        toggleClaims();
        toggleButton("claims-button");
    }

    if (drawresources) {drawResources()}
    else {deleteResources()}
}

/** Displays the territory stats in the territory stats div.
 * 
 * @param {String} terr - the territory name 
 */
function displayTerritoryStats(terr) {
    let terr_stats_elem = document.getElementById("territory-stats");
    terr_stats_elem.innerHTML = ""; //jank

    let terr_resource_stats = resources.get(terr);
    let terr_resources = terr_resource_stats.resources.slice();
    let terr_storage = terr_resource_stats.storage.slice();
    let doubleemeralds = terr_resource_stats.doubleemeralds;
    let emeralds = terr_resource_stats.emeralds;
    let doubleresource = terr_resource_stats.doubleresource;

    if (drawterrs || drawclaims || drawresources) {
        let stats_title = document.createElement("p");
        stats_title.classList.add("smalltitle");
        stats_title.style.maxWidth = "95%";
        stats_title.style.wordBreak = "break-word";
        stats_title.textContent = terr;
        terr_stats_elem.appendChild(stats_title);

        let bounds = terrs.get(terr);
        let p = document.createElement("p");
        p.classList.add("left");
        p.textContent = "(" + bounds.startX + ", " + bounds.startY + ") \u279C (" + bounds.endX + ", " + bounds.endY + ")";
        terr_stats_elem.appendChild(p);
        
        p = document.createElement("p");
        p.classList.add("left");
        p.textContent =  claims.get(terr) + " (" +  guildTags.get(claims.get(terr)) + ")";
        terr_stats_elem.appendChild(p);

        let neighbors_elem = document.createElement("p");
        neighbors_elem.classList.add("left");
        neighbors_elem.style.maxWidth = "95%";
        neighbors_elem.style.wordBreak = "break-word";
        neighbors_elem.textContent = "Neighbors: "
        for (const neighbor of neighbors.get(terr)) {
            neighbors_elem.textContent += neighbor + ", "
        }
        neighbors_elem.textContent = neighbors_elem.textContent.slice(0,-2);
        terr_stats_elem.appendChild(neighbors_elem);
        
        let produce_elem = document.createElement("p");
        produce_elem.classList.add("left");
        produce_elem.style.maxWidth = "95%";
        produce_elem.style.wordBreak = "break-word";
        produce_elem.textContent = "Produces: "
        for (const resource of terr_resources) {
            produce_elem.textContent += resource + (doubleresource ? " x2" : "") + ", ";
        }
        if (emeralds) {
            produce_elem.textContent += "Emeralds" + (doubleemeralds ? " x2" : "") + ", ";
        }
        produce_elem.textContent = produce_elem.textContent.slice(0,-2);
        terr_stats_elem.appendChild(produce_elem);

        let storage_elem = document.createElement("p");
        storage_elem.classList.add("left");
        storage_elem.style.maxWidth = "95%";
        storage_elem.style.wordBreak = "break-word";
        storage_elem.textContent = "Stores: "
        for (const resource of terr_storage) {
            storage_elem.textContent += resource + ", ";
        }
        storage_elem.textContent = storage_elem.textContent.slice(0,-2);
        terr_stats_elem.appendChild(storage_elem);

    }
}
function eraseTerritoryStats() {
    let terr_stats_elem = document.getElementById("territory-stats");
    terr_stats_elem.innerHTML = ""; //jank
}


load_map_init(init_map);

