/** @format */

import { useState, useEffect, useRef } from "react";
import UserDashboard from "../../../components/UserDashboard";
import { RootStateOrAny, useSelector } from "react-redux";
import RolesAndPermissionsTable from "../../../components/Tables/RolesAndPermissionsTable";
import CreateRole from "./CreateRole";
import EditRole from "./edit-role";
import { useDispatch } from "react-redux";
import {
  fetchRolesAndPermission,
  deleteRolesAndPermission,
  fetchRolesAndPermissionExport,
  updateRolesPaginationEntityCount,
} from "../../../redux/slices/newRolesAndPermissionSlice";
import { useRouter } from "next/router";
import { DeleteIconInModal } from "../../../components/Icons";
import AppModal from "../../../components/Modal";
import { CSVLink } from "react-csv";

import { PaginationFunc } from "../../../utils/PaginationFunc";
import { AppButton } from "../../../components/AppButton";
import { checkingDisableOfAppButton } from "../../../utils/CheckingStatus";
import { useReactToPrint } from "react-to-print";
import { FormLabel } from "react-bootstrap";
import { Col, Row, Typography } from "antd";
import moment from "moment";
import styles from "./role-and-permissions.module.scss";
import {
  getColumnSearchProps,
  getColumnDateSearchProps,
} from "../../../utils/TableColumnFilter";
import useTheme from "../../../hooks/useTheme";

const { Title } = Typography;

interface Props {}

type IDProps = {
  id?: string;
  ids?: string;
};

