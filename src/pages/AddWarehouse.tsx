import "./AddWarehouse.css";
import { Row, Col, Form, Button, Tooltip, OverlayTrigger } from "react-bootstrap";
import { InfoCircle } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Warehouse from "../classes/Warehouse";
import Area from "../classes/Area";
import { Point } from "mapbox-gl";
import IWarehouse from "../interfaces/IWarehouse";

interface propsAddNewWarehouses {
  newWarehouse: IWarehouse;
  setWarehousesRequest: Function;
  numWarehouses: number;
}

async function addNewWarehouses(props: propsAddNewWarehouses) {
  const { newWarehouse, setWarehousesRequest, numWarehouses } = props;
  console.log(222, newWarehouse);
  const newWarehouses: Warehouse[] = [];
  for (let i = 0; i < (newWarehouse?.isAutomatic ? numWarehouses : 1); i++) {
    newWarehouses.push(
      new Warehouse({
        name: newWarehouse.name || `Automatic ${i}`,
        isAutomatic: newWarehouse.isAutomatic,
        coordinates: newWarehouse.coordinates,
        model: newWarehouse.model,
        maxRadius: newWarehouse.maxRadius,
        maxCapacity: newWarehouse.maxCapacity,
      })
    );
  }
  console.log(111, newWarehouses);
  await setWarehousesRequest(newWarehouses);
}

interface propsAddWarehouse {
  warehouses: Warehouse[];
  setWarehousesRequest: Function;
  minRadius: number;
}

