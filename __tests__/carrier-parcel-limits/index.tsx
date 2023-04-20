// __tests__/index.test.jsx
import React from "react";
import "../../__mocks__/router.mock";
import "../../__mocks__/matchMedia.mock";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Providers from "../../providers";
import CarrierParcelLimits from "../../pages/carrier-routing-control/carrier-parcel-limits";

const func = (buttonName: string, checkEnable?: boolean) => {
  const btn = screen.getByRole("button", { name: buttonName });
  expect(btn).toBeInTheDocument();
  if (!checkEnable) {
    expect(btn).toBeDisabled();
  } else {
    expect(btn).not.toBeDisabled();
  }
};
const testButtonDisabled = async (
  buttonName: string,
  checkEnable?: boolean
) => {
  render(
    <Providers>
      <CarrierParcelLimits />
    </Providers>
  );

  func(buttonName, checkEnable);
};

describe("Carrier Parcel Limits", () => {
  //   it("Tab renders correctly", () => {
  //     render(
  //       <Providers>
  //         <CarrierParcelLimits />
  //       </Providers>
  //     );

  //     const carrierParcelTab = screen.getByText("Carrier: Parcel Limits");

  //     expect(carrierParcelTab).toBeInTheDocument();
  //   });

  it("Heading renders correctly", async () => {
    render(
      <Providers>
        <CarrierParcelLimits />
      </Providers>
    );
    const heading = screen.getByText("Carrier Parcel Limits");
    expect(heading).toBeInTheDocument();
    expect(heading.textContent).toEqual("Carrier Parcel Limits");
  });

  it("Carrier Label renders correctly", async () => {
    render(
      <Providers>
        <CarrierParcelLimits />
      </Providers>
    );
    const carrierLabel = await screen.findByTestId("cpl_carrier_label");
    expect(carrierLabel).toBeInTheDocument();
    expect(carrierLabel.textContent).toEqual("Carrier:");
  });

  it("Dispatch Method Label renders correctly", async () => {
    render(
      <Providers>
        <CarrierParcelLimits />
      </Providers>
    );
    const dMethodLabel = await screen.findByTestId("cpl_d_method_label");
    expect(dMethodLabel).toBeInTheDocument();
    expect(dMethodLabel.textContent).toEqual("Despatch Method:");
  });

  it("Checkbox label is correct", () => {
    render(
      <Providers>
        <CarrierParcelLimits />
      </Providers>
    );

    const label = screen.getByText("Display All Carrier Records");
    expect(label).toBeInTheDocument();
    expect(label.tagName).toBe("SPAN");
  });

  it("Checkbox is not checked", async () => {
    render(
      <Providers>
        <CarrierParcelLimits />
      </Providers>
    );
    const checkbox: HTMLInputElement = await screen.findByTestId(
      "cpl_checkBox_label"
    );
    expect(checkbox).toBeInTheDocument();
    expect(checkbox.checked).toBe(false);
  });

  it("Display button is disabled", async () => {
    testButtonDisabled("Display");
  });

  it("Clear button is disabledddddd dd", async () => {
    testButtonDisabled("Clear");
  });

  it("Carrier select is not diabled", async () => {
    render(
      <Providers>
        <CarrierParcelLimits />
      </Providers>
    );
    const select = await screen.getByTestId("cpl_carrier_select");
    expect(select).toBeInTheDocument();
    expect(select.className).not.toContain("ant-select-disabled");
  });

  it("Carrier select value 'None'", async () => {
    render(
      <Providers>
        <CarrierParcelLimits />
      </Providers>
    );
    const select = (await screen.findByTestId(
      "cpl_carrier_select"
    )) as HTMLSelectElement;
    expect(select).toBeInTheDocument();
    expect(select.textContent).toBe("None");
  });

  it("Dispatch select value 'None'", async () => {
    render(
      <Providers>
        <CarrierParcelLimits />
      </Providers>
    );
    const select = (await screen.findByTestId(
      "cpl_d_method_select"
    )) as HTMLSelectElement;
    expect(select).toBeInTheDocument();
    expect(select.textContent).toBe("None");
  });

  it("Checkbox select then disbables both select inputs and enables button", async () => {
    render(
      <Providers>
        <CarrierParcelLimits />
      </Providers>
    );
    const checkbox: HTMLInputElement = await screen.findByTestId(
      "cpl_checkBox_label"
    );
    expect(checkbox).toBeInTheDocument();
    expect(checkbox.checked).toBe(false);
    fireEvent.click(checkbox);
    await waitFor(() => expect(checkbox.checked).toBe(true));

    const select = await screen.getByTestId("cpl_d_method_select");
    expect(select).toBeInTheDocument();
    expect(select.className).toContain("ant-select-disabled");

    const carrierSelect = await screen.getByTestId("cpl_carrier_select");
    expect(carrierSelect).toBeInTheDocument();
    expect(carrierSelect.className).toContain("ant-select-disabled");

    // await func("Display", true);
    await func("Clear", true);
  });

  it("Dispatch Select component should be disabled", async () => {
    render(
      <Providers>
        <CarrierParcelLimits />
      </Providers>
    );

    const select = await screen.getByTestId("cpl_d_method_select");
    expect(select).toBeInTheDocument();
    expect(select.className).toContain("ant-select-disabled");
  });
});
