import { Button, Checkbox, Select, DatePicker, Spin, Typography } from "antd";
import DispatchTableData from "../../../components/Table";
import SelectCarrier from "../../../components/Select";
import styles from "./styles.module.scss";
import moment from "moment";
import { AppButton } from "../../../components/AppButton";
import {
  setDetailPageProps,
  fetchCategoryDetail,
  fetchServices,
  fetchCarriersServices,
  fetchCarrierStatus,
  setCategoryDetailData as setCategoryDetailDataRedux,
} from "../../../redux/slices/productFixedRoutingDespatch";
import { fetchCarriers } from "../../../redux/slices/productFixingRoutingByRegionSlice";
import { default as React, useEffect, useState, useRef } from "react";
import { RootStateOrAny, useDispatch, useSelector } from "react-redux";
import { Col, Modal, Row, FormLabel } from "react-bootstrap";
import { useReactToPrint } from "react-to-print";
import { ComaSeparator } from "../../../utils/ComaSeparator";
import _ from "lodash";
import { Message } from "../../../utils/message";
import useAppSelector from "../../../hooks/useAppSelector";

const { Title } = Typography;

const { Option } = Select;
const { RangePicker } = DatePicker;

const dateFormat = "DD/MM/YYYY";

export interface Props {
  onHide: () => void;
  showModal: boolean;
  formData: any;
  scroll: any;
  skuList: string[];
  onConfirm: (data: any) => void;
  onClear: (data: any) => void;
  CUDDisabled: boolean;
}

