/** @format */
import React, { useEffect, useRef, useState } from "react";
import { RootStateOrAny, useSelector, useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { Select, Typography, DatePicker, Checkbox, Spin } from "antd";
import UserDashboard from "../../../components/UserDashboard";
import SelectCarrier from "../../../components/Select";
import _, { isNumber, sortBy, uniqBy } from "lodash";
import { AppButton } from "../../../components/AppButton";
import DetailEdit from "./detailEdit";
// import styles from '../../../components/Tables/CarrierParcelsTable/carrier-Parcels-table.module.scss';
import { FormLabel } from "react-bootstrap";
import { CarrierParcelLimit } from "./detailEdit";
import { Form } from "react-bootstrap";
import styles from "./carrier-parcel-limits.module.scss";
import stylesMain from "../carrier-routing-control.module.scss";
import CarrierParcelTable from "../../../components/Tables/CarrierParcelLimitsTable";
import { fetchCarriers } from "../../../redux/slices/productFixingRoutingByRegionSlice";
import {
  fetchAllServices,
  fetchCarrierServices,
  setSelectedService as setSelectedServiceRedux,
  setServiceLoader,
  setSecondaryParameters,
  setSelectedMethod as setSelectedMethodRedux,
  setAllCarrierRecords,
  setPageType as setPageTypeRedux,
  setSelectedRowData as setSelectedRowDataRedux,
  setDetailData as setDetailDataRedux,
  setLocation as setLocationRedux,
  setSelectedId,
  setQtyLimitData,
  setFormEditing,
  setEffectiveDate,
  setEffectiveBetweenDates,
  setCarrierParcelLimit,
} from "../../../redux/slices/CarrierParcelLimitsSlice";
import { checkingDisableOfAppButton } from "../../../utils/CheckingStatus";

import { CSVLink } from "react-csv";

import { useReactToPrint } from "react-to-print";
import moment from "moment";
import useAppSelector from "../../../hooks/useAppSelector";
import { CarrierParcelLimitData } from "../../../interfaces/carrierParcelLimits";
import { generateId } from "../../../utils/helpers";

const { Option } = Select;

const CarrierParcelLimits = (): JSX.Element => {
  const dispatch = useDispatch();
  const setPageType = (data: string) => dispatch(setPageTypeRedux(data));
  const [page, setPage] = useState(10) as any;
  const currentUser = useSelector(
    ({ users }: RootStateOrAny) => users.currentUser
  );

  const { Title, Text } = Typography;
  const setLocation = (data: string) => dispatch(setLocationRedux(data));

  const [innerLoading, setInnerLoading] = useState<boolean>(false);
  const setSelectedRowData = (data: CarrierParcelLimit) =>
    dispatch(setSelectedRowDataRedux(data));
  const setDetailData = (data: any) => dispatch(setDetailDataRedux(data));
  const [mapLoading, setMapLoading] = useState<any>(false);

  const componentToPrintRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentToPrintRef.current,
  });

  const {
    selectedCarrier,
    secondaryParameters: includeRecordsSecondaryParameters,
    selectedMethod,
    allCarrierRecords,
    pageType,
    selectedRowData,
    detailData,
    location,
    selectedId: value,
  } = useAppSelector((state) => state?.carrierParcelLimits || {});
  const setSelectedCarrier = (data: string) =>
    dispatch(setSelectedServiceRedux(data));

  const setSelectedMethod = (data: string) =>
    dispatch(setSelectedMethodRedux(data));

  const [mergedData, setMergedData] = useState<CarrierParcelLimitData[]>();
  const [allCarrierServiceData, setAllCarrierServiceData] =
    useState<CarrierParcelLimitData[]>();

  const [allCarriers, setAllCarriers] = useState<any>([]);

  const [serviceMethods, setServiceMethods] = useState<any>([]);

  const setIncludeRecordsSecondaryParameters = (data: boolean) =>
    dispatch(setSecondaryParameters(data));

  const setaAllCarrierRecords = (data: boolean) =>
    dispatch(setAllCarrierRecords(data));

  const [exportData, setExportData] = useState([]) as any;

  const loader = useSelector(
    ({ carrierParcelLimits }: RootStateOrAny) => carrierParcelLimits?.loader
  );

  const serviceLoader = useSelector(
    ({ carrierParcelLimits }: RootStateOrAny) =>
      carrierParcelLimits?.serviceLoader
  );

  const statusLoader = useSelector(
    ({ carrierParcelLimits }: RootStateOrAny) =>
      carrierParcelLimits?.statusLoader
  );

  function clearFilters() {
    setIncludeRecordsSecondaryParameters(false);
    setaAllCarrierRecords(false);
    setSelectedCarrier("None");
    setSelectedMethod("None");
  }

  const carriers = useSelector(
    ({ productFixingRoutingByRegion }: RootStateOrAny) =>
      productFixingRoutingByRegion.carriers
  );

  const carriersLoader = useSelector(
    ({ productFixingRoutingByRegion }: RootStateOrAny) =>
      productFixingRoutingByRegion.loader
  );

  const services = useSelector(
    ({ carrierParcelLimits }: RootStateOrAny) => carrierParcelLimits?.services
  );

  const allServices = useSelector(
    ({ carrierParcelLimits }: RootStateOrAny) =>
      carrierParcelLimits?.allServices
  );

  const CUDDisabled = checkingDisableOfAppButton(currentUser, "edit", [
    // "Set Up & Control",
    "Carrier Routing Control",
    "Carrier: Parcel Limits",
  ]);

  useEffect(() => {
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
    }
  }, [services]);

  useEffect(() => {
    console.log({ mapLoading });
  }, [mapLoading]);

  useEffect(() => {
    setMapLoading(true);
    if (allServices) {
      const servicesDate = allServices?.data?.map((i: any) => {
        return i;
      });

      console.log("allServices", allServices);
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

      setAllCarrierServiceData([
        sortedAllCarrierService,
      ] as unknown as CarrierParcelLimitData[]);
    }
    setMapLoading(false);
  }, [allServices]);

  useEffect(() => {
    if (!(selectedCarrier === "None")) {
      if (services) {
        setInnerLoading(true);

        const servicesDate = services?.data?.map((i: any) => {
          return i;
        });

        let despatchMethodData: any = [];

        servicesDate?.map((carrierParcel: any) => {
          return carrierParcel?.ClientDespatchMethods?.forEach(
            (parcel: any) => {
              despatchMethodData.push({
                id: parcel.Id,
                code: `${parcel.Id}-${carrierParcel.Name}`,
                description: parcel.Description,
              });
            }
          );
        });

        despatchMethodData = uniqBy(despatchMethodData, "id");

        setServiceMethods(despatchMethodData);

        setInnerLoading(false);

        return;
      }
    }
  }, [services]);

  useEffect(() => {
    if (selectedCarrier === "None") setIncludeRecordsSecondaryParameters(false);
  }, [selectedCarrier]);

  useEffect(() => {
    if (!(selectedMethod === "None")) {
      setIncludeRecordsSecondaryParameters(false);
    }
  }, [selectedMethod]);

  useEffect(() => {
    // if (pageType === "filter" && location === "") {
    //   // setSelectedCarrier("None");
    //   // setSelectedMethod("None");
    // }

    if (pageType === "table") {
      setDetailData(null);
      setValue(null);
    }
  }, [pageType]);

  useEffect(() => {
    if (allCarrierRecords) {
      dispatch(fetchAllServices());
      return;
    }

    dispatch(setServiceLoader(false));
  }, [allCarrierRecords]);

  useEffect(() => {
    if (pageType === "table") {
      if (!(location === "back")) {
        if (!allCarrierRecords || location === "datailEditBack") {
          dispatch(fetchAllServices());
        }
      }
    }
  }, [pageType, location]);

  const setValue = (data: string | null) => dispatch(setSelectedId(data));
  useEffect(() => {
    dispatch(fetchCarriers());
    // dispatch(fetchAllServices());
  }, []);

  useEffect(() => {
    setAllCarriers(carriers);
  }, [carriers]);

  const handleRowClick = (record: any, event: any) => {
    setDetailData(record);
  };

  function removeSelectedRowData() {
    setSelectedRowData({} as any);
  }
  function unCheckTableRow() {
    setValue(null);
    setDetailData(null);
  }

  async function handleOnDisplay() {
    if (selectedMethod === "None") {
      setPageType("table");
      return;
    }

    setLocation("filter");
    setPageType("detail");
  }

  useEffect(() => {
    if (!(selectedMethod === "None") || location === "datailEditBack") {
      const servicesDate = services?.data?.map((i: any) => {
        return i;
      });

      const despatchMethodData: any = [];

      servicesDate?.map((carrierParcel: any) => {
        return carrierParcel?.ClientDespatchMethods?.forEach((parcel: any) => {
          const secondaryParameter = parcel.LimitsInfo.LimitList?.filter(
            (x: any) => x.SecondaryMaxValue != null
          ).length;

          despatchMethodData.push({
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
          });
        });
      });

      // console.log({ selectedMethod: selectedMethod?.split("-")[0] });
      console.log({ selectedMethod: selectedMethod });

      const method = despatchMethodData?.find(
        (i: any) => i.clientMethodID === Number(selectedMethod?.split("-")[0])
      );

      setDetailData(method);
    }
  }, [selectedMethod, location]);

  const handleCarrierChange = (value: any) => {
    setSelectedCarrier(value);
    console.log({ value });

    if (!(value === "None")) {
      dispatch(fetchCarrierServices(value));
    }

    //
    setSelectedMethod("None");
  };

  const handleMethodChange = (value: any) => {
    setSelectedMethod(value);
  };

  const handleOnEdit = () => {
    dispatch(setCarrierParcelLimit(null));
    dispatch(setQtyLimitData([null, null, null, null, null]));
    dispatch(setFormEditing(false));
    dispatch(setEffectiveDate(null));
    dispatch(setEffectiveBetweenDates(null));

    setTimeout(() => {
      setLocation("table");
      setPageType("detail");
    }, 1);
  };

  // for export
  useEffect(() => {
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
                activeExport: carrierParcel.CarrierActive === true ? "Y" : "N",
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
                  ? moment(parcel.LimitsInfo.PermanentSecondaryDateFrom).format(
                      "DD/MM/YYYY"
                    )
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

      const sortedAllCarrierService = sortBy(allCarrierService, [
        "carrier",
        "despatchMethod",
      ]);

      setExportData(sortedAllCarrierService);
    }
  }, [allServices]);

  const makeHeaders = (label: string, key: string) => {
    const headers: any = [
      { [label]: "Carriers", [key]: "carrier" },
      { [label]: "Active", [key]: "activeExport" },
      { [label]: "Despatch Method", [key]: "despatchMethod" },
      // { [label]: "Carrier Service Code", [key]: "name" },
      { [label]: "Length", [key]: "length" },
      { [label]: "Volume m3", [key]: "volume" },
      { [label]: "Parcels", [key]: "parcels" },
      { [label]: "Parcel KG", [key]: "parcelKG" },
      { [label]: "Consignment KG", [key]: "consignmentKG" },
      { [label]: "Secondary Parameter", [key]: "secondaryParameter" },

      { [label]: "Permanent Date From", [key]: "secondaryPermanentDateFrom" },
      { [label]: "Temp Date From", [key]: "secondaryTempDateFrom" },
      { [label]: "Temp Date To", [key]: "secondaryTempDateTo" },

      { [label]: "Sec_Length", [key]: "secondaryLength" },
      { [label]: "Sec_Volume m3", [key]: "secondaryVolume" },
      { [label]: "Sec_Parcels", [key]: "secondaryParcels" },
      { [label]: "Sec_Parcel KG", [key]: "secondaryParcelKg" },
      { [label]: "Sec_Consignment KG", [key]: "secondaryConsignmentKg" },
    ];
    return headers;
  };

  return (
    <UserDashboard>
      <div
        className="flex flex-col"
        style={{
          height: "100%",
        }}
      >
        <div className="text-center">
          <Title level={3} data-testid="abcd">
            Carrier Parcel Limits
          </Title>
        </div>

        {pageType === "filter" && (
          <>
            <AppButton
              className={`xsm:w-28 xsm:h-9 lg:w-30 lg:h-10 font-bold tracking-wide mt-5 position-absolute top-1 z-50 ${stylesMain.buttonInHeader}`}
              title="Clear"
              style={{
                borderRadius: "4px",
                right: "150px",
              }}
              disabled={allCarrierRecords ? false : selectedCarrier == "None"}
              onClick={clearFilters}
            />
            <AppButton
              className={`xsm:w-28 xsm:h-9 lg:w-30 lg:h-10 font-bold tracking-wide mt-5 position-absolute top-1 right-4 z-50 ${stylesMain.buttonInHeader}`}
              style={{ borderRadius: "4px" }}
              title="Display"
              disabled={
                allCarrierRecords && !serviceLoader
                  ? false
                  : selectedCarrier == "None" ||
                    loader ||
                    statusLoader ||
                    mapLoading
              }
              onClick={handleOnDisplay}
              loading={loader || statusLoader || mapLoading}
            />

            <div
              className={`flex flex-col justify-center items-center mt-8 text-sm ${styles.spacing}`}
            >
              <div className="mb-32 flex flex-col space-y-4">
                <div className={`d-flex ${styles.checkbox}`}>
                  <Checkbox
                    style={{ marginBottom: 20 }}
                    defaultChecked={allCarrierRecords}
                    checked={allCarrierRecords}
                    name="active"
                    onChange={(target: any) => {
                      setaAllCarrierRecords(target?.target?.checked);
                      setSelectedCarrier("None");
                      setSelectedMethod("None");
                    }}
                    data-testid="cpl_checkBox_label"
                  >
                    Display All Carrier Records
                  </Checkbox>

                  {serviceLoader && (
                    <>
                      <Spin
                        //@ts-ignore
                        tip={
                          <span className="inline-block ml-2 mr-2">
                            {`Please wait loading all carrier records...`}
                          </span>
                        }
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          marginLeft: 15,
                        }}
                      />
                    </>
                  )}
                </div>
                <div className=" flex flex-row items-center">
                  <Form.Label className={`text-right ${styles.label}`}>
                    <Text data-testid="cpl_carrier_label">Carrier:</Text>
                  </Form.Label>
                  <SelectCarrier
                    width={300}
                    // placeholder="select option"
                    defaultValue={"None"}
                    onChange={(e) => handleCarrierChange(e)}
                    value={selectedCarrier}
                    disabled={allCarrierRecords}
                    datatestId="cpl_carrier_select"
                  >
                    <Option value="None">None</Option>
                    {allCarriers.map((item: any, index: any) => (
                      <Option key={index} value={item.code}>
                        {item.name}
                      </Option>
                    ))}
                  </SelectCarrier>
                  {carriersLoader && (
                    <>
                      <Spin
                        //@ts-ignore
                        tip={
                          <span className="inline-block ml-2 mr-2">
                            Please wait loading carriers...
                          </span>
                        }
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          marginLeft: 15,
                        }}
                      />
                    </>
                  )}
                </div>
                <div className=" flex flex-row items-center">
                  <Form.Label className={`text-right ${styles.label}`}>
                    <Text data-testid="cpl_d_method_label">
                      Despatch Method:
                    </Text>
                  </Form.Label>
                  <SelectCarrier
                    width={300}
                    placeholder="select option"
                    onChange={(e) => handleMethodChange(e)}
                    value={selectedMethod}
                    disabled={
                      selectedCarrier == "None" ||
                      loader ||
                      innerLoading ||
                      CUDDisabled
                    }
                    datatestId="cpl_d_method_select"
                  >
                    <Option value="None">None</Option>
                    {!(selectedCarrier == "None") &&
                      serviceMethods?.map((item: any, index: any) => {
                        return (
                          <Option key={item.code} value={item.code}>
                            {item.description}
                          </Option>
                        );
                      })}
                  </SelectCarrier>
                  {loader && (
                    <>
                      <Spin
                        //@ts-ignore
                        tip={
                          <span className="inline-block ml-2 mr-2">
                            {`Please wait loading ${selectedCarrier} despatch methods...`}
                          </span>
                        }
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          marginLeft: 15,
                        }}
                      />
                    </>
                  )}
                </div>

                <div
                  className={`flex flex-row items-center space-x-4 ${styles.checkbox}`}
                >
                  <Checkbox
                    style={{ marginTop: 10 }}
                    defaultChecked={includeRecordsSecondaryParameters}
                    checked={includeRecordsSecondaryParameters}
                    name="active"
                    onChange={(target: any) => {
                      setIncludeRecordsSecondaryParameters(
                        target.target.checked
                      );
                    }}
                    disabled={
                      selectedMethod !== "None" ||
                      (allCarrierRecords ? !false : selectedCarrier === "None")
                    }
                  >
                    Only include records with existing Secondary Parameters
                  </Checkbox>
                </div>
              </div>
            </div>
          </>
        )}
        {pageType === "table" && (
          <>
            <div className="mx-16 text-center">
              <div className="flex flex-row items-center space-x-2 justify-end mt-2 ">
                <AppButton
                  className="xsm:w-28 xsm:h-9 lg:w-30 lg:h-10 font-bold tracking-wide mt-5 position-absolute top-1 z-50"
                  title="Back"
                  style={{ right: "555px" }}
                  onClick={() => {
                    setLocation("back");
                    setPageType("filter");
                    removeSelectedRowData();
                  }}
                />
                <AppButton
                  className="xsm:w-28 xsm:h-9 lg:w-30 lg:h-10 font-bold tracking-wide mt-5 position-absolute top-1 z-50"
                  title="Deselect Edit"
                  style={{ right: "420px" }}
                  onClick={unCheckTableRow}
                  disabled={!detailData}
                  // loading={loader || statusLoader || serviceLoader}
                />
                <AppButton
                  className="xsm:w-28 xsm:h-9 lg:w-30 lg:h-10 font-bold tracking-wide mt-5 position-absolute top-1 z-50"
                  title="Edit"
                  style={{ right: "285px" }}
                  onClick={handleOnEdit}
                  disabled={!detailData || CUDDisabled}
                  // loading={loader || statusLoader || serviceLoader}
                />
                <CSVLink
                  data={exportData}
                  headers={makeHeaders("label", "key")}
                  filename={"carrier-parcel-limits.csv"}
                >
                  <AppButton
                    className="xsm:w-28 xsm:h-9 lg:w-30 lg:h-10 font-bold tracking-wide mt-5 position-absolute top-1 z-50"
                    title="Export"
                    style={{ right: "150px" }}
                    onClick={unCheckTableRow}
                    loading={serviceLoader}
                    disabled={serviceLoader}
                  />
                </CSVLink>
                <AppButton
                  className="xsm:w-28 xsm:h-9 lg:w-30 lg:h-10 font-bold tracking-wide mt-5 position-absolute top-1 z-50 right-4"
                  title="Print"
                  onClick={handlePrint}
                />
              </div>
            </div>

            <div
              className="z-0"
              id="active-dates-table"
              ref={componentToPrintRef}
            >
              <div className={`${stylesMain.formatPrint}`}>
                <div className={`${stylesMain.componentToPrint}`}>
                  <div className="d-flex flex-column mb-4 align-items-center">
                    <div className=" d-flex justify-end w-100 pr-4 mt-4">
                      <FormLabel>
                        {moment().format("DD/MM/YYYY HH:mm")}
                      </FormLabel>
                    </div>
                    <Title level={3}>Carrier Parcel Limits</Title>
                  </div>
                </div>

                <div
                  className="z-0 mt-2 w-full text-nowrap"
                  id="carrier-parcel-table"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <CarrierParcelTable
                    rowSelection={false}
                    handleRowClick={handleRowClick}
                    pagination={false}
                    defaultRowCount={page}
                    dataSource={(allCarrierRecords
                      ? allCarrierServiceData
                      : mergedData
                    )?.flat?.()}
                    setValue={setValue}
                    value={value}
                    includeRecordsSecondaryParameters={
                      includeRecordsSecondaryParameters
                    }
                    CUDDisabled={CUDDisabled}
                  />
                </div>
              </div>
            </div>
          </>
        )}
        {pageType === "detail" && detailData && (
          <div className="mt-10">
            <DetailEdit
              selectedData={selectedRowData}
              setPageType={setPageType}
              onGoBack={() => setPageType(location)}
              detailData={detailData.entireParcel}
              unCheckTableRow={() => {
                setValue(null);
              }}
              setLocation={setLocation}
              allCarrierRecords={allCarrierRecords}
              selectedCarrier={selectedCarrier}
              setAllCarrierServiceData={setAllCarrierServiceData}
              setMergedData={setMergedData}
              setExportData={setExportData}
            />
          </div>
        )}
      </div>
    </UserDashboard>
  );
};

export default CarrierParcelLimits;
