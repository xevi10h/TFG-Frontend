import { Form, Row, Col } from "react-bootstrap";
import "./RangeDatePicker.css";

interface propsRangeDatePicker {
  dateRange: string[];
  setDateRange: Function;
}

export default function RangeDatePicker(props: propsRangeDatePicker) {
  const { dateRange, setDateRange } = props;
  return (
    <div>
      <Row>
        <Form.Label className="label">Rang de dates</Form.Label>
      </Row>
      <Row>
        <Form.Group>
          <Row>
            <Col>
              <Form.Control
                className="datePicker"
                type="date"
                name="From"
                value={dateRange[0]}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setDateRange([e.target.value, dateRange[1]]);
                }}
              />
            </Col>
            <Col>
              <Form.Control
                className="datePicker"
                type="date"
                name="To"
                value={dateRange[1]}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setDateRange([dateRange[0], e.target.value]);
                }}
              />
            </Col>
          </Row>
        </Form.Group>
      </Row>
    </div>
  );
}
