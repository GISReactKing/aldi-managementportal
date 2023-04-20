/** @format */

import type { NextPage } from "next";
import UserDashboard from "../../../components/UserDashboard";
import { AppButton } from "../../../components/AppButton";
import { useReactToPrint } from "react-to-print";
import styles from "./styles.module.scss";
import { RootStateOrAny, useSelector, useDispatch } from "react-redux";
import { Table, Col, Row, Typography } from "antd";
import { useEffect, useRef, useState } from "react";
import ActiveUserModal from "../../../components/Modals/ActiveUserModal";
import ActivateUserTable from "../../../components/Tables/ActivateUserTable";
import { isEmpty } from "lodash";
import moment from "moment";
import { FormLabel } from "react-bootstrap";

import { CSVLink } from "react-csv";
import {
  fetchUserList,
  userActivation as activateUser,
} from "../../../redux/slices/userActivation";
import {
  getColumnSearchProps,
  getColumnDateSearchProps,
} from "../../../utils/TableColumnFilter";
import { checkingDisableOfAppButton } from "../../../utils/CheckingStatus";
import useTheme from "../../../hooks/useTheme";

const { Title } = Typography;

const Performance: NextPage = () => {
  const theme = useTheme();
  const [showActiveModal, setShowActiveModal] = useState<boolean>(false);

  const [selectUser, setSelectUser] = useState([]);
  const [exportData, setExportData] = useState([]) as any;
  const [page, setPage] = useState(10) as any;
  const [searchText, setSearchText] = useState<string>("");
  const [searchedColumn, setSearchedColumn] = useState<string>("");

  const searchInputRef = useRef() as any;
  const tableToPrint = useRef(null);

  const userList = useSelector(
    ({ userActivation }: RootStateOrAny) => userActivation.userList
  );

  const loading = useSelector(
    ({ userActivation }: RootStateOrAny) => userActivation.loader
  );

  const currentUser = useSelector(
    ({ users }: RootStateOrAny) => users.currentUser
  );

  const userListData = userList?.users?.map((user: any) => {
    console.log(
      `Created Date Activate User: ${
        user.createdDate
      } ${typeof user.createdDate}`
    );
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      userName: user.userName,
      userRole: user.userRole,
      createdDate: user.createdDate,
    };
  });

  const dispatch = useDispatch();
  const [selectedKeys, setRowKeys] = useState([]);

  const handlePrint = useReactToPrint({
    content: () => tableToPrint.current,
  });

  const onActiveHandle = async () => {
    const usernames = selectUser.map((user: any) => user.userName);

    await dispatch(activateUser(usernames) as any);

    setShowActiveModal(false);
    setRowKeys([]);
    await dispatch(fetchUserList() as any);
  };

  const onChangePagination = (e: any) => {
    setPage(e);
  };

  useEffect(() => {
    dispatch(fetchUserList() as any);
  }, []);

  const columns: any = [
    {
      title: "First Name",
      dataIndex: "firstName",
      key: "firstName",
      className: "table-header-col",
      sorter: (a: any, b: any) => a.firstName.localeCompare(b.firstName),
      ...getColumnSearchProps(
        "firstName",
        searchInputRef,
        { searchText, setSearchText },
        { searchedColumn, setSearchedColumn }
      ),
      render: (item: string) => {
        return <span className="text-left">{item}</span>;
      },
    },
    {
      title: "Last Name",
      sorter: (a: any, b: any) => a.lastName.localeCompare(b.lastName),
      dataIndex: "lastName",
      key: "lastName",
      ...getColumnSearchProps(
        "lastName",
        searchInputRef,
        { searchText, setSearchText },
        { searchedColumn, setSearchedColumn }
      ),
      render: (item: string) => {
        return <span className="text-left">{item}</span>;
      },
    },
    {
      title: "Username",
      dataIndex: "userName",
      key: "userName",
      sorter: (a: any, b: any) => a.userName.localeCompare(b.userName),
      ...getColumnSearchProps(
        "userName",
        searchInputRef,
        { searchText, setSearchText },
        { searchedColumn, setSearchedColumn }
      ),
      render: (item: string) => {
        return <span className="text-left">{item}</span>;
      },
    },
    {
      title: "User Role",
      dataIndex: "userRole",
      key: "userRole",
      ...getColumnSearchProps(
        "userRole",
        searchInputRef,
        { searchText, setSearchText },
        { searchedColumn, setSearchedColumn }
      ),
      sorter: (a: any, b: any) => a.userRole.localeCompare(b.userRole),
      render: (item: string) => {
        return <span className="text-left">{item}</span>;
      },
    },
    {
      title: "Created Date",
      dataIndex: "createdDate",
      key: "createdDate",
      align: "center",
      sorter: (a: any, b: any) =>
        moment(a?.createdDate).unix() - moment(b?.createdDate).unix(),
      ...getColumnDateSearchProps(
        "createdDate",
        searchInputRef,
        { searchText, setSearchText },
        { searchedColumn, setSearchedColumn }
      ),
      render: (date: string) => moment(date).format("DD/MM/YYYY"),
    },
    Table.SELECTION_COLUMN,
  ];

  const rowSelection = {
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      setSelectUser(selectedRows);
      setRowKeys(selectedRowKeys);
    },
    getCheckboxProps: (record: any) => ({
      disabled: CUDDisabled,
    }),
  };

  useEffect(() => {
    if (userListData) {
      let dataExport = userListData.map((user: any) => {
        return {
          firstName: user.firstName,
          lastName: user.lastName,
          userName: user.userName,
          userRole: user.userRole,
          createdDate: moment(user.createdDate).format("DD/MM/YYYY"),
        };
      });
      setExportData(dataExport);
    }
  }, [userList]);

  const makeHeaders = (label: string, key: string) => {
    const headers: any = [
      { [label]: "First Name", [key]: "firstName" },
      { [label]: "Last Name", [key]: "lastName" },
      { [label]: "User Name", [key]: "userName" },
      { [label]: "User Role", [key]: "userRole" },
      { [label]: "Created Date", [key]: "createdDate" },
    ];
    return headers;
  };

  const CUDDisabled = checkingDisableOfAppButton(currentUser, "create", [
    "Set Up & Control",
    "User Administration",
    "Activate Users",
  ]);

  return (
    <UserDashboard>
      <div
        style={{
          justifyContent: "center",
          display: "flex",
          width: "100%",
          height: "70vh",
        }}
      >
        <ActiveUserModal
          primaryBtnTitle="Activate Users"
          showModal={showActiveModal}
          onCloseModal={setShowActiveModal}
          onPrimaryHandle={() => onActiveHandle()}
        >
          <p
            style={{
              color: theme?.mono,
            }}
            className="text-center fs-6 text-dark"
          >
            The selected Users will be activated
          </p>
          <p
            style={{
              color: theme?.mono,
            }}
            className="mt-1 mb-3 text-center  px-1 text-xsm leading-5 fs-6 text-dark"
          >
            Each User will receive an email with their First Time Login Password
          </p>
        </ActiveUserModal>

        <AppButton
          className={`xsm:w-28 xsm:h-9 lg:w-30 lg:h-10 font-bold tracking-wide mt-5 position-absolute top-1 z-50 ${styles.buttonInHeader}`}
          title="Activate Users"
          style={{
            borderRadius: "4px",
            right: "285px",
          }}
          disabled={isEmpty(selectUser) || CUDDisabled}
          onClick={() => setShowActiveModal(true)}
        />
        <AppButton
          className={`xsm:w-28 xsm:h-9 lg:w-30 lg:h-10 font-bold tracking-wide mt-5 position-absolute top-1 z-50 ${styles.buttonInHeader}`}
          title="Print"
          style={{
            borderRadius: "4px",
            right: "150px",
          }}
          onClick={handlePrint}
        />
        <CSVLink
          data={exportData}
          headers={makeHeaders("label", "key")}
          filename={"activate-users.csv"}
        >
          <AppButton
            className={`xsm:w-28 xsm:h-9 lg:w-30 lg:h-10 font-bold tracking-wide mt-5 position-absolute top-1 right-4 z-50 ${styles.buttonInHeader}`}
            title="Export"
            style={{ borderRadius: "4px" }}
            onClick={() => {}}
          />
        </CSVLink>

        <div className="z-0 scroll-page" id="users-table">
          <div className={`${styles.printTableContainer}`} ref={tableToPrint}>
            <div className={`${styles.tableHeader}`}>
              <div className={`${styles.showOnPrint}`}>
                <FormLabel>{moment().format("DD/MM/YYYY HH:mm")}</FormLabel>
              </div>
              <Row>
                <Col md="12" style={{ textAlign: "center" }}>
                  <Row>
                    <Title level={3} className="mb-0">
                      User Activation
                    </Title>
                  </Row>
                </Col>
              </Row>
            </div>
            <div className={`${styles.printWidth}`}>
              <ActivateUserTable
                rowKey={"id"}
                rowSelection={{
                  type: "checkbox",
                  ...rowSelection,
                }}
                columns={columns}
                dataSource={userListData}
                loading={loading}
                pagination={false}
                CUDDisabled={CUDDisabled}
              />
            </div>
          </div>
        </div>
      </div>
    </UserDashboard>
  );
};

export default Performance;
