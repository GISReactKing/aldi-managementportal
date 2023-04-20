/** @format */

import type { NextPage } from "next";
import UserDashboard from "../../../components/UserDashboard";

const Exceptions: NextPage = () => {
  return (
    <UserDashboard>
      <iframe
        width="1140"
        height="541.25"
        src="https://www.powerbi.com/reportEmbed?reportId=cadce294-3ce3-4e00-a449-4f6edd4d60a0&appId=25494c09-c432-4b69-a039-f4af19987cae&autoAuth=true&ctid=9eba58df-75b9-4f56-9005-daead762307d&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly93YWJpLWV1cm9wZS1ub3J0aC1iLXJlZGlyZWN0LmFuYWx5c2lzLndpbmRvd3MubmV0LyJ9"
        allowFullScreen={true}
      ></iframe>
    </UserDashboard>
  );
};

export default Exceptions;
