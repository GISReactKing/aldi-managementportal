/** @format */

import { Table } from "antd";

interface TableComponentProps {
  dataSource?: any;
  columns?: any;
  loading?: any;
  pagination?: any;
  bordered?: boolean;
  rowSelection?: any;
  onChangeTable?: (
    pagination: any,
    filters: any,
    sorter: any,
    extra: any
  ) => void;
}

export default function TableComponent({
  dataSource,
  columns,
  loading,
  pagination = { position: ["bottom"], pageSize: 10 },
  bordered = false,
  rowSelection = true,
  onChangeTable,
}: TableComponentProps) {
  return (
    <>
      <Table
        rowKey={"_id"}
        loading={loading}
        size={"small"}
        bordered={bordered}
        pagination={pagination}
        columns={columns}
        dataSource={dataSource}
        rowSelection={rowSelection}
        onChange={onChangeTable}
        scroll={dataSource.length > 20 ? { y: "calc(100vh - 360px)" } : {}}
      />
    </>
  );
}