const Users = ({}: Props): JSX.Element => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const router = useRouter();
  const csvLink = useRef() as any;

  const [show, setShow] = useState<string>("");
  const [roleName, setRoleName] = useState<string>("");
  const [roleType, setRoleType] = useState<string>("ALL");
  const [roleAndPermission, setRoleAndPermission] = useState([]) as any;
  const [isSearch, setIsSearch] = useState(false) as any;
  const [paginationCount, setPaginationCount] = useState([]) as any;
  const [rolesAndPermissions, setRolesAndPermissions] = useState([]) as any;
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [rowId, setRowId] = useState<any>("");
  const [page, setPage] = useState(1) as any;
  const [csvData, setCsvData] = useState<any>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [searchedColumn, setSearchedColumn] = useState<string>("");
  const scroll = {
    // y: "calc(100vh - 360px)",
    // x: "max-content",
  };

  const searchInputRef = useRef() as any;
  const tableToPrint = useRef() as any;
  const handlePrint = useReactToPrint({
    content: () => tableToPrint.current,
  });

  const loading = useSelector(
    ({ newRolesAndPermissions }: RootStateOrAny) =>
      newRolesAndPermissions.loader
  );

  const paginationEntityCount = useSelector(
    ({ newRolesAndPermissions }: RootStateOrAny) =>
      newRolesAndPermissions.paginationEntityCount
  );

  const permissionData = useSelector(
    ({ newRolesAndPermissions }: RootStateOrAny) =>
      newRolesAndPermissions.rolesAndPermissions
  );

  const totalPermission = useSelector(
    ({ newRolesAndPermissions }: RootStateOrAny) =>
      newRolesAndPermissions.totalRole
  );

  const currentUser = useSelector(
    ({ users }: RootStateOrAny) => users.currentUser
  );

  useEffect(() => {
    dispatch(
      fetchRolesAndPermission({
        page,
        limit: paginationEntityCount,
        type: currentUser?.role?.iforce_user ? "iforce" : "aldi",
      })
    );
    onChangePagination(10000);
  }, []);

  useEffect(() => {
    setRolesAndPermissions(permissionData);
    if (permissionData && permissionData.length) {
      setPaginationCount(PaginationFunc(totalPermission));
    }
  }, [permissionData]);

  const fetchData = async () => {
    const result: any = await dispatch(
      fetchRolesAndPermissionExport({
        type: currentUser?.role?.iforce_user ? "iforce" : "aldi",
      })
    );
    console.log({ result });
    if (result?.payload?.data && result.payload.data.length > 0) {
      const sortedResult = result.payload.data.sort(
        (a: { name: string }, b: { name: string }) =>
          a.name.localeCompare(b.name)
      );
      setCsvData(sortedResult);
      csvLink?.current?.link?.click();
    }
  };

  const onDeleteHandle = () => {
    let id = rowId;
    const data = { id } as IDProps;
    dispatch(deleteRolesAndPermission(data));
    setShowDeleteModal(false);
    setRowId("");
  };

  const onChangePagination = (e: any) => {
    dispatch(updateRolesPaginationEntityCount({ limit: e }));
    dispatch(
      fetchRolesAndPermission({
        page: 1,
        limit: e,
        type: currentUser?.role?.iforce_user ? "iforce" : "aldi",
      })
    );
  };

  const showModal = (id: any) => {
    setShowDeleteModal(true);
    setRowId(id);
    console.log(id);
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

  const makeHeaders = (label: string, key: string) => {
    const headers: any = [
      { [label]: "Role Name", [key]: "name" },
      { [label]: "Client User Role", [key]: "user_role" },
      { [label]: "Client User Administration", [key]: "user_admin" },
      { [label]: "Menu Options", [key]: "permissions" },
      { [label]: "Users", [key]: "user" },
      { [label]: "Date Created", [key]: "created_on" },
      { [label]: "Active", [key]: "active" },
    ];
    return headers;
  };

  const getcsvData = () => {
    return csvData;
  };

  const CUDDisabled = checkingDisableOfAppButton(currentUser, "create", [
    "Set Up & Control",
    "User Administration",
    "Roles & Permissions",
  ]);

  return (
    <UserDashboard>
      {!show ? (
        <>
          {/* <CreateBtn title="Create Role" onClick={() => setShow('create')} /> */}
          <AppButton
            title="Create Role"
            className="xsm:w-28 xsm:h-9 lg:w-30 lg:h-10 font-bold tracking-wide mt-5 "
            style={{
              borderRadius: "4px",
              position: "absolute",
              top: 0,
              right: 280,
            }}
            onClick={() => setShow("create")}
            disabled={CUDDisabled}
          />
          <AppButton
            title="Print"
            className="xsm:w-28 xsm:h-9 lg:w-30 lg:h-10 font-bold tracking-wide mt-5 "
            style={{
              borderRadius: "4px",
              position: "absolute",
              top: 0,
              right: 145,
            }}
            onClick={() => handlePrint()}
          />
          <AppButton
            title="Export"
            className="xsm:w-28 xsm:h-9 lg:w-30 lg:h-10 font-bold tracking-wide mt-5 "
            style={{
              borderRadius: "4px",
              position: "absolute",
              top: 0,
              right: 10,
            }}
            onClick={() => fetchData()}
          />
          <CSVLink
            data={csvData}
            headers={makeHeaders("label", "key")}
            filename={"roles-&-permissions.csv"}
            ref={csvLink}
          />
          <div className="z-0 scroll-page" id="role-permission-table">
            <div className={`${styles.printTableContainer}`} ref={tableToPrint}>
              <div className={`${styles.tableHeader}`}>
                <div className={`${styles.showOnPrint}`}>
                  <FormLabel>{moment().format("DD/MM/YYYY HH:mm")}</FormLabel>
                </div>
                <Row>
                  <Col md="12" style={{ textAlign: "center" }}>
                    <Row>
                      <Title level={3} className="mb-0">
                        Role & Permissions
                      </Title>
                    </Row>
                  </Col>
                </Row>
              </div>
              <div className={`${styles.printWidth}`}>
                <RolesAndPermissionsTable
                  dataSource={
                    isSearch ? roleAndPermission : rolesAndPermissions
                  }
                  onDelete={(id: string) => showModal(id)}
                  onEdit={(id: string) => setShow(id)}
                  loading={loading}
                  pagination={false}
                  scroll={scroll}
                  actionDisabled={CUDDisabled}
                  getColumnSearchProps={(name: string) =>
                    getColumnSearchProps(
                      name,
                      searchInputRef,
                      { searchText, setSearchText },
                      { searchedColumn, setSearchedColumn }
                    )
                  }
                  getColumnDateSearchProps={(name: string) =>
                    getColumnDateSearchProps(
                      name,
                      searchInputRef,
                      { searchText, setSearchText },
                      { searchedColumn, setSearchedColumn }
                    )
                  }
                />
              </div>
            </div>
          </div>
        </>
      ) : show === "create" ? (
        <CreateRole onCancel={() => setShow("")} />
      ) : (
        <EditRole onCancel={() => setShow("")} _id={show} />
      )}

      {/* Delete Modal Open */}
      <AppModal
        primaryBtnTitle="Delete"
        showModal={showDeleteModal}
        onCloseModal={() => {
          setShowDeleteModal(false);
          setRowId("");
        }}
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
    </UserDashboard>
  );
};

export default Users;
