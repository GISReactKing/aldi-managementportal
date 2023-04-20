/** @format */

import useTheme from "../../hooks/useTheme";

interface Props {
  step: number;
  text: string;
  isNext?: boolean;
}

const Stepper = ({ isNext = true, step, text }: Props): JSX.Element => {
  const theme = useTheme();
  return (
    <div>
      <div className="flex items-center">
        <div
          style={{ backgroundColor: theme?.primarySea, color: theme?.white }}
          className="w-7 h-7 rounded-full justify-center flex items-center md:text-sm xsm:text-xsm"
        >
          {step}
        </div>
        <p className="ml-5 font-normal md:text-md xsm:text-sm">{text}</p>
      </div>
      {isNext && (
        <div className="w-7 h-auto justify-center flex items-center m-px">
          <svg
            width="4"
            height="28"
            viewBox="0 0 4 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="2" cy="2" r="2" fill="#D8D8D8" />
            <circle cx="2" cy="10" r="2" fill="#D8D8D8" />
            <circle cx="2" cy="18" r="2" fill="#D8D8D8" />
            <circle cx="2" cy="26" r="2" fill="#D8D8D8" />
          </svg>
        </div>
      )}
    </div>
  );
};

export default Stepper;
