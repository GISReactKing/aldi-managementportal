import { default as React, useState } from "react";
import { Form, Modal, Row, Col } from "react-bootstrap";
import { Typography } from "antd";
import styles from "./index.module.scss";

interface IWrongItemSentModal {
  detailData: any;
  show: boolean;
  onHide: () => void;
}

const { Title, Text } = Typography;

const AmmendCommunicationEventModal = ({
  detailData,
  show,
  onHide,
}: IWrongItemSentModal) => {
  return (
    <Modal
      show={show}
      onHide={onHide}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      {/* <Modal.Header closeButton className={styles.modalHeader}>
                <Modal.Title id="contained-modal-title-vcenter" className="text-center">Ammend Customer Event</Modal.Title>
            </Modal.Header> */}
      <Modal.Body className={styles.modalBody}>
        <Row className="mb-4 mt-5">
          <Col style={{ textAlign: "center" }}>
            <Row>
              <Title level={3}>Amend Customer Event</Title>
            </Row>
          </Col>
        </Row>
        <div className={styles.wrongItemSection}>
          <Row
            style={{ display: "flex", justifyContent: "center" }}
            className={`${styles.fieldsRow} ${styles.customFormRow} ${styles.customFormFirstRow}`}
          >
            <Form.Control
              className={styles.formItem}
              name="code"
              value={detailData.code}
              style={{ height: 30, width: 100 }}
              // onChange={handleChangeCode}
              disabled
            />
            <Form.Control
              className={styles.formItem}
              name="level1"
              value={detailData.level1}
              style={{ height: 30, width: 300 }}
              // onChange={handleChange1}
              disabled
            />
          </Row>
          <Row
            style={{ display: "flex", justifyContent: "center" }}
            className={`${styles.fieldsRow} ${styles.customFormRow} ${styles.customFormFirstRow}`}
          >
            <Form.Control
              className={styles.formItem}
              name="level2"
              value={detailData.level2}
              // style={{ height: 30, marginTop: 20 }}
              style={{ height: 30, marginLeft: 100, width: 300, marginTop: 20 }}
              // onChange={handleChange2}
            />
          </Row>
        </div>
        <Row className={`${styles.fieldsRow} ${styles.customFormRow}`}>
          <div
            className={styles.buttonsGroup}
            style={{ display: "flex", justifyContent: "center" }}
          >
            <button
              className={`${styles.cancelButton} text-uppercase`}
              onClick={() => onHide()}
            >
              Cancel
            </button>
            <button
              className={`${styles.submitInactiveButton} text-uppercase`}
              onClick={() => onHide()}
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

export default AmmendCommunicationEventModal;
