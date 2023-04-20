import { default as React, useState } from "react";
import { Form, Row, Col } from "react-bootstrap";
import { Button } from "antd";
import styles from "../AmmendCarrierPricesModal/ammendCarrierPricesModal.module.scss";
import { DeleteFilled } from "@ant-design/icons";

interface IParametersRow {
  hasDeleteButton: boolean;
}

const ParametersRow = ({ hasDeleteButton = false }: IParametersRow) => {
  const [data, setData] = useState({
    length: 1200,
    volume_m3: 0.06,
    parcel: 99,
    parcel_kg: 15.0,
    consignment_kg: 1485.0,
  });

  return (
    <Row className={`${styles.fieldsRow} ${styles.customFormRow}`}>
      <Col md={"11"}>
        <Row>
          <Col>
            <Form.Control
              className={`${styles.formItem} ${styles.inputInTable}`}
              name="length"
              value={data.length}
              onChange={({ target }) => {}}
            />
          </Col>
          <Col>
            <Form.Control
              className={`${styles.formItem} ${styles.inputInTable}`}
              name="volume_m3"
              value={data.volume_m3}
              onChange={({ target }) => {}}
            />
          </Col>
          <Col>
            <Form.Control
              className={`${styles.formItem} ${styles.inputInTable}`}
              name="parcel"
              value={data.parcel}
              onChange={({ target }) => {}}
            />
          </Col>
          <Col>
            <Form.Control
              className={`${styles.formItem} ${styles.inputInTable}`}
              name="parcel_kg"
              value={data.parcel_kg}
              onChange={({ target }) => {}}
            />
          </Col>
          <Col>
            <Form.Control
              className={`${styles.formItem} ${styles.inputInTable}`}
              name="consignment_kg"
              value={data.consignment_kg}
              onChange={({ target }) => {}}
            />
          </Col>
        </Row>
      </Col>
      {hasDeleteButton && (
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
      )}
    </Row>
  );
};

export default ParametersRow;
