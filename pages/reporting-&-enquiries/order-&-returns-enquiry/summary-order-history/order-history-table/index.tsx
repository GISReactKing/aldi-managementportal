/** @format */

import { Table, Grid, Typography, Tag, Space } from "antd";
import styles from "./history-table.module.scss";
import { useState } from "react";
import { ComaSeparator } from "../../../../../utils/ComaSeparator";

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
export default function TableComponent({
  dataSource = null,
  loading = false,
  scroll = {},
  pagination = { position: ["bottom"] },
  ellipsis,
  bordered = false,
  rowSelection = false,
  sortOrder = "desc",
  onSelectedRow,
}: TableComponentProps) {
  const originData = [
    {
      orderDate: "22/12/21",
      orderNo: "5123456",
      deliveryPostCode: "B109YZ",
      order1Lines: "1",
      order1OrderedItems: "30",
      order1OrderValue: "142.25",
      order2Lines: "1",
      order2AmendedQty: "1",
      order2AmendedValue: "15",
      order3Parcels: "4",
      order3Lines: "1",
      order3DeliveryItems: "6",
      order3DeliveryValue: "13.00",
      order3StatusDate: "04/08/2021",
      order3DeliveryStatus: "Part Delivered More Details",
      returnedItems: "30",
      refundValue: "20.00",
      returnsStatusDate: "04/08/2021 07:40",
      returnsStatus: "Parcel at Carrier Depot",
    },
  ];
  const [data, setData] = useState(originData);

  const columnsExample: any = [
    {
      className: "carrier-table-column-empty",
      // align: 'center',
      children: [
        {
          title: (
            <Space direction="vertical" style={{ justifyContent: "center" }}>
              <Text className={styles.headerTitle}>Order Date</Text>
            </Space>
          ),
          dataIndex: "orderDate",
          key: "orderDate",
          className: "carrier-table-column",
        },
      ],
    },
    {
      title: "",
      className: "carrier-table-column-empty",
      children: [
        {
          title: (
            <Space direction="vertical">
              <Text className={styles.headerTitle}>Order No</Text>
            </Space>
          ),
          dataIndex: "orderNo",
          key: "orderNo",
          align: "center",
          render: (orderNo: string | number) => (
            <span
              onClick={onSelectedRow}
              className="text-primary underline cursor-pointer"
            >
              {orderNo}
            </span>
          ),
          className: "carrier-table-column",
        },
      ],
    },
    {
      title: "",
      // align: 'center',
      className: "carrier-table-column-empty",
      children: [
        {
          align: "center",
          title: (
            <Space className="text-center history" direction="vertical">
              <Text className={styles.headerTitle}>Delivery Post</Text>
              <Text className={styles.headerTitle}>Code</Text>
            </Space>
          ),
          dataIndex: "deliveryPostCode",
          key: "deliveryPostCode",
          className: "carrier-table-column",
          render: (deliveryPostCode: string | number) => (
            <span className="text-center w-full">{deliveryPostCode}</span>
          ),
        },
      ],
    },
    ,
    {
      title: "Original Order",
      className: "carrier-table-column-1",
      // align: 'center',
      children: [
        {
          align: "right",
          width: 20,
          title: (
            <Space className="text-center history" direction="vertical">
              <Text className={styles.headerTitle}>Order</Text>
              <Text className={styles.headerTitle}>Lines</Text>
            </Space>
          ),
          dataIndex: "order1Lines",
          key: "order1Lines",
          className: "carrier-table-column",
        },
        {
          align: "right",
          title: (
            <Space className="text-center history" direction="vertical">
              <Text className={styles.headerTitle}>Ordered</Text>
              <Text className={styles.headerTitle}>Items</Text>
            </Space>
          ),
          dataIndex: "order1OrderedItems",
          key: "order1OrderedItems",
          className: "carrier-table-column",
        },
        {
          align: "right",
          title: (
            <>
              <Space className="text-center history" direction="vertical">
                <Text className={styles.headerTitle}>Order</Text>
                <Text className={styles.headerTitle}>Value</Text>
              </Space>
            </>
          ),
          dataIndex: "order1OrderValue",
          key: "order1OrderValue",
          render: (value: number) => (
            <Space direction="horizontal">
              <Text>£{value}</Text>
            </Space>
          ),
          className: "carrier-table-column",
        },
      ],
    },
    {
      title: "Order Amendments",
      className: "carrier-table-column-1",
      // align: 'center',
      children: [
        {
          align: "right",
          width: 20,
          title: (
            <Space className="text-center history" direction="vertical">
              <Text className={styles.headerTitle}>Order</Text>
              <Text className={styles.headerTitle}>Lines</Text>
            </Space>
          ),
          dataIndex: "order2Lines",
          key: "order2Lines",
          className: "carrier-table-column",
        },
        {
          align: "right",
          title: (
            <Space className="text-center history" direction="vertical">
              <Text className={styles.headerTitle}>Amended</Text>
              <Text className={styles.headerTitle}>Qty</Text>
            </Space>
          ),
          dataIndex: "order2AmendedQty",
          key: "order2AmendedQty",
          className: "carrier-table-column",
        },
        {
          align: "right",
          title: (
            <>
              <Space className="text-center" direction="vertical">
                <Text className={styles.headerTitle}>Amended</Text>
                <Text className={styles.headerTitle}>Value</Text>
              </Space>
            </>
          ),
          dataIndex: "order2AmendedValue",
          key: "order2AmendedValue",
          render: (value: number) => (
            <Space direction="horizontal">
              <Text>£{value}</Text>
            </Space>
          ),
          className: "carrier-table-column",
        },
      ],
    },
    {
      title: "Order Delivery",
      className: "carrier-table-column-1",
      // align: 'center',
      children: [
        {
          align: "right",
          width: 20,
          title: (
            <Space className="text-center history" direction="vertical">
              <Text className={styles.headerTitle}>Parcels</Text>
            </Space>
          ),
          dataIndex: "order3Parcels",
          key: "order3Parcels",
          className: "carrier-table-column",
        },
        {
          align: "right",
          width: 20,
          title: (
            <Space className="text-center history" direction="vertical">
              <Text className={styles.headerTitle}>Order</Text>
              <Text className={styles.headerTitle}>Lines</Text>
            </Space>
          ),
          dataIndex: "order3Lines",
          key: "order3Lines",
          className: "carrier-table-column",
        },
        {
          align: "right",
          title: (
            <Space className="text-center history" direction="vertical">
              <Text className={styles.headerTitle}>Delivery</Text>
              <Text className={styles.headerTitle}>Items</Text>
            </Space>
          ),
          dataIndex: "order3DeliveryItems",
          key: "order3DeliveryItems",
          className: "carrier-table-column",
        },
        {
          align: "right",
          title: (
            <>
              <Space className="text-center" direction="vertical">
                <Text className={styles.headerTitle}>Delivery</Text>
                <Text className={styles.headerTitle}>Value</Text>
              </Space>
            </>
          ),
          dataIndex: "order3DeliveryValue",
          key: "order3DeliveryValue",
          render: (value: number) => (
            <Space direction="horizontal">
              <Text>£{value}</Text>
            </Space>
          ),
          className: "carrier-table-column",
        },
        {
          align: "center",
          title: (
            <Space className="text-center history" direction="vertical">
              <Text className={styles.headerTitle}>Status</Text>
              <Text className={styles.headerTitle}>Date</Text>
            </Space>
          ),
          dataIndex: "order3StatusDate",
          key: "order3StatusDate",
          className: "carrier-table-column",
        },
        {
          align: "left",
          title: (
            <Space className="text-center history" direction="vertical">
              <Text className={styles.headerTitle}>Delivery</Text>
              <Text className={styles.headerTitle}>Status</Text>
            </Space>
          ),
          dataIndex: "order3DeliveryStatus",
          key: "order3DeliveryStatus",
          className: "carrier-table-column",
        },
      ],
    },
    {
      title: "Returns",
      className: "carrier-table-column-1",
      // align: 'center',
      children: [
        {
          align: "right",
          width: 20,
          title: (
            <Space className="text-center history" direction="vertical">
              <Text className={styles.headerTitle}>Returned</Text>
              <Text className={styles.headerTitle}>Items</Text>
            </Space>
          ),
          dataIndex: "returnedItems",
          key: "returnedItems",
          className: "carrier-table-column",
        },
        {
          align: "right",
          title: (
            <Space className="text-center history" direction="vertical">
              <Text className={styles.headerTitle}>Refund</Text>
              <Text className={styles.headerTitle}>Value</Text>
            </Space>
          ),
          dataIndex: "refundValue",
          key: "refundValue",
          render: (value: number) => (
            <Space direction="horizontal">
              <Text>£{value}</Text>
            </Space>
          ),
          className: "carrier-table-column",
        },
        {
          title: (
            <>
              <Space className="text-center" direction="vertical">
                <Text className={styles.headerTitle}>Status Date</Text>
              </Space>
            </>
          ),
          dataIndex: "returnsStatusDate",
          key: "returnsStatusDate",
          className: "carrier-table-column",
        },
        {
          title: (
            <>
              <Space className="text-left" direction="vertical">
                <Text className={styles.headerTitle}>Returns Status</Text>
              </Space>
            </>
          ),
          dataIndex: "returnsStatus",
          key: "returnsStatus",
          className: "carrier-table-column",
        },
      ],
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
        pagination={pagination}
        rowSelection={rowSelection}
        columns={columnsExample}
        onChange={handleTableChange}
        className={`${styles.tableContent} carrier-prices-table`}
      />
    </>
  );
}
