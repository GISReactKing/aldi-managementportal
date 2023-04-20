import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import store from "../redux/store";
import Providers from "../providers";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Providers>
        <Component {...pageProps} />
      </Providers>
    </>
  );
}

export default MyApp;
