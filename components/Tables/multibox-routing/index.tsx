/** @format */

import { Table } from "antd";

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
  className?: string;
  setSelectedRecord?: any;
  onDoubleClick?: any;
  onChangeTable?: (
    pagination: any,
    filters: any,
    sorter: any,
    extra: any
  ) => void;
  tableRef?: any;
  id?: string;
}

export default function MultiBoxTable({
  dataSource,
  columns,
  loading,
  scroll = {},
  pagination = { position: ["bottom"], pageSize: 10 },
  bordered = false,
  rowSelection = true,
  className,
  onChangeTable,
  onDoubleClick = null,
  setSelectedRecord = null,
  tableRef,
  id,
}: TableComponentProps) {
  return (
    <>
      <Table
        id={id}
        //@ts-ignore
        ref={(ref) => {
          if (tableRef) tableRef.current = ref;
        }}
        rowKey={"_id"}
        loading={loading}
        size={"small"}
        bordered={bordered}
        pagination={pagination}
        columns={columns}
        dataSource={dataSource}
        rowSelection={rowSelection}
        className={className || ""}
        onChange={onChangeTable}
        scroll={scroll}
      />
    </>
  );
}
