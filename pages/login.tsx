/** @format */

import type { NextPage } from "next";
import LeadingPage from "../components/LeadingPageLayout/LeadingPage";

import LoginForm from "../components/LoginForm";
import useTheme from "../hooks/useTheme";

const Login: NextPage = () => {
  const theme = useTheme();
  return (
    <LeadingPage>
      <div className="flex xsm:p-4 md:p-0 justify-items-center">
        <div
          style={{ backgroundColor: theme?.lightBlue }}
          className="w-full items-center text-center py-36 xsm:hidden lg:block"
        >
          <img
            alt="Login Illustration image"
            src="/assets/img/login-ai.svg"
            width={510}
            height={400}
          />
        </div>
        <div className="w-full flex items-center justify-center xsm:mt-4 md:mt-0">
          <LoginForm />
        </div>
      </div>
    </LeadingPage>
  );
};

export default Login;
