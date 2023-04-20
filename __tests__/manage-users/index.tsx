import React from "react";
import "../../__mocks__/router.mock";
import "../../__mocks__/matchMedia.mock";
import { render, screen } from "@testing-library/react";
import Providers from "../../providers";
import ManageUsers from "../../pages/user-administration/manage-users";
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

describe("Manage Users", () => {
  it("Renders table with correct columns renders correctly", async () => {
    render(
      <Providers>
        <ManageUsers />
      </Providers>
    );

    textInDocument("First Name");
    textInDocument("Last Name");
    textInDocument("Username");
    textInDocument("User Role");
    textInDocument("Client");
    textInDocument("Client User Administrator");
    textInDocument("Client User Role");
    textInDocument("iForce User Role");
    textInDocument("Active");
    textInDocument("Locked");
    textInDocument("Action");
  });

  it("Enabled Buttons", async () => {
    render(
      <Providers>
        <ManageUsers />
      </Providers>
    );
    func("Create User", true);
    func("Print", true);
    func("Export", true);
  });
});
