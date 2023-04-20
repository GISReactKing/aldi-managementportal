import { Button, Typography, DatePicker, Spin } from "antd";
import React, { useState, useEffect, useRef } from "react";
import { Col, Form, Row, FormLabel } from "react-bootstrap";
import styles from "../carrier-active-dates/styles.module.scss";
import moment from "moment";
import { AppButton } from "../../../components/AppButton";
import stylesMain from "../carrier-routing-control.module.scss";
import { useReactToPrint } from "react-to-print";
import {
  fetchCapacityLimits,
  fetchCapacityLimitsList,
  updateCapacityLimits,
  updateCapacityLimitsClear,
  setEffectiveBetweenDates as setEffectiveBetweenDatesRedux,
  setEffectiveDate as setEffectiveDateRedux,
  setPrimaryLimitCube as setPrimaryLimitCubeRedux,
  setLimitCube as setLimitCubeRedux,
  setFormEdit as setFormEditRedux,
  setQtyLimit as setQtyLimitRedux,
} from "../../../redux/slices/carrierCapacitySetupSlice";
import { ComaSeparator } from "../../../utils/ComaSeparator";

import { RootStateOrAny, useDispatch, useSelector } from "react-redux";
import { Message } from "../../../utils/message";
import useAppSelector from "../../../hooks/useAppSelector";
import { RangePickerProps } from "antd/lib/date-picker";
import AppModal from "../../../components/Modal";
import useTheme from "../../../hooks/useTheme";

interface Props {
  detailData: any;
  isEdit: any;
  setIsEdit: any;
  setValue: any;
  setSelectedRow: any;
}