const ProductFixedRouting = ({
  showModal,
  onHide,
  formData,
  onConfirm,
  onClear,
  scroll,
  skuList,
  CUDDisabled,
}: Props) => {
  const dispatch = useDispatch();
  const [despatchDateRange, setDespatchDateRange] = useState<any>([]);
  const [clientDespatchServiceIDs, setClientDespatchServiceIDs] = useState([]);
  const [clientDespatchMethodIDs, setClientDespatchMethodIDs] = useState([]);
  const [filterData, setFilterData] = useState({
    service: 0,
    method: "none",
    methodName: "",
    serviceName: "",
    carrier: "none",
    includes: [] as any,
    customPreferenceIDs: [] as any,
    startDate: null,
    endDate: null,
  });
  const [confirmProductFixedRoutingList, setConfirmProductFixedRoutingList] =
    useState<any>([]);
  const [allCarriers, setAllCarriers] = useState<any>([]);
  const [selectedMethods, setSelectedMethods] = useState<any>([]);
  const [tableData, setTableData] = useState<any>([]);
  const [scrollTop, setScrollTop] = useState(0);
  const categoryDetailData = useAppSelector((state) => {
    const dta = state?.productFixedRoutingDespatch?.categoryDetail;

    return Array.isArray(dta) ? dta : [];
  });
  const setCategoryDetailData = (data: any[]) =>
    dispatch(setCategoryDetailDataRedux(data));
  const [activeErrorMessage, setActiveErrorMessage] = useState(false);
  const [carrierStatusLoader, setCarrierStatusLoader] =
    useState<boolean>(false);
  const [toggleRangePicker, setToggleRangePicker] = useState(true);
  const componentToPrintRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentToPrintRef.current,
  });

  console.log("categoryDetailData", categoryDetailData, "tableData", tableData);

  const headerCol = [
    {
      children: [
        {
          title: "SKU & Description",
          dataIndex: "Item_Code",
          key: "Item_Code",
          render: (column: any, record: any) => {
            return <span>{`${column}: ${record.Item_Description}`}</span>;
          },
        },
      ],
    },
    {
      children: [
        {
          align: "center",
          width: 100,
          title: "Multi-Box",
          dataIndex: "Multi-Box_Item",
          key: "Multi-Box_Item",
          render: (column: any) => {
            let className = "";

            if (column == "Y" || column == "Yes") {
              className = "text-danger";
            }
            return <span className={className}>{column}</span>;
          },
        },
      ],
    },
    {
      title: "Despatch: Current Fixed Routing",
      children: [
        {
          title: "Carrier",
          dataIndex: "CarrierCode",
          key: "CarrierCode",
          render: (column: any, record: any) => {
            let className = "";

            if (record?.RegionList?.length) {
              className = "text-danger";
            }
            return (
              <span className={className}>
                {!record?.EffectiveDateStart || !record?.EffectiveDateEnd
                  ? ""
                  : record?.RegionList?.length
                  ? "By Region"
                  : column}
              </span>
            );
          },
          width: 150,
        },
        {
          title: "From",
          dataIndex: "EffectiveDateStart",
          key: "EffectiveDateStart",
          render: (date: any) =>
            date ? moment(date).format(dateFormat) : null,
          width: 120,
        },
        {
          title: "To",
          dataIndex: "EffectiveDateEnd",
          key: "EffectiveDateEnd",
          render: (date: any) =>
            date ? moment(date).format(dateFormat) : null,
          width: 120,
        },
        {
          align: "center",
          title: "Include",
          dataIndex: "include",
          key: "include",
          width: 90,
          render: (include: any, record: any) => {
            return (
              <Checkbox
                onChange={(e) =>
                  handleIncludes(
                    e,
                    record.Item_Code,
                    record.ProductFixedRoutingID
                  )
                }
                disabled={record.ReadOnly || CUDDisabled}
                checked={
                  filterData.includes.includes(record.Item_Code) &&
                  !record.ReadOnly
                }
              />
            );
          },
        },
      ],
    },
    {
      children: [
        {
          title: "Stock Qty",
          dataIndex: "Stock_on_Hand",
          key: "Stock_on_Hand",
          width: 100,
          align: "center",
          render: (item: number) => (
            <div className="text-right">
              <span>{item >= 0 ? ComaSeparator(item) : ""}</span>
            </div>
          ),
        },
      ],
    },
    {
      children: [
        {
          title: "KG",
          dataIndex: "Item_Weight",
          key: "Item_Weight",
          align: "center",
          width: 100,
          render: (item: number) => (
            <div className="text-right">
              <span>{item >= 0 ? ComaSeparator(item.toFixed(2)) : ""}</span>
            </div>
          ),
        },
      ],
    },
    {
      children: [
        {
          title: "Max Dim",
          dataIndex: "Max_Dim",
          key: "Max_Dim",
          width: 100,
          align: "center",
          render: (item: number) => (
            <div className="text-right">
              <span>{item >= 0 ? ComaSeparator(item) : ""}</span>
            </div>
          ),
        },
      ],
    },
    {
      children: [
        {
          title: "Length",
          dataIndex: "Item_Width",
          key: "Item_Width",
          align: "center",
          width: 100,
          render: (item: number) => (
            <div className="text-right">
              <span>{item >= 0 ? ComaSeparator(item) : ""}</span>
            </div>
          ),
        },
      ],
    },
    {
      children: [
        {
          title: "Depth",
          dataIndex: "Item_Depth",
          key: "Item_Depth",
          align: "center",
          width: 100,
          render: (item: number) => (
            <div className="text-right">
              <span>{item >= 0 ? ComaSeparator(item) : ""}</span>
            </div>
          ),
        },
      ],
    },
    {
      children: [
        {
          title: "Height",
          dataIndex: "Item_Height",
          key: "Item_Height",
          align: "center",
          width: 100,
          render: (item: number) => (
            <div className="text-right">
              <span>{item >= 0 ? ComaSeparator(item) : ""}</span>
            </div>
          ),
        },
      ],
    },
    // {
    //   children: [
    //     {
    //       title: "Service",
    //       dataIndex: "ClientDespatchServiceName",
    //       key: "ClientDespatchServiceName",
    //       align: "center",
    //       width: 100,
    //       render: (item: number) => (
    //         <div className="text-right">
    //           <span>{item || ""}</span>
    //         </div>
    //       ),
    //     },
    //   ],
    // },
    // {
    //   children: [
    //     {
    //       title: "Method",
    //       dataIndex: "ClientDespatchMethodCode",
    //       key: "ClientDespatchMethodCode",
    //       align: "center",
    //       width: 100,
    //       render: (item: number) => (
    //         <div className="text-right">
    //           <span>{item || ""}</span>
    //         </div>
    //       ),
    //     },
    //   ],
    // },
  ];

  const categoryDetail = useSelector(
    ({ productFixedRoutingDespatch }: RootStateOrAny) =>
      productFixedRoutingDespatch.categoryDetail
  );

  const categoryDetailLoader = useSelector(
    ({ productFixedRoutingDespatch }: RootStateOrAny) =>
      productFixedRoutingDespatch.categoryDetailLoader
  );

  const services = useSelector(
    ({ productFixedRoutingDespatch }: RootStateOrAny) =>
      productFixedRoutingDespatch.services
  );

  const carriersServices = useSelector(
    ({ productFixedRoutingDespatch }: RootStateOrAny) =>
      productFixedRoutingDespatch.carriersServices
  );

  const carriers = useSelector(
    ({ productFixingRoutingByRegion }: RootStateOrAny) =>
      productFixingRoutingByRegion.carriers
  );

  const detailDespatchState = useSelector(
    ({ productFixedRoutingDespatch }: RootStateOrAny) =>
      productFixedRoutingDespatch.detailDespatchState
  );

  useEffect(() => {
    console.log({ detailDespatchState });
    if (detailDespatchState.pageLoaderFirstTime) {
      dispatch(
        fetchCategoryDetail({
          code: formData.category,
          ClientCode: "ALDI",
          ForRegions: formData.include_skus_fixed,
          ExistingFixedRouting: formData.show_products_fixed,
          SkuList: skuList,
        })
      );
      dispatch(fetchServices());
      dispatch(fetchCarriers());
      dispatch(fetchCarriersServices());
    } else {
      setDespatchDateRange(detailDespatchState.despatchDateRange);
      setClientDespatchServiceIDs(detailDespatchState.clientDespatchServiceIDs);
      setClientDespatchMethodIDs(detailDespatchState.clientDespatchMethodIDs);
      setFilterData(detailDespatchState.filterData);
      setAllCarriers(detailDespatchState.allCarriers);
      setSelectedMethods(detailDespatchState.selectedMethods);
      setTableData(detailDespatchState.tableData);
      setCategoryDetailData(detailDespatchState.categoryDetailData);
      setScrollTop(detailDespatchState.scrollTop);
      setConfirmProductFixedRoutingList(
        detailDespatchState.confirmProductFixedRoutingList
      );
      console.log(
        "🚀 ~ file: product-fixed-routing.tsx ~ line 359 ~ useEffect ~ detailDespatchState.confirmProductFixedRoutingList",
        detailDespatchState.confirmProductFixedRoutingList
      );
    }
  }, []);

  useEffect(() => {
    if (!detailDespatchState.filterData.includes.length) {
      if (categoryDetail) {
        setCategoryDetailData([...categoryDetail]);
        const allReadOnlySKU = categoryDetail.filter(
          (item: any) => !item.ReadOnly
        );
        const allSKUCode = allReadOnlySKU.map((item: any) => item.Item_Code);
        let allCustomPreferenceID = categoryDetail.filter(
          (item: any) => !item.ReadOnly && item.ProductFixedRoutingID
        );
        console.log(
          "🚀 ~ file: product-fixed-routing.tsx ~ line 374 ~ useEffect ~ allCustomPreferenceID",
          allCustomPreferenceID
        );
        allCustomPreferenceID = allCustomPreferenceID.map(
          (item: any) => item.ProductFixedRoutingID
        );
        console.log(
          "🚀 ~ file: product-fixed-routing.tsx ~ line 377 ~ useEffect ~ allCustomPreferenceID",
          allCustomPreferenceID
        );
        const allClientDespatchServiceID = categoryDetail.map(
          (item: any) => item.ClientDespatchServiceID
        );
        const allClientDespatchMethodID = categoryDetail.map(
          (item: any) => item.ClientDespatchMethodID
        );
        if (services.length) {
          let filterDataCopy = {
            service: 0,
            method: "none",
            methodName: "",
            serviceName: "none",
            carrier: "none",
            includes: allSKUCode,
            customPreferenceIDs: allCustomPreferenceID,
            startDate: null,
            endDate: null,
          };
          setFilterData(filterDataCopy);
          dispatch(
            setDetailPageProps({
              filterData: filterDataCopy,
            })
          );
        }
        setClientDespatchServiceIDs(allClientDespatchServiceID);
        setClientDespatchMethodIDs(allClientDespatchMethodID);
        setDespatchDateRange([]);
        dispatch(
          setDetailPageProps({
            clientDespatchServiceIDs: allClientDespatchServiceID,
            clientDespatchMethodIDs: allClientDespatchMethodID,
            despatchDateRange: [],
          })
        );

        if (categoryDetail.length) {
          let tableDataCopy = categoryDetail.slice(0, 100);
          setTableData(tableDataCopy);
          dispatch(
            setDetailPageProps({
              tableData: tableDataCopy,
              categoryDetailData: categoryDetail,
            })
          );
        }

        let headerElem = document.getElementsByClassName(
          "site-layout-background"
        );

        if (headerElem.length) {
          // @ts-ignore
          headerElem[0].style.height = "calc(100vh - 160px)";
          // @ts-ignore
          headerElem[0].style.overflow = "scroll";
        }
      }
      if (carriers) {
        setAllCarriers(carriers);
        dispatch(
          setDetailPageProps({
            allCarriers: carriers,
          })
        );
      }
    }
  }, [categoryDetail, services, carriersServices]);

  useEffect(() => {
    let headerElem = document.getElementsByClassName("site-layout-background");
    function onScroll() {
      if (!skuList.length) {
        const { scrollHeight, clientHeight } = headerElem[0];
        console.log(scrollHeight, clientHeight);

        setScrollTop(headerElem[0].scrollTop);
        if (headerElem[0].scrollTop + clientHeight >= scrollHeight - 100) {
          let tableDataCopy = [
            ...tableData,
            ...categoryDetailData.slice(
              tableData.length,
              tableData.length + 100
            ),
          ];
          setTableData(tableDataCopy);
          dispatch(
            setDetailPageProps({
              tableData: tableDataCopy,
            })
          );
        }
      }
    }

    headerElem[0].addEventListener("scroll", onScroll);
    return () => headerElem[0]?.removeEventListener("scroll", onScroll);
  }, [scrollTop, skuList]);

  const handleConfirm = () => {
    onHide();
  };

  const handleIncludes = (e: any, sku: any, customPrefID?: number) => {
    let includes = [...filterData.includes];
    let customPreferenceIDs = [...filterData.customPreferenceIDs];
    if (e.target.checked) {
      includes = [...includes, sku];
      customPreferenceIDs = [...customPreferenceIDs, customPrefID || undefined];
    } else {
      console.log({
        filterData,
        sku: filterData.includes.indexOf(sku),
      });
      includes.splice(includes.indexOf(sku), 1);
      customPreferenceIDs.splice(includes.indexOf(sku), 1);
    }
    let filterDataCopy = {
      ...filterData,
      includes: includes,
      customPreferenceIDs: customPreferenceIDs,
    };
    console.log({ filterDataCopy });
    setFilterData(filterDataCopy);
    dispatch(
      setDetailPageProps({
        filterData: filterDataCopy,
      })
    );
  };

  const handleFiltering = async (isClear = false) => {
    if (!isClear) {
      setCarrierStatusLoader(true);
      let filterDataCopy = {
        ...filterData,
        service: 0,
        method: "none",
        carrier: "none",
        serviceName: "",
      };
      setFilterData(filterDataCopy);
      setDespatchDateRange([]);
      dispatch(
        setDetailPageProps({
          filterData: filterDataCopy,
          despatchDateRange: [],
        })
      );
      const result: any = await dispatch(
        fetchCarrierStatus(filterData.carrier) as any
      );
      const carrierResult = result?.payload?.data?.clientCarrier;
      console.log(
        "🚀 ~ file: product-fixed-routing.tsx ~ line 532 ~ handleFiltering ~ carrierResult",
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
              moment(moment(dateFrom).format()).isBetween(
                despatchDateRange[0],
                despatchDateRange[1]
              ) ||
              moment(moment(despatchDateRange[0]).format()).isBetween(
                dateFrom,
                dateTo
              ) ||
              moment(moment(despatchDateRange[1]).format()).isBetween(
                dateFrom,
                dateTo
              ) ||
              moment(moment(dateTo).format()).isBetween(
                despatchDateRange[0],
                despatchDateRange[1]
              );
          } else {
            // Need to test this condition
            isExist =
              moment(moment(despatchDateRange[0]).format()).isBefore(
                dateFrom
              ) ||
              moment(moment(despatchDateRange[1]).format()).isAfter(dateTo);
          }
        } else {
          const dateFrom = carrierResult?.secondaryParameters?.effectiveFrom
            ? moment(carrierResult?.secondaryParameters?.effectiveFrom)
            : null;
          if (dateFrom) {
            if (!carrierResult?.secondaryParameters?.active) {
              isExist =
                moment(moment(despatchDateRange[0]).format()).isSameOrAfter(
                  dateFrom
                ) ||
                moment(moment(despatchDateRange[1]).format()).isSameOrAfter(
                  dateFrom
                );
            } else {
              isExist =
                moment(moment(despatchDateRange[0]).format()).isSameOrBefore(
                  dateFrom
                ) ||
                moment(moment(despatchDateRange[1]).format()).isSameOrBefore(
                  dateFrom
                );
            }
          }
        }
      }
      if (isExist) {
        setActiveErrorMessage(true);
        return null;
      }
    }

    let tableDataCopy = [...tableData] as any;
    console.log(
      "categoryDetailDatacategoryDetailData categoryDetailData",
      categoryDetailData
    );
    let categoryDetailDataCopy = Array.isArray(categoryDetailData)
      ? ([...(categoryDetailData || [])] as any[])
      : [];
    tableDataCopy = tableDataCopy.map((item: any) => {
      let data: any = {
        ...item,
      };
      if (!item.ReadOnly) {
        if (
          filterData.includes.indexOf(item.Item_Code) !== -1 &&
          !item.ReadOnly
        ) {
          data = {
            ...data,
            CarrierCode: !isClear ? filterData.carrier : null,
            ClientCode: "ALDI",
            Sku: item.Item_Code,
            ClientDespatchServiceID: !isClear ? filterData.service : null,
            ClientDespatchMethodID: !isClear ? filterData.method : null,
            ClientDespatchServiceName: !isClear ? filterData.serviceName : null,
            ClientDespatchMethodCode: !isClear ? filterData.methodName : null,
          };
          if (despatchDateRange?.length) {
            data = {
              ...data,
              EffectiveDateStart: !isClear
                ? moment(despatchDateRange[0]).format()
                : null,
              EffectiveDateEnd: !isClear
                ? moment(despatchDateRange[1]).format()
                : null,
            };
          } else if (isClear) {
            data = {
              ...data,
              EffectiveDateStart: null,
              EffectiveDateEnd: null,
            };
          }
          return data;
        }
      }
      return data;
    });

    categoryDetailDataCopy = categoryDetailDataCopy.map((item: any) => {
      let data: any = {
        ...item,
      };
      if (!item.ReadOnly) {
        if (
          filterData.includes.indexOf(item.Item_Code) !== -1 &&
          !item.ReadOnly
        ) {
          data = {
            ...data,
            CarrierCode: !isClear ? filterData.carrier : null,
            ClientCode: "ALDI",
            Sku: item.Item_Code,
            ClientDespatchServiceID: !isClear ? filterData.service : null,
            ClientDespatchMethodID: !isClear ? filterData.method : null,
            ClientDespatchServiceName: !isClear ? filterData.serviceName : null,
            ClientDespatchMethodCode: !isClear ? filterData.methodName : null,
          };
          if (despatchDateRange?.length) {
            data = {
              ...data,
              EffectiveDateStart: !isClear
                ? moment(despatchDateRange[0]).format()
                : null,
              EffectiveDateEnd: !isClear
                ? moment(despatchDateRange[1]).format()
                : null,
            };
          } else if (isClear) {
            data = {
              ...data,
              EffectiveDateStart: null,
              EffectiveDateEnd: null,
            };
          }
          return data;
        }
      }
      return data;
    });

    const productFixedRoutingList = filterData.includes.map(
      (sku: string, index: number) => {
        let item: any = {
          ClientCode: "ALDI",
          CarrierCode: filterData.carrier,
          Sku: sku,
          // ClientDespatchServiceID: filterData.service,
          // ClientDespatchMethodID: filterData.method,
          Type: "Despatch",
        };
        if (despatchDateRange?.length) {
          item = {
            ...item,
            EffectiveDateStart: !isClear
              ? moment(despatchDateRange[0]).format()
              : null,
            EffectiveDateEnd: !isClear
              ? moment(despatchDateRange[1]).format()
              : null,
          };
        }
        const isCustomerPreference = categoryDetailData.find(
          (customPreferenceItem: any) =>
            sku === customPreferenceItem.Item_Code &&
            customPreferenceItem.ProductFixedRoutingID &&
            !customPreferenceItem.ReadOnly
        );
        console.log({ isCustomerPreference });
        if (isCustomerPreference?.ProductFixedRoutingID) {
          item = {
            ...item,
            ProductFixedRoutingID: isCustomerPreference.ProductFixedRoutingID,
          };
        }
        return item;
      }
    );
    let newProductFixedRoutingList = [...confirmProductFixedRoutingList];
    let indexList = [] as number[];
    await newProductFixedRoutingList.map((item: any, index: number) => {
      if (filterData.includes.indexOf(item.Sku) !== -1) {
        indexList.push(index);
      }
    });
    console.log({
      indexList,
      newProductFixedRoutingList,
      filterData: filterData.includes,
    });
    if (indexList.length) {
      await indexList
        .sort()
        .reverse()
        .map((index: number) => {
          let spliceData = newProductFixedRoutingList.splice(index, 1);
          console.log({ index, spliceData });
        });
    }

    newProductFixedRoutingList = [
      ...newProductFixedRoutingList,
      ...productFixedRoutingList,
    ];

    console.log(
      "🚀 ~ file: product-fixed-routing.tsx ~ line 673 ~ handleFiltering ~ newProductFixedRoutingList",
      newProductFixedRoutingList
    );
    if (!isClear) {
      onConfirm({
        ProductFixedRouting: newProductFixedRoutingList,
        RegionList: formData.include_skus_fixed,
      });
      setConfirmProductFixedRoutingList(newProductFixedRoutingList);
    } else {
      onClear({
        ProductFixedRouting: productFixedRoutingList,
        RegionList: formData.include_skus_fixed,
        clientDespatchMethodIDs,
        clientDespatchServiceIDs,
      });
      setConfirmProductFixedRoutingList(newProductFixedRoutingList);
    }
    setTableData(tableDataCopy);
    setCategoryDetailData(categoryDetailDataCopy);
    dispatch(
      setDetailPageProps({
        tableData: tableDataCopy,
        categoryDetailData: categoryDetailDataCopy,
        confirmProductFixedRoutingList: newProductFixedRoutingList,
      })
    );
  };

  const handleRangeDatePickerDispatch = (dates: any, dateStrings: any) => {
    if (!dates) {
      dispatch(
        setDetailPageProps({
          despatchDateRange: [],
        })
      );
      return setDespatchDateRange([]);
    }

    setActiveErrorMessage(false);
    setDespatchDateRange(dates);
    dispatch(
      setDetailPageProps({
        despatchDateRange: dates,
      })
    );
  };

  const checkConfirmAvailable = () => {
    return !(
      // filterData.method != "none" &&
      (
        filterData.carrier != "none" &&
        filterData.includes.length &&
        despatchDateRange?.length
      )
    );
  };

  const handleChangeFilterDate = (value: any, name: any) => {
    setActiveErrorMessage(false);
    if (name == "service") {
      let carrier = carriersServices[filterData.carrier].filter(
        (item: any) => item.Id == value
      );
      let filterDataCopy = {
        ...filterData,
        method: "none",
        [name]: value,
        serviceName: carrier[0].Name,
      };
      let allMethods = carrier[0].ClientDespatchMethods.filter(
        (method: any) => method.CarrierCode === filterData.carrier
      );
      setFilterData(filterDataCopy);
      allMethods = _.sortBy(allMethods, "CarrierMethodDescription");
      setSelectedMethods(allMethods);
      dispatch(
        setDetailPageProps({
          filterData: filterDataCopy,
          selectedMethods: allMethods,
        })
      );
    }

    if (name == "carrier") {
      let filterDataCopy = {
        ...filterData,
        service: 0,
        method: "none",
        [name]: value,
        serviceName: "",
      };
      setFilterData(filterDataCopy);
      setDespatchDateRange([]);
      dispatch(
        setDetailPageProps({
          filterData: filterDataCopy,
          despatchDateRange: [],
        })
      );
    }
    if (name == "method") {
      const methodObj = selectedMethods.find(
        (method: any) => method.Id == value
      );
      let filterDataCopy = {
        ...filterData,
        [name]: value,
        methodName: methodObj.CarrierMethodCode,
      };
      setFilterData(filterDataCopy);
      dispatch(
        setDetailPageProps({
          filterData: filterDataCopy,
        })
      );
    }

    setToggleRangePicker(false);
    setTimeout(() => {
      setToggleRangePicker(true);
    }, 1);
  };

  const rangePickerComp = () => (
    <RangePicker
      style={{ width: 300, height: 34, borderRadius: 3 }}
      // @ts-ignore
      value={despatchDateRange}
      format={dateFormat}
      onChange={(dates, dateStrings) => {
        if (!dates) {
          setDespatchDateRange(null);
          return;
        }
        if (dates) {
          const [startDate, endDate] = dates;
          if (moment(startDate).isSame(endDate)) {
            setDespatchDateRange([startDate, null]);
            Message("danger", "End date must be greater than start date");
            return;
          } else {
            handleRangeDatePickerDispatch(dates, dateStrings);
          }
        }
      }}
      disabledDate={(current) => {
        let customDate = moment().add(1, "days").format(dateFormat);
        return current && current <= moment(customDate, dateFormat);
      }}
      disabled={
        // filterData.service == 0 ||
        // filterData.method === "none" ||
        filterData.carrier === "none" || CUDDisabled
      }
    />
  );

  return (
    <>
      <AppButton
        className={`${styles.buttonInHeader} xsm:w-28 xsm:h-9 lg:w-30 lg:h-10 tracking-wide mt-5 position-absolute top-1 right-40 z-50`}
        onClick={handlePrint}
        title="Print"
      />

      <div className="flex flex-col scroll-page">
        <div className="flex justify-center w-full">
          {/* <span style={{ width: 950 }}> */}
          <span style={{ width: 480 }}>
            <h5 className="text-sm font-bold">Despatch</h5>
            <p className="mt-2">
              Clear Current Fixed Routing:
              <Button
                size="small"
                className={`${styles.buttonInContent} xsm:h-7 lg:h-7 font-bold tracking-wide font-bold tracking-wide px-4 ml-4`}
                onClick={() => handleFiltering(true)}
                disabled={!filterData.includes.length || CUDDisabled}
              >
                Clear
              </Button>
            </p>
            <span className="flex flex-col mt-4 border p-2 rounded">
              <span className="flex">
                <div className="flex flex-col">
                  <label>Carrier</label>
                  <SelectCarrier
                    width={150}
                    placeholder="select option"
                    defaultValue={"none"}
                    onChange={(e) => handleChangeFilterDate(e, "carrier")}
                    value={filterData.carrier}
                    dropdownClassName="select-carrier-dropdown"
                    disabled={CUDDisabled}
                  >
                    <Option value="none">None</Option>
                    {allCarriers.map((item: any, index: any) => (
                      <Option key={index} value={item.code}>
                        {item.name}
                      </Option>
                    ))}
                  </SelectCarrier>
                </div>
                {/* <div className="flex flex-col ml-2">
                  <label>Service</label>
                  <SelectCarrier
                    width={150}
                    placeholder="select option"
                    onChange={(e) => handleChangeFilterDate(e, "service")}
                    value={filterData.service || "None"}
                    disabled={filterData.carrier == "none" || CUDDisabled}
                  >
                    {_.sortBy(
                      carriersServices[filterData.carrier],
                      "Name"
                    )?.map((item: any, index: any) => {
                      return (
                        <Option key={index} value={item.Id}>
                          {item.Name}
                        </Option>
                      );
                    })}
                  </SelectCarrier>
                </div>
                <div className="flex flex-col ml-2">
                  <label>Method</label>
                  <SelectCarrier
                    width={300}
                    placeholder="select option"
                    onChange={(e) => handleChangeFilterDate(e, "method")}
                    value={filterData.method}
                    disabled={filterData.service == 0 || CUDDisabled}
                  >
                    <Option value="none">None</Option>

                    {selectedMethods.map((item: any, index: any) => {
                      return (
                        <Option key={index} value={item.Id}>
                          {item.CarrierMethodDescription}
                        </Option>
                      );
                    })}
                  </SelectCarrier>
                </div> */}
                <span className="flex flex-col ml-2">
                  <label>Effective Date From / To</label>
                  {toggleRangePicker ? rangePickerComp() : <Spin />}
                </span>
              </span>

              <p className="mt-4">
                <span>Apply New Fixed Routing</span>
                <Button
                  size="small"
                  className={`${styles.buttonInContent} xsm:h-7 lg:h-7 font-bold tracking-wide px-4 ml-4`}
                  onClick={(e) => handleFiltering()}
                  disabled={
                    checkConfirmAvailable() || activeErrorMessage || CUDDisabled
                  }
                >
                  Confirm
                </Button>
                {activeErrorMessage ? (
                  <span className="ml-4" style={{ color: "red" }}>
                    Warning: The selected Carrier has a Date Range conflict for
                    Active / Inactive
                  </span>
                ) : null}
                {carrierStatusLoader ? (
                  <span className="ml-4">Checking Carrier Status ... </span>
                ) : null}
              </p>
            </span>
          </span>
        </div>

        <div
          className="z-0 scroll-page"
          id="product-routing-table"
          ref={componentToPrintRef}
        >
          <div className={`${styles.formatPrint}`}>
            <div className={`${styles.componentToPrint}`}>
              <div className="d-flex flex-column mb-4 align-items-center">
                <div className=" d-flex justify-end w-100 pr-4 mt-4">
                  <FormLabel>{moment().format("DD/MM/YYYY HH:mm")}</FormLabel>
                </div>
                <Title level={3}>Product Fixed Routing</Title>
              </div>
            </div>
            <div className="mt-4 mr-4 despatch-table" id="despatch-table">
              <DispatchTableData
                rowSelection={false}
                bordered={false}
                pagination={false}
                columns={headerCol}
                dataSource={
                  scroll && Object.keys(scroll)?.length
                    ? tableData
                    : categoryDetailData
                }
                // dataSource={[]}
                loading={categoryDetailLoader}
                className={`pfr-table customTable`}
                scroll={scroll}
                id="despatch-table"
              />
            </div>
          </div>
        </div>

        <Modal
          show={showModal}
          onHide={onHide}
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton className={styles.userModalHeader}>
            <Modal.Title id="contained-modal-title-vcenter">
              Warning
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className={styles.modalBody}>
            <Row>
              <p>
                {" "}
                You are about to Save changes to the Fixed Product Routing
                Parameters. Please select Confirm to continue
              </p>
            </Row>
            <Row className="mt-5">
              <Col className="d-flex justify-content-end">
                <div className={styles.buttonsGroup}>
                  <Button onClick={handleConfirm} className="mr-3">
                    Confirm
                  </Button>
                  <Button className={styles.cancelButton} onClick={onHide}>
                    Cancel
                  </Button>
                </div>
              </Col>
            </Row>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
};

export default ProductFixedRouting;
