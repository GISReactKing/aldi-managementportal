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
export default function ReturnEventsTable({
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
      orderNo: "5",
      returnId: "1000112902",
      returnDate: "20/07/2021",
      carrier: "Hermes",
      parcelId: "1H7OP8997",
      orderLine: "1",
      product: "Small Item",
      returnItems: "2",
      refundValue: "6",
      returnReason: "Not as described",
      statusDate: "20/07/2021",
      returnStatus: "Refunded",
    },
    {
      orderLine: "2",
      product: "Large Item",
      returnItems: "2",
      refundValue: "6",
      returnReason: "Change of mind",
      statusDate: "20/07/2021",
      returnStatus: "Refunded",
    },
  ];
  const [data, setData] = useState(originData);
  const columnsExample: any = [
    {
      align: "center",
      width: 100,
      title: (
        <Space className="text-center history text-black" direction="vertical">
          Order No.
        </Space>
      ),
      dataIndex: "orderNo",
      key: "orderNo",
      className: "carrier-table-column",
      render: (orderLine: string | number) => (
        <span className="text-center w-full">{orderLine}</span>
      ),
    },
    {
      align: "center",
      width: 100,
      title: (
        <Space className="text-center history text-black" direction="vertical">
          Return ID
        </Space>
      ),
      dataIndex: "returnId",
      key: "returnId",
      className: "carrier-table-column",
      render: (orderLine: string | number) => (
        <span className="text-center w-full">{orderLine}</span>
      ),
    },
    {
      align: "center",
      width: 100,
      title: (
        <Space className="text-center history text-black" direction="vertical">
          Return Date
        </Space>
      ),
      dataIndex: "returnDate",
      key: "returnDate",
      className: "carrier-table-column",
      render: (orderLine: string | number) => (
        <span className="text-center w-full">{orderLine}</span>
      ),
    },
    {
      align: "center",
      width: 100,
      title: (
        <Space className="text-center history text-black" direction="vertical">
          Carrier
        </Space>
      ),
      dataIndex: "carrier",
      key: "carrier",
      className: "carrier-table-column",
      render: (orderLine: string | number) => (
        <span className="text-center w-full">{orderLine}</span>
      ),
    },
    {
      align: "center",
      width: 100,
      title: (
        <Space className="text-center history text-black" direction="vertical">
          Parcel ID
        </Space>
      ),
      dataIndex: "parcelId",
      key: "parcelId",
      className: "carrier-table-column",
      render: (orderLine: string | number) => (
        <span className="text-center w-full">{orderLine}</span>
      ),
    },
    {
      align: "center",
      width: 100,
      title: (
        <Space className="text-center history text-black" direction="vertical">
          Order Line
        </Space>
      ),
      dataIndex: "orderLine",
      key: "orderLine",
      className: "carrier-table-column",
      render: (orderLine: string | number) => (
        <span className="text-center w-full">{orderLine}</span>
      ),
    },
    {
      align: "center",
      width: 200,
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
      align: "center",
      width: 100,
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
      align: "center",
      width: 100,
      title: (
        <Space className="text-center history text-black" direction="vertical">
          Refund Value
        </Space>
      ),
      dataIndex: "refundValue",
      key: "refundValue",
      className: "carrier-table-column",
      render: (orderLine: string | number) => (
        <span className="text-center w-full">{orderLine}</span>
      ),
    },
    {
      align: "center",
      width: 200,
      title: (
        <Space className="text-center history text-black" direction="vertical">
          Return Reason
        </Space>
      ),
      dataIndex: "returnReason",
      key: "returnReason",
      className: "carrier-table-column",
      render: (orderLine: string | number) => (
        <span className="text-center w-full">{orderLine}</span>
      ),
    },
    {
      align: "center",
      width: 50,
      title: (
        <Space className="text-center history text-black" direction="vertical">
          Status Date
        </Space>
      ),
      dataIndex: "statusDate",
      key: "statusDate",
      className: "carrier-table-column",
      render: (orderLine: string | number) =>
        orderLine && <span className="text-center w-full">£{orderLine}</span>,
    },
    {
      align: "center",
      width: 50,
      title: (
        <Space className="text-center history text-black" direction="vertical">
          Return Status
        </Space>
      ),
      dataIndex: "returnStatus",
      key: "returnStatus",
      className: "carrier-table-column",
      render: (orderLine: string | number) =>
        orderLine && <span className="text-center w-full">£{orderLine}</span>,
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
        className={`${styles.tableContent} carrier-prices-table`}
      />
    </>
  );
}
