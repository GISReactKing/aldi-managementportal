/** @format */

export const StockIcon = ({
  color = "#FCFCFC",
  size = 32,
}: {
  color?: string;
  size?: string | number;
}): JSX.Element => {
  return (
    <svg
      width="18"
      height="20"
      viewBox="0 0 18 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5 3H8V12H5V15H3V12H0V3H3V0H5V3ZM15 8H18V17H15V20H13V17H10V8H13V5H15V8Z"
        fill="white"
      />
    </svg>
  );
};
