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
import CarrierRoutingExceptionsHistory from "../../pages/dashboards-reporting-&-enquiries/carrier-dashboard-&-reports/carrier-history/index";
import Providers from "../../providers";

describe("CarrierRoutingExceptionsHistory", () => {
  let component: RenderResult;

  beforeEach(() => {
    component = render(
      <Providers>
        <CarrierRoutingExceptionsHistory />
      </Providers>
    );
  });

  test(`Title "Carrier Routing: Exceptions History" renders correctly`, async () => {
    const title = component.getByText("Carrier Routing: Exceptions History");
    expect(title).toBeInTheDocument();
  });

  test(`Label "Report Date Range" renders correctly`, async () => {
    const element = component.getByText("Report Date Range");
    expect(element).toBeInTheDocument();
  });
  test(`Label "Total Orders Received:" renders correctly`, async () => {
    const element = component.getByText("Total Orders Received:");
    expect(element).toBeInTheDocument();
  });
  test(`Label "Orders with No Matching Despatch Method" renders correctly`, async () => {
    const element = component.getByText(
      "Orders with No Matching Despatch Method"
    );
    expect(element).toBeInTheDocument();
  });
  test(`Label "Of which:" renders correctly`, async () => {
    const element = component.getByText("Of which:");
    expect(element).toBeInTheDocument();
  });
  test(`Label "Orders with Inactive SKU" renders correctly`, async () => {
    const element = component.getByText("Orders with Inactive SKU");
    expect(element).toBeInTheDocument();
  });
  test(`Label "Orders with Unknown SKU" renders correctly`, async () => {
    const element = component.getByText("Orders with Unknown SKU");
    expect(element).toBeInTheDocument();
  });

  test(`label "Total Order Exceptions"  renders correctly`, async () => {
    const element = component.getByText("Total Order Exceptions");
    expect(element).toBeInTheDocument();
  });
});
