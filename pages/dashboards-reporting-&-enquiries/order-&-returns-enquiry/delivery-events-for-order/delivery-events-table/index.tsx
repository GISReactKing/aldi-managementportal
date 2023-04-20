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
export default function DeliveryEventsTable({
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
      whseOrder: "1000112902",
      carrier: "Hermes",
      parcelId: "H7OP8997",
      statusDate: "20/07/2021",
      deliveryStatus: "Your parcel has been delivered",
      orderLine: "1",
      product: "Small Item",
      deliveryItems: "2",
      deliveryValue: "6",
    },
    {
      whseOrder: "1000112902",
      carrier: "XDP",
      parcelId: "H7OP8890",
      statusDate: "20/07/2021",
      deliveryStatus: "Your parcel has been delivered",
      orderLine: "2",
      product: "Wine",
      deliveryItems: "36",
      deliveryValue: "6",
    },
    {
      whseOrder: "1002311292",
      carrier: "Yodel",
      parcelId: "H7OP8897",
      statusDate: "20/07/2021",
      deliveryStatus: "Your parcel has been delivered",
      orderLine: "3",
      product: "Large Item",
      deliveryItems: "1",
      deliveryValue: "6",
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
      width: 100,
      title: (
        <Space className="text-center history text-black" direction="vertical">
          W'hse Order #
        </Space>
      ),
      dataIndex: "whseOrder",
      key: "whseOrder",
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
          Status Date
        </Space>
      ),
      dataIndex: "statusDate",
      key: "statusDate",
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
          Delivery Status
        </Space>
      ),
      dataIndex: "deliveryStatus",
      key: "deliveryStatus",
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
      align: "center",
      width: 40,
      title: (
        <Space className="text-center history text-black" direction="vertical">
          Delivery Items
        </Space>
      ),
      dataIndex: "deliveryItems",
      key: "deliveryItems",
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
          Delivery Value
        </Space>
      ),
      dataIndex: "deliveryValue",
      key: "deliveryValue",
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
        rowSelection={rowSelection}
        pagination={false}
        columns={columnsExample}
        onChange={handleTableChange}
        className={`${styles.tableContent} carrier-prices-table`}
      />
    </>
  );
}
