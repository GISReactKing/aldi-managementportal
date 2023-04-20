/** @format */

import { Table, Grid, Typography, Tag, Space, Radio } from "antd";
import styles from "./carrier-capacity-stepup-table.module.scss";
import { useEffect, useState } from "react";
import moment from "moment";
import { AnyArray } from "immer/dist/internal";
import { ComaSeparator } from "../../../../utils/ComaSeparator";

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
  handleRowClick?: any;
  selectedRow?: any;
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
  scroll = { x: 1000 },
  pagination = { position: ["bottom"] },
  ellipsis,
  bordered = false,
  rowSelection = true,
  sortOrder = "desc",
  handleRowClick,
  selectedRow,
  setValue,
  value,
  CUDDisabled,
}: TableComponentProps) {
  const onChange = (e: any, record: any) => {
    setValue(e.target.value);
    handleRowClick(e, record);
  };

  const [data, setData] = useState(dataSource);

  const carrierCapacityColumns = [
    {
      children: [
        {
          children: [
            {
              width: 170,
              title: (
                <Space direction="vertical">
                  <Text className={styles.headerTitle}>Carrier</Text>
                </Space>
              ),
              dataIndex: "carrierName",
              key: "carrierName",
              className: "carrier-table-column-border",

              render: (name: any, data: any) => (
                <Text
                  style={{ color: data.active === "Active" ? "black" : "red" }}
                >
                  {name}
                </Text>
              ),
            },
          ],
        },
        {
          title: "",
          children: [
            {
              title: (
                <Space direction="vertical">
                  <Text className={styles.headerTitle}>Active</Text>
                </Space>
              ),
              dataIndex: "active",
              key: "active",
              align: "center",
              defaultFilteredValue: ["Active"],
              filters: [
                {
                  text: "Active",
                  value: "Active",
                },
                {
                  text: "Inactive",
                  value: "Inactive",
                },
              ],
              onFilter: (active: any, record: any) =>
                record.active.indexOf(active) === 0,
              render: (active: string) => (
                <Text
                  style={{
                    color: active === "Active" ? "black" : "red",
                    fontWeight: "bolder",
                  }}
                >
                  {`${active === "Active" ? "Y" : "N"}`}
                </Text>
              ),
              className: "carrier-table-column-border",
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
      ],
    },

    {
      children: [
        {
          title: (
            <Space direction="vertical">
              <Text className={styles.headerTitle}>Primary Parameters</Text>
            </Space>
          ),
          className: "carrier-table-column-empty",
          children: [
            {
              align: "right",
              title: (
                <Space direction="vertical">
                  <Text className={styles.headerTitle}>Limit Cube M</Text>
                </Space>
              ),
              dataIndex: "primary_limit_cube",
              key: "primary_limit_cube",
              className: "carrier-table-column-border",
              render: (value: any) => {
                return (
                  <span
                    style={{
                      fontWeight: value == null ? "bold" : "",
                      color: value == null ? "grey" : "black",
                    }}
                  >
                    {value == null ? "None" : ComaSeparator(value)}
                  </span>
                );
              },
            },
            {
              align: "center",
              title: (
                <Space direction="vertical">
                  <Text className={styles.headerTitle}>Parcel Qty Limit</Text>
                </Space>
              ),
              dataIndex: "primary_parcel_qty_limit",
              key: "primary_parcel_qty_limit",
              className: "carrier-table-column-border",
              render: (values: any) => {
                return values.filter((item: any) => item > 0).length
                  ? "Y"
                  : "N";
              },
            },
          ],
        },
      ],
    },
    {
      // align: "center",
      className: "carrier-table-column-border-bottom-carrier-empty",
      width: 30,
      children: [
        {
          className: "carrier-table-column-empty",
          width: 30,
        },
      ],
    },
    {
      children: [
        {
          className: "carrier-table-column-empty",
          children: [
            {
              align: "right",
              title: (
                <Space direction="vertical">
                  <Text className={styles.headerTitle}>Limit Cube M</Text>
                </Space>
              ),
              dataIndex: "secondary_limit_cube",
              key: "secondary_limit_cube",
              className: "carrier-table-column-border",
              render: (value: any) => {
                return (
                  <span
                    style={{
                      fontWeight: value == null ? "bold" : "",
                      color: value == null ? "grey" : "black",
                    }}
                  >
                    {value == null ? "None" : ComaSeparator(value)}
                  </span>
                );
              },
            },
            {
              title: (
                <>
                  <Space direction="horizontal">
                    <Space direction="vertical" style={{ gap: "0px" }}>
                      <Text className={styles.headerTitle}>
                        Parcel Qty Limit
                      </Text>
                    </Space>
                  </Space>
                </>
              ),
              align: "center",
              dataIndex: "secondary_parcel_qty_limit",
              key: "secondary_parcel_qty_limit",
              render: (values: any) => {
                return values.filter((item: any) => item > 0).length
                  ? "Y"
                  : "N";
              },
              className: "carrier-table-column-border",
            },
          ],
        },
      ],
    },

    {
      className: "carrier-table-column-empty",
      title: (
        <Space direction="vertical">
          <Text className={styles.headerTitle}>Secondary Parameters</Text>
        </Space>
      ),
      children: [
        {
          className: "carrier-table-column-empty",
          align: "center",
          children: [
            {
              align: "center",
              title: (
                <>
                  <Text className={styles.headerTitle}>
                    {" "}
                    Effective From Date
                  </Text>
                </>
              ),
              dataIndex: "effective_date",
              key: "effective_date",
              className: "carrier-table-column-border",
              render: (date: string) => {
                if (!date) {
                  return date;
                }

                return moment(date).format("DD/MM/YYYY");
              },
            },
          ],
        },
      ],
    },

    {
      children: [
        {
          className: "carrier-table-column-border-bottom-carrier",
          title: (
            <Space direction="vertical">
              <Text className={styles.headerTitle}>Effective Between</Text>
            </Space>
          ),
          children: [
            {
              align: "center",
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
              render: (date: string) => {
                if (!date) {
                  return date;
                }

                return moment(date).format("DD/MM/YYYY");
              },
            },
            {
              align: "center",
              title: (
                <>
                  <Space direction="horizontal">
                    <Space direction="vertical">
                      <Text className={styles.headerTitle}>Date To</Text>
                    </Space>
                  </Space>
                </>
              ),
              dataIndex: "effective_between_date_to",
              key: "effective_between_date_to",
              className: "carrier-table-column-border-up-carrier",
              render: (date: string) => {
                if (!date) {
                  return date;
                }

                return moment(date).format("DD/MM/YYYY");
              },
            },
          ],
        },
      ],
    },

    {
      className: "carrier-table-column-empty",

      children: [
        {
          className: "carrier-table-column-empty",
          align: "center",
          children: [
            {
              align: "center",
              title: (
                <>
                  <Text className={styles.headerTitle}>Select</Text>
                </>
              ),
              dataIndex: "include",
              className: "carrier-table-column-border",
              key: "include",
              width: 30,
              render: (include: any, record: any) => {
                return (
                  <Radio.Group
                    onChange={(e) => onChange(e, record)}
                    value={value}
                    disabled={CUDDisabled}
                  >
                    <Radio value={record.carrier}></Radio>
                  </Radio.Group>
                );
              },
            },
          ],
        },
      ],
    },
  ];

  useEffect(() => {
    setData(dataSource);
  }, [dataSource]);

  function handleOnChange(filters: any) {}

  return (
    <>
      <Table
        dataSource={data}
        rowKey={"_id"}
        // scroll={scroll}
        loading={loading}
        size={"small"}
        bordered={bordered}
        pagination={pagination}
        onChange={handleOnChange}
        rowSelection={rowSelection}
        columns={carrierCapacityColumns}
        className={`${styles.tableContent} carrier-prices-table`}
      />
    </>
  );
}
