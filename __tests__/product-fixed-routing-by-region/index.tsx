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
import ProductFixedRoutingByRegion from "../../pages/carrier-routing-control/product-fixed-routing-by-region";
import Providers from "../../providers";

describe("ProductFixedRoutingByRegion", () => {
  let component: RenderResult;

  beforeEach(() => {
    component = render(
      <Providers>
        <ProductFixedRoutingByRegion />
      </Providers>
    );
  });

  test(`title "Product Fixed Routing: ByRegion" renders correctly`, async () => {
    const title = component.getByText("Product Fixed Routing: By Region");

    expect(title).toBeInTheDocument();
  });
  test("save button renders correctly", async () => {
    const saveButton = await component.findByTestId("PFRBR_savebtn");
    expect(saveButton).toBeInTheDocument();
  });
  test("save button is disabled by default", async () => {
    const saveButton = await component.findByTestId("PFRBR_savebtn");
    expect(saveButton).toBeDisabled();
  });

  test("Search input renders correctly", async () => {
    const input = component.getByTestId("PFRBR_searchInput");
    expect(input).toBeInTheDocument();
  });

  test("sku filter list is displayed correctly", async () => {
    const skuFilterList = await component.findByTestId("sku-filter-list");
    expect(skuFilterList).toBeInTheDocument();
  });

  test(`Label "Post Code Region" renders correctly`, () => {
    const element = component.getByTestId("PFRBR_POSTCODEREGION");

    expect(element).toBeInTheDocument();
  });
  test(`Label "Carrier" renders correctly`, async () => {
    const element = await component.findByTestId("PFRBR_carrier");
    expect(element).toBeInTheDocument();
  });
  test(`Label "Carrier" renders correctly`, async () => {
    const element = await component.findByTestId("PFRBR_SELECT_CARRIER");
    expect(element).toBeInTheDocument();
  });
  test(`Label "Despatch" renders correctly`, async () => {
    const element = await component.findByTestId("PFRBR_Despatch");
    expect(element).toBeInTheDocument();
  });
  test(`Selector "Despatch" renders correctly`, async () => {
    const element = await component.findByTestId("PFRBR_SelectDespatch");
    expect(element).toBeInTheDocument();
  });
  test(`Label "Effective Date From / To" renders correctly`, async () => {
    const element = await component.findByText("Effective Date From / To");
    expect(element).toBeInTheDocument();
  });
});
