const TILEMAP_API = "http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png";
const TILEMAP_LABEL_API  = "https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png";
const TILEMAP_API_ATTRIB = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attribution">CARTO</a>';

const MAP_CENTER = [49.2400, -123.0800];
const ALLOWED_BOUNDS = L.latLngBounds(L.latLng(49.4500, -123.5200),L.latLng(48.9500, -122.3600));

const INITIAL_ZOOM = 12;
const MIN_ZOOM = 11;
const MAX_ZOOM = 17;

const LINE_COLORS = {
    "RapidBus": "#009F49",
    "B-Line": "#F47920",
    "SeaBus": "#87746A",
    "Commuter": "#77278B",
    "Expo Line": "#005DAA",
    "Millenium Line": "#FFD200",
    "Canada Line": "#009AC8"
}

const LABELS_ORDER = 5;

const MARKERS_ORDER = 4;
let MARKERS_PROPS = {
    radius: 4,
    fillColor: "#FFFFFF",
    color: "#00355F",
    weight: 2,
    opacity: 1,
    fillOpacity: 1
};

const ZOOM_THRESHOLD = 13;

const ZOOMED_IN_MARKERS_ORDER = 3;
let ZOOMED_IN_MAJOR_PROPS = {
    radius: 30,
    fillColor: "#FFFFFF",
    color: "#00355F",
    weight: 3,
    opacity: 1,
    fillOpacity: 1
};
let ZOOMED_IN_SIGNIF_PROPS = {
    radius: 15,
    fillColor: "#FFFFFF",
    color: "#009F49",
    weight: 2,
    opacity: 1,
    fillOpacity: 0.5
};
let ZOOMED_IN_INSIGNIF_PROPS = {
    radius: 10,
    fillColor: "#0081C6",
    color: "#3F3F3F",
    weight: 0.5,
    opacity: 0.5,
    fillOpacity: 0.5
};





const showNamePopup = (feature, layer) => {
    if (feature.properties && feature.properties.name) {
        layer.bindPopup(feature.properties.name);
    }
}

MARKERS_PROPS.pane = "markers";
ZOOMED_IN_MAJOR_PROPS.pane = "bgMarkers";
ZOOMED_IN_SIGNIF_PROPS.pane = "bgMarkers";
ZOOMED_IN_INSIGNIF_PROPS.pane = "bgMarkers";

let map = L.map('map', {
    center: MAP_CENTER,
    zoom: INITIAL_ZOOM,
    minZoom: MIN_ZOOM,
    maxZoom: MAX_ZOOM
});

map.createPane('labels');
map.getPane('labels').style.zIndex = 650 + LABELS_ORDER;
// map.getPane('labels').style.pointerEvents = 'none';

map.createPane('markers');
map.getPane('markers').style.zIndex = 650 + MARKERS_ORDER;

map.createPane('bgMarkers');
map.getPane('bgMarkers').style.zIndex = 650 + ZOOMED_IN_MARKERS_ORDER;

map.setMaxBounds(ALLOWED_BOUNDS);

L.tileLayer(TILEMAP_API, {
    attribution: TILEMAP_API_ATTRIB,
    bounds: ALLOWED_BOUNDS,
    errorTileUrl: './styles/errtile.png'
}).addTo(map);

if (TILEMAP_LABEL_API != "") {
    L.tileLayer(TILEMAP_LABEL_API, {
        attribution: TILEMAP_API_ATTRIB,
        bounds: ALLOWED_BOUNDS,
        pane: 'labels'
    }).addTo(map);
}

let linesGeoJSON = new L.GeoJSON.AJAX("./geojson/lines.geojson",{
    style: function(feature) {
        if (feature.properties.Type == "SkyTrain") {
            return {color: LINE_COLORS[feature.properties.Line]}
        } else {
            return {color: LINE_COLORS[feature.properties.Type]}
        }
    }
});
linesGeoJSON.addTo(map);

L.Util.ajax("./geojson/trainPoints.geojson").then((data)=> {
    L.geoJSON(data, {
        pointToLayer: function (feature, latlng) {
            return L.featureGroup([
                L.circleMarker(latlng,MARKERS_PROPS).bindPopup(feature.properties.name),
                L.circle(latlng,ZOOMED_IN_MAJOR_PROPS).bindPopup(feature.properties.name),
            ]); 
        },
        onEachFeature: showNamePopup
    }).addTo(map);
});

L.Util.ajax("./geojson/majorBusPoints.geojson").then((data)=> {
    L.geoJSON(data, {
        pointToLayer: function (feature, latlng) {
            return L.featureGroup([
                L.circleMarker(latlng,MARKERS_PROPS).bindPopup(feature.properties.name)
            ]); 
        }
    }).addTo(map);
});

L.Util.ajax("./geojson/busPoints.geojson").then((data)=> {
    L.geoJSON(data, {
        pointToLayer: function (feature, latlng) {
            if (feature.properties.rapid == "") {
                return L.circle(latlng,ZOOMED_IN_INSIGNIF_PROPS).bindPopup(feature.properties.name);
            } else {
                if (feature.properties.rapid[0] == "R") {
                    ZOOMED_IN_SIGNIF_PROPS.color = LINE_COLORS["RapidBus"];
                } else if (feature.properties.rapid == "099") {
                    ZOOMED_IN_SIGNIF_PROPS.color = LINE_COLORS["B-Line"];
                }
                return L.circle(latlng,ZOOMED_IN_SIGNIF_PROPS).bindPopup(feature.properties.name);
            }
        }
    }).addTo(map);
});

const togglePane = () => {
    if (map.getZoom() > ZOOM_THRESHOLD) {
        map.getPane('markers').style.display = 'none';
        map.getPane('bgMarkers').style.display = '';
    } else {
        map.getPane('markers').style.display = '';
        map.getPane('bgMarkers').style.display = 'none';
    }
}
togglePane();
map.on('zoomend', togglePane);