/*
 * TESTING SECTION
 */

 
const map_url_base = location.href.split("#")[0];
const map_url_tag = location.hash.slice(1);
console.log(map_url_base);
console.log(map_url_tag);

const MAP_BUILD_VERSION = "6.9.42.0";

function setTitle() {
    let text = "WynnGPS version "+MAP_BUILD_VERSION;
    document.getElementById("header").classList.add("funnynumber");
    document.getElementById("header").textContent = text;
}

setTitle();




/*
 * END testing section
 */

var map;
var image;
let terrs = [];
let claims = [];
var marker;
let markers = [];

//latitude, longitude is y, x!!!!
const bounds = [[0,0], [6484, 4090]];

/** Thanks to kristofbolyai's github page for showing me how to do all of this.
 * 
 */
function init(){
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
    L.imageOverlay("/media/maps/world-map.png", bounds).addTo(map);

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
        iconUrl: '/media/icons/marker.png',
        iconSize: [32, 32], 
        iconAnchor: [16, 32], 
        shadowUrl: '/media/icons/shadow.png',
        shadowSize: [1,1],
        shadowAnchor: [16, 32],
    })});

    let mcdx = document.getElementById("marker-coord-x");
    mcdx.textContent = coords[0];
    mcdx.style.display = "grid-item-7";
    let mcdi = document.getElementById("marker-coord-img");
    mcdx.style.display = "grid-item-8";
    let mcdz = document.getElementById("marker-coord-z");
    mcdz.textContent = coords[1];
    mcdx.style.display = "grid-item-9";
    location.hash = coords[0] + "," + coords[1]
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

init();