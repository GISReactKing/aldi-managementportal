/** @format */

import { Table, Typography, Space } from "antd";
import styles from "./table.module.scss";
import { useState } from "react";
import useAppDispatch from "../../../../../hooks/useAppDispatch";
import { useRouter } from "next/router";

const { Text } = Typography;

interface TableComponentProps {
  dataSource?: any;
  columns?: any;
  loading?: any;
  scroll?: any;
  pagination?: any;
  ellipsis?: any;
  bordered?: boolean;
  sortOrder?: any;
  rowSelection?: any;
  onSelectedRow?: (e: any) => void;
}

type FetchParams = {
  pagination?: object;
  filters?: any;
};

// @ts-ignore
export default function ReturnPortalTable({
  dataSource = null,
  loading = false,
  scroll = { x: "max-content" },
  pagination = { position: ["bottom"] },
  ellipsis,
  bordered = false,
  rowSelection = false,
  sortOrder = "desc",
  onSelectedRow,
}: TableComponentProps) {
  const router = useRouter();
  const { orderId } = router.query;
  const dispatch = useAppDispatch();
  const originData = [
    {
      orderLine: "Small Iterms 1",
      product: "9001: Small Items",
      returnItems: "1",
      refundValue: "5.60",
      returnReason: "NP Not as photo/described",
      statusDate: "21/07/2021 07:40",
      returnsStatus: "Pending Collection",
      returnMethod: "Reyal Mail Collection",
      deliveredBy: "Hermes",
    },
    {
      orderLine: "Wine & Spirits",
      product: "9002: wine",
      returnItems: "36",
      refundValue: "143.64",
      returnReason: "NP Not as photo/described",
      statusDate: "21/07/2021 07:40",
      returnsStatus: "Contact Customer Services",
      returnMethod: "",
      deliveredBy: "Yodel",
    },
    {
      orderLine: "Large & Heavy Items",
      product: "9003: Large Item",
      returnItems: "1",
      refundValue: "39.99",
      returnReason: "NP Not as photo/described",
      statusDate: "21/07/2021 07:40",
      returnsStatus: "Contact Customer Services",
      returnMethod: "",
      deliveredBy: "XDP",
    },
  ];
  const [data, setData] = useState(originData);
  const columnsExample: any = [
    {
      align: "left",
      width: 80,
      title: (
        <Space className="text-center history text-black" direction="vertical">
          Order Line
        </Space>
      ),
      dataIndex: "orderLine",
      key: "orderLine",
      className: "carrier-table-column",
      render: (orderLine: string | number) => (
        <Text
          style={{
            fontWeight: "bolder",
          }}
          className="text-center w-full"
        >
          {orderLine}
        </Text>
      ),
    },
    {
      align: "left",
      width: 100,
      title: (
        <Space className="text-center history text-black" direction="vertical">
          Product
        </Space>
      ),
      dataIndex: "product",
      key: "product",
      className: "carrier-table-column",
      render: (orderLine: string | number) => (
        <span className="text-center w-full">{orderLine}</span>
      ),
    },
    {
      align: "left",
      width: 50,
      title: (
        <Space className="text-center history text-black" direction="vertical">
          Return Items
        </Space>
      ),
      dataIndex: "returnItems",
      key: "returnItems",
      className: "carrier-table-column",
      render: (orderLine: string | number) => (
        <span className="text-center w-full">{orderLine}</span>
      ),
    },
    {
      align: "left",
      width: 50,
      title: (
        <Space className="text-center history text-black" direction="vertical">
          Refund Value
        </Space>
      ),
      dataIndex: "refundValue",
      key: "refundValue",
      className: "carrier-table-column",
      render: (orderLine: string | number) => (
        <Space className="text-nowrap">
          <Text>£{orderLine}</Text>
        </Space>
      ),
    },
    {
      align: "left",
      width: 160,
      title: (
        <Space className="text-center history text-black" direction="vertical">
          Return Reason
        </Space>
      ),
      dataIndex: "returnReason",
      key: "returnReason",
      className: "carrier-table-column",
      render: (orderLine: string | number) => (
        <span className="text-center text-nowrap w-full">{orderLine}</span>
      ),
    },
    {
      align: "left",
      width: 100,
      title: (
        <Space
          className="text-center text-nowrap history text-black"
          direction="vertical"
        >
          Status Date
        </Space>
      ),
      dataIndex: "statusDate",
      key: "statusDate",
      className: "carrier-table-column",
      render: (orderLine: string | number) => (
        <span className="text-center text-nowrap w-full">{orderLine}</span>
      ),
    },
    {
      align: "left",
      width: 140,
      title: (
        <Space
          className="text-center text-nowrap history text-black"
          direction="vertical"
        >
          Returns Status
        </Space>
      ),
      dataIndex: "returnsStatus",
      key: "returnsStatus",
      className: "carrier-table-column",
      render: (orderLine: string | number) => (
        <Text
          className="text-center w-full text-nowrap"
          style={{
            color: orderLine !== "Contact Customer Services" ? "black" : "red",
          }}
        >
          {orderLine}
        </Text>
      ),
    },
    {
      align: "left",
      width: 120,
      title: (
        <Space className="text-center history text-black" direction="vertical">
          Return Method
        </Space>
      ),
      dataIndex: "returnMethod",
      key: "returnMethod",
      className: "carrier-table-column",
      render: (orderLine: string | number) =>
        orderLine && (
          <span className="text-center text-nowrap w-full">{orderLine}</span>
        ),
    },
    {
      align: "left",
      width: 30,
      title: (
        <Space
          className="text-center text-nowrap history text-black"
          direction="vertical"
        >
          Delivered By
        </Space>
      ),
      dataIndex: "deliveredBy",
      key: "deliveredBy",
      className: "carrier-table-column",
      render: (orderLine: string | number) =>
        orderLine && <span className="text-center w-full">{orderLine}</span>,
    },
  ];

  const fetch = (params: FetchParams) => {
    let resultData = [...originData];
    if (params.filters) {
      Object.keys(params.filters).map((key, index) => {
        if (params.filters[key]) {
          const filterValues = params.filters[key];
          resultData = resultData.filter((item: any) =>
            filterValues.includes(item[key])
          );
        }

        return true;
      });

      setData([...resultData]);
    }
  };

  const handleTableChange = (pagination: object, filters: object) => {
    console.log({ filters });
    fetch({
      pagination,
      filters,
    } as FetchParams);
  };

  return (
    <>
      <Table
        dataSource={data}
        rowKey={"_id"}
        scroll={scroll}
        loading={loading}
        size={"small"}
        bordered={bordered}
        pagination={false}
        rowSelection={rowSelection}
        columns={columnsExample}
        onChange={handleTableChange}
        className={`${styles.tableContent} carrier-prices-table overflow-x-scroll`}
      />
    </>
  );
}
