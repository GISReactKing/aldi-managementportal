/** @format */

import { Table } from "antd";
import { useEffect, useState } from "react";

interface TableComponentProps {
  dataSource?: any;
  columns?: any;
  loading?: any;
  pagination?: any;
  bordered?: boolean;
  rowSelection?: any;
  defaultRowCount?: any;
  CUDDisabled: boolean;
  rowKey: any;
  onChangeTable?: (
    pagination: any,
    filters: any,
    sorter: any,
    extra: any
  ) => void;
}

type FetchParams = {
  pagination?: object;
  filters?: any;
};

export default function TableComponent({
  dataSource,
  columns,
  loading,
  pagination = { position: ["bottom"], pageSize: 10 },
  bordered = false,
  rowSelection,
  defaultRowCount = 10,
  rowKey,
  CUDDisabled,
}: TableComponentProps) {
  function handleOnChange(filters: any) {}

  return (
    <>
      <Table
        rowKey={rowKey}
        loading={loading}
        size={"small"}
        bordered={bordered}
        pagination={pagination}
        columns={columns}
        dataSource={dataSource}
        rowSelection={rowSelection}
        onChange={handleOnChange}
      />
    </>
  );
}
