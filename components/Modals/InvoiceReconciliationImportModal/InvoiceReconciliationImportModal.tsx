import { default as React, useState } from "react";
import { Form, Modal, Row, Col } from "react-bootstrap";
import { Typography, Button } from "antd";
import styles from "./invoiceReconciliationImportModal.module.scss";
import { useDispatch, useSelector, RootStateOrAny } from "react-redux";
import axios, { CancelTokenSource } from "axios";
import {
  importInvoices,
  checkInvoiceCarrier,
} from "../../../redux/slices/SummarySlice";
interface IInvoiceReconciliationImportModal {
  show: boolean;
  onHide: (data?: any) => void;
  fetchSummary: () => void;
  carriers: any;
}

const { Text } = Typography;

const InvoiceReconciliationImportModal = ({
  show,
  onHide,
  fetchSummary,
  carriers,
}: IInvoiceReconciliationImportModal) => {
  const dispatch = useDispatch();
  const [carrier, setCarrier] = useState<string>("");
  const [invoiceNumber, setInvoiceNumber] = useState<string>("");
  const [files, setFiles] = useState<any>(null);
  const [loader, setLoader] = useState<boolean>(false);
  const [isInvoiceNumberRequired, setIsInvoiceNumberRequired] =
    useState<boolean>(false);
  const [axiosReqSource, setAxiosReqSource] =
    useState<CancelTokenSource | null>(null);
  const currentUser: any = useSelector(
    ({ users }: RootStateOrAny) => users.currentUser
  );

  const checkCarrier = async (value: string) => {
    setCarrier(value);
  };

  const importInvoice = async () => {
    try {
      setLoader(true);
      const data = new FormData();
      data.append("carrier", carrier);
      for (let i = 0; i < files.length; i++) {
        data.append("files", files[i]);
      }
      console.log(
        "🚀 ~ file: InvoiceReconciliationImportModal.tsx ~ line 48 ~ importInvoice ~ data",
        data
      );

      const carrierData = {
        creator: currentUser._id,
        username: currentUser.username,
        data,
      } as any;
      console.log(
        "🚀 ~ file: InvoiceReconciliationImportModal.tsx ~ line 56 ~ importInvoice ~ carrierData",
        carrierData
      );
      if (isInvoiceNumberRequired) {
        data.append("invoiceNumber", invoiceNumber);
      }

      const CancelToken = axios.CancelToken;
      const source = CancelToken.source();
      setAxiosReqSource(source);
      const { payload } = await dispatch(
        importInvoices({ ...carrierData, source }) as any
      );
      console.log(
        "🚀 ~ file: InvoiceReconciliationImportModal.tsx ~ line 59 ~ importInvoice ~ payload",
        payload
      );
      fetchSummary();
      onCancel(Array.isArray(payload.message) ? payload.message : null);
      setLoader(false);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoader(false);
    }
  };

  const onCancel = (result: any) => {
    console.log(
      "🚀 ~ file: InvoiceReconciliationImportModal.tsx ~ line 77 ~ onCancel ~ result",
      result
    );
    setLoader(false);
    if (typeof axiosReqSource?.cancel === "function") axiosReqSource.cancel();
    onHide(result);
    setFiles(null);
    setCarrier("");
    setIsInvoiceNumberRequired(false);
    setInvoiceNumber("");
  };
  return (
    <Modal
      show={show}
      onHide={() => (loader ? console.log("onHide") : onHide())}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton className={styles.modalHeader}>
        <Modal.Title id="contained-modal-title-vcenter">
          Import Carrier Invoice
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className={styles.modalBody}>
        <Row className={`${styles.fieldsRow} ${styles.customFormRow} mt-0`}>
          <Form.Group controlId="carrier" as={Col}>
            <Form.Label>Carrier</Form.Label>
            <Form.Select
              className={styles.formItem}
              defaultValue={""}
              name="carrier"
              onChange={({ target }) => checkCarrier(target.value)}
              required
            >
              <option value="">Select Carrier</option>
              {carriers.map((carrier: { code: string; name: string }) => (
                <option value={carrier.code} key={carrier.code}>
                  {carrier.name}
                </option>
              ))}
              {/* <option value="HERMES">HERMES</option>
              <option value="YODEL">YODEL</option>
              <option value="UKMAIL">UKMAIL</option>
              <option value="CPLUS">CPLUS</option>
              <option value="XDP">XDP</option>
              <option value="BJS">BJS</option> */}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              Please select Carrier.
            </Form.Control.Feedback>
          </Form.Group>
        </Row>

        {isInvoiceNumberRequired ? (
          <Row className={`${styles.fieldsRow} ${styles.customFormRow} mt-4`}>
            <Form.Group controlId="invoice_file" as={Col}>
              <Form.Label>Invoice Number</Form.Label>
              <Form.Control
                value={invoiceNumber}
                onChange={(e: any) => setInvoiceNumber(e.target.value)}
              />
            </Form.Group>
          </Row>
        ) : null}
        <Row className={`${styles.fieldsRow} ${styles.customFormRow} mt-4`}>
          <Form.Group controlId="invoice_file" as={Col}>
            <Form.Label>Invoice File</Form.Label>
            <Form.Control
              type="file"
              // className="custom-file-label"
              id="invoice_file"
              size="lg"
              multiple
              // onChange={(target) => console.log({target})}
              onChange={(e: any) => setFiles(e.target.files)}
            />
          </Form.Group>
        </Row>

        <Row className={`${styles.fieldsRow} ${styles.customFormRow} mt-4`}>
          <div className={styles.buttonsGroup}>
            <Button
              className={styles.cancelButton}
              onClick={() => onCancel(null)}
              // disabled={loader}
            >
              Cancel
            </Button>
            <Button
              className={
                carrier &&
                files &&
                ((isInvoiceNumberRequired && invoiceNumber) ||
                  !isInvoiceNumberRequired)
                  ? styles.submitActiveButton
                  : styles.submitInactiveButton
              }
              onClick={importInvoice}
              disabled={
                !carrier ||
                !files ||
                (isInvoiceNumberRequired && !invoiceNumber)
              }
              loading={loader}
            >
              {loader ? `Importing file` : "Import"}
            </Button>
          </div>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default InvoiceReconciliationImportModal;
