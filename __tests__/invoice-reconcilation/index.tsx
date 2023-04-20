// __tests__/index.test.jsx
import React from "react";
import "../../__mocks__/router.mock";
import "../../__mocks__/matchMedia.mock";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Providers from "../../providers";
import Home from "../../pages/landing-page/index";
import InvoiceReconciliation from "../../pages/carriage-claims-and-Invoicing/invoice-reconciliation";
import userEvent from "@testing-library/user-event";

describe("Invoice Reconciliation Renders Correctly", () => {
  it("Tab renders correctly", () => {
    render(
      <Providers>
        <InvoiceReconciliation />
      </Providers>
    );

    const invoiceReconcilationTab = screen.getByText("Invoice Reconciliation");

    expect(invoiceReconcilationTab).toBeInTheDocument();
  });

  it("Search Label renders correctly", async () => {
    render(
      <Providers>
        <InvoiceReconciliation />
      </Providers>
    );
    const searchLabel = await screen.findByTestId("ir_search_label");
    expect(searchLabel).toBeInTheDocument();
    expect(searchLabel.textContent).toEqual("Search:");
  });

  it("Search Input renders correctly", async () => {
    render(
      <Providers>
        <InvoiceReconciliation />
      </Providers>
    );

    const searchInput = await screen.findByTestId("ir_search_input");
    expect(searchInput).toBeInTheDocument();
    const dummyText = "Hello, World!";
    await userEvent.type(searchInput, dummyText);
    expect(searchInput).toHaveValue(dummyText);
  });

  it("Filter Label renders correctly", async () => {
    render(
      <Providers>
        <InvoiceReconciliation />
      </Providers>
    );
    const filterLabel = await screen.findByTestId("ir_filter_label");
    expect(filterLabel).toBeInTheDocument();
    expect(filterLabel.textContent).toEqual("Date Filter:");
  });

  it("Filter renders correctly", async () => {
    render(
      <Providers>
        <InvoiceReconciliation />
      </Providers>
    );
    const filterLabel = await screen.findByTestId("ir_filter");
    expect(filterLabel).toBeInTheDocument();
  });
});
