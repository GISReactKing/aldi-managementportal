/** @format */

import { Table, Grid, Typography, Tag, Space } from "antd";
import styles from "./history-table.module.scss";

import { useState } from "react";
import { ComaSeparator } from "../../../../../utils/ComaSeparator";
import { AnyKindOfDictionary, isEmpty } from "lodash";
import useTheme from "../../../../../hooks/useTheme";

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
  onSelectedRow?: any;
  style?: any;
}

type FetchParams = {
  pagination?: object;
  filters?: any;
};

// @ts-ignore
export default function TableComponent({
  dataSource,
  loading = false,
  // scroll = { x: "calc(500px + 50%)" },
  pagination = { position: ["bottom"] },
  ellipsis,
  bordered = false,
  style = {},
  rowSelection = false,
  sortOrder = "desc",
  onSelectedRow,
}: TableComponentProps) {
  const [data, setData] = useState(dataSource);
  const theme = useTheme();

  const columnsExample = [
    {
      className: "carrier-table-column-empty",
      // align: 'center',
      children: [
        {
          title: (
            <Space direction="vertical">
              <Text className={styles.headerTitle}>Order Date</Text>
            </Space>
          ),
          dataIndex: "orderDate",
          key: "orderDate",
          // className: "carrier-table-column",
          verticalAlign: "bottom",
          // width: 90,
          className: "carrier-table-column summary-order-history",
        },
        {
          title: (
            <Space direction="vertical">
              <Text className={styles.headerTitle}>Order No.</Text>
            </Space>
          ),
          dataIndex: "orderNo",
          key: "orderNo",
          align: "center",

          render: (orderNo: string | number) => (
            <span
              onClick={() => onSelectedRow(orderNo)}
              style={{ color: theme?.primary }}
              className="underline cursor-pointer"
            >
              {orderNo}
            </span>
          ),
          className: "carrier-table-column summary-order-history",
        },
        {
          align: "center",
          title: (
            <Space className="text-left history" direction="vertical">
              <Text className={styles.headerTitle}>Delivery Post Code</Text>
              {/* <Text className={styles.headerTitle}>Code</Text> */}
            </Space>
          ),
          dataIndex: "deliveryPostCode",
          key: "deliveryPostCode",
          className: "carrier-table-column summary-order-history",
          render: (deliveryPostCode: string | number) => (
            <span className="text-center w-full">{deliveryPostCode}</span>
          ),
        },
      ],
    },
    {
      title: "Order Delivery",
      // align: "left",
      // align: "center",
      className: "carrier-table-column-border",
      children: [
        {
          align: "center",
          width: 70,
          title: (
            <Space direction="vertical">
              <Text className={styles.headerTitle}>Parcels</Text>
            </Space>
          ),
          dataIndex: "parcels",
          key: "parcels",
          className: "summary-order-history",
          render: (status: string) => (
            <span className="text-center w-full">{status}</span>
          ),
        },
        {
          align: "center",
          width: 70,
          title: (
            <Space className="text-center history" direction="vertical">
              <Text className={styles.headerTitle}>Order Lines</Text>
              {/* <Text className={styles.headerTitle}>Lines</Text> */}
            </Space>
          ),
          dataIndex: "orderLines",
          key: "orderLines",
          className: "summary-order-history",
        },
        {
          align: "center",
          width: 70,
          title: (
            <>
              <Space
                className="text-center"
                direction="vertical"
                style={{ gap: "0px" }}
              >
                <Text className={styles.headerTitle}>Delivery Items</Text>
                {/* <Text className={styles.headerTitle}>Items</Text> */}
              </Space>
            </>
          ),
          dataIndex: "deliveryItems",
          key: "deliveryItems",
          render: (value: number) => (
            <Space direction="horizontal">
              <Text>{value}</Text>
            </Space>
          ),
          className: "summary-order-history",
        },
        {
          align: "center",
          width: 100,
          title: (
            <>
              <Text className={styles.headerTitle}>Delivery Value</Text>
            </>
          ),
          dataIndex: "deliveryValue",
          key: "deliveryValue",
          className: "summary-order-history",
          render: (deliveryValue: string | number) => (
            <span className="text-center w-full">
              £ {ComaSeparator(deliveryValue)}
            </span>
          ),
        },
        {
          align: "center",

          title: (
            <>
              <Space className="text-left" direction="vertical">
                <Text className={styles.headerTitle}>Delivery Status</Text>
              </Space>
            </>
          ),
          dataIndex: "deliveryStatus",
          key: "deliveryStatus",
          className: "summary-order-history",
        },
      ],
    },
    {
      title: "Returns",
      // align: "left",
      className: "carrier-table-column-border",
      children: [
        {
          align: "center",
          width: 90,
          title: (
            <>
              <Space className="history" direction="vertical">
                <Text className={styles.headerTitle}>Returned Items</Text>
                {/* <Text className={styles.headerTitle}>Items</Text> */}
              </Space>
            </>
          ),
          dataIndex: "returnedItems",
          key: "returnedItems",
          className: "summary-order-history",
        },
        {
          align: "center",
          width: 90,
          title: (
            <>
              <Space className="history" direction="vertical">
                <Text className={styles.headerTitle}>Refund Value</Text>
                {/* <Text className={styles.headerTitle}>Value</Text> */}
              </Space>
            </>
          ),
          dataIndex: "refundValue",
          key: "refundValue",
          className: "summary-order-history",
          render: (RefundValue: string | number) => (
            <span className="text-center w-full">
              £ {ComaSeparator(RefundValue)}
            </span>
          ),
        },
        {
          align: "center",
          title: (
            <>
              <Space className="text-left w-full pl-2" direction="vertical">
                <Text className={styles.headerTitle}>Returns Status</Text>
              </Space>
            </>
          ),
          dataIndex: "returnsStatus",
          key: "returnsStatus",
          className: "summary-order-history",
          render: (RefundStatus: string | number) => (
            <span className="text-center w-full">{RefundStatus}</span>
          ),
        },
      ],
    },
  ];

  const fetch = (params: FetchParams) => {
    let resultData = [...data];
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
    <div className={styles.tableContainerDiv}>
      {!isEmpty(dataSource) && (
        <>
          {dataSource[0]?.customerName && (
            <h1
              style={{ color: theme?.monoTitle }}
              className="mt-8 text-sm font-bold ml-1"
            >
              {dataSource[0]?.customerName}
            </h1>
          )}
        </>
      )}

      <div className={!dataSource ? "mt-5" : ""}>
        <Table
          dataSource={dataSource}
          rowKey={"_id"}
          // scroll={scroll}
          loading={loading}
          size={"small"}
          bordered={bordered}
          pagination={pagination}
          rowSelection={rowSelection}
          columns={columnsExample}
          onChange={handleTableChange}
          className={`${styles.tableContent} carrier-prices-table summary-order-table`}
        />
      </div>
    </div>
  );
}
