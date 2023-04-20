import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { Progress, Upload } from "antd";
import { useRouter } from "next/router";
import { useState } from "react";
import { Modal } from "react-bootstrap";
import { AiOutlineCloseCircle, AiOutlineFileText } from "react-icons/ai";
import styles from "./importUserModal.module.scss";

interface IImportUserModal {
  show: boolean;
  onHide: () => void;
}

const ImportUserModal = ({ show, onHide }: IImportUserModal) => {
  const [selectedType, setSelectedType] = useState(0);
  const [loading, setLoading] = useState(0);
  const router = useRouter();

  const onSubmit = () => {
    if (selectedType === 1) {
      router.push("/pages/user-administration/create");
    }
  };

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
          Import User
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className={styles.userModalBody}>
        <span>
          Download a{" "}
          <span className={styles.marked}> sample CSV template </span> to see an
          example of the format required
        </span>
        <div className={styles.uploadContainer}>
          <Upload
            name="avatar"
            listType="picture"
            className="import-user-upload"
          >
            <div className={styles.uploadContent}>
              <div>
                <button className={styles.addFileButton}>Add File</button>
                <div style={{ marginTop: 8 }}>or drop files to upload</div>
              </div>
            </div>
          </Upload>
        </div>
        <span>
          Accepted file format is <span className={styles.marked}>.csv</span>
        </span>
        <div className={styles.uploadFilesHeading}>
          <div>Uploaded Files</div>
        </div>
        <div className={styles.progressBarsWrapper}>
          <div className={styles.progressBarContent}>
            <div>
              <AiOutlineFileText className={styles.fileIcon} />
            </div>
            <div className={styles.progressBar}>
              <div>user.pdf</div>
              <Progress percent={30} />
            </div>
            <div>
              <AiOutlineCloseCircle className={styles.deleteIcon} />
            </div>
          </div>
          <div className={styles.progressBarContent}>
            <div>
              <AiOutlineFileText className={styles.fileIcon} />
            </div>
            <div className={styles.progressBar}>
              <div>user.pdf</div>
              <Progress percent={100} />
            </div>
            <div>
              <AiOutlineCloseCircle className={styles.deleteIcon} />
            </div>
          </div>

          <div className={styles.progressBarContent}>
            <div>
              <AiOutlineFileText className={styles.fileIcon} />
            </div>
            <div className={styles.progressBar}>
              <div>user.pdf</div>
              <Progress percent={100} status="exception" />
            </div>
            <div>
              <AiOutlineCloseCircle className={styles.deleteIcon} />
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className={styles.userModalFooter}>
        <button className={styles.cancelBtn} onClick={onHide}>
          Cancel
        </button>
        <button onClick={onSubmit} className={styles.proceedBtn}>
          Proceed
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default ImportUserModal;
