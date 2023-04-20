/** @format */
import React, { useEffect, useState, useRef, forwardRef } from "react";
import UserDashboard from "../../../../components/UserDashboard";
import styles from "./carrier-history.module.scss";
import { AppButton } from "../../../../components/AppButton";
import ExceptionsHistory from "./exceptions-history";
import { Form, Row, Col, Table, FormLabel } from "react-bootstrap";
import { DatePicker, Button } from "antd";
import {
  fetchExceptionHistoryOrder,
  setExceptionHistoryOrder,
} from "../../../../redux/slices/exceptionHistorySlice";
import { RootStateOrAny, useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import moment from "moment";
import { useReactToPrint } from "react-to-print";
import { Message } from "../../../../utils/message";

const { RangePicker } = DatePicker;

const CarrierRoutingExceptionsHistory = () => {
  const dispatch = useDispatch();

  const exceptionHistoryOrder = useSelector(
    ({ exceptionHistory }: RootStateOrAny) =>
      exceptionHistory.exceptionHistoryOrder
  );

  console.log({ exceptionHistoryOrder }, "exceptionHistoryOrder");

  const loading = useSelector(
    ({ exceptionHistory }: RootStateOrAny) => exceptionHistory.loading
  );

  const sumTotal = [
    exceptionHistoryOrder?.percentages["Unknown SKU"].total,
    exceptionHistoryOrder?.percentages["Inactive SKU"].total,
    exceptionHistoryOrder?.percentages["No Matching Despatch Method"].total,
  ].reduce((partialSum, a) => partialSum + a, 0);

  const sumPercentage = [
    parseFloat(exceptionHistoryOrder?.percentages["Unknown SKU"].percentage),
    parseFloat(exceptionHistoryOrder?.percentages["Inactive SKU"].percentage),
    parseFloat(
      exceptionHistoryOrder?.percentages["No Matching Despatch Method"]
        .percentage
    ),
  ].reduce((partialSum, a) => partialSum + a, 0);

  const [view, setView] = useState<string>("CarrierRoutingHistory");

  const [dateData, setDateData] = useState<any>(null);
  const [numberOfWeeks, setNumberOfWeeks] = useState<any>("");

  const screenToPrint = useRef() as any;
  const handlePrint = useReactToPrint({
    content: () => screenToPrint.current,
  });

  const validation = loading || !exceptionHistoryOrder;

  const handleChangeDate = (e: any) => {
    if (!e || e.length < 2) {
      setDateData(null);
      return;
    }
    setDateData(e);
  };

  const handleOnDisplay = async () => {
    try {
      await dispatch(
        fetchExceptionHistoryOrder({
          client: "aldi",
          from: dateData[0].format("YYYYMMDD"),
          to: dateData[1].format("YYYYMMDD"),
        }) as any
      );
    } catch {}
  };

  const handleShowDetail = async () => {
    try {
      // dispatch(
      //   fetchExceptionHistoryTotal({
      //     client: "aldi",
      //     from: dateData[0].format("YYYYMMDD"),
      //     to: dateData[1].format("YYYYMMDD"),
      //   })
      // );

      setView("CarrierRoutingHistoryView");
    } catch {}
  };

  useEffect(() => {
    if (dateData?.[1]) {
      let weeks = Math.round(
        Math.abs(dateData[0].diff(dateData[1], "day") / 7)
      );

      if (weeks < 1) weeks = 1;

      setNumberOfWeeks(weeks);
      return;
    }

    setNumberOfWeeks("");
    dispatch(setExceptionHistoryOrder(null));
  }, [dateData]);

  const ComponentToPrint = forwardRef<HTMLDivElement, any>(
    function ComponentToPrint(props, ref) {
      const dateTime = moment().format("DD/MM/YYYY HH:mm");
      return (
        <div className={`${styles.printScreen}`} ref={ref}>
          <div className={`${styles.printDateTime}`}>
            <FormLabel>{dateTime}</FormLabel>
          </div>
          <h1 className="text-mono-title font-bold flex justify-center text-xmd mb-5">
            Carrier Routing: Exceptions History
          </h1>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Form style={{ minWidth: 972, marginLeft: 60 }}>
              <Form.Group
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
                    marginTop: 5,
                  }}
                >
                  Report Date Range
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
                        handleChangeDate(e);
                      }}
                    />
                  </Form.Group>
                </Col>
                <Col
                  style={{
                    position: "relative",
                    right: 100,
                  }}
                >
                  <div
                    style={{
                      // marginRight: 20,
                      display: "inline-block",
                      marginTop: 5,
                    }}
                  >
                    {numberOfWeeks >= 1 && (
                      <>
                        {numberOfWeeks >= 1
                          ? `${numberOfWeeks} weeks`
                          : `${numberOfWeeks} week`}
                      </>
                    )}
                  </div>
                  <AppButton
                    style={{
                      width: 120,
                      height: 30,
                      position: "absolute",
                      left: 218,
                    }}
                    className={`${styles.buttonInPickerExceptions}`}
                    onClick={handleOnDisplay}
                    disabled={!(numberOfWeeks >= 1)}
                    loading={loading}
                    title="Display"
                  />
                </Col>
              </Form.Group>
            </Form>

            <div
              style={{
                display: "flex",
                alignItems: "end",
                justifyContent: "center",
              }}
            >
              <Table
                borderless
                style={{
                  whiteSpace: "nowrap",
                  width: 400,
                  marginTop: 15,
                  marginRight: 30,
                }}
              >
                <thead>
                  <tr>
                    <th className="title-header border-bottom-1">
                      Total Orders Received:
                    </th>
                    <th
                      className="title-header text-right border-bottom-1"
                      style={{ width: 130 }}
                    >
                      {loading ? (
                        "Loading"
                      ) : (
                        <>{exceptionHistoryOrder?.totalOrders}</>
                      )}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div>Of which:</div>
                      <span className="ms-4">
                        Orders with No Matching Despatch Method
                      </span>
                    </td>
                    <td className="text-right  ">
                      <br />
                      <div className=" border-1 border-gray pe-2">
                        {validation ? (
                          <br />
                        ) : (
                          <>
                            {
                              exceptionHistoryOrder?.percentages[
                                "No Matching Despatch Method"
                              ].total
                            }
                          </>
                        )}
                      </div>
                    </td>
                    <td className={`${styles.percentage} `}>
                      <br />
                      {validation ? (
                        <span></span>
                      ) : (
                        <>
                          {!isNaN(
                            exceptionHistoryOrder?.percentages[
                              "No Matching Despatch Method"
                            ].percentage
                          )
                            ? exceptionHistoryOrder?.percentages[
                                "No Matching Despatch Method"
                              ].percentage
                            : "0.000"}
                        </>
                      )}
                      %
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span className="ms-4">Orders with Inactive SKU </span>
                    </td>
                    <td className="text-right">
                      <div
                        className=" border-1 border-gray pe-2"
                        style={{ width: 70 }}
                      >
                        {validation ? (
                          <br />
                        ) : (
                          <>
                            {
                              exceptionHistoryOrder?.percentages["Inactive SKU"]
                                .total
                            }
                          </>
                        )}
                      </div>
                    </td>
                    <td className={`${styles.percentage}`}>
                      {validation ? (
                        <span></span>
                      ) : (
                        <>
                          {!isNaN(
                            exceptionHistoryOrder?.percentages["Inactive SKU"]
                              .percentage
                          )
                            ? exceptionHistoryOrder?.percentages["Inactive SKU"]
                                .percentage
                            : "0.000"}
                        </>
                      )}
                      %
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span className="ms-4">Orders with Unknown SKU</span>
                    </td>
                    <td className="text-right">
                      <div className=" border-1 border-gray pe-2">
                        {validation ? (
                          <br />
                        ) : (
                          <>
                            {
                              exceptionHistoryOrder?.percentages["Unknown SKU"]
                                .total
                            }
                          </>
                        )}
                      </div>
                    </td>
                    <td className={`${styles.percentage} `}>
                      {validation ? (
                        <span></span>
                      ) : (
                        <>
                          {!isNaN(
                            exceptionHistoryOrder?.percentages["Unknown SKU"]
                              .percentage
                          )
                            ? exceptionHistoryOrder?.percentages["Unknown SKU"]
                                .percentage
                            : "0.000"}
                        </>
                      )}
                      %
                    </td>
                  </tr>
                  <tr>
                    <td className="border-top border-dark pt-3">
                      Total Order Exceptions
                    </td>
                    <td className="text-right border-top border-dark pt-3">
                      <div className="border-1 border-gray pe-2">
                        {validation ? (
                          <br />
                        ) : (
                          <>
                            {
                              exceptionHistoryOrder?.percentages[
                                "TotalOrderException"
                              ].total
                            }
                          </>
                        )}
                      </div>
                    </td>
                    <td
                      className={`${styles.percentage} border-top border-dark pt-3`}
                    >
                      {validation ? (
                        <span></span>
                      ) : (
                        <>
                          {
                            exceptionHistoryOrder?.percentages[
                              "TotalOrderException"
                            ].percentage
                          }
                        </>
                      )}
                      %
                    </td>
                  </tr>
                </tbody>
              </Table>
              <div style={{ position: "relative", marginLeft: 15 }}>
                <AppButton
                  style={{
                    width: 150,
                    height: 30,
                    position: "absolute",
                    bottom: 29,
                  }}
                  className={`${styles.buttonInPickerExceptions}`}
                  onClick={handleShowDetail}
                  disabled={validation}
                  title="Show Detail"
                />
              </div>
            </div>
          </div>
        </div>
      );
    }
  );

  if (view === "CarrierRoutingHistoryView") {
    return (
      <UserDashboard>
        <ExceptionsHistory
          data={exceptionHistoryOrder.data}
          onGoBack={() => setView("CarrierRoutingHistory")}
        />
      </UserDashboard>
    );
  }

  return (
    <UserDashboard>
      <AppButton
        className="xsm:w-28 xsm:h-9 lg:w-30 lg:h-10 font-bold tracking-wide mt-5 "
        style={{
          borderRadius: "4px",
          position: "absolute",
          top: 3,
          right: 4,
        }}
        disabled={validation}
        onClick={handlePrint}
        title="Print"
      />

      <ComponentToPrint ref={screenToPrint} />
    </UserDashboard>
  );
};

export default CarrierRoutingExceptionsHistory;
