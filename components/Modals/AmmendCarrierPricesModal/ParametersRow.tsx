import { default as React, useState } from "react";
import { Form, Row, Col } from "react-bootstrap";
import { Typography, Button } from "antd";
import styles from "./ammendCarrierPricesModal.module.scss";
import { DeleteFilled } from "@ant-design/icons";
import { ComaSeparator } from "../../../utils/ComaSeparator";

const { Text } = Typography;

const ParametersRow = ({}) => {
  const [data, setData] = useState({
    matrix_row: 1,
    base_price: 3.35,
    from_parcel: 1,
    increment_price: 3.35,
    increment_start: 2,
    parcel_increment: 1,
  });

  return (
    <Row className={`${styles.fieldsRow} ${styles.customFormRow}`}>
      <Col md={"11"}>
        <Row>
          <Col>
            <Form.Control
              className={`${styles.formItem} ${styles.inputInTable}`}
              name="matrix_row"
              value={data.matrix_row}
              onChange={({ target }) => {}}
            />
          </Col>
          <Col>
            <Form.Control
              className={`${styles.formItem} ${styles.inputInTable}`}
              name="base_price"
              value={`£ ${ComaSeparator(data.base_price)}`}
              onChange={({ target }) => {}}
            />
          </Col>
          <Col>
            <Form.Control
              className={`${styles.formItem} ${styles.inputInTable}`}
              name="from_parcel"
              value={data.from_parcel}
              onChange={({ target }) => {}}
            />
          </Col>
          <Col>
            <Form.Control
              className={`${styles.formItem} ${styles.inputInTable}`}
              name="increment_price"
              value={`£ ${ComaSeparator(data.increment_price)}`}
              onChange={({ target }) => {}}
            />
          </Col>
          <Col>
            <Form.Control
              className={`${styles.formItem} ${styles.inputInTable}`}
              name="increment_start"
              value={data.increment_start}
              onChange={({ target }) => {}}
            />
          </Col>
          <Col>
            <Form.Control
              className={`${styles.formItem} ${styles.inputInTable}`}
              name="parcel_increment"
              value={data.parcel_increment}
              onChange={({ target }) => {}}
            />
          </Col>
        </Row>
      </Col>
      <Col md={"1"}>
        <Button
          type="default"
          style={{
            border: "none",
            backgroundColor: "#FFEAEA",
            borderRadius: "4px",
          }}
          icon={<DeleteFilled style={{ color: "red" }} />}
        />
      </Col>
    </Row>
  );
};

export default ParametersRow;
