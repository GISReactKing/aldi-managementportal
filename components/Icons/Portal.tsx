/** @format */

export const PortalIcon = ({
  color = "#FCFCFC",
  size = 32,
}: {
  color?: string;
  size?: string | number;
}): JSX.Element => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.6573 23.0943L1.00965 17.6114V6.76797L6.17436 9.41152L11.6573 12.2264V23.0943Z"
        fill="white"
      />
      <path
        d="M12 11.6145L6.49256 8.77511L1.42576 6.18052L6.32122 3.65936L16.8954 9.09332L12 11.6145Z"
        fill="white"
      />
      <path
        d="M22.9903 17.6359L12.3426 23.0699V12.2264L17.8256 9.41152L22.9903 6.76797V17.6359Z"
        fill="white"
      />
      <path
        d="M12 0.746558L17.5074 3.58593L22.5742 6.18052L17.6787 8.70168L7.1045 3.26772L12 0.746558Z"
        fill="white"
      />
    </svg>
  );
};
