import UserDashboard from "../../../components/UserDashboard";
import { PrinterOutlined } from "@ant-design/icons";
import ServicesActiveDatesFilterBar from "./FilterBar";
import ServicesActiveDatesTable from "./ServicesActiveDatesTable";
import { AmmendCarrierServiceActiveDatesModal } from "../../../components/Modals";
import stylesMain from "../carrier-routing-control.module.scss";
import { Button, Typography, DatePicker, DatePickerProps } from "antd";
import { useState, useEffect, useRef, useMemo } from "react";
import { useReactToPrint } from "react-to-print";
import { Col, Form, Row, FormLabel } from "react-bootstrap";
import moment, { Moment } from "moment";
import { RootStateOrAny, useSelector } from "react-redux";
import styles from "./styles.module.scss";
import { AppButton } from "../../../components/AppButton";
import { checkingDisableOfAppButton } from "../../../utils/CheckingStatus";
import {
  carrierStatusUpdate,
  ClientCarrier,
  fetchCarrierStatus,
  fetchCarrierStatusList,
  setEditing,
  setShowDetail,
  setPermanentlyDateData as setPermanentlyDateDataRedux,
  setEffectiveDateRange,
} from "../../../redux/slices/carrierServicesActiveDatesSlice";
import { isBoolean } from "lodash";
import { Message } from "../../../utils/message";
import { AnyListenerPredicate } from "@reduxjs/toolkit/dist/listenerMiddleware/types";
import useAppSelector from "../../../hooks/useAppSelector";
import useAppDispatch from "../../../hooks/useAppDispatch";
import { RangePickerProps } from "antd/lib/date-picker";
import useTheme from "../../../hooks/useTheme";

interface Props {}

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const dateFormat = "DD/MM/YYYY";

