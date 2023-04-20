import { default as React, useState } from "react";
import { Form, Modal, Row, Col } from "react-bootstrap";
import { Typography, Button } from "antd";
import styles from "./ammendCarrierServiceActiveDatesModal.module.scss";
import { useDispatch } from "react-redux";
import { PlusOutlined } from "@ant-design/icons";

interface IAmmendCarrierPricesModalModal {
  show: boolean;
  onHide: () => void;
}

const { Text } = Typography;

const AmmendCarrierServiceActiveDatesModal = ({
  show,
  onHide,
}: IAmmendCarrierPricesModalModal) => {
  const [status, setStatus] = useState("Active");
  const [changeStatus, setChangeStatus] = useState("Active");
  const [effectiveType, setEffectiveType] = useState("1");

  return (
    <Modal
      show={show}
      onHide={onHide}
      aria-labelledby="contained-modal-title-vcenter"
      // dialogClassName="modal-lg"
      contentClassName="custom-service-active-dates-modal-style"
      centered
    >
      <Modal.Header closeButton className={styles.modalHeader}>
        <Modal.Title id="contained-modal-title-vcenter">
          Ammend Carrier Servie-Active Dates
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className={styles.modalBody}>
        <Row>
          <Col>
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
          </Col>
        </Row>
        <div className="secondary-section">
          <Row className={`${styles.fieldsRow} ${styles.customFormRow}`}>
            <Text className={styles.headerTitle}>Secondary Parameters</Text>
          </Row>
          <Row className={`${styles.fieldsRow} ${styles.customFormRow}`}>
            <Form.Group controlId="effective_type" as={Col}>
              <Form.Label>Effective Type</Form.Label>
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
              </Form.Group>
            )}
          </Row>
          <Row className={`${styles.fieldsRow} ${styles.customFormRow}`}>
            <Form.Group controlId="change_status" as={Col} md="6">
              <Form.Label>Change Status</Form.Label>
              <Form.Select
                className={styles.formItem}
                // value={"Active"}
                defaultValue={changeStatus}
                name="change_status"
                onChange={({ target }) => setChangeStatus(target.value)}
                required
              >
                <option value="1">Active</option>
                <option value="2">Inactive</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                Please select Effective Type.
              </Form.Control.Feedback>
            </Form.Group>
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

export default AmmendCarrierServiceActiveDatesModal;
