const TILEMAP_API = "http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png";
const TILEMAP_LABEL_API  = "https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png";
const TILEMAP_API_ATTRIB = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attribution">CARTO</a>';

const MAP_CENTER = [49.2400, -123.0800];
const ALLOWED_BOUNDS = L.latLngBounds(L.latLng(49.4500, -123.5200),L.latLng(48.9500, -122.3600));

const INITIAL_ZOOM = 12;
const MIN_ZOOM = 11;
const MAX_ZOOM = 17;



let map = L.map('map', {
    center: MAP_CENTER,
    zoom: INITIAL_ZOOM,
    minZoom: MIN_ZOOM,
    maxZoom: MAX_ZOOM
});

map.createPane('labels');
map.getPane('labels').style.zIndex = 650;
map.getPane('labels').style.pointerEvents = 'none';

map.setMaxBounds(ALLOWED_BOUNDS);

L.tileLayer(TILEMAP_API, {
    attribution: TILEMAP_API_ATTRIB
}).addTo(map);

if (TILEMAP_LABEL_API != "") {
    L.tileLayer(TILEMAP_LABEL_API, {
        attribution: TILEMAP_API_ATTRIB,
        pane: 'labels'
    }).addTo(map);
}

let linesGeoJSON = new L.GeoJSON.AJAX("./geojson/lines.geojson",{
    style: function(feature) {
        switch(feature.properties.Type) {
            case 'RapidBus': return {color: "#009F49"};
            case 'B-Line': return {color: "#F47920"};
            case 'SeaBus': return {color: "#87746A"};
            case 'Commuter': return {color: "#77278B"};
            case 'SkyTrain': {
                switch(feature.properties.Line) {
                    case 'Expo Line': return {color: "#005DAA"};
                    case 'Millenium Line': return {color: "#FFD200"};
                    case 'Canada Line': return {color: "#009AC8"};
                }
            }
        }
    }
});
linesGeoJSON.addTo(map);