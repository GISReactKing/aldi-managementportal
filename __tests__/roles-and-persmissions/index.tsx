import React from "react";
import "../../__mocks__/router.mock";
import "../../__mocks__/matchMedia.mock";
import { render, screen } from "@testing-library/react";
import Providers from "../../providers";
import RolesAndPermissions from "../../pages/user-administration/roles-&-permissions";
import "@testing-library/jest-dom";

const textInDocument = (text: string) => {
  expect(screen.getByText(text)).toBeInTheDocument();
};

describe("Roles And Permissions", () => {
  it("Renders table with correct columns renders correctly", async () => {
    render(
      <Providers>
        <RolesAndPermissions />
      </Providers>
    );
    textInDocument("Role Name");
    textInDocument("Client User Role");
    textInDocument("Client User Administration");
    textInDocument("Menu Options");
    textInDocument("Users");
    textInDocument("Date Created");
    textInDocument("Active");
    textInDocument("Action");
  });
});
