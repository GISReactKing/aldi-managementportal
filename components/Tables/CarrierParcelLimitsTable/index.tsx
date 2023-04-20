/** @format */

import { Table, TableProps, Typography, Space, Radio } from "antd";
import { useMemo } from "react";
import _ from "lodash";
import { ComaSeparator } from "../../../utils/ComaSeparator";
// @ts-ignore
import styles from "./carrier-prices-table.module.scss";
import { CarrierParcelLimitData } from "../../../interfaces/carrierParcelLimits";
import useAppSelector from "../../../hooks/useAppSelector";
import useAppDispatch from "../../../hooks/useAppDispatch";
import {
  setTableConfig,
  TableConfig,
} from "../../../redux/slices/CarrierParcelLimitsSlice";
import React from "react";

const { Text } = Typography;

interface TableComponentProps {
  dataSource?: CarrierParcelLimitData[];
  columns?: any;
  loading?: any;
  pagination?: TableProps<CarrierParcelLimitData>["pagination"];
  bordered?: boolean;
  rowSelection?: any;
  defaultRowCount?: any;
  handleRowClick?: any;
  setValue?: any;
  value?: any;
  CUDDisabled?: boolean;
  includeRecordsSecondaryParameters: any;
}

// @ts-ignore
export default function TableComponent({
  dataSource,
  loading,
  pagination = {
    pageSizeOptions: [50, 100, 200, 300, 400, 500],
    defaultPageSize: 500,
  },
  bordered = false,
  rowSelection = true,
  handleRowClick,
  setValue,
  value,
  includeRecordsSecondaryParameters,
  CUDDisabled,
}: TableComponentProps) {
  const dispatch = useAppDispatch();
  const tableConfig = useAppSelector(
    (state) => state?.carrierParcelLimits?.tableConfig
  );
  const uniqueData = useMemo(
    () => _.orderBy(_.uniqBy(dataSource, "id"), ["career", "despatchMethod"]),
    [dataSource]
  );

  const data = useMemo(
    () =>
      includeRecordsSecondaryParameters
        ? uniqueData.filter((i) => i.secondaryParameter === "Y")
        : uniqueData,
    [uniqueData, includeRecordsSecondaryParameters]
  );

  const carrierList = useMemo(
    () =>
      data
        .reduce((prev: string[], curr) => {
          const prevData: string[] = prev || [];
          if (!prevData?.includes?.(curr?.carrier || "")) {
            prevData.push(curr.carrier);
          }
          return prevData;
        }, [])
        .map((value) => ({ value, text: value })),
    [data]
  );

  const despatchMethodList = useMemo(
    () =>
      data
        .reduce((prev: string[], curr) => {
          const prevData: string[] = prev || [];
          if (!prevData?.includes?.(curr?.despatchMethod || "")) {
            prevData.push(curr.despatchMethod);
          }
          return prevData;
        }, [])
        .map((value) => ({ value, text: value })),
    [data]
  );

  const onChange = async (e: any, record: any) => {
    setValue(record.id);
    handleRowClick(record);
  };

  const columnsExample = [
    {
      children: [
        {
          title: "",
          className: "carrier-table-column-empty",
          children: [
            {
              title: (
                <Space
                  direction="vertical"
                  style={{ justifyContent: "center" }}
                >
                  <Text className={styles.headerTitle}>Carriers</Text>
                </Space>
              ),
              dataIndex: "carrier",
              key: "carrier",
              width: 100,
              filters: carrierList,
              filteredValue: tableConfig?.filters?.carrier || null,
              onFilter: (value: string, record: CarrierParcelLimitData) =>
                record?.carrier === value,

              filterSearch: true,
              className: "carrier-table-column-border",
              render: (carrier: any, data: any) => (
                <Text style={{ color: data.active === true ? "black" : "red" }}>
                  {carrier}
                </Text>
              ),
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
                  <Text className={styles.headerTitle}>Active</Text>
                </Space>
              ),
              dataIndex: "active",
              key: "active",
              align: "center",
              width: 40,
              filteredValue: tableConfig?.filters?.active || null,

              onFilter: (value: boolean, record: CarrierParcelLimitData) =>
                record?.active === value,
              filters: [
                {
                  text: "Active",
                  value: true,
                },
                {
                  text: "Inactive",
                  value: false,
                },
              ],
              render: (active: boolean) => (
                <Text
                  style={{
                    color: active === true ? "black" : "red",
                    fontWeight: "bolder",
                  }}
                >
                  {active === true ? "Y" : "N"}
                </Text>
              ),
              className: "carrier-table-column-border",
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
                  <Text className={styles.headerTitle}>Despatch Method</Text>
                </Space>
              ),
              dataIndex: "despatchMethod",
              key: "despatchMethod",
              width: 150,
              ...(tableConfig?.sorter?.columnKey === "despatchMethod "
                ? { sortOrder: tableConfig?.sorter?.order }
                : {}),

              sorter: (
                a: CarrierParcelLimitData,
                b: CarrierParcelLimitData
              ) => {
                const despatch1 = a?.despatchMethod;
                const despatch2 = b?.despatchMethod;
                if (despatch1 < despatch2) {
                  return -1;
                }
                if (despatch1 > despatch2) {
                  return 1;
                }
                return 0;
              },
              filters: despatchMethodList,
              filteredValue: tableConfig?.filters?.despatchMethod || null,
              onFilter: (value: string, record: CarrierParcelLimitData) =>
                record?.despatchMethod === value,
              filterSearch: true,
              render: (value: any) => {
                return (
                  <span
                    style={{
                      color: `${value === "None" ? "grey" : "black"}`,
                    }}
                  >
                    {value}
                  </span>
                );
              },
              className: "carrier-table-column-border",
            },
          ],
        },
        // {
        //   title: "",
        //   className: "carrier-table-column-empty",
        //   children: [
        //     {
        //       title: (
        //         <Space direction="vertical" className="text-left">
        //           <Text className={styles.headerTitle}>
        //             Carrier Service Code
        //           </Text>
        //         </Space>
        //       ),
        //       filters: carrierServiceCodeList,
        //       filterSearch: true,
        //       dataIndex: "name",
        //       key: "name",
        //       width: 200,
        //       className: "carrier-table-column-border",
        //     },
        //   ],
        // },
        {
          title: "",
          className: "carrier-table-column-empty",
          children: [
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
      title: (
        <Space direction="vertical">
          <Text className={styles.headerTitle}>Primary Parameters</Text>
        </Space>
      ),
      children: [
        {
          className: "carrier-table-column-empty",
          children: [
            {
              title: (
                <>
                  <Space direction="horizontal">
                    <Space direction="vertical" style={{ gap: "0px" }}>
                      <Text className={styles.headerTitle}>Length</Text>
                    </Space>
                  </Space>
                </>
              ),

              dataIndex: "length",
              key: "length",
              width: 80,
              align: "right",
              className: "carrier-table-column-border",
              render: (value: number) => {
                let item = Number(value);
                if (isNaN(item)) return null;

                return (
                  <Space direction="horizontal">
                    <Text>{ComaSeparator(Number(item).toFixed(0))}</Text>
                  </Space>
                );
              },
            },
            {
              title: (
                <>
                  <Space direction="horizontal">
                    <Space direction="vertical">
                      <Text className={styles.headerTitle}>
                        Volume m<sup>3</sup>
                      </Text>
                    </Space>
                    {/*<div className={styles.filterIconContainer}><FilterFilled className={styles.filterIcon} /></div>*/}
                  </Space>
                </>
              ),
              width: 80,
              dataIndex: "volume",
              key: "volume",
              align: "right",
              className: "carrier-table-column-border",
              render: (value: number) => {
                let item = Number(value);
                if (isNaN(item)) return null;

                return (
                  <Space direction="horizontal">
                    <Text>{ComaSeparator(Number(item).toFixed(2))}</Text>
                  </Space>
                );
              },
            },
            {
              title: (
                <>
                  <Space direction="horizontal">
                    <Space direction="vertical">
                      <Text className={styles.headerTitle}>Parcels</Text>
                    </Space>
                    {/*<div className={styles.filterIconContainer}><FilterFilled className={styles.filterIcon} /></div>*/}
                  </Space>
                </>
              ),
              width: 80,
              dataIndex: "parcels",
              key: "parcels",
              align: "right",
              className: "carrier-table-column-border",
              render: (value: number) => {
                let item = Number(value);
                if (isNaN(item)) return null;

                return (
                  <Space direction="horizontal">
                    <Text>{ComaSeparator(Number(item).toFixed(0))}</Text>
                  </Space>
                );
              },
            },
            {
              title: (
                <>
                  <Space direction="horizontal">
                    <Space direction="vertical">
                      <Text className={styles.headerTitle}>Parcel KG</Text>
                    </Space>
                    {/*<div className={styles.filterIconContainer}><FilterFilled className={styles.filterIcon} /></div>*/}
                  </Space>
                </>
              ),
              width: 80,
              dataIndex: "parcelKG",
              key: "parcelKG",
              align: "right",
              className: "carrier-table-column-border",
              render: (value: number) => {
                let item = Number(value);
                if (isNaN(item) || value == null) return null;

                return (
                  <Space direction="horizontal">
                    <Text>{ComaSeparator(Number(item).toFixed(2))}</Text>
                  </Space>
                );
              },
            },
            {
              title: (
                <>
                  <Space direction="horizontal">
                    <Space direction="vertical">
                      <Text className={styles.headerTitle}>Consignment KG</Text>
                    </Space>
                    {/*<div className={styles.filterIconContainer}><FilterFilled className={styles.filterIcon} /></div>*/}
                  </Space>
                </>
              ),
              width: 80,
              dataIndex: "consignmentKG",
              key: "consignmentKG",
              align: "right",
              className: "carrier-table-column-border",
              render: (value: number) => {
                let item = Number(value);
                if (isNaN(item) || value == null) return null;

                return (
                  <Space direction="horizontal">
                    <Text>{ComaSeparator(Number(item).toFixed(2))}</Text>
                  </Space>
                );
              },
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
      children: [
        {
          className: "carrier-table-column-empty",
          children: [
            {
              title: (
                <>
                  <Space direction="horizontal">
                    <Space direction="vertical">
                      <Text className={styles.headerTitle}>
                        Secondary Parameters
                      </Text>
                    </Space>
                    {/*<div className={styles.filterIconContainer}><FilterFilled className={styles.filterIcon} /></div>*/}
                  </Space>
                </>
              ),
              align: "center",
              dataIndex: "secondaryParameter",
              key: "secondaryParameter",
              width: 80,

              className: "carrier-table-column-border",
            },
          ],
        },

        {
          children: [
            {
              align: "center",
              title: (
                <>
                  <Text className={styles.headerTitle}>Select</Text>
                </>
              ),
              dataIndex: "select",
              className: "carrier-table-column-border",
              key: "select",
              width: 30,
              render: (select: any, record: any) => {
                return (
                  <Radio.Group
                    onChange={(e) => onChange(e, record)}
                    value={value}
                    disabled={CUDDisabled}
                  >
                    <Radio value={record.id}></Radio>
                  </Radio.Group>
                );
              },
            },
          ],
        },
      ],
    },
  ];

  const onTableChange: TableProps<CarrierParcelLimitData>["onChange"] = (
    pagination,
    filters,
    sorter,
    extra
  ) => {
    dispatch(
      setTableConfig({
        filters,
        pagination,
        sorter,
      } as TableConfig)
    );
  };
  return (
    <>
      <Table
        dataSource={data}
        rowKey={"id"}
        loading={loading}
        size={"small"}
        bordered={bordered}
        pagination={tableConfig?.pagination || pagination}
        rowSelection={rowSelection}
        columns={columnsExample}
        className={`${styles.tableContent} carrier-prices-table`}
        onChange={onTableChange}
      />
    </>
  );
}
