/** @format */

import { Table, Grid, Avatar } from "antd";
import ActionBtn from "../../ActionBtn";
const { useBreakpoint } = Grid;

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
  onChangeTable?: (
    pagination: any,
    filters: any,
    sorter: any,
    extra: any
  ) => void;
  setShowEdit?: any;
  setShowView?: any;
  onDeleteHandle?: any;
  className?: any;
  rowClassName?: any;
  rowKey?: string;
  scrollable?: boolean;
}

export default function TableComponent({
  dataSource,
  columns,
  loading,
  scroll = { x: "max-content" },
  pagination = { position: ["bottom"], pageSize: 100000 },
  ellipsis,
  bordered = false,
  sortOrder = "descend",
  rowSelection = true,
  onChangeTable,
  setShowEdit,
  setShowView,
  onDeleteHandle,
  className,
  rowClassName,
  rowKey,
}: TableComponentProps) {
  const { md } = useBreakpoint();
  return (
    <>
      <Table
        rowKey={rowKey ? rowKey : "_id"}
        scroll={scroll}
        loading={loading}
        size={"small"}
        bordered={bordered}
        pagination={pagination}
        columns={columns}
        dataSource={dataSource}
        rowSelection={rowSelection}
        onChange={onChangeTable}
        className={className}
        rowClassName={rowClassName}
      />
    </>
  );
}
