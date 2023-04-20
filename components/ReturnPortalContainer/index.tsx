/** @format */

import React, { Fragment } from "react";
import { Button, Layout, Typography } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { Squash } from "hamburger-react";
import ActiveRoute from "../ActiveRoute";
import useTheme from "../../hooks/useTheme";

interface Props {
  btnText1?: string;
  btnOnClick1?: () => void;
  btnText2?: string;
  btnOnClick2?: () => void;
  children: any;
}

const ReturnPortalContainer = ({
  children,
  btnText1,
  btnOnClick1,
  btnText2,
  btnOnClick2,
}: Props): JSX.Element => {
  const theme = useTheme();
  return (
    <>
      <Layout
        className="site-layout relative"
        style={{ backgroundColor: theme?.primaryNight }}
      >
        <Layout className="site-layout relative">
          <Fragment>
            <div className="header-top h-10" />
            <div className="h-19 w-full flex justify-content-start items-center xsm:px-2 md:px-10 py-2">
              <div className="header-logo">
                <img
                  alt="Logo image"
                  src="/logo.png"
                  width="56px"
                  height="64px"
                />
              </div>
            </div>
          </Fragment>
        </Layout>
        <Layout style={{ backgroundColor: "#fff" }}>{children}</Layout>
      </Layout>
    </>
  );
};

export default ReturnPortalContainer;
