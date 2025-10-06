// @ts-check
import { Map } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "./styles.css";

const map = new Map({
  container: "app",
  style: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
  center: [-78, 44.5],
  zoom: 7,
  interactive: false,
});

const places = [
  { bearing: 0, center: { lng: -75.71, lat: 45.43 } }, // Ottawa
  { bearing: -12, center: { lng: -73.62, lat: 45.63 } }, // Montreal
  { bearing: -12, center: { lng: -71.13, lat: 46.82 } }, // Québec
  { bearing: -6, center: { lng: -68.61, lat: 48.49 } }, // Rimouski
  { bearing: 6, center: { lng: -64.57, lat: 48.81 } }, // Gaspé
  { bearing: 18, center: { lng: -61.69, lat: 47.38 } }, // Les Îles-de-la-Madeleine
  { bearing: 24, center: { lng: -63.59, lat: 44.65 } }, // Halifax
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

map.on("load", () => {
  map.addSource("line", {
    type: "geojson",
    data: geoJson,
  });

  map.addLayer({
    id: "line",
    type: "line",
    source: "line",
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
});

const code = document.querySelector("main code");

if (!code) throw Error("Missing code element");

let lastUpdate = Date.now();

document.addEventListener("scroll", function () {
  const { scrollTop, scrollHeight } = this.body;

  code.innerHTML = `${scrollTop}/${scrollHeight} (${lastUpdate})`;

  if (Date.now() - lastUpdate < 120) return;
  const options =
    places[Math.floor((places.length * scrollTop) / scrollHeight)];

  if (!options) return;
  map.easeTo(options);
  lastUpdate = Date.now();
});
