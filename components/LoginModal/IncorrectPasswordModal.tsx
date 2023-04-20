import { default as React } from "react";
import { Modal, Row } from "react-bootstrap";
import styles from "./incorrectPasswordModal.module.scss";

interface Props {
  show: boolean;
  onHide: () => void;
  text: string;
}

const IncorrectPasswordModal = ({ show, onHide, text }: Props) => {
  return (
    <Modal
      show={show}
      onHide={onHide}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Body className={styles.modalBody}>
        <p className={styles.headerTitle}>{text}</p>
        <Row className={`${styles.fieldsRow} ${styles.customFormRow}`}>
          <div className={styles.buttonsGroup}>
            <button
              className={styles.submitInactiveButton}
              type="button"
              onClick={onHide}
            >
              OK
            </button>
          </div>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default IncorrectPasswordModal;
