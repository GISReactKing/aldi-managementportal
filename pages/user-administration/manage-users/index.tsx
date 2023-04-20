/** @format */

import React, { useEffect, useState, useRef } from "react";
import UserDashboard from "../../../components/UserDashboard";
import UserTable from "../../../components/Tables/UserTable";
import { RootStateOrAny, useSelector } from "react-redux";
import { CSVLink } from "react-csv";
import _ from "lodash";
import {
  IUser,
  fetchUsers,
  fetchUsersExport,
  deleteUser,
  fetchRoles,
  updateUsersPaginationEntityCount,
} from "../../../redux/slices/usersSlice";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import EditUser from "../edit-user";
import AppModal from "../../../components/Modal";
import {
  DeleteIconInModal,
  EmailConfirmationIcon,
} from "../../../components/Icons";
import { fetchClientList } from "../../../redux/slices/clientSlice";
import ActionBtn from "../../../components/ActionBtn";
import ActionBar from "../../../components/ActionBar";
import SetUpUser from "../set-up-user";
import { PaginationFunc } from "../../../utils/PaginationFunc";
import { AppButton } from "../../../components/AppButton";
import { checkingDisableOfAppButton } from "../../../utils/CheckingStatus";
import { useReactToPrint } from "react-to-print";
import styles from "./styles.module.scss";
import { FormLabel } from "react-bootstrap";
import { Col, Row, Typography } from "antd";
import moment from "moment";
import ClearModal from "../../../components/Modals/ProductFixedRoutingDespatch/ClearModal";
import { getColumnSearchProps } from "../../../utils/TableColumnFilter";
import useTheme from "../../../hooks/useTheme";
const { Title } = Typography;

interface Props {}

type IDProps = {
  id?: string;
  ids?: string;
};

