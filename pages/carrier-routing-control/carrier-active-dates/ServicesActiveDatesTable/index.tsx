/** @format */

import {
  Table,
  Grid,
  Typography,
  Tag,
  Space,
  Radio,
  RadioChangeEvent,
} from "antd";
import styles from "./carrier-active-dates-table.module.scss";
import { useState } from "react";
import { FilterFilled } from "@ant-design/icons";
import moment from "moment";
import { AnyKindOfDictionary, isBoolean } from "lodash";

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
  handleRowClick?: (value: string) => void;
  setValue?: any;
  value?: any;
  CUDDisabled?: boolean;
}

type FetchParams = {
  pagination?: object;
  filters?: any;
};

// @ts-ignore
export default function TableComponent({
  dataSource,
  loading,
  // scroll = { x: 1000 },
  pagination = { position: ["bottom"] },
  ellipsis,
  bordered = false,
  sortOrder = "desc",
  handleRowClick,
  setValue,
  value,
  CUDDisabled,
}: TableComponentProps) {
  const [data, setData] = useState(dataSource);

  const onChange = (e: RadioChangeEvent) => {
    setValue(e.target.value);
    if (typeof handleRowClick === "function")
      handleRowClick(e.target.value || "");
  };

  const carrierActiveDatesColumns: any = [
    {
      align: "center",
      className: "carrier-table-column-border-bottom",
      children: [
        {
          align: "center",
          className: "carrier-table-column-border-right-bottom",
          children: [
            {
              align: "left",
              className: "carrier-table-column-border",
              height: 3,
              title: (
                <Space
                  direction="vertical"
                  style={{ justifyContent: "center" }}
                >
                  <Text className={styles.headerTitle}>Carrier</Text>
                </Space>
              ),
              dataIndex: "name",
              key: "name",
              render: (name: any, data: any) => (
                <Text style={{ color: !!data.status ? "black" : "red" }}>
                  {name}
                </Text>
              ),
            },
          ],
        },
        {
          align: "center",
          className: "carrier-table-column-1",
          children: [
            {
              title: (
                <Space direction="vertical">
                  <Text className={styles.headerTitle}>Active</Text>
                </Space>
              ),
              className: "carrier-table-column-border",
              dataIndex: "status",
              key: "status",
              align: "center",
              render: (status: string) => (
                <Text
                  style={{
                    color: status ? "black" : "red",
                    fontWeight: "bolder",
                  }}
                >
                  {status ? "Y" : "N"}
                </Text>
              ),
            },
          ],
        },
        {
          align: "center",
          className: "carrier-table-column-border-bottom-carrier-empty",
          width: 30,
          children: [
            {
              className: "carrier-table-column-empty",
              width: 30,
            },
          ],
        },
      ],
    },

    {
      title: (
        <Space
          direction="vertical"
          style={{ textAlign: "center", marginRight: 100, marginBottom: 10 }}
        >
          <Text data-testid="sec-per-id" className={styles.headerTitle}>
            Secondary Parameters
          </Text>
        </Space>
      ),

      align: "center",
      children: [
        {
          align: "center",
          children: [
            {
              className: "carrier-table-column-border",
              align: "center",
              title: (
                <Space direction="vertical">
                  <Text className={styles.headerTitle}>Active</Text>
                </Space>
              ),
              dataIndex: "secondaryStatus",
              key: "secondaryStatus",

              render: (status: boolean) => (
                <>
                  {isBoolean(status) ? (
                    <>
                      <Text
                        style={{
                          color: status ? "black" : "red",
                          fontWeight: "bolder",
                        }}
                      >
                        {status ? "Y" : "N"}
                      </Text>
                    </>
                  ) : (
                    ""
                  )}
                </>
              ),
            },
          ],
        },

        {
          align: "center",
          children: [
            {
              align: "center",
              className: "carrier-table-column-border",
              title: (
                <>
                  <Space direction="horizontal">
                    <Space direction="vertical">
                      <Text className={styles.headerTitle}>
                        {" "}
                        Effective From Date
                      </Text>
                    </Space>
                  </Space>
                </>
              ),
              dataIndex: "permanently_Effective_date",
              key: "permanently_Effective_date",
              width: 151,
            },
          ],
        },
        {
          title: (
            <Space direction="vertical">
              <Text className={styles.headerTitle}>Effective Between</Text>
            </Space>
          ),
          // className: "carrier-table-column-border",
          // className: "carrier-table-column-1",

          className: "carrier-active-table-column-border-bottom-carrier",
          children: [
            {
              title: (
                <>
                  <Space direction="horizontal">
                    <Space direction="vertical">
                      <Text className={styles.headerTitle}>Date From</Text>
                    </Space>
                  </Space>
                </>
              ),
              dataIndex: "effective_between_date_from",
              key: "effective_between_date_from",
              className: "carrier-table-column-border-up-carrier",
              // className: "carrier-table-column-1",
              align: "center",
              width: 131,
              render: (date: string) => (
                <span className="text-center">{date}</span>
              ),
            },
            {
              title: (
                <>
                  <Space direction="horizontal">
                    <Space direction="vertical">
                      <Text className={styles.headerTitle}>Date To</Text>
                    </Space>
                  </Space>
                </>
              ),
              className: "carrier-table-column-border-up-carrier",
              align: "center",
              dataIndex: "effective_between_date_to",
              key: "effective_between_date_to",
              width: 131,
              render: (date: string) => (
                <span className="text-center">{date}</span>
              ),
            },
          ],
        },

        {
          align: "center",
          children: [
            {
              align: "center",
              title: (
                <Space direction="vertical">
                  <Text className={styles.headerTitle}>Select</Text>
                </Space>
              ),
              dataIndex: "include",
              className: "carrier-table-column-border",
              key: "include",
              width: 90,
              render: (include: any, record: any) => {
                return (
                  <Radio.Group
                    onChange={onChange}
                    value={value}
                    disabled={CUDDisabled}
                  >
                    <Radio
                      data-testid={`${record.carrier}-id`}
                      value={record.carrier}
                    ></Radio>
                  </Radio.Group>
                );
              },
            },
          ],
        },
      ],
    },
  ];

  const fetch = (params: FetchParams) => {
    let resultData = [...dataSource];
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
    fetch({
      pagination,
      filters,
    } as FetchParams);
  };

  return (
    <Table
      dataSource={dataSource}
      rowKey={"carrier"}
      // scroll={scroll}
      loading={loading}
      size={"small"}
      bordered={bordered}
      pagination={pagination}
      columns={carrierActiveDatesColumns}
      onChange={handleTableChange}
      className={`carrier-prices-table`}
    />
  );
}
