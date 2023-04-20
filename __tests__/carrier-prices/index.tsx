// __tests__/index.test.jsx
import React from "react";
import "../../__mocks__/router.mock";
import "../../__mocks__/matchMedia.mock";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Providers from "../../providers";
import CarrierPrices from "../../pages/carrier-routing-control/carrier-prices";
import "@testing-library/jest-dom";

const func = (buttonName: string, checkEnable?: boolean) => {
  const btn = screen.getByRole("button", { name: buttonName });
  expect(btn).toBeInTheDocument();
  if (!checkEnable) {
    expect(btn).toBeDisabled();
  } else {
    expect(btn).not.toBeDisabled();
  }
};

const textInDocument = (text: string) => {
  expect(screen.getByText(text)).toBeInTheDocument();
};

// const multipleTextInDocument = async (text: string) => {
//   const allTexts = await screen.getAllByAltText(text);
//   console.log("allTexts=====>>>>", allTexts);
//   allTexts.forEach((val) => {
//     expect(val).toHaveTextContent(text);
//   });
// };

describe("Carrier Prices", () => {
  it("Heading renders correctly", async () => {
    render(
      <Providers>
        <CarrierPrices />
      </Providers>
    );
    const heading = screen.getByText("Carrier Prices");
    expect(heading).toBeInTheDocument();
    expect(heading.textContent).toEqual("Carrier Prices");
  });

  it("Renders table with correct columns renders correctly", async () => {
    render(
      <Providers>
        <CarrierPrices />
      </Providers>
    );
    textInDocument("Carriers");
    textInDocument("Active");
    textInDocument("Pricing Method");
    textInDocument("Contract");
    textInDocument("Service");
    textInDocument("Despatch Method");
    textInDocument("Primary Cost Values");
    textInDocument("Effective From Date");
    textInDocument("Date From");
    textInDocument("Date To");
    textInDocument("Select");

    // multipleTextInDocument("Base Cost");
  });

  it("Disabled Buttons", async () => {
    render(
      <Providers>
        <CarrierPrices />
      </Providers>
    );
    func("Deselect Edit");
    func("Edit");
  });

  it("Enabled Buttons", async () => {
    render(
      <Providers>
        <CarrierPrices />
      </Providers>
    );
    func("Print", true);
    func("Export", true);
  });
});
