import "../../__mocks__/router.mock";
import "../../__mocks__/matchMedia.mock";
import {
  render,
  fireEvent,
  findByText,
  findByTestId,
} from "@testing-library/react";
import { AppButton } from "../../components/AppButton";
import ProductFixedRouting from "../../pages/carrier-routing-control/product-fixed-routing/index";
import "@testing-library/jest-dom";
import Providers from "../../providers";
import SelectCarrier from "../../components/Select";

describe("PRODUCT FIXED ROUTING DESPATCH RENDERS CORRECTLY", () => {
  it("Display button renders correctly", () => {
    const { getByText } = render(
      <Providers>
        <ProductFixedRouting />
      </Providers>
    );
    const button = getByText("Display");
    expect(button).toBeInTheDocument();
  });

  it("Display button renders correctly", () => {
    const handleDisplay = jest.fn();
    const { getByText } = render(
      <AppButton onClick={handleDisplay} title="Display" />
    );
    const button = getByText("Display");
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    expect(handleDisplay).toHaveBeenCalled();
  });

  it('title "Product Fixed Routing" renders correctly', async () => {
    const { findByText } = render(
      <Providers>
        <ProductFixedRouting />
      </Providers>
    );
    const title = await findByText("Product Fixed Routing");

    expect(title).toBeInTheDocument();
  });

  it("Select Category  LABEL renders correctly", async () => {
    const { findByText } = render(
      <Providers>
        <ProductFixedRouting />
      </Providers>
    );
    const label = await findByText("Select Category:");
    expect(label).toBeInTheDocument();
  });

  it("LABEL 'Existing Fixed Carrier Routing'  renders correctly", async () => {
    const { findByTestId } = render(
      <Providers>
        <ProductFixedRouting />
      </Providers>
    );
    const label = await findByTestId("PFRD_onlyshow_label");
    expect(label).toHaveTextContent(
      "Only show Products with Existing Fixed Carrier Routing:"
    );
  });

  it("LABEL 'Include SKU's with Fixed Routing by Region'  renders correctly", async () => {
    const { findByTestId } = render(
      <Providers>
        <ProductFixedRouting />
      </Providers>
    );
    const label = await findByTestId("PFRD_LABEL_INCLUDE_SKU");
    expect(label).toHaveTextContent(
      "Include SKU's with Fixed Routing by Region:"
    );
  });

  it("Select SKU's for Amendment LABEL renders correctly", async () => {
    const { findByTestId } = render(
      <Providers>
        <ProductFixedRouting />
      </Providers>
    );
    const label = await findByTestId("PFRD_Amendment");
    expect(label).toHaveTextContent("Select SKU's for Amendment");
  });
  it("Select element renders correctly", async () => {
    const { findByTestId } = render(
      <Providers>
        <ProductFixedRouting />
      </Providers>
    );
    const select = await findByTestId("PFRD_SelectCarrier");

    expect(select).toBeInTheDocument();
  });
});

describe("PRODUCT FIXED ROUTING FUNCTION TESTS", () => {
  it("Select element works correctly", async () => {
    const { findByTestId } = render(
      <Providers>
        <ProductFixedRouting />
      </Providers>
    );

    const showPFCheckbox = await findByTestId("PFRD_productfixedcheckbox");
    showPFCheckbox.click();

    expect(showPFCheckbox).not.toBeChecked();
    const select = await findByTestId("PFRD_SelectCarrier");
    select.click();
    expect(select).toBeInTheDocument();
  });
});
