import "../../__mocks__/router.mock";
import "../../__mocks__/matchMedia.mock";
import {
  render,
  fireEvent,
  waitFor,
  getByText,
  RenderResult,
} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import ClaimsPrep from "../../pages/carriage-claims-and-Invoicing/claims-preparation";
import Providers from "../../providers";

describe("ClaimsPrep", () => {
  let component: RenderResult;

  beforeEach(() => {
    component = render(
      <Providers>
        <ClaimsPrep />
      </Providers>
    );
  });

  test(`Title "Customer Selection" renders correctly`, async () => {
    const clearFiltersButton = component.getByText("Customer Selection");
    expect(clearFiltersButton).toBeInTheDocument();
  });
  test(`Label "Clear Filters" renders correctly`, async () => {
    const clearFiltersButton = component.getByText("Clear Filters");
    expect(clearFiltersButton).toBeInTheDocument();
  });

  test(`Label "Order No.:" renders correctly`, async () => {
    const element = component.getByText("Order No.:");
    expect(element).toBeInTheDocument();
  });
  test(`Label "Customer Email:" renders correctly`, async () => {
    const element = component.getByText("Customer Email:");
    expect(element).toBeInTheDocument();
  });
  test(`Label "Order Date Range: From / To:" renders correctly`, async () => {
    const element = component.getByText("Order Date Range: From / To:");
    expect(element).toBeInTheDocument();
  });
  test(`Label "Delivery Post Code:" renders correctly`, async () => {
    const element = component.getByText("Delivery Post Code:");
    expect(element).toBeInTheDocument();
  });

  test(`Email Input renders correctly`, async () => {
    const element = component.getByTestId("claims_email");
    expect(element).toBeInTheDocument();
  });
  test(`PostalCode Input renders correctly`, async () => {
    const element = component.getByTestId("claims_postal");
    expect(element).toBeInTheDocument();
  });

  test(`DateRange  renders correctly`, async () => {
    const element = component.getByTestId("DateRange");
    expect(element).toBeInTheDocument();
  });

  test(`OrderNo  renders correctly`, async () => {
    const element = component.getByTestId("Claims_OrderNo");
    expect(element).toBeInTheDocument();
  });
});
