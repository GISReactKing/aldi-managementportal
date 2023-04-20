import { default as React, useState } from "react";
import { Form, Modal, Row, Col } from "react-bootstrap";
import { DatePicker } from "antd";
import styles from "./index.module.scss";

interface IWrongItemSentModal {
  show: boolean;
  onHide: () => void;
}

const EditReturnReasonModal = ({ show, onHide }: IWrongItemSentModal) => {
  const [state, setState] = useState({
    code: "",
    status: "",
    reason: "",
    returnDateRange: "",
    createdBy: "",
    lastAmmendedDate: "",
    lastAmmendedBy: "",
  });

  const onChangeCreateDate = (e: any, action: string) => {
    setState((prevState) => ({
      ...prevState,
      [action]: e.format("DD/MM/YYYY"),
    }));
  };
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton className={styles.modalHeader}>
        <Modal.Title id="contained-modal-title-vcenter">
          Edit Return Reason
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className={styles.modalBody}>
        <div className={styles.wrongItemSection}>
          <Row
            className={`${styles.fieldsRow} ${styles.customFormRow} ${styles.customFormFirstRow}`}
          >
            <Form.Group as={Col} md="8" controlId="name">
              <Form.Label className={styles.label}>Reason Code</Form.Label>
              <Form.Control
                className={styles.formItem}
                name="code"
                value={state.code}
                onChange={handleChange}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please enter code.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="status" as={Col} md="4">
              <Form.Label className={styles.label}>Status</Form.Label>
              <Row className="align-items-center">
                <Col md="12">
                  <Form.Select
                    className={`${styles.formItem}`}
                    name="status"
                    value={state.status}
                    onChange={handleChange}
                    required
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </Form.Select>
                </Col>
              </Row>
            </Form.Group>
          </Row>
          <Row className={`${styles.fieldsRow} ${styles.customFormRow}`}>
            <Form.Group controlId="effective_type" as={Col}>
              <Form.Label className={styles.label}>Reason</Form.Label>
              <Form.Control
                className={styles.formItem}
                name="reason"
                onChange={handleChange}
                value={state.reason}
                required
                placeholder={"Ordered 2 and Kept 1"}
              />
              <Form.Control.Feedback type="invalid">
                Please enter reason.
              </Form.Control.Feedback>
            </Form.Group>
          </Row>

          <Row style={{ marginTop: 10 }}>
            <Col md={"12"}>
              <Row>
                <Col>
                  <Form.Label>Return By Date Range</Form.Label>
                </Col>
                <Col>
                  <Form.Label>Created By</Form.Label>
                </Col>
              </Row>
            </Col>
          </Row>

          <Row>
            <Form.Group controlId="effective_type" as={Col}>
              <DatePicker
                format={"DD/MM/YYYY"}
                size={"large"}
                onChange={(e) => onChangeCreateDate(e, "returnDateRange")}
              />
            </Form.Group>
            <Form.Group controlId="effective_type" as={Col}>
              <Form.Control
                className={styles.formItem}
                name="createdBy"
                onChange={handleChange}
                value={state.createdBy}
                required
                placeholder={""}
              />
              <Form.Control.Feedback type="invalid">
                Please enter reason.
              </Form.Control.Feedback>
            </Form.Group>
          </Row>

          <Row style={{ marginTop: 10 }}>
            <Col md={"12"}>
              <Row>
                <Col>
                  <Form.Label>Last Ammended Date</Form.Label>
                </Col>
                <Col>
                  <Form.Label>Last Ammended By</Form.Label>
                </Col>
              </Row>
            </Col>
          </Row>

          <Row>
            <Form.Group controlId="effective_type" as={Col}>
              <DatePicker
                format={"DD/MM/YYYY"}
                size={"large"}
                onChange={(e) => onChangeCreateDate(e, "lastAmmendedDate")}
              />
            </Form.Group>
            <Form.Group controlId="effective_type" as={Col}>
              <Form.Control
                className={styles.formItem}
                name="lastAmmendedBy"
                onChange={handleChange}
                value={state.lastAmmendedBy}
                required
                placeholder={""}
              />
              <Form.Control.Feedback type="invalid">
                Please enter reason.
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
              onClick={() => onHide()}
              type="submit"
            >
              Confirm
            </button>
          </div>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default EditReturnReasonModal;
