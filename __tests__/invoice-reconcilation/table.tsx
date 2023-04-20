// __tests__/index.test.jsx
import React from "react";
import "../../__mocks__/router.mock";
import "../../__mocks__/matchMedia.mock";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import Providers from "../../providers";
import UserTable from "../../components/Tables/UserTable";
import "@testing-library/jest-dom";

const columnsData = [
  {
    title: "Import Date",
    dataIndex: "created",
    key: "created",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
  },
  {
    title: "Filename",
    dataIndex: "filename",
    key: "filename",
  },
  {
    title: "Invoice",
    dataIndex: "invoiceNumber",
    key: "invoiceNumber",
  },
  {
    title: "Carrier",
    dataIndex: "carrier",
    key: "carrier",
  },
  {
    title: "Contract",
    dataIndex: "contract",
    key: "contract",
  },
];
const data = [
  {
    key: "1",
    created: "09/01/2023",
    status: "Accepted",
    filename: "G_HERMES_200K_INVOICE.xlsb",
    invoiceNumber: "210,000",
    carrier: "HERMES",
    contract: "",
  },
  {
    key: "2",
    created: "09/01/2024",
    status: "Rejected",
    filename: ".RGDEV_HERMES_100K_INVOICE.xlsb",
    invoiceNumber: "100,000",
    carrier: "HERMES",
    contract: "",
  },
  {
    key: "3",
    created: "21/12/2022",
    status: "Accepted",
    filename: "C 21.12.22 (1 UPI).csv",
    invoiceNumber: "9629564",
    carrier: "YODEL",
    contract: "",
  },
];

describe("Invoice Reconciliation TABLE Renders Correctly", () => {
  test("In UserTable, the expected columns are present", async () => {
    const { getByText } = render(
      <Providers>
        <UserTable
          dataSource={data}
          columns={columnsData}
          loading={false}
          bordered={true}
          pagination={false}
        />
      </Providers>
    );
    columnsData.forEach((column) => {
      expect(getByText(column.title)).toBeInTheDocument();
    });
  });

  test("In UserTable, the table correctly renders data", async () => {
    const { getByText } = render(
      <Providers>
        <UserTable
          dataSource={data}
          columns={columnsData}
          loading={false}
          bordered={true}
          pagination={false}
        />
      </Providers>
    );
    expect(getByText(data[0].created)).toBeInTheDocument();
  });

  test("UserTable should display the correct number of rows", async () => {
    const { getAllByRole } = render(
      <Providers>
        <UserTable
          dataSource={data}
          columns={columnsData}
          loading={false}
          bordered={true}
          pagination={false}
        />
      </Providers>
    );
    const rows = getAllByRole("row");
    expect(rows.length - 1).toBe(data.length);
  });
});
