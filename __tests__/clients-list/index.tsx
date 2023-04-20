import React from "react";
import "../../__mocks__/router.mock";
import "../../__mocks__/matchMedia.mock";
import { render, screen } from "@testing-library/react";
import Providers from "../../providers";
import Users from "../../pages/user-administration/client-list/";
import "@testing-library/jest-dom";

const textInDocument = (text: string) => {
  expect(screen.getByText(text)).toBeInTheDocument();
};

describe("Client List", () => {
  it("Renders table with correct columns renders correctly", async () => {
    render(
      <Providers>
        <Users />
      </Providers>
    );
    textInDocument("Client Code");
    textInDocument("Client Name");
    textInDocument("Active");
  });
});
