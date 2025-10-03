import "./styles.css";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

const map = new maplibregl.Map({
  container: "app",
  style: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
  center: [-78, 44.5],
  zoom: 7,
  interactive: false,
  //hash: true,
});

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
        coordinates: [
          [-78, 43.5],
          [-74, 45.5],
        ],
      },
    },
  ],
};

map.on("load", async function () {
  map.addSource("line", {
    type: "geojson",
    data: geoJson,
  });

  map.addLayer({
    id: "line",
    type: "line",
    source: "line",
    paint: {
      "line-color": "red",
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

document.body.addEventListener("scroll", function () {
  console.log(this, this.scrollTop);
});
