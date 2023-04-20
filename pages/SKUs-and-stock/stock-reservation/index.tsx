/** @format */

import { useState, useEffect, useRef } from "react";
import { RootStateOrAny, useSelector, useDispatch } from "react-redux";
import { Col, Form, Row } from "react-bootstrap";
import { CSVLink } from "react-csv";
import { Typography } from "antd";
import { useReactToPrint } from "react-to-print";
import { FormLabel } from "react-bootstrap";
import moment from "moment";
import UserDashboard from "../../../components/UserDashboard";
import UserTable from "../../../components/Table";
import { AmendReservedStockQuantityModal } from "../../../components/Modals";
import PaginationDropdown from "../../../components/PaginationDropdown";
import { PaginationFunc } from "../../../utils/PaginationFunc";
import { AppButton } from "../../../components/AppButton";
import { fetchItemFileStockReservation } from "../../../redux/slices/ItemFileStockReservationSlice";
import styles from "./skusAndStock.module.scss";
import { checkingDisableOfAppButton } from "../../../utils/CheckingStatus";
import useTheme from "../../../hooks/useTheme";

const { Title, Text } = Typography;

interface Props {}

const Users = ({}: Props): JSX.Element => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const csvLink = useRef() as any;

  const itemFileStockReservation = useSelector(
    ({ itemFileStockReservation }: RootStateOrAny) =>
      itemFileStockReservation.data
  );

  const currentUser = useSelector(
    ({ users }: RootStateOrAny) => users.currentUser
  );

  const [data, setData] = useState<any[]>([itemFileStockReservation]);

  const [paginationCount, setPaginationCount] = useState([]) as any;
  const [page, setPage] = useState(10) as any;
  const [canClear, setCanClear] = useState<boolean>(false);

  const [show, setShow] = useState<boolean>(false);
  const [selectedRows, setSelectedRows] = useState<any>([]);
  const [searchText, setSearchText] = useState<string>("");

  const [selectedRecord, setSelectedRecord] = useState<any>({});

  const [csvData, setCsvData] = useState<any>([]);

  const onChangePagination = (e: any) => {
    setPage(e);
  };

  const makeHeaders = (label: string, key: string) => {
    const headers: any = [
      { [label]: "Type", [key]: "type" },
      { [label]: "Product", [key]: "product" },
      { [label]: "Stock on Hand", [key]: "stock_on_hand" },
      { [label]: "Available Stock", [key]: "available_stock" },
      { [label]: "Reserved Stock", [key]: "reserved_stock" },
      { [label]: "Reserved: Last Amended Date", [key]: "last_amended_date" },
      { [label]: "Reserved: Last Amended User", [key]: "last_amended_user" },
    ];
    return headers;
  };

  useEffect(() => {
    dispatch(fetchItemFileStockReservation());
    setData(itemFileStockReservation.slice(0, page));

    setPaginationCount(PaginationFunc(itemFileStockReservation.length));
  }, []);

  useEffect(() => {
    const csvTmp = data.map((item) => {
      return { ...item, product: `${item.sku}: ${item.title}` };
    });

    setCsvData(csvTmp);
  }, [data]);

  useEffect(() => {
    handleSearchTextChanged(searchText);
  }, [page]);

  const onHandleModal = (id?: string) => {
    alert("TODO Open Ammend Reserve Stock Quantity Modal");
  };

  const onDoubleClick = (record: any, rowIndex: any) => {
    setSelectedRecord(record);
    setShow(true);
  };

  const stockReservationColumns = [
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      className: "table-header-col",
      width: "150px",
    },
    {
      title: "Product",
      dataIndex: "sku",
      key: "sku",
      render: (item: string, record: any) => {
        return (
          <div>
            <span className="text-left">{`${record.sku}: ${record.title}`}</span>
          </div>
        );
      },
    },
    {
      title: "Stock On Hand",
      dataIndex: "stock_on_hand",
      key: "stock_on_hand",
      width: "150px",
      align: "end",
    },
    {
      title: "Available Stock",
      dataIndex: "available_stock",
      key: "available_stock",
      width: "150px",
      align: "end",
    },
    {
      title: "Reserved Stock",
      dataIndex: "reserved_stock",
      key: "reserved_stock",
      width: "170px",
      align: "end",
    },
    {
      title: "Reserved: Last Amended Date",
      dataIndex: "last_amended_date",
      key: "last_amended_date",
      width: "170px",
      align: "end",
    },
    {
      title: "Last Amended User",
      dataIndex: "last_amended_user",
      key: "last_amended_user",
      render: (item: string, recode: any) => {
        return (
          <div>
            <span
              className="text-left"
              style={{
                color: "#0094ff",
                textDecoration: "underline",
                cursor: "pointer",
              }}
            >
              {item}
            </span>
          </div>
        );
      },
      width: "170px",
    },
  ];

  const onSelectChange = (selectedRowKeys: string[], item: any) => {
    if (selectedRowKeys.length > 0) {
      setSelectedRows(selectedRowKeys);
    } else {
      setSelectedRows([]);
    }
  };

  const handleSearchTextChanged = (text: string) => {
    let searchArr = null;
    if (text) {
      searchArr = itemFileStockReservation.filter((item: any) => {
        const sku = item.sku.toUpperCase();
        const value = text.toUpperCase();

        return sku.includes(value);
      });
    } else {
      searchArr = itemFileStockReservation;
    }

    setData(searchArr.slice(0, page));

    setPaginationCount(PaginationFunc(searchArr.length));

    setCanClear(searchArr.length < itemFileStockReservation.length);

    setSearchText(text);
  };

  const componentToPrintRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentToPrintRef.current,
  });

  const CUDDisabled = checkingDisableOfAppButton(currentUser, "create", [
    "SKU's & Stock",
    "Item File: Stock Reservation",
  ]);

  return (
    <>
      <AppButton
        className="xsm:w-28 xsm:h-9 lg:w-30 lg:h-10 font-bold tracking-wide mt-5 position-absolute top-1 z-50"
        title="Clear"
        style={
          canClear
            ? {
                borderRadius: "4px",
                right: "420px",
                borderWidth: 1,
              }
            : { borderRadius: "4px", right: "420px" }
        }
        onClick={() => {
          setSearchText("");
          handleSearchTextChanged("");
        }}
      />
      <AppButton
        className="xsm:w-28 xsm:h-9 lg:w-30 lg:h-10 font-bold tracking-wide mt-5 position-absolute top-1 z-50"
        title="Edit"
        style={{ borderRadius: "4px", right: "285px" }}
        onClick={() => {
          setShow(true);
        }}
        disabled={CUDDisabled}
      />
      <AppButton
        className="xsm:w-28 xsm:h-9 lg:w-30 lg:h-10 font-bold tracking-wide mt-5 position-absolute top-1 z-50"
        title="Print"
        style={{ borderRadius: "4px", right: "150px" }}
        onClick={() => handlePrint()}
      />
      <AppButton
        className="xsm:w-28 xsm:h-9 lg:w-30 lg:h-10 font-bold tracking-wide mt-5 position-absolute top-1 right-4 z-50"
        title="Export"
        style={{ borderRadius: "4px" }}
        onClick={() => {
          csvLink?.current?.link?.click();
        }}
      />
      <CSVLink
        data={csvData}
        headers={makeHeaders("label", "key")}
        filename={"item-file-stock-reservation.csv"}
        ref={csvLink}
      />
      {/* <PrinterOutlined style={{ fontSize: "18px", color: theme?.monoPlaceholder }} /> */}
      <UserDashboard>
        <div>
          <Row className="mb-5">
            <Col md="4"></Col>
            <Col md="4" style={{ textAlign: "center" }}>
              <Row>
                <Title level={3}>Item File: Stock Reservation</Title>
              </Row>
            </Col>
          </Row>
          <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
            <Form.Label
              style={{
                width: "220px",
                alignItems: "center",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              Select SKU:
            </Form.Label>
            <Form.Control
              style={{
                width: "220px",
                alignItems: "center",
              }}
              name="orderNO"
              value={searchText}
              onChange={({ target }) => handleSearchTextChanged(target.value)}
            />
          </Form.Group>
          <div className="z-0 scroll-page">
            <div
              className={`${styles.printTableContainer}`}
              ref={componentToPrintRef}
            >
              <div className={`${styles.tableHeader}`}>
                <div className={`${styles.showOnPrint}`}>
                  <FormLabel>{moment().format("DD/MM/YYYY HH:mm")}</FormLabel>
                </div>
                <Row>
                  <Col md="12" style={{ textAlign: "center" }}>
                    <Row>
                      <Title level={3} className="mb-0">
                        Item File: Stock Reservation
                      </Title>
                    </Row>
                  </Col>
                </Row>
              </div>
              <div className={`${styles.printWidth}`}>
                <UserTable
                  rowSelection={false}
                  pagination={false}
                  columns={stockReservationColumns}
                  dataSource={data}
                  // scroll={{ y: "calc(100vh - 440px)", x: "90vw" }}
                  scroll={{}}
                  setSelectedRecord={setSelectedRecord}
                  onDoubleClick={onDoubleClick}
                />
              </div>
            </div>
          </div>
          <hr />
          <div
            style={{ display: "flex", flexDirection: "row" }}
            className="mt-2"
          >
            <PaginationDropdown
              count={paginationCount}
              onPagination={(e) => onChangePagination(e)}
              value={10}
            />
          </div>
        </div>
      </UserDashboard>
      <AmendReservedStockQuantityModal
        show={show}
        detailData={selectedRecord}
        onHide={() => setShow(false)}
      />
    </>
  );
};

export default Users;
