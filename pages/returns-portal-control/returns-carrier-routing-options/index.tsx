/** @format */
import UserDashboard from "../../../components/UserDashboard";
import { Button, Layout, Typography, Checkbox, List } from "antd";
import { Form, Row, Col } from "react-bootstrap";
import React, { useState, useRef } from "react";
import styles from "./index.module.scss";
import { RootStateOrAny, useSelector } from "react-redux";
import { AppButton } from "../../../components/AppButton";
import { checkingDisableOfAppButton } from "../../../utils/CheckingStatus";
import { useReactToPrint } from "react-to-print";

const { Content } = Layout;
const { Text, Title } = Typography;

interface Props {}

const ReturnPortalRules = ({}: Props): JSX.Element => {
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const currentUser = useSelector(
    ({ users }: RootStateOrAny) => users.currentUser
  );
  const CUDDisabled = checkingDisableOfAppButton(currentUser, "edit", [
    // "Set Up & Control",
    "Returns Portal Control",
    "Return Reason Codes",
  ]);

  const data1 = [
    "Collect+",
    "Hermes Locker",
    "Hermes Parcel Shop",
    "Royal Mail",
  ];

  const data2 = ["Hermes Collection", "Royal Mail", "Yodal"];

  const componentToPrintRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentToPrintRef.current,
  });

  return (
    <UserDashboard>
      <>
        <>
          <AppButton
            className={`xsm:w-28 xsm:h-9 lg:w-30 lg:h-10 tracking-wide mt-5 position-absolute top-1 z-50`}
            style={{ right: 285 }}
            onClick={() => {
              setIsEdit(true);
            }}
            title="Save"
            disabled={CUDDisabled}
          />
          <AppButton
            className={`xsm:w-28 xsm:h-9 lg:w-30 lg:h-10 tracking-wide mt-5 position-absolute top-1 z-50`}
            style={{ right: 150 }}
            onClick={() => {
              setIsEdit(true);
            }}
            title="Cancel"
          />
          <AppButton
            className={`xsm:w-28 xsm:h-9 lg:w-30 lg:h-10 tracking-wide mt-5 position-absolute top-1 right-4 z-50`}
            onClick={() => handlePrint()}
            title="Print"
          />
        </>
        <Row className="mb-3">
          <Col md="4"></Col>
          <Col md="4" style={{ textAlign: "center" }}>
            <Row>
              <Title level={3}>Returns Options: Routing Rules</Title>
            </Row>
          </Col>
        </Row>

        <Row ref={componentToPrintRef}>
          <Col md="3" />
          <Col md="6">
            <Content className={styles.content}>
              <Row>
                <Col>
                  <Row>
                    <Col className="pl-0">
                      <h2 className={`${styles.title}`}>Small Items</h2>
                    </Col>
                  </Row>
                  <Row className={styles.rowContainer}>
                    <Col md={6}>
                      <h3 className={styles.labelBlue}>Drop Off:</h3>
                      <Row className="mt-2">
                        <Col md="6" className="pl-6">
                          Return to store
                        </Col>
                        <Col md="3" style={{ textAlign: "center" }}>
                          <Form.Check
                            className={`${styles.labelColor}`}
                            type="checkbox"
                          />
                        </Col>
                      </Row>
                      <Row className="mt-2">
                        <Col md="6" className="pl-10">
                          Max KG
                        </Col>
                        <Col md="3">
                          <Form.Control
                            className="text-center"
                            style={{ height: 25 }}
                            name="max_kg"
                            value={20}
                            onChange={({ target }) => {}}
                          />
                        </Col>
                      </Row>
                      <Row className="mt-2">
                        <Col md="6" className="pl-10">
                          Max Length CM
                        </Col>
                        <Col md="3">
                          <Form.Control
                            className="text-center"
                            style={{ height: 25 }}
                            name="max_length_cm"
                            value={120}
                            onChange={({ target }) => {}}
                          />
                        </Col>
                      </Row>
                      <Row className="mt-2">
                        <Col className="pl-6">
                          Select from list of Active Carriers:
                        </Col>
                      </Row>
                      <Row className="mt-1">
                        <Col className="pl-10">
                          <Button
                            size="small"
                            className={`${styles.createAmendListButton} tracking-wide z-50 mt-1`}
                            type="primary"
                            onClick={() => console.log("clear")}
                          >
                            Create / Amend List
                          </Button>
                        </Col>
                      </Row>
                      <Row className="mt-1 mb-2">
                        <Col className="pl-10" md="11">
                          <List
                            size="small"
                            bordered
                            dataSource={data1}
                            renderItem={(item) => <List.Item>{item}</List.Item>}
                          />
                        </Col>
                      </Row>
                    </Col>
                    <Col md={6}>
                      <h3 className={styles.labelBlue}>Arrange Collection:</h3>
                      <Row style={{ marginTop: 127 }}>
                        <Col className="pl-10">
                          <Button
                            size="small"
                            className={`${styles.createAmendListButton} tracking-wide z-50 mt-1`}
                            type="primary"
                            onClick={() => console.log("clear")}
                          >
                            Create / Amend List
                          </Button>
                        </Col>
                      </Row>
                      <Row className="mt-1 mb-2">
                        <Col className="pl-10" md="11">
                          <List
                            size="small"
                            bordered
                            dataSource={data2}
                            renderItem={(item) => <List.Item>{item}</List.Item>}
                          />
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Col>
              </Row>

              <Row>
                <Col>
                  <Row>
                    <Col className="pl-0">
                      <h2 className={`${styles.title}`}>Wine & Spirits</h2>
                    </Col>
                  </Row>
                  <Row className={styles.rowContainer}>
                    <Col md={6}>
                      <h3 className={styles.labelBlue}>Drop Off:</h3>
                      <Row className="mt-2">
                        <Col md="5" className="pl-6">
                          Return to store
                        </Col>
                        <Col md="5" style={{ textAlign: "center" }}>
                          <Row>
                            <Col md="2">{"<="}</Col>
                            <Col className="p-0 ml-2">
                              <Form.Control
                                className="text-center"
                                style={{ height: 25 }}
                                name="max_length_cm"
                                value={90}
                                onChange={({ target }) => {}}
                              />
                            </Col>
                            <Col md="2" className="text-left">
                              Bottles
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                      <Row className="mt-2">
                        <Col md="5" className="pl-6">
                          Collect+
                        </Col>
                        <Col md="5" style={{ textAlign: "center" }}>
                          <Row>
                            <Col md="2">{"<="}</Col>
                            <Col className="p-0 ml-2">
                              <Form.Control
                                className="text-center"
                                style={{ height: 25 }}
                                name="max_length_cm"
                                value={90}
                                onChange={({ target }) => {}}
                              />
                            </Col>
                            <Col md="2" className="text-left">
                              Bottles
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </Col>
                    <Col md={6}>
                      <h3 className={styles.labelBlue}>Arrange Collection:</h3>
                      <Row className="mt-2">
                        <Col md="8" className="pl-6">
                          Arrange via Customer Services
                        </Col>
                        <Col md="3" style={{ textAlign: "center" }}>
                          <Form.Check
                            className={`${styles.labelColor}`}
                            type="checkbox"
                          />
                        </Col>
                      </Row>
                      <Row className="mt-2">
                        <Col className="pl-6">
                          Select from list of Active Carriers:
                        </Col>
                      </Row>
                      <Row className="mt-1">
                        <Col className="pl-10">
                          <Button
                            size="small"
                            className={`${styles.createAmendListButton} tracking-wide z-50 mt-1`}
                            type="primary"
                            onClick={() => console.log("clear")}
                          >
                            Create / Amend List
                          </Button>
                        </Col>
                      </Row>
                      <Row className="mt-1 pl-10">
                        <Col md="11">
                          <Row className={styles.rowContainer}>
                            <Col>
                              <Row>
                                <Col
                                  className="text-right pb-1"
                                  style={{ backgroundColor: "#badbf9" }}
                                >
                                  <Button
                                    size="small"
                                    className={`${styles.saveButton} tracking-wide z-50 mt-1`}
                                    type="primary"
                                    onClick={() => console.log("clear")}
                                  >
                                    Save
                                  </Button>
                                </Col>
                              </Row>
                              <Row>
                                <List
                                  size="small"
                                  bordered
                                  dataSource={data1}
                                  renderItem={(item) => (
                                    <>
                                      <List.Item>
                                        <Checkbox>{item}</Checkbox>
                                      </List.Item>
                                    </>
                                  )}
                                />
                              </Row>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Row>
                    <Col className="pl-0">
                      <h2 className={`${styles.title}`}>Large & Heavy Items</h2>
                    </Col>
                  </Row>
                  <Row className={styles.rowContainer}>
                    <Col md={6}></Col>
                    <Col md={6}>
                      <h3 className={styles.labelBlue}>Arrange Collection:</h3>
                      <Row className="mt-2 mb-2">
                        <Col md="8" className="pl-6">
                          Arrange via Customer Services
                        </Col>
                        <Col md="3" style={{ textAlign: "center" }}>
                          <Form.Check
                            className={`${styles.labelColor}`}
                            type="checkbox"
                          />
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Content>
          </Col>
        </Row>
      </>
    </UserDashboard>
  );
};

export default ReturnPortalRules;
