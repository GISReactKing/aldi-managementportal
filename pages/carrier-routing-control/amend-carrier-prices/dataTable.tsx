/** @format */
import React, { useState } from "react";
import { Table } from "antd";
import { ComaSeparator } from "../../../utils/ComaSeparator";

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
  pagination = { position: ["bottom"], pageSize: 10 },
  bordered = true,
  onChangeTable,
}: TableComponentProps) {
  const [data, setData] = useState<any>([
    {
      _id: 1,
      base_price: 3.25,
      from_weight: 0,
      increment_price: "-",
      increment_start: 0,
      weight_increments: 0,
    },
    {
      _id: 2,
      base_price: 5.25,
      from_weight: 1,
      increment_price: "-",
      increment_start: 1,
      weight_increments: 1,
    },
  ]);

  const columns: any = [
    {
      title: "Matrix Row #",
      dataIndex: "_id",
      key: "_id",
      className: "table-header-col",
      showSorterTooltip: false,
      align: "center",
      render: (item: any) => {
        return <span className="text-center">{item}</span>;
      },
    },
    {
      title: "Base Price",
      dataIndex: "from_weight",
      key: "from_weight",
      align: "center",
      render: (item: any) => {
        return <span className="text-center">£ {ComaSeparator(item)}</span>;
      },
    },
    {
      title: "From Weight",
      dataIndex: "base_price",
      key: "base_price",
      align: "center",
      render: (item: any) => {
        return <span className="text-center">{item}</span>;
      },
    },
    {
      title: "Increment Price",
      dataIndex: "increment_price",
      key: "increment_price",
      align: "center",
      render: (item: any) => {
        return <span className="text-center">£ {ComaSeparator(item)}</span>;
      },
    },
    {
      title: "Increment Start",
      dataIndex: "increment_start",
      key: "increment_start",
      align: "center",
      render: (item: any) => {
        return <span className="text-center">{item}</span>;
      },
    },
    {
      title: "Weight Increments",
      dataIndex: "weight_increments",
      key: "weight_increments",
      align: "center",
      render: (item: any) => {
        return <span className="text-center">{item}</span>;
      },
    },
  ];

  return (
    <>
      <Table
        style={{ borderStyle: "double" }}
        rowKey={"_id"}
        size={"small"}
        bordered={bordered}
        pagination={false}
        columns={columns}
        dataSource={data}
        // rowSelection={rowSelectionConfig}
        onChange={onChangeTable}
      />
    </>
  );
}
