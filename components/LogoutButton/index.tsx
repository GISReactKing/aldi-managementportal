/** @format */

import React, { useState } from "react";
import useTheme from "../../hooks/useTheme";
import LogoutModal from "../Modals/LogoutModal";
interface Props {
  onlyIcon: boolean;
}

const Logout = ({ onlyIcon }: Props): JSX.Element => {
  const [modalShow, setModalShow] = useState<boolean>(false);
  const theme = useTheme();

  return (
    <div className={`flex items-center cursor-pointer logout`}>
      <span onClick={() => setModalShow(true)}>
        <svg
          className={`${onlyIcon ? "my-3" : ""}`}
          width="22"
          height="20"
          viewBox="0 0 22 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5 9H13V11H5V14L0 10L5 6V9ZM4 16H6.708C7.86269 17.0183 9.28669 17.6819 10.8091 17.9109C12.3316 18.14 13.8878 17.9249 15.291 17.2915C16.6942 16.6581 17.8849 15.6332 18.7201 14.3398C19.5553 13.0465 19.9995 11.5396 19.9995 10C19.9995 8.46042 19.5553 6.95354 18.7201 5.66019C17.8849 4.36683 16.6942 3.34194 15.291 2.7085C13.8878 2.07506 12.3316 1.85998 10.8091 2.08906C9.28669 2.31815 7.86269 2.98167 6.708 4H4C4.93066 2.75718 6.13833 1.74851 7.52707 1.05414C8.91581 0.359775 10.4473 -0.00116364 12 2.81829e-06C17.523 2.81829e-06 22 4.477 22 10C22 15.523 17.523 20 12 20C10.4473 20.0012 8.91581 19.6402 7.52707 18.9459C6.13833 18.2515 4.93066 17.2428 4 16Z"
            fill="white"
          />
        </svg>
      </span>
      {!onlyIcon && (
        <span
          style={{ color: theme?.white }}
          className="ml-4 font-extralight my-3"
          onClick={() => setModalShow(true)}
        >
          Log Out
        </span>
      )}
      <LogoutModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        text={"Are you sure you want to log out?"}
      />
    </div>
  );
};

export default Logout;
