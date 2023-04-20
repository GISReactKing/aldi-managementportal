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

export default function TableComponent({
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
        id={id || "multi-box-exceptions-table"}
        onRow={(record, rowIndex) => {
          return {
            onClick: (e) => {
              const target = e.target as Element;
              if (setSelectedRecord) {
                let tr = target.parentNode as Element; // get the TR tag
                if (tr.nodeName !== "TR") {
                  tr = tr.parentNode as Element;
                }

                const parentNode = tr.parentNode as Element;
                //Color all tr labels
                for (let i = 0; i < parentNode.childNodes.length; i++) {
                  if (parentNode) {
                    const child = parentNode.childNodes[i] as Element;
                    child.setAttribute("style", "backgroundColor: ''");
                  }
                }
                //Set the selected label color separately
                tr.setAttribute("style", "background-color: rgb(115,201,236)");
                setSelectedRecord(record);
              }
            },
            onDoubleClick: (e) => {
              if (setSelectedRecord) {
                setSelectedRecord(record);
              }
              if (onDoubleClick) {
                onDoubleClick(record, rowIndex);
              }
            },
          };
        }}
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
        // scroll={
        //   Object.keys(scroll).length
        //     ? scroll
        //     : dataSource.length > 20
        //     ? { y: "calc(100vh - 360px)" }
        //     : {}
        // }
        scroll={scroll}
        // style={{ height: '550px' }}
      />
    </>
  );
}
