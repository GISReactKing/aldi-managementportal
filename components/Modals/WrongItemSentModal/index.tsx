import { default as React, useState } from "react";
import { Col, Form, Modal, Row } from "react-bootstrap";
import styles from "./index.module.scss";
import { DeleteOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { createReturnItems } from "../../../redux/slices/returnItemsSlice";
import { signinUsers } from "../../../redux/slices/usersSlice";

export type Product = {
  _id: number;
  product_description: string;
  available_return: string;
  value: string;
  date: string;
  quantity: number;
  reason: string | null;
  photo: string;
  information: string | null;
}[];
interface IWrongItemSentModal {
  show: boolean;
  onHide: () => void;
  products: any;
}

const Index = ({ products, show, onHide }: IWrongItemSentModal) => {
  const dispatch = useDispatch();
  const [validated, setValidated] = useState(false);
  const [wrongItems, setWrongItems] = useState([
    {
      receive_product: null,
      quantity: null,
      expecting_product: null,
      reason: null,
      information: null,
      return_quantity: null,
    },
  ]);
  const addWrongItemSection = () => {
    setWrongItems([
      ...wrongItems,
      {
        receive_product: null,
        quantity: null,
        expecting_product: null,
        reason: null,
        information: null,
        return_quantity: null,
      },
    ]);
  };

  const deleteWrongItemSection = ({ index }: { index: any }) => {
    wrongItems.splice(index, 1);
    setWrongItems([...wrongItems]);
  };

  const handleSubmit = (event: any) => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();

    if (!form.checkValidity()) {
      setValidated(true);
      return false;
    }

    let returnItems = [];
    for (let i = 0; i < wrongItems.length; i++) {
      let items = products.filter(
        ({ _id }: any) => _id == wrongItems[i].expecting_product
      );
      if (!items.length) {
        continue;
      }

      returnItems.push({
        ...items[0],
        ...wrongItems[i],
        creator: "6199ff3ba19f334325693568",
      });
    }

    returnItems.map((returnItem) => dispatch(createReturnItems(returnItem)));

    setWrongItems([
      {
        receive_product: null,
        quantity: null,
        expecting_product: null,
        reason: null,
        information: null,
        return_quantity: null,
      },
    ]);
    onHide();
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
          Wrong Item Sent
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className={styles.modalBody}>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          {wrongItems.map((item: any, index: number) => (
            <div key={index} className={styles.wrongItemSection}>
              <Row
                className={`${styles.fieldsRow} ${styles.customFormRow} ${styles.customFormFirstRow}`}
              >
                <Form.Group as={Col} md="8" controlId="receive_product">
                  <Form.Label className={styles.label}>
                    What product did you receive?
                  </Form.Label>
                  <Form.Control
                    className={styles.formItem}
                    name="receive_product"
                    onChange={({ target }) => {
                      item[target.name] = target.value;
                      setWrongItems([...wrongItems]);
                    }}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter what product did you receive.
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="quantity" as={Col} md="4">
                  <Form.Label className={styles.label}>Quantity</Form.Label>
                  <Row className="align-items-center">
                    <Col md={index == 0 ? "12" : "9"}>
                      <Form.Select
                        className={`${styles.formItem}`}
                        name="quantity"
                        onChange={({ target }) => {
                          item[target.name] = target.value;
                          setWrongItems([...wrongItems]);
                        }}
                        required
                      >
                        <option value={""} />
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                      </Form.Select>
                    </Col>
                    {index > 0 ? (
                      <Col md="3">
                        <button
                          className={styles.deleteWrongItem}
                          onClick={() =>
                            deleteWrongItemSection({ index: index })
                          }
                        >
                          <DeleteOutlined />
                        </button>
                      </Col>
                    ) : (
                      ""
                    )}
                  </Row>

                  <Form.Control.Feedback type="invalid">
                    Please select Quantity.
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>
              <Row className={`${styles.customFormRow}`}>
                <Form.Group controlId="expecting_product" as={Col}>
                  <Form.Label className={styles.label}>
                    What product were you expecting?
                  </Form.Label>
                  <Form.Select
                    className={styles.formItem}
                    name="expecting_product"
                    onChange={({ target }) => {
                      item[target.name] = target.value;
                      setWrongItems([...wrongItems]);
                    }}
                    required
                  >
                    <option key={-1} value={""} />
                    {products.map(
                      ({ product_description, _id }: any, key: number) => (
                        <option key={key} value={_id}>
                          {product_description}
                        </option>
                      )
                    )}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    Please select what product were you expecting.
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>
              <Row className={`${styles.customFormRow}`}>
                <Form.Group controlId="reason" as={Col}>
                  <Form.Label className={styles.label}>
                    Return Reason
                  </Form.Label>
                  <Form.Select
                    className={styles.formItem}
                    name="reason"
                    onChange={({ target }) => {
                      item[target.name] = target.value;
                      setWrongItems([...wrongItems]);
                    }}
                    required
                  >
                    <option key={-1} value={""} />
                    <option
                      style={{ borderBottom: "1px solid #DBDCE0" }}
                      value="WI- Wrong Item Received"
                    >
                      WI- Wrong Item Received
                    </option>
                    <option
                      style={{ borderBottom: "1px solid #DBDCE0" }}
                      value="DT- Arrived Damaged"
                    >
                      DT- Arrived Damaged
                    </option>
                    <option
                      style={{ borderBottom: "1px solid #DBDCE0" }}
                      value="OT- Others"
                    >
                      OT- Others
                    </option>
                    <option
                      style={{ borderBottom: "1px solid #DBDCE0" }}
                      value="Expected Item- Not Received"
                    >
                      Expected Item- Not Received
                    </option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    Please select return reason.
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>
              <Row className={`${styles.customFormRow}`}>
                <Form.Group controlId="expecting_product" as={Col}>
                  <Form.Label className={styles.label}>
                    Return quantity
                  </Form.Label>
                  <Form.Control
                    className={styles.formItem}
                    name="return_quantity"
                    type={"number"}
                    max={item.quantity}
                    onChange={({ target }) => {
                      item[target.name] = target.value;
                      setWrongItems([...wrongItems]);
                    }}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter valid quantity.
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>
              <Row className={`${styles.customFormRow}`}>
                <Form.Group controlId="expecting_product" as={Col}>
                  <Form.Label className={styles.label}>
                    Additional Information (<small>optional</small>)
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    placeholder="Please tell use more"
                    style={{ height: "100px" }}
                    name="information"
                    onChange={({ target }) => {
                      item[target.name] = target.value;
                      setWrongItems([...wrongItems]);
                    }}
                  />
                </Form.Group>
              </Row>
              {index == wrongItems.length - 1 ? (
                <Row className={`${styles.fieldsRow} ${styles.customFormRow}`}>
                  <Col>
                    <button
                      className={styles.addWrongItem}
                      onClick={() => addWrongItemSection()}
                    >
                      + Another wrong item
                    </button>
                  </Col>
                </Row>
              ) : (
                ""
              )}
            </div>
          ))}
          <Row className={`${styles.fieldsRow} ${styles.customFormRow}`}>
            <div className={styles.buttonsGroup}>
              <button className={styles.cancelButton} onClick={() => onHide()}>
                Cancel
              </button>
              <button className={styles.submitInactiveButton} type="submit">
                Confirm
              </button>
            </div>
          </Row>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default Index;
