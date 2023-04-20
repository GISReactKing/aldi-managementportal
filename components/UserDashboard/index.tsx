import React, { Fragment, useEffect, useState } from "react";
import { Layout, Grid, Button, ConfigProvider } from "antd";
import Navigation from "./navigation";
import MobileNav from "./mobile-nav";
import ActiveRoute from "../ActiveRoute";
import { Squash } from "hamburger-react";
import { DashboardIcon } from "../Icons/DashboardIcon";
import { CarrierIcon } from "../Icons/CarrierIcon";
import { UsersIcon } from "../Icons/UsersIcon";
import { PortalIcon } from "../Icons/Portal";
import { InvoicingIcon } from "../Icons/Invoicing";
import { ReportingIcon } from "../Icons/Reporting";
import { StockIcon } from "../Icons/StockIcon";
import { PostIcon } from "../Icons/PostIcon";
// import { DrawerFunc } from '../../utils/DrawerFunc'
import { DrawerPermissionFunc } from "../../utils/DrawerPermissionFunc";
import { RootStateOrAny, useSelector, useDispatch } from "react-redux";
import { addNavTab, removeNavTab } from "../../redux/slices/navTabs";
import { useRouter } from "next/router";
import _ from "lodash";
import DargSystem from "../DragAndDrop";
import { fetchCurrentUsers } from "../../redux/slices/usersSlice";

import SuperAdmin from "../SuperAdmin";
const { Content } = Layout;
import { Beforeunload } from "react-beforeunload";
import {
  ClientListPath,
  RolesAndPermissionsPath,
  ManageUsersPath,
  ActivateUsersPath,
  UserActivityOverviewPath,
  CarrierPricesPath,
  CarrierServicesActiveDatesPath,
  CarrierParcelLimitsPath,
  CarrierCapacitySetUpPath,
  ProductFixedRoutingDespatchPath,
  ProductFixedRoutingByRegionPath,
  ReturnsCarrierRoutingOptions,
  ReturnsPortalRulesPath,
  ReturnReasonCodesPath,
  CustomerFacingCommunicationEventsPath,
  CustomerEmailSetUpTemplatesAndTriggersPath,
  ClaimsPreparationPath,
  InvoiceReconciliationPath,
  InvoiceDetailsPath,
  ItemFileStockReservationPath,
  OrderAndReturnsEnquiryPath,
  ReturnsPortalPath,
  CarrierDashboardPath,
  CarrierRoutingExceptionsHistoryPath,
  MultiBoxProductsRoutingPath,
} from "../../constants/path-name";
import useTheme from "../../hooks/useTheme";
import { initializeTheme } from "../../redux/slices/themeSlice";
import { clearCarrierParcelLimitsState } from "../../redux/slices/CarrierParcelLimitsSlice";
import { comparePaths } from "../../utils/helpers";

const { useBreakpoint } = Grid;

interface Props {
  children?: any;
  style?: any;
  contentParentStyle?: any;
  containerClassName?: string;
}

const MenuIcons = {
  ["Set Up & Control"]: <DashboardIcon />,
  ["Carrier Routing Control"]: <CarrierIcon />,
  ["Returns Portal Control"]: <InvoicingIcon />,
  ["Invoice Reconciliation"]: <StockIcon />,
  ["Reports & Enquiries"]: <ReportingIcon />,
} as any;

const SubMenuIcons = {
  // ["User Administration"]: <UsersIcon />,
  // ["Carrier Routing Control"]: <CarrierIcon />,
  // ["Returns Portal Control"]: <PortalIcon />,
  // ["Post Purchase Communication"]: <PostIcon />,
  // ["Returns: Dashboard & Reports"]: <ReportingIcon />,
  // ["Carrier: Dashboard & Reports"]: <ReportingIcon />,
} as any;

const returnsAndEnquiryTitle = "Order & Returns Enquiry";

const customTabName = {
  [returnsAndEnquiryTitle]: "Customer Enquiry",
};
const DrawerLinks = {
  ["Client List"]: ClientListPath,
  ["Roles & Permissions"]: RolesAndPermissionsPath,
  ["Manage Users"]: ManageUsersPath,
  ["Activate Users"]: ActivateUsersPath,
  ["User Activity - Overview"]: UserActivityOverviewPath,
  ["Carrier Prices"]: CarrierPricesPath,
  ["Carrier: Active Dates"]: CarrierServicesActiveDatesPath,
  ["Carrier: Parcel Limits"]: CarrierParcelLimitsPath,
  ["Carrier Capacity Set Up"]: CarrierCapacitySetUpPath,
  ["Product Fixed Routing: by SKU"]: ProductFixedRoutingDespatchPath,
  ["Product Fixed Routing: by Region"]: ProductFixedRoutingByRegionPath,
  ["Multi Box Products: Routing"]: MultiBoxProductsRoutingPath,

  ["Returns Portal Rules"]: "", //ReturnsPortalRulesPath,
  ["Returns Options: Routing Rules"]: "", //ReturnsCarrierRoutingOptions,
  ["Return Reason Codes"]: "", //ReturnReasonCodesPath,

  // ["Customer Facing: Communication Events"]:
  //   CustomerFacingCommunicationEventsPath,
  // ["Customer email Set Up: Templates & Triggers"]:
  //   CustomerEmailSetUpTemplatesAndTriggersPath,
  // ["Claims Preparation"]: ClaimsPreparationPath,

  ["Invoice Reconciliation"]: InvoiceReconciliationPath,
  ["Invoice Details"]: InvoiceDetailsPath,

  // ["Order & Returns Enquiry"]: OrderAndReturnsEnquiryPath,
  ["Parcel Delivery Status"]: ClaimsPreparationPath,
  ["Carrier Dashboard"]: CarrierDashboardPath,
  ["Carrier Routing Exceptions"]: CarrierRoutingExceptionsHistoryPath,
  ["Returns Dashboard"]: "", //ReturnsPortalPath,
  ["Returns Trend Report"]: "", //ReturnsPortalPath,

  ["Item File: Stock Reservation"]: ItemFileStockReservationPath,
  [returnsAndEnquiryTitle]: OrderAndReturnsEnquiryPath,
  ["Returns Portal"]: ReturnsPortalPath,

  // The below two links not completely done
  // ["Returns: Dashboard"]: ReturnsDashboardPath,
  // ["Returns: Trend Report"]: ReturnsTrendReportPath,

  // ["Carrier: Dashboard"]: CarrierDashboardPath,
  // ["Carrier Routing: Exceptions History"]: CarrierRoutingExceptionsHistoryPath,
} as any;

