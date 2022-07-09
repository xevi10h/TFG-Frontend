import { FormLabel, Row, Col, Form } from "react-bootstrap";
import "./RangeFilter.css";

interface propsRangeFilter {
  id: string;
  valueRange: Array<number | undefined>;
  maxValue: number;
  setValueRange: Function;
}

export default function RangeFilter(props: propsRangeFilter) {
  const { id, valueRange, maxValue, setValueRange } = props;
  return (
    <div>
      <Row>
        <FormLabel className="label">{id === "volume" ? "Volum (en kg)" : "Pes (en cm3)"}</FormLabel>
      </Row>
      <Row>
        <Col>
          <Form.Control
            className="range"
            value={valueRange[0]}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setValueRange([Number(e.currentTarget.value), valueRange[1]]);
            }}
          />
        </Col>
        <Col>
          <Form.Control
            className="range"
            placeholder={`Max: ${maxValue}`}
            value={valueRange[1]}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setValueRange([valueRange[0], Number(e.currentTarget.value)]);
            }}
          />
        </Col>
      </Row>
    </div>
  );
}
