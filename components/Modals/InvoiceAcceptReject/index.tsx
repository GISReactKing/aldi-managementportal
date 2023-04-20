import { default as React, useState } from "react";
import { Form, Modal, Row, Col } from "react-bootstrap";
import styles from "./index.module.scss";
import { Button, Input, Typography } from "antd";
import { AppButton } from "../../AppButton";

const { Title } = Typography;
const { TextArea } = Input;

interface IInvoiceAcceptReject {
  show: boolean;
  onHide: () => void;
  handleClick: (reason: string) => void;
  modalText: string;
  currentUser: any;
  loader?: boolean;
  reason?: string;
}

const InvoiceAcceptReject = ({
  show,
  onHide,
  modalText,
  currentUser,
  handleClick,
  loader,
  reason,
}: IInvoiceAcceptReject) => {
  const [state, setState] = useState({
    reason: reason || "",
    user: currentUser?.username,
  });

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
        <Modal.Title>
          <Title level={3}>{`${modalText}`}</Title>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className={styles.modalBody}>
        {/* {modalText !== "Undo Exception" ? (
          <Row>
            <Form.Group as={Col} controlId="name">
              <Form.Label className={styles.label}>Reason</Form.Label>
              <TextArea
                autoFocus={false}
                defaultValue=""
                style={{backgroundColor:theme?.offWhite}}
                className="border-1"
                name="reason"
                rows={20}
                onChange={handleChange}
                placeholder={"Reason"}
                autoSize={{ minRows: 5, maxRows: 20 }}
              />
            </Form.Group>
          </Row>
        ) : null} */}
        {/* <Row className="mt-3"> */}
        <Row>
          <Form.Group controlId="effective_type" as={Col}>
            <Form.Label className={styles.label}>User</Form.Label>
            <Form.Control
              className={styles.formItem}
              name="user"
              onChange={handleChange}
              value={state.user}
              required
              disabled
            />
            <Form.Control.Feedback type="invalid">
              Please enter User.
            </Form.Control.Feedback>
          </Form.Group>
        </Row>
        <Row className="mt-5">
          <Col className="d-flex justify-content-end">
            <div className={styles.buttonsGroup}>
              <AppButton
                className={
                  modalText === "Undo Exception"
                    ? styles.submitActiveButton
                    : state.reason
                    ? styles.submitActiveButton
                    : styles.submitInactiveButton
                }
                loading={!!loader}
                disabled={
                  modalText === "Undo Exception"
                    ? false
                    : loader || !state.reason
                }
                onClick={() => handleClick(state.reason)}
                title={modalText}
              />

              <AppButton
                className={styles.cancelButton}
                disabled={!!loader}
                onClick={() => onHide()}
                title="Cancel"
                type="outlined"
              />
            </div>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default InvoiceAcceptReject;
