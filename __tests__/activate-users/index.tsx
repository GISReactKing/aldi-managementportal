import React from "react";
import "../../__mocks__/router.mock";
import "../../__mocks__/matchMedia.mock";
import { render, screen } from "@testing-library/react";
import Providers from "../../providers";
import ActivateUsers from "../../pages/user-administration/activate-user";
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

describe("Activate Users", () => {
  it("Renders table with correct columns renders correctly", async () => {
    render(
      <Providers>
        <ActivateUsers />
      </Providers>
    );

    textInDocument("First Name");
    textInDocument("Last Name");
    textInDocument("Username");
    textInDocument("User Role");
    textInDocument("Created Date");
  });

  it("Enabled Buttons", async () => {
    render(
      <Providers>
        <ActivateUsers />
      </Providers>
    );
    func("Activate Users");
    func("Print", true);
    func("Export", true);
  });
});
