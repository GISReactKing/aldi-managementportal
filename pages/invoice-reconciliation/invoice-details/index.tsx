import { InfinityTable } from "antd-table-infinity";
import { Input, Tag, Space, Typography, Spin, message, Checkbox } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { RootStateOrAny, useSelector, useDispatch } from "react-redux";
import _ from "lodash";
import moment from "moment";
import { CSVLink } from "react-csv";
import styles from "../index.module.scss";
import UserDashboard from "../../../components/UserDashboard";
import { removeNavTab } from "../../../redux/slices/navTabs";

import {
  deleteInvoiceSummaryDetail,
  fetchInvoiceSummaryDetail,
  acceptRejectInvoiceDetail,
  fetchInvoiceSummaryDetailExport,
  putSummaryID,
  undoInvoiceDetail,
  clearInvoiceSummaryDetail,
  setSourceData as setSourceDataRedux,
} from "../../../redux/slices/SummarySlice";
import AppModal from "../../../components/Modal";
import { DeleteIconInModal } from "../../../components/Icons";
import InvoiceAcceptReject from "../../../components/Modals/InvoiceAcceptReject";
import { IUser } from "../../../redux/slices/usersSlice";
import { ComaSeparator } from "../../../utils/ComaSeparator";
import { AppButton } from "../../../components/AppButton";
import { PaginationFunc } from "../../../utils/PaginationFunc";
import { checkingDisableOfAppButton } from "../../../utils/CheckingStatus";
import useAppSelector from "../../../hooks/useAppSelector";
import { ISummaryDetail } from "../../../redux/slices/SummarySlice";
import {
  getColumnSearchProps,
  getColumnDateSearchProps,
  getColumnDropSearchProps,
} from "../../../utils/TableColumnFilter";
const { Text } = Typography;

