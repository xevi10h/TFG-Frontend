import MapView from "../components/MapView";
import "./DensityMap.css";
import { Row, Col, Button, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Area from "../classes/Area";
import Warehouse from "../classes/Warehouse";
import { useEffect, useState } from "react";
interface propsDensityMap {
  warehouses?: Warehouse[];
  configValue: string | undefined;
  dateRange: string[];
  volumeRange: Array<number | undefined>;
  weightRange: Array<number | undefined>;
}

function DensityMap(props: propsDensityMap) {
  const { warehouses, configValue, dateRange, volumeRange, weightRange } = props;
  const navigate = useNavigate();
  const [areas, setAreas] = useState<Area[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  useEffect(() => {
    fetchAreas();
  }, []);

  const fetchAreas = async (): Promise<void> => {
    let url = `http://localhost:8080/areas?configValue=${configValue}&dateRange=${dateRange[0]},${dateRange[1]}`;
    if (weightRange.length > 0) {
      url = `${url}&weightRange=${weightRange[0]},${weightRange[1]}`;
    }
    if (volumeRange.length > 0) {
      url = `${url}&volumeRange=${volumeRange[0]},${volumeRange[1]}`;
    }
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });
    const rawAreas = await response.json();
    const areas: Area[] = [];
    rawAreas.forEach((area: any) => {
      areas.push(new Area(area.id, area.coordinates, area.value));
    });
    setAreas(areas);
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
              <MapView areas={areas} warehouses={warehouses} />
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
              <Button onClick={() => navigate("/addWarehouse")} size="lg" disabled={!configValue}>
                + Afegir magatzem
              </Button>
            </Col>
          </Row>
        </Row>
      )}
    </>
  );
}

export default DensityMap;