function AddWarehouse(props: propsAddWarehouse) {
  const { setWarehousesRequest, minRadius = 0 } = props;
  const navigate = useNavigate();
  const [newWarehouse, setNewWarehouse] = useState<IWarehouse>(undefined);
  console.log(newWarehouse);
  const [numWarehouses, setNumWarehouses] = useState<number>(1);
  const [strategy, setStrategy] = useState<string>("");
  return (
    <Row className="valueConfigBox">
      <Col>
        <Form className="form">
          <Row className="rowWarehouse">
            <Col>
              <Form.Label>Escull model amb el que actuarà el magatzem:</Form.Label>
            </Col>
          </Row>
          <Row>
            <Col className="d-flex justify-content-center">
              <img
                src="https://www.sky-engin.jp/en/MATLABAnimation/chap07/make_cylinder_special_R.png"
                alt="cilindro"
                width={"50%"}
              />
            </Col>
            <Col className="d-flex justify-content-center">
              <img
                src="https://www.researchgate.net/publication/305775549/figure/fig10/AS:390719329062921@1470166155734/Figura-48-Funcion-gaussiana-bidimensional-continua-con-s-1-2.png"
                alt="gaussianaBidimensional"
                width={"50%"}
              />
            </Col>
          </Row>
          <Row>
            <Col className="d-flex justify-content-center">
              <Form.Check
                className="checkModel"
                type="radio"
                id="manual"
                label="Cilíndric"
                value="cylinder"
                checked={newWarehouse?.model === "cylinder"}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setNewWarehouse({ ...newWarehouse, model: e.target.value })
                }
              />
            </Col>
            <Col className="d-flex justify-content-center">
              <Form.Check
                className="checkModel"
                type="radio"
                id="manual"
                label="Gaussiana"
                value="gaussian"
                checked={newWarehouse?.model === "gaussian"}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setNewWarehouse({ ...newWarehouse, model: e.target.value })
                }
              />
            </Col>
          </Row>
          <Row className="rowWarehouse">
            <Col>
              <Form.Label>Escull estratègia:</Form.Label>
            </Col>
          </Row>
          <Row>
            <Col className="colLabel">
              <Form.Check
                className="label"
                type="radio"
                label="Radi màxim:"
                value="maxRadius"
                disabled={!newWarehouse?.model}
                checked={strategy === "maxRadius"}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStrategy(e.target.value)}
              />
              <Form.Control
                type="number"
                className="input"
                disabled={!newWarehouse?.model || strategy !== "maxRadius"}
                value={newWarehouse?.maxRadius}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setNewWarehouse({ ...newWarehouse, maxRadius: Number(e.currentTarget.value) })
                }
              />
            </Col>
            <Col className="colLabel">
              <Form.Check
                className="label"
                type="radio"
                label="Capacitat màxima:"
                value="maxCapacity"
                disabled={!newWarehouse?.model}
                checked={strategy === "maxCapacity"}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStrategy(e.target.value)}
              />
              <Form.Control
                type="number"
                className="input"
                disabled={!newWarehouse?.model || strategy !== "maxCapacity"}
                value={newWarehouse?.maxCapacity}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setNewWarehouse({ ...newWarehouse, maxCapacity: Number(e.currentTarget.value) })
                }
              />
            </Col>
          </Row>
          <Row className="rowWarehouse">
            <Col>
              <Form.Label>Escull tipus de magatzem:</Form.Label>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Check
                className="check"
                type="radio"
                id="manual"
                label="Magatzem manual"
                value="manual"
                checked={newWarehouse?.isAutomatic === false}
                disabled={!newWarehouse?.model || !strategy}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setNewWarehouse({ ...newWarehouse, isAutomatic: false })
                }
              />
            </Col>
            <Col className="colLabel">
              <Form.Label className="labelSecondary">Nom:</Form.Label>
              <Form.Control
                className="inputSecondary"
                disabled={newWarehouse?.isAutomatic !== false}
                value={newWarehouse?.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setNewWarehouse({ ...newWarehouse, name: e.target.value })
                }
              />
              <Form.Label className="labelSecondary">Latitud:</Form.Label>
              <Form.Control
                type="number"
                className="inputSecondary"
                disabled={newWarehouse?.isAutomatic !== false}
                value={newWarehouse?.coordinates?.latitude}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setNewWarehouse({
                    ...newWarehouse,
                    coordinates: {
                      longitude: newWarehouse?.coordinates?.longitude,
                      latitude: Number(e.currentTarget.value),
                    },
                  })
                }
              />
              <Form.Label className="labelSecondary">Longitud:</Form.Label>
              <Form.Control
                type="number"
                className="inputSecondary"
                disabled={newWarehouse?.isAutomatic !== false}
                value={newWarehouse?.coordinates?.longitude}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setNewWarehouse({
                    ...newWarehouse,
                    coordinates: {
                      latitude: newWarehouse?.coordinates?.latitude,
                      longitude: Number(e.currentTarget.value),
                    },
                  })
                }
              />
            </Col>
          </Row>
          <Row className="rowWarehouse">
            <Col>
              <Form style={{ display: "inline-flex" }}>
                <Form.Check
                  className="check"
                  type="radio"
                  id="automatic"
                  label="Magatzem/s òptim/s"
                  value="automatic"
                  checked={newWarehouse?.isAutomatic}
                  disabled={!newWarehouse?.model || !strategy}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setNewWarehouse({ ...newWarehouse, isAutomatic: true })
                  }
                  feedbackTooltip={true}
                />{" "}
                <span className="tooltipIcon">
                  <OverlayTrigger
                    placement="bottom"
                    overlay={
                      <Tooltip>
                        {" "}
                        En cas que s'esculli un radi màxim, la capacitat se suposarà il·limitada (i viceversa) a l'hora
                        de calcular la millor ubicació del magatzem
                      </Tooltip>
                    }
                  >
                    <InfoCircle />
                  </OverlayTrigger>
                </span>
              </Form>
            </Col>
            <Col className="colLabel">
              <Form.Label className="labelSecondary">Nombre de magatzems:</Form.Label>
              <Form.Control
                disabled={newWarehouse?.isAutomatic !== true}
                className="inputSecondary"
                type="number"
                value={numWarehouses}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNumWarehouses(Number(e.currentTarget.value))}
              />
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
                  newWarehouse?.model === undefined ||
                  (strategy === "maxRadius" && newWarehouse?.maxRadius <= 0) ||
                  (strategy === "maxCapacity" && newWarehouse?.maxCapacity <= 0) ||
                  newWarehouse?.maxCapacity < 0 ||
                  newWarehouse?.isAutomatic === undefined ||
                  (newWarehouse?.isAutomatic === true && numWarehouses <= 0) ||
                  (newWarehouse?.isAutomatic === false &&
                    (!newWarehouse?.name ||
                      newWarehouse?.coordinates?.latitude > 90 ||
                      newWarehouse?.coordinates?.latitude < -90 ||
                      newWarehouse?.coordinates?.longitude > 180 ||
                      newWarehouse?.coordinates?.longitude < -180 ||
                      (!newWarehouse?.maxCapacity && !newWarehouse?.maxRadius)))
                }
                variant="primary"
                className="button"
                onClick={async () => {
                  await addNewWarehouses({
                    newWarehouse,
                    setWarehousesRequest,
                    numWarehouses,
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
