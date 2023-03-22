import MapView from "../components/MapView";
import RangeFilter from "../components/RangeFilter";
import RangeDatePicker from "../components/RangeDatePicker";
import "./Home.css";
import { Row, Col, Button, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Expedition from "../classes/Expedition";
import { useEffect, useState } from "react";
import { Point } from "mapbox-gl";
import axios from "axios";

interface propsHome {
  configValue: string | undefined;
  dateRange: string[];
  setDateRange: Function;
  volumeRange: Array<number | undefined>;
  setVolumeRange: Function;
  weightRange: Array<number | undefined>;
  setWeightRange: Function;
}

interface rawExpedition {
  _id: {
    $oid: string;
  };
  id: number;
  date: string;
  address: {
    postalCode: string;
    geometry: {
      type: string;
      coordinates: number[];
    };
  };
  weight: number;
  volume: number;
  dateFull: {
    $date: string;
  };
}

function Home(props: propsHome) {
  const { configValue, dateRange, setDateRange, volumeRange, setVolumeRange, weightRange, setWeightRange } = props;
  const navigate = useNavigate();
  const [maxVolume, setMaxVolume] = useState<number>(0);
  const [maxWeight, setMaxWeight] = useState<number>(0);
  const [expeditions, setExpeditions] = useState<Expedition[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  useEffect(() => {
    getExpeditions();
    setMaxVolume(expeditions.reduce((prev: number, curr: Expedition) => (curr.volume > prev ? curr.volume : prev), 0));
    setMaxWeight(expeditions.reduce((prev: number, curr: Expedition) => (curr.weight > prev ? curr.weight : prev), 0));
  }, [isLoading]);

  const getExpeditions = async (): Promise<void> => {
    console.log(weightRange);
    console.log(volumeRange);
    const url = new URL("http://localhost:8080/expeditions");
    if (configValue) {
      url.searchParams.append("configValue", configValue);
    }
    if (dateRange) {
      dateRange.forEach((date) => {
        url.searchParams.append("dateRange[]", date);
      });
    }
    if (weightRange) {
      weightRange.forEach((weight) => {
        weight && url.searchParams.append("weightRange[]", weight.toString());
      });
    }
    if (volumeRange) {
      volumeRange.forEach((volume) => {
        volume && url.searchParams.append("volumeRange[]", volume.toString());
      });
    }
    const config = {
      url: url.href,
      method: "get",
      headers: {
        "Content-type": "application/json",
      },
    };
    const response = await axios(config);
    const rawExpeditions = await response.data;
    const expeditions: Expedition[] = [];
    rawExpeditions.forEach((expedition: rawExpedition) => {
      expeditions.push(
        new Expedition(
          expedition.date,
          expedition.weight,
          expedition.volume,
          new Point(expedition.address.geometry.coordinates[0], expedition.address.geometry.coordinates[1])
        )
      );
    });
    setExpeditions(expeditions);
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
            <Col style={{ textAlign: "center", fontSize: "x-large" }}>{`Repartiments filtrats: ${
              expeditions.length >= 10000000
                ? expeditions.length.toExponential(2)
                : Number(expeditions.length.toFixed(2)).toLocaleString("es-ES")
            }`}</Col>
          </Row>
          <Row>
            <Col>
              <MapView expeditions={expeditions} />
            </Col>
          </Row>
          <Row className="rowFilters">
            <Col className="colFilters">
              <RangeDatePicker dateRange={dateRange} setDateRange={setDateRange} />
            </Col>
            <Col className="colFilters">
              <RangeFilter id="volume" valueRange={volumeRange} maxValue={maxVolume} setValueRange={setVolumeRange} />
            </Col>
            <Col className="colFilters">
              <RangeFilter id="weight" valueRange={weightRange} maxValue={maxWeight} setValueRange={setWeightRange} />
            </Col>
          </Row>
          <Row className="rowFilters">
            <Col className="colButtons">
              <Button onClick={() => setIsLoading(true)} size="lg">
                Aplicar nous filtres
              </Button>
            </Col>
            <Col className="colButtons">
              <Button
                onClick={() => {
                  navigate("/valueConfiguration");
                }}
                size="lg"
              >
                Configuració de valor
              </Button>
            </Col>
            <Col className="colButtons">
              <Button
                onClick={() => {
                  navigate("/densityMap");
                }}
                size="lg"
                disabled={!configValue}
              >
                Mapa de densitats
              </Button>
            </Col>
          </Row>
        </Row>
      )}{" "}
    </>
  );
}

export default Home;
