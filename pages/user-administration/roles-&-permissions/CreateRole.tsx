/** @format */
import { ArrowLeftOutlined } from "@ant-design/icons";
import PermissionMatrixTable from "../../../components/Tables/PermissionMatrixTable";
import React, { useEffect, useState } from "react";
import styles from "../roles-&-permissions/role-and-permissions.module.scss";
import stylesCreate from "../set-up-user/create.module.scss";
import { Col, Form as FormBootstrap, Row } from "react-bootstrap";
import { RootStateOrAny, useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
// import { fetchRoles } from "../../../redux/slices/usersSlice";
import {
  createRolesAndPermission,
  updateRolesAndPermission,
  fetchAllRoles,
  checkRoleNameCode,
} from "../../../redux/slices/newRolesAndPermissionSlice";
import { Form } from "react-bootstrap";
import { Button } from "antd";
import { AppButton } from "../../../components/AppButton";
import { checkingDisableOfAppButton } from "../../../utils/CheckingStatus";

import { ToastContainer, toast } from "react-toastify";
import { isEmpty } from "lodash";
import useTheme from "../../../hooks/useTheme";
interface Props {
  onCancel: () => void;
  _id?: string;
}

const CreateRole = ({ onCancel, _id }: Props): JSX.Element => {
  const dispatch = useDispatch();
  const router = useRouter();
  const theme = useTheme();

  const [isEditPage, setIsEditPage] = useState<boolean>(false);
  const [rolesAndPermissionClicked, setRolesAndPermissionClicked] =
    useState<boolean>(false);

  const [rolesAndPermissionData, setRolesAndPermissionData] = useState({});
  const [rolesAndPermissionDataForLoad, setRolesAndPermissionDataForLoad] =
    useState({});
  const [roleType, setRoleType] = useState<string>("Aldi");
  const [roleName, setRoleName] = useState<string>("");
  const [roleCode, setRoleCode] = useState<string>("");
  const [editUser, setEditUser] = useState<any>({});
  const [userExists, setUserExists] = useState<boolean>(false);
  const [enableCreateRoleButton, setEnableCreateRoleButton] =
    useState<boolean>(false);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [isIForce, setIsIForce] = useState<boolean>(false);
  const [isAdministrator, setIsAdministrator] = useState<boolean>(false);
  const [isRole, setIsRole] = useState<boolean>(false);
  const [noChanges, setNoChanges] = useState(true);
  const [wasClicked, setWasClicked] = useState<string>("");
  const [roleCodeExist, setRoleCodeExist] = useState<string>("");
  const [roleNameExist, setRoleNameExist] = useState<string>("");

  const roleAndPermissions: any = useSelector(
    ({ newRolesAndPermissions }: RootStateOrAny) =>
      newRolesAndPermissions.rolesAndPermissions
  );

  const usersRoles: any = useSelector(
    ({ newRolesAndPermissions }: RootStateOrAny) =>
      newRolesAndPermissions.allRoles
  );

  const currentUser: any = useSelector(
    ({ users }: RootStateOrAny) => users.currentUser
  );

  const ruleNameExist = async (rolename: string) => {
    return await usersRoles.find((item: any) => item.name === rolename);
  };

  useEffect(() => {
    dispatch(fetchAllRoles());
  }, []);

  useEffect(() => {
    if (_id) {
      setIsEditPage(true);
      getData();
    }
  }, [_id]);

  useEffect(() => {
    checkStatusForSaveButton(rolesAndPermissionData);
  }, [roleName]);

  const notify = (text: string) => toast.error(text);

  const getData = () => {
    if (roleAndPermissions && roleAndPermissions.length) {
      const id = _id;
      const roleAndPermissionsObj = roleAndPermissions.find(
        (item: any) => item._id === id
      ) as any;
      setEditUser(roleAndPermissionsObj);
      setRoleName(roleAndPermissionsObj.name);
      setRoleType(roleAndPermissionsObj.role_type);
      setRoleCode(roleAndPermissionsObj.code);
      setIsActive(roleAndPermissionsObj.active);
      setIsIForce(roleAndPermissionsObj.iforce_user);
      setIsAdministrator(roleAndPermissionsObj.user_admin);
      setIsRole(roleAndPermissionsObj.user_role);
      setRolesAndPermissionDataForLoad(roleAndPermissionsObj.permissions);
      checkStatusForSaveButton(roleAndPermissionsObj.permissions);
      if (roleAndPermissionsObj.iforce_user) {
        setRoleType("");
      }
      if (roleAndPermissionsObj?.user?.length) {
        setUserExists(true);
      }
    }
  };

  const checkStatusForSaveButton = (data: any) => {
    if (!isRole && !isAdministrator && !isIForce) {
      setEnableCreateRoleButton(false);
      return;
    }

    for (let i = 0; i < Object.keys(data).length; i++) {
      const name1 = Object.keys(data)[i];
      if (typeof data[name1] === "boolean" && data[name1] && roleName) {
        setEnableCreateRoleButton(true);
        return;
      }

      const obj2 = data[name1];
      if (obj2) {
        for (let j = 0; j < Object.keys(obj2).length; j++) {
          const name2 = Object.keys(obj2)[j];
          if (typeof obj2[name2] === "boolean" && obj2[name2] && roleName) {
            setEnableCreateRoleButton(true);
            return;
          }

          const obj3 = obj2[name2];
          if (obj3) {
            for (let k = 0; k < Object.keys(obj3).length; k++) {
              const name3 = Object.keys(obj3)[k];
              if (typeof obj3[name3] === "boolean" && obj3[name3] && roleName) {
                setEnableCreateRoleButton(true);
                return;
              }

              const obj4 = obj3[name3];
              if (obj4) {
                for (let l = 0; l < Object.keys(obj4).length; l++) {
                  const name4 = Object.keys(obj4)[l];
                  if (
                    typeof obj4[name4] === "boolean" &&
                    obj4[name4] &&
                    roleName
                  ) {
                    setEnableCreateRoleButton(true);
                    return;
                  }
                }
              }
            }
          }
        }
      }
    }

    setEnableCreateRoleButton(false);
  };

  const onSubmit = async () => {
    // if (!enableCreateRoleButton || !roleName) {
    //   return;
    // }

    const ruleNameAlreadyExist = await ruleNameExist(roleName);

    if (isEditPage || !ruleNameAlreadyExist) {
      const data = {
        name: roleName,
        code: roleCode,
        active: isActive,
        iforce_user: isIForce,
        user_admin: isAdministrator,
        user_role: isRole,
        permissions:
          rolesAndPermissionClicked || isAdministrator
            ? rolesAndPermissionData
            : rolesAndPermissionDataForLoad,
        creator: currentUser ? currentUser._id : "6199ff3ba19f334325693568",
        client: "61bb315c214495861b2998ed",
      };

      if (isEditPage) {
        dispatch(
          updateRolesAndPermission({
            ...data,
            id: editUser._id,
            creator: editUser.creator,
          })
        );
        onCancel();
      } else {
        dispatch(createRolesAndPermission(data));
        onCancel();
      }

      // router.push("/user-administration/roles-and-permissions")
    } else {
      notify("Role name already exist");
    }
  };

  const checkset = () => {
    if (isRole && isAdministrator) {
      return false;
    } else if (isRole) {
      return true;
    } else if (isIForce) {
      return true;
    } else {
      return false;
    }
  };

  // validations
  const roleValidation = isIForce || isRole || isAdministrator;
  const allValidation = roleValidation && roleCode.length === 4;
  const rolesAndPermissionDataValidate = rolesAndPermissionClicked
    ? !enableCreateRoleButton
    : false;

  const checkRoleAndCode = (data: any) => {
    if (!editUser.name) {
      if (roleName && roleCode) {
        const { code, name } = data || {};
        const obj = {
          name: name ? name : roleName,
          code: code ? code : roleCode,
        };
        checkRoleNameCode(obj)
          .then((res: any) => {
            setRoleNameExist(res);
          })
          .catch((err) => {
            setRoleNameExist("");
          });
      }
    } else {
      if (roleName && roleCode) {
        const { code, name } = data || {};
        const obj = {
          name: name ? name : roleName,
          code: code ? code : roleCode,
        };
        if (
          obj.name.toUpperCase() === editUser.name.toUpperCase() &&
          obj.code.toUpperCase() === editUser.code.toUpperCase()
        ) {
          setRoleNameExist("");
        } else {
          checkRoleNameCode(obj)
            .then((res: any) => {
              setRoleNameExist(res);
            })
            .catch((err) => {
              setRoleNameExist("");
            });
        }
      }
    }
  };

  return (
    <div className={stylesCreate.wrapper}>
      <div className={stylesCreate.newRolePermissionContainer}>
        {/* <button
          onClick={onCancel}
          className={stylesCreate.cancelButton}
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 20,
            marginBottom: 12,
          }}
        >
          <ArrowLeftOutlined style={{ paddingRight: 12 }} />
          {isEditPage ? "Edit Role" : "Create Role"}
        </button> */}
        <div style={{ display: "flex", flexDirection: "row" }}>
          <div>
            <Row
              className={`${styles.fieldsRow} ${styles.roleFormRow}`}
              style={{ width: 150 }}
            >
              <FormBootstrap.Group as={Col} controlId="role_code">
                <FormBootstrap.Label>User Role Code</FormBootstrap.Label>
                <FormBootstrap.Control
                  className={styles.formItem}
                  name="role_code"
                  value={roleCode}
                  onChange={({ target }) => {
                    setRoleCode(target.value);
                    setNoChanges(false);
                    checkRoleAndCode({ code: target.value });
                  }}
                  required
                  style={{ width: 66 }}
                  maxLength={4}
                  disabled={isEditPage}
                />
                <FormBootstrap.Control.Feedback type="invalid">
                  Please enter a role code.
                </FormBootstrap.Control.Feedback>
              </FormBootstrap.Group>
            </Row>
          </div>
          <div>
            <Row
              className={`${styles.fieldsRow} ${styles.roleFormRow}`}
              style={{ width: 538 }}
            >
              <FormBootstrap.Group as={Col} controlId="role_name">
                <FormBootstrap.Label>User Role Name</FormBootstrap.Label>
                <FormBootstrap.Control
                  className={styles.formItem}
                  name="role_name"
                  value={roleName}
                  onChange={({ target }) => {
                    setRoleName(target.value);
                    setNoChanges(false);
                    checkRoleAndCode({ name: target.value });
                  }}
                  required
                  maxLength={50}
                  isInvalid={roleNameExist ? true : false}
                />
                <FormBootstrap.Control.Feedback type="invalid">
                  {roleNameExist ? roleNameExist : "Please enter a role name."}
                </FormBootstrap.Control.Feedback>
              </FormBootstrap.Group>
            </Row>
            <Row
              className={`${styles.fieldsRow} ${styles.roleFormRow}`}
              style={{ width: 538 }}
            >
              <FormBootstrap.Group as={Col} controlId="role_type">
                <FormBootstrap.Label>Associated Client</FormBootstrap.Label>
                <FormBootstrap.Control
                  className={styles.formItem}
                  name="role_type"
                  value={roleType}
                  onChange={({ target }) => {
                    setRoleType(target.value);
                    setNoChanges(false);
                  }}
                  required
                  disabled
                />
                <FormBootstrap.Control.Feedback type="invalid">
                  Please enter an Associated Client.
                </FormBootstrap.Control.Feedback>
              </FormBootstrap.Group>
              {/* <FormBootstrap.Group as={Col} controlId="role_type">
                <FormBootstrap.Label>Associated Client</FormBootstrap.Label>
                <FormBootstrap.Select
                  className={styles.formItem}
                  name="role_type"
                  value={roleType}
                  onChange={({ target }) => {
                    setRoleType(target.value)
                  }}
                  required
                >
                  <option value="Super Admin">Super Admin</option>
                  <option value="Admin">Admin</option>
                </FormBootstrap.Select>
                <FormBootstrap.Control.Feedback type="invalid">
                  Please select role type.
                </FormBootstrap.Control.Feedback>
              </FormBootstrap.Group> */}
            </Row>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              width: "20vw",
              justifyContent: "center",
              marginTop: 24,
            }}
          >
            <span style={{ paddingRight: 18 }}>Active: </span>
            <Form.Check
              type="checkbox"
              checked={isActive}
              defaultChecked={isActive}
              onChange={() => {
                if (!userExists) {
                  setNoChanges(false);
                  setIsActive(!isActive);
                }
              }}
            />
          </div>
          <div
            style={{ width: "20vw", justifyContent: "center", marginTop: 24 }}
          >
            {currentUser?.role?.iforce_user ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  paddingBottom: 8,
                }}
              >
                <span style={{ paddingRight: 18, width: 200 }}>
                  iForce User Role:{" "}
                </span>
                <Form.Check
                  type="checkbox"
                  defaultChecked={isIForce}
                  checked={isIForce}
                  onChange={(e) => {
                    if (!userExists) {
                      setNoChanges(false);
                      setIsIForce(e.target.checked);
                      setRoleType(e.target.checked ? "" : "Aldi");
                      setWasClicked("isIForce");
                    }
                  }}
                  disabled={isRole}
                />
              </div>
            ) : null}
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                paddingBottom: 8,
              }}
            >
              <span style={{ paddingRight: 18, width: 200 }}>
                Client User Administrator:{" "}
              </span>
              <Form.Check
                type="checkbox"
                defaultChecked={isAdministrator}
                checked={isAdministrator}
                onChange={(e) => {
                  if (!userExists) {
                    setIsRole(e.target.checked);
                    setIsAdministrator(e.target.checked);
                    setNoChanges(false);
                    setWasClicked("isAdministrator");
                  }
                }}
                disabled={checkset()}
              />
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "row",
                paddingBottom: 8,
              }}
            >
              <span style={{ paddingRight: 18, width: 200 }}>
                Client User Role:{" "}
              </span>
              <Form.Check
                type="checkbox"
                defaultChecked={isRole}
                checked={isRole}
                onChange={(e) => {
                  if (!userExists) {
                    setNoChanges(false);
                    setIsRole(isAdministrator ? true : e.target.checked);
                    setIsRole(e.target.checked);
                  }
                }}
                disabled={isIForce || isAdministrator}
              />
            </div>
          </div>
        </div>
        <>
          <div className="mt-2" style={{ width: 850 }}>
            <PermissionMatrixTable
              loadData={rolesAndPermissionDataForLoad}
              setRolesAndPermissionData={setRolesAndPermissionData}
              checkStatusForSaveButton={checkStatusForSaveButton}
              setRolesAndPermissionClicked={setRolesAndPermissionClicked}
              isAdministrator={isAdministrator}
              isRole={isRole}
              isIForce={isIForce}
              wasClicked={wasClicked}
              setWasClicked={setWasClicked}
              setNoChanges={setNoChanges}
              roleValidation={roleValidation}
            />
          </div>
        </>
        <div className={stylesCreate.buttonsGroup}>
          <AppButton
            className="xsm:w-28 xsm:h-9 lg:w-30 lg:h-10 font-bold tracking-wide mt-5 border-0 position-absolute top-1 right-40 z-50"
            title="Cancel"
            style={{
              borderRadius: "4px",
            }}
            onClick={onCancel}
          />
          <AppButton
            className="xsm:w-28 xsm:h-9 lg:w-30 lg:h-10 font-bold tracking-wide mt-5 border-0 position-absolute top-1 right-4 z-50"
            title={isEditPage ? "Save" : "Create Role"}
            style={{
              borderRadius: "4px",
              whiteSpace: "nowrap",
            }}
            onClick={onSubmit}
            disabled={
              isEditPage
                ? noChanges ||
                  !allValidation ||
                  rolesAndPermissionDataValidate ||
                  roleNameExist
                  ? true
                  : false
                : !enableCreateRoleButton || !allValidation || roleNameExist
                ? true
                : false
            }
          />
        </div>
      </div>
    </div>
  );
};

export default CreateRole;
