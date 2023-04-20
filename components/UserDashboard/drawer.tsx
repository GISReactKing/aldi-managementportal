import { DashboardIcon } from "../Icons/DashboardIcon";
import { CarrierIcon } from "../Icons/CarrierIcon";
import { UsersIcon } from "../Icons/UsersIcon";
import { PortalIcon } from "../Icons/Portal";
import { InvoicingIcon } from "../Icons/Invoicing";
import { ReportingIcon } from "../Icons/Reporting";
import { StockIcon } from "../Icons/StockIcon";
import { PostIcon } from "../Icons/PostIcon";

export const DRAWERDATA = [
  {
    title: "Set Up & Control",
    icon: <DashboardIcon />,
    subTitles: [
      {
        title: "User Administration",
        icon: <UsersIcon />,
        subTitles: [
          {
            title: "Client List",
            link: "/user-administration/client-list",
          },
          {
            title: "Roles & Permissions",
            link: "/user-administration/roles-&-permissions",
          },
          {
            title: "Manage Users",
            link: "/user-administration/manage-users",
          },
          {
            title: "Activate Users",
            link: "",
          },
          {
            title: "User Activity - Overview",
            link: "",
          },
        ],
      },
      {
        title: "Carrier Routing Control",
        icon: <CarrierIcon />,
        subTitles: [
          {
            title: "Carrier Prices",
            link: "",
          },
          {
            title: "Carrier: Active Dates",
            link: "",
          },
          {
            title: "Carrier: Parcel Limits",
            link: "",
          },
          {
            title: "Carrier Capacity Set Up",
            link: "",
          },
          {
            title: "Product Fixed Routing: Despatch",
            link: "",
          },
          {
            title: "Product Fixed Routing: by Region",
            link: "",
          },
          {
            title: "Multi Box Products: Routing",
            link: "",
          },
        ],
      },
      {
        title: "Returns Portal Control",
        icon: <PortalIcon />,
        subTitles: [
          {
            title: "Returns Portal Rules",
            link: "",
          },
          {
            title: "Returns Options: Routing Rules",
            link: "",
          },
          {
            title: "Return Reason Codes",
            link: "",
          },
        ],
      },
      {
        title: "Post Purchase Communication",
        icon: <PostIcon />,
        subTitles: [
          {
            title: "Customer Facing: Communication Events",
            link: "",
          },
          {
            title: "Customer email Set Up: Templates & Triggers",
            link: "",
          },
        ],
      },
    ],
  },
  {
    title: "Carriage: Claims & Invoicing",
    icon: <InvoicingIcon />,
    subTitles: [
      {
        title: "Claims Preparation",
        link: "/carriage-claims-and-Invoicing/claim-preparation",
      },
      {
        title: "Invoice Reconciliation",
        link: "/carriage-claims-and-Invoicing/invoice-reconciliation",
      },
    ],
  },
  {
    title: "SKU's & Stock",
    icon: <StockIcon />,
    subTitles: [
      {
        title: "Item File: Stock Reservation",
        link: "",
      },
    ],
  },
  {
    title: "Dashboards, Reporting & Enquiries",
    icon: <ReportingIcon />,
    subTitles: [
      {
        title: "Order & Returns Enquiry",
        link: "",
      },
      {
        title: "Returns Portal",
        link: "",
      },
      {
        title: "Returns: Dashboard & Reports",
        icon: <ReportingIcon />,
        subTitles: [
          {
            title: "Returns: Dashboard",
            link: "",
          },
          {
            title: "Returns: Trend Report",
            link: "",
          },
        ],
      },
      {
        title: "Carrier: Dashboard & Reports",
        icon: <ReportingIcon />,
        subTitles: [
          {
            title: "Carrier: Dashboard",
            link: "/dashboards-reporting-&-enquiries/carrier-dashboard-&-reports/carrier-dashboard",
          },
          {
            title: "Carrier Routing: Exceptions History",
            link: "",
          },
        ],
      },
    ],
  },
];
