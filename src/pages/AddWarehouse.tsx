import "./AddWarehouse.css";
import { Row, Col, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Warehouse from "../classes/Warehouse";
import Area from "../classes/Area";

interface propsAddWarehouse {
  areas: Area[];
  setAreas: Function;
  warehouses: Warehouse[];
  setWarehouses: Function;
  minRadius: number;
}

function AddWarehouse(props: propsAddWarehouse) {
  const { areas, setAreas, warehouses, setWarehouses, minRadius = 0 } = props;
  const navigate = useNavigate();
  const [option, setOption] = useState<string | undefined>(undefined);
  const [radius, setRadius] = useState<number>(undefined);
  const [numWarehouses, setNumWarehouses] = useState<number>(0);
  return (
    <Row className="valueConfigBox">
      <Col>
        <Form className="form">
          <Row>
            <Col>
              <Form.Label className="title">Afageix magatzems</Form.Label>
            </Col>
          </Row>
          <Row className="rowWarehouse">
            <Col>
              <Form.Check
                className="check"
                type="radio"
                id="manual"
                label="Afegir un magatzem manualment"
                value="manual"
                checked={option === "manual"}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOption(e.target.value)}
              />
            </Col>
            <Col className="colLabel">
              <Form.Label className="labelSecondary">Latitud:</Form.Label>
              <Form.Control
                className="inputSecondary"
                disabled={option !== "manual"}
                value={radius}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRadius(Number(e.currentTarget.value))}
              />
              <Form.Label className="labelSecondary">Longitud:</Form.Label>
              <Form.Control
                className="inputSecondary"
                disabled={option !== "manual"}
                value={radius}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRadius(Number(e.currentTarget.value))}
              />
            </Col>
          </Row>
          <Row className="rowWarehouse">
            <Col>
              <Form.Check
                className="check"
                type="radio"
                id="automatic"
                label="Afegir magatzems òptims"
                value="automatic"
                checked={option === "automatic"}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOption(e.target.value)}
              />
            </Col>
            <Col className="colLabel">
              <Form.Label className="labelSecondary">Nombre de magatzems:</Form.Label>
              <Form.Control
                className="inputSecondary"
                disabled={option !== "automatic"}
                value={numWarehouses}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNumWarehouses(Number(e.currentTarget.value))}
              />
            </Col>
          </Row>
          <Row className="rowWarehouse">
            <Col className="colLabel">
              <Form.Label className="label">Radi d'actuació:</Form.Label>
              <Form.Control
                className="input"
                placeholder={`Mínim: ${minRadius}`}
                value={radius}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRadius(Number(e.currentTarget.value))}
              />
              <Form.Label className="label">metres</Form.Label>
            </Col>
          </Row>
          <Row>
            <Col>
              <Button
                variant="primary"
                className="button"
                onClick={() => {
                  navigate("/densityMap");
                }}
              >
                Enrere
              </Button>
            </Col>
            <Col>
              <Button
                disabled={radius < minRadius}
                variant="primary"
                className="button"
                onClick={() => {
                  setWarehouses(numWarehouses);
                  navigate("/densityMap");
                }}
              >
                Afegeix magatzem/s
              </Button>
            </Col>
          </Row>
        </Form>
      </Col>
    </Row>
  );
}

export default AddWarehouse;
