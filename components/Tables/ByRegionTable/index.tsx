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
  setSelectedRowsData?: any;
  setAllSelected?: any;
  setSelectedRecord?: any;
  scroll?: any;
}

export default function TableComponent({
  dataSource,
  columns,
  scroll,
  loading,
  pagination = { position: ["bottom"], pageSize: 10 },
  bordered = false,
  setSelectedRowsData,
  setAllSelected,
  onChangeTable,
  setSelectedRecord = null,
}: TableComponentProps) {
  const rowSelectionConfig = {
    onSelect: (record: any, selected: any, selectedRows: any) => {
      console.log(record, selected, selectedRows);
      setSelectedRowsData(selectedRows);
    },
    onSelectAll: (selected: any, selectedRows: any, changeRows: any) => {
      console.log(selected, selectedRows, changeRows);
      setAllSelected(selected);
    },
  };

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
        onChange={onChangeTable}
        scroll={scroll}
      />
    </>
  );
}
