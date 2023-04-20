/** @format */

import { Table, Grid, Typography, Tag, Space } from "antd";
import { useState } from "react";
import { FilterFilled } from "@ant-design/icons";
import moment from "moment";
import { Form, Row } from "react-bootstrap";

const { Text } = Typography;

interface TableComponentProps {
  dataSource?: any;
  bordered?: boolean;
  isPrimary: boolean;
}

// @ts-ignore
export default function TableComponent({
  dataSource = null,
  isPrimary = true,
}: TableComponentProps) {
  const [data, setData] = useState(dataSource ? [dataSource] : []);

  const columnsExample = [
    {
      title: "Length",
      dataIndex: "length",
      key: "length",
      render: (value: any) => (
        <Form.Control
          style={{ fontSize: 14, textAlign: "center" }}
          name="length"
          value={value}
          onChange={({ target }) => {}}
          disabled={isPrimary}
        />
      ),
      className: "carrier-table-column",
      // align: 'center'
    },
    {
      title: (
        <span>
          Volume m<sup>3</sup>
        </span>
      ),
      dataIndex: "volume_m3",
      key: "volume_m3",
      render: (value: any) => (
        <Form.Control
          style={{ fontSize: 14, textAlign: "center" }}
          name="length"
          value={value}
          onChange={({ target }) => {}}
          disabled={isPrimary}
        />
      ),
      className: "carrier-table-column-string",
      // align: 'center'
    },
    {
      title: "Parcels",
      dataIndex: "parcel",
      key: "parcel",
      render: (value: any) => (
        <Form.Control
          style={{ fontSize: 14, textAlign: "center" }}
          name="length"
          value={value}
          onChange={({ target }) => {}}
          disabled={isPrimary}
        />
      ),
      className: "carrier-table-column-string",
      // align: 'center'
    },
    {
      title: "Parcel KG",
      dataIndex: "parcel_kg",
      key: "parcel_kg",
      render: (value: any) => (
        <Form.Control
          style={{ fontSize: 14, textAlign: "center" }}
          name="length"
          value={value}
          onChange={({ target }) => {}}
          disabled={isPrimary}
        />
      ),
      className: "carrier-table-column-string",
      // align: 'center'
    },
    {
      title: "Consignment KG",
      dataIndex: "consignment_kg",
      key: "consignment_kg",
      render: (value: any) => (
        <Form.Control
          // style={{fontSize: 14, textAlign: 'center'}}
          name="length"
          value={value}
          onChange={({ target }) => {}}
          disabled={isPrimary}
        />
      ),
      className: "carrier-table-column-string",
      // align: 'center'
    },
  ];

  return (
    <>
      <Table
        dataSource={data}
        rowKey={"key"}
        size={"small"}
        // bordered={bordered}
        pagination={false}
        columns={columnsExample}
      />
    </>
  );
}
