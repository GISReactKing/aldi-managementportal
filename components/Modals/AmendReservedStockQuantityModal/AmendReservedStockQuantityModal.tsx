import { default as React, useState, useEffect } from "react";
import { Form, Modal, Row, Col } from "react-bootstrap";
import { Typography, Button } from "antd";
import styles from "./amendReservedStockQuantityModal.module.scss";
import { useDispatch, useSelector, RootStateOrAny } from "react-redux";
import { importInvoices } from "../../../redux/slices/SummarySlice";
import { AppButton } from "../../AppButton";
interface IAmendReservedStockQuantityModal {
  show: boolean;
  detailData?: any;
  onHide: () => void;
}

const { Text, Title } = Typography;
const AmendReservedStockQuantityModal = ({
  show,
  detailData,
  onHide,
}: IAmendReservedStockQuantityModal) => {
  const dispatch = useDispatch();
  const [data, setData] = useState<any>(detailData);
  const [reservedStockQty, setReservedStockQty] = useState<any>(
    detailData ? detailData.reserved_stock : "0"
  );
  const [loader, setLoader] = useState<boolean>(false);

  const [isChanged, setIsChanged] = useState<boolean>(false);

  useEffect(() => {
    setData(detailData);
    setReservedStockQty(detailData ? detailData.reserved_stock : "0");
  }, [detailData]);

  const currentUser: any = useSelector(
    ({ users }: RootStateOrAny) => users.currentUser
  );

  const handleReservedStock = (value: any) => {
    setReservedStockQty(value);

    setIsChanged(value != detailData.reserved_stock);
  };

  const handleConfirm = () => {
    onHide();
  };

  const onCancel = () => {
    onHide();
  };
  return (
    <Modal
      show={show}
      onHide={() => (loader ? console.log("onHide") : onHide())}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Body className={styles.modalBody}>
        <Row className="mt-4">
          <Col style={{ textAlign: "center" }}>
            <Title level={3}>Amend: Reserved Stock Quantity</Title>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col md="12" style={{ textAlign: "center" }}>
            <Form.Control
              type="text"
              className="text-center"
              size="sm"
              value={`${data ? data.sku : ""}: ${data ? data.title : ""}`}
              disabled={true}
            />
          </Col>
        </Row>
        <Row className="mt-5">
          <Col
            md="5"
            style={{
              textAlign: "end",
              marginTop: "auto",
              marginBottom: "auto",
            }}
          >
            <Form.Label className="mb-0">Stock on Hand: </Form.Label>
          </Col>
          <Col md="3">
            <Form.Control
              type="text"
              className="text-end"
              size="sm"
              value={data ? data.stock_on_hand : "0"}
              disabled={true}
            />
          </Col>
        </Row>
        <Row className="mt-3">
          <Col
            md="5"
            style={{
              textAlign: "end",
              marginTop: "auto",
              marginBottom: "auto",
            }}
          >
            <Form.Label className="mb-0">Available Stock: </Form.Label>
          </Col>
          <Col md="3">
            <Form.Control
              type="text"
              className="text-end"
              size="sm"
              value={data ? data.available_stock : "0"}
              disabled={true}
            />
          </Col>
        </Row>
        <Row className="mt-3">
          <Col
            md="5"
            style={{
              textAlign: "end",
              marginTop: "auto",
              marginBottom: "auto",
            }}
          >
            <Form.Label className="mb-0">Reserved Stock Qty: </Form.Label>
          </Col>
          <Col md="3">
            <Form.Control
              type="number"
              className="text-end"
              size="sm"
              value={reservedStockQty}
              onChange={({ target }) => handleReservedStock(target.value)}
            />
          </Col>
        </Row>

        <Row className={`${styles.fieldsRow} ${styles.customFormRow} mt-4`}>
          <div className={styles.buttonsGroup}>
            <AppButton
              className={styles.cancelButton}
              onClick={onCancel}
              disabled={loader}
              title="Cancel"
              type="outlined"
            />

            <AppButton
              className={
                isChanged
                  ? styles.submitActiveButton
                  : styles.submitInactiveButton
              }
              onClick={() => handleConfirm()}
              disabled={!isChanged}
              loading={loader}
              title="Confirm"
            />
          </div>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default AmendReservedStockQuantityModal;