const { Text, Title } = Typography;
const { RangePicker } = DatePicker;
const dateFormat = "DD/MM/YYYY";
const DetailEdit = ({
  detailData,
  setIsEdit,
  setValue,
  setSelectedRow,
  isEdit,
}: Props) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const [valueValidation, setValueValidation] = useState(true);

  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  const {
    primaryLimitCube,
    limitCube,
    effectiveBetweenDates,
    effectiveDate,
    formEdit,
    qtyLimit,
  } = useAppSelector((state) => state.carrierCapacitySetup);

  const setEffectiveDate = (data: moment.Moment | null) =>
    dispatch(setEffectiveDateRedux(data));

  const setEffectiveBetweenDates = (data: (moment.Moment | null)[] | null) =>
    dispatch(setEffectiveBetweenDatesRedux(data));

  const setLimitCube = (data: string | number | null) =>
    dispatch(setLimitCubeRedux(data));

  const setPrimaryLimitCube = (data: string | number | null) =>
    dispatch(setPrimaryLimitCubeRedux(data));

  const setFormEdit = (val: boolean) => dispatch(setFormEditRedux(val));

  const setQtyLimit = (val: (string | null)[]) =>
    dispatch(setQtyLimitRedux(val));

  const [primaryQtyLimit, setPrimaryQtyLimit] = useState<any>([
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ]);

  const capacityLimits = useSelector(
    ({ carrierCapacitySetup }: RootStateOrAny) =>
      carrierCapacitySetup.capacityLimits
  );

  const loader = useSelector(
    ({ carrierCapacitySetup }: RootStateOrAny) => carrierCapacitySetup.loader
  );

  const capacityLimitsLoader = useSelector(
    ({ carrierCapacitySetup }: RootStateOrAny) =>
      carrierCapacitySetup.statusLoader
  );

  const capacityLimitsData = capacityLimits?.capacityLimits;

  const handleCancel = () => {
    setIsEdit(!isEdit);
    setSelectedRow(null);
    setValue(null);
    dispatch(fetchCapacityLimitsList("aldi"));
  };

  const handleEditRow = async () => {
    try {
      const capacityLimitsUpdate: any = {
        carrier: capacityLimitsData?.carrier,
        client: "ALDI",
        primaryParameters: {
          limitCubeM: capacityLimitsData?.primaryParameters?.limitCubeM,
          monday: capacityLimitsData.primaryParameters.monday,
          tuesday: capacityLimitsData.primaryParameters.tuesday,
          wednesday: capacityLimitsData.primaryParameters.wednesday,
          thursday: capacityLimitsData.primaryParameters.thursday,
          friday: capacityLimitsData.primaryParameters.friday,
          saturday: capacityLimitsData.primaryParameters.saturday,
          sunday: capacityLimitsData.primaryParameters.sunday,
        },
        secondaryParameters: {
          limitCubeM: limitCube === "None" ? null : limitCube,
          monday: qtyLimit[0] === "None" ? null : qtyLimit[0],
          tuesday: qtyLimit[1] === "None" ? null : qtyLimit[1],
          wednesday: qtyLimit[2] === "None" ? null : qtyLimit[2],
          thursday: qtyLimit[3] === "None" ? null : qtyLimit[3],
          friday: qtyLimit[4] === "None" ? null : qtyLimit[4],
          saturday: qtyLimit[5] === "None" ? null : qtyLimit[5],
          sunday: qtyLimit[6] === "None" ? null : qtyLimit[6],
        },
      };

      if (effectiveBetweenDates) {
        capacityLimitsUpdate.from = moment(effectiveBetweenDates[0]).format(
          "YYYY-MM-DD"
        );
        capacityLimitsUpdate.to = moment(effectiveBetweenDates[1]).format(
          "YYYY-MM-DD"
        );
      }

      if (effectiveDate) {
        capacityLimitsUpdate.from = moment(effectiveDate).format("YYYY-MM-DD");
      }

      let response;

      if (!effectiveBetweenDates && !effectiveDate) {
        capacityLimitsUpdate.clear = true;
        delete capacityLimitsUpdate.primaryParameters;
        delete capacityLimitsUpdate.secondaryParameters;
        response = await dispatch(
          updateCapacityLimitsClear(capacityLimitsUpdate) as any
        );
      } else {
        response = await dispatch(
          updateCapacityLimits(capacityLimitsUpdate) as any
        );
      }

      if (response.payload.code === 400) {
      } else {
        await dispatch(fetchCapacityLimitsList("aldi") as any);
        setIsEdit(!isEdit);
        setSelectedRow(null);
        setValue(null);
      }
    } catch (error) {}
  };

  const handleOnDelete = async () => {
    const capacityLimitsUpdate = {
      carrier: capacityLimitsData?.carrier,
      client: "ALDI",
      clear: true,
    };

    await dispatch(updateCapacityLimitsClear(capacityLimitsUpdate) as any);
    await dispatch(fetchCapacityLimitsList("aldi") as any);
    setIsEdit(!isEdit);
    setSelectedRow(null);
    setValue(null);
    setShowDeleteModal(false);
  };

  const componentToPrintRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentToPrintRef.current,
  });

  useEffect(() => {
    if (detailData?.carrier) {
      dispatch(
        fetchCapacityLimits({ client: "aldi", carrier: detailData?.carrier })
      );
    }
  }, [detailData]);

  useEffect(() => {
    if (capacityLimitsData) {
      if (capacityLimitsData.secondaryParameters.effectiveFrom) {
        if (!formEdit) {
          setEffectiveDate(
            moment(capacityLimitsData.secondaryParameters.effectiveFrom)
          );
        }
      }
      //  else {
      //   setEffectiveDate(null);
      // }

      if (
        capacityLimitsData.secondaryParameters.effectiveBetween.from ||
        capacityLimitsData.secondaryParameters.effectiveBetween.to
      ) {
        if (!formEdit) {
          setEffectiveBetweenDates([
            moment(
              capacityLimitsData.secondaryParameters.effectiveBetween.from
            ),
            moment(capacityLimitsData.secondaryParameters.effectiveBetween.to),
          ]);
        }
      }
      // else {
      //   setEffectiveBetweenDates(null);
      // }
      if (capacityLimitsData.secondaryParameters.limitCubeM === null) {
        setLimitCube("None");
      } else {
        setLimitCube(capacityLimitsData.secondaryParameters.limitCubeM);
      }

      if (capacityLimitsData.primaryParameters.limitCubeM === null) {
        setPrimaryLimitCube("None");
      } else {
        setPrimaryLimitCube(capacityLimitsData.primaryParameters.limitCubeM);
      }

      const secondaryParametersDays = [
        capacityLimitsData.secondaryParameters.monday === null
          ? "None"
          : capacityLimitsData.secondaryParameters.monday,
        capacityLimitsData.secondaryParameters.tuesday === null
          ? "None"
          : capacityLimitsData.secondaryParameters.tuesday,
        capacityLimitsData.secondaryParameters.wednesday === null
          ? "None"
          : capacityLimitsData.secondaryParameters.wednesday,
        capacityLimitsData.secondaryParameters.thursday === null
          ? "None"
          : capacityLimitsData.secondaryParameters.thursday,
        capacityLimitsData.secondaryParameters.friday === null
          ? "None"
          : capacityLimitsData.secondaryParameters.friday,
        capacityLimitsData.secondaryParameters.saturday === null
          ? "None"
          : capacityLimitsData.secondaryParameters.saturday,
        capacityLimitsData.secondaryParameters.sunday === null
          ? "None"
          : capacityLimitsData.secondaryParameters.sunday,
      ];
      if (!formEdit) {
        setQtyLimit(secondaryParametersDays);
      }

      const primaryParametersDays = [
        capacityLimitsData.primaryParameters.monday === null
          ? "None"
          : capacityLimitsData.primaryParameters.monday,
        capacityLimitsData.primaryParameters.tuesday === null
          ? "None"
          : capacityLimitsData.primaryParameters.tuesday,
        capacityLimitsData.primaryParameters.wednesday === null
          ? "None"
          : capacityLimitsData.primaryParameters.wednesday,
        capacityLimitsData.primaryParameters.thursday === null
          ? "None"
          : capacityLimitsData.primaryParameters.thursday,
        capacityLimitsData.primaryParameters.friday === null
          ? "None"
          : capacityLimitsData.primaryParameters.friday,
        capacityLimitsData.primaryParameters.saturday === null
          ? "None"
          : capacityLimitsData.primaryParameters.saturday,
        capacityLimitsData.primaryParameters.sunday === null
          ? "None"
          : capacityLimitsData.primaryParameters.sunday,
      ];
      setPrimaryQtyLimit(primaryParametersDays);
    }
  }, [capacityLimits]);

  const handleRangePicker = (e: any) => {
    if (!e || e.length < 2) {
      setEffectiveBetweenDates(null);
      return;
    }
    setEffectiveBetweenDates(e);
  };

  useEffect(() => {
    if (effectiveDate || effectiveBetweenDates) {
      if (
        formEdit &&
        (Number(limitCube) >= 0 ||
          qtyLimit?.filter((x: any) => Number(x) >= 0).length) &&
        // (effectiveDate || effectiveBetweenDates) &&
        !loader &&
        limitCube !== "" &&
        !qtyLimit?.filter((x: any) => x === "").length
      ) {
        setValueValidation(false);
        return;
      }
      setValueValidation(true);
    }
  }, [limitCube, formEdit, qtyLimit, loader]);

  useEffect(() => {
    if (!effectiveDate && !effectiveBetweenDates?.[1]) {
      setLimitCube("None");
      setQtyLimit(["None", "None", "None", "None", "None", "None", "None"]);
    }
  }, [effectiveDate, effectiveBetweenDates]);

  useEffect(() => {
    setValueValidation(true);
  }, []);

  return (
    <>
      {loader ? (
        <div className="absolute w-full flex justify-center mt-9">
          <Spin size="large" />
        </div>
      ) : null}
      <AppButton
        className={`xsm:w-28 xsm:h-9 lg:w-30 lg:h-10 font-bold tracking-wide mt-5 position-absolute top-1  ${stylesMain.buttonInHeader}`}
        title="Delete Parameters"
        style={{ borderRadius: "4px", right: "420px", width: "150px" }}
        // disabled={valueValidation}
        loading={loader || capacityLimitsLoader}
        onClick={() => setShowDeleteModal(true)}
      />
      <AppModal
        primaryBtnTitle="Delete"
        showModal={showDeleteModal}
        onCloseModal={setShowDeleteModal}
        onPrimaryHandle={handleOnDelete}
        loading={loader || capacityLimitsLoader}
      >
        <h1
          style={{ color: theme?.monoLabel }}
          className="text-center text-xmd"
        >
          Delete Parameters
        </h1>
        <p
          style={{ color: theme?.mono }}
          className="mt-3 mb-3 text-center max-w-19 px-1 text-xsm leading-5"
        >
          Are you sure you want to delete the parameters?
        </p>
      </AppModal>
      <AppButton
        className={`xsm:w-28 xsm:h-9 lg:w-30 lg:h-10 font-bold tracking-wide mt-5 position-absolute top-1  ${stylesMain.buttonInHeader}`}
        title="Save"
        style={{ borderRadius: "4px", right: "285px" }}
        disabled={valueValidation}
        loading={loader || capacityLimitsLoader}
        onClick={handleEditRow}
      />
      <AppButton
        className={`xsm:w-28 xsm:h-9 lg:w-30 lg:h-10 font-bold tracking-wide mt-5 position-absolute top-1  ${stylesMain.buttonInHeader}`}
        title="Cancel"
        style={{ borderRadius: "4px", right: "150px" }}
        onClick={handleCancel}
      />
      <AppButton
        className={`xsm:w-28 xsm:h-9 lg:w-30 lg:h-10 font-bold tracking-wide mt-5 position-absolute top-1 right-4  ${stylesMain.buttonInHeader}`}
        title="Print"
        style={{ borderRadius: "4px" }}
        onClick={handlePrint}
      />

      <div
        className="z-0 mt-1"
        id="active-dates-table"
        ref={componentToPrintRef}
      >
        <div
          className={`${stylesMain.formatPrintWidth}`}
          style={{
            width: "1500px",
            height: "100%",
          }}
        >
          <div className={`${stylesMain.componentToPrint}`}>
            <div className="d-flex flex-column mb-4 align-items-center">
              <div className=" d-flex justify-end w-100 pr-4 mt-4">
                <FormLabel>{moment().format("DD/MM/YYYY HH:mm")}</FormLabel>
              </div>
              <Title level={3}>Carrier Capacity Setup</Title>
            </div>
          </div>
          <div
            className="z-0 mt-2"
            id="carrier-capacity-setup-table"
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div className={`${styles.formatPrintContainer}`}>
              <div className="d-flex mb-5" style={{ whiteSpace: "nowrap" }}>
                <div style={{ minWidth: "276px" }}>
                  <div className="text-left fw-bold ">
                    <Text>Capacity Parameters for:</Text>
                    <Text className="ml-4">
                      {!capacityLimitsLoader ? (
                        <>
                          {capacityLimitsData?.carrierName
                            ? capacityLimitsData?.carrierName
                            : ""}
                        </>
                      ) : (
                        "Loading..."
                      )}
                    </Text>
                  </div>
                </div>
                <div style={{ width: "450px" }}></div>
                <div className="d-flex" style={{ minWidth: "600px" }}>
                  <div className="mt-4 mr-5">
                    <div className=" mr-3 mb-2">
                      <Text className="mb-0">
                        Either: Permanently Effective From:
                      </Text>
                    </div>
                    <div>
                      <Row>
                        <Col md="2">
                          <DatePicker
                            style={{ borderRadius: 4, width: "150px" }}
                            value={!capacityLimitsLoader ? effectiveDate : null}
                            showToday={false}
                            onChange={(e: any) => {
                              setEffectiveDate(e);
                              setFormEdit(true);
                            }}
                            disabled={
                              !!(
                                effectiveBetweenDates &&
                                effectiveBetweenDates.length
                              )
                            }
                            disabledDate={(current) => {
                              let customDate = moment().add(0, "days");
                              return (
                                current &&
                                current < moment(customDate, "YYYY-MM-DD")
                              );
                            }}
                            format={dateFormat}
                          />
                        </Col>
                      </Row>
                    </div>
                  </div>

                  <div className="mt-4 ">
                    <div>
                      <div className=" mb-2">
                        <Text className="mb-0">Or: Effective Between:</Text>
                      </div>
                      <Col>
                        <Row>
                          <Col md="4">
                            <RangePicker
                              style={{ borderRadius: 4, width: "250px" }}
                              value={
                                (!capacityLimitsLoader
                                  ? effectiveBetweenDates
                                  : null) as RangePickerProps["value"]
                              }
                              format={dateFormat}
                              disabled={!!effectiveDate}
                              onChange={(e: any) => {
                                if (!e) {
                                  handleRangePicker(e);
                                  setFormEdit(true);
                                  return;
                                }

                                if (e) {
                                  const [startDate, endDate] = e;

                                  if (moment(startDate).isSame(endDate)) {
                                    handleRangePicker([startDate, null]);
                                    Message(
                                      "danger",
                                      "End date must be greater than start date"
                                    );
                                    return;
                                  }

                                  handleRangePicker(e);
                                  setFormEdit(true);
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
                    </div>
                  </div>
                </div>
              </div>

              <div className="d-flex" style={{ whiteSpace: "nowrap" }}>
                {/* <div
                  className="d-flex align-items-end justify-content-end"
                  style={{ minWidth: "276px" }}
                >
                  <div className="d-flex flex-column text-right">
                    <div style={{ marginBottom: 42, marginRight: 8 }}>
                      <Text>Either: Volume Limit (Cubic Meters):</Text>
                    </div>

                    <div className="text-end mr-2 mb-1">
                      <Text>Or: Daily Parcel Qty Limit:</Text>
                    </div>
                  </div>
                </div> */}
                <div className="d-flex flex-column" style={{ width: "730px" }}>
                  <div className="mb-4">
                    <Text className="fw-bold md-3">Primary Parameters:</Text>
                  </div>

                  <div className="align-self-end">
                    <Row className="mt-2">
                      <div style={{ marginBottom: 5, marginRight: 8 }}>
                        <Text>Either: Volume Limit (Cubic Meters):</Text>
                      </div>
                      <Col>
                        <Form.Control
                          style={{
                            fontSize: 14,
                            textAlign: "center",
                            width: "80px",
                          }}
                          name="length"
                          value={
                            !capacityLimitsLoader ? primaryLimitCube || "" : ""
                          }
                          readOnly
                          className="p-0"
                          onChange={({ target }) => {}}
                          disabled
                        />
                      </Col>
                    </Row>
                    <Row className="mt-2">
                      <Col lg="2" md="1"></Col>
                      <div>
                        <Text>Or: Daily Parcel Qty Limit:</Text>
                      </div>
                      <Col>
                        <table>
                          <tr
                            style={{ borderBottom: "1px solid #111" }}
                            className="mb-2"
                          >
                            <td>Mon:</td>
                            <td>Tue:</td>
                            <td>Wed:</td>
                            <td>Thu:</td>
                            <td>Fri:</td>
                            <td>Sat:</td>
                            <td>Sun:</td>
                          </tr>
                          <tr>
                            {primaryQtyLimit
                              ? primaryQtyLimit.map(
                                  (value: any, index: number) => (
                                    <td key={index}>
                                      <Form.Control
                                        style={{
                                          fontSize: 14,
                                          textAlign: "center",
                                          width: "80px",
                                        }}
                                        name="length"
                                        value={
                                          !capacityLimitsLoader ? value : ""
                                        }
                                        readOnly
                                        className="mt-2 p-0"
                                        onChange={({ target }) => {
                                          console.log(target);
                                        }}
                                        disabled
                                      />
                                    </td>
                                  )
                                )
                              : null}
                          </tr>
                        </table>
                      </Col>
                    </Row>
                  </div>
                </div>
                <div style={{ minWidth: "450px" }}>
                  <div style={{ marginBottom: "31px" }}>
                    <Text className=" fw-bold">Secondary Parameters:</Text>
                  </div>
                  <Row className="mt-2">
                    <div style={{ paddingBottom: 27, marginRight: 8 }}></div>
                    <Col md="7">
                      <div className="d-flex">
                        <Form.Control
                          style={{
                            fontSize: 14,
                            textAlign: "center",
                            width: "80px",
                          }}
                          name="length"
                          value={
                            !capacityLimitsLoader
                              ? ComaSeparator(limitCube || "")
                              : ""
                          }
                          className="p-0"
                          disabled={
                            !!qtyLimit.filter((x: any) => x >= 0).length ||
                            (!effectiveDate && !effectiveBetweenDates)
                          }
                          onChange={({ target }) => {
                            let value = target.value.replace(/,/g, "");

                            const leadingDecimal = value.indexOf(".") === 0;
                            const decimalPosition = value.indexOf(".");
                            const lastIndexOfDecimal = value.lastIndexOf(".");
                            const minusSymbolAdded = value.indexOf("-");

                            if (decimalPosition > -1)
                              value = value.substring(0, value.length - 1);

                            if (Number.isNaN(Number(value))) value = "";

                            if (minusSymbolAdded > -1)
                              value = value.substring(0, minusSymbolAdded);

                            if (leadingDecimal) value = "0.";

                            if (
                              decimalPosition > -1 &&
                              lastIndexOfDecimal > decimalPosition
                            )
                              value = value.slice(0, lastIndexOfDecimal);

                            if (decimalPosition > -1)
                              value = value.slice(0, decimalPosition + 3);

                            if (decimalPosition > -1)
                              value = value.substring(0, value.length - 1);

                            setFormEdit(true);
                            setLimitCube(value);
                          }}
                        />
                        <Button
                          size="small"
                          className={`${styles.buttonInPicker} tracking-wide ml-5`}
                          type="primary"
                          onClick={() => {
                            setLimitCube("None");
                          }}
                        >
                          Clear
                        </Button>
                      </div>
                    </Col>
                  </Row>
                  <Row className="mt-2 d-wr">
                    <Col lg="2" md="1"></Col>
                    <div style={{ paddingBottom: 20, marginRight: 8 }}></div>
                    <Col className="d-flex">
                      <table>
                        <tr
                          style={{ borderBottom: "1px solid #111" }}
                          className="mb-2"
                        >
                          <td>Mon:</td>
                          <td>Tue:</td>
                          <td>Wed:</td>
                          <td>Thu:</td>
                          <td>Fri:</td>
                          <td>Sat:</td>
                          <td>Sun:</td>
                        </tr>
                        <tr>
                          {qtyLimit.map((value: any, index: number) => (
                            <td key={index}>
                              <Form.Control
                                style={{
                                  fontSize: 14,
                                  textAlign: "center",
                                  width: "80px",
                                }}
                                name="length"
                                value={
                                  !capacityLimitsLoader
                                    ? ComaSeparator(value)
                                    : ""
                                }
                                className="mt-2 p-0"
                                disabled={
                                  Number(limitCube) >= 0 ||
                                  (!effectiveDate && !effectiveBetweenDates)
                                }
                                onChange={({ target }) => {
                                  let value = target.value.replace(/,/g, "");

                                  const leadingDecimal =
                                    value.indexOf(".") === 0;
                                  const decimalPosition = value.indexOf(".");
                                  const lastIndexOfDecimal =
                                    value.lastIndexOf(".");
                                  const minusSymbolAdded = value.indexOf("-");

                                  if (decimalPosition > -1)
                                    value = value.substring(
                                      0,
                                      value.length - 1
                                    );

                                  if (Number.isNaN(Number(value))) value = "";

                                  if (minusSymbolAdded > -1)
                                    value = value.substring(
                                      0,
                                      minusSymbolAdded
                                    );

                                  if (leadingDecimal) value = "0.";

                                  if (
                                    decimalPosition > -1 &&
                                    lastIndexOfDecimal > decimalPosition
                                  )
                                    value = value.slice(0, lastIndexOfDecimal);

                                  if (decimalPosition > -1)
                                    value = value.slice(0, decimalPosition + 3);

                                  if (decimalPosition > -1)
                                    value = value.substring(
                                      0,
                                      value.length - 1
                                    );

                                  let tmp = [...qtyLimit];
                                  tmp[index] = value;
                                  setQtyLimit(tmp);
                                  setFormEdit(true);
                                }}
                              />
                            </td>
                          ))}
                        </tr>
                      </table>
                      <Button
                        size="small"
                        className={`${styles.buttonInPicker} tracking-wide ml-5 self-end`}
                        type="primary"
                        onClick={() => {
                          setQtyLimit([
                            "None",
                            "None",
                            "None",
                            "None",
                            "None",
                            "None",
                            "None",
                          ]);
                        }}
                      >
                        Clear
                      </Button>
                    </Col>
                  </Row>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DetailEdit;
