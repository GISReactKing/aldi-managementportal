import { DatePicker, Button, Typography } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { AppButton } from "../../../components/AppButton";
import moment from "moment";
import { useReactToPrint } from "react-to-print";
import stylesMain from "../carrier-routing-control.module.scss";
import { Col, Form, Row, FormLabel } from "react-bootstrap";

import { RootStateOrAny, useDispatch, useSelector } from "react-redux";
import { isEmpty, isNumber, sortBy } from "lodash";
import {
  fetchAllServices,
  fetchCarrierServices,
  fetchParcelLimitMethod,
  updateParcelLimits,
  setQtyLimitData,
  setFormEditing,
  setEffectiveDate,
  setEffectiveBetweenDates,
  clearParcelLimits,
} from "../../../redux/slices/CarrierParcelLimitsSlice";
import { Message } from "../../../utils/message";
import AppModal from "../../../components/Modal";
import { generateId } from "../../../utils/helpers";
import { CarrierParcelLimitData } from "../../../interfaces/carrierParcelLimits";
import useTheme from "../../../hooks/useTheme";

const { RangePicker } = DatePicker;
const { Text, Title } = Typography;
const dateFormat = "DD/MM/YYYY";

export interface CarrierParcelLimit {
  Carrier: string;
  Active: string;
  DespatchMethod: string;
  DespatchService: string;
  Length: number;
  Volume: number;
  Parcels: number;
  ParcelKG: number;
  ConsignmentKG: number;
  secondaryParameter: string;
}
interface EditViewProps {
  selectedData: CarrierParcelLimit;
  setPageType: any;
  onGoBack?: any;
  detailData: any;
  unCheckTableRow: any;
  setLocation: any;
  allCarrierRecords: any;
  selectedCarrier: any;
  setMergedData: any;
  setAllCarrierServiceData: any;
  setExportData: any;
}

