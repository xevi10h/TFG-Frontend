import MapView from "../components/MapView";
import "./DensityMap.css";
import { Row, Col, Button, Spinner, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Area from "../classes/Area";
import Warehouse from "../classes/Warehouse";
import { useEffect, useState } from "react";
import { rawWarehouse } from "../interfaces/rawWarehouse";
import { rawArea } from "../interfaces/rawArea";

interface propsDensityMap {
  warehouses?: Warehouse[];
  setWarehouses: Function;
  configValue: string | undefined;
  dateRange: string[];
  volumeRange: Array<number | undefined>;
  weightRange: Array<number | undefined>;
  setMinRadius: Function;
}

function DensityMap(props: propsDensityMap) {
  const { warehouses, setWarehouses, configValue, dateRange, volumeRange, weightRange, setMinRadius } = props;
  const navigate = useNavigate();
  const [areas, setAreas] = useState<Area[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [colorScale, setColorScale] = useState<string>("linear");
  useEffect(() => {
    fetchAreas();
  }, []);

  const fetchAreas = async (): Promise<void> => {
    let url = `http://localhost:8080/areas`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        configValue,
        dateRange: `${dateRange[0]},${dateRange[1]}`,
        weightRange: `${weightRange[0]},${weightRange[1]}`,
        volumeRange: `${volumeRange[0]},${volumeRange[1]}`,
        warehouses: Array.isArray(warehouses) ? warehouses.map((w) => w.serialize) : undefined,
      }),
    });
    const { areas: rawAreas, warehouses: rawWarehouses, minRadius, maxNewPoint } = await response.json();
    const areas: Area[] = [];
    rawAreas.forEach((area: rawArea) => {
      areas.push(new Area(area.id, area.coordinates, area.value));
    });
    const warehousesLocated: Warehouse[] = [];
    rawWarehouses.forEach((warehouse: rawWarehouse) => {
      warehousesLocated.push(
        new Warehouse(
          warehouse.id,
          warehouse.isAutomatic,
          warehouse.radius,
          warehouse.coordinates,
          warehouse.name,
          warehouse.strategy
        )
      );
    });
    setAreas(areas);
    setWarehouses(warehousesLocated);
    setMinRadius(minRadius);
    if (maxNewPoint !== Number(localStorage.getItem("maxCurrPoint"))) {
      localStorage.setItem("maxPrevPoint", localStorage.getItem("maxCurrPoint"));
      localStorage.setItem("maxCurrPoint", maxNewPoint.toString());
    }
    setIsLoading(false);
  };

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
              <MapView areas={areas} warehouses={warehouses} colorScale={colorScale} />
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
            <Col className="colButtons">
              {localStorage.getItem("maxPrevPoint") && Number(localStorage.getItem("maxPrevPoint")) > 0 ? (
                <Form.Label className="labelSecondary">{`Alçada màxima anterior: ${localStorage.getItem(
                  "maxPrevPoint"
                )}`}</Form.Label>
              ) : null}
              <Form.Label className="labelSecondary">{`Alçada màxima actual: ${localStorage.getItem(
                "maxCurrPoint"
              )}`}</Form.Label>
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
