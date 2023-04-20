import { default as React } from "react";
import { Modal, Row, Col } from "react-bootstrap";
import styles from "./index.module.scss";
import { Button, Typography } from "antd";
import UserTable from "../..//Tables/UserTable";

const { Title } = Typography;

interface IInvoiceResultTable {
  show: boolean;
  onHide: () => void;
  modalText: string;
  data?: any;
}

const columnsExample = [
  {
    title: "Filename",
    dataIndex: "filename",
    key: "filename",
    width: 150,
  },
  {
    title: "Message",
    dataIndex: "message",
    key: "message",
    render: (message: any) => message.Message || message,
    width: 250,
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    width: 40,
  },
];

const InvoiceResultTable = ({
  show,
  onHide,
  modalText,
  data,
}: IInvoiceResultTable) => {
  return (
    <Modal
      show={show}
      onHide={onHide}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      style={{ justifyContent: "center", alignItems: "center" }}
      size={"lg"}
    >
      <Modal.Header closeButton className={styles.modalHeader}>
        <Modal.Title>
          <Title level={3}>{`${modalText}`}</Title>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className={styles.modalBody}>
        <Row>
          <UserTable
            rowSelection={false}
            columns={columnsExample}
            dataSource={data}
            scroll={{}}
            bordered
            pagination={false}
            loading={false}
          />
        </Row>
        <Row className="mt-3">
          <Col className="d-flex justify-content-end">
            <div className={styles.buttonsGroup}>
              <Button
                className={styles.submitActiveButton}
                onClick={() => onHide()}
              >
                Close
              </Button>
            </div>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default InvoiceResultTable;
