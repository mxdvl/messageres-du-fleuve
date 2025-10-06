// @ts-check
import { Map } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "./styles.css";

const map = new Map({
  container: "app",
  style: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
  center: [-75.71, 45.43],
  zoom: 7.2,
  interactive: false,
});

const places = [
  { bearing: 0, center: { lng: -75.71, lat: 45.43 }, name: "Ottawa" },
  { bearing: -12, center: { lng: -73.62, lat: 45.63 }, name: "Montreal" },
  { bearing: -12, center: { lng: -71.13, lat: 46.82 }, name: "Québec" },
  { bearing: -6, center: { lng: -68.61, lat: 48.49 }, name: "Rimouski" },
  { bearing: 6, center: { lng: -64.57, lat: 48.81 }, name: "Gaspé" },
  {
    bearing: 18,
    center: { lng: -61.69, lat: 47.38 },
    name: "Les Îles-de-la-Madeleine",
  },
  { bearing: 24, center: { lng: -63.59, lat: 44.65 }, name: "Halifax" },
];

/** @type {GeoJSON.FeatureCollection} */
const geoJson = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        "stroke-width": 70.0,
      },
      geometry: {
        type: "LineString",
        coordinates: places.map((place) => [
          place.center.lng,
          place.center.lat,
        ]),
      },
    },
  ],
};

await new Promise((resolve) => map.on("load", resolve));

map.addSource("line", {
  type: "geojson",
  data: geoJson,
});

map.addLayer({
  id: "line",
  type: "line",
  source: "line",
  paint: {
    "line-color": "navy",
    "line-width": [
      "interpolate",
      ["exponential", 2],
      ["zoom"],
      1,
      ["/", 2, ["get", "stroke-width"]],
      17,
      ["*", 35, ["get", "stroke-width"]],
    ],
    "line-dasharray": [
      "literal",
      [2, 6],
    ],
  },
});

map.addSource("path", {
  type: "geojson",
  data: {
    type: "Feature",
    properties: {},
    geometry: {
      type: "LineString",
      coordinates: [
        [-75.7151516, 45.4293568],
        [-75.6835447, 45.4599799],
        [-75.4487502, 45.5243398],
        [-75.3117868, 45.5443713],
        [-75.2380372, 45.5844129],
        [-75.0709719, 45.5886261],
        [-74.9355136, 45.6465262],
        [-74.6209492, 45.6307412],
        [-74.3592775, 45.5485855],
        [-74.31864, 45.5021894],
        [-74.0161773, 45.4494197],
        [-73.9469431, 45.3987146],
        [-73.6594703, 45.4145649],
        [-73.5179916, 45.4293544],
        [-73.5285273, 45.5095728],
        [-73.4532726, 45.6117909],
        [-73.4276861, 45.7358881],
        [-73.2290009, 45.9060587],
        [-73.1522412, 46.052487],
        [-73.0059617, 46.0827153],
        [-72.914151, 46.1317597],
        [-72.5995866, 46.2817516],
        [-72.4462776, 46.3832503],
        [-72.2325545, 46.4361759],
        [-72.1874017, 46.5480841],
        [-72.0173262, 46.5801633],
        [-71.8623016, 46.6762873],
        [-71.696294, 46.6452152],
        [-71.2537968, 46.756693],
        [-71.1710478, 46.8350196],
        [-70.9979621, 46.8514913],
        [-70.5363151, 47.026787],
        [-70.2432799, 47.3116202],
        [-69.8036573, 47.6984682],
        [-69.4231772, 48.0973959],
        [-68.114957, 48.8433115],
        [-66.0691631, 49.3811766],
        [-64.5089584, 49.319935],
        [-63.4562103, 48.5148356],
        [-61.7863341, 46.5419679],
        [-61.5322225, 45.8067068],
        [-61.4391314, 45.6586234],
        [-61.3175948, 45.5509776],
        [-61.1516833, 45.488122],
        [-60.9230718, 45.352033],
        [-60.8924135, 45.2590669],
        [-61.2614503, 45.0837769],
        [-62.4725367, 44.7564629],
        [-63.4082672, 44.5654914],
        [-63.5385251, 44.5863208],
        [-63.56245, 44.629849],
      ],
    },
  },
});

map.addLayer({
  id: "path",
  type: "line",
  source: "path",
  paint: {
    "line-color": "rebeccapurple",
    "line-width": [
      "interpolate",
      ["exponential", 2],
      ["zoom"],
      1,
      ["/", 2, ["get", "stroke-width"]],
      17,
      ["*", 35, ["get", "stroke-width"]],
    ],
  },
});

const code = document.querySelector("main code");

if (!code) throw Error("Missing code element");

/** @type {{ timestamp: number, place: typeof places[number] | undefined}} */
const last = { timestamp: Date.now(), place: undefined };

document.addEventListener("scroll", function () {
  const { scrollTop, scrollHeight } = this.body;

  const percentage = scrollTop / (scrollHeight - globalThis.innerHeight);

  code.innerHTML = `${(percentage * 100).toFixed(1)}% <br/>
    (${last.place?.name ?? "…"})`;

  if (Date.now() - last.timestamp < 120) return;
  const place = places[Math.floor(places.length * percentage)];

  if (last.place === place || place === undefined) return;
  map.easeTo(place);
  last.timestamp = Date.now();
  last.place = place;
});
