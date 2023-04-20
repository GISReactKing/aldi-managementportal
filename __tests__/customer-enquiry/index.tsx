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
import CarrierRoutingExceptionsHistory from "../../pages/dashboards-reporting-&-enquiries/order-&-returns-enquiry/index";
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

  test(`Title "Customer Enquiry Selection" renders correctly`, async () => {
    const elem = component.getByTestId("CustomerEnquiry");

    expect(elem).toHaveTextContent("Customer Enquiry Selection");
  });

  test(`Label "Order No:" renders correctly`, async () => {
    const element = component.getByText("Order No:");
    expect(element).toBeInTheDocument();
  });
  test(`Label "Delivery Post Code:" renders correctly`, async () => {
    const element = component.getByText("Delivery Post Code:");
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
});