const Users = ({}: Props): JSX.Element => {
  const theme = useTheme();
  const csvLink = useRef() as any;
  const dispatch = useDispatch();
  const router = useRouter();
  const [show, setShow] = useState<boolean>(false);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showRestPasswordModal, setShowRestPasswordModal] =
    useState<boolean>(false);
  const [showEdit, setShowEdit] = useState<string>("");
  const [showView, setShowView] = useState<string>("");
  const [selectedRows, setSelectedRows] = useState<any>([]);
  const [selectedRowsData, setSelectedRowsData] = useState<any>([]);
  const [userData, setUserdata] = useState([]) as any;
  const [userDataSearch, setUserDataSearch] = useState([]) as any;
  const [isSearch, setIsSearch] = useState(false) as any;
  const [paginationCount, setPaginationCount] = useState([]) as any;
  const [selectAction, setSelectAction] = useState<string>("");
  const [page, setPage] = useState(1) as any;
  const [csvData, setCsvData] = useState<any>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [searchedColumn, setSearchedColumn] = useState<string>("");
  const [userDataList, setUserDataList] = useState<any>([]);
  const scroll = {
    // x: "max-content",
  };

  const searchInputRef = useRef() as any;
  const tableToPrint = useRef() as any;
  const handlePrint = useReactToPrint({
    content: () => tableToPrint.current,
  });

  const loading: IUser[] = useSelector(
    ({ users }: RootStateOrAny) => users.loader
  );

  const exportLoader: boolean = useSelector(
    ({ users }: RootStateOrAny) => users.exportLoader
  );

  const paginationEntityCount = useSelector(
    ({ users }: RootStateOrAny) => users.paginationEntityCount
  );

  const currentUser = useSelector(
    ({ users }: RootStateOrAny) => users.currentUser
  );

  const usersData: IUser[] = useSelector(
    ({ users }: RootStateOrAny) => users.usersData
  );

  const totalUser: number = useSelector(
    ({ users }: RootStateOrAny) => users.totalUser
  );

  const clientData = useSelector(
    ({ client }: RootStateOrAny) => client.clientList
  );

  useEffect(() => {
    if (currentUser?.role?._id) {
      dispatch(
        fetchUsers({
          page,
          limit: paginationEntityCount,
          type: currentUser?.role?.iforce_user ? "iforce" : "aldi",
        })
      );
      dispatch(
        fetchRoles({ type: currentUser?.role?.iforce_user ? "iforce" : "aldi" })
      );
      dispatch(fetchClientList({ page: 1, limit: 10 }));
      onChangePagination(10000);
    }
  }, [currentUser]);

  useEffect(() => {
    setUserdata(usersData);
    if (usersData && usersData.length) {
      setPaginationCount(PaginationFunc(totalUser));
    }
  }, [usersData]);

  useEffect(() => {
    getUserData();
  }, [usersData, clientData]);
  const getUserData = async () => {
    if (usersData?.length && clientData?.length) {
      // let dataList = [] as any;
      let dataList = await usersData.map((item: any) => {
        return {
          ...item,
          roleName: `${clientData[0].code}:${item?.role?.code || ""} ${
            item?.role?.name || ""
          }`,
        };
      });
      dataList = _.sortBy(dataList, ["roleName", "username"]);
      setUserDataList(dataList);
    } else {
      setUserDataList([]);
    }
  };
  const fetchData = async () => {
    const result: any = await dispatch(
      fetchUsersExport({
        type: currentUser?.role?.iforce_user ? "iforce" : "aldi",
      }) as any
    );
    if (result?.payload?.data && result.payload.data.length > 0) {
      let resultData: any = [];
      result.payload.data.map((item: any) => {
        resultData.push({
          first_name: item.first_name,
          last_name: item.last_name,
          username: item.username,
          user_role: `${item.role?.code}: ${item.role?.name}`,
          client: item.client,
          client_user_administrator: item.role?.user_admin ? "Yes" : "No",
          client_user_role: item.role?.user_role ? "Yes" : "No",
          iForce_user_administrator: item.role?.iforce_user ? "Yes" : "No",
          active: item.active ? "Yes" : "No",
          lock: item.lock ? "Yes" : "No",
        });
      });
      resultData = _.sortBy(resultData, ["user_role", "username"]);
      setCsvData(resultData);
      csvLink?.current?.link?.click();
    }
  };

  const onDelete = (id?: string) => {
    if (id) {
      setSelectAction(id);
    }
    setShowDeleteModal(true);
  };

  const onRestPassword = () => {
    setShowRestPasswordModal(true);
  };

  const onDeleteHandle = (id?: string) => {
    if (id) {
      const data = { id } as IDProps;
      dispatch(deleteUser(data));
    } else if (selectAction) {
      const data = { id: selectAction } as IDProps;
      dispatch(deleteUser(data));
      setShowDeleteModal(false);
    } else {
      const data = { ids: selectedRows.join() } as IDProps;
      dispatch(deleteUser(data));
      setShowDeleteModal(false);
    }
    setSelectAction("");
  };

  const usersColumns: any = [
    {
      title: "First Name",
      sorter: (a: any, b: any) => a.first_name.localeCompare(b.first_name),
      ...getColumnSearchProps(
        "first_name",
        searchInputRef,
        { searchText, setSearchText },
        { searchedColumn, setSearchedColumn }
      ),
      dataIndex: "first_name",
      key: "first_name",
      render: (item: string, recode: any) => {
        return <span className="text-left">{item}</span>;
      },
      width: 140,
    },
    {
      title: "Last Name",
      sorter: (a: any, b: any) => a.last_name.localeCompare(b.last_name),
      ...getColumnSearchProps(
        "last_name",
        searchInputRef,
        { searchText, setSearchText },
        { searchedColumn, setSearchedColumn }
      ),
      dataIndex: "last_name",
      key: "last_name",
      render: (item: string, recode: any) => {
        return <span className="text-left">{item}</span>;
      },
      width: 140,
    },
    {
      title: "Username",
      sorter: (a: any, b: any) => a.username.localeCompare(b.username),
      ...getColumnSearchProps(
        "username",
        searchInputRef,
        { searchText, setSearchText },
        { searchedColumn, setSearchedColumn }
      ),
      showSorterTooltip: false,
      dataIndex: "username",
      key: "username",
      render: (item: string, recode: any) => {
        return <span className="text-left">{item}</span>;
      },
    },
    {
      title: "User Role",
      sorter: (a: any, b: any) => a.roleName.localeCompare(b.roleName),
      // sorter: (a: any, b: any) => a.role.name.localeCompare(b.role.name),
      ...getColumnSearchProps(
        "roleName",
        searchInputRef,
        { searchText, setSearchText },
        { searchedColumn, setSearchedColumn }
        // "name"
      ),
      showSorterTooltip: false,
      dataIndex: "roleName",
      key: "roleName",
    },
    {
      title: "Client",
      showSorterTooltip: false,
      dataIndex: "client",
      key: "client",
      width: 60,
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
      title: "Client User Administrator",
      showSorterTooltip: false,
      dataIndex: "role",
      key: "client_user_administrator",
      width: 120,
      align: "center",
      render: (item: any) => {
        return <span>{item && item.user_admin ? "Yes" : "No"}</span>;
      },
    },
    {
      title: "Client User Role",
      showSorterTooltip: false,
      dataIndex: "role",
      key: "client_user_role",
      width: 120,
      align: "center",
      render: (item: any, recode: any) => {
        return <span>{item && item.user_role ? "Yes" : "No"}</span>;
      },
    },
    {
      title: "iForce User Role",
      showSorterTooltip: false,
      dataIndex: "role",
      key: "iForce_user_administrator",
      width: 120,
      align: "center",
      render: (item: any, recode: any) => {
        return <span>{item && item.iforce_user ? "Yes" : "No"}</span>;
      },
    },
    {
      title: "Active",
      showSorterTooltip: false,
      dataIndex: "active",
      key: "active",
      width: 84,
      align: "center",
      render: (item: string, recode: any) => {
        return <span className="text-left">{item ? "Yes" : "No"}</span>;
      },
    },
    {
      title: "Locked",
      showSorterTooltip: false,
      dataIndex: "lock",
      key: "lock",
      width: 84,
      align: "center",
      render: (item: string, recode: any) => {
        return <span className="text-left">{item ? "Yes" : "No"}</span>;
      },
    },
    {
      title: () => (
        <span
          style={{ color: theme?.lightGray }}
          className="text-xsm tracking-xl-wide"
        >
          Action
        </span>
      ),
      width: 70,
      align: "right",
      dataIndex: "_id",
      key: "_id",
      render: (item: string, recode: any) => {
        return (
          <span className="flex w-full justify-end" style={{ height: 20 }}>
            <ActionBtn
              onEdit={() => setShowEdit(item)}
              onRestPassword={() => onRestPassword()}
              onDelete={() => onDelete(item)}
              disabled={CUDDisabled}
              disabledDelete={!(!recode.active && recode.lock)}
            />
          </span>
        );
      },
    },
  ];

  const onSelectChange = (selectedRowKeys: string[], item: any) => {
    console.log("dataForPdf", item);
    if (selectedRowKeys.length > 0) {
      setSelectedRows(selectedRowKeys);
      setSelectedRowsData(item);
    } else {
      setSelectedRows([]);
      setSelectedRowsData([]);
    }
  };

  const onChangePagination = (e: any) => {
    dispatch(updateUsersPaginationEntityCount({ limit: e }));
    dispatch(
      fetchUsers({
        page: 1,
        limit: e,
        type: currentUser?.role?.iforce_user ? "iforce" : "aldi",
      })
    );
    setPage(e);
  };

  if (show) {
    return (
      <UserDashboard>
        <SetUpUser onCancel={() => setShow(false)} />
      </UserDashboard>
    );
  }

  const makeHeaders = (label: string, key: string) => {
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
        [label]: "iForce User Role",
        [key]: "iForce_user_administrator",
      },
      { [label]: "Active", [key]: "active" },
      { [label]: "Locked", [key]: "lock" },
    ];
    return headers;
  };

  const handleScroll = (place: string) => {
    let table = document.querySelector("div.ant-table-body");
    if (!table) {
      return;
    }

    let scrollTop = table.scrollTop;

    if (place == "up") {
      table.scrollTop = scrollTop -= 20;
    } else if (place == "down") {
      table.scrollTop = scrollTop += 20;
    }
  };

  const CUDDisabled = checkingDisableOfAppButton(currentUser, "create", [
    "Set Up & Control",
    "User Administration",
    "Manage Users",
  ]);

  return (
    <>
      <UserDashboard>
        {!showView && !showEdit ? (
          <>
            {/* <AllUsersFilterBar
                onChangeText={(e) => onSearch(e)}
                onSearchByStatus={(e) => onSearchBystatus(e)}
              /> */}
            {/* <CreateBtn title="Create User" onClick={() => setShow(true)} /> */}
            <AppButton
              className="xsm:w-28 xsm:h-9 lg:w-30 lg:h-10 font-bold tracking-wide mt-5 "
              style={{
                borderRadius: "4px",
                position: "absolute",
                top: 0,
                right: 280,
              }}
              onClick={() => setShow(true)}
              disabled={CUDDisabled || exportLoader}
              loading={exportLoader}
              title="Create User"
            />
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
              disabled={exportLoader}
              loading={exportLoader}
            />
            <AppButton
              className="xsm:w-28 xsm:h-9 lg:w-30 lg:h-10 font-bold tracking-wide mt-5 "
              style={{
                borderRadius: "4px",
                position: "absolute",
                top: 0,
                right: 10,
              }}
              onClick={() => fetchData()}
              title="Export"
              disabled={exportLoader}
              loading={exportLoader}
            />
            <CSVLink
              data={csvData}
              headers={makeHeaders("label", "key")}
              filename={"manage-users.csv"}
              ref={csvLink}
            />

            <div style={{ display: "flex", flexDirection: "row" }}>
              <div style={{ flex: 2, marginLeft: 8 }}>
                <ActionBar
                  onCloseActionBar={() => setSelectedRows([])}
                  activeActionBar={selectedRows.length > 0 ? true : false}
                  onRestPassword={onRestPassword}
                  dltPress={() => onDelete()}
                  data={selectedRowsData}
                />
              </div>
            </div>
            <div className="z-0 scroll-page" id="users-table">
              <div
                className={`${styles.printTableContainer}`}
                ref={tableToPrint}
              >
                <div className={`${styles.tableHeader}`}>
                  <div className={`${styles.showOnPrint}`}>
                    <FormLabel>{moment().format("DD/MM/YYYY HH:mm")}</FormLabel>
                  </div>
                  <Row>
                    <Col md="12" style={{ textAlign: "center" }}>
                      <Row>
                        <Title level={3} className="mb-0">
                          Manage Users
                        </Title>
                      </Row>
                    </Col>
                  </Row>
                </div>
                <div className={`${styles.printWidth}`}>
                  <UserTable
                    rowSelection={false}
                    columns={usersColumns}
                    dataSource={isSearch ? userDataSearch : userDataList}
                    loading={loading}
                    pagination={false}
                    scroll={scroll}
                  />
                </div>
              </div>
            </div>

            {/* Delete Modal Open */}
            <AppModal
              primaryBtnTitle="Delete"
              showModal={showDeleteModal}
              onCloseModal={setShowDeleteModal}
              icon={<DeleteIconInModal />}
              onPrimaryHandle={() => onDeleteHandle()}
            >
              <h1
                style={{ color: theme?.monoLabel }}
                className="text-center text-xmd"
              >
                Delete User
              </h1>
              <p
                style={{ color: theme?.mono }}
                className="mt-3 mb-3 text-center max-w-19 px-1 text-xsm leading-5"
              >
                Are you sure you want to delete this user?
              </p>
            </AppModal>
            {/* Delete Modal Open */}

            {/* Reset Password Modal Open */}
            <AppModal
              primaryBtnColor={theme?.primary}
              primaryBtnTitle="Reset"
              showModal={showRestPasswordModal}
              onCloseModal={setShowRestPasswordModal}
              icon={<EmailConfirmationIcon />}
            >
              <h1
                style={{ color: theme?.monoLabel }}
                className="text-center text-xmd"
              >
                Reset Password
              </h1>
              <p
                style={{ color: theme?.mono }}
                className="mt-2 text-center max-w-19 px-1 text-xsm leading-5 mb-8"
              >
                A reset password link would be sent to user(s) email address.
              </p>
            </AppModal>
            {/* Reset Password Modal Close */}
          </>
        ) : (
          <EditUser userId={showEdit} onCancel={() => setShowEdit("")} />
        )}

        <ClearModal
          text={"Warning: All SKU's will be cleared from the List"}
          show={showConfirmModal}
          onHide={() => console.log("Hide")}
          onConfirm={() => console.log("Confirm")}
        />
      </UserDashboard>
    </>
  );
};

export default Users;
