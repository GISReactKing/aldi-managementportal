import { default as React } from "react";
import { Modal, Row } from "react-bootstrap";
import { AppButton } from "../../AppButton";
import styles from "./index.module.scss";

interface Props {
  show: boolean;
  onHide: () => void;
  onConfirm: () => void;
  text: string;
}

const ClearModal = ({ show, onHide, onConfirm, text }: Props) => {
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
            <AppButton onClick={onHide} title="Cancel" type="outlined" />

            <AppButton
              className={styles.submitInactiveButton}
              onClick={onConfirm}
              title="Confirm"
            />
          </div>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default ClearModal;
