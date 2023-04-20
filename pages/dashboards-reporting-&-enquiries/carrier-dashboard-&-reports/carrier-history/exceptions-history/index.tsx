import React, { useEffect, useState, useRef, forwardRef } from "react";
import { AppButton } from "../../../../../components/AppButton";
import { FormLabel, Table } from "react-bootstrap";

import styles from "./exceptions-history.module.scss";
import { RootStateOrAny, useSelector } from "react-redux";
// import { fetchExceptionHistoryTotal } from "../../../../../redux/slices/exceptionHistorySlice";
import { useDispatch } from "react-redux";
import UserTable from "../../../../../components/Tables/UserTable";
import moment from "moment";
import { CSVLink } from "react-csv";
import { useReactToPrint } from "react-to-print";
import { Col, Row, Typography } from "antd";

const { Text, Title } = Typography;

interface Props {
  onGoBack?: () => void;
  onSelectedRow?: (e: any) => void;
  data?: any;
}

const ExceptionsHistory = ({ onGoBack, onSelectedRow, data }: Props) => {
  const dispatch = useDispatch();
  const [exportData, setExportData] = useState([]) as any;

  const tableToPrint = useRef() as any;
  const handlePrint = useReactToPrint({
    content: () => tableToPrint.current,
  });

  const exceptionHistoryTotal = useSelector(
    ({ exceptionHistory }: RootStateOrAny) =>
      exceptionHistory.exceptionHistoryTotal
  );

  const activityLoader: any[] = useSelector(
    ({ exceptionHistory }: RootStateOrAny) => exceptionHistory.loader
  );

  const usersColumns = [
    {
      title: "Exception",
      dataIndex: "exception",
      key: "exception",
      className: "table-header-activity-col",
      showSorterTooltip: false,
      sorter: (a: any, b: any) => {
        const exceptionA = a.exception.toLowerCase();
        const exceptionB = b.exception.toLowerCase();

        if (exceptionA < exceptionB) return -1;
        else if (exceptionA > exceptionB) return 1;
        else return 0;
      },
    },

    {
      title: "Order Date",
      sorter: (a: any, b: any) => {
        return (
          moment(a.orderDate, "DD/MM/YYYY HH:mm").unix() -
          moment(b.orderDate, "DD/MM/YYYY HH:mm").unix()
        );
      },
      // render: (date: any) => `${moment(date).format("DD/MM/YYYY hh:mm")}`,
      render: (date: any) => `${date}`,
      dataIndex: "orderDate",
      key: "orderDate",
      className: "table-header-activity-col",
      showSorterTooltip: false,
      // align: "center",
    },
    {
      title: "Order Ref",
      dataIndex: "orderRef",
      key: "orderRef",
      className: "table-header-activity-col",
      showSorterTooltip: false,
    },

    {
      title: "SMaRT Order",
      dataIndex: "smartOrder",
      key: "smartOrder",
      className: "table-header-activity-col",
      showSorterTooltip: false,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      className: "table-header-activity-col",
      showSorterTooltip: false,
      render: (status: string) => {
        return (
          <Text style={{ color: status === "Cancelled" ? "red" : "black" }}>
            {status}
          </Text>
        );
      },
    },
  ];

  const makeHeaders = (label: string, key: string) => {
    const headers: any = [
      { [label]: "Exception", [key]: "exception" },
      { [label]: "Order Date", [key]: "orderDate" },
      { [label]: "Order Ref", [key]: "orderRef" },
      { [label]: "SMaRT Order", [key]: "smartOrder" },
      { [label]: "Status", [key]: "status" },
    ];
    return headers;
  };

  useEffect(() => {
    if (exceptionHistoryTotal?.data) {
      let data = exceptionHistoryTotal?.map((item: any) => ({
        ...item,
        orderDate: moment(item.orderDate).format("DD/MM/YYYY hh:mm"),
      }));
      setExportData(data);
    }
  }, [exceptionHistoryTotal]);

  const ComponentToPrint = forwardRef<HTMLDivElement, any>(
    function ComponentToPrint(props, ref) {
      const dateTime = moment().format("DD/MM/YYYY HH:mm");
      return (
        <div className={`${styles.printTableContainer}`} ref={ref}>
          <div className={`${styles.tableHeader}`}>
            <div className={`${styles.showOnPrint}`}>
              <FormLabel>{moment().format("DD/MM/YYYY HH:mm")}</FormLabel>
            </div>
            <Row>
              <Col md="12" style={{ textAlign: "center" }}>
                <Row>
                  <Title level={3} className="mb-0">
                    Carrier Routing: Exceptions History
                  </Title>
                </Row>
              </Col>
            </Row>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
            className={`${styles.printWidth}`}
          >
            <UserTable
              columns={usersColumns}
              rowSelection={false}
              dataSource={data || []}
              scroll={{ x: "max-content" }}
              pagination={false}
              bordered
            />
          </div>
        </div>
      );
    }
  );

  return (
    <div>
      <AppButton
        className="xsm:w-28 xsm:h-9 lg:w-30 lg:h-10 font-bold tracking-wide mt-5 "
        style={{
          borderRadius: "4px",
          position: "absolute",
          top: 0,
          right: 280,
        }}
        onClick={onGoBack}
        title="Back"
      />
      <AppButton
        className="xsm:w-28 xsm:h-9 lg:w-30 lg:h-10 font-bold tracking-wide mt-5 "
        style={{
          borderRadius: "4px",
          position: "absolute",
          top: 0,
          right: 145,
        }}
        onClick={handlePrint}
        title="Print"
      />
      <CSVLink
        data={data}
        headers={makeHeaders("label", "key")}
        title="Exceptions History"
        filename={"exceptions-history.csv"}
      >
        <AppButton
          className="xsm:w-28 xsm:h-9 lg:w-30 lg:h-10 font-bold tracking-wide mt-5 "
          style={{
            borderRadius: "4px",
            position: "absolute",
            top: 0,
            right: 10,
          }}
          title="Export"
        />
      </CSVLink>

      <ComponentToPrint ref={tableToPrint} />
    </div>
  );
};

export default ExceptionsHistory;
