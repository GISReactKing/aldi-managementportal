import React from "react";
import "../../__mocks__/router.mock";
import "../../__mocks__/matchMedia.mock";
import { render, screen } from "@testing-library/react";
import Providers from "../../providers";
import UserActivity from "../../pages/user-administration/user-activity-overview";
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

describe("User Activity", () => {
  it("Renders table with correct columns renders correctly", async () => {
    render(
      <Providers>
        <UserActivity />
      </Providers>
    );
    textInDocument("Menu Option");
    textInDocument("Action");
    textInDocument("Date");
    textInDocument("Time");
    textInDocument("Client");
    textInDocument("Name");
    textInDocument("Username");
    textInDocument("User Role");
  });

  it("Enabled Buttons", async () => {
    render(
      <Providers>
        <UserActivity />
      </Providers>
    );
    func("Print");
    func("Export");
    func("Display");
  });
});
