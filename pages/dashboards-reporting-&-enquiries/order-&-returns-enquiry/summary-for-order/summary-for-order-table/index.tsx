/** @format */

import { Table, Typography, Space } from "antd";
import styles from "./table.module.scss";
import { useEffect, useState } from "react";
import useAppDispatch from "../../../../../hooks/useAppDispatch";
import { addUniqueNavTab } from "../../../../../redux/slices/navTabs";
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
export default function SummaryForOrderIdTable({
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
      orderNo: orderId || "TEST123",
      orderLine: "1",
      product: "1234:abnasbbcbc",
      orderQty: "2",
      orderValue: "142.25",
      amendedQty: "",
      amendedValue: "",
      reason: "",
      amendedDate: "",
      deliveryItems: "1",
      deliveryValue: "6",
      statusDate1: "04/08/2021",

      statusDate: "",
      returnsStatus: "",
      deliveryStatus: "Your parcel has been delivered",
      returnedQty: "30",
      refundValue: "20.00",
    },
    {
      orderLine: "2",
      product: "1234:abnasbbcbc",
      orderQty: "2",
      orderValue: "142.25",
      amendedQty: "",
      amendedValue: "",
      reason: "",
      amendedDate: "",
      deliveryItems: "1",
      deliveryValue: "6",
      statusDate1: "04/08/2021",

      statusDate: "",
      returnsStatus: "",
      deliveryStatus: "Your parcel has been delivered",
      returnedQty: "30",
      refundValue: "20.00",
    },
    {
      orderLine: "3",
      product: "1234:abnasbbcbc",
      orderQty: "2",
      orderValue: "142.25",
      amendedQty: "",
      amendedValue: "",
      reason: "",
      amendedDate: "",
      deliveryItems: "1",
      deliveryValue: "6",
      statusDate1: "04/08/2021",

      statusDate: "",
      returnsStatus: "",
      deliveryStatus: "Your parcel has been delivered",
      returnedQty: "30",
      refundValue: "20.00",
    },
    {
      orderLine: "4",
      product: "1234:abnasbbcbc",
      orderQty: "2",
      orderValue: "142.25",
      amendedQty: "",
      amendedValue: "",
      reason: "",
      amendedDate: "",
      deliveryItems: "1",
      deliveryValue: "6",
      statusDate1: "04/08/2021",

      statusDate: "",
      returnsStatus: "",
      deliveryStatus: "Your parcel has been delivered",
      returnedQty: "30",
      refundValue: "20.00",
    },
    {
      orderLine: "5",
      product: "1234:abnasbbcbc",
      orderQty: "2",
      orderValue: "142.25",
      amendedQty: "1",
      amendedValue: "-15",
      reason: "Customer Requested",
      amendedDate: "04/08/2021",
      deliveryItems: "1",
      deliveryValue: "6",
      statusDate1: "13.00",

      statusDate: "",
      returnsStatus: "",
      deliveryStatus: "Your parcel has been delivered",
      returnedQty: "30",
      refundValue: "20.00",
    },
  ];
  const [data, setData] = useState(originData);

  const columnsExample: any = [
    {
      title: "",
      className: "carrier-table-column-empty",
      children: [
        {
          title: (
            <Space direction="horizontal">
              <Text className={styles.headerTitle}>Order No. </Text>
            </Space>
          ),
          dataIndex: "orderNo",
          key: "orderNo",
          align: "center",
          width: 80,
          render: (orderNo: string | number) => (
            <span className="text-primary underline cursor-pointer">
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
          width: 100,
          title: (
            <Space className="text-center history" direction="vertical">
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
          align: "left",
          width: 60,
          title: (
            <Space className="text-center history" direction="vertical">
              Product
            </Space>
          ),
          dataIndex: "product",
          key: "product",
          className: "carrier-table-column",
        },
      ],
    },
    ,
    {
      title: (
        <Space direction="vertical">
          <Text style={{ fontWeight: "bolder" }}>Original Order</Text>
        </Space>
      ),
      className: "carrier-table-column-border-bottom-carrier-pad",
      align: "left",
      children: [
        {
          align: "right",
          title: (
            <Space className="text-center history" direction="vertical">
              Order Qty
            </Space>
          ),
          dataIndex: "orderQty",
          key: "orderQty",
          className: "carrier-table-column",
          width: 100,
        },
        {
          align: "right",
          title: (
            <>
              <Space className="text-center history" direction="vertical">
                Order Value
              </Space>
            </>
          ),
          dataIndex: "orderValue",
          width: 100,
          key: "orderValue",
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
      title: (
        <Space direction="vertical">
          <Text style={{ fontWeight: "bolder" }}>Order Amendments</Text>
        </Space>
      ),

      className: "carrier-table-column-border-bottom-carrier",
      align: "left",
      children: [
        {
          align: "right",
          title: (
            <Space className="text-center history" direction="vertical">
              Amended Qty
            </Space>
          ),
          dataIndex: "amendedQty",
          key: "amendedQty",
          className: "carrier-table-column",
          width: 100,
        },
        {
          align: "right",
          bordered: true,
          title: (
            <>
              <Space className="text-center" direction="vertical">
                Amended Value
              </Space>
            </>
          ),
          dataIndex: "amendedValue",
          width: 100,
          key: "amendedValue",
          render: (value: number) => {
            const isNegative = Number(value) < 0;
            return (
              <Space direction="horizontal">
                {value && (
                  <Text className={isNegative ? `text-red-500` : ""}>
                    {value}
                  </Text>
                )}
              </Space>
            );
          },
          className: "carrier-table-column",
        },
        {
          align: "left",
          title: (
            <>
              <Space className="text-center" direction="vertical">
                Reason
              </Space>
            </>
          ),
          dataIndex: "reason",
          width: 160,
          key: "reason",
          render: (value: number) => (
            <Space direction="horizontal">
              <Text>{value}</Text>
            </Space>
          ),
          className: "carrier-table-column",
        },
        {
          align: "right",
          title: (
            <>
              <Space className="text-center" direction="vertical">
                Amended Date
              </Space>
            </>
          ),
          dataIndex: "amendedDate",
          width: 100,
          key: "amendedDate",
          render: (value: number) => (
            <Space direction="horizontal">
              <Text>{value}</Text>
            </Space>
          ),
          className: "carrier-table-column",
        },
      ],
    },
    {
      title: (
        <Space direction="vertical">
          <Text style={{ fontWeight: "bolder" }}>Order Delivery</Text>
        </Space>
      ),
      className: "carrier-table-column-border-bottom-carrier",
      align: "left",
      children: [
        {
          align: "right",
          width: 70,
          title: (
            <Space className="text-center history" direction="vertical">
              <Text className={styles.headerTitle}>Delivery Items</Text>
            </Space>
          ),
          dataIndex: "deliveryItems",
          key: "deliveryItems",
          className: "carrier-table-column",
        },
        {
          align: "right",
          width: 50,
          title: (
            <Space className="text-center history" direction="vertical">
              Deliver Value
            </Space>
          ),
          dataIndex: "deliverValue",
          key: "deliverValue",
          className: "carrier-table-column",
        },
        {
          align: "right",
          width: 50,
          title: (
            <Space className="text-center history" direction="vertical">
              Delivery Items
            </Space>
          ),
          dataIndex: "deliveryItems",
          key: "deliveryItems",
          className: "carrier-table-column",
        },
        {
          align: "right",
          width: 50,
          title: (
            <>
              <Space className="text-center" direction="vertical">
                Delivery Value
              </Space>
            </>
          ),
          dataIndex: "deliveryValue",
          key: "deliveryValue",
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
              Status Date
            </Space>
          ),
          dataIndex: "statusDate1",
          key: "statusDate1",
          className: "carrier-table-column",
        },
        {
          width: 220,
          align: "center",
          title: (
            <Space className="text-center history" direction="vertical">
              Delivery Status
            </Space>
          ),
          dataIndex: "deliveryStatus",
          key: "deliveryStatus",
          className: "carrier-table-column",
        },
      ],
    },
    {
      title: (
        <Space direction="vertical">
          <Text style={{ fontWeight: "bolder" }}>Returns</Text>
        </Space>
      ),
      className: "carrier-table-column-border-bottom-carrier",
      align: "left",
      children: [
        {
          align: "right",
          width: 50,
          title: (
            <Space className="text-center history" direction="vertical">
              Returned Qty
            </Space>
          ),
          dataIndex: "returnedQty",
          key: "returnedQty",
          className: "carrier-table-column",
        },
        {
          align: "right",
          title: (
            <Space className="text-center history" direction="vertical">
              Refund Value
            </Space>
          ),
          width: 70,
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
          width: 95,
          title: (
            <>
              <Space className="text-center" direction="vertical">
                <Text className={styles.headerTitle}>Status Date</Text>
              </Space>
            </>
          ),
          dataIndex: "statusDate",
          key: "statusDate",
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
        pagination={false}
        rowSelection={rowSelection}
        columns={columnsExample}
        onChange={handleTableChange}
        className={`${styles.tableContent} carrier-prices-table`}
      />
    </>
  );
}
