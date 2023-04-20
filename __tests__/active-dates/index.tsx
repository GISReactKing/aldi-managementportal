// __tests__/index.test.jsx
import React from "react";
import "../../__mocks__/router.mock";
import "../../__mocks__/matchMedia.mock";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Providers from "../../providers";
import ServicesActiveDates from "../../pages/carrier-routing-control/carrier-active-dates";

// const { getByText } = render(Click);

describe("services active dates", () => {
  it("Page titles renders correctly", async () => {
    render(
      <Providers>
        <ServicesActiveDates />
      </Providers>
    );

    const ServicesActiveDatesTab = await screen.findByTestId("page-title");

    expect(ServicesActiveDatesTab).toBeInTheDocument();
    expect(ServicesActiveDatesTab.textContent).toEqual("Carrier: Active Dates");
  });

  it("Edit page titles renders correctly", async () => {
    render(
      <Providers>
        <ServicesActiveDates />
      </Providers>
    );

    const ServicesActiveDatesEdit = await screen.findByTestId(
      "edit-page-title"
    );

    expect(ServicesActiveDatesEdit).toBeInTheDocument();
    expect(ServicesActiveDatesEdit.textContent).toEqual(
      "Carrier: Active Dates"
    );
  });

  it("Secondary titles renders correctly", async () => {
    render(
      <Providers>
        <ServicesActiveDates />
      </Providers>
    );

    const SecondaryParametersTitle = await screen.findByTestId("sec-per-id");

    expect(SecondaryParametersTitle).toBeInTheDocument();
    expect(SecondaryParametersTitle.textContent).toEqual(
      "Secondary Parameters"
    );
  });

  it("Deselect edit button renders correctly", () => {
    render(
      <Providers>
        <ServicesActiveDates />
      </Providers>
    );
    expect(screen.getByText(/Deselect Edit/i).closest("button")).toBeDisabled();
  });

  it("Edit button renders correctly", () => {
    render(
      <Providers>
        <ServicesActiveDates />
      </Providers>
    );
    expect(screen.getByText("Edit").closest("button")).toBeDisabled();
  });

  it("Print button renders correctly", () => {
    render(
      <Providers>
        <ServicesActiveDates />
      </Providers>
    );
    expect(screen.getByText("Print").closest("button")).not.toBeDisabled();
  });
});
