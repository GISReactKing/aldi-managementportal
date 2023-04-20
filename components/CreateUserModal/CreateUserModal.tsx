import { theme } from "antd";
import { useRouter } from "next/router";
import { useState } from "react";
import { Modal } from "react-bootstrap";
import useTheme from "../../hooks/useTheme";
import ImportUserModal from "../ImportUserModal/ImportUserModal";
import styles from "./createUserModal.module.scss";

interface ICreateUserModal {
  show: boolean;
  onHide: () => void;
}

const CreateUserModal = ({ show, onHide }: ICreateUserModal) => {
  const theme = useTheme();
  const [selectedType, setSelectedType] = useState<null | number>(null);
  const [showImportModal, setShowImportModal] = useState<boolean>(false);
  const router = useRouter();

  const importUserBlockTypeStyle = `${styles.userTypeWrapper} ${
    selectedType === 1 ? styles.selected : ""
  }`;

  const createUserBlockTypeStyle = `${styles.userTypeWrapper} ${
    selectedType === 2 ? styles.selected : ""
  }`;

  const onSubmit = () => {
    if (selectedType === 1) {
      setShowImportModal(true);
    } else if (selectedType === 2) {
      router.push("/user-administration/set-up-user");
    }
  };

  if (showImportModal) {
    return <ImportUserModal show onHide={() => setShowImportModal(false)} />;
  }

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton className={styles.userModalHeader}>
        <Modal.Title id="contained-modal-title-vcenter">
          Create User
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className={styles.userModalBody}>
        <div className={styles.userTypesContainer}>
          <div
            onClick={() => setSelectedType(1)}
            className={importUserBlockTypeStyle}
          >
            <div className={styles.userType}>
              <span>Import User CSV list</span>
              <span>Import and add user using a csv file.</span>
            </div>
          </div>
          <div
            onClick={() => setSelectedType(2)}
            className={createUserBlockTypeStyle}
          >
            <div className={styles.userType}>
              <span>Create Individual User</span>
              <span>Create a single user.</span>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className={styles.userModalFooter}>
        <button
          className={styles.cancelBtn}
          style={{ borderColor: theme?.primary, background: theme.white }}
          onClick={onHide}
        >
          Cancel
        </button>
        <button
          onClick={onSubmit}
          className={styles.proceedBtn}
          style={{ background: theme.primary, color: theme.white }}
        >
          Proceed
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateUserModal;
