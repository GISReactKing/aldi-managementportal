import React, { Fragment, useEffect, useState, useRef } from "react";
import UserDashboard from "../../../components/UserDashboard";
import styles from "./claim-preparation.module.scss";
import { Alert } from "react-bootstrap";
import { Checkbox, DatePicker, Button } from "antd";
import { RootStateOrAny, useSelector, useDispatch } from "react-redux";
import { CalenderIcon } from "../../../components/Icons";
import OrderHistorySummary from "./order-history-summary";
import InvoicingClaimPreparation from "./invoicing-claim-preparation";
import { Col, Form, Row } from "react-bootstrap";
import { AppButton } from "../../../components/AppButton";
import moment from "moment";
import _ from "lodash";
import { fetchSummaryOrderHistory } from "../../../redux/slices/claimsPreparationSlice";
import {
  fetchClaims,
  fetchInvoicingClaimPrep,
} from "../../../redux/slices/claimsPrepSlice";

import { AnyArray } from "immer/dist/internal";
import { Message } from "../../../utils/message";
import useTheme from "../../../hooks/useTheme";

const { RangePicker } = DatePicker;
interface Props {}

const ClaimPreparation = (props: Props) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const [view, setView] = useState<string>("customerSelection");

  const [orderNO, setOrderNO] = useState<string>("");
  const [customerEmail, setCustomerEmail] = useState<string>("");
  const [deliveryPostCode, setDeliveryPostCode] = useState<string>("");
  const [dateData, setDateData] = useState<any>(null);
  const [disabledDisplayButton, setDisabledDisplayButton] =
    useState<boolean>(false);
  const [disabledEmailPostCode, setDisabledEmailPostCode] =
    useState<boolean>(false);
  const [disabledOrderNo, setDisabledOrderNo] = useState<boolean>(false);
  const [disabledDateFilter, setDisabledDateFilter] = useState<boolean>(true);

  const [includeOrdersWithReturns, setIncludeOrdersWithReturns] =
    useState<boolean>(false);

  const [location, setLocation] = useState<string>("");

  const [messageForOrderNo, setMessageForOrderNo] = useState<boolean>(false);

  const [highlightEmail, setHighlightEmail] = useState<boolean>(false);
  const [highlightPostCode, setHighlightPostCode] = useState<boolean>(false);

  const [inputError, setInputError] = useState(null);

  const [loading, setLoading] = useState(false);

  const [onEdit, setOnEdit] = useState(false);

  const summaryOrderHistory = useSelector(
    ({ claimsPreparation }: RootStateOrAny) =>
      claimsPreparation.summaryOrderHistory
  );

  const [data, setData] = useState<any[]>([summaryOrderHistory]);

  const validateEmail = (email: string) => {
    return email
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const filterData = () => {
    let dataCopy = [];
    if (orderNO) {
      dataCopy = _.filter(
        summaryOrderHistory,
        (o: any) => o.orderNo === orderNO
      );
    } else {
      dataCopy = _.filter(
        summaryOrderHistory,
        (o: any) =>
          o.customerEmail === customerEmail &&
          o.deliveryPostCode === deliveryPostCode
      );
      if (dateData) {
        dataCopy = _.filter(dataCopy, (o: any) => {
          const temp = moment(o.orderDate);
          return dateData[0].isBefore(temp) && dateData[1].isAfter(temp);
        });
      }

      if (includeOrdersWithReturns) {
        dataCopy = _.filter(dataCopy, (o: any) => o.returnedItems > 0);
      }
    }

    return dataCopy;
  };

  useEffect(() => {
    dispatch(fetchSummaryOrderHistory());
    setData(summaryOrderHistory);

    let headerElem = document.getElementsByClassName("site-layout-background");

    if (headerElem.length) {
      // @ts-ignore
      headerElem[0].style.height = "calc(100vh - 160px)";
      // @ts-ignore
      headerElem[0].style.overflow = "scroll";
    }
  }, []);

  useEffect(() => {
    if (orderNO) {
      setDisabledEmailPostCode(true);
      setDisabledDisplayButton(false);
      setDisabledDateFilter(true);
    } else {
      setDisabledEmailPostCode(false);
      setDisabledDisplayButton(
        !customerEmail ||
          !deliveryPostCode ||
          !validateEmail(customerEmail) ||
          !dateData?.[1]
      );
    }
  }, [orderNO, customerEmail, deliveryPostCode, dateData]);

  useEffect(() => {
    if (customerEmail && !deliveryPostCode) {
      setHighlightEmail(false);
      setHighlightPostCode(true);
    } else if (!customerEmail && deliveryPostCode) {
      setHighlightEmail(true);
      setHighlightPostCode(false);
    } else {
      setHighlightEmail(false);
      setHighlightPostCode(false);
    }

    setDisabledOrderNo(customerEmail !== "" || deliveryPostCode !== "");

    if (customerEmail) {
      setHighlightEmail(!validateEmail(customerEmail));
    }

    if (customerEmail && deliveryPostCode) {
      setDisabledDateFilter(false);
    } else {
      setDisabledDateFilter(true);
    }

    setDateData(null);
  }, [customerEmail, deliveryPostCode]);

  // useEffect(() => {
  //     const dataCopy = filterData();
  //     setDisabledDisplayButton(dataCopy.length === 0);
  // }, [dateData]);

  useEffect(() => {
    setDisabledDisplayButton(orderNO === "");
    setMessageForOrderNo(false);
  }, [orderNO]);

  if (view === "orderHistorySummary") {
    return (
      <UserDashboard>
        <OrderHistorySummary
          data={data}
          loading={loading}
          onGoBack={() => setView("customerSelection")}
          onSelectedRow={async (orderNO: string) => {
            setLoading(true);
            const data = {
              ClientCode: "aldi",
              customerReference: orderNO,
              email: "",
              postCodeFirst: "",
              postCodeSecond: "",
              dateFrom: "",
              dateTo: "",
              returnOrdersOnly: "",
            };

            const result: any = await dispatch(
              fetchInvoicingClaimPrep(data) as any
            );

            if (result?.error?.message) {
              setInputError(result.error.message);
              setLoading(false);
              return;
            }

            setLocation("orderHistorySummary");
            setView("invoicingClaimPreparation");
            setLoading(false);
          }}
        />
      </UserDashboard>
    );
  }

  if (view === "invoicingClaimPreparation") {
    return (
      <UserDashboard>
        <InvoicingClaimPreparation onGoBack={() => setView(location)} />
      </UserDashboard>
    );
  }

  const handleChangeOrderNO = (target: any) => {
    setInputError(null);
    setOrderNO(target);
    setOnEdit(true);
  };

  const handleChangeCustomerEmail = (target: any) => {
    setInputError(null);
    setCustomerEmail(target);
    setOnEdit(true);
  };

  const handleChangeDeliveryPostCode = (target: any) => {
    setDeliveryPostCode(target);
    setOnEdit(true);
  };

  const handleChangeDate = (e: any) => {
    if (!e || e.length < 2) {
      setDateData(null);
      return;
    }

    setDateData(e);
  };

  const handleDisplayButton = async () => {
    setInputError(null);
    setLoading(true);

    // const dataCopy = filterData();
    // if (orderNO) {
    //   setMessageForOrderNo(dataCopy.length === 0);
    //   if (dataCopy.length === 0) {
    //     return;
    //   }
    // }
    // setData(dataCopy);

    if (orderNO) {
      const data = {
        ClientCode: "aldi",
        customerReference: orderNO,
        email: "",
        postCodeFirst: "",
        postCodeSecond: "",
        dateFrom: "",
        dateTo: "",
        returnOrdersOnly: "",
      };

      const result: any = await dispatch(fetchInvoicingClaimPrep(data) as any);

      // if (result?.payload?.rows[0]?.Error) {
      //   setInputError(result.payload.rows[0].Error);
      //   return;
      // }

      if (result?.payload?.message) {
        setInputError(result?.payload?.message);
        setLoading(false);
        return;
      }

      setLocation("customerSelection");
      setView("invoicingClaimPreparation");
      setLoading(false);
      return;
    }

    const postCode = deliveryPostCode.replace(/\s/g, "");
    const postCodeSecond = postCode.slice(postCode.length - 3);
    const postCodeFirst = postCode.replace(postCodeSecond, "");

    const dateFrom = moment(dateData[0]).format("YYYYMMDD");
    const dateTo = moment(dateData[1]).format("YYYYMMDD");

    const data = {
      ClientCode: "aldi",
      customerReference: orderNO,
      email: customerEmail,
      postCodeFirst: postCodeFirst,
      postCodeSecond: postCodeSecond,
      dateFrom: dateFrom,
      dateTo: dateTo,
      returnOrdersOnly: includeOrdersWithReturns,
    };

    const result: any = await dispatch(fetchClaims(data) as any);

    // if (result?.payload?.message) {
    //   setInputError(result?.payload?.message);
    //   setLoading(false);
    //   return;
    // }

    if (result?.error?.message) {
      setInputError(result?.error?.message);
      setLoading(false);
      return;
    }

    setView("orderHistorySummary");
    setLoading(false);
  };

  return (
    <UserDashboard containerClassName="flex justify-center">
      <div>
        <h1
          style={{
            color: theme?.monoTitle,
            position: "absolute",
            marginLeft: "417px",
          }}
          className="font-bold flex justify-center text-xmd mb-3"
        >
          Customer Selection
        </h1>
        <>
          <AppButton
            className={`${styles.addButton} xsm:w-28 xsm:h-9 lg:w-30 lg:h-10 tracking-wide mt-5 position-absolute top-1 z-50`}
            title="Clear Filters"
            disabled={loading || !onEdit}
            onClick={() => {
              setOrderNO("");
              setCustomerEmail("");
              setDeliveryPostCode("");
              setDateData(null);
              setInputError(null);
              setIncludeOrdersWithReturns(false);
              setOnEdit(false);
            }}
          />
          <AppButton
            className={`${styles.exportButton} xsm:w-28 xsm:h-9 lg:w-30 lg:h-10 tracking-wide mt-5 position-absolute top-1 right-4 z-50`}
            title="Display"
            onClick={() => handleDisplayButton()}
            disabled={disabledDisplayButton || loading}
            loading={loading}
          />
        </>

        <Form
          className="m-[0 auto] w-full w-m-[900px]"
          style={{
            marginLeft: "200px",
            marginTop: "70px",
          }}
        >
          <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
            <Form.Label
              style={{
                width: "220px",
                alignItems: "center",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              Order No.:
            </Form.Label>
            <Col sm="3">
              <Form.Control
                data-testId="Claims_OrderNo"
                name="orderNO"
                value={orderNO}
                onChange={({ target }) => {
                  handleChangeOrderNO(target.value);
                  setInputError(null);
                  setCustomerEmail("");
                  setDeliveryPostCode("");
                  setDateData(null);
                }}
                disabled={disabledOrderNo}
                style={{
                  width: "85%",
                }}
              />
            </Col>
            <Form.Label
              style={{
                width: "520px",
                color: "red",
                fontSize: 12,
                alignItems: "center",
                display:
                  inputError ===
                  "No Records were found matching your search criteria. Please check your search criteria and try again."
                    ? "flex"
                    : "none",
              }}
            >
              No Records were found matching your search criteria. Please check
              your search criteria and try again.
            </Form.Label>
          </Form.Group>
          <Form.Label
            style={{
              width: "180px",
              alignItems: "center",
              display: "flex",
              justifyContent: "flex-end",
              color: "blue",
              marginBottom: "0px",
            }}
          >
            alternatively
          </Form.Label>
          <Form.Group
            as={Row}
            style={{ flexDirection: "row", display: "flex" }}
            className="mb-3"
            controlId="formPlaintextEmail"
          >
            <Form.Label
              style={{
                width: "220px",
                alignItems: "center",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              Customer Email:
            </Form.Label>
            <Col sm="3">
              <Form.Control
                data-testId="claims_email"
                type="email"
                name="customerEmail"
                value={customerEmail}
                disabled={disabledEmailPostCode}
                autoComplete="email"
                onChange={({ target }) => {
                  handleChangeCustomerEmail(target.value);
                  setOrderNO("");
                  setInputError(null);
                }}
                style={{ borderColor: highlightEmail ? "red" : "#ced4da" }}
              />
              <Form.Label
                style={{
                  width: "220px",
                  color: "red",
                  fontSize: 12,
                  alignItems: "center",
                  marginTop: 10,
                  position: "absolute",
                  display:
                    inputError === '"email" must be a valid email'
                      ? "flex"
                      : "none",
                }}
              >
                must be a valid email
              </Form.Label>
            </Col>

            <Form.Label
              style={{
                width: "170px",
                alignItems: "center",
                display: "flex",
                margin: "0px",
                padding: "0px",
              }}
            >
              <span
                style={{ color: "blue", marginRight: 4 }}
              >{`${"and"}`}</span>
              {" Delivery Post Code:"}
            </Form.Label>
            <Col sm="2">
              <Form.Control
                data-testId="claims_postal"
                autoComplete="postal-code"
                name="deliveryPostCode"
                value={deliveryPostCode}
                disabled={disabledEmailPostCode}
                onChange={({ target }) => {
                  handleChangeDeliveryPostCode(target?.value?.toUpperCase?.());
                  setOrderNO("");
                  setInputError(null);
                }}
                style={{ borderColor: highlightPostCode ? "red" : "#ced4da" }}
              />
            </Col>
          </Form.Group>

          <Form.Label
            style={{
              width: "180px",
              alignItems: "center",
              display: "flex",
              justifyContent: "flex-end",
              color: "blue",
              marginBottom: "0px",
            }}
          >
            with
          </Form.Label>
          <Form.Group
            data-testId="DateRange"
            as={Row}
            className="mb-3"
            controlId="formPlaintextEmail"
          >
            <Form.Label
              style={{
                width: "220px",
                alignItems: "center",
                display: "flex",
                justifyContent: "flex-end",
                marginTop: -25,
              }}
            >
              Order Date Range: From / To:
            </Form.Label>
            <Col>
              <Form.Group
                as={Row}
                style={{
                  display: "flex",
                  width: "100%",
                  flexDirection: "row",
                  alignItems: "center",
                }}
                controlId="return_date_range"
              >
                <RangePicker
                  style={{ width: "250px" }}
                  format={"DD/MM/YYYY"}
                  disabledDate={(current) => {
                    let customDate = moment().add(0, "days");
                    return (
                      current && current >= moment(customDate, "DD/MM/YYYY")
                    );
                  }}
                  value={dateData}
                  onChange={(e: any) => {
                    if (!e) {
                      handleChangeDate(e);
                      setInputError(null);
                      return;
                    }

                    if (e) {
                      const [startDate, endDate] = e;
                      if (moment(startDate).isSame(endDate)) {
                        handleChangeDate([startDate, null]);
                        Message(
                          "danger",
                          "End date must be greater than start date"
                        );
                        return;
                      }
                      handleChangeDate(e);
                      setInputError(null);
                    }
                  }}
                  disabled={disabledDateFilter}
                />
              </Form.Group>
              <Form.Group
                as={Row}
                style={{
                  display: "flex",
                  width: "100%",
                  flexDirection: "row",
                  alignItems: "center",
                }}
                controlId="return_date_range"
              >
                <Checkbox
                  style={{ marginTop: 10 }}
                  disabled={disabledEmailPostCode || !dateData?.[1]}
                  defaultChecked={includeOrdersWithReturns}
                  checked={includeOrdersWithReturns}
                  name="active"
                  onChange={(target: any) =>
                    setIncludeOrdersWithReturns(target.target.checked)
                  }
                >
                  Only include orders with Returns
                </Checkbox>
              </Form.Group>
            </Col>
          </Form.Group>
        </Form>
      </div>
    </UserDashboard>
  );
};

export default ClaimPreparation;
