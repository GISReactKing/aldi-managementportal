/** @format */
import UserDashboard from "../../../components/UserDashboard";
import { Button, Layout, Typography, DatePicker, Input } from "antd";
import { Form, Row, Col } from "react-bootstrap";
import React, { useState } from "react";
import { DeleteFilled, PlusOutlined } from "@ant-design/icons";
import styles from "./return-portal-rules.module.scss";
import { ComaSeparator } from "../../../utils/ComaSeparator";
import { RootStateOrAny, useSelector } from "react-redux";
import { AppButton } from "../../../components/AppButton";
import { checkingDisableOfAppButton } from "../../../utils/CheckingStatus";
import useTheme from "../../../hooks/useTheme";

const { Content } = Layout;
const { Text } = Typography;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

interface Props {}

const ReturnPortalRules = ({}: Props): JSX.Element => {
  const theme = useTheme();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const currentUser = useSelector(
    ({ users }: RootStateOrAny) => users.currentUser
  );
  const CUDDisabled = checkingDisableOfAppButton(currentUser, "edit", [
    // "Set Up & Control",
    "Returns Portal Control",
    "Returns Portal Rules",
  ]);

  const renderReturnByDate = (actionIcon: any) => {
    return (
      <>
        <Row style={{ marginTop: 10 }}>
          <Col md={"11"}>
            <Row>
              <Col>
                <Form.Label>Return By Date Range</Form.Label>
              </Col>
              <Col>
                <Form.Label>Purchase Date Range</Form.Label>
              </Col>
            </Row>
          </Col>
          <Col md={"1"} />
        </Row>

        <Row>
          <Col md={"11"}>
            <Row>
              <Form.Group controlId="return_date_range" as={Col}>
                <RangePicker format={"DD/MM/YYYY"} />
              </Form.Group>
              <Form.Group controlId="purchase_date_range" as={Col}>
                <RangePicker format={"DD/MM/YYYY"} />
              </Form.Group>
            </Row>
          </Col>
          <Col md={"1"} style={{ verticalAlign: "bottom" }}>
            {isEdit && actionIcon}
          </Col>
        </Row>
      </>
    );
  };

  const renderDeleteButton = () => {
    return (
      <Button
        type="default"
        style={{
          border: "none",
          backgroundColor: "#FFEAEA",
          borderRadius: "4px",
        }}
        icon={<DeleteFilled style={{ color: "red" }} />}
      />
    );
  };

  const renderAddButton = () => {
    return (
      <Button
        type="primary"
        style={{
          border: "none",
          backgroundColor: theme?.primaryNight,
          borderRadius: "4px",
        }}
        icon={<PlusOutlined style={{ color: "white" }} />}
      />
    );
  };

  return (
    <UserDashboard>
      <>
        {!isEdit && (
          <>
            <AppButton
              className={`${styles.editButton} xsm:w-28 xsm:h-9 lg:w-30 lg:h-10 tracking-wide mt-5 position-absolute top-1 z-50`}
              onClick={() => {
                setIsEdit(true);
              }}
              title="Edit"
              disabled={CUDDisabled}
            />
            <AppButton
              className={`${styles.exportButton} xsm:w-28 xsm:h-9 lg:w-30 lg:h-10 tracking-wide mt-5 position-absolute top-1 right-4 z-50`}
              onClick={() => {}}
              title="Export"
            />
          </>
        )}

        {isEdit && (
          <>
            <AppButton
              className={`${styles.undoButton} xsm:w-28 xsm:h-9 lg:w-30 lg:h-10 tracking-wide mt-5 fixed top-1 z-50`}
              onClick={() => {
                setIsEdit(false);
              }}
              title="Undo Changes"
            />
            <AppButton
              className={`${styles.saveButton} xsm:w-28 xsm:h-9 lg:w-30 lg:h-10 tracking-wide mt-5 fixed top-1 right-4 z-50`}
              onClick={() => {
                setIsEdit(false);
              }}
              title="Save Changes"
            />
          </>
        )}

        <Content className={styles.content}>
          <Row className={styles.rowContainer}>
            <Col>
              <div className={styles.leftContent}>
                <div>
                  <Text className={styles.titleNumber}>1.</Text>
                  <Text className={styles.titleContent}>
                    Standard Return Policy Days:
                  </Text>
                </div>
                <div className={styles.valueContainer}>
                  <Text className={`${styles.labelColor}`}>Return within</Text>
                  <Input
                    style={{ width: 30 }}
                    className={styles.inputBetweenTexts}
                  />
                  <Text className={`${styles.labelColor}`}>
                    days since dispatch
                  </Text>
                </div>
              </div>
            </Col>
            <Col>
              <Form.Group controlId="greater_return_message" as={Col}>
                <Form.Label>
                  For returns greater than allowed days, display the message:
                </Form.Label>
                <TextArea
                  showCount
                  maxLength={200}
                  style={{ height: "38px" }}
                  onChange={() => {}}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className={styles.rowContainer}>
            <Col>
              <div className={styles.leftContent}>
                <div>
                  <Text className={styles.titleNumber}>2.</Text>
                  <Text className={styles.titleContent}>
                    Seasonal / Special: Return by Date
                  </Text>
                </div>
                <div className={styles.valueContainer}>
                  {renderReturnByDate(renderDeleteButton())}
                  {renderReturnByDate(renderAddButton())}
                </div>
              </div>
            </Col>
            <Col>
              <Form.Group controlId="date_exceptions_message" as={Col}>
                <Form.Label>
                  For returns by date exceptions, display the message:
                </Form.Label>
                <TextArea
                  showCount
                  maxLength={200}
                  style={{ height: "38px" }}
                  onChange={() => {}}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className={styles.rowContainer}>
            <Col>
              <div className={styles.leftContent}>
                <div>
                  <Text className={styles.titleNumber}>3.</Text>
                  <Text className={styles.titleContent}>
                    Seasonal / Special: Return by Date
                  </Text>
                </div>
                <div className={styles.valueContainer}>
                  <Text className={`${styles.labelColor}`}>
                    Current quantity of products flagged as Non-Refundable:
                    10,000
                  </Text>
                  <Form.Group
                    controlId="do_not_allow_return"
                    as={Col}
                    style={{ marginTop: 10 }}
                  >
                    <Form.Check
                      className={`${styles.labelColor}`}
                      type="checkbox"
                      label="Do not allow Return"
                    />
                  </Form.Group>
                </div>
              </div>
            </Col>
          </Row>
          <Row className={styles.rowContainer}>
            <Col>
              <div className={styles.leftContent}>
                <div>
                  <Text className={styles.titleNumber}>4.</Text>
                  <Text className={styles.titleContent}>
                    For selected Return Reasons, override Rules 1, 2 & 3.
                  </Text>
                </div>
                <div className={styles.valueContainer}>
                  <Text className={`${styles.labelColor}`}>
                    Current quantity of products flagged as Non-Refundable:
                    10,000
                  </Text>
                  <Form.Group controlId="allow_late_returns" as={Col}>
                    <Form.Check
                      className={`${styles.labelColor}`}
                      type="checkbox"
                      label="Allow Late Returns"
                      style={{ marginTop: 10 }}
                    />
                  </Form.Group>
                  <Form.Group
                    controlId="allow_non_returnable_products"
                    as={Col}
                    style={{ marginTop: 10 }}
                  >
                    <Form.Check
                      className={`${styles.labelColor}`}
                      type="checkbox"
                      label="Allow Non-Returnable Products"
                    />
                  </Form.Group>
                </div>
              </div>
            </Col>
            <Col>
              <div>
                <Row>
                  <Col md={"10"}>
                    <Text style={{ color: theme?.monoLabel }}>
                      Return Reasons Codes
                    </Text>
                  </Col>
                  {isEdit && (
                    <Col md={"2"} style={{ textAlign: "end" }}>
                      <Button
                        type="default"
                        style={{
                          borderRadius: "4px",
                          borderColor: theme?.primaryNight,
                          color: theme?.monoLabel,
                        }}
                      >
                        Edit
                      </Button>
                    </Col>
                  )}
                </Row>
              </div>
              <div className={styles.valueContainerRight}>
                <Row>
                  <Form.Group controlId="dt_arrived_damage" as={Col}>
                    <Form.Check
                      className={`${styles.labelColor}`}
                      type="checkbox"
                      label="DT- Arrived damage"
                    />
                  </Form.Group>
                  <Form.Group controlId="al_arrived_too_late" as={Col}>
                    <Form.Check
                      className={`${styles.labelColor}`}
                      type="checkbox"
                      label="AL- Arrived too late"
                    />
                  </Form.Group>
                  <Form.Group controlId="fg_faulty" as={Col}>
                    <Form.Check
                      className={`${styles.labelColor}`}
                      type="checkbox"
                      label="FG- Faulty"
                    />
                  </Form.Group>
                </Row>
                <Row>
                  <Form.Group controlId="dp_damaged" as={Col}>
                    <Form.Check
                      className={`${styles.labelColor}`}
                      type="checkbox"
                      label="DP- Damaged"
                    />
                  </Form.Group>
                  <Form.Group controlId="wp_wrong_product" as={Col}>
                    <Form.Check
                      className={`${styles.labelColor}`}
                      type="checkbox"
                      label="WP- Wrong Product"
                    />
                  </Form.Group>
                  <Form.Group controlId="ep_expiredproduct" as={Col}>
                    <Form.Check
                      className={`${styles.labelColor}`}
                      type="checkbox"
                      label="EP- Expired Product"
                    />
                  </Form.Group>
                </Row>
              </div>
            </Col>
          </Row>
          <Row className={styles.rowContainer}>
            <Col>
              <div className={styles.leftContent}>
                <div>
                  <Text className={styles.titleNumber}>5.</Text>
                  <Text className={styles.titleContent}>
                    Allow Refund without physical return:
                  </Text>
                </div>
                <div className={styles.valueContainer}>
                  <Text className={`${styles.labelColor}`}>
                    For Products less than or equal to
                  </Text>
                  <Input
                    value={`£ ${ComaSeparator(20)}`}
                    style={{ width: 40 }}
                    className={styles.inputBetweenTexts}
                  />
                </div>
                <div className={styles.valueContainer}>
                  <Text className={`${styles.labelColor}`}>
                    With a return quantity less than or equal to
                  </Text>
                  <Input
                    value={"2"}
                    style={{ width: 30 }}
                    className={styles.inputBetweenTexts}
                  />
                </div>
              </div>
            </Col>
            <Col>
              <Form.Group controlId="applicable_return_message" as={Col}>
                <Form.Label>
                  For applicable Return, display the message:
                </Form.Label>
                <TextArea
                  showCount
                  maxLength={200}
                  style={{ height: "38px" }}
                  onChange={() => {}}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className={styles.rowContainer}>
            <Col>
              <div className={styles.leftContent}>
                <div>
                  <Text className={styles.titleNumber}>6.</Text>
                  <Text className={styles.titleContent}>
                    Add Photo of Returned Product
                  </Text>
                </div>
                <div className={styles.valueContainer}>
                  <Form.Group controlId="allow_late_returns" as={Col}>
                    <Form.Check
                      className={`${styles.labelColor}`}
                      type="checkbox"
                      label="Mandatory Photo Required"
                      style={{ marginTop: 10 }}
                    />
                  </Form.Group>
                  <div className={styles.valueContainerLeft}>
                    <Text className={`${styles.labelColor}`}>
                      For Products greater than or equal to
                    </Text>
                    <Input
                      value={`£ ${ComaSeparator(200.5)}`}
                      style={{ width: 60 }}
                      className={styles.inputBetweenTexts}
                    />
                  </div>
                </div>
              </div>
            </Col>
            <Col>
              <div>
                <Row>
                  <Col md={"10"}>
                    <Text style={{ color: theme?.monoLabel }}>
                      Return Reasons Codes
                    </Text>
                  </Col>
                  {isEdit && (
                    <Col md={"2"} style={{ textAlign: "end" }}>
                      <Button
                        type="default"
                        style={{
                          borderRadius: "4px",
                          borderColor: theme?.primaryNight,
                          color: theme?.monoLabel,
                        }}
                      >
                        Edit
                      </Button>
                    </Col>
                  )}
                </Row>
              </div>
              <div className={styles.valueContainerRight}>
                <Row>
                  <Col md="4" />
                  <Col md="2" style={{ textAlign: "center" }}>
                    Mandatory
                  </Col>
                  <Col md="2" style={{ textAlign: "center" }}>
                    Optional
                  </Col>
                  <Col md="4" />
                </Row>
                <Row style={{ marginTop: 10 }}>
                  <Col md="4">
                    <Form.Check
                      className={`${styles.labelColor}`}
                      type="checkbox"
                      label="DT- Arrived damage"
                    />
                  </Col>
                  <Col md="2" style={{ display: "flex" }}>
                    <Form.Check
                      className={`${styles.labelColor}`}
                      type="radio"
                      style={{ margin: "auto" }}
                    />
                  </Col>
                  <Col md="2" style={{ display: "flex" }}>
                    <Form.Check
                      className={`${styles.labelColor}`}
                      type="radio"
                      style={{ margin: "auto" }}
                    />
                  </Col>
                  <Col md="4" />
                </Row>
                <Row style={{ marginTop: 10 }}>
                  <Col md="4">
                    <Form.Check
                      className={`${styles.labelColor}`}
                      type="checkbox"
                      label="AL- Arrived too late"
                    />
                  </Col>
                  <Col md="2" style={{ display: "flex" }}>
                    <Form.Check
                      className={`${styles.labelColor}`}
                      type="radio"
                      style={{ margin: "auto" }}
                    />
                  </Col>
                  <Col md="2" style={{ display: "flex" }}>
                    <Form.Check
                      className={`${styles.labelColor}`}
                      type="radio"
                      style={{ margin: "auto" }}
                    />
                  </Col>
                  <Col md="4" />
                </Row>
                <Row style={{ marginTop: 10 }}>
                  <Col md="4">
                    <Form.Check
                      className={`${styles.labelColor}`}
                      type="checkbox"
                      label="FG- Faulty"
                    />
                  </Col>
                  <Col md="2" style={{ display: "flex" }}>
                    <Form.Check
                      className={`${styles.labelColor}`}
                      type="radio"
                      style={{ margin: "auto" }}
                    />
                  </Col>
                  <Col md="2" style={{ display: "flex" }}>
                    <Form.Check
                      className={`${styles.labelColor}`}
                      type="radio"
                      style={{ margin: "auto" }}
                    />
                  </Col>
                  <Col md="4" />
                </Row>
                <Row style={{ marginTop: 10 }}>
                  <Col md="4">
                    <Form.Check
                      className={`${styles.labelColor}`}
                      type="checkbox"
                      label="DP- Damaged"
                    />
                  </Col>
                  <Col md="2" style={{ display: "flex" }}>
                    <Form.Check
                      className={`${styles.labelColor}`}
                      type="radio"
                      style={{ margin: "auto" }}
                    />
                  </Col>
                  <Col md="2" style={{ display: "flex" }}>
                    <Form.Check
                      className={`${styles.labelColor}`}
                      type="radio"
                      style={{ margin: "auto" }}
                    />
                  </Col>
                  <Col md="4" />
                </Row>
                <Row style={{ marginTop: 10 }}>
                  <Col md="4">
                    <Form.Check
                      className={`${styles.labelColor}`}
                      type="checkbox"
                      label="WP- Wrong Product"
                    />
                  </Col>
                  <Col md="2" />
                  <Col md="2" />
                  <Col md="4" />
                </Row>
                <Row style={{ marginTop: 10 }}>
                  <Col md="4">
                    <Form.Check
                      className={`${styles.labelColor}`}
                      type="checkbox"
                      label="EP- Expired Product"
                    />
                  </Col>
                  <Col md="2" />
                  <Col md="2" />
                  <Col md="4" />
                </Row>
              </div>
            </Col>
          </Row>
        </Content>
      </>
    </UserDashboard>
  );
};

export default ReturnPortalRules;
