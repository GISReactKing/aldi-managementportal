/** @format */

import { Table, Typography, Tag, Space } from "antd";
// import styles from "../CarrierPricesTable/carrier-prices-table.module.scss";
import { useState } from "react";

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
}

type FetchParams = {
  pagination?: object;
  filters?: any;
};

// @ts-ignore
export default function TableComponent({
  dataSource = null,
  loading = false,
  scroll = { x: 1000 },
  pagination = false,
  ellipsis,
  bordered = false,
  rowSelection = false,
  sortOrder = "desc",
  handleRowClick,
}: TableComponentProps) {
  const [data, setData] = useState(dataSource);

  const columnsExample = [
    {
      title: "Code",
      className: "carrier-table-column-string",
      dataIndex: "code",
      key: "code",
      render: (value: string) => (
        <div style={{ textAlign: "right" }}>
          <span>{value}</span>
        </div>
      ),
      width: 50,
    },
    {
      title: "Level 1: Process Event",
      className: "carrier-table-column",
      dataIndex: "level1",
      key: "level1",
    },
    {
      title: "Level 2: Customer Event",
      className: "carrier-table-column",
      dataIndex: "level2",
      render: (value: string) => (
        <span style={{ color: "#0000ff" }}>{value}</span>
      ),
      key: "level2",
    },
  ];

  return (
    <>
      <Table
        onRow={(record, rowIndex) => {
          return {
            onDoubleClick: (e) => handleRowClick(record), // click row
          };
        }}
        dataSource={data}
        // rowKey={'_id'}
        loading={loading}
        size={"small"}
        bordered={bordered}
        pagination={pagination}
        rowSelection={rowSelection}
        columns={columnsExample}
        // className={`${styles.tableContent} carrier-prices-table`}
        scroll={scroll}
      />
    </>
  );
}