const DetailEdit = ({
  selectedData,
  setPageType,
  detailData,
  unCheckTableRow,
  onGoBack,
  setLocation,
  allCarrierRecords,
  selectedCarrier,
  setAllCarrierServiceData,
  setMergedData,
  setExportData,
}: EditViewProps) => {
  const theme = useTheme();
  const [limitCube, setLimitCube] = useState<any>();

  const [onFormSubmit, setOnFormSubmit] = useState(false);
  const [hasInvalidInput, setHasInvalidInput] = useState(false);

  const carrierParcelLimitsStates = useSelector(
    ({ carrierParcelLimits }: RootStateOrAny) => carrierParcelLimits
  );

  const qtyLimit = carrierParcelLimitsStates?.qtyLimit;
  const formEdit = carrierParcelLimitsStates?.formEdit;
  const methodLoader = carrierParcelLimitsStates?.methodLoader;
  const statusLoader = carrierParcelLimitsStates?.statusLoader;
  const serviceLoader = carrierParcelLimitsStates?.serviceLoader;
  const loader = carrierParcelLimitsStates?.loader;
  const capacityLimitsLoader = carrierParcelLimitsStates?.capacityLimitsLoader;
  const effectiveDate = carrierParcelLimitsStates?.effectiveDate;
  const effectiveBetweenDates =
    carrierParcelLimitsStates?.effectiveBetweenDates;

  const setQtyLimit = (val: string[] | null[]) =>
    dispatch(setQtyLimitData(val));

  const setFormEdit = (val: boolean) => dispatch(setFormEditing(val));

  const setEffectiveDateFunc = (val: any) => dispatch(setEffectiveDate(val));

  const setEffectiveBetweenDatesFunc = (val: any) =>
    dispatch(setEffectiveBetweenDates(val));

  useEffect(() => {
    console.log({ Id: detailData?.Id });
    dispatch(fetchParcelLimitMethod(detailData?.Id));
  }, [detailData?.Id]);

  const carrierParcelLimit = useSelector(
    ({ carrierParcelLimits }: RootStateOrAny) =>
      carrierParcelLimits?.carrierParcelLimit
  );

  const allServices = useSelector(
    ({ carrierParcelLimits }: RootStateOrAny) =>
      carrierParcelLimits?.allServices
  );

  const services = useSelector(
    ({ carrierParcelLimits }: RootStateOrAny) => carrierParcelLimits?.services
  );

  useEffect(() => {
    if (onFormSubmit && allCarrierRecords) {
      if (allServices) {
        const servicesDate = allServices?.data?.map((i: any) => {
          return i;
        });
        const carrierParcelLimitListDataNew = servicesDate?.map(
          (carrierParcel: any) => {
            return carrierParcel?.ClientDespatchMethods?.map(
              (parcel: any, index: any) => {
                const secondaryParameter = parcel.LimitsInfo.LimitList?.filter(
                  (x: any) => x.SecondaryMaxValue != null
                ).length;
                return {
                  id: generateId(),
                  clientMethodID: parcel.Id,
                  carrier: parcel.CarrierDescription,
                  active: carrierParcel.CarrierActive,
                  activeExport:
                    carrierParcel.CarrierActive === true ? "Y" : "N",
                  despatchMethod: parcel.Description,
                  despatchService: carrierParcel.Description,
                  name: carrierParcel.Name,
                  length: parcel.LimitsInfo.LimitList[0]?.MaxValue,
                  volume: parcel.LimitsInfo.LimitList[1]?.MaxValue,
                  parcels: parcel.LimitsInfo.LimitList[2]?.MaxValue,
                  parcelKG: parcel.LimitsInfo.LimitList[3]?.MaxValue,
                  consignmentKG: parcel.LimitsInfo.LimitList[4]?.MaxValue,

                  secondaryPermanentDateFrom: parcel.LimitsInfo
                    .PermanentSecondaryDateFrom
                    ? moment(
                        parcel.LimitsInfo.PermanentSecondaryDateFrom
                      ).format("DD/MM/YYYY")
                    : "",

                  secondaryTempDateFrom: parcel.LimitsInfo.SecondaryDateFrom
                    ? moment(parcel.LimitsInfo.SecondaryDateFrom).format(
                        "DD/MM/YYYY"
                      )
                    : "",

                  secondaryTempDateTo: parcel.LimitsInfo.SecondaryDateTo
                    ? moment(parcel.LimitsInfo.SecondaryDateTo).format(
                        "DD/MM/YYYY"
                      )
                    : "",

                  secondaryLength:
                    parcel.LimitsInfo.LimitList[0]?.SecondaryMaxValue,
                  secondaryVolume:
                    parcel.LimitsInfo.LimitList[1]?.SecondaryMaxValue,
                  secondaryParcels:
                    parcel.LimitsInfo.LimitList[2]?.SecondaryMaxValue,
                  secondaryParcelKg:
                    parcel.LimitsInfo.LimitList[3]?.SecondaryMaxValue,
                  secondaryConsignmentKg:
                    parcel.LimitsInfo.LimitList[4]?.SecondaryMaxValue,
                  secondaryParameter: secondaryParameter ? "Y" : "N",
                  entireParcel: {
                    ...parcel,
                    despatchService: carrierParcel.Description,
                    name: carrierParcel.Name,
                  },
                };
              }
            );
          }
        );

        const allCarrierService: any = [];

        carrierParcelLimitListDataNew?.forEach((i: any) =>
          allCarrierService.push(...i)
        );

        const ids = allCarrierService.map((i: any) => i.despatchMethod);
        const allCarrierServiceNew = allCarrierService.filter(
          ({ despatchMethod }: any, index: any) =>
            !ids.includes(despatchMethod, index + 1)
        );

        const sortedAllCarrierService = sortBy(allCarrierServiceNew, [
          "carrier",
          "despatchMethod",
        ]);

        // setExportData(sortedAllCarrierService);

        setAllCarrierServiceData([
          sortedAllCarrierService,
        ] as unknown as CarrierParcelLimitData[]);

        setOnFormSubmit(false);
        setLocation("datailEditBack");
        // setPageType("filter");
        onGoBack();
      }
    }
  }, [onFormSubmit]);

  useEffect(() => {
    if (onFormSubmit && !allCarrierRecords) {
      if (services) {
        const servicesDate = services?.data?.map((i: any) => {
          return i;
        });
        const carrierParcelLimitListDataNew = servicesDate?.map(
          (carrierParcel: any) => {
            return carrierParcel?.ClientDespatchMethods?.map(
              (parcel: any, index: any) => {
                const secondaryParameter = parcel.LimitsInfo.LimitList?.filter(
                  (x: any) => x.SecondaryMaxValue != null
                ).length;
                return {
                  id: generateId(),
                  clientMethodID: parcel.Id,
                  carrier: parcel.CarrierDescription,
                  active: carrierParcel.CarrierActive,
                  despatchMethod: parcel.Description,
                  despatchService: carrierParcel.Description,
                  name: carrierParcel.Name,
                  length: parcel.LimitsInfo.LimitList[0]?.MaxValue,
                  volume: parcel.LimitsInfo.LimitList[1]?.MaxValue,
                  parcels: parcel.LimitsInfo.LimitList[2]?.MaxValue,
                  parcelKG: parcel.LimitsInfo.LimitList[3]?.MaxValue,
                  consignmentKG: parcel.LimitsInfo.LimitList[4]?.MaxValue,
                  secondaryParameter: secondaryParameter ? "Y" : "N",
                  entireParcel: {
                    ...parcel,
                    despatchService: carrierParcel.Description,
                    name: carrierParcel.Name,
                  },
                };
              }
            );
          }
        );

        const merged: any = [];

        carrierParcelLimitListDataNew.forEach((i: any) => merged.push(...i));

        const ids = merged.map((i: any) => i.despatchMethod);
        const mergedNew = merged.filter(
          ({ despatchMethod }: any, index: any) =>
            !ids.includes(despatchMethod, index + 1)
        );

        const sortedMergedCarrierService = sortBy(mergedNew, [
          "carrier",
          "despatchMethod",
        ]);

        setMergedData([
          sortedMergedCarrierService,
        ] as unknown as CarrierParcelLimitData[]);

        setOnFormSubmit(false);
        setLocation("datailEditBack");
        onGoBack();
      }
    }
  }, [onFormSubmit]);

  const [valueValidation, setValueValidation] = useState(true);

  const dispatch = useDispatch();

  const [primaryQtyLimit, setPrimaryQtyLimit] = useState<any>([
    null,
    null,
    null,
    null,
    null,
  ]);

  const [dateValidation, setDateValidation] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  // const capacityLimitsData = detailData?.LimitsInfo;
  const capacityLimitsData = carrierParcelLimit?.data?.ServiceLimits;

  const onDeleteHandle = async () => {
    try {
      await dispatch(
        clearParcelLimits({
          methodId: detailData?.Id,
          parcelLimit: capacityLimitsData,
        }) as any
      );

      if (allCarrierRecords) await dispatch(fetchAllServices() as any);

      if (!allCarrierRecords) {
        await dispatch(fetchCarrierServices(selectedCarrier) as any);
        // await dispatch(fetchAllServices());
      }

      setLocation("datailEditBack");
      onGoBack();
    } catch (error) {}
  };

  async function handleOnSave() {
    const carrierParcelLimitUpdate = { ...capacityLimitsData };

    if (effectiveDate) {
      carrierParcelLimitUpdate.PermanentDateFrom =
        effectiveDate.format("YYYY-MM-DD");

      carrierParcelLimitUpdate.SecondaryDateFrom = null;
      carrierParcelLimitUpdate.SecondaryDateTo = null;
    }

    if (effectiveBetweenDates) {
      carrierParcelLimitUpdate.SecondaryDateFrom =
        effectiveBetweenDates[0].format("YYYY-MM-DD");

      carrierParcelLimitUpdate.SecondaryDateTo =
        effectiveBetweenDates[1].format("YYYY-MM-DD");

      carrierParcelLimitUpdate.PermanentDateFrom = null;
    }

    const currentLimits = carrierParcelLimitUpdate?.LimitList;

    const LimitList = currentLimits.map((obj: any, index: any) => {
      const num2 = qtyLimit[index];
      const item = Number(num2);
      return isNumber(item) ? { ...obj, SecondaryMaxValue: item } : obj;
    });

    carrierParcelLimitUpdate.LimitList = LimitList;

    await dispatch(
      updateParcelLimits({
        methodId: detailData?.Id,
        parcelLimit: carrierParcelLimitUpdate,
      }) as any
    );

    if (allCarrierRecords) await dispatch(fetchAllServices() as any);

    if (!allCarrierRecords) {
      await dispatch(fetchCarrierServices(selectedCarrier) as any);
    }

    setOnFormSubmit(true);
  }

  useEffect(() => {
    if (
      formEdit &&
      !qtyLimit?.filter((x: any) => Number(x) <= 0).length &&
      !qtyLimit?.filter((x: any) => !(Boolean(Number(`${x}`)) || x === "None"))
        .length &&
      !methodLoader &&
      !qtyLimit?.filter((x: any) => x === "").length &&
      (qtyLimit?.[0] === "None"
        ? true
        : Number.isInteger(Number(qtyLimit?.[0])) && qtyLimit?.[2] === "None"
        ? true
        : Number.isInteger(Number(qtyLimit?.[2]))) &&
      !(
        (effectiveDate || effectiveBetweenDates?.[1]) &&
        qtyLimit?.filter((x: any) => x === "None" || x === undefined).length ===
          5
      )
    ) {
      setValueValidation(false);
      return;
    }
    setValueValidation(true);
  }, [effectiveDate, effectiveBetweenDates, formEdit, qtyLimit, methodLoader]);

  useEffect(() => {
    if (effectiveDate) setEffectiveBetweenDatesFunc(null);
    if (effectiveBetweenDates?.[1]) setEffectiveDateFunc(null);
  }, [effectiveDate, effectiveBetweenDates]);

  useEffect(() => {
    if (capacityLimitsData?.PermanentSecondaryDateFrom) {
      if (
        moment(capacityLimitsData?.PermanentSecondaryDateFrom).isSameOrBefore()
      ) {
        setDateValidation(true);
      } else {
        setDateValidation(false);
      }
      if (!formEdit) {
        setEffectiveDateFunc(
          moment(capacityLimitsData?.PermanentSecondaryDateFrom)
        );
      }
    }

    if (
      capacityLimitsData?.SecondaryDateFrom ||
      capacityLimitsData?.SecondaryDateTo
    ) {
      if (moment(capacityLimitsData?.SecondaryDateFrom).isSameOrBefore()) {
        setDateValidation(true);
      } else {
        setDateValidation(false);
      }
      if (!formEdit) {
        setEffectiveBetweenDatesFunc([
          moment(capacityLimitsData?.SecondaryDateFrom),
          moment(capacityLimitsData?.SecondaryDateTo),
        ]);
      }
    }

    const secondaryParametersDays = [
      capacityLimitsData?.LimitList[0]?.SecondaryMaxValue === null
        ? "None"
        : capacityLimitsData?.LimitList[0]?.SecondaryMaxValue,
      capacityLimitsData?.LimitList[1]?.SecondaryMaxValue === null
        ? "None"
        : capacityLimitsData?.LimitList[1]?.SecondaryMaxValue,
      capacityLimitsData?.LimitList[2]?.SecondaryMaxValue === null
        ? "None"
        : capacityLimitsData?.LimitList[2]?.SecondaryMaxValue,
      capacityLimitsData?.LimitList[3]?.SecondaryMaxValue === null
        ? "None"
        : capacityLimitsData?.LimitList[3]?.SecondaryMaxValue,
      capacityLimitsData?.LimitList[4]?.SecondaryMaxValue === null
        ? "None"
        : capacityLimitsData?.LimitList[4]?.SecondaryMaxValue,
    ];

    console.log({ secondaryParametersDays });
    if (!formEdit) {
      setQtyLimit(secondaryParametersDays);
    }

    const primaryParametersDays = [
      capacityLimitsData?.LimitList[0]?.MaxValue === null
        ? "None"
        : capacityLimitsData?.LimitList[0]?.MaxValue,
      capacityLimitsData?.LimitList[1]?.MaxValue === null
        ? "None"
        : capacityLimitsData?.LimitList[1]?.MaxValue,
      capacityLimitsData?.LimitList[2]?.MaxValue === null
        ? "None"
        : capacityLimitsData?.LimitList[2]?.MaxValue,
      capacityLimitsData?.LimitList[3]?.MaxValue === null
        ? "None"
        : capacityLimitsData?.LimitList[3]?.MaxValue,
      capacityLimitsData?.LimitList[4]?.MaxValue === null
        ? "None"
        : capacityLimitsData?.LimitList[4]?.MaxValue,
    ];

    setPrimaryQtyLimit(primaryParametersDays);
  }, [carrierParcelLimit]);

  const componentToPrintRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentToPrintRef.current,
  });

  const handleRangePicker = (e: any) => {
    if (!e || e.length < 2) {
      setEffectiveBetweenDatesFunc(null);
      return;
    }
    setEffectiveBetweenDatesFunc(e);
  };

  const cancelFunc = () => {
    setFormEdit(false);
    setQtyLimit([null, null, null, null, null]);
    setEffectiveDateFunc(null);
    setEffectiveBetweenDatesFunc(null);
    unCheckTableRow();

    setLocation("filter");
    setPageType("detail");
    onGoBack();
  };

  return (
    <div>
      <div>
        <div className="flex flex-row items-center space-x-2 justify-end mt-2 ">
          <AppButton
            className={`xsm:w-28 xsm:h-9 lg:w-30 lg:h-10 font-bold tracking-wide mt-5 position-absolute top-1 z-50 ${stylesMain.buttonInHeader}`}
            title="Delete Parameters"
            style={{
              borderRadius: "4px",
              right: "420px",
              paddingLeft: 10,
              paddingRight: 10,
              width: 150,
            }}
            disabled={
              isEmpty(capacityLimitsData?.LimitList) ||
              methodLoader ||
              capacityLimitsLoader ||
              dateValidation ||
              loader ||
              serviceLoader
            }
            onClick={() => setShowDeleteModal(true)}
            loading={
              methodLoader || capacityLimitsLoader || loader || serviceLoader
            }
          />
          <AppButton
            className="xsm:w-28 xsm:h-9 lg:w-30 lg:h-10 font-bold tracking-wide mt-5 position-absolute top-1 z-50"
            title="Save"
            style={{ right: "285px" }}
            disabled={
              valueValidation ||
              (!effectiveDate && !effectiveBetweenDates?.[1]) ||
              methodLoader ||
              capacityLimitsLoader ||
              loader ||
              serviceLoader
            }
            loading={
              methodLoader || capacityLimitsLoader || loader || serviceLoader
            }
            onClick={handleOnSave}
          />
          <AppButton
            className="xsm:w-28 xsm:h-9 lg:w-30 lg:h-10 font-bold tracking-wide mt-5 position-absolute top-1 z-50"
            title="Cancel"
            style={{ right: "150px" }}
            onClick={cancelFunc}
            disabled={
              methodLoader || capacityLimitsLoader || loader || serviceLoader
            }
            loading={
              methodLoader || capacityLimitsLoader || loader || serviceLoader
            }
          />
          <AppButton
            className="xsm:w-28 xsm:h-9 lg:w-30 lg:h-10 font-bold tracking-wide mt-5 position-absolute top-1 z-50 right-4"
            title="Print"
            onClick={handlePrint}
            disabled={
              methodLoader || capacityLimitsLoader || loader || serviceLoader
            }
            loading={
              methodLoader || capacityLimitsLoader || loader || serviceLoader
            }
          />
        </div>
      </div>

      <AppModal
        primaryBtnTitle="Delete"
        showModal={showDeleteModal}
        onCloseModal={setShowDeleteModal}
        onPrimaryHandle={() => onDeleteHandle()}
        loading={
          statusLoader ||
          methodLoader ||
          capacityLimitsLoader ||
          loader ||
          serviceLoader
        }
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

      <div className="z-0" id="active-dates-table" ref={componentToPrintRef}>
        <div className={`${stylesMain.formatPrintWidth}`}>
          <div className={`${stylesMain.componentToPrint}`}>
            <div className="d-flex flex-column mb-4 align-items-center items-center">
              <div className=" d-flex justify-end w-100 pr-4 mt-4">
                <FormLabel>{moment().format("DD/MM/YYYY HH:mm")}</FormLabel>
              </div>
              <Title level={3}>Carrier Parcel Limits</Title>
            </div>
          </div>
          <div
            className="z-0 mt-2"
            id="carrier-capacity-setup-table"
            style={{
              display: "flex",
              justifyContent: "center",
              height: "100%",
            }}
          >
            <div
              className={`${stylesMain.formatPrintContainer}`}
              style={{
                position: "relative",
                width: "100%",
                height: "100%",
              }}
            >
              <div
                className="d-flex mb-5 text-right"
                style={{ whiteSpace: "nowrap" }}
              >
                <div className="text-right" style={{ minWidth: "765px" }}>
                  <div className="fw-bold d-flex">
                    <div style={{ width: "285px" }}>
                      <Text>Capacity Parameters for:</Text>
                    </div>
                    <Text className="ml-4">
                      {!methodLoader ? (
                        <>
                          {detailData?.CarrierDescription
                            ? detailData?.CarrierDescription
                            : ""}
                        </>
                      ) : (
                        "Loading..."
                      )}
                    </Text>
                  </div>

                  {/* <div className="text-right fw-bold d-flex ">
                    <div style={{ width: "285px" }}>
                      <Text>Carrier Service Code: </Text>
                    </div>
                    <Text className="ml-4">
                      {!methodLoader ? (
                        <>{detailData?.name ? detailData?.name : ""}</>
                      ) : (
                        "Loading..."
                      )}
                    </Text>
                  </div> */}

                  <div className="text-right fw-bold d-flex ">
                    <div style={{ width: "285px" }}>
                      <Text>Despatch Method:</Text>
                    </div>
                    <Text className="ml-4">
                      {!methodLoader ? (
                        <>
                          {detailData?.Description
                            ? detailData?.Description
                            : ""}
                        </>
                      ) : (
                        "Loading..."
                      )}
                    </Text>
                  </div>
                </div>

                <div className="d-flex" style={{ minWidth: "490px" }}>
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
                            value={!methodLoader ? effectiveDate : null}
                            onChange={(e: any) => {
                              setEffectiveDateFunc(e);
                              setFormEdit(true);
                            }}
                            showToday={false}
                            disabled={
                              effectiveBetweenDates &&
                              effectiveBetweenDates.length
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

                  <div className="mt-4 " style={{ textAlign: "left" }}>
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
                                !methodLoader ? effectiveBetweenDates : null
                              }
                              format={dateFormat}
                              disabled={effectiveDate}
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
                <div
                  className="d-flex align-items-end justify-content-end"
                  style={{ minWidth: "276px" }}
                ></div>
                <div
                  className="d-flex flex-column"
                  style={{ minWidth: "490px" }}
                >
                  <div className="mb-4">
                    <Text className="fw-bold md-3">Primary Parameters:</Text>
                  </div>

                  <div>
                    <Row className="mt-2">
                      <Col>
                        <table>
                          <tr
                            style={{ borderBottom: "1px solid #111" }}
                            className="mb-2"
                          >
                            <td>Length</td>
                            <td>
                              Volume m<sup>3</sup>
                            </td>
                            <td>Parcels</td>
                            <td>Parcel KG</td>
                            <td>Consignment KG</td>
                          </tr>
                          <tr>
                            {primaryQtyLimit
                              ? primaryQtyLimit.map(
                                  (value: any, index: number, array: any) => (
                                    <td key={index}>
                                      <Form.Control
                                        style={{
                                          fontSize: 14,
                                          textAlign: "center",
                                          width:
                                            index === array.length - 1
                                              ? "120px"
                                              : "80px",
                                        }}
                                        name="length"
                                        value={!methodLoader ? value : ""}
                                        readOnly
                                        className="mt-2 p-0"
                                        onChange={({ target }) => {}}
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
                <div style={{ minWidth: "600px" }}>
                  <div style={{ marginBottom: "31px" }}>
                    <Text className=" fw-bold">Secondary Parameters:</Text>
                  </div>
                  <Row className="mt-2 d-wr">
                    <Col lg="2" md="1"></Col>

                    <Col className="d-flex">
                      <table>
                        <tr
                          style={{ borderBottom: "1px solid #111" }}
                          className="mb-2"
                        >
                          <td>Length</td>
                          <td>
                            Volume m<sup>3</sup>
                          </td>
                          <td>Parcels</td>
                          <td>Parcel KG</td>
                          <td>Consignment KG</td>
                        </tr>
                        <tr>
                          {qtyLimit.map(
                            (value: any, index: number, array: any) => (
                              <td key={index}>
                                <Form.Control
                                  onBlur={() => {
                                    if (value === "None") return;
                                    if (!value?.length) {
                                      let tmp = [...qtyLimit];
                                      tmp[index] = "None";
                                      setQtyLimit(tmp);
                                      setFormEdit(true);
                                      return;
                                    }
                                    let val = `${Number(value)}`;

                                    if (
                                      index === 1 ||
                                      index === 3 ||
                                      index === 4
                                    ) {
                                      let tmp = [...qtyLimit];
                                      tmp[index] = Number(val)?.toFixed(2);
                                      setQtyLimit(tmp);
                                      setFormEdit(true);
                                    } else if (val !== value) {
                                      let tmp = [...qtyLimit];
                                      tmp[index] = val;
                                      setQtyLimit(tmp);
                                      setFormEdit(true);
                                    }
                                  }}
                                  style={{
                                    fontSize: 14,
                                    textAlign: "center",
                                    borderColor:
                                      value?.trim?.()?.length > 0 &&
                                      value !== "None" &&
                                      !Number(value)
                                        ? "red"
                                        : "",
                                    width:
                                      index === array.length - 1
                                        ? "120px"
                                        : "80px",

                                    // borderColor:
                                    //   (Number(value) <= 0 && value) ||
                                    //   !(
                                    //     Boolean(Number(`${value}`)) ||
                                    //     value === "None"
                                    //   )
                                    //     ? "red"
                                    //     : "#ced4da",
                                  }}
                                  name="length"
                                  value={!methodLoader ? value : ""}
                                  className="mt-2 p-0"
                                  disabled={
                                    limitCube >= 0 ||
                                    (!effectiveDate && !effectiveBetweenDates)
                                  }
                                  onChange={({ target }) => {
                                    let value = target.value;

                                    if (
                                      value?.trim()?.length > 0 &&
                                      value !== "None" &&
                                      !Number(value)
                                    ) {
                                      setHasInvalidInput(true);
                                    }

                                    if (
                                      index === 1 ||
                                      index === 3 ||
                                      index === 4
                                    ) {
                                      const leadingDecimal =
                                        value.indexOf(".") === 0;
                                      const decimalPosition =
                                        value.indexOf(".");
                                      const lastIndexOfDecimal =
                                        value.lastIndexOf(".");
                                      const minusSymbolAdded =
                                        value.indexOf("-");

                                      // reset the field in invalid number is entered
                                      if (Number.isNaN(Number(value)))
                                        value = "";

                                      if (minusSymbolAdded > -1)
                                        value = value.replaceAll("-", "");

                                      if (leadingDecimal) value = "0.";

                                      if (
                                        decimalPosition > -1 &&
                                        lastIndexOfDecimal > decimalPosition
                                      )
                                        value = value.slice(
                                          0,
                                          lastIndexOfDecimal
                                        );

                                      if (decimalPosition > -1)
                                        value = value.slice(
                                          0,
                                          decimalPosition + 3
                                        );

                                      let tmp = [...qtyLimit];
                                      tmp[index] = value;
                                      setQtyLimit(tmp);
                                      setFormEdit(true);
                                    } else {
                                      const leadingDecimal =
                                        value.indexOf(".") === 0;
                                      const decimalPosition =
                                        value.indexOf(".");
                                      const lastIndexOfDecimal =
                                        value.lastIndexOf(".");
                                      const minusSymbolAdded =
                                        value.indexOf("-");

                                      if (decimalPosition > -1)
                                        value = value.substring(
                                          0,
                                          value.length - 1
                                        );

                                      if (Number.isNaN(Number(value)))
                                        value = "";

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
                                        value = value.slice(
                                          0,
                                          lastIndexOfDecimal
                                        );

                                      if (decimalPosition > -1)
                                        value = value.slice(
                                          0,
                                          decimalPosition + 3
                                        );

                                      if (decimalPosition > -1)
                                        value = value.substring(
                                          0,
                                          value.length - 1
                                        );

                                      let tmp = [...qtyLimit];
                                      console.log("value........", value);
                                      tmp[index] = value;
                                      setQtyLimit(tmp);
                                      setFormEdit(true);
                                    }
                                  }}
                                />
                              </td>
                            )
                          )}
                        </tr>
                      </table>
                      <Button
                        size="small"
                        className={`${stylesMain.buttonInPicker} tracking-wide z-50 ml-5 self-end`}
                        type="primary"
                        onClick={() => {
                          setQtyLimit(["None", "None", "None", "None", "None"]);
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
    </div>
  );
};

export default DetailEdit;
