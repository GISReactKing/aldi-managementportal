import { default as React, useState } from "react";
import { Form, Modal, Row, Col } from "react-bootstrap";
import { Typography, Button } from "antd";
import styles from "./ammendCarrierPricesModal.module.scss";
import { useDispatch } from "react-redux";
import { PlusOutlined } from "@ant-design/icons";
import ParametersRow from "./ParametersRow";

interface IAmmendCarrierPricesModalModal {
  show: boolean;
  onHide: () => void;
  modalType: string;
}

const { Text } = Typography;

const AmmendCarrierPricesModal = ({
  show,
  onHide,
  modalType,
}: IAmmendCarrierPricesModalModal) => {
  const [type, setType] = useState(modalType);
  const [status, setStatus] = useState("Active");
  const [effectiveType, setEffectiveType] = useState("1");

  return (
    <Modal
      show={show}
      onHide={onHide}
      aria-labelledby="contained-modal-title-vcenter"
      dialogClassName={type === "Simple" ? "" : "modal-lg"}
      centered
    >
      <Modal.Header closeButton className={styles.modalHeader}>
        <Modal.Title id="contained-modal-title-vcenter">
          Ammend Carrier Prices
        </Modal.Title>
        <div className={styles.methodContainer}>
          <span className={styles.methodTitle}>Pricing Method: </span>
          <span className={styles.methodValue}>Parcel {type}</span>
        </div>
      </Modal.Header>
      <Modal.Body className={styles.modalBody}>
        <Row
          className={`${styles.fieldsRow} ${styles.customFormRow} ${styles.customFormFirstRow}`}
        >
          <Form.Group as={Col} md="8" controlId="name">
            <Form.Label>Carrier</Form.Label>
            <Form.Control
              className={styles.formItem}
              name="name"
              value={"Hermes"}
              onChange={({ target }) => {}}
              required
            />
            <Form.Control.Feedback type="invalid">
              Please enter Carrier.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="status" as={Col} md="4">
            <Form.Label>Carrier Status</Form.Label>
            <Form.Select
              className={`${styles.formItem} ${
                status === "Active" ? styles.greenText : styles.redText
              }`}
              // value={"Active"}
              defaultValue={status}
              name="status"
              onChange={({ target }) => {
                setStatus(target.value);
              }}
              required
            >
              <option className={styles.greenText} value="Active">
                Active
              </option>
              <option className={styles.redText} value="Inactive">
                Inactive
              </option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              Please select Carrier Status.
            </Form.Control.Feedback>
          </Form.Group>
        </Row>
        <Row className={`${styles.fieldsRow} ${styles.customFormRow}`}>
          <Form.Group controlId="dispatch_method" as={Col}>
            <Form.Label>Dispatch Method</Form.Label>
            <Form.Control
              className={styles.formItem}
              name="dispatch_method"
              value={"HER24NON: Hemes 24 Hr Non POD"}
              onChange={({ target }) => {}}
              required
            />
            <Form.Control.Feedback type="invalid">
              Please enter Dispatch Method.
            </Form.Control.Feedback>
          </Form.Group>
        </Row>
        <div className="primary-section">
          <Row className={`${styles.fieldsRow} ${styles.customFormRow}`}>
            <Text className={styles.headerTitle}>Primary Parameters</Text>
          </Row>
          {type !== "Simple" && (
            <>
              <Row className={`${styles.fieldsRow} ${styles.customFormRow}`}>
                <Col md={"11"}>
                  <Row>
                    <Col>Matrix Row#</Col>
                    <Col>Base Price</Col>
                    <Col>From Parcel</Col>
                    <Col>Increment Price</Col>
                    <Col>Increment Start</Col>
                    <Col>Parcel Increment</Col>
                  </Row>
                </Col>
              </Row>

              <ParametersRow />
              <ParametersRow />
            </>
          )}

          <Row className={`${styles.fieldsRow} ${styles.customFormRow}`}>
            <Col>
              <Button className={styles.addButton}>
                Add Row
                <PlusOutlined />
              </Button>
            </Col>
          </Row>
          <Row className={`${styles.fieldsRow} ${styles.customFormRow}`}>
            <Form.Group controlId="primary_base_cost" as={Col} md={"6"}>
              <Form.Label>Base Price</Form.Label>
              <Form.Control
                className={styles.formItem}
                name="primary_base_cost"
                value={"3.25"}
                onChange={({ target }) => {}}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please enter Base Price.
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
        </div>
        <div className="secondary-section">
          <Row className={`${styles.fieldsRow} ${styles.customFormRow}`}>
            <Text className={styles.headerTitle}>Secondary Parameters</Text>
          </Row>
          <Row className={`${styles.fieldsRow} ${styles.customFormRow}`}>
            <Form.Group controlId="primary_base_cost" as={Col}>
              <Form.Group controlId="effective_type" as={Col}>
                <Form.Label>Carrier Status</Form.Label>
                <Form.Select
                  className={styles.formItem}
                  // value={"Active"}
                  defaultValue={effectiveType}
                  name="effective_type"
                  onChange={({ target }) => setEffectiveType(target.value)}
                  required
                >
                  <option value="1">Permanently Effective From</option>
                  <option value="2">Effective Between</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  Please select Effective Type.
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Control.Feedback type="invalid">
                Please enter Base Price.
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row className={`${styles.fieldsRow} ${styles.customFormRow}`}>
            <Form.Group controlId="date_from" as={Col} md={"6"}>
              <Form.Label>Date From</Form.Label>
              <Form.Control
                type="date"
                name="date_from"
                // placeholder="Due date"
                // value={date}
                onChange={(e) => console.log(e.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                Please enter Base Price.
              </Form.Control.Feedback>
            </Form.Group>
            {effectiveType === "2" && (
              <Form.Group controlId="date_to" as={Col} md={"6"}>
                <Form.Label>Date To</Form.Label>
                <Form.Control
                  type="date"
                  name="date_to"
                  // placeholder="Due date"
                  // value={date}
                  onChange={(e) => console.log(e.target.value)}
                />
                <Form.Control.Feedback type="invalid">
                  Please enter Base Price.
                </Form.Control.Feedback>
              </Form.Group>
            )}
          </Row>
          <Row className={`${styles.fieldsRow} ${styles.customFormRow}`}>
            <Form.Group controlId="secondary_base_cost" as={Col} md={"6"}>
              <Form.Label>Base Price</Form.Label>
              <Form.Control
                className={styles.formItem}
                name="secondary_base_cost"
                value={"3.25"}
                onChange={({ target }) => {}}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please enter Base Price.
              </Form.Control.Feedback>
            </Form.Group>
          </Row>

          {type !== "Simple" && (
            <>
              <Row className={`${styles.fieldsRow} ${styles.customFormRow}`}>
                <Col md={"11"}>
                  <Row>
                    <Col>Matrix Row#</Col>
                    <Col>Base Price</Col>
                    <Col>From Parcel</Col>
                    <Col>Increment Price</Col>
                    <Col>Increment Start</Col>
                    <Col>Parcel Increment</Col>
                  </Row>
                </Col>
              </Row>

              <ParametersRow />
              <ParametersRow />
            </>
          )}

          <Row className={`${styles.fieldsRow} ${styles.customFormRow}`}>
            <Col>
              <Button className={styles.addButton}>
                Add Row
                <PlusOutlined />
              </Button>
            </Col>
          </Row>
        </div>
        <Row className={`${styles.fieldsRow} ${styles.customFormRow}`}>
          <div className={styles.buttonsGroup}>
            <button className={styles.cancelButton} onClick={() => onHide()}>
              Cancel
            </button>
            <button
              className={styles.submitInactiveButton}
              // onClick={() => setActiveStep(2)}
              type="submit"
            >
              Save
            </button>
          </div>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default AmmendCarrierPricesModal;