const ServicesActiveDates = (props: Props) => {
  const theme = useTheme();
  const [
    ammendCarrierServiceActiveDatesModalShow,
    setAmmendCarrierServiceActiveDatesModalShow,
  ] = useState<boolean>(false);
  const [value, setValue] = useState(null);

  const [detailData, setDetailData] = useState<any>(null);
  const scroll = {
    x: "max-content",
  };

  const {
    isEditing: onEdit,
    showDetails: isDetail,

    effectiveDateRange,
  } = useAppSelector((state) => state?.carrierServicesActive || {});
  const permanentlyDateData = useAppSelector((state) => {
    const selectedDate = state?.carrierServicesActive?.permanentlyDateData;

    return selectedDate ? moment(selectedDate) : null;
  });
  const effectiveBetweenDateData = useMemo(
    () => effectiveDateRange?.map((d) => (d ? moment(d) : null)),
    [effectiveDateRange]
  );
  const currentUser = useSelector(
    ({ users }: RootStateOrAny) => users.currentUser
  );

  const dispatch = useAppDispatch();

  const setOnEdit = (bool: boolean = false) => dispatch(setEditing(bool));
  const setIsDetail = (bool: boolean = false) => dispatch(setShowDetail(bool));

  const [status, setStatus] = useState<string>("");
  const setPermanentlyDateData = (data: string | null) =>
    dispatch(setPermanentlyDateDataRedux(data));

  const setEffectiveBetweenDateData = (data: (string | null)[] | null) =>
    dispatch(setEffectiveDateRange(data));

  const [disablePermanentlyDate, setDisablePermanentlyDate] =
    useState<boolean>(false);
  const [disableEffectiveBetweenDate, setDisableEffectiveBetweenDate] =
    useState<boolean>(false);
  const [disableSaveButton, setDisableSaveButton] = useState<boolean>(false);

  useEffect(() => {
    try {
      dispatch(fetchCarrierStatusList("aldi") as any);
    } catch (error) {}
  }, []);

  const componentToPrintRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentToPrintRef.current,
  });

  const carrierStatusList = useSelector(
    ({ carrierServicesActive }: RootStateOrAny) =>
      carrierServicesActive.carrierStatusList
  );

  const carrierStatus = useSelector(
    ({ carrierServicesActive }: RootStateOrAny) =>
      carrierServicesActive.carrierStatus
  );

  const statusLoader = useSelector(
    ({ carrierServicesActive }: RootStateOrAny) =>
      carrierServicesActive.statusLoader
  );

  const carrierServicesActiveLoader = useSelector(
    ({ carrierServicesActive }: RootStateOrAny) => carrierServicesActive.loader
  );

  const data = carrierStatusList?.map((record: ClientCarrier) => {
    let permanentlyEffectiveDate;
    let effectiveBetweenDateFrom;
    let effectiveBetweenDateTo;

    if (
      record.secondaryParameters?.effectiveBetween?.dateFrom &&
      record.secondaryParameters?.effectiveBetween.dateTo
    ) {
      permanentlyEffectiveDate = "";
    } else if (record.secondaryParameters?.effectiveFrom) {
      permanentlyEffectiveDate = moment(
        record.secondaryParameters?.effectiveFrom
      ).format("DD/MM/YYYY");
    } else {
      permanentlyEffectiveDate = "";
    }

    if (
      record.secondaryParameters?.effectiveBetween?.dateFrom &&
      record.secondaryParameters?.effectiveBetween?.dateFrom
    ) {
      effectiveBetweenDateFrom = moment(
        record?.secondaryParameters?.effectiveBetween?.dateFrom
      ).format("DD/MM/YYYY");
    } else {
      effectiveBetweenDateFrom = "";
    }

    if (
      record.secondaryParameters?.effectiveBetween?.dateFrom &&
      record.secondaryParameters?.effectiveBetween?.dateFrom
    ) {
      effectiveBetweenDateTo = moment(
        record.secondaryParameters?.effectiveBetween?.dateTo
      ).format("DD/MM/YYYY");
    } else {
      effectiveBetweenDateTo = "";
    }

    return {
      name: record.name,
      carrier: record.carrier,
      status: record.active,
      secondaryStatus:
        isBoolean(record.secondaryParameters?.active) &&
        (record.secondaryParameters?.effectiveFrom ||
          record.secondaryParameters?.effectiveBetween?.dateTo)
          ? record.secondaryParameters?.active
          : "",
      permanently_Effective_date: permanentlyEffectiveDate,
      effective_between_date_from: effectiveBetweenDateFrom,
      effective_between_date_to: effectiveBetweenDateTo,
    };
  });

  const CUDDisabled = checkingDisableOfAppButton(currentUser, "edit", [
    // "Set Up & Control",
    "Carrier Routing Control",
    "Carrier: Active Dates",
  ]);

  const handleRowClick = (record: any) => {
    setStatus(record?.status); // .status not making sense here becuase string is expected in record. need to discuss this.
    setDetailData(record);
  };

  const handleEditButton = () => {
    if (detailData) {
      dispatch(fetchCarrierStatus(detailData));
      setIsDetail(true);
    }
  };

  const handleDatePicker = (e: Moment | null) => {
    if (!e || String(e).length < 2) {
      setPermanentlyDateData(null);
      return;
    }

    setPermanentlyDateData(e.toISOString());
  };

  const handleRangePicker = (e: (Moment | null)[] | null) => {
    if (!e || e.length < 2) {
      setEffectiveBetweenDateData(null);
      return;
    }
    setEffectiveBetweenDateData(
      e.map((date) => {
        if (date) return date.toISOString();
        else return null;
      })
    );
  };

  useEffect(() => {
    if (!permanentlyDateData && !effectiveBetweenDateData) {
      setDisableEffectiveBetweenDate(false);
      setDisablePermanentlyDate(false);
    } else {
      setDisableSaveButton(false);

      if (permanentlyDateData) {
        setDisableEffectiveBetweenDate(true);
        setDisablePermanentlyDate(false);
      } else if (effectiveBetweenDateData) {
        setDisableEffectiveBetweenDate(false);
        setDisablePermanentlyDate(true);
      }
    }
  }, [permanentlyDateData, effectiveBetweenDateData]);

  useEffect(() => {
    if (!permanentlyDateData && !effectiveBetweenDateData && !status) {
      setDisableSaveButton(true);
    } else {
      setDisableSaveButton(false);
    }
  }, [status]);

  useEffect(() => {
    if (
      carrierStatus?.clientCarrier?.secondaryParameters?.effectiveBetween
        ?.dateFrom &&
      carrierStatus?.clientCarrier?.secondaryParameters?.effectiveBetween
        ?.dateTo
    ) {
      setEffectiveBetweenDateData([
        moment(
          carrierStatus?.clientCarrier?.secondaryParameters?.effectiveBetween
            .dateFrom
        ).toISOString(),
        moment(
          carrierStatus?.clientCarrier?.secondaryParameters?.effectiveBetween
            .dateTo
        ).toISOString(),
      ]);
    }

    if (carrierStatus?.clientCarrier?.secondaryParameters?.effectiveFrom) {
      setPermanentlyDateData(
        moment(
          carrierStatus?.clientCarrier?.secondaryParameters?.effectiveFrom
        ).toISOString()
      );
    }

    if (carrierStatus?.clientCarrier?.secondaryParameters?.active) {
      setStatus("Active");
    } else {
      setStatus("Inactive");
    }
  }, [carrierStatus]);

  const handleCancel = () => {
    setIsDetail(false);
    setDetailData(null);
    setPermanentlyDateData(null);
    setEffectiveBetweenDateData(null);
    setOnEdit(false);
    dispatch(fetchCarrierStatusList("aldi"));
    setValue(null);
  };

  const handleOnSave = async () => {
    try {
      const statusUpdate: any = {
        carrier: carrierStatus?.clientCarrier?.carrier,
        client: "ALDI",
        secondaryStatus: !carrierStatus?.clientCarrier?.active,
      };

      if (effectiveBetweenDateData) {
        statusUpdate.from = moment(effectiveBetweenDateData[0]).format(
          "YYYY-MM-DD"
        );
        statusUpdate.to = moment(effectiveBetweenDateData[1]).format(
          "YYYY-MM-DD"
        );
      }

      if (permanentlyDateData) {
        await dispatch(
          carrierStatusUpdate({
            carrier: carrierStatus?.clientCarrier?.carrier,
            client: "ALDI",
            clear: true,
          })
        );

        statusUpdate.from = moment(permanentlyDateData).format("YYYY-MM-DD");
      }

      if (!effectiveBetweenDateData && !permanentlyDateData) {
        statusUpdate.clear = true;
      }

      await dispatch(carrierStatusUpdate(statusUpdate) as any);

      handleCancel();
    } catch (error) {
      Message("danger", (error as any)?.message);
    }
  };

  const handleOnClear = () => {
    setDetailData(null);
    setValue(null);
  };

  return (
    <UserDashboard>
      {!isDetail ? (
        <>
          <AppButton
            className={`xsm:w-28 xsm:h-9 lg:w-30 lg:h-10 font-bold tracking-wide mt-5 position-absolute top-1 z-50 ${stylesMain.buttonInHeader}`}
            title="Deselect Edit"
            style={{
              borderRadius: "4px",
              right: "285px",
            }}
            disabled={CUDDisabled || !detailData}
            onClick={handleOnClear}
            data-testid="edit-button"
          />
          <AppButton
            className={`xsm:w-28 xsm:h-9 lg:w-30 lg:h-10 font-bold tracking-wide mt-5 position-absolute top-1 z-50 ${stylesMain.buttonInHeader}`}
            title="Edit"
            style={{
              borderRadius: "4px",
              right: "150px",
            }}
            onClick={() => handleEditButton()}
            disabled={CUDDisabled || !detailData}
          />
          <AppButton
            className={`xsm:w-28 xsm:h-9 lg:w-30 lg:h-10 font-bold tracking-wide mt-5 position-absolute top-1 right-4 z-50 ${stylesMain.buttonInHeader}`}
            title="Print"
            style={{ borderRadius: "4px" }}
            onClick={handlePrint}
          />
        </>
      ) : (
        <>
          <AppButton
            className={`xsm:w-28 xsm:h-9 lg:w-30 lg:h-10 font-bold tracking-wide mt-5 position-absolute top-1 z-50 ${stylesMain.buttonInHeader}`}
            title="Save"
            style={{
              borderRadius: "4px",
              right: "150px",
            }}
            disabled={
              disableSaveButton || !onEdit || carrierServicesActiveLoader
            }
            loading={carrierServicesActiveLoader}
            onClick={handleOnSave}
          />
          <AppButton
            className={`xsm:w-28 xsm:h-9 lg:w-30 lg:h-10 font-bold tracking-wide mt-5 position-absolute top-1 right-4 z-50 ${stylesMain.buttonInHeader}`}
            style={{ borderRadius: "4px" }}
            title="Cancel"
            onClick={handleCancel}
          />
        </>
      )}

      <Row className="mb-5">
        <Col md="4"></Col>
        <Col md="4" style={{ textAlign: "center" }}>
          <Row>
            <Title level={3} data-testid="edit-page-title">
              Carrier: Active Dates
            </Title>
          </Row>
        </Col>
      </Row>

      {!isDetail ? (
        <>
          <Row>
            <Col
              md="7"
              style={{
                justifyContent: "center",
                display: "flex",
                width: "100%",
              }}
            >
              <div
                className="z-0"
                id="carrier-service-active-dates-table"
                style={{ marginTop: -15 }}
              >
                <div id="carrier-active-dates-table" ref={componentToPrintRef}>
                  <div className={`${styles.printTableContainer}`}>
                    <div className={`${styles.tableHeader}`}>
                      <div className={`${styles.showOnPrint}`}>
                        <FormLabel>
                          {moment().format("DD/MM/YYYY HH:mm")}
                        </FormLabel>
                      </div>
                      <Title level={3} data-testid="page-title">
                        Carrier: Active Dates
                      </Title>
                    </div>
                    <div
                      className={`${styles.printWidth} w-full despatch-table`}
                      id="despatch-table"
                    >
                      <ServicesActiveDatesTable
                        rowSelection={false}
                        pagination={false}
                        bordered={false}
                        handleRowClick={handleRowClick}
                        dataSource={data}
                        loading={carrierServicesActiveLoader}
                        setValue={setValue}
                        value={value}
                        CUDDisabled={CUDDisabled}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </>
      ) : (
        <>
          <div
            className="z-0"
            id="active-dates-table"
            ref={componentToPrintRef}
          >
            <div className={`${styles.formatPrint}`}>
              {/* <div className={`${styles.componentToPrint}`}>
                <div className="d-flex flex-column mb-4 align-items-center">
                  <div className=" d-flex justify-end w-100 pr-4 mt-4">
                    <FormLabel>{moment().format("DD/MM/YYYY HH:mm")}</FormLabel>
                  </div>
                </div>
              </div> */}
              <div className="w-full mt-4 despatch-table" id="despatch-table">
                <div style={{ minWidth: "1000px" }}>
                  <Row>
                    <Col
                      md="4"
                      style={{
                        textAlign: "end",
                        marginTop: 5,
                        fontWeight: 600,
                      }}
                    >
                      <Text data-testid="carrier-status">
                        Current Carrier Status for:
                      </Text>
                    </Col>
                    <Col md="8">
                      <Row>
                        <Col
                          md="2"
                          style={{
                            marginTop: 5,
                            fontWeight: 600,
                            whiteSpace: "nowrap",
                          }}
                        >
                          <Text className="me-4">
                            {statusLoader
                              ? "Loading ..."
                              : carrierStatus?.clientCarrier?.name}
                          </Text>
                          <Text
                            className={`${
                              statusLoader
                                ? ""
                                : carrierStatus?.clientCarrier?.active
                                ? styles.blueText
                                : styles.redText
                            }`}
                          >
                            {statusLoader
                              ? ""
                              : carrierStatus?.clientCarrier?.active
                              ? "Active"
                              : "Inactive"}
                          </Text>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <Row className="mt-20">
                    <Col md="4" style={{ textAlign: "end" }}>
                      <Title
                        level={5}
                        className="mr-3"
                        data-testid="edit-secondary-parameters"
                      >
                        Secondary Parameters:
                      </Title>
                    </Col>
                    <Col md="5" style={{ marginTop: 5 }}></Col>
                  </Row>
                  <Row className="mt-2">
                    <Col md="4" style={{ textAlign: "end", marginTop: 5 }}>
                      <Text data-testid="effective-from">
                        Either: Permanently Effective From:
                      </Text>
                    </Col>
                    <Col md="8">
                      <Row>
                        <Col md="2">
                          <DatePicker
                            style={{ borderRadius: 4 }}
                            value={permanentlyDateData}
                            onChange={(e) => {
                              handleDatePicker(e);
                              setOnEdit(true);
                            }}
                            showToday={false}
                            disabled={disablePermanentlyDate}
                            format={dateFormat}
                            disabledDate={(current) => {
                              let customDate = moment().add(0, "days");
                              return (
                                current &&
                                current < moment(customDate, "YYYY-MM-DD")
                              );
                            }}
                          />
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <Row className="mt-3">
                    <Col md="4" style={{ textAlign: "end", marginTop: 5 }}>
                      <Text data-testid="effective-between">
                        Or: Effective Between:
                      </Text>
                    </Col>
                    <Col md="8">
                      <Row>
                        <Col md="3">
                          <RangePicker
                            style={{ borderRadius: 4, width: 250 }}
                            value={
                              effectiveBetweenDateData as RangePickerProps["value"]
                            }
                            format={dateFormat}
                            disabled={disableEffectiveBetweenDate}
                            onChange={(e) => {
                              if (!e) {
                                handleRangePicker(e);
                                setOnEdit(true);
                                return;
                              }

                              if (e) {
                                const [startDate, endDate] = e;

                                if (moment(startDate).isSame(endDate)) {
                                  handleRangePicker([moment(startDate), null]);
                                  Message(
                                    "danger",
                                    "End date must be greater than start date"
                                  );
                                  return;
                                }

                                handleRangePicker(e);
                                setOnEdit(true);
                              }
                            }}
                            disabledDate={(current) => {
                              let customDate = moment().add(0, "days");
                              return (
                                current &&
                                current < moment(customDate, "YYYY-MM-DD")
                              );
                            }}
                          />
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <Row className="mt-3">
                    <Col md="4" style={{ textAlign: "end", marginTop: 7 }}>
                      <Text data-testid="change-status">Change Status</Text>
                    </Col>
                    <Col md="8">
                      <Row>
                        <Col md="2">
                          <Form.Control
                            className={`${
                              statusLoader
                                ? ""
                                : !carrierStatus?.clientCarrier?.active
                                ? styles.blueText
                                : styles.redText
                            }`}
                            name="orderNO"
                            value={
                              statusLoader
                                ? ""
                                : carrierStatus?.clientCarrier?.active
                                ? "Inactive"
                                : "Active"
                            }
                            disabled={true}
                            style={{
                              width: "85%",
                            }}
                          />
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <AmmendCarrierServiceActiveDatesModal
        show={ammendCarrierServiceActiveDatesModalShow}
        onHide={() => setAmmendCarrierServiceActiveDatesModalShow(false)}
      />
    </UserDashboard>
  );
};

export default ServicesActiveDates;
