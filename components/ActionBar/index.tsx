/** @format */
import { useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import "jspdf-autotable";
import _ from "lodash";
import { Button, Popover } from "antd";
import {
  DeleteIcon,
  ExportIcon,
  SmallRestPasswordIcon,
  CloseIcon,
} from "../Icons";
import useTheme from "../../hooks/useTheme";

interface Props {
  dltPress?: () => void;
  onRestPassword?: () => void;
  onCloseActionBar?: () => void;
  activeActionBar?: boolean;
  data?: any;
}

const ActionBar = ({
  dltPress,
  onRestPassword,
  activeActionBar,
  onCloseActionBar,
  data,
}: Props): JSX.Element => {
  const doc = new jsPDF({
    format: "a4",
    unit: "mm",
    orientation: "l",
  }) as any;

  const theme = useTheme();

  const [csvData, setCsvData] = useState<any>([]);

  const makeHeaders = (label: string, key: string) => {
    // const headers: any = [
    //   { [label]: "First Name", [key]: "first_name" },
    //   { [label]: "Last Name", [key]: "last_name" },
    //   { [label]: "Email", [key]: "email" },
    //   { [label]: "Company", [key]: "company" },
    //   { [label]: "Username", [key]: "username" },
    //   { [label]: "Power Bi Username", [key]: "power_bi_username" },
    //   { [label]: "Position", [key]: "position" },
    //   { [label]: "Client", [key]: "client" },
    //   { [label]: "Site", [key]: "domain_username" },
    //   { [label]: "Role Name", [key]: key === 'dataKey' ? "role_name" : "role_name[0].name" },
    //   { [label]: "Status", [key]: "status" },
    // ];
    const headers: any = [
      { [label]: "First Name", [key]: "first_name" },
      { [label]: "Last Name", [key]: "last_name" },
      { [label]: "Username", [key]: "username" },
      {
        [label]: "User Role",
        [key]: key === "dataKey" ? "user_role" : "user_role",
      },
      { [label]: "Client", [key]: "client" },
      {
        [label]: "Client User Administrator",
        [key]: "client_user_administrator",
      },
      {
        [label]: "Client User Role",
        [key]: key === "dataKey" ? "client_user_role" : `client_user_role`,
      },
      {
        [label]: "iForce User Administrator",
        [key]: "iForce_user_administrator",
      },
      { [label]: "Active", [key]: "active" },
      { [label]: "Locked", [key]: "lock" },
    ];
    return headers;
  };

  useEffect(() => {
    const dataForPdf = data.map((items: any, index: number) => {
      let singleItem = { ...items };
      singleItem.user_role = singleItem.role.name;
      singleItem.client_user_administrator = singleItem.role.user_admin
        ? "Yes"
        : "No";
      singleItem.lock = singleItem.lock ? "Yes" : "No";
      singleItem.active = singleItem.active ? "Yes" : "No";
      singleItem.client_user_role = singleItem.role.user_role ? "Yes" : "No";
      singleItem.iForce_user_administrator = singleItem.role.iforce_user
        ? "Yes"
        : "No";
      return singleItem;
    });
    setCsvData(dataForPdf);
  }, [data]);

  const createPdf = () => {
    doc.autoTable({
      theme: "grid",
      headStyles: {
        lineWidth: 0.2,
        fillColor: theme?.primarySea,
        halign: "center",
      },
      columnStyles: {
        iForce_user_administrator: { halign: "center", width: "auto" },
        client_user_administrator: { halign: "center", width: "auto" },
        client_user_role: { halign: "center", width: "auto" },
        active: { halign: "center", width: "auto" },
        lock: { halign: "center", width: "auto" },
      },
      body: csvData,
      columns: makeHeaders("header", "dataKey"),
    });
    doc.save("user-data.pdf");
  };

  return (
    <>
      <div
        style={{ borderColor: theme?.monoInput }}
        className={`${
          activeActionBar ? "flex" : "hidden"
        } border-t border-b justify-between items-center`}
      >
        <div>
          <Button
            onClick={onRestPassword}
            type="text"
            style={{ color: theme?.monoGray }}
            className="hover:bg-transparent hover:text-primary-sea text-xsm pl-2"
            icon={<SmallRestPasswordIcon />}
          >
            <span className="ml-3">Reset Password</span>
          </Button>

          <Popover
            placement="bottom"
            arrowPointAtCenter
            content={
              <div className="flex flex-col p-0">
                <Button
                  type="text"
                  style={{ color: theme?.mono }}
                  className="text-12 tracking-xl-wide"
                >
                  <CSVLink
                    data={csvData}
                    headers={makeHeaders("label", "key")}
                    filename={"manage-users.csv"}
                  >
                    Export as CSV
                  </CSVLink>
                </Button>
                <Button
                  onClick={createPdf}
                  type="text"
                  style={{ color: theme?.mono }}
                  className="text-12 tracking-xl-wide"
                >
                  Export as PDF
                </Button>
              </div>
            }
            trigger="click"
          >
            <Button
              type="text"
              style={{ color: theme?.monoGray }}
              className="hover:bg-transparent hover:text-primary-sea md:ml-1 text-xsm"
              icon={<ExportIcon />}
            >
              <span className="ml-3">Export Users</span>
            </Button>
          </Popover>

          <Button
            type="text"
            style={{ color: theme?.monoGray }}
            className="hover:bg-transparent hover:text-secondary-fire md:ml-4 text-xsm"
            icon={<DeleteIcon />}
            onClick={dltPress}
          >
            <span className="ml-3">Delete Users</span>
          </Button>
        </div>
        <Button
          onClick={onCloseActionBar}
          className="border-0 flex justify-center items-center"
          icon={<CloseIcon color={theme?.monoPlaceholder} size={20} />}
        />
      </div>
    </>
  );
};

export default ActionBar;
