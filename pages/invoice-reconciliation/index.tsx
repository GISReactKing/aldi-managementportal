import UserDashboard from "../../components/UserDashboard";
import styles from "./index.module.scss";
import { Input, Tag, Space, Typography, DatePicker } from "antd";
import React, { useEffect, useState, useRef } from "react";
import UserTable from "../../components/Tables/UserTable";
import { useReactToPrint } from "react-to-print";
import {
  DeleteOutlined,
  SearchOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/router";
import InvoiceAcceptReject from "../../components/Modals/InvoiceAcceptReject";
import { RootStateOrAny, useSelector, useDispatch } from "react-redux";
import {
  acceptRejectInvoiceSummary,
  deleteInvoiceSummary,
  fetchInvoiceSummary,
  filterInvoiceSummary,
  fetchCarrierList,
  updateInvoicesPaginationEntityCount,
} from "../../redux/slices/SummarySlice";
import AppModal from "../../components/Modal";
import { DeleteIconInModal } from "../../components/Icons";
import { IUser } from "../../redux/slices/usersSlice";
import { ComaSeparator } from "../../utils/ComaSeparator";
import { AppButton } from "../../components/AppButton";
import { InvoiceReconciliationImportModal } from "../../components/Modals";
import { PaginationFunc } from "../../utils/PaginationFunc";
import _ from "lodash";
import moment from "moment";
import { checkingDisableOfAppButton } from "../../utils/CheckingStatus";
import InvoiceResultTable from "../../components/Modals/InvoiceResultTable";
import { FormLabel } from "react-bootstrap";
import { Message } from "../../utils/message";
import {
  getColumnSearchProps,
  getColumnDateSearchProps,
  getColumnDropSearchProps,
} from "../../utils/TableColumnFilter";
import useAppSelector from "../../hooks/useAppSelector";

interface Props {}

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

const InvoiceReconciliation = (props: Props) => {
  const [summaryID, setSummaryID] = useState<any>([]);
  const [modalShow, setModalShow] = useState("");
  const [page, setPage] = useState(1) as any;
  const [paginationCount, setPaginationCount] = useState([]) as any;
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [filterDates, setFilterDates] = useState([]) as any;
  const [filterDateStrings, setFilterDateStrings] = useState({
    from: "",
    to: "",
  }) as any;
  const [searchString, setSearchString] = useState<string>("");
  const [showImportModal, setShowImportModal] = useState<boolean>(false);
  const [showResultModal, setShowResultModal] = useState<boolean>(false);
  const [importResultData, setImportResultData] = useState<any>([]);
  const [sourceData, setSourceData] = useState<any>([]);
  const [carriers, setCarriers] = useState<any>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [searchedColumn, setSearchedColumn] = useState<string>("");

  const scroll = {
    // x: "max-content",
    // y: "calc(100vh -  355px)",
  };

  const searchInputRef = useRef() as any;
  const componentToPrintRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentToPrintRef.current,
  });

  const router = useRouter();
  const dispatch = useDispatch();

  const writePermission = useAppSelector(
    (state) =>
      !!state?.users?.currentUser?.role?.permissions?.[
        "Carriage: Claims & Invoicing"
      ]?.["Invoice Reconciliation"]?.["Create / Edit"]
  );
  const summaryData = useSelector(
    ({ invoiceSummary }: RootStateOrAny) => invoiceSummary.summaryInvoice
  );

  const loading: IUser[] = useSelector(
    ({ invoiceSummary }: RootStateOrAny) => invoiceSummary.loader
  );

  const paginationEntityCount = useSelector(
    ({ invoiceSummary }: RootStateOrAny) => invoiceSummary.paginationEntityCount
  );

  const currentUser = useSelector(
    ({ users }: RootStateOrAny) => users.currentUser
  );

  const totalSummary: number = useSelector(
    ({ invoiceSummary }: RootStateOrAny) => invoiceSummary.totalSummary
  );

  const carrierList = useSelector(
    ({ invoiceSummary }: RootStateOrAny) => invoiceSummary.carrierList
  );

  const CUDDisabled = checkingDisableOfAppButton(currentUser, "edit", [
    // "Carriage: Claims & Invoicing",
    "Invoice Reconciliation",
  ]);
  const summaryDetailData = useSelector(
    ({ invoiceSummary }: RootStateOrAny) => invoiceSummary.summaryInvoiceDetail
  );

  let minWidth2000;

  let maxWidth2000;

  let dateWidth = 110;

  const columnsData = [
    {
      title: "Import Date",
      sorter: (a: any, b: any) => a.created.localeCompare(b.created),
      // ...getColumnDateSearchProps(
      //   "created",
      //   searchInputRef,
      //   { searchText, setSearchText },
      //   { searchedColumn, setSearchedColumn }
      // ),
      render: (date: string) => moment(date).format("DD/MM/YYYY"),

      dataIndex: "created",
      key: "created",
      width: dateWidth || 100,
    },
    {
      title: "Status",
      sorter: (a: any, b: any) => a.status.localeCompare(b.status),
      ...getColumnDropSearchProps(
        "status",
        searchInputRef,
        { searchText, setSearchText },
        { searchedColumn, setSearchedColumn },
        [
          {
            text: "Approved",
            value: "Accepted",
          },
          {
            text: "Query",
            value: "Rejected",
          },
        ]
      ),
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (status: string | number) => {
        let color = "transparent";
        switch (status) {
          case "Accepted":
            color = "green";
            break;
          case "Rejected":
            color = "red";
            break;
        }
        return (
          <Tag color={color} key={status} style={{ borderRadius: "5px" }}>
            {status === "Accepted"
              ? "Approved"
              : status === "Rejected"
              ? "Query"
              : ""}
          </Tag>
        );
      },
      className: "table-header-invoice-col",
    },
    {
      title: "Filename",
      sorter: (a: any, b: any) => a.filename.localeCompare(b.filename),
      ...getColumnSearchProps(
        "filename",
        searchInputRef,
        { searchText, setSearchText },
        { searchedColumn, setSearchedColumn }
      ),
      dataIndex: "filename",
      key: "filename",
      width: 200,
      className: "table-header-invoice-col",
    },
    {
      title: "Invoice",
      // sorter: (a: any, b: any) =>
      //   a?.invoiceNumber?.localeCompare(b?.invoiceNumber),
      sorter: (a: any, b: any) => b.invoiceNumber - a.invoiceNumber,

      ...getColumnSearchProps(
        "invoiceNumber",
        searchInputRef,
        { searchText, setSearchText },
        { searchedColumn, setSearchedColumn }
      ),
      dataIndex: "invoiceNumber",
      key: "invoiceNumber",
      width: 150,
      className: "table-header-invoice-col",
    },
    {
      title: "Carrier",
      sorter: (a: any, b: any) => a.carrier.localeCompare(b.carrier),
      ...getColumnSearchProps(
        "carrier",
        searchInputRef,
        { searchText, setSearchText },
        { searchedColumn, setSearchedColumn }
      ),
      dataIndex: "carrier",
      key: "carrier",
      width: 120,
      className: "table-header-invoice-col",
    },
    {
      title: "Contract",
      sorter: (a: any, b: any) => a.contract?.localeCompare(b.contract),
      ...getColumnSearchProps(
        "contract",
        searchInputRef,
        { searchText, setSearchText },
        { searchedColumn, setSearchedColumn }
      ),
      dataIndex: "contract",
      key: "contract",
      width: 120,
      className: "table-header-invoice-col",
    },
    {
      title: "Count",
      sorter: (a: any, b: any) => a.consignmentsCount - b.consignmentsCount,
      ...getColumnSearchProps(
        "consignmentsCount",
        searchInputRef,
        { searchText, setSearchText },
        { searchedColumn, setSearchedColumn }
      ),
      dataIndex: "consignmentsCount",
      key: "consignmentsCount",
      width: 80,
      render: (consignmentsCount: number) => {
        return (
          <div className=" text-right">{ComaSeparator(consignmentsCount)}</div>
        );
      },
      className: "table-header-invoice-col",
    },
    {
      title: "Cost",
      sorter: (a: any, b: any) => a.internalCost - b.internalCost,
      ...getColumnSearchProps(
        "internalCost",
        searchInputRef,
        { searchText, setSearchText },
        { searchedColumn, setSearchedColumn }
      ),
      dataIndex: "internalCost",
      key: "internalCost",
      width: 120,
      render: (internalCost: string | number) => (
        <div className="text-right">
          <Text className="text-right font-bold">
            {`£ ${ComaSeparator((+internalCost).toFixed(2))}`}
          </Text>
        </div>
      ),
      className: "table-header-invoice-col",
    },
    {
      title: "Invoiced",
      sorter: (a: any, b: any) => a.invoicedCost - b.invoicedCost,
      ...getColumnSearchProps(
        "invoicedCost",
        searchInputRef,
        { searchText, setSearchText },
        { searchedColumn, setSearchedColumn }
      ),
      dataIndex: "invoicedCost",
      key: "invoicedCost",
      width: 120,
      render: (invoicedCost: string | number) => (
        <div className="text-right">
          <Text className="font-bold">{`£ ${ComaSeparator(
            (+invoicedCost).toFixed(2)
          )}`}</Text>
        </div>
      ),
      className: "table-header-invoice-col",
    },
    {
      title: <div className="text-right">Match</div>,
      sorter: (a: any, b: any) => a.matchNum - b.matchNum,
      ...getColumnSearchProps(
        "matchNum",
        searchInputRef,
        { searchText, setSearchText },
        { searchedColumn, setSearchedColumn }
      ),
      dataIndex: "matchNum",
      key: "matchNum",
      width: 100,
      render: (matchNum: string | number) => (
        <div className="text-right">
          <Text>{matchNum ? `${matchNum}%` : ""}</Text>
        </div>
      ),
      className: "table-header-invoice-col",
    },
    {
      align: "center",
      width: 120,
      dataIndex: "summaryID",
      key: "summaryID",
      render: (item: number, record: any) => {
        return (
          <div className="text-right d-flex justify-content-end">
            <span
              onClick={() => onAction(item, "Accept")}
              hidden={
                record.status == "Accepted" || record.status == "Rejected"
              }
              className={styles.action}
            >
              {
                <CheckCircleOutlined
                  disabled={!writePermission}
                  style={{
                    fontSize: 22,
                    marginRight: "7px",
                    ...(!writePermission
                      ? { color: "gray", opacity: 0.5 }
                      : {}),
                  }}
                />
              }
            </span>

            <Link
              href={`/invoice-reconciliation/invoice-details?id=${item}&status=${
                record.status || ""
              }&invoice=${record.invoiceNumber || ""}&filename=${
                record.filename || ""
              }&carrier=${record.carrier || ""}&totalCarrier=${
                record.consignmentsCount || ""
              }`}
            >
              {<SearchOutlined style={{ fontSize: 22 }} />}
            </Link>
            <span
              onClick={() => {
                if (!CUDDisabled) {
                  setSummaryID(item);
                  setShowDeleteModal(true);
                }
              }}
              className={
                CUDDisabled ? styles.actionDeleteDisabled : styles.actionDelete
              }
            >
              {<DeleteOutlined style={{ fontSize: 22, marginRight: "7px" }} />}
            </span>
          </div>
        );
      },
      className: "table-header-invoice-col",
    },
  ];

  const columnsOnPrint = [
    {
      title: "Import Date",
      sorter: (a: any, b: any) => a.created.localeCompare(b.created),
      render: (created: string) => moment(created).format("DD/MM/YYYY"),
      dataIndex: "created",
      key: "created",
      width: "auto",
    },
    {
      title: "Status",
      sorter: (a: any, b: any) => a.status.localeCompare(b.status),
      dataIndex: "status",
      key: "status",
      width: "auto",
      // align: 'center',
      render: (status: string | number) => {
        let color = "transparent";
        switch (status) {
          case "Accepted":
            color = "green";
            break;
          case "Rejected":
            color = "red";
            break;
        }
        return (
          <Tag color={color} key={status} style={{ borderRadius: "5px" }}>
            {status === "Accepted"
              ? "Approved"
              : status === "Rejected"
              ? "Query"
              : ""}
          </Tag>
        );
      },
    },
    {
      title: "Filename",
      sorter: (a: any, b: any) =>
        a.filename.toLowerCase().localeCompare(b.filename.toLowerCase()),
      dataIndex: "filename",
      key: "filename",
      width: "auto",
    },
    {
      title: "Invoice",
      sorter: (a: any, b: any) =>
        a.invoiceNumber?.localeCompare(b?.invoiceNumber || ""),
      dataIndex: "invoiceNumber",
      key: "invoiceNumber",
      width: "auto",
    },
    {
      title: "Carrier",
      sorter: (a: any, b: any) => a.carrier.localeCompare(b.carrier),
      dataIndex: "carrier",
      key: "carrier",
      width: "auto",
    },
    {
      title: "Contract",
      sorter: (a: any, b: any) => a.contract?.localeCompare(b.contract),
      dataIndex: "contract",
      key: "contract",
      width: "auto",
    },
    {
      title: "Count",
      sorter: (a: any, b: any) => a.consignmentsCount - b.consignmentsCount,
      dataIndex: "consignmentsCount",
      key: "consignmentsCount",
      width: "auto",
      render: (consignmentsCount: number) => {
        return (
          <div className=" text-right">{ComaSeparator(consignmentsCount)}</div>
        );
      },
    },
    {
      title: "Cost",
      sorter: (a: any, b: any) => a.internalCost - b.internalCost,
      dataIndex: "internalCost",
      key: "internalCost",
      width: "auto",
      render: (internalCost: string | number) => (
        <div className="text-right">
          <Text className="text-right font-bold">
            {`£ ${ComaSeparator((+internalCost).toFixed(2))}`}
          </Text>
        </div>
      ),
    },
    {
      title: "Invoiced",
      sorter: (a: any, b: any) => a.invoicedCost - b.invoicedCost,
      dataIndex: "invoicedCost",
      key: "invoicedCost",
      width: "auto",
      render: (invoicedCost: string | number) => (
        <div className="text-right">
          <Text className="font-bold">{`£ ${ComaSeparator(
            (+invoicedCost).toFixed(2)
          )}`}</Text>
        </div>
      ),
    },
    {
      title: <div className="text-right">Match</div>,
      sorter: (a: any, b: any) => a.match.localeCompare(b.match),
      dataIndex: "match",
      key: "match",
      width: "auto",
      render: (match: string | number) => (
        <div className="text-right">
          <Text>{match}</Text>
        </div>
      ),
    },
  ];

  // useEffect(() => {
  //   if (!summaryDetailData?.length) {
  //     dispatch(
  //       fetchInvoiceSummary({
  //         page,
  //         limit: paginationEntityCount,
  //         username: currentUser?.username,
  //       })
  //     );
  //     dispatch(fetchCarrierList({ client: "aldi" }));
  //   }
  // }, [summaryDetailData]);

  useEffect(() => {
    dispatch(
      fetchInvoiceSummary({
        page,
        limit: paginationEntityCount,
        username: currentUser?.username,
      })
    );
    dispatch(fetchCarrierList({ client: "aldi" }));
  }, []);

  const fetchSummary = () => {
    dispatch(
      fetchInvoiceSummary({
        page,
        limit: paginationEntityCount,
        username: currentUser?.username,
      })
    );
  };

  useEffect(() => {
    if (carrierList && carrierList.length) {
      const carrierData = [...carrierList].sort((a: any, b: any) => {
        if (a.name < b.name) {
          return -1;
        }
        if (b.name < a.name) {
          return 1;
        }
        return 0;
      });
      setCarriers(carrierData);
    }
  }, [carrierList]);

  useEffect(() => {
    if (summaryData && summaryData.length) {
      setPaginationCount(PaginationFunc(totalSummary));
    }
  }, [summaryData]);

  useEffect(() => {
    let tempData = JSON.parse(JSON.stringify(summaryData));
    tempData = tempData.sort((a: any, b: any) =>
      b.created.localeCompare(a.created)
    );
    if (searchString) {
      tempData = _.filter(tempData, (o: any) => {
        const filename = o?.filename?.toLowerCase()?.split(".")?.[0];
        const invoiceNumber = o?.invoiceNumber?.toLowerCase() || "";
        const contract = o?.contract?.toLowerCase() || "";

        const searchTextLowerCase = searchString?.toLowerCase();
        return (
          filename?.includes(searchTextLowerCase) ||
          invoiceNumber?.includes(searchTextLowerCase) ||
          contract?.includes(searchTextLowerCase)
        );
      });
    }

    if (filterDates && filterDates?.[1]) {
      tempData = tempData.filter((o: any) => {
        const dateString = moment(o.created).format("YYYY-MM-DD");
        const start = moment(filterDateStrings.from);
        const end = moment(filterDateStrings.to);
        return (
          (start.isSame(dateString) || start.isBefore(dateString)) &&
          (end.isSame(dateString) || end.isAfter(dateString))
        );
      });
    }

    tempData = _.uniq(
      tempData.map((o: any) => moment(o.created).format("DD/MM/YYYY"))
    ).reduce((acc: any, curr: any) => {
      // get all invoices matching the current date
      let invoices = tempData
        .filter((o: any) => moment(o.created).format("DD/MM/YYYY") === curr)
        .sort((a: any, b: any) => a.carrier.localeCompare(b.carrier));

      return [...acc, ...invoices];
    }, []);
    console.log({ setSourceData: tempData });
    setSourceData(tempData);
  }, [searchString, filterDates, summaryData]);

  const handleSearch = (text: string) => {
    // dispatch(filterInvoiceSummary({ page: 1, limit, sort: "created", desc: false, search: text, from: filterDateStrings.from, to: filterDateStrings.to, username: currentUser?.username }));
    setSearchString(text);
  };

  const handleRangeDatePicker = (dates: any, dateStrings: any) => {
    if (dates?.[1]) {
      let from = "";
      if (dateStrings[0]) {
        const fromDateArray = dateStrings[0].split("/");
        fromDateArray.reverse();
        from = fromDateArray.join("-");
      }

      let to = "";
      if (dateStrings[1]) {
        const toDateArray = dateStrings[1].split("/");
        toDateArray.reverse();
        to = toDateArray.join("-");
      }

      // dispatch(filterInvoiceSummary({ page, limit, sort: "created", desc: false, search: searchString, from, to, username: currentUser?.username }));
      setFilterDateStrings({ from, to });
      setFilterDates(dates);
    }
  };

  const onAction = (summaryID: number, val: string) => {
    if (writePermission) {
      setSummaryID(summaryID);
      setModalShow(val);
    }
  };

  const onRejectAccept = async (
    summaryID: number,
    val: string,
    reason: string
  ) => {
    const result = await dispatch(
      acceptRejectInvoiceSummary({
        summary: val.toLowerCase(),
        summaryID,
        reason,
        username: currentUser?.username,
      })
    );
    fetchSummary();
    setModalShow("");
    setSummaryID("");
  };

  const onDeleteHandle = () => {
    dispatch(
      deleteInvoiceSummary({
        summaryID,
        username: currentUser?.username,
      })
    );
    setSummaryID("");
    setShowDeleteModal(false);
  };

  const onChangePagination = (e: any) => {
    dispatch(updateInvoicesPaginationEntityCount({ limit: e }));
    dispatch(
      filterInvoiceSummary({
        page: 1,
        limit: e,
        sort: "created",
        desc: false,
        search: searchString,
        from: filterDateStrings.from,
        to: filterDateStrings.to,
        username: currentUser?.username,
      })
    );
  };

  return (
    <UserDashboard>
      <div className="pl-3 pr-3 pb-3 scroll-page">
        <div className="filter d-flex justify-content-between">
          <div className="left">
            <label className="search">
              <span data-testid="ir_search_label" className="mr-3">
                Search:
              </span>
              <Input
                data-testid="ir_search_input"
                className={"text-mono bg-off-white xsm:w-52 md:w-72"}
                type="text"
                onChange={(e) => handleSearch(e.target.value)}
              />
            </label>
            <label className="dateFilter ml-5">
              <span data-testid="ir_filter_label" className="mr-3">
                Date Filter:
              </span>
              <Space direction="vertical">
                <RangePicker
                  data-testid="ir_filter"
                  format={"DD/MM/YYYY"}
                  value={filterDates}
                  dateRender={(current) => {
                    return (
                      <div className="ant-picker-cell-inner">
                        {current.date()}
                      </div>
                    );
                  }}
                  onChange={(dates, dateStrings) => {
                    if (!dates) {
                      setFilterDates(null);
                      return;
                    }
                    if (dates) {
                      const [startDate, endDate] = dates;
                      // if (moment(startDate).isSame(endDate)) {
                      //   setFilterDates([startDate, null]);
                      //   Message(
                      //     "danger",
                      //     "End date must be greater than start date"
                      //   );
                      //   return;
                      // } else {
                      handleRangeDatePicker(dates, dateStrings);
                      // }
                    }
                  }}
                  disabledDate={(current) => {
                    let customDate = moment()
                      .add(1, "days")
                      .format("DD/MM/YYYY");
                    return (
                      current && current >= moment(customDate, "DD/MM/YYYY")
                    );
                  }}
                />
              </Space>
            </label>
            {/* <label className="per-page ml-0">
              <PaginationDropdown
                count={paginationCount}
                onPagination={(e) => onChangePagination(e)}
                value={paginationEntityCount}
              />
            </label> */}
          </div>
        </div>
        <AppButton
          className={`${styles.buttonInHeader} xsm:w-28 xsm:h-9 lg:w-30 lg:h-10 tracking-wide mt-5 position-absolute top-1 z-50`}
          onClick={handlePrint}
          style={{ right: "155px" }}
          title="Print"
        />
        <AppButton
          className={`${styles.buttonInHeader} xsm:w-28 xsm:h-9 lg:w-30 lg:h-10 tracking-wide mt-5 position-absolute top-1 right-3 z-50`}
          title="Import"
          onClick={() => {
            setShowImportModal(true);
          }}
          disabled={CUDDisabled}
        />
      </div>

      <div
        className="z-0 scroll-page"
        id="invoice-reconciliation"
        ref={componentToPrintRef}
      >
        <div className={`${styles.formatPrint}`}>
          <div className={`${styles.componentToPrint}`}>
            <div className="d-flex flex-column mb-4 align-items-center">
              <div className=" d-flex justify-end w-100 pr-4 mt-4">
                <FormLabel>{moment().format("DD/MM/YYYY HH:mm")}</FormLabel>
              </div>
              <Title level={3}>Invoice Reconciliation</Title>
            </div>
            <div className="z-0 mt-5" id="invoice-table">
              <UserTable
                rowSelection={false}
                columns={columnsOnPrint}
                dataSource={sourceData}
                // scroll={scroll}
                bordered
                pagination={false}
                // className={styles.antdTable}
                loading={loading && !sourceData?.length}
                rowClassName={(record: any, index: any) =>
                  index % 2 === 0 ? "table-row-dark" : "table-row-light"
                }
              />
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          width: "95vw",
          maxWidth: "2050px",
        }}
        className="z-0"
        id="invoice-table"
      >
        <UserTable
          rowSelection={false}
          columns={columnsData}
          dataSource={sourceData}
          scroll={scroll}
          bordered
          pagination={false}
          // className={styles.antdTable}
          loading={loading && !sourceData?.length}
          rowClassName={(record: any, index: any) =>
            index % 2 === 0 ? "table-row-dark" : "table-row-light"
          }
        />
      </div>

      {modalShow ? (
        <InvoiceAcceptReject
          show={true}
          onHide={() => setModalShow("")}
          handleClick={(reason) => onRejectAccept(summaryID, modalShow, reason)}
          currentUser={currentUser}
          modalText={modalShow}
          reason={"Accepted"}
        />
      ) : null}

      <AppModal
        primaryBtnTitle="Delete"
        showModal={showDeleteModal}
        onCloseModal={setShowDeleteModal}
        icon={<DeleteIconInModal />}
        onPrimaryHandle={() => onDeleteHandle()}
      >
        <h1 className="text-center text-xmd text-mono-label">
          Delete Invoice Summary
        </h1>
        <p className="mt-3 mb-3 text-center max-w-19 px-1 text-xsm leading-5 text-mono">
          Are you sure you want to delete this invoice summary?
        </p>
      </AppModal>
      <InvoiceReconciliationImportModal
        show={showImportModal}
        onHide={(data: any) => {
          setShowImportModal(false);
          setShowResultModal(!!data);
          setImportResultData(data || []);
        }}
        fetchSummary={fetchSummary}
        carriers={carriers}
      />
      <InvoiceResultTable
        show={showResultModal}
        onHide={() => setShowResultModal(false)}
        modalText={"Import Files Result"}
        data={importResultData}
      />
    </UserDashboard>
  );
};

export default InvoiceReconciliation;