const clearRedux = {
  ["Carrier: Parcel Limits"]: clearCarrierParcelLimitsState,
} as any;

const UserDashboard = ({
  children,
  style,
  contentParentStyle,
  containerClassName,
}: Props): JSX.Element => {
  const { asPath } = useRouter();
  const pathname = asPath;
  const router = useRouter();
  const dispatch = useDispatch();
  const theme = useTheme();
  const { md } = useBreakpoint();
  const [visible, setVisible] = useState<boolean>(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(true);
  const [drawer, setDrawer] = useState<any>([]);

  const currentUser: any = useSelector(
    ({ users }: RootStateOrAny) => users.currentUser
  );

  const navTabs: any = useSelector(
    ({ navTabs }: RootStateOrAny) => navTabs.navTabs
  );

  useEffect(() => {
    dispatch(initializeTheme());
    ConfigProvider.config({
      theme: {
        primaryColor: theme?.primary,
      },
    });
    dispatch(fetchCurrentUsers());
  }, []);

  useEffect(() => {
    const isHome = navTabs.length > 0 ? true : !comparePaths("/home", pathname);
    const isValueExist = navTabs.find((d: any) =>
      comparePaths(d.link, pathname)
    );
    if (!isValueExist && isHome) {
      let title = "";

      for (let property in DrawerLinks) {
        if (comparePaths(DrawerLinks[property], pathname.split("?")[0])) {
          const hasCustomTabName =
            customTabName[property as keyof typeof customTabName];
          if (hasCustomTabName) {
            property = hasCustomTabName;
          }
          title = property;
          break;
        }
      }

      dispatch(
        addNavTab({
          navTab: {
            title,
            link: pathname,
            ...(clearRedux?.[title] ? { clearRedux: clearRedux?.[title] } : {}),
          },
        })
      );
    }
  }, [pathname]);

  useEffect(() => {
    getDrawer();
  }, [currentUser]);

  const getDrawer = async () => {
    if (currentUser?.role && currentUser?.role?.permissions) {
      console.log({ currentUserPermissions: currentUser.role.permissions });
      const drawerData = await DrawerPermissionFunc(
        currentUser.role.permissions,
        // DrawerPermissions,
        MenuIcons,
        SubMenuIcons,
        DrawerLinks,
        clearRedux
      );
      setDrawer(drawerData);
    }
  };

  useEffect(() => {
    setVisible(false);
  }, [md]);

  return (
    <Layout>
      {currentUser && (
        <Beforeunload
          onBeforeunload={(event: any) => {
            event.preventDefault();
            return (event.returnValue = "Do you want to Log out");
          }}
        />
      )}
      <Navigation
        drawer={drawer}
        setSidebarCollapsed={setSidebarCollapsed}
        // className="xsm:hidden md:block"
      />
      <MobileNav visible={visible} setVisible={setVisible} />
      <Layout
        className="site-layout"
        style={sidebarCollapsed ? { marginLeft: 60 } : { marginLeft: 255 }}
      >
        <div>
          <div
            style={{
              backgroundColor: theme?.black,
              borderBottom: `4px solid transparent`,
              borderImage: theme?.primaryNightHorizontal,
              borderImageSlice: 1,
              backgroundClip: "content-box",
              marginBottom: "50px",
            }}
            className="header-top h-14"
          >
            <div
              style={{
                color: "white",
                display: "flex",
                alignItems: "center",
                height: "100%",
                justifyContent: "space-between",
              }}
            >
              <img
                alt="Logo image"
                src="/logo.png"
                width="125px"
                height="125px"
              />
              <div
                className="align-content-end bottom-12 flex justify-center float-end"
                style={{ paddingTop: 5 }}
              >
                <SuperAdmin onlyIcon={false} />
              </div>
            </div>
          </div>
        </div>
        <Content
          style={
            contentParentStyle
              ? contentParentStyle
              : { overflow: "initial", margin: "10px 0 0 0" }
          }
        >
          <DargSystem />
          {children ? (
            <div
              className={`site-layout-background  ${containerClassName}`}
              style={
                style
                  ? style
                  : {
                      padding: 24,
                      height: "calc(100vh - 165px)",
                      overflow: "scroll",
                    }
              }
            >
              {children}
            </div>
          ) : (
            ""
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default UserDashboard;
