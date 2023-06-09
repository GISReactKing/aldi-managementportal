import React, { ProviderProps, ReactNode } from "react";
import { Provider } from "react-redux";
import store from "./redux/store";

type ProvidersProps = {
  children: ReactNode;
};
const Providers = ({ children }: ProvidersProps) => {
  return <Provider store={store}>{children}</Provider>;
};

export default Providers;
