import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import mapboxgl, { Popup } from "mapbox-gl";
import { Map } from "mapbox-gl"; // or "const mapboxgl = require('mapbox-gl');"
import "./MapView.css";
import Expedition from "../classes/Expedition";
import Area from "../classes/Area";
import Warehouse from "../classes/Warehouse";
import { Button, Row, Col, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

mapboxgl.accessToken = "pk.eyJ1IjoieGV2aWh1aXgiLCJhIjoiY2wybjRoaHEwMTZqaDNsbDFkcTdkbG44MCJ9.c67r0WHYc33TDWh9HfmDvQ";

interface propsMapView {
  warehouses?: Warehouse[];
  setWarehousesRequest?: Function;
  expeditions?: Expedition[];
  areas?: Area[];
  colorScale?: string;
  setIsLoading?: Function;
}

export default function MapView(props: propsMapView) {
  const mapDiv = useRef<HTMLDivElement>(null);
  const { expeditions, warehouses, setWarehousesRequest, areas } = props;
  let { colorScale } = props;
  const [colorPopup, setPopupColor] = useState<string>("");

  useLayoutEffect(() => {
    const map = new Map({
      container: mapDiv.current!, // container ID
      style: "mapbox://styles/mapbox/streets-v11?optimize=true", // style URL
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
          el.className = "marker";
          new mapboxgl.Marker(el).setLngLat([e.coordinates.x, e.coordinates.y]).addTo(map);
        });
      });
    }

    //Warehouse marker
    if (Array.isArray(warehouses) && warehouses.length > 0) {
      map.on("load", () => {
        warehouses.forEach((w: Warehouse) => {
          let checkbox: boolean = false;
          const placeholder = document.createElement("div");
          const info = new Popup({ closeButton: false, className: "popUpBackground" })
            .setDOMContent(placeholder)
            .setMaxWidth("1000px");

          const popUp = (
            <div className="popUp">
              <Row>
                <Col
                  className="popUpTitle"
                  style={{
                    color: w.isAutomatic ? (w.strategy === "integral" ? "#FF6961" : "#EFA94A") : "#84B6F4",
                    borderBottomColor: w.isAutomatic ? (w.strategy === "integral" ? "#FF6961" : "#EFA94A") : "#84B6F4",
                  }}
                >
                  MAGATZEM {w.isAutomatic ? "AUTOMÀTIC" : "MANUAL"}
                </Col>
              </Row>
              {w.strategy ? (
                <Row>
                  <Col className="fieldsPopUp">Tipus:</Col>
                  <Col className="fieldsPopUp" style={{ fontWeight: "bold" }}>
                    {w.strategy === "integral" ? "Absorbidor" : "Dens"}
                  </Col>
                </Row>
              ) : (
                ""
              )}
              {w.name ? (
                <Row>
                  <Col className="fieldsPopUp">Nom:</Col>
                  <Col className="fieldsPopUp" style={{ fontWeight: "bold" }}>
                    {w.name}
                  </Col>
                </Row>
              ) : (
                ""
              )}
              <Row>
                <Col className="fieldsPopUp">Coordenades: </Col>
                <Col className="fieldsPopUp" style={{ fontWeight: "bold" }}>{`[${w.coordinates.x.toFixed(
                  4
                )}, ${w.coordinates.y.toFixed(4)}]`}</Col>
              </Row>
              <Row>
                <Col className="fieldsPopUp">Càrrega absorbida:</Col>
                <Col className="fieldsPopUp" style={{ fontWeight: "bold" }}>
                  {w.absorbedLoad >= 10000000
                    ? w.absorbedLoad.toExponential(2)
                    : Number(Number(w.absorbedLoad.toFixed(2))).toLocaleString("en-EN")}
                </Col>
              </Row>
              <Row>
                <Form.Check
                  className="checkPopUp"
                  type="checkbox"
                  label="No recalcular la ubicació dels magatzems automàtics"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    checkbox = e.target.checked;
                  }}
                />
              </Row>
              <Row>
                <Col className="popUpButtons">
                  <Button variant="light" onClick={() => info.remove()}>
                    Cancel·lar
                  </Button>
                </Col>
                <Col className="popUpButtons">
                  <Button
                    variant="dark"
                    onClick={() => {
                      setWarehousesRequest(
                        warehouses.reduce((prev: Warehouse[], curr: Warehouse) => {
                          if (curr.id !== w.id) {
                            curr.isFixed = checkbox;
                            prev.push(curr);
                          }
                          return prev;
                        }, [])
                      );
                    }}
                  >
                    Eliminar
                  </Button>
                </Col>
              </Row>
            </div>
          );
          createRoot(placeholder).render(popUp);
          new mapboxgl.Marker({
            color: w.isAutomatic ? (w.strategy === "integral" ? "#FF6961" : "#EFA94A") : "#84B6F4",
          })
            .setLngLat([w.coordinates.x, w.coordinates.y])
            .setPopup(info)
            .addTo(map);
        });
      });
    }

    //Areas marker
    if (Array.isArray(areas) && areas.length > 0) {
      const minDivisor = areas.reduce((prev: number, curr: Area) => {
        let minDivisor = 1;
        while (Math.exp(curr.value / minDivisor) > Number.MAX_SAFE_INTEGER) {
          minDivisor++;
        }
        if (minDivisor > prev) return minDivisor;
        return prev;
      }, 0);
      areas.forEach((area) => {
        area.colorValue = area.value;
        if (colorScale === "exponential") {
          area.colorValue = Math.exp(area.value / minDivisor);
        }
        if (colorScale === "logarithmic") {
          area.colorValue = Math.log(area.value);
        }
      });
      const { minColorValue, maxColorValue } = areas.reduce(
        (prev, curr) => {
          if (curr.colorValue < prev.minColorValue) prev.minColorValue = curr.colorValue;
          if (curr.colorValue > prev.maxColorValue) prev.maxColorValue = curr.colorValue;
          return prev;
        },
        {
          minColorValue: areas[0].colorValue,
          maxColorValue: areas[0].colorValue,
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
              "fill-color": [
                "interpolate",
                ["linear"],
                area.colorValue,
                minColorValue,
                "#84b6f4",
                maxColorValue,
                "#ff6961",
              ],
              "fill-opacity": 0.8,
            },
          });
        });
      });
    }
  }, [expeditions, warehouses, areas, colorScale, colorPopup]);

  return <div ref={mapDiv} className="map" />;
}
