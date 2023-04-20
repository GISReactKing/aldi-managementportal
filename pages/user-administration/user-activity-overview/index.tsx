/** @format */
import React, { useState, useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { CSVLink } from "react-csv";
import { Typography } from "antd";
import _ from "lodash";
import { RootStateOrAny, useSelector, useDispatch } from "react-redux";
import moment from "moment";
import { FormLabel } from "react-bootstrap";
import UserDashboard from "../../../components/UserDashboard";
import FilterBar from "./FilterBar";
import UserTable from "../../../components/Table";
import DatePicker from "../../../components/calendar-datepicker";
import ActionBar from "./ActionBar";
import ActiveLogModal from "./ActiveLogModal";
import CreateUserModal from "../../../components/CreateUserModal/CreateUserModal";
import {
  fetchExportUserActivity,
  fetchUserActivity,
} from "../../../redux/slices/usersSlice";
import styles from "./user-activity.module.scss";
import { AppButton } from "../../../components/AppButton";
import {
  getColumnSearchProps,
  getColumnDateSearchProps,
} from "../../../utils/TableColumnFilter";

interface Props {}

const { Title } = Typography;

console.log({ styles });

const ActivityOverview = ({}: Props): JSX.Element => {
  const dispatch = useDispatch();
  const csvLink = useRef() as any;

  const searchInputRef = useRef() as any;
  const componentToPrintRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentToPrintRef.current,
  });

  const [show, setShow] = useState<boolean>(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [activeLogModal, setActiveLogModal] = useState<boolean>(false);
  const [isCalendar, setIsCalendar] = useState<boolean>(false);
  const [loader, setLoader] = useState<boolean>(false);
  const [showData, setShowData] = useState<boolean>(false);
  const [userActivityData, setUserActivitydata] = useState([]) as any;
  const [filterDates, setFilterDates] = useState(null) as any;
  const scroll = {
    x: "max-content",
  };
  const [csvData, setCsvData] = useState<any>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [searchedColumn, setSearchedColumn] = useState<string>("");

  const currentUser: any = useSelector(
    ({ users }: RootStateOrAny) => users.currentUser
  );

  const userActivityLoader: any[] = useSelector(
    ({ users }: RootStateOrAny) => users.userActivityLoader
  );

  const userActivities: any[] = useSelector(
    ({ users }: RootStateOrAny) => users.userActivities
  );

  const exportUserActivities: any[] = useSelector(
    ({ users }: RootStateOrAny) => users.exportUserActivities
  );

  useEffect(() => {
    if (currentUser) {
      dispatch(
        fetchExportUserActivity(currentUser?.role?.iforce_user ? "" : "aldi")
      );
      dispatch(fetchUserActivity(currentUser?.role?.iforce_user ? "" : "aldi"));
    }
  }, [currentUser]);

  useEffect(() => {
    if (exportUserActivities) {
      let data = exportUserActivities.map((item) => {
        return {
          ...item,
          date: moment(item.date).format("DD/MM/YYYY"),
          client: item.client
            ? `${item.client.slice(0, 1).toUpperCase()}${item.client
                .slice(1)
                .toLowerCase()}`
            : "",
        };
      });
      data = _.orderBy(
        exportUserActivities,
        function (o) {
          return moment(o.date).format("YYYYMMDD");
        },
        ["desc"]
      );
      setCsvData(data);
    }
  }, [exportUserActivities]);

  useEffect(() => {
    dateFilter();
  }, [userActivities, filterDates]);

  const usersColumns = [
    {
      title: "Menu Option",
      sorter: (a: any, b: any) => a.menuOption.localeCompare(b.menuOption),
      ...getColumnSearchProps(
        "menuOption",
        searchInputRef,
        { searchText, setSearchText },
        { searchedColumn, setSearchedColumn }
      ),
      dataIndex: "menuOption",
      key: "menuOption",
      className: "table-header-activity-col",
      showSorterTooltip: false,
    },
    {
      title: "Action",
      sorter: (a: any, b: any) => a.action.localeCompare(b.action),
      ...getColumnSearchProps(
        "action",
        searchInputRef,
        { searchText, setSearchText },
        { searchedColumn, setSearchedColumn }
      ),
      dataIndex: "action",
      key: "action",
      className: "table-header-activity-col",
      showSorterTooltip: false,
    },
    {
      title: "Date",
      sorter: (a: any, b: any) => moment(a.date).unix() - moment(b.date).unix(),
      ...getColumnDateSearchProps(
        "date",
        searchInputRef,
        { searchText, setSearchText },
        { searchedColumn, setSearchedColumn }
      ),
      render: (date: any) => `${moment(date).format("DD/MM/YYYY")}`,
      dataIndex: "date",
      defaultSortOrder: "descend",
      key: "date",
      className: "table-header-activity-col",
      showSorterTooltip: false,
    },

    {
      title: "Time",
      dataIndex: "time",
      key: "time",
      className: "table-header-activity-col",
      showSorterTooltip: false,
    },
    {
      title: "Client",
      dataIndex: "client",
      key: "client",
      className: "table-header-activity-col",
      showSorterTooltip: false,
      render: (item: any, recode: any) => {
        return (
          <span>
            {item
              ? `${item.slice(0, 1).toUpperCase()}${item
                  .slice(1)
                  .toLowerCase()}`
              : ""}
          </span>
        );
      },
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      className: "table-header-activity-col",
      align: "left",
      sorter: (a: any, b: any) => a.name.localeCompare(b.name),
      ...getColumnSearchProps(
        "name",
        searchInputRef,
        { searchText, setSearchText },
        { searchedColumn, setSearchedColumn }
      ),
    },

    {
      title: "Username",
      sorter: (a: any, b: any) => a.username.localeCompare(b.username),
      showSorterTooltip: false,
      dataIndex: "username",
      className: "table-header-activity-col",
      key: "username",
      ...getColumnSearchProps(
        "username",
        searchInputRef,
        { searchText, setSearchText },
        { searchedColumn, setSearchedColumn }
      ),
    },

    {
      title: "User Role",
      sorter: (a: any, b: any) => a.userRole.localeCompare(b.userRole),
      showSorterTooltip: false,
      className: "table-header-activity-col",
      dataIndex: "userRole",
      key: "userRole",
      ...getColumnSearchProps(
        "userRole",
        searchInputRef,
        { searchText, setSearchText },
        { searchedColumn, setSearchedColumn }
      ),
    },
  ];

  const dateFilter = () => {
    let tempData = JSON.parse(JSON.stringify(userActivities));

    let tempData1 = [];
    if (filterDates && filterDates.from && filterDates.to) {
      tempData1 = tempData.filter((o: any) => {
        // o.date = moment(o.date).format('DD/MM/YYYY')
        const dateString = moment(o.date).format("YYYY-MM-DD");
        const start = moment(filterDates.from);
        const end = moment(filterDates.to);
        return (
          (start.isSame(dateString) || start.isBefore(dateString)) &&
          (end.isSame(dateString) || end.isAfter(dateString))
        );
      });
      setUserActivitydata(tempData1);
      let data = tempData1.sort((a: any, b: any) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
      data = data.map((item: any) => {
        return {
          ...item,
          date: moment(item.date).format("DD/MM/YYYY"),
          client: item.client
            ? `${item.client.slice(0, 1).toUpperCase()}${item.client
                .slice(1)
                .toLowerCase()}`
            : "",
        };
      });
      setCsvData(data);
      return;
    }

    setUserActivitydata(tempData);
  };

  const customDateHandle = (v: any): any => {
    setFilterDates(JSON.parse(JSON.stringify(v)));
    setShowData(true);
  };

  const makeHeaders = (label: string, key: string) => {
    const headers: any = [
      { [label]: "Menu Options", [key]: "menuOption" },
      { [label]: "Action", [key]: "action" },
      { [label]: "Date", [key]: "date" },
      { [label]: "Time", [key]: "time" },
      { [label]: "Client", [key]: "client" },
      { [label]: "Name", [key]: "name" },
      { [label]: "Username", [key]: "username" },
      { [label]: "User Role", [key]: "userRole" },
    ];
    return headers;
  };

  return (
    <UserDashboard>
      <AppButton
        className="xsm:w-28 xsm:h-9 lg:w-30 lg:h-10 font-bold tracking-wide mt-5 "
        style={{
          borderRadius: "4px",
          position: "absolute",
          top: 0,
          right: 145,
        }}
        onClick={() => handlePrint()}
        title="Print"
        disabled={!filterDates?.from || !filterDates?.to || !csvData?.length}
      />
      <AppButton
        className="xsm:w-28 xsm:h-9 lg:w-30 lg:h-10 font-bold tracking-wide mt-5 "
        style={{
          borderRadius: "4px",
          position: "absolute",
          top: 0,
          right: 10,
        }}
        onClick={() => csvLink?.current?.link?.click()}
        title="Export"
        disabled={!filterDates?.from || !filterDates?.to || !csvData?.length}
      />

      <CSVLink
        data={csvData}
        headers={makeHeaders("label", "key")}
        filename={"user-activity-overview.csv"}
        ref={csvLink}
      />
      <FilterBar
        customDateHandle={customDateHandle}
        setShowData={setShowData}
      />
      <ActionBar
        onCloseActionBar={() => setSelectedRows([])}
        activeActionBar={selectedRows.length > 0 ? true : false}
        // onRestPassword={onRestPassword}
        // dltPress={onDelete}
      />
      <div
        className="z-0 scroll-page"
        id="user-activity-table"
        ref={componentToPrintRef}
      >
        <div className={`${styles.formatPrint}`}>
          <div className={`${styles.componentToPrint}`}>
            <div className="d-flex flex-column mb-4 align-items-center">
              <div className=" d-flex justify-end w-100 pr-4 mt-4">
                <FormLabel>{moment().format("DD/MM/YYYY HH:mm")}</FormLabel>
              </div>
              <Title level={3}>User Activity - Overview</Title>
            </div>
          </div>
          <UserTable
            loading={userActivityLoader || loader}
            columns={usersColumns}
            rowSelection={false}
            dataSource={!showData ? [] : userActivityData}
            scroll={{ x: "max-content" }}
            pagination={false}
          />
        </div>
      </div>

      <ActiveLogModal
        showModal={activeLogModal}
        onCloseModal={setActiveLogModal}
        onDelete={() => alert("delete fun call")}
        onExport={() => alert("Export fun call")}
      />
      <DatePicker
        showModal={isCalendar}
        onCloseModal={() => setIsCalendar(false)}
      />
      <CreateUserModal show={show} onHide={() => setShow(false)} />
    </UserDashboard>
  );
};

export default ActivityOverview;
