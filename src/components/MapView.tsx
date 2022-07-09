import { useLayoutEffect, useRef } from "react";
import mapboxgl, { Point } from "mapbox-gl";
import { Map } from "mapbox-gl"; // or "const mapboxgl = require('mapbox-gl');"
import "./MapView.css";
import Expedition from "../classes/Expedition";
import Area from "../classes/Area";
import Warehouse from "../classes/Warehouse";

const longMinBarcelona = 41.31704;
const longMaxBarcelona = 41.46791;
const latMinBarcelona = 2.0525;
const latMaxBarcelona = 2.22836;

mapboxgl.accessToken = "pk.eyJ1IjoieGV2aWh1aXgiLCJhIjoiY2wybjRoaHEwMTZqaDNsbDFkcTdkbG44MCJ9.c67r0WHYc33TDWh9HfmDvQ";

interface propsMapView {
  warehouses?: Warehouse[];
  expeditions?: Expedition[];
  areas?: Area[];
}

export default function MapView(props: propsMapView) {
  const mapDiv = useRef<HTMLDivElement>(null);
  const { expeditions, warehouses, areas } = props;

  useLayoutEffect(() => {
    const map = new Map({
      container: mapDiv.current!, // container ID
      style: "mapbox://styles/mapbox/streets-v11", // style URL
      center: [2.16992, 41.3879], // starting position [lng, lat]
      zoom: 10, // starting zoom
    });

    //Expeditons marker
    if (Array.isArray(expeditions) && expeditions.length > 0) {
      const expeditionsToWatch = expeditions.slice(0, 999);
      // Set marker options.
      map.on("load", () => {
        expeditionsToWatch.forEach((e: Expedition) => {
          const el = document.createElement("div");
          // const width = 100;
          // const height = 100;
          el.className = "marker";
          // el.style.width = `${width}px`;
          // el.style.height = `${height}px`;
          // el.style.backgroundSize = '100%';
          // el.style.color = 'red'
          new mapboxgl.Marker(el).setLngLat([e.coordinates.x, e.coordinates.y]).addTo(map);
        });
      });
    }

    //Warehouse marker
    if (Array.isArray(warehouses) && warehouses.length > 0) {
      warehouses.forEach((warehouse: Warehouse) => {
        new mapboxgl.Marker().setLngLat([warehouse.coordinates.x, warehouse.coordinates.y]).addTo(map);
      });
    }

    //Areas marker
    if (Array.isArray(areas) && areas.length > 0) {
      console.log(areas);
      const { minValue, maxValue } = areas.reduce(
        (prev, curr) => {
          if (curr.value < prev.minValue) prev.minValue = curr.value;
          if (curr.value > prev.maxValue) prev.maxValue = curr.value;
          return prev;
        },
        {
          minValue: areas[0].value,
          maxValue: areas[0].value,
        }
      );
      map.on("load", () => {
        // Add a data source containing GeoJSON data.
        areas.forEach(async (area) => {
          map.addSource(area.id.toString(), area.serializeMapBox);
          // Add a new layer to visualize the polygon.
          map.addLayer({
            id: area.id.toString(),
            type: "fill",
            source: area.id.toString(), // reference the data source
            layout: {},
            paint: {
              "fill-color": ["interpolate", ["linear"], area.value, minValue, "#84b6f4", maxValue, "#ff6961"],
              "fill-opacity": 0.8,
            },
          });
        });
      });
    }
  }, [expeditions, warehouses, areas]);

  return <div ref={mapDiv} className="map" />;
}
