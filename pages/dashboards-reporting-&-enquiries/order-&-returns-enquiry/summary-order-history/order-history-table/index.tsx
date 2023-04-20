/** @format */

import { Table, Typography, Space } from "antd";
import styles from "./history-table.module.scss";
import { useState } from "react";
import useAppDispatch from "../../../../../hooks/useAppDispatch";
import { useRouter } from "next/router";
import {
  isValueNegative,
  openOrderEnquiryTabs,
  valueWithCurrencySign,
} from "../../../../../utils/helpers";
import useTheme from "../../../../../hooks/useTheme";

const { Text } = Typography;
export const defaultOrderNo = 5123456;
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

const statusReturnsPortal = "Returns Portal";

// @ts-ignore
export default function TableComponent({
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
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const originData = [
    {
      orderDate: "22/12/21",
      orderNo: defaultOrderNo,
      deliveryPostCode: "B109YZ",
      order1Lines: "5",
      order1OrderedItems: "30",
      order1OrderValue: "142.25",
      order2Lines: "4",
      order2AmendedQty: "1",
      order2AmendedValue: "-15.00",
      order3Parcels: "1",
      order3Lines: "1",
      order3DeliveryItems: "6",
      order3DeliveryValue: "13.00",
      order3StatusDate: "04/08/2021",
      order3DeliveryStatus: "Part Delivered More Details",
      returnedItems: "30",
      refundValue: "20.00",
      returnsStatusDate: "",
      returnsStatus: "",
    },
    {
      orderDate: "22/12/21",
      orderNo: defaultOrderNo,
      deliveryPostCode: "B109YZ",
      order1Lines: "0",
      order1OrderedItems: "30",
      order1OrderValue: "142.25",
      order2Lines: "3",
      order2AmendedQty: "0",
      order2AmendedValue: "0",
      order3Parcels: "4",
      order3Lines: "1",
      order3DeliveryItems: "6",
      order3DeliveryValue: "13.00",
      order3StatusDate: "04/08/2021",
      order3DeliveryStatus: "Part Delivered More Details",
      returnedItems: "30",
      refundValue: "20.00",
      returnsStatusDate: "04/08/2021 07:40",
      returnsStatus: statusReturnsPortal,
    },
    {
      orderDate: "22/12/21",
      orderNo: defaultOrderNo,
      deliveryPostCode: "B109YZ",
      order1Lines: "3",
      order1OrderedItems: "30",
      order1OrderValue: "142.25",
      order2Lines: "4",
      order2AmendedQty: "0",
      order2AmendedValue: "0",
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
    {
      orderDate: "22/12/21",
      orderNo: defaultOrderNo,
      deliveryPostCode: "B109YZ",
      order1Lines: "0",
      order1OrderedItems: "30",
      order1OrderValue: "142.25",
      order2Lines: "1",
      order2AmendedQty: "0",
      order2AmendedValue: "0",
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
    {
      orderDate: "22/12/21",
      orderNo: defaultOrderNo,
      deliveryPostCode: "B109YZ",
      order1Lines: "0",
      order1OrderedItems: "30",
      order1OrderValue: "142.25",
      order2Lines: "1",
      order2AmendedQty: "0",
      order2AmendedValue: "0",
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
              Order Date
            </Space>
          ),
          dataIndex: "orderDate",
          key: "orderDate",
          className: "carrier-table-column",
          width: 100,
        },
      ],
    },
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
          width: 100,
          render: (orderNo: string | number) => (
            <Text
              onClick={() => {
                openOrderEnquiryTabs(dispatch, router, orderNo || "");
                // here the code
                if (onSelectedRow) onSelectedRow(orderNo);
              }}
              className="underline cursor-pointer text-blue-600"
            >
              {orderNo}
            </Text>
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
              Delivery Post Code
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
          width: 50,
          title: (
            <Space className="text-center history" direction="vertical">
              Order Lines
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
              Ordered Items
            </Space>
          ),
          dataIndex: "order1OrderedItems",
          key: "order1OrderedItems",
          className: "carrier-table-column",
          width: 50,
        },
        {
          width: 80,
          align: "right",
          title: (
            <>
              <Space className="text-center history" direction="vertical">
                Order Value
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
          width: 50,
          title: (
            <Space className="text-center history" direction="vertical">
              Order Lines
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
              Amended Qty
            </Space>
          ),
          dataIndex: "order2AmendedQty",
          key: "order2AmendedQty",
          className: "carrier-table-column",
          width: 50,
        },
        {
          align: "right",
          title: (
            <>
              <Space className="text-center" direction="vertical">
                Amended Value
              </Space>
            </>
          ),
          dataIndex: "order2AmendedValue",
          width: 50,
          key: "order2AmendedValue",
          render: (value: number) => {
            const isNegative = isValueNegative(value);
            return (
              <Space direction="horizontal">
                <Text className={isNegative ? "text-red-500" : ""}>
                  {valueWithCurrencySign(value)}
                </Text>
              </Space>
            );
          },
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
            <Space
              className="text-center history min-w-max"
              direction="vertical"
            >
              <Text className={styles.headerTitle}>Parcels</Text>
            </Space>
          ),
          dataIndex: "order3Parcels",
          key: "order3Parcels",
          className: "carrier-table-column",
        },
        {
          align: "right",
          width: 50,

          title: (
            <Space className="text-center history" direction="vertical">
              Order Lines
            </Space>
          ),
          dataIndex: "order3Lines",
          key: "order3Lines",
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
          dataIndex: "order3DeliveryItems",
          key: "order3DeliveryItems",
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
          // width: 50,
          align: "center",
          title: (
            <Space className="text-center history" direction="vertical">
              Status Date
            </Space>
          ),
          dataIndex: "order3StatusDate",
          key: "order3StatusDate",
          className: "carrier-table-column",
        },
        {
          // width: 100,
          align: "center",
          title: (
            <Space className="text-center history" direction="vertical">
              Delivery Status
            </Space>
          ),
          dataIndex: "order3DeliveryStatus",
          key: "order3DeliveryStatus",
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
              Returned Items
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
              Refund Value
            </Space>
          ),
          width: 80,
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
              <Space className="text-center min-w-max" direction="vertical">
                <Text className={styles.headerTitle}>Status Date</Text>
              </Space>
            </>
          ),
          dataIndex: "returnsStatusDate",
          key: "returnsStatusDate",
          className: "carrier-table-column",
          render: (value: string, record: (typeof originData)[0]) => {
            const isReturns = record?.returnsStatus === statusReturnsPortal;
            return (
              <Space direction="horizontal">
                <Text className={isReturns ? "text-blue-600" : ""}>
                  {value}
                </Text>
              </Space>
            );
          },
        },
        {
          render: (value: string) => {
            const isReturns = value === statusReturnsPortal;
            return (
              <Space direction="horizontal">
                <Text className={isReturns ? "text-blue-600" : ""}>
                  {value}
                </Text>
              </Space>
            );
          },
          title: (
            <>
              <Space className="text-left min-w-max" direction="vertical">
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
        className={`${styles.tableContent} carrier-prices-table overflow-x-scroll`}
      />
    </>
  );
}
