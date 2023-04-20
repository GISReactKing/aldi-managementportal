/** @format */
import React, { useState } from "react";
import { Layout, Menu, Button } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import LogoutButton from "../LogoutButton";
import Link from "next/link";
import { DRAWERDATA } from "./drawer";
import { RootStateOrAny, useSelector } from "react-redux";
import { useRouter } from "next/router";
import useTheme from "../../hooks/useTheme";
import useAppDispatch from "../../hooks/useAppDispatch";

const { Sider } = Layout;
const { SubMenu } = Menu;

interface Props {
  className?: string;
  setVisible?: (e: boolean) => void;
  drawer: any;
  setSidebarCollapsed?: (e: boolean) => void;
}

const Navigation = ({
  className,
  setVisible,
  drawer,
  setSidebarCollapsed,
}: Props): JSX.Element => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [collapsed, setCollapsed] = useState<boolean>(true);
  const [openKeys, setOpenKeys] = React.useState([""]);
  const theme = useTheme();

  const currentUser: any = useSelector(
    ({ users }: RootStateOrAny) => users.currentUser
  );

  const rootSubmenuKeys = DRAWERDATA.map((item: any, index: number) => {
    return `sub${index + 1}`;
  });

  const onOpenChange = (keys: any) => {
    const latestOpenKey = keys.find((key: any) => openKeys.indexOf(key) === -1);
    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };

  const handleHover = (e: any) => {
    setOpenKeys([e.key]);
    setCollapsed(false);
    // @ts-ignore
    setSidebarCollapsed(false);
  };

  const handleLeave = (e: any) => {
    setCollapsed(true);
    // @ts-ignore
    setSidebarCollapsed(true);
  };

  const menuClickFunc = (clearRedux: any) => {
    if (typeof clearRedux === "function") {
      dispatch(clearRedux());
    }
  };

  return (
    <>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        collapsedWidth={60}
        // onCollapse={() => {setCollapsed(!collapsed)}}
        style={
          !collapsed
            ? {
                backgroundColor: theme?.black,
                overflow: "auto",
                position: "fixed",
                height: "100vh",
              }
            : {
                backgroundColor: theme?.black,
                position: "fixed",
                height: "100vh",
              }
        }
        width={255}
        className={`flex ${className} w-full left-0 z-50`}
      >
        <Menu
          mode="inline"
          className={`text-white relative text-xsm w-60 mt-1 pt-5 user-dashboard-menu ${
            collapsed ? "collapsed" : "not-collapsed"
          }`}
          openKeys={openKeys}
          onOpenChange={onOpenChange}
          style={{
            minHeight: "calc(100vh - 130px)",
            backgroundColor: theme?.black,
            // color: theme?.white,
          }}
          onMouseLeave={handleLeave}
        >
          {drawer.map((item: any, index: number) => {
            if (item.subTitles) {
              return (
                <SubMenu
                  // @ts-ignore
                  onMouseEnter={collapsed ? handleHover : () => false}
                  className="menu-1 text-white"
                  key={`sub${index + 1}`}
                  title={!collapsed ? item.title : ""}
                  icon={item.icon}
                >
                  {!collapsed &&
                    item?.subTitles &&
                    item.subTitles.map((subItem: any, subIndex: number) => {
                      if (
                        subItem.title === "Client Administration" &&
                        !currentUser?.role?.iforce_user
                      ) {
                        return false;
                      }
                      if (subItem.subTitles) {
                        return (
                          <SubMenu
                            className="menu-2 text-white"
                            key={`sub${index + 1}-${subIndex + 1}`}
                            title={!collapsed ? subItem.title : ""}
                            icon={subItem.icon}
                          >
                            {subItem.subTitles.map(
                              (sub2Item: any, sub2Index: number) => {
                                return (
                                  <Menu.Item
                                    style={
                                      typeof sub2Item.title === "string"
                                        ? { height: "30px" }
                                        : {}
                                    }
                                    key={`${sub2Index + 1}`}
                                    onClick={() => {
                                      menuClickFunc(sub2Item?.clearRedux);
                                    }}
                                  >
                                    <Link
                                      href={sub2Item.link ? sub2Item.link : ""}
                                      passHref
                                    >
                                      {sub2Item.title === "Power BI" ? (
                                        <a
                                          style={{ color: theme?.white }}
                                          target="_blank"
                                        >
                                          {sub2Item.title}
                                        </a>
                                      ) : (
                                        <a style={{ color: theme?.white }}>
                                          {sub2Item.title}
                                        </a>
                                      )}
                                    </Link>
                                  </Menu.Item>
                                );
                              }
                            )}
                          </SubMenu>
                        );
                      } else {
                        return (
                          <Menu.Item
                            style={
                              typeof subItem.title === "string"
                                ? { height: "30px" }
                                : {}
                            }
                            key={`${subIndex + 1}`}
                            onClick={() => menuClickFunc(subItem?.clearRedux)}
                            onMouseEnter={collapsed ? handleHover : () => false}
                          >
                            <Link
                              href={subItem.link ? subItem.link : ""}
                              passHref
                            >
                              {subItem.title === "Power BI" ? (
                                <a
                                  style={{ color: theme?.white }}
                                  target="_blank"
                                >
                                  {subItem.title}
                                </a>
                              ) : (
                                <a style={{ color: theme?.white }}>
                                  {subItem.title}
                                </a>
                              )}
                            </Link>
                          </Menu.Item>
                        );
                      }
                    })}
                </SubMenu>
              );
            } else {
              return (
                <Menu.Item
                  style={
                    typeof item.title === "string" ? { height: "30px" } : {}
                  }
                  icon={item.icon}
                  key={`${index + 1}`}
                  onClick={() => {
                    menuClickFunc(item?.clearRedux);
                  }}
                  onMouseOver={collapsed ? handleHover : () => false}
                  className="menu-1 text-white"
                >
                  {!collapsed ? (
                    <Link href={item.link ? item.link : ""} passHref>
                      {item.title === "Power BI" ? (
                        <a className="text-white" target="_blank">
                          {item.title}
                        </a>
                      ) : (
                        <a className="text-white">{item.title}</a>
                      )}
                    </Link>
                  ) : null}
                </Menu.Item>
              );
            }
          })}
        </Menu>
        <div>
          {currentUser && (
            <div
              className="bottom-3 w-full px-3"
              // @ts-ignore
              onMouseEnter={handleHover}
              onMouseLeave={handleLeave}
            >
              <LogoutButton onlyIcon={collapsed} />
            </div>
          )}
        </div>
      </Sider>
    </>
  );
};

export default Navigation;
