/** @format */

import React, { ReactElement, useEffect } from "react";
import { Avatar } from "antd";
import { RootStateOrAny, useSelector } from "react-redux";
import { fetchRoles } from "../../redux/slices/usersSlice";
import isUndefined from "lodash/isUndefined";
import useTheme from "../../hooks/useTheme";

interface Props {
  onlyIcon: boolean;
}

const SuperAdmin = ({ onlyIcon }: Props): JSX.Element => {
  const theme = useTheme();
  const currentUser: any = useSelector(
    ({ users }: RootStateOrAny) => users.currentUser
  );

  if (!currentUser) {
    return <></>;
  }

  // useEffect(() => {
  //     console.log("currentUser", currentUser);
  // }, [currentUser]);

  const canLogin =
    currentUser?.isTemporaryPasswordReset ||
    isUndefined(currentUser?.isTemporaryPasswordReset);

  return (
    <div
      // style={{ backgroundColor: theme?. }}
      className={`h-auto rounded-md xl flex justify-between items-center cursor-pointer ml-5 mt-0.5 pl-3 pb-1 pr-3 ${
        onlyIcon ? "mr-6" : " mr-2"
      }`}
    >
      <div className="flex items-center">
        <div>
          {/*<img alt={'user image'} src='/assets/img/profile.png' width={42} height={42} />*/}
          <Avatar
            size={30}
            style={{
              color: "#fff",
              backgroundImage: theme?.primaryNight,
              borderColor: theme?.white,
              borderWidth: "1px",
              paddingTop: "-5px",
            }}
          >
            {currentUser && canLogin ? currentUser.username.charAt(0) : ""}
          </Avatar>
        </div>
        {!onlyIcon && (
          <>
            <div className="ml-2 pt-1">
              <span
                style={{ color: theme?.monoBorder, fontSize: 12 }}
                className="text-white font-bold text-xsm"
              >
                {currentUser && canLogin ? currentUser.username : ""}
              </span>
              {/*<h2*/}
              {/*    style={{ color: theme?.peach }}*/}
              {/*    className='font-bold text-xs opacity-70 mt-1'*/}
              {/*>*/}
              {/*    {(currentUser && currentUser.role_name && currentUser.role_name[0])? currentUser.role_name[0].role_type: "Test Role"}*/}
              {/*</h2>*/}
            </div>
          </>
        )}
      </div>
      {/*<div className='items-end'>*/}
      {/*  <img alt='arrow' src='/assets/img/Outline.png' />*/}
      {/*</div>*/}
    </div>
  );
};

export default SuperAdmin;
