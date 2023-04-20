/** @format */
import React, { useRef } from "react";
import { Table, Typography, Tag, Space, Radio } from "antd";
// @ts-ignore
import styles from "./carrier-prices-table.module.scss";
import moment from "moment";
import { useState, useEffect } from "react";
import { FilterFilled } from "@ant-design/icons";
import { ComaSeparator } from "../../../utils/ComaSeparator";
import { getColumnSearchProps } from "../../../utils/TableColumnFilter";
import {
  setMainTableData,
  setMainTableFixFilter,
} from "../../../redux/slices/CarrierPriceSlice";
import { RootStateOrAny, useDispatch, useSelector } from "react-redux";

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
  defaultRowCount?: any;
  handleRowClick?: any;
  detailData?: any;
  setValue?: any;
  value?: any;
  carrierFilter?: string[];
  serviceFilter?: string[];
  desptachMethodFilter?: string[];
  pricingMethod?: string[];
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
  pagination = { position: ["bottom"], pageSize: 10 },
  ellipsis,
  bordered = false,
  rowSelection = true,
  sortOrder = "desc",
  // defaultRowCount = 10,
  handleRowClick,
  detailData,
  setValue,
  value,
  carrierFilter,
  serviceFilter,
  desptachMethodFilter,
  pricingMethod,
  CUDDisabled,
}: TableComponentProps) {
  // const [data, setData] = useState(dataSource);
  const setData = (val: any) => dispatch(setMainTableData(val));
  const data = useSelector(
    ({ carrierPrice }: RootStateOrAny) => carrierPrice.mainTableData
  );
  const setFixFilter = (val: any) => dispatch(setMainTableFixFilter(val));
  const fixFilter = useSelector(
    ({ carrierPrice }: RootStateOrAny) => carrierPrice.mainTableFixFilter
  );
  // const [fixFilter, setFixFilter] = useState<any>();
  const [searchText, setSearchText] = useState<string>("");
  const [searchedColumn, setSearchedColumn] = useState<string>("");

  const searchInputRef = useRef() as any;

  const dispatch = useDispatch();

  useEffect(() => {
    setData(dataSource);
  }, [dataSource]);

  useEffect(() => {
    if (dataSource) fetch(fixFilter);
  }, [value, dataSource]);

  const onChange = async (e: any, record: any) => {
    setValue(e.target.value);
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
              dataIndex: "name",
              key: "name",
              render: (name: any, data: any) => (
                <Text
                  style={{
                    color: data.status === "Active" ? "black" : "red",
                  }}
                >
                  {name}
                </Text>
              ),
              width: 100,
              filters: carrierFilter,
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
                  <Text className={styles.headerTitle}>Active</Text>
                </Space>
              ),
              dataIndex: "status",
              key: "status",
              align: "center",
              width: 40,
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
              defaultfilters: ["Active"],
              render: (status: string) => (
                <Text
                  style={{
                    color: status === "Active" ? "black" : "red",
                    fontWeight: "bolder",
                  }}
                >
                  {status === "Active" ? "Y" : "N"}
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
                <Space direction="horizontal">
                  <Space direction="vertical">
                    <Text className={styles.headerTitle}>Pricing Method</Text>
                  </Space>
                </Space>
              ),
              dataIndex: "pricing_method",
              key: "pricing_method",
              width: "auto",
              filters: pricingMethod,
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
              className: "carrier-table-column-border overflow-hidden",
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
                  <Text className={styles.headerTitle}>Contract</Text>
                </Space>
              ),
              dataIndex: "contracts",
              key: "contracts",
              width: "auto",
              className: "carrier-table-column-border overflow-hidden",
              // align: "left",
            },
            {
              title: (
                <Space direction="vertical" className="text-left">
                  <Text className={styles.headerTitle}>Service</Text>
                </Space>
              ),
              // ...getColumnSearchProps(
              //   "serviceDescription",
              //   searchInputRef,
              //   { searchText, setSearchText },
              //   { searchedColumn, setSearchedColumn },
              // ),
              filters: serviceFilter,
              filterSearch: true,
              sorter: (a: any, b: any) =>
                a.serviceDescription.localeCompare(b.serviceDescription),
              dataIndex: "serviceDescription",
              key: "serviceDescription",
              width: "auto",
              className: "carrier-table-column-border overflow-hidden",
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
                  {/* <Text className={styles.headerTitle}>Description</Text> */}
                </Space>
              ),
              dataIndex: "dispatch_method_description",
              key: "dispatch_method_description",
              width: "auto",
              filters: desptachMethodFilter,
              sorter: (a: any, b: any) =>
                a.dispatch_method_description.localeCompare(
                  b.dispatch_method_description
                ),

              className: "carrier-table-column-border overflow-hidden",
              // align: "left",
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
          className: "carrier-table-column-empty",
          // align: "left",
          title: (
            <Space direction="vertical">
              <Text className={styles.headerTitle}>Primary Cost Values</Text>
            </Space>
          ),
          children: [
            {
              title: (
                <>
                  <Space direction="horizontal">
                    <Space direction="vertical" style={{ gap: "0px" }}>
                      <Text className={styles.headerTitle}>Base Cost</Text>
                    </Space>
                    {/* <div className={styles.filterIconContainer}>
                      <FilterFilled className={styles.filterIcon} />
                    </div> */}
                  </Space>
                </>
              ),
              align: "right",
              dataIndex: "primary_base_cost",
              key: "primary_base_cost",
              width: "auto",
              render: (value: number) => {
                let item = Number(value);
                if (isNaN(item)) return null;

                return (
                  <Space direction="horizontal">
                    <Text>£</Text>
                    <Text>{ComaSeparator(Number(item).toFixed(2))}</Text>
                  </Space>
                );
              },
              className: "carrier-table-column-border",
            },
            {
              title: (
                <>
                  <Space direction="horizontal">
                    <Space direction="vertical">
                      <Text className={styles.headerTitle}>Matrix Records</Text>
                    </Space>
                    {/*<div className={styles.filterIconContainer}><FilterFilled className={styles.filterIcon} /></div>*/}
                  </Space>
                </>
              ),
              align: "center",
              width: 120,
              dataIndex: "primary_matrix_record",
              key: "primary_matrix_record",
              className: "carrier-table-column-border",
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
      ],
    },

    {
      children: [
        {
          title: (
            <Text className={styles.headerTitle}>Secondary Cost Values</Text>
          ),
          // align: "left",
          className: "carrier-table-column-empty",
          children: [
            {
              title: (
                <>
                  <Space direction="horizontal">
                    <Space direction="vertical">
                      <Text className={styles.headerTitle}>Base Cost</Text>
                    </Space>
                    {/*<div className={styles.filterIconContainer}><FilterFilled className={styles.filterIcon} /></div>*/}
                  </Space>
                </>
              ),
              align: "right",
              dataIndex: "secondary_base_cost",
              key: "secondary_base_cost",
              width: "auto",
              render: (value: number) => {
                let item = Number(value);
                if (isNaN(item)) return null;

                return (
                  <Space direction="horizontal">
                    <Text>£</Text>
                    <Text>{ComaSeparator(Number(item).toFixed(2))}</Text>
                  </Space>
                );
              },
              className: "carrier-table-column-border",
            },
            {
              title: (
                <>
                  <Space direction="horizontal">
                    <Space direction="vertical">
                      <Text className={styles.headerTitle}>Matrix Records</Text>
                    </Space>
                    {/*<div className={styles.filterIconContainer}><FilterFilled className={styles.filterIcon} /></div>*/}
                  </Space>
                </>
              ),
              align: "center",
              width: "auto",
              dataIndex: "secondary_matrix_record",
              key: "secondary_matrix_record",
              className: "carrier-table-column-border",
            },
          ],
        },
        {
          className: "carrier-table-column-empty",
          children: [
            {
              title: (
                <>
                  <Space direction="horizontal">
                    <Space direction="vertical">
                      <Text className={styles.headerTitle}>
                        Effective From Date
                      </Text>
                    </Space>
                  </Space>
                </>
              ),
              dataIndex: "permanently_Effective_date",
              key: "permanently_Effective_date",
              className: "carrier-table-column-border",
              align: "center",
              width: 100,
              render: (date: string) => {
                return (
                  <>
                    {date && <Text> {moment(date).format("DD/MM/YYYY")}</Text>}
                  </>
                );
              },
            },
          ],
        },
        {
          title: (
            <>
              <Space direction="horizontal">
                <Space direction="vertical">
                  <Text className={styles.headerTitle}>Effective Between</Text>
                </Space>
              </Space>
            </>
          ),
          className: "carrier-table-column-border-bottom-carrier",
          children: [
            {
              title: (
                <>
                  <Space direction="horizontal">
                    <Space direction="vertical">
                      <Text className={styles.headerTitle}>Date From</Text>
                    </Space>
                    {/*<div className={styles.filterIconContainer}><FilterFilled className={styles.filterIcon} /></div>*/}
                  </Space>
                </>
              ),
              dataIndex: "effective_between_date_from",
              align: "center",
              key: "effective_between_date_from",
              className: "carrier-table-column-border-up-carrier",
              width: "auto",
              render: (date: string) => {
                return (
                  <>
                    {date && <Text> {moment(date).format("DD/MM/YYYY")}</Text>}
                  </>
                );
              },
            },
            {
              title: (
                <>
                  <Space direction="horizontal">
                    <Space direction="vertical">
                      <Text className={styles.headerTitle}>Date To</Text>
                    </Space>
                    {/*<div className={styles.filterIconContainer}><FilterFilled className={styles.filterIcon} /></div>*/}
                  </Space>
                </>
              ),
              dataIndex: "effective_between_date_to",
              key: "effective_between_date_to",
              className: "carrier-table-column-border-up-carrier",
              align: "center",
              width: "auto",
              render: (date: string) => {
                return (
                  <>
                    {date && <Text> {moment(date).format("DD/MM/YYYY")}</Text>}
                  </>
                );
              },
            },
          ],
          // align: 'center'
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
                    <Radio value={record.clientMethodID}></Radio>
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
    setFixFilter(params);

    let resultData = [...(dataSource || [])];
    if (params?.filters) {
      Object.keys(params?.filters).map((key, index) => {
        if (params?.filters[key]) {
          const filterValues = params?.filters[key];
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
    <>
      <Table
        // onRow={(record, rowIndex) => {
        //   return {
        //     onClick: (e) => handleRowClick(record, e), // click row
        //   };
        // }}
        dataSource={data}
        rowKey={"clientMethodID"}
        loading={loading}
        size={"small"}
        bordered={bordered}
        pagination={pagination}
        rowSelection={rowSelection}
        columns={columnsExample}
        onChange={handleTableChange}
        className={`${styles.tableContent} carrier-prices-table`}
        // scroll={scroll}
        // rowClassName={(record: any, index: any) => {
        //   if (!detailData) {
        //     return "table-row-dark";
        //   }
        //   return record.key == detailData.key
        //     ? "ant-table-row-selected"
        //     : "table-row-dark";
        // }}
      />
    </>
  );
}
