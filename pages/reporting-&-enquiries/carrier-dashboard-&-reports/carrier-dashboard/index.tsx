/** @format */

import type { NextPage } from "next";
import UserDashboard from "../../../../components/UserDashboard";
import { Typography } from "antd";
const { Link } = Typography;

const Performance: NextPage = () => {
  return (
    <UserDashboard>
      <div
        style={{
          alignItems: "center",
          justifyContent: "center",
          display: "flex",
          width: "100%",
          height: "70vh",
        }}
      >
        {/* <a
          className='capitalize text-sm'
          target={'_blank'}
          href='https://www.powerbi.com/Redirect?action=OpenApp&appId=25494c09-c432-4b69-a039-f4af19987cae&ctid=9eba58df-75b9-4f56-9005-daead762307d' >
          {'Aldi PowerBi Guest Account'}
        </a> */}
        <Link
          href="https://www.powerbi.com/Redirect?action=OpenApp&appId=25494c09-c432-4b69-a039-f4af19987cae&ctid=9eba58df-75b9-4f56-9005-daead762307d"
          target="_blank"
        >
          Aldi PowerBi Guest Account
        </Link>
      </div>
    </UserDashboard>
  );
};

export default Performance;
