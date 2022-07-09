import "./ValueConfiguration.css";
import { Row, Col, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface propsValueConfiguration {
  setConfigValue: Function;
  configValue: string | undefined;
}

function ValueConfiguration(props: propsValueConfiguration) {
  const { setConfigValue, configValue } = props;
  const navigate = useNavigate();
  const [value, setValue] = useState<string | undefined>(configValue);
  return (
    <Row className="valueConfigBox">
      <Col>
        <Form className="form">
          <Form.Label className="title">Escull com vols valorar els repartiments</Form.Label>
          <Form.Check
            className="check"
            type="radio"
            id="equal"
            label="Mateixa valoració per cada repartiment"
            value="equal"
            checked={value === "equal"}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
          />
          <Form.Check
            className="check"
            type="radio"
            id="max"
            label="Màxim entre el pes i el volum"
            value="max"
            checked={value === "max"}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
          />
          <Form.Check
            className="check"
            type="radio"
            id="min"
            label="Mínim entre el pes i el volum"
            value="min"
            checked={value === "min"}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
          />
          <Form.Check
            className="check"
            type="radio"
            id="sum"
            label="Sumatori del pes i el volum"
            value="sum"
            checked={value === "sum"}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
          />
          <Form.Check
            className="check"
            type="radio"
            id="mul"
            label="Producte entre el pes i el volum"
            value="mul"
            checked={value === "mul"}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
          />
          <Row>
            <Col>
              <Button
                variant="secondary"
                className="button"
                disabled={!value}
                onClick={() => {
                  setConfigValue(value);
                  navigate("/");
                }}
              >
                Enrere
              </Button>
            </Col>
          </Row>
        </Form>
      </Col>
    </Row>
  );
}

export default ValueConfiguration;
