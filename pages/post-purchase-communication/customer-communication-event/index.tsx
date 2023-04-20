/** @format */
import { useState, useEffect, useRef } from "react";
import { Tag } from "antd";
import { Col, Form, Row } from "react-bootstrap";
import UserDashboard from "../../../components/UserDashboard";
import { Table, Button, Typography } from "antd";
import { PrinterOutlined } from "@ant-design/icons";
// import AmmendCommunicationEventModal from '../../../components/Modals/AmmendCommunicationEventModal';
import { RootStateOrAny, useSelector } from "react-redux";
import { AppButton } from "../../../components/AppButton";
import { checkingDisableOfAppButton } from "../../../utils/CheckingStatus";
import EventTable from "./eventTable";
import { PaginationFunc } from "../../../utils/PaginationFunc";
import PaginationDropdown from "../../../components/PaginationDropdown";
import { useReactToPrint } from "react-to-print";
import styles from "./post-purchase-communication.module.scss";
import { FormLabel } from "react-bootstrap";
import moment from "moment";

const { Title, Text } = Typography;

interface Props {}
interface DataType {
  key: React.Key;
  name: string;
  level1: string;
  level2: string;
  status: string;
}

const CustomerCommunicationEvent = ({}: Props): JSX.Element => {
  const [editModal, setEditModal] = useState<boolean>(false);
  const [detailData, setDetailData] = useState<any>({});
  const [paginationCount, setPaginationCount] = useState([]) as any;
  const [page, setPage] = useState(10) as any;
  const [scroll, setScroll] = useState<object>({
    x: "max-content",
    y: "calc(100vh - 360px)",
  });

  const currentUser = useSelector(
    ({ users }: RootStateOrAny) => users.currentUser
  );
  const CUDDisabled = checkingDisableOfAppButton(currentUser, "edit", [
    // "Set Up & Control",
    "Post Purchase Communication",
    "Customer Facing: Communication Events",
  ]);

  const data = [
    {
      key: "1",
      code: "100012",
      level1: "Order Received in Warehouse",
      level2: "",
      status: "Ammend Event",
    },
    {
      key: "2",
      code: "1000021",
      level1: "Order Received in Warehouse",
      level2: "",
      status: "Ammend Event",
    },
    {
      key: "3",
      code: "1000023",
      level1: "Order Received in Warehouse",
      level2: "Order at store",
      status: "Ammend Event",
    },
    {
      key: "4",
      code: "100024",
      level1: "Order Received in Warehouse",
      level2: "",
      status: "Ammend Event",
    },
    {
      key: "5",
      code: "1000032",
      level1: "Order Received in Warehouse",
      level2: "",
      status: "Ammend Event",
    },
    {
      key: "6",
      code: "100025",
      level1: "Order Received in Warehouse",
      level2: "",
      status: "Ammend Event",
    },
    {
      key: "7",
      code: "100026",
      level1: "Order Received in Warehouse",
      level2: "Order at store",
      status: "Ammend Event",
    },
    {
      key: "8",
      code: "100037",
      level1: "Order Received in Warehouse",
      level2: "",
      status: "Ammend Event",
    },
  ];

  useEffect(() => {
    setPaginationCount(PaginationFunc(data.length));
  }, []);

  //   useEffect(() => {
  //     if (!Object.keys(scroll).length) {
  //       let win = window.open(
  //         "",
  //         "Title",
  //         "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=" +
  //           screen.availWidth +
  //           ",height=" +
  //           screen.availHeight +
  //           ",top=" +
  //           (screen.height - 400) +
  //           ",left=" +
  //           (screen.width - 840)
  //       );
  //       let tableContent = document.getElementById("events-table");
  //       let head = document.head.innerHTML;
  //       if (!tableContent || !win) {
  //         return;
  //       }
  //       win.document.body.innerHTML = `<html><head>${head}<style>body,span,td,p {font-size: 12px !important;}</style></head><body>${tableContent.innerHTML}</body>`;
  //       win.print();
  //       win.close();
  //       setScroll({
  //         x: "max-content",
  //         y: "calc(100vh - 360px)",
  //       });
  //     }
  //   }, [scroll]);

  //   const print = () => {
  //     setScroll({});
  //   };

  const componentToPrintRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentToPrintRef.current,
  });

  const handleRowClick = (record: any) => {
    setDetailData(record);
    setEditModal(true);
  };

  const onChangePagination = (e: any) => {
    setPage(e);
  };

  return (
    <UserDashboard>
      <>
        <AppButton
          className={`xsm:w-28 xsm:h-9 lg:w-30 lg:h-10 font-bold tracking-wide mt-5 position-absolute top-1 z-50`}
          title="Clear"
          style={{ borderRadius: "4px", right: "285px" }}
          onClick={() => {}}
          disabled={CUDDisabled}
        />
        <AppButton
          className={`xsm:w-28 xsm:h-9 lg:w-30 lg:h-10 font-bold tracking-wide mt-5 position-absolute top-1 z-50`}
          title="Edit"
          style={{ borderRadius: "4px", right: "150px" }}
          onClick={() => {}}
          disabled={CUDDisabled}
        />
        <AppButton
          className={`xsm:w-28 xsm:h-9 lg:w-30 lg:h-10 font-bold tracking-wide mt-5 position-absolute top-1 right-4 z-50`}
          title="Print"
          style={{ borderRadius: "4px" }}
          onClick={() => handlePrint()}
        />
      </>
      <Row className="mb-5">
        <Col md="4"></Col>
        <Col md="4" style={{ textAlign: "center" }}>
          <Row>
            <Title level={3}>Customer Communication Events</Title>
          </Row>
        </Col>
      </Row>
      <Row>
        <Col md="3"></Col>
        <Col md="6">
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
                        Customer Facing: Communication Events
                      </Title>
                    </Row>
                  </Col>
                </Row>
              </div>
              <div className={`${styles.printWidth}`} id="events-table">
                <EventTable
                  dataSource={data}
                  handleRowClick={handleRowClick}
                  scroll={scroll}
                />
              </div>
            </div>
          </div>
          <div
            style={{ display: "flex", flexDirection: "row" }}
            className="mt-2"
          >
            <PaginationDropdown
              count={paginationCount}
              onPagination={(e) => onChangePagination(e)}
            />
          </div>
        </Col>
      </Row>
      {/* <AmmendCommunicationEventModal detailData={detailData} show={editModal} onHide={() => setEditModal(false)} /> */}
    </UserDashboard>
  );
};

export default CustomerCommunicationEvent;
