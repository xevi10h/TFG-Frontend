import MapView from "../components/MapView";
import "./DensityMap.css";
import { Row, Col, Button, Spinner, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Area from "../classes/Area";
import Warehouse from "../classes/Warehouse";
import { useEffect, useState } from "react";
import { rawWarehouse } from "../interfaces/rawWarehouse";
import { rawArea } from "../interfaces/rawArea";
import axios from "axios";

interface propsDensityMap {
  warehouses?: Warehouse[];
  setWarehouses?: Function;
  warehousesRequest?: Warehouse[];
  setWarehousesRequest?: Function;
  configValue: string | undefined;
  dateRange: string[];
  volumeRange: Array<number | undefined>;
  weightRange: Array<number | undefined>;
  setMinRadius: Function;
}

function DensityMap(props: propsDensityMap) {
  const {
    warehouses,
    setWarehouses,
    configValue,
    dateRange,
    volumeRange,
    weightRange,
    setMinRadius,
    warehousesRequest,
    setWarehousesRequest,
  } = props;
  const navigate = useNavigate();
  const [areas, setAreas] = useState<Area[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [colorScale, setColorScale] = useState<string>("linear");
  useEffect(() => {
    getAreas();
  }, [warehousesRequest]);

  const getAreas = async (): Promise<void> => {
    const config = {
      url: `http://localhost:8080/areas`,
      method: "post",
      data: JSON.stringify({
        configValue,
        dateRange,
        weightRange,
        volumeRange,
        warehouses: Array.isArray(warehousesRequest) ? warehousesRequest.map((w) => w.serialize) : undefined,
      }),
      headers: {
        "Content-type": "application/json",
      },
    };
    const response = await axios(config);
    const { areas: rawAreas, warehouses: rawWarehouses, minRadius, maxNewPoint, totalLoad } = await response.data();
    const areas: Area[] = [];
    rawAreas.forEach((area: rawArea) => {
      areas.push(new Area(area.id, area.coordinates, area.value));
    });
    const warehousesLocated: Warehouse[] = [];
    if (Array.isArray(rawWarehouses) && rawWarehouses.length > 0) {
      rawWarehouses.forEach((warehouse: rawWarehouse) => {
        warehousesLocated.push(
          new Warehouse(
            warehouse.id,
            warehouse.isAutomatic,
            warehouse.radius,
            warehouse.coordinates,
            warehouse.name,
            warehouse.strategy,
            warehouse.absorbedLoad,
            warehouse.isFixed
          )
        );
      });
    }
    setAreas(areas);
    setWarehouses(warehousesLocated);
    setMinRadius(minRadius);
    if (maxNewPoint !== Number(localStorage.getItem("maxCurrPoint"))) {
      localStorage.setItem("maxPrevPoint", localStorage.getItem("maxCurrPoint"));
      localStorage.setItem("maxCurrPoint", maxNewPoint.toString());
    }
    if (totalLoad !== Number(localStorage.getItem("totalCurrLoad"))) {
      localStorage.setItem("totalPrevLoad", localStorage.getItem("totalCurrLoad"));
      localStorage.setItem("totalCurrLoad", totalLoad.toString());
    }
    setIsLoading(false);
  };

  const maxPrevPoint = Number(localStorage.getItem("maxPrevPoint"));
  const maxCurrPoint = Number(localStorage.getItem("maxCurrPoint"));
  console.log(maxPrevPoint);
  console.log(maxCurrPoint);

  const totalPrevLoad = Number(localStorage.getItem("totalPrevLoad"));
  const totalCurrLoad = Number(localStorage.getItem("totalCurrLoad"));

  return (
    <>
      {isLoading ? (
        <div className="d-flex justify-content-center">
          <Spinner animation="border" role="status" className="spinner">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <Row className="mainBox">
          <Row>
            <Col>
              <MapView
                areas={areas}
                warehouses={warehouses}
                colorScale={colorScale}
                setWarehousesRequest={setWarehousesRequest}
                setIsLoading={setIsLoading}
              />
            </Col>
          </Row>
          <Row className="rowFilters">
            <Col className="colButtons">
              <Button
                onClick={() => {
                  navigate("/");
                }}
                size="lg"
              >
                Enrere
              </Button>
            </Col>
            <Col>
              {maxPrevPoint ? (
                <Row>
                  <Col className="keys">Alçada màxima anterior:</Col>{" "}
                  <Col className="values">
                    {maxPrevPoint >= 10000000
                      ? maxPrevPoint.toExponential(2)
                      : Number(maxPrevPoint.toFixed(2)).toLocaleString("es-ES")}
                  </Col>
                </Row>
              ) : null}
              <Row>
                <Col className="keys">Alçada màxima actual: </Col>
                <Col className="values">
                  {maxCurrPoint >= 10000000
                    ? maxCurrPoint.toExponential(2)
                    : Number(maxCurrPoint.toFixed(2)).toLocaleString("es-ES")}
                </Col>
              </Row>
              {maxPrevPoint ? (
                <Row>
                  <Col className="keys">Increment d'alçada màxima:</Col>
                  <Col
                    className="values"
                    style={{
                      color: maxCurrPoint < maxPrevPoint ? "green" : maxCurrPoint == maxPrevPoint ? "yellow" : "red",
                    }}
                  >
                    {(((maxCurrPoint - maxPrevPoint) / maxPrevPoint) * 100).toFixed(2)} %
                  </Col>
                </Row>
              ) : null}
            </Col>
            <Col>
              {totalPrevLoad ? (
                <Row>
                  <Col className="keys">Càrrega anterior:</Col>
                  <Col className="values">
                    {totalPrevLoad >= 10000000
                      ? totalPrevLoad.toExponential(2)
                      : Number(totalPrevLoad.toFixed(2)).toLocaleString("es-ES")}
                  </Col>
                </Row>
              ) : null}
              <Row>
                <Col className="keys">Càrrega actual:</Col>
                <Col className="values">
                  {totalCurrLoad >= 10000000
                    ? totalCurrLoad.toExponential(2)
                    : Number(totalCurrLoad.toFixed(2)).toLocaleString("es-ES")}
                </Col>
              </Row>
              {totalPrevLoad ? (
                <Row>
                  <Col className="keys">Increment de càrrega:</Col>
                  <Col
                    className="values"
                    style={{
                      color: maxCurrPoint < maxPrevPoint ? "green" : maxCurrPoint == maxPrevPoint ? "yellow" : "red",
                    }}
                  >
                    {(((totalCurrLoad - totalPrevLoad) / totalPrevLoad) * 100).toFixed(2)} %
                  </Col>
                </Row>
              ) : null}
            </Col>
            <Col className="colButtons">
              <Button onClick={() => navigate("/addWarehouse")} size="lg" disabled={!configValue}>
                + Afegir magatzem
              </Button>
            </Col>
          </Row>
          <Row className="rowFilters">
            <Col>
              <Form.Label>Escala de colors</Form.Label>
            </Col>
            <Col>
              <Form.Check
                className="check"
                type="radio"
                id="linear"
                label="Lineal"
                value="linear"
                checked={colorScale === "linear"}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setColorScale(e.target.value)}
              />
            </Col>
            <Col>
              <Form.Check
                className="check"
                type="radio"
                id="exponential"
                label="Exponencial (e^x)"
                value="exponential"
                checked={colorScale === "exponential"}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setColorScale(e.target.value)}
              />
            </Col>
            <Col>
              <Form.Check
                className="check"
                type="radio"
                id="logarithmic"
                label="Logarítmica (lnX)"
                value="logarithmic"
                checked={colorScale === "logarithmic"}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setColorScale(e.target.value)}
              />
            </Col>
          </Row>
        </Row>
      )}
    </>
  );
}

export default DensityMap;
