/** @format */

import type { NextPage } from "next";
import LeadingPage from "../../components/LeadingPageLayout/LeadingPage";
import Step from "../../components/Stepper";
import { Button } from "antd";
import PolicyHrf from "../../components/PolicyHrf";
import useTheme from "../../hooks/useTheme";

const Home: NextPage = () => {
  const theme = useTheme();
  return (
    <LeadingPage>
      <div className="flex">
        <div className="w-full xsm:p-4 lg:pt-14 lg:pl-28">
          <h1 className="text-xlg font-bold tracking-tight w-full">Returns</h1>
          <p
            className="text-sm tracking-wide font-extralight mt-4"
            style={{ maxWidth: "491px" }}
          >
            The future is in our hands to shape.The future is in our hands to
            shapemmm The future is in our hands to shape.The future is in our
            hands to shapemmm The future is in our hands to shape.The future is
            in our hands to shapemmm The future is in our hands to shape.The
            future is in our hands to shapemmm
          </p>

          <div className="flex mt-10 xsm:mt-8">
            <img
              alt="clock icon"
              src="assets/img/steps.svg"
              width={20}
              height={20}
            />
            <p className="ml-5 text-sm">
              Return items in <span className="font-bold">4</span> simple steps.
            </p>
          </div>

          <div className="mt-3">
            <Step text="Enter your log in details" step={1} />
            <Step text="Start your returns process" step={2} />
            <Step text="Select items you would like to return" step={3} />
            <Step text="Complete the process" step={4} isNext={false} />
          </div>

          <Button
            style={{ backgroundColor: theme?.primaryNight }}
            className="md:w-48 xsm:w-full h-14 font-bold tracking-wide mt-10 border-0"
            type="primary"
          >
            Get Started
          </Button>
          <div className="mt-6">
            <PolicyHrf />
          </div>
        </div>

        <div className="w-full items-center text-center py-36 xsm:hidden lg:block">
          <img
            alt="Login Illustration image"
            src="assets/img/login-ai.svg"
            width={20}
            height={20}
          />
        </div>
      </div>
    </LeadingPage>
  );
};

export default Home;
