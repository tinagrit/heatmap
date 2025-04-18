const TILEMAP_API = "http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png";
const TILEMAP_LABEL_API  = "https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png";
const TILEMAP_API_ATTRIB = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attribution">CARTO</a>';

const MAP_CENTER = [49.2100, -123.0300];
const ALLOWED_BOUNDS = L.latLngBounds(L.latLng(49.4500, -123.5200),L.latLng(48.9500, -122.3600));

const INITIAL_ZOOM = 11;
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