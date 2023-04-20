import React, { useEffect, useState } from "react";
import UserDashboard from "../../../components/UserDashboard";
import styles from "./styles.module.scss";
import { Col, Form, Row } from "react-bootstrap";
import ByRegionTable from "../../../components/Tables/ByRegionTable";
import ByRegionFullTable from "./fullListTable";
import { DatePicker, Spin, Checkbox, Button } from "antd";
import { InfinityTable } from "antd-table-infinity";
import moment from "moment";
import { RootStateOrAny, useSelector, useDispatch } from "react-redux";
import { checkingDisableOfAppButton } from "../../../utils/CheckingStatus";
import {
  setPageProps,
  fetchPostCodeRegion,
  fetchSkusFilterList,
  fetchSkuDetails,
  clearSkuList,
  setEnableSave,
  fetchCarriers,
  setReduxState,
} from "../../../redux/slices/productFixingRoutingByRegionSlice";
import {
  addCategoryDetail,
  deleteCategoryDetail,
  fetchCarriersServices,
  fetchCarrierStatus,
} from "../../../redux/slices/productFixedRoutingDespatch";
import { client } from "../../../constants";
import _ from "lodash";
import { Message } from "../../../utils/message";
import useTheme from "../../../hooks/useTheme";
import useAppSelector from "../../../hooks/useAppSelector";
import { Moment } from "moment";
import { AppButton } from "../../../components/AppButton";

const { RangePicker } = DatePicker;

const dateFormat = "DD/MM/YYYY";

const skusColumns = [
  {
    title: "SKU Code",
    dataIndex: "Item_Code",
    key: "Item_Code",
    width: 180,
    className: "by-region-popup-table",
  },
  {
    title: "Item Description",
    dataIndex: "Item_Description",
    key: "Item_Description",
    className: "by-region-popup-table",
  },
];

interface FilterData {
  service: string | number;
  method: string | number;
  carrier: string;
  includes: string[];
  startDate: null | string;
  endDate: null | string;
  regionList: null | number;
  despatch: null | string;
}

const DispatchReturns = () => {
  const dispatch = useDispatch();
  const theme = useTheme();

  const setSkuDescription = (value: any) =>
    dispatch(setReduxState({ key: "skuDescription", value }));
  const setPopUpShow = (value: any) =>
    dispatch(setReduxState({ key: "popUpShow", value }));
  const setSelectedMethods = (value: any) =>
    dispatch(setReduxState({ key: "selectedMethods", value }));
  const setIsLoading = (value: any) =>
    dispatch(setReduxState({ key: "isLoading", value }));
  const setFilterData = (value: any) =>
    dispatch(setReduxState({ key: "filterData", value }));

  const setData = (value: any) =>
    dispatch(setReduxState({ key: "data", value }));

  const setShow = (value: any) =>
    dispatch(setReduxState({ key: "show", value }));
  const setSkuFilterList = (value: any) =>
    dispatch(setReduxState({ key: "skuFilterList", value }));
  const setSelectedSku = (value: any) =>
    dispatch(setReduxState({ key: "selectedSku", value }));
  const setDespatchDateRange = (value: any) =>
    dispatch(setReduxState({ key: "despatchDateRange", value }));
  const setRemoveItemIDs = (value: any) =>
    dispatch(setReduxState({ key: "removeItemIDs", value }));
  const setCustomPreferenceIDs = (value: any) =>
    dispatch(setReduxState({ key: "customPreferenceIDs", value }));
  const setError = (value: any) =>
    dispatch(setReduxState({ key: "error", value }));

  const setShowRangePicker = (value: any) =>
    dispatch(setReduxState({ key: "showRangePicker", value }));
  const setCarrierStatusLoader = (value: any) =>
    dispatch(setReduxState({ key: "carrierStatusLoader", value }));
  const {
    filterData,
    selectedMethods,
    isLoading,
    popUpShow,
    skuDescription,
    data,
    show,
    skuFilterList,
    selectedSku,
    despatchDateRange,
    removeItemIDs,
    customPreferenceIDs,
    error,
    carrierStatusLoader,
    showRangePicker,
  } = useAppSelector((state) => state.productFixingRoutingByRegion);

  const validated = false;

  const currentUser = useSelector(
    ({ users }: RootStateOrAny) => users.currentUser
  );

  const CUDDisabled = checkingDisableOfAppButton(currentUser, "edit", [
    // "Set Up & Control",
    "Carrier Routing Control",
    "Product Fixed Routing: by Region",
  ]);

  const columns: any = [
    {
      title: <span className={styles.columnHeader}>Post Code Region</span>,
      dataIndex: "code",
      key: "code",
      className: "table-header-col",
      width: 200,
      showSorterTooltip: false,
      render: (item: string) => {
        return <span className="text-left">{item}</span>;
      },
      align: "left",
    },
    {
      title: <span className={styles.columnHeader}>Carrier</span>,
      showSorterTooltip: false,
      dataIndex: "carrier",
      key: "carrier",
      width: 120,
      render: (item: string) => {
        return <span className="text-left">{item}</span>;
      },
      align: "left",
    },
    // {
    //   title: <span className={styles.columnHeader}>Service</span>,
    //   showSorterTooltip: false,
    //   dataIndex: "service",
    //   key: "service",
    //   width: 120,
    //   render: (item: string) => {
    //     return <span className="text-left">{item}</span>;
    //   },
    //   align: "left",
    // },
    // {
    //   title: <span className={styles.columnHeader}>Method</span>,
    //   showSorterTooltip: false,
    //   dataIndex: "method",
    //   key: "method",
    //   render: (item: string) => {
    //     return <span className="text-left">{item}</span>;
    //   },
    //   align: "left",
    // },
    {
      title: <span className={styles.columnHeader}>Despatch</span>,
      showSorterTooltip: false,
      dataIndex: "despatch_Return",
      key: "despatch_Return",
      width: 120,
      render: (item: string) => {
        return <span className="text-left">{item}</span>;
      },
      align: "center",
    },
    {
      title: "Effective Date",
      children: [
        {
          title: (
            <div className="flex justify-center">
              <span className={styles.columnHeader}>From</span>
            </div>
          ),
          showSorterTooltip: false,
          dataIndex: "date_from",
          key: "date_from",
          render: (item: string) => {
            return (
              <span className="text-left">
                {moment(item).format("DD/MM/YYYY")}
              </span>
            );
          },
          width: 120,
          align: "center",
        },
        {
          title: (
            <div className="flex justify-center">
              <span className={styles.columnHeader}>To</span>
            </div>
          ),
          showSorterTooltip: false,
          dataIndex: "date_to",
          key: "date_to",
          render: (item: string) => {
            return (
              <span className="text-left">
                {moment(item).format("DD/MM/YYYY")}
              </span>
            );
          },
          width: 120,
          align: "center",
        },
      ],
    },
    {
      title: <span className={styles.columnHeader}>Remove</span>,
      showSorterTooltip: false,
      dataIndex: "remove",
      key: "remove",
      width: 100,
      render: (item: string, record: any) => {
        return (
          <Checkbox
            onChange={(e) => checkIncludes(record.index, record)}
            checked={removeItemIDs.indexOf(record.index) !== -1}
            disabled={CUDDisabled}
          />
        );
      },
      align: "center",
    },
  ];

  const loader = useSelector(
    ({ productFixingRoutingByRegion }: RootStateOrAny) =>
      productFixingRoutingByRegion.loader
  );

  const skuDetailsLoader = useSelector(
    ({ productFixingRoutingByRegion }: RootStateOrAny) =>
      productFixingRoutingByRegion.skuDetailsLoader
  );

  const skuDetailsList = useSelector(
    ({ productFixingRoutingByRegion }: RootStateOrAny) =>
      productFixingRoutingByRegion.skuDetails
  );

  const postCodeRegionInSlice = useSelector(
    ({ productFixingRoutingByRegion }: RootStateOrAny) =>
      productFixingRoutingByRegion.postCodeRegion
  );

  const services = useSelector(
    ({ productFixedRoutingDespatch }: RootStateOrAny) =>
      productFixedRoutingDespatch.services
  );

  const skusFilterList = useSelector(
    ({ productFixingRoutingByRegion }: RootStateOrAny) =>
      productFixingRoutingByRegion.skusList
  );

  const carriersServices = useSelector(
    ({ productFixedRoutingDespatch }: RootStateOrAny) =>
      productFixedRoutingDespatch.carriersServices
  );

  const carriers = useSelector(
    ({ productFixingRoutingByRegion }: RootStateOrAny) =>
      productFixingRoutingByRegion.carriers
  );

  const enableSave = useSelector(
    ({ productFixingRoutingByRegion }: RootStateOrAny) =>
      productFixingRoutingByRegion.enableSave
  );

  const byRegionDespatchState = useSelector(
    ({ productFixingRoutingByRegion }: RootStateOrAny) =>
      productFixingRoutingByRegion.byRegionDespatchState
  );

  const func = async () => {
    if (!byRegionDespatchState.isPageLoaded) {
      await dispatch(fetchPostCodeRegion());
      await dispatch(fetchSkusFilterList());
      await dispatch(fetchCarriers());
      await dispatch(fetchCarriersServices());
      dispatch(
        setPageProps({
          isPageLoaded: true,
        })
      );

      console.log({ byRegionDespatchState });
      setSkuDescription(byRegionDespatchState?.skuDescription);
      setPopUpShow(byRegionDespatchState?.popUpShow);
      setSelectedMethods(byRegionDespatchState?.selectedMethods);
      setIsLoading(byRegionDespatchState?.isLoading);
      setFilterData({ ...byRegionDespatchState?.filterData });
      setData([...byRegionDespatchState?.data]);
      setShow(byRegionDespatchState?.show);
      setSkuFilterList([...byRegionDespatchState?.skuFilterList]);
      setSelectedSku(byRegionDespatchState?.selectedSku);
      setDespatchDateRange(byRegionDespatchState?.despatchDateRange);
      setRemoveItemIDs(byRegionDespatchState?.removeItemIDs);
      setCustomPreferenceIDs(byRegionDespatchState?.customPreferenceIDs);
      setError(byRegionDespatchState?.error);
      // setAllCarriers([...byRegionDespatchState?.allCarriers]);
    }
  };

  useEffect(() => {
    func();
  }, []);

  useEffect(() => {
    let carrier = services.filter((item: any) => item.Name === "STANDARD");
    if (carrier.length) {
      dispatch(
        setPageProps({
          serviceName: carrier[0].Name,
        })
      );
      if (carrier[0].ClientDespatchMethods) {
        let uniqueCarriers = new Map(
          carrier[0].ClientDespatchMethods.map((item: any) => [
            item.CarrierCode,
            item,
          ])
        ).values();
        let uniqueMethods = new Map(
          carrier[0].ClientDespatchMethods.map((item: any) => [item.Id, item])
        ).values() as any;

        if (uniqueCarriers) {
          // setSelectedCarriers([
          //   // @ts-ignore
          //   ...uniqueCarriers,
          // ]);
          uniqueMethods = _.sortBy(
            [...uniqueMethods],
            "CarrierMethodDescription"
          );
          setSelectedMethods([
            // @ts-ignore
            ...uniqueMethods,
          ]);
          dispatch(
            setPageProps({
              // @ts-ignore
              selectedMethods: [...uniqueMethods],
            })
          );
        }
      }
    }
  }, [services, carriers]);

  useEffect(() => {
    if (skuDetailsList.length) {
      console.log({ skuDetailsList });
      let sortedSkuDetailsList = _.sortBy(skuDetailsList, [
        "code",
        "carrier",
        "service",
      ]);
      setData(sortedSkuDetailsList);
      dispatch(
        setPageProps({
          data: sortedSkuDetailsList,
          dataLoaded: true,
        })
      );
    }
  }, [skuDetailsList]);

  const checkIncludes = (index: number, record: any) => {
    const indexOf = removeItemIDs.indexOf(index);
    if (indexOf !== -1) {
      const data = [...removeItemIDs];
      const customPreferenceIDList = [...customPreferenceIDs];
      data.splice(indexOf, 1);
      customPreferenceIDList.splice(indexOf, 1);
      setRemoveItemIDs(data);
      setCustomPreferenceIDs(customPreferenceIDList);
      dispatch(
        setPageProps({
          removeItemIDs: data,
          customPreferenceIDs: customPreferenceIDList,
        })
      );
    } else {
      setRemoveItemIDs([...removeItemIDs, index]);
      setCustomPreferenceIDs([
        ...customPreferenceIDs,
        record.ProductFixedRoutingID,
      ]);
      dispatch(
        setPageProps({
          removeItemIDs: [...removeItemIDs, index],
          customPreferenceIDs: [
            ...customPreferenceIDs,
            record.ProductFixedRoutingID,
          ],
        })
      );
    }
  };
  const handleChange = (value: any, name: any) => {
    setError("");
    if (name == "service") {
      let carrier = carriersServices[filterData.carrier].filter(
        (item: any) => item.Id == value
      );
      dispatch(
        setPageProps({
          serviceName: carrier[0].Name,
        })
      );
      setFilterData({
        ...filterData,
        method: "none",
        [name]: value,
      });
      let allMethods = carrier[0].ClientDespatchMethods.filter(
        (method: any) => method.CarrierCode === filterData.carrier
      );
      allMethods = _.sortBy(allMethods, "CarrierMethodDescription");
      setSelectedMethods(allMethods);
      dispatch(
        setPageProps({
          selectedMethods: allMethods,
          filterData: {
            ...filterData,
            method: "none",
            [name]: value,
          },
        })
      );
    }

    if (name == "carrier") {
      setFilterData({
        ...filterData,
        service: 0,
        method: "none",
        [name]: value,
      });
      setSelectedMethods([]);
      dispatch(
        setPageProps({
          selectedMethods: [],
          filterData: {
            ...filterData,
            service: 0,
            method: "none",
            [name]: value,
          },
        })
      );

      setDespatchDateRange([]);

      setShowRangePicker(false);
      setTimeout(() => {
        setShowRangePicker(true);
      }, 1);
    }
    if (name == "method") {
      const methodObj = selectedMethods.find(
        (method: any) => method.Id == value
      );
      setFilterData({
        ...filterData,
        [name]: value,
      });
      dispatch(
        setPageProps({
          methodName: methodObj?.CarrierMethodDescription || "",
          filterData: {
            ...filterData,
            [name]: value,
          },
        })
      );
    }
    if (name === "regionList") {
      setFilterData({
        ...filterData,
        service: 0,
        method: "none",
        carrier: "none",
        startDate: null,
        endDate: null,
        [name]: value,
      });
      setSelectedMethods([]);
      setDespatchDateRange([]);
      dispatch(
        setPageProps({
          selectedMethods: [],
          despatchDateRange: [],
          filterData: {
            ...filterData,
            service: 0,
            method: "none",
            carrier: "none",
            startDate: null,
            endDate: null,
            [name]: value,
          },
        })
      );
      setShowRangePicker(false);
      setTimeout(() => {
        setShowRangePicker(true);
      }, 1);
    }

    if (name === "despatch") {
      setFilterData({
        ...filterData,
        [name]: value,
      });
      dispatch(
        setPageProps({
          filterData: {
            ...filterData,
            [name]: value,
          },
        })
      );
    }

    if (name === "date" && value[1]) {
      let startDate = value && value[0] ? moment(value[0]).format() : null;
      let endDate = value && value[1] ? moment(value[1]).format() : null;
      setFilterData({
        ...filterData,
        startDate: startDate,
        endDate: endDate,
      });
      setDespatchDateRange(value?.[1] ? value : []);
      dispatch(
        setPageProps({
          filterData: {
            ...filterData,
            startDate: startDate,
            endDate: endDate,
          },
          despatchDateRange: value?.[1] ? value : [],
        })
      );
    }
  };

  const dateFilter = (date: any) => {
    setError("");
    dispatch(
      setPageProps({
        error: "",
      })
    );
    const { regionList, carrier, despatch } = filterData;
    let startDate =
      date && date[0] ? moment(date[0]).format() : moment().format();
    let endDate =
      date && date[1] ? moment(date[1]).format() : moment().format();
    const regionId = postCodeRegionInSlice.find(
      (item: { name: string; id: number }) => item.id == regionList
    );
    const dateFilterData = data.filter(
      (item: any) => item.code === regionId.name
    );
    let isExist = false;
    console.log("Run");
    for (let i = 0; i < dateFilterData.length; i++) {
      if (
        !(
          (startDate > dateFilterData[i].EffectiveDateEnd &&
            endDate > dateFilterData[i].EffectiveDateEnd) ||
          (startDate < dateFilterData[i].EffectiveDateStart &&
            endDate < dateFilterData[i].EffectiveDateStart)
        )
      ) {
        isExist = true;
        setError(
          "Warning: the selected parameters conflict with an existing grid record"
        );
        dispatch(
          setPageProps({
            error:
              "Warning: the selected parameters conflict with an existing grid record",
          })
        );
        break;
      }
    }
    return isExist;
  };

  const onSave = async () => {
    const dataSet = {
      ForRegions: true,
      ProductFixedRouting: [],
    } as any;
    // if (data?.length) {
    setIsLoading(true);
    data?.map((item) => {
      if (!item.ProductFixedRoutingID) {
        dataSet.ProductFixedRouting.push({
          // ClientCode: item.ClientCode,
          // Sku: item.Sku,
          // ClientDespatchServiceID: Number(item.ClientDespatchServiceID),
          // ClientDespatchMethodID: Number(item.ClientDespatchMethodID),
          // EffectiveDateStart: item.EffectiveDateStart,
          // EffectiveDateEnd: item.EffectiveDateEnd,
          // RegionList: item.RegionList,
          ClientCode: item.ClientCode,
          CarrierCode: item.carrier,
          Sku: item.Sku,
          Type: "Region",
          // ClientDespatchServiceID: Number(item.ClientDespatchServiceID),
          // ClientDespatchMethodID: Number(item.ClientDespatchMethodID),
          EffectiveDateStart: item.EffectiveDateStart,
          EffectiveDateEnd: item.EffectiveDateEnd,
          RegionList: item.RegionList,
        });
      }
    });
    console.log({ dataSet });
    if (dataSet?.ProductFixedRouting?.length) {
      await dispatch(addCategoryDetail(dataSet) as any);
    }
    let filterCustomPreferenceIDs = customPreferenceIDs?.filter(
      (item: number | undefined) => !Number.isNaN(item)
    );
    if (filterCustomPreferenceIDs.length) {
      await dispatch(deleteCategoryDetail(filterCustomPreferenceIDs) as any);
    }
    setError("");
    setDespatchDateRange([]);
    setCustomPreferenceIDs([]);
    setFilterData({
      method: "none",
      carrier: "none",
      includes: [],
      startDate: null,
      endDate: null,
      regionList: null,
      despatch: "Despatch",
      service: "none",
    });

    dispatch(
      setPageProps({
        despatchDateRange: [],
        customPreferenceIDs: [],
        filterData: {
          method: "none",
          carrier: "none",
          includes: [],
          startDate: null,
          endDate: null,
          regionList: null,
          despatch: "Despatch",
          service: "none",
        },
        error: "",
      })
    );
    setIsLoading(false);
    dispatch(setEnableSave(false));
    dispatch(
      setPageProps({
        dataLoaded: false,
      })
    );
    // reload sku details
    dispatch(
      fetchSkuDetails({
        ClientCode: client,
        Sku: selectedSku,
      })
    );
    // }
  };

  const onAddSku = async (item: any) => {
    setSelectedSku(item.Item_Code);
    setSkuDescription(item.Item_Description);
    setPopUpShow(false);
    dispatch(
      setPageProps({
        skuDescription: item.Item_Description,
        popUpShow: false,
        selectedSku: item.Item_Code,
      })
    );
    dispatch(
      fetchSkuDetails({
        ClientCode: client,
        Sku: item.Item_Code,
      })
    );
    setSelectedMethods([]);
    setDespatchDateRange([]);
    setFilterData({
      method: "none",
      carrier: "none",
      includes: [],
      startDate: null,
      endDate: null,
      regionList: null,
      despatch: "Despatch",
      service: "none",
    });
    setShowRangePicker(false);
    setTimeout(() => {
      setShowRangePicker(true);
    }, 1);
  };

  const onAdd = async () => {
    const {
      regionList,
      carrier,
      despatch,
      method,
      service,
      startDate,
      endDate,
    } = filterData;
    setCarrierStatusLoader(true);
    const response: any = await dispatch(fetchCarrierStatus(carrier) as any);
    const carrierResult = response?.payload?.data?.clientCarrier;
    console.log(
      "🚀 ~ file: index.tsx ~ line 704 ~ onAdd ~ carrierResult",
      carrierResult
    );
    setCarrierStatusLoader(false);
    let isExist = !carrierResult?.active;
    if (carrierResult?.secondaryParameters) {
      if (carrierResult?.secondaryParameters?.effectiveBetween) {
        const dateFrom = moment(
          carrierResult?.secondaryParameters?.effectiveBetween?.dateFrom
        );
        const dateTo = moment(
          carrierResult?.secondaryParameters?.effectiveBetween?.dateTo
        );
        if (!carrierResult?.secondaryParameters?.active) {
          isExist =
            moment(moment(dateFrom).format()).isBetween(startDate, endDate) ||
            moment(moment(startDate).format()).isBetween(dateFrom, dateTo) ||
            moment(moment(endDate).format()).isBetween(dateFrom, dateTo) ||
            moment(moment(dateTo).format()).isBetween(startDate, endDate);
        } else {
          // Need to test this condition
          isExist =
            moment(moment(startDate).format()).isBefore(dateFrom) ||
            moment(moment(endDate).format()).isAfter(dateTo);
        }
      } else {
        const dateFrom = carrierResult?.secondaryParameters?.effectiveFrom
          ? moment(carrierResult?.secondaryParameters?.effectiveFrom)
          : null;
        if (dateFrom) {
          if (!carrierResult?.secondaryParameters?.active) {
            isExist =
              moment(moment(startDate).format()).isSameOrAfter(dateFrom) ||
              moment(moment(endDate).format()).isSameOrAfter(dateFrom);
          } else {
            isExist =
              moment(moment(startDate).format()).isSameOrBefore(dateFrom) ||
              moment(moment(endDate).format()).isSameOrBefore(dateFrom);
          }
        }
      }
    }
    if (isExist) {
      setError(
        "Warning: The selected Carrier has Date Range conflict for Active / Inactive"
      );
      return null;
    }

    const regionId = postCodeRegionInSlice.find(
      (item: { name: string; id: number }) => item.id == regionList
    );
    const dataItem = {
      index: data.length,
      code: regionId.name,
      carrier: carrier,
      // service: serviceName,
      // method: methodName,
      despatch_Return: despatch,
      date_from: startDate,
      date_to: endDate,
      ClientCode: "ALDI",
      Sku: selectedSku,
      ClientDespatchServiceID: service,
      ClientDespatchMethodID: method,
      EffectiveDateStart: startDate,
      EffectiveDateEnd: endDate,
      RegionList: [Number(regionList)],
    };
    const result = dateFilter([startDate, endDate]);
    console.log(result);
    if (!result) {
      let sortedResult = _.sortBy(
        [...data, dataItem],
        ["code", "carrier", "service"]
      );
      setRemoveItemIDs([]);
      setCustomPreferenceIDs([]);
      setData(sortedResult);
      dispatch(setEnableSave(true));
      setDespatchDateRange([]);
      setFilterData({
        method: "none",
        carrier: "none",
        includes: [],
        startDate: null,
        endDate: null,
        regionList: null,
        despatch: "Despatch",
        service: "none",
      });
      dispatch(
        setPageProps({
          filterData: {
            method: "none",
            carrier: "none",
            includes: [],
            startDate: null,
            endDate: null,
            regionList: null,
            despatch: "Despatch",
            service: "none",
          },
          data: sortedResult,
          despatchDateRange: [],
          removeItemIDs: [],
          customPreferenceIDs: [],
        })
      );
    }
  };

  const onRemove = () => {
    let newData = data.filter(
      (item: any) => removeItemIDs.indexOf(item.index) === -1
    );
    newData = _.sortBy(newData, ["code", "carrier", "service"]);
    console.log("[...newData]", [...newData]);
    setData([...newData]);
    setRemoveItemIDs([]);
    dispatch(
      setPageProps({
        data: newData,
        removeItemIDs: [],
      })
    );
    // check if the remaining data in the table is the same as the original data
    const dataInTable = newData.map((item: any) => item.index);

    console.log("dataInTable", dataInTable);
    const isSame = skuDetailsList.every((item: any) =>
      dataInTable.includes(item.index)
    );

    console.log("isSame", {
      isSame,
      dataInTable,
      newData,
      data,
      skuDetailsList,
    });

    if (!skuDetailsList?.length) {
      if (newData?.length > 0) {
        dispatch(setEnableSave(true));
        return;
      } else {
        dispatch(setEnableSave(false));
        return;
      }
    }

    if (!isSame) {
      dispatch(setEnableSave(true));
    } else {
      dispatch(setEnableSave(false));
    }
  };

  const loadMoreContent = () => (
    <div
      style={{
        textAlign: "center",
        paddingTop: 40,
        paddingBottom: 40,
        border: "1px solid #e8e8e8",
      }}
    >
      <Spin tip="Loading..." />
    </div>
  );

  const onChangeSku = async (e: any) => {
    const { target } = e;
    e?.preventDefault();
    setSelectedSku(target.value);
    setError("");
    if (!target?.value) {
      setPopUpShow(false);
      setSkuDescription("");
      setSkuFilterList([...skusFilterList]);
      dispatch(clearSkuList());
      setData([]);
      dispatch(
        setPageProps({
          popUpShow: false,
          selectedSku: target.value,
          skuDescription: "",
          skuFilterList: skusFilterList,
          data: [],
          dataLoaded: false,
        })
      );
      setSelectedMethods([]);
      setDespatchDateRange([]);
      setFilterData({
        method: "none",
        carrier: "none",
        includes: [],
        startDate: null,
        endDate: null,
        regionList: null,
        despatch: "Despatch",
        service: "none",
      });
      return;
    }
    let filterSkusList = await skusFilterList.filter(
      (sku: any) =>
        sku.Item_Code.toUpperCase().includes(target.value.toUpperCase()) ||
        sku.Item_Description.toUpperCase().includes(target.value.toUpperCase())
    );
    setSkuFilterList([...filterSkusList]);
    setSkuDescription("");
    dispatch(clearSkuList());
    setData([]);
    setPopUpShow(true);
    dispatch(
      setPageProps({
        skuFilterList: [...filterSkusList],
        selectedSku: target.value,
        skuDescription: "",
        data: [],
        popUpShow: true,
      })
    );
  };

  const onBack = () => {
    setShow(false);
    dispatch(
      setPageProps({
        fullListLoaded: false,
        show: false,
      })
    );
  };

  return (
    <UserDashboard>
      <h1
        className=" font-bold text-center"
        style={{
          fontSize: "1.5rem",
        }}
      >
        Product Fixed Routing: By Region
      </h1>
      {!show ? (
        <div className={styles.wrapper}>
          <div className={styles.content}>
            <div className={styles.header}>
              <div className={styles.buttonsGroup}>
                <AppButton
                  data-testId="PFRBR_savebtn"
                  className={`lg:h-8 font-bold rounded text-center ${styles.buttonInHeader} xsm:w-28 xsm:h-9 lg:w-30 lg:h-10 tracking-wide mt-5 position-absolute top-1 z-50`}
                  onClick={onSave}
                  style={{
                    // color:
                    //   !enableSave || isLoading || CUDDisabled
                    //     ? "darkgray"
                    //     : theme?.white,
                    borderRadius: "4px",
                    position: "absolute",
                    // background:
                    //   !enableSave || isLoading || CUDDisabled
                    //     ? "#6172ee"
                    //     : theme?.primaryNight,
                    right: "200px",
                  }}
                  disabled={!enableSave || isLoading || CUDDisabled}
                  loading={isLoading}
                  title="Save"
                />
                <AppButton
                  className={`${styles.buttonInHeader} xsm:w-28 xsm:h-9 lg:w-40 lg:h-10 font-bold tracking-wide mt-5 position-absolute top-1 z-50`}
                  onClick={() => {
                    setShow(true);
                    dispatch(setPageProps({ show: true }));
                  }}
                  style={{
                    borderRadius: "4px",
                    position: "absolute",
                    right: "20px",
                  }}
                  data-testId="show-full-list-button"
                  title="Show Full List"
                />
              </div>
            </div>
            <Form
              data-testid="form"
              noValidate
              validated={validated}
              onSubmit={onSave}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "start",
              }}
            >
              <Row className={`${styles.createUserFormRow}`}>
                <Col md={12} className="position-relative">
                  <div
                    className="sku-popup position-absolute"
                    style={{
                      zIndex: 999,
                      top: "40px",
                      left: "60px",
                      borderColor: "#b9b9b9",
                      borderStyle: "double",
                      borderWidth: 1,
                      maxWidth: 500,
                    }}
                    hidden={!popUpShow}
                  >
                    <InfinityTable
                      onRow={(record: any, rowIndex: any) => {
                        return {
                          onClick: () => onAddSku(record),
                        };
                      }}
                      pageSize={100}
                      loadingIndicator={loadMoreContent()}
                      rowKey={"Item_Code"}
                      size={"small"}
                      bordered={true}
                      pagination={false}
                      columns={skusColumns}
                      dataSource={skuFilterList}
                      style={{ width: "600px" }}
                      data-testid="sku-filter-list"
                      scroll={{ y: "300px" }}
                    />
                  </div>
                  <Form.Group
                    as={Row}
                    className="mr-5 "
                    controlId="role"
                    style={{ alignSelf: "start" }}
                  >
                    <Form.Label style={{ width: "60px", marginTop: "7px" }}>
                      SKU:
                    </Form.Label>
                    <Form.Control
                      data-testId="PFRBR_searchInput"
                      style={{ width: "250px" }}
                      className={styles.formItem}
                      name="text"
                      value={selectedSku}
                      onChange={onChangeSku}
                      required
                      disabled={loader}
                      // onPaste={onChangeSku}
                    />

                    <Form.Label style={{ width: "400px", marginTop: "7px" }}>
                      {loader ? (
                        <>
                          <Spin
                            //@ts-ignore
                            tip={
                              <span className="inline-block ml-2">
                                Please wait loading skus ...
                              </span>
                            }
                            style={{ display: "flex", flexDirection: "row" }}
                          />
                        </>
                      ) : (
                        skuDescription
                      )}
                    </Form.Label>
                  </Form.Group>
                </Col>
              </Row>
              <Row
                className={"mt-2"}
                style={{
                  marginLeft: "47px",
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <Form.Group
                  controlId="role"
                  style={{ alignSelf: "start", width: 200, padding: 0 }}
                >
                  <Form.Label
                    style={{
                      marginTop: "7px",
                    }}
                    data-testId="PFRBR_POSTCODEREGION"
                  >
                    Post Code Region
                  </Form.Label>
                  <Form.Select
                    style={{ height: "40px" }}
                    value={filterData.regionList || ""}
                    name="code"
                    required
                    onChange={({ target }) => {
                      handleChange(target.value, "regionList");
                    }}
                    disabled={!skuDescription || loader || CUDDisabled}
                  >
                    <option value="" key={-1}></option>
                    {postCodeRegionInSlice.map((item: any, index: any) => (
                      <option value={item.id} key={index}>
                        {item.name}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    Select Post Code Region
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group
                  controlId="role"
                  style={{
                    alignSelf: "start",
                    width: 150,
                    marginLeft: 2,
                    padding: 0,
                  }}
                >
                  <Form.Label
                    data-testId="PFRBR_carrier"
                    style={{ marginTop: "7px" }}
                  >
                    Carrier
                  </Form.Label>
                  <Form.Select
                    data-testId="PFRBR_SELECT_CARRIER"
                    style={{ height: "40px" }}
                    name="carrier"
                    required
                    onChange={({ target }) => {
                      handleChange(target.value, "carrier");
                    }}
                    value={filterData.carrier}
                    disabled={
                      !skuDescription ||
                      loader ||
                      CUDDisabled ||
                      !filterData.regionList
                    }
                  >
                    <option value="none" key={-1}>
                      None
                    </option>
                    {carriers?.map((item: any, index: any) => (
                      <option key={index} value={item.code}>
                        {item.name}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    Select Carrier
                  </Form.Control.Feedback>
                </Form.Group>
                {/* <Form.Group
                  controlId="role"
                  style={{
                    alignSelf: "start",
                    width: 150,
                    marginLeft: 2,
                    padding: 0,
                  }}
                >
                  <Form.Label style={{ marginTop: "7px" }}>Service</Form.Label>
                  <Form.Select
                    style={{ height: "40px" }}
                    name="carrier"
                    required
                    onChange={({ target }) => {
                      handleChange(target.value, "service");
                    }}
                    value={filterData.service || "select option"}
                    disabled={filterData.carrier == "none" || CUDDisabled}
                  >
                    <option value="none" key={-1}>
                      None
                    </option>
                    {_.sortBy(
                      carriersServices[filterData.carrier],
                      "Description"
                    ).map((item: any, index: any) => {
                      return (
                        <option key={index} value={item.Id}>
                          {item.Description}
                        </option>
                      );
                    })}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    Select Service
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group
                  controlId="role"
                  style={{
                    alignSelf: "start",
                    width: 300,
                    marginLeft: 2,
                    padding: 0,
                  }}
                >
                  <Form.Label style={{ marginTop: "7px" }}>Method</Form.Label>
                  <Form.Select
                    style={{ height: "40px" }}
                    name="carrier"
                    required
                    onChange={({ target }) => {
                      handleChange(target.value, "method");
                    }}
                    value={filterData.method}
                    disabled={
                      filterData.carrier == "none" || loader || CUDDisabled
                    }
                  >
                    <option value="none" key={-1}>
                      None
                    </option>
                    {selectedMethods.map((item: any, index: any) => (
                      <option value={item.Id} key={index}>
                        {item.CarrierMethodDescription}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    Select Method
                  </Form.Control.Feedback>
                </Form.Group> */}
                <Form.Group
                  controlId="role"
                  style={{ alignSelf: "start", width: 200, padding: 0 }}
                >
                  <Form.Label
                    data-testId="PFRBR_Despatch"
                    style={{ marginTop: "7px" }}
                  >
                    Despatch
                  </Form.Label>
                  <Form.Select
                    data-testId="PFRBR_SelectDespatch"
                    style={{ height: "40px", marginLeft: 2 }}
                    value={filterData.despatch || "Despatch"}
                    name="despatch"
                    required
                    onChange={({ target }) => {
                      handleChange(target.value, "despatch");
                    }}
                    disabled={true}
                  >
                    {[{ name: "Despatch", code: "Despatch" }].map(
                      (item: any, index: any) => (
                        <option
                          selected={item.code === "Despatch"}
                          value={item.code}
                          key={index}
                        >
                          {item.name}
                        </option>
                      )
                    )}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    Select Despatch
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group
                  controlId="role"
                  style={{
                    alignSelf: "start",
                    width: 300,
                    marginLeft: 4,
                    padding: 0,
                  }}
                >
                  <Form.Label style={{ marginTop: "7px" }}>
                    Effective Date From / To
                  </Form.Label>
                  {showRangePicker ? (
                    <RangePicker
                      size={"large"}
                      value={despatchDateRange as [Moment, Moment]}
                      format={dateFormat}
                      onChange={(dates: any) => {
                        if (!dates) {
                          setDespatchDateRange(null);
                          setFilterData({
                            ...filterData,
                            startDate: null,
                            endDate: null,
                          });
                          return;
                        }
                        if (dates) {
                          const [startDate, endDate] = dates;
                          if (moment(startDate).isSame(endDate)) {
                            setDespatchDateRange([startDate, null]);
                            Message(
                              "danger",
                              "End date must be greater than start date"
                            );
                            return;
                          } else {
                            handleChange(dates, "date");
                          }
                        }
                      }}
                      disabled={
                        // filterData.service == "none" ||
                        // filterData.method == "none" ||
                        loader || CUDDisabled || filterData.carrier === "none"
                      }
                      disabledDate={(current) => {
                        let customDate = moment()
                          .add(1, "days")
                          .format(dateFormat);
                        return (
                          current && current <= moment(customDate, dateFormat)
                        );
                      }}
                    />
                  ) : (
                    <Spin style={{ display: "block" }} />
                  )}
                  <Form.Control.Feedback type="invalid">
                    Select Effective Date
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>
              <Row className="mt-2" style={{ marginLeft: "47px" }}>
                <Col md={12} style={{ paddingLeft: "0px" }}>
                  <Col className="mt-2" style={{}}>
                    <Button
                      className="xsm:h-9 lg:h-10 tracking-wide mr-3 text-black"
                      disabled={
                        filterData.carrier === "none" ||
                        !filterData.despatch ||
                        !filterData.endDate ||
                        !filterData.startDate ||
                        // filterData.method === "none" ||
                        !filterData.regionList ||
                        // !filterData.service ||
                        !selectedSku ||
                        !!error ||
                        CUDDisabled
                      }
                      onClick={() => onAdd()}
                      style={{
                        background:
                          filterData.carrier === "none" ||
                          !filterData.despatch ||
                          !filterData.endDate ||
                          !filterData.startDate ||
                          // filterData.method === "none" ||
                          !filterData.regionList ||
                          // !filterData.service ||
                          !selectedSku ||
                          !!error ||
                          CUDDisabled
                            ? "#ddeff4"
                            : "#A7CBF2",
                        borderColor: "#122f30 !important",
                        border: "2px solid !important",
                        borderRadius: "4px",
                        color: "#2c7d8d",
                      }}
                    >
                      Add
                    </Button>
                    <Button
                      className="xsm:h-9 lg:h-10 tracking-wide mr-3 text-black"
                      style={{
                        background: !removeItemIDs.length
                          ? "#ddeff4"
                          : "#A7CBF2",
                        borderColor: "#122f30 !important",
                        border: "2px solid !important",
                        borderRadius: "4px",
                        color: "#2c7d8d",
                      }}
                      disabled={!removeItemIDs.length || CUDDisabled}
                      onClick={() => onRemove()}
                    >
                      Remove
                    </Button>
                    {error ? (
                      <span style={{ color: "red" }}>{error}</span>
                    ) : null}
                    {carrierStatusLoader ? (
                      <span>Checking Carrier Status ... </span>
                    ) : null}
                  </Col>
                  <div className="mt-2">
                    <ByRegionTable
                      columns={columns}
                      dataSource={data}
                      loading={skuDetailsLoader}
                      pagination={false}
                    />
                  </div>
                </Col>
              </Row>
            </Form>
          </div>
        </div>
      ) : (
        <ByRegionFullTable data={data} onBack={onBack} />
      )}
    </UserDashboard>
  );
};

export default DispatchReturns;
