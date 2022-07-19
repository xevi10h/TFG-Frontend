import "./AddWarehouse.css";
import { Row, Col, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Warehouse from "../classes/Warehouse";
import Area from "../classes/Area";
import { Point } from "mapbox-gl";

interface propsAddNewWarehouses {
  warehouses: Warehouse[];
  setWarehouses: Function;
  option: string;
  radius: number;
  name: string;
  numWarehouses: number;
  manualCoordinates: number[];
  strategy: string;
}

async function addNewWarehouses(props: propsAddNewWarehouses) {
  const { warehouses, setWarehouses, option, radius, name, numWarehouses, manualCoordinates, strategy } = props;
  if (option === "automatic") {
    const newWarehouses: Warehouse[] = [];
    for (let i = 0; i < numWarehouses; i++) {
      newWarehouses.push(new Warehouse(warehouses.length + 1 + i, true, radius, undefined, undefined, strategy));
    }
    await setWarehouses([...warehouses, ...newWarehouses]);
  }
  if (option === "manual") {
    const newWarehouse = new Warehouse(
      warehouses.length + 1,
      false,
      radius,
      new Point(manualCoordinates[0], manualCoordinates[1]),
      name
    );
    await setWarehouses([...warehouses, newWarehouse]);
  }
}

interface propsAddWarehouse {
  warehouses: Warehouse[];
  setWarehouses: Function;
  minRadius: number;
}

function AddWarehouse(props: propsAddWarehouse) {
  const { warehouses, setWarehouses, minRadius = 0 } = props;
  const navigate = useNavigate();
  const [option, setOption] = useState<string | undefined>(undefined);
  const [radius, setRadius] = useState<number | undefined>(undefined);
  const [numWarehouses, setNumWarehouses] = useState<number>(0);
  const [manualCoordinates, setManualCoordinates] = useState<number[]>([0, 0]);
  const [name, setName] = useState<string>("");
  const [strategy, setStrategy] = useState<string | undefined>(undefined);
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
              <Form.Label className="labelSecondary">Nom:</Form.Label>
              <Form.Control
                className="inputSecondary"
                disabled={option !== "manual"}
                value={name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.currentTarget.value)}
              />
              <Form.Label className="labelSecondary">Latitud:</Form.Label>
              <Form.Control
                type="number"
                className="inputSecondary"
                disabled={option !== "manual"}
                value={manualCoordinates[0]}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setManualCoordinates([Number(e.currentTarget.value), manualCoordinates[1]])
                }
              />
              <Form.Label className="labelSecondary">Longitud:</Form.Label>
              <Form.Control
                type="number"
                className="inputSecondary"
                disabled={option !== "manual"}
                value={manualCoordinates[1]}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setManualCoordinates([manualCoordinates[0], Number(e.currentTarget.value)])
                }
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
                type="number"
                className="inputSecondary"
                disabled={option !== "automatic"}
                value={numWarehouses}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNumWarehouses(Number(e.currentTarget.value))}
              />
            </Col>
          </Row>
          <Row className="rowWarehouseSecondary">
            <Col>
              <Form.Label className="labelSecondary">Possibles estratègies:</Form.Label>
            </Col>
          </Row>
          <Row className="rowWarehouseSecondary">
            <Col>
              <Form.Check
                disabled={option !== "automatic"}
                className="labelSecondary"
                type="radio"
                id="integral"
                label="Absorbir màxima càrrega"
                value="integral"
                checked={strategy === "integral"}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStrategy(e.target.value)}
              />
            </Col>
          </Row>
          <Row className="rowWarehouseSecondary">
            <Col>
              <Form.Check
                disabled={option !== "automatic"}
                className="labelSecondary"
                type="radio"
                id="maxArea"
                label="Ubicar en el punt amb més densitats de paquets"
                value="maxArea"
                checked={strategy === "maxArea"}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStrategy(e.target.value)}
              />
            </Col>
          </Row>
          <Row className="rowWarehouse">
            <Col className="colLabel">
              <Form.Label className="label">Radi d'actuació:</Form.Label>
              <Form.Control
                type="number"
                className="input"
                placeholder={`Mínim: ${minRadius}`}
                value={radius}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRadius(Number(e.currentTarget.value))}
              />
              <Form.Label className="label">kms</Form.Label>
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
                disabled={
                  !radius ||
                  radius < minRadius ||
                  option === undefined ||
                  (option === "automatic" && strategy === undefined)
                }
                variant="primary"
                className="button"
                onClick={async () => {
                  await addNewWarehouses({
                    warehouses,
                    setWarehouses,
                    option,
                    radius: radius || 0,
                    name,
                    numWarehouses,
                    manualCoordinates,
                    strategy,
                  });
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