const InvoiceReconciliation = () => {
  const messageKey = "updatable";
  const csvLink = useRef() as any;
  const [view, setView] = useState<string>("customerSelection");
  const [selectedRows, setSelectedRows] = useState<any>([]);
  const [selectedRowsData, setSelectedRowsData] = useState<any>([]);
  const [page, setPage] = useState(1) as any;
  const [limit, setLimit] = useState(10) as any;
  const [data, setData] = useState<any>([]);
  const [paginationCount, setPaginationCount] = useState([]) as any;
  const [detailID, setDetailID] = useState<any>([]);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [stateSummaryId, setSummaryID] = useState<any>([]);
  let params;
  if (typeof window !== "undefined") {
    params = new URLSearchParams(window?.location?.search) as any;
  }
  const summaryID = stateSummaryId || params?.get("id");
  const [searchString, setSearchString] = useState<string>("");
  const [minValue, setMinValue] = useState<number | null>(null);
  const [maxValue, setMaxValue] = useState<number | null>(null);
  const [modalShow, setModalShow] = useState("");
  const [searchData, setSearchData] = useState<any>({});
  const [minMaxError, setMinMaxError] = useState<boolean>(false);
  const [csvData, setCsvData] = useState<any>([]);
  const [loader, setLoader] = useState<boolean>(false);
  const [statusSummary, setStatusSummary] = useState<string>("");
  const [invoiceNumber, setInvoiceNumber] = useState<string>("");
  const [filename, setFilename] = useState<string>("");
  const [carrier, setCarrier] = useState<string>("");
  const [totalCarrier, setTotalCarrier] = useState<number | null>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [searchText, setSearchText] = useState<string>("");
  const [searchedColumn, setSearchedColumn] = useState<string>("");
  const [exportingData, setExportingData] = useState<boolean>();
  const searchInputRef = useRef() as any;

  const router = useRouter();
  const dispatch = useDispatch();
  const setSourceData = (data: any) => dispatch(setSourceDataRedux(data));

  const navTabs: any = useSelector(
    ({ navTabs }: RootStateOrAny) => navTabs.navTabs
  );
  const currentUser = useSelector(
    ({ users }: RootStateOrAny) => users.currentUser
  );

  const sourceDataRedux = useAppSelector(
    (state) => state?.invoiceSummary?.sourceData || []
  );

  const getSummaryID = useSelector(
    ({ invoiceSummary }: RootStateOrAny) => invoiceSummary.summaryID
  );
  const sourceData = sourceDataRedux?.[summaryID] || [];

  console.log(
    "SummaryId",
    summaryID,
    "sourceData",
    sourceData,
    "sourceRedux",
    sourceDataRedux
  );
  const summaryDetailData = useSelector(
    ({ invoiceSummary }: RootStateOrAny) => invoiceSummary.summaryInvoiceDetail
  );

  const paginationEntityCount = useSelector(
    ({ invoiceSummary }: RootStateOrAny) =>
      invoiceSummary.detailPaginationEntityCount
  );

  const summaryDetailDataExport = useSelector(
    ({ invoiceSummary }: RootStateOrAny) =>
      invoiceSummary.summaryInvoiceDetailExport
  );

  const getInvoiceNumber = useSelector(
    ({ invoiceSummary }: RootStateOrAny) => invoiceSummary.invoiceNumber
  );

  const getFileName = useSelector(
    ({ invoiceSummary }: RootStateOrAny) => invoiceSummary.filename
  );

  const getCarrierName = useSelector(
    ({ invoiceSummary }: RootStateOrAny) => invoiceSummary.carrierName
  );

  const getTotalCarrier = useSelector(
    ({ invoiceSummary }: RootStateOrAny) => invoiceSummary.totalCarrier
  );

  const summaryStatus = useSelector(
    ({ invoiceSummary }: RootStateOrAny) => invoiceSummary.summaryStatus
  );

  const totalSummaryDetail: number = useSelector(
    ({ invoiceSummary }: RootStateOrAny) => invoiceSummary.totalSummaryDetail
  );

  const loading: any = useSelector(
    ({ invoiceSummary }: RootStateOrAny) => invoiceSummary.detailLoader
  );

  const allSummary = useSelector(
    ({ invoiceSummary }: RootStateOrAny) => invoiceSummary.summaryInvoice
  );

  const onCheckChangeFunc = (rowData: any) => {
    if (selectedRows.includes(rowData?.detailsID)) {
      let newArr = selectedRows?.filter(
        (detailsID: any) => detailsID != rowData?.detailsID
      );
      setSelectedRows([...newArr]);
    } else {
      setSelectedRows([...selectedRows, rowData?.detailsID]);
    }
    setTimeout(() => {
      console.log("selectedRows", selectedRows);
    }, 3000);
  };

  const columnsExample = [
    {
      title: (
        <div style={{ justifyContent: "center" }} className="text-12">
          <Text className={styles.headerTitle}>Select</Text>
        </div>
      ),
      render: (data: any) => (
        <div className="flex justify-center align-center">
          <Checkbox
            checked={selectedRows?.includes(data?.detailsID)}
            onChange={() => onCheckChangeFunc(data)}
          />
        </div>
      ),
      dataIndex: "",
      key: "",
      className: "table-header-invoice-col",
      width: 60,
    },
    {
      title: (
        <div style={{ justifyContent: "center" }} className="text-12">
          <Text className={styles.headerTitle}>Date</Text>
        </div>
      ),
      sorter: (a: any, b: any) => a.date.localeCompare(b.date),
      ...getColumnDateSearchProps(
        "date",
        searchInputRef,
        { searchText, setSearchText },
        { searchedColumn, setSearchedColumn }
      ),
      render: (date: string) => moment(date).format("DD/MM/YYYY"),
      dataIndex: "date",
      key: "date",
      className: "table-header-invoice-col",
      width: 100,
    },
    {
      title: (
        <Space direction="vertical" className="text-12">
          <Text className={styles.headerTitle}>Status</Text>
        </Space>
      ),
      sorter: (a: any, b: any) => a.status.localeCompare(b.status),
      ...getColumnDropSearchProps(
        "status",
        searchInputRef,
        { searchText, setSearchText },
        { searchedColumn, setSearchedColumn },
        [
          {
            text: "Query",
            value: "Rejected",
          },
        ]
      ),
      dataIndex: "status",
      key: "status",
      width: 100,
      className: "table-header-invoice-col",
      render: (status: string | number) => {
        let color = "transparent";

        switch (status) {
          case "Rejected":
            color = "red";
            break;
        }

        return (
          <Tag
            color={status === "Imported" ? "transparent" : color}
            key={status}
            style={{ borderRadius: "5px" }}
          >
            {status === "Rejected" ? "Query" : ""}
          </Tag>
        );
      },
    },
    {
      title: (
        <Space direction="vertical" className="text-12">
          <Text className={styles.headerTitle}>Service</Text>
        </Space>
      ),
      sorter: (a: any, b: any) => a.service.localeCompare(b.service),
      ...getColumnSearchProps(
        "service",
        searchInputRef,
        { searchText, setSearchText },
        { searchedColumn, setSearchedColumn }
      ),
      dataIndex: "service",
      key: "service",
      width: 100,
      className: "table-header-invoice-col",
    },
    {
      title: (
        <Space className="text-left history text-12" direction="vertical">
          <Text className={styles.headerTitle}>Consignment</Text>
          <Text className={styles.headerTitle}>No</Text>
        </Space>
      ),
      sorter: (a: any, b: any) =>
        a.consignmentNo.localeCompare(b.consignmentNo),
      ...getColumnSearchProps(
        "consignmentNo",
        searchInputRef,
        { searchText, setSearchText },
        { searchedColumn, setSearchedColumn }
      ),
      dataIndex: "consignmentNo",
      key: "consignmentNo",
      // render: (consignmentNo: string | number) => (
      //   <Link href={""}>{consignmentNo}</Link>
      // ),
      width: 160,
      className: "table-header-invoice-col",
    },
    {
      title: (
        <Space className="text-left history text-12" direction="vertical">
          <Text className={styles.headerTitle}>Order</Text>
          <Text className={styles.headerTitle}>Reference</Text>
        </Space>
      ),
      sorter: (a: any, b: any) =>
        a.orderReference?.localeCompare(b.orderReference),
      ...getColumnSearchProps(
        "orderReference",
        searchInputRef,
        { searchText, setSearchText },
        { searchedColumn, setSearchedColumn }
      ),
      dataIndex: "orderReference",
      key: "orderReference",
      width: 130,
      className: "table-header-invoice-col",
      render: (orderReference: any) => (
        <div className="text-right">
          <span>{orderReference || ""}</span>
        </div>
      ),
    },
    {
      title: (
        <div className="flex flex-column text-12">
          <Text className={styles.headerTitle}>Parcel</Text>
          <Text className={styles.headerTitle}>Count</Text>
        </div>
      ),
      sorter: (a: any, b: any) => a.parcelCount - b.parcelCount,
      ...getColumnSearchProps(
        "parcelCount",
        searchInputRef,
        { searchText, setSearchText },
        { searchedColumn, setSearchedColumn }
      ),
      dataIndex: "parcelCount",
      key: "parcelCount",
      width: 100,
      className: "table-header-invoice-col",
      render: (parcelCount: string | number) => (
        <div className="text-right">
          <span>{parcelCount}</span>
        </div>
      ),
    },
    {
      title: (
        <div className="flex flex-column align-center text-12">
          <Text className={styles.headerTitle}>Base</Text>
          <Text className={styles.headerTitle}>Cost</Text>
        </div>
      ),
      sorter: (a: any, b: any) => a.baseCost - b.baseCost,
      ...getColumnSearchProps(
        "baseCost",
        searchInputRef,
        { searchText, setSearchText },
        { searchedColumn, setSearchedColumn }
      ),
      dataIndex: "baseCost",
      key: "baseCost",
      className: "table-header-invoice-col",
      render: (baseCost: string | number) => (
        <div className="text-right">
          <span>£ {ComaSeparator((+baseCost).toFixed(2))}</span>
        </div>
      ),
      width: 90,
    },
    {
      title: (
        <div className="flex flex-column text-12">
          <Text className={styles.headerTitle}>Base</Text>
          <Text className={styles.headerTitle}>Surcharge</Text>
        </div>
      ),
      sorter: (a: any, b: any) => a.baseSurcharge - b.baseSurcharge,
      ...getColumnSearchProps(
        "baseSurcharge",
        searchInputRef,
        { searchText, setSearchText },
        { searchedColumn, setSearchedColumn }
      ),
      dataIndex: "baseSurcharge",
      key: "baseSurcharge",
      className: "table-header-invoice-col",
      render: (baseSurcharge: string | number) => (
        <div className="text-right">
          <span>£ {ComaSeparator((+baseSurcharge).toFixed(2))}</span>
        </div>
      ),
      width: 120,
    },
    {
      title: (
        <div className="flex flex-column text-12">
          <Text className={styles.headerTitle}>Total </Text>
          <Text className={styles.headerTitle}>Cost</Text>
        </div>
      ),
      sorter: (a: any, b: any) => a.totalCost - b.totalCost,
      ...getColumnSearchProps(
        "totalCost",
        searchInputRef,
        { searchText, setSearchText },
        { searchedColumn, setSearchedColumn }
      ),
      dataIndex: "totalCost",
      key: "totalCost",
      className: "table-header-invoice-col",
      render: (totalCost: string | number) => (
        <div className="text-right font-bold">
          <span>£ {ComaSeparator((+totalCost).toFixed(2))}</span>
        </div>
      ),
      width: 90,
    },
    {
      title: (
        <div className="flex flex-column text-12">
          <Text className={styles.headerTitle}>Invoiced</Text>
          <Text className={styles.headerTitle}>Cost</Text>
        </div>
      ),
      sorter: (a: any, b: any) => a.invoicedCost - b.invoicedCost,
      ...getColumnSearchProps(
        "invoicedCost",
        searchInputRef,
        { searchText, setSearchText },
        { searchedColumn, setSearchedColumn }
      ),
      dataIndex: "invoicedCost",
      key: "invoicedCost",
      className: "table-header-invoice-col",
      render: (invoicedCost: string | number) => (
        <div className="text-right">
          <span>£ {ComaSeparator((+invoicedCost).toFixed(2))}</span>
        </div>
      ),
      width: 110,
    },
    {
      title: (
        <div className="flex flex-column text-12">
          <Text className={styles.headerTitle}>Invoiced</Text>
          <Text className={styles.headerTitle}>Surcharge</Text>
        </div>
      ),
      sorter: (a: any, b: any) => a.invoicedSurcharge - b.invoicedSurcharge,
      ...getColumnSearchProps(
        "invoicedSurcharge",
        searchInputRef,
        { searchText, setSearchText },
        { searchedColumn, setSearchedColumn }
      ),
      dataIndex: "invoicedSurcharge",
      key: "invoicedSurcharge",
      className: "table-header-invoice-col",
      render: (invoicedSurcharge: string | number) => (
        <div className="text-right">
          <span>£ {ComaSeparator((+invoicedSurcharge).toFixed(2))}</span>
        </div>
      ),
      width: 120,
    },
    {
      title: (
        <div className="flex flex-column text-12">
          <Text className={styles.headerTitle}>Invoiced</Text>
          <Text className={styles.headerTitle}> Total</Text>
        </div>
      ),
      sorter: (a: any, b: any) => a.invoicedTotal - b.invoicedTotal,
      ...getColumnSearchProps(
        "invoicedTotal",
        searchInputRef,
        { searchText, setSearchText },
        { searchedColumn, setSearchedColumn }
      ),
      dataIndex: "invoicedTotal",
      key: "invoicedTotal",
      className: "table-header-invoice-col",
      render: (invoicedTotal: string | number) => (
        <div className="text-right font-bold ">
          <span>{`£ ${ComaSeparator((+invoicedTotal).toFixed(2))}`}</span>
        </div>
      ),
      width: 110,
    },
    {
      title: (
        <div className="text-12">
          <Text className={styles.headerTitle}>Diff</Text>
        </div>
      ),
      sorter: (a: any, b: any) => a.difference - b.difference,
      ...getColumnSearchProps(
        "difference",
        searchInputRef,
        { searchText, setSearchText },
        { searchedColumn, setSearchedColumn }
      ),
      dataIndex: "difference",
      key: "difference",
      className: "table-header-invoice-col",
      render: (difference: string | number) => {
        let color = "";
        const diff = Number(difference);
        if (!Number.isNaN(diff) && diff < 0) color = "green";
        if (!Number.isNaN(diff) && diff > 0) color = "red";
        return (
          <div className="text-right text-12">
            <Tag color={color} key={difference}>
              {Number(difference).toFixed(2)}
            </Tag>
          </div>
        );
      },
      width: 80,
    },
  ];

  const removeTab = (link: any) => {
    const updatedTabs = _.filter(navTabs, (o: any) => o.link !== link);
    dispatch(removeNavTab({ navTab: updatedTabs }));
  };
  useEffect(() => {
    const params = new URLSearchParams(window.location.search) as any;
    let queryObj = {
      id: params?.get("id") ? params.get("id") : null,
      status: params?.get("status") ? params.get("status") : null,
      filename: params?.get("filename") ? params.get("filename") : null,
      invoiceNumber: params?.get("invoice") ? params.get("invoice") : null,
      carrierName: params?.get("carrier") ? params.get("carrier") : null,
      totalCarrier: params?.get("totalCarrier")
        ? params.get("totalCarrier")
        : null,
    } as any;
    console.log({
      queryObj,
      params,
      getCarrierName,
      getInvoiceNumber,
      getFileName,
    });
    if (
      !queryObj.id ||
      !queryObj.status ||
      !queryObj.filename ||
      // !queryObj.invoiceNumber ||
      !queryObj.carrierName
    ) {
      if (getSummaryID) {
        setSummaryID(Number(getSummaryID));
      }
      if (summaryStatus) {
        setStatusSummary(summaryStatus);
      }
      if (getInvoiceNumber) {
        setInvoiceNumber(`${getInvoiceNumber}`);
      }
      if (getFileName) {
        setFilename(getFileName);
      }
      if (getCarrierName) {
        setCarrier(getCarrierName);
      }
      if (getTotalCarrier) {
        setTotalCarrier(getTotalCarrier);
      }
      return;
    }
    dispatch(
      fetchInvoiceSummaryDetail({
        page,
        // limit: paginationEntityCount,
        limit: queryObj.totalCarrier,
        username: currentUser?.username,
        summaryID: Number(queryObj.id),
      })
    );
    dispatch(
      putSummaryID({
        summaryID: Number(queryObj.id),
        status: queryObj.status ? queryObj.status : "",
        filename: queryObj.filename,
        invoiceNumber: queryObj.invoiceNumber,
        carrierName: queryObj.carrierName,
        totalCarrier: queryObj.totalCarrier,
      })
    );
    setSummaryID(Number(queryObj.id));
    setInvoiceNumber(queryObj.invoiceNumber || "");
    setFilename(queryObj.filename);
    setCarrier(queryObj.carrierName);
    setTotalCarrier(queryObj.totalCarrier);
  }, []);

  useEffect(() => {
    setData(summaryDetailData);
    if (summaryDetailData && summaryDetailData.length) {
      setPaginationCount(PaginationFunc(totalSummaryDetail));
    }
  }, [summaryDetailData]);

  useEffect(() => {
    if (summaryStatus) {
      setStatusSummary(summaryStatus);
    }
  }, [summaryStatus]);

  useEffect(() => {
    let tempData = JSON.parse(JSON.stringify(summaryDetailData));
    if (searchString) {
      tempData = _.filter(tempData, (o: any) => {
        const service = o.service.toLowerCase().split(".")[0];
        const consignmentNo = o.consignmentNo.toLowerCase().split(".")[0];
        const orderReference = o.orderReference.toLowerCase().split(".")[0];
        const searchTextLowerCase = searchString.toLowerCase();
        return (
          service.includes(searchTextLowerCase) ||
          consignmentNo.includes(searchTextLowerCase) ||
          orderReference.includes(searchTextLowerCase)
        );
      });
    }

    if (minValue !== null && maxValue !== null && minValue < maxValue) {
      tempData = _.filter(tempData, (o: any) => {
        return o.difference >= minValue && o.difference <= maxValue;
      });
    }

    // if (tempData?.length) {
    //   // setSourceData(tempData.slice(0, 100));
    //   if (summaryID)
    //     setSourceData({ ...sourceDataRedux, [summaryID]: tempData });

    //   console.log("sourceDataRedux", sourceDataRedux);
    // }

    let headerElem = document.getElementsByClassName("site-layout-background");

    if (headerElem.length) {
      // @ts-ignore
      headerElem[0].style.height = "calc(100vh - 160px)";
    }
  }, [searchString, summaryID, summaryDetailData, minValue, maxValue]);

  useEffect(() => {
    let headerElem = document.getElementsByClassName("site-layout-background");
    function onScroll() {
      const { scrollHeight, clientHeight } = headerElem[0];
      setScrollTop(headerElem[0].scrollTop);
      if (headerElem[0].scrollTop + clientHeight >= scrollHeight - 100) {
        setSourceData({
          ...sourceDataRedux,
          [summaryID]: [
            ...sourceData.slice(sourceData.length, sourceData.length + 100),
          ],
        });
      }
    }

    headerElem[0].addEventListener("scroll", onScroll);
    return () => headerElem[0].removeEventListener("scroll", onScroll);
  }, [scrollTop]);

  const onSelectChange = (selectedRowKeys: string[], item: any) => {
    if (selectedRowKeys.length > 0) {
      setSelectedRows(selectedRowKeys);
      setSelectedRowsData(item);
    } else {
      setSelectedRows([]);
      setSelectedRowsData([]);
    }
  };

  const rowSelection = {
    selectedRowKeys: selectedRows,
    onChange: onSelectChange,
  };

  const onDeleteHandle = () => {
    dispatch(
      deleteInvoiceSummaryDetail({
        detailID: detailID,
        username: currentUser?.username,
      })
    );
    setDetailID("");
    setShowDeleteModal(false);
  };

  const onRejectAccept = async (val: string, reason: string) => {
    try {
      setLoader(true);
      if (val === "Undo Exception") {
        await dispatch(
          undoInvoiceDetail({
            detailIDs: selectedRows,
            username: currentUser?.username,
          }) as any
        );
      } else {
        await dispatch(
          acceptRejectInvoiceDetail({
            value: "reject",
            detailIDs: selectedRows,
            reason,
            username: currentUser?.username,
            summaryID: summaryID,
          }) as any
        );
      }
      // await dispatch(
      //   acceptRejectInvoiceSummary({
      //     summary: val.toLowerCase(),
      //     summaryID,
      //     reason,
      //     username: currentUser?.username,
      //   }) as any
      // );
      await dispatch(
        fetchInvoiceSummaryDetail({
          page: page,
          limit,
          username: currentUser?.username,
          summaryID: summaryID,
        }) as any
      );

      setModalShow("");
      setLoader(false);
      setSelectedRows([]);
      setSelectedRowsData([]);
    } catch (e) {
      setModalShow("");
      setLoader(false);
    }
  };

  const fetchCsvData = async () => {
    setExportingData(true);
    message.loading({
      content: "Exporting Please Wait...",
      key: messageKey,
    });
    const result: any = await dispatch(
      fetchInvoiceSummaryDetailExport({
        page,
        limit: totalSummaryDetail,
        username: currentUser?.username,
        summaryID: summaryID,
      }) as any
    );
    console.log({ result });
    if (result?.payload?.details && result.payload.details.length > 0) {
      let resultData: any = [];
      result.payload.details.map((item: any) => {
        resultData.push({
          date: moment(item.date).format("DD/MM/YYYY"),
          status: item.status === "Rejected" ? "Query" : "",
          client: item.client,
          service: item.service,
          consignmentNo: item.consignmentNo,
          orderReference: item.orderReference,
          parcelCount: item.parcelCount,
          baseCost: `£ ${Number(item.baseCost).toFixed(2)}`,
          baseSurcharge: `£ ${Number(item.baseSurcharge).toFixed(2)}`,
          totalCost: `£ ${Number(item.totalCost).toFixed(2)}`,
          invoicedCost: `£ ${Number(item.invoicedCost).toFixed(2)}`,
          invoicedSurcharge: `£ ${Number(item.invoicedSurcharge).toFixed(2)}`,
          invoicedTotal: `£ ${Number(item.invoicedTotal).toFixed(2)}`,
          difference: item.difference,
          reason: item.reason,
        });
      });
      setCsvData(resultData);
      setExportingData(false);
      message.success({
        content: "Exported!",
        key: messageKey,
      });
      csvLink?.current?.link?.click();
    }
  };

  const makeHeaders = (label: string, key: string) => {
    const headers: any = [
      { [label]: "Date", [key]: "date" },
      { [label]: "Status", [key]: "status" },
      // { [label]: "Client", [key]: "client" },
      { [label]: "Service", [key]: "service" },
      { [label]: "Consignment No", [key]: "consignmentNo" },
      { [label]: "Order Reference", [key]: "orderReference" },
      { [label]: "Parcel Count", [key]: "parcelCount" },
      { [label]: "Base Cost", [key]: "baseCost" },
      { [label]: "Base Surcharge", [key]: "baseSurcharge" },
      { [label]: "Total Cost", [key]: "totalCost" },
      { [label]: "Invoiced Cost", [key]: "invoicedCost" },
      { [label]: "Invoiced Surcharge", [key]: "invoicedSurcharge" },
      { [label]: "Invoiced Total", [key]: "invoicedTotal" },
      { [label]: "Difference", [key]: "difference" },
      // { [label]: "Reason", [key]: "reason" },
    ];
    return headers;
  };

  const handleMaxValue = (e: any) => {
    setMinMaxError(false);
    setMaxValue(e.target.value ? Number(e.target.value) : null);

    if (minValue !== null && Number(e.target.value) <= minValue) {
      setMinMaxError(true);
      return;
    }
  };

  const handleMinValue = (e: any) => {
    setMinMaxError(false);
    setMinValue(e.target.value ? Number(e.target.value) : null);

    if (maxValue !== null && Number(e.target.value) >= maxValue) {
      setMinMaxError(true);
      return;
    }
  };

  const CUDDisabled = checkingDisableOfAppButton(currentUser, "edit", [
    // "Carriage: Claims & Invoicing",
    "Invoice Reconciliation",
  ]);

  const loadMoreContent = () => (
    <div
      style={{
        textAlign: "center",
        paddingTop: 40,
        paddingBottom: 40,
        border: "1px solid #e8e8e8",
      }}
    >
      <Spin tip={<span className="ml-5">Loading Invoice Details...</span>} />
    </div>
  );
  let minHeight1600;

  if (typeof window !== "undefined") {
    minHeight1600 = window.matchMedia("(min-height: 1600px)");
  }

  let scroll = null;

  if (minHeight1600?.matches) {
    scroll = { y: "calc(90vh - 180px)" };
  }

  return (
    <UserDashboard
      style={{
        paddingRight: 24,
        paddingLeft: 24,
        paddingTop: 24,
        height: "calc(100vh - 165px)",
        // overflow: "scroll",
      }}
      contentParentStyle={{
        paddingBottom: "1px" || "20vh",
      }}
    >
      <div className="pl-3 pr-3 pb-3">
        <div className="filter">
          <label className="search">
            <span className="mr-3">Search:</span>
            <Input
              className={"text-mono min-w-150 bg-off-white xsm:w-52 md:w-72"}
              type="text"
              name={"search"}
              onChange={(e) => setSearchString(e.target.value)}
            />
          </label>
          <label className="difference ml-5">
            <div className="position-relative">
              <span className="mr-3">Difference:</span>
              <Input
                className={`text-mono bg-off-white xsm:w-20 md:w-20 ${
                  minMaxError ? styles.minMaxError : ""
                }`}
                type="number"
                name={"min"}
                placeholder="Min"
                onChange={(e) => handleMinValue(e)}
              />
              <Input
                className={`text-mono bg-off-white xsm:w-20 md:w-20 ml-2 ${
                  minMaxError ? styles.minMaxError : ""
                }`}
                type="number"
                name={"max"}
                placeholder="Max"
                onChange={(e) => handleMaxValue(e)}
              />
              {minMaxError ? (
                <p className="text-danger position-absolute top-8">
                  <small>Max value must be greater than min value</small>
                </p>
              ) : (
                ""
              )}
            </div>
          </label>

          {/* <label className="per-page ml-3">
            <PaginationDropdown
              count={paginationCount}
              onPagination={(e) => onChangePagination(e)}
              value={paginationEntityCount}
            />
          </label> */}

          <label className="per-page" style={{ marginLeft: 250 }}>
            <span className="mr-3 font-bold">
              {`${carrier !== "null" ? carrier : ""}: ${
                filename !== "null" ? filename : ""
              }: ${
                invoiceNumber && invoiceNumber !== "null" ? invoiceNumber : ""
              }`}
            </span>
          </label>
        </div>
        <AppButton
          className={`${styles.backButton} xsm:w-28 xsm:h-9 lg:w-30 lg:h-10 tracking-wide mt-5 position-absolute top-1`}
          title="Back"
          onClick={() => {
            removeTab(router.pathname);
            router.back();
            setSourceData({});
            dispatch(clearInvoiceSummaryDetail());
          }}
        />
        <AppButton
          className={`${
            selectedRows.length
              ? styles.activeConfirmButton
              : styles.inactiveConfirmButton
          } ${
            styles.confirmException
          } xsm:w-28 xsm:h-9 lg:w-30 lg:h-10 tracking-wide mt-5 position-absolute top-1`}
          title="Confirm Exception"
          disabled={loading || !selectedRows.length || CUDDisabled}
          onClick={() => setModalShow("Confirm Exception")}
          loading={loading || false}
        />
        <AppButton
          className={`${
            selectedRows.length
              ? styles.activeConfirmButton
              : styles.inactiveConfirmButton
          } ${
            styles.confirmUndo
          } xsm:w-28 xsm:h-9 lg:w-30 lg:h-10 tracking-wide mt-5 position-absolute top-1 right-8`}
          title="Undo Exception"
          disabled={loading || !selectedRows.length || CUDDisabled}
          onClick={() => setModalShow("Undo Exception")}
          loading={loading || false}
        />
        <AppButton
          className={`${styles.exportButton} xsm:w-28 xsm:h-9 lg:w-30 lg:h-10 tracking-wide mt-5 position-absolute top-1 right-4`}
          title="Export"
          onClick={() => fetchCsvData()}
          disabled={exportingData || loading}
          loading={loading || false}
        />
        <CSVLink
          data={csvData}
          headers={makeHeaders("label", "key")}
          filename={"invoice-details.csv"}
          ref={csvLink}
        />
      </div>
      <div className="z-0">
        {loading && !sourceData?.length ? (
          loadMoreContent()
        ) : (
          <InfinityTable
            pageSize={100}
            loadingIndicator={loadMoreContent()}
            rowKey={"detailsID"}
            size={"small"}
            loading={loading}
            bordered={true}
            pagination={false}
            columns={columnsExample}
            dataSource={sourceData}
            scroll={scroll ? scroll : { y: "calc(82vh - 180px)" }}
          />
        )}
      </div>
      <AppModal
        primaryBtnTitle="Delete"
        showModal={showDeleteModal}
        onCloseModal={setShowDeleteModal}
        icon={<DeleteIconInModal />}
        onPrimaryHandle={() => onDeleteHandle()}
      >
        <h1 className="text-center text-xmd text-mono-label">
          Delete Invoice Detail
        </h1>
        <p className="mt-3 mb-3 text-center max-w-19 px-1 text-xsm leading-5 text-mono">
          Are you sure you want to delete this invoice detail?
        </p>
      </AppModal>

      {modalShow ? (
        <InvoiceAcceptReject
          show={true}
          loader={loading}
          onHide={() => setModalShow("")}
          handleClick={(reason) => onRejectAccept(modalShow, reason)}
          currentUser={currentUser}
          modalText={modalShow}
          reason={modalShow === "Confirm Exception" ? "Rejected" : ""}
        />
      ) : null}
    </UserDashboard>
  );
};

export default InvoiceReconciliation;
