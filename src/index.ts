import "./styles.css";
import { Map } from "maplibre-gl";

const map = new Map({
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
        // @ts-expect-error -- it works
        ["/", 2, ["get", "stroke-width"]],
        17,
        // @ts-expect-error -- it works
        ["*", 35, ["get", "stroke-width"]],
      ],
    },
  });
});

const code = document.querySelector("main code");

if (!code) throw Error("Missing code element");

document.addEventListener("scroll", function () {
  const { scrollTop, scrollHeight } = this.body;
  const camera = [
    { bearing: 0, lat: 78, lng: 45.5 }
    { bearing: 20, lat: 78, lng: 45.5 }
    { bearing: -5, lat: 78, lng: 45.5 }
    { bearing: 0, lat: 78, lng: 45.5 }
    { bearing: 0, lat: 78, lng: 45.5 }
    { bearing: 0, lat: 78, lng: 45.5 }
    { bearing: 0, lat: 78, lng: 45.5 }
    { bearing: 0, lat: 78, lng: 45.5 }
    { bearing: 0, lat: 78, lng: 45.5 }
    { bearing: 0, lat: 78, lng: 45.5 }
    ][
    Math.round((scrollTop / scrollHeight) * 10)
  ];
  if (camera) {
    map.setCenter([camera.lat, camera.lng]);
    map.setBearing(camera.bearing);
  }
  code.innerHTML = `${scrollTop}/${scrollHeight}`;
});
