import React, { useEffect, useRef } from "react";
import styles from "./editUser.module.scss";
import { useState } from "react";
import {
  IUser,
  updateUser,
  fetchRoles,
  fetchUsers,
  fetchUsersExport,
  updateUsersPaginationEntityCount,
} from "../../../redux/slices/usersSlice";
import { useRouter } from "next/router";
import { RootStateOrAny, useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { Col, Form, Row } from "react-bootstrap";
import { Checkbox } from "antd";
import ClientForm from "../client-list/clientForm";
import { AppButton } from "../../../components/AppButton";
import ClearModal from "../../../components/Modals/ProductFixedRoutingDespatch/ClearModal";

interface Props {
  userId?: string;
  onCancel: () => void;
}

const EditUser = ({ userId, onCancel }: Props): JSX.Element => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [formIsNotValid, setFormIsNotValid] = useState(false);
  const [show, setShow] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(true);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [roleID, setRoleID] = useState<string>("");
  const [clientObj, setClientObj] = useState<any>({});
  const usersData: IUser[] = useSelector(
    ({ users }: RootStateOrAny) => users.usersData
  );

  const [user, setUser] = useState<IUser>({
    _id: "",
    access_token: "",
    first_name: "",
    last_name: "",
    active: true,
    phone_number: "",
    username: "",
    power_bi_username: "Power Bi Username",
    domain_username: "Domain User",
    lock: true,
    password: "",
    client: "",
  });

  const [userRoles, setUserRoles] = useState([]);
  const [validated, setValidated] = useState(false);
  const [noChanges, setNoChanges] = useState(true);

  const paginationEntityCount = useSelector(
    ({ users }: RootStateOrAny) => users.paginationEntityCount
  );

  const currentUser = useSelector(
    ({ users }: RootStateOrAny) => users.currentUser
  );

  const usersRoles: IUser[] = useSelector(
    ({ users }: RootStateOrAny) => users.roles
  );

  const loader = useSelector(({ users }: RootStateOrAny) => users.loader);

  const clientData = useSelector(
    ({ client }: RootStateOrAny) => client.clientList
  );

  useEffect(() => {
    if (usersRoles && usersRoles.length) {
      const arr = usersRoles as any;
      setUserRoles(arr);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      getData();
    }
  }, [userId]);

  const getData = () => {
    if (usersData && usersData.length) {
      // const id = router.query.uid
      const userObj = usersData.find((item) => item._id === userId) as any;
      setRoleID(userObj?.role?._id || userObj.role);
      setUser(userObj);
    }
  };

  const onSave = async () => {
    let userObj = {
      ...user,
      id: user._id,
    };

    if (typeof user.role == "object") {
      userObj = {
        ...userObj,
        role: userObj.role,
      };
    }

    if (!userObj.phone_number) {
      delete userObj.phone_number;
    }

    await dispatch(updateUser(userObj) as any);
    dispatch(updateUsersPaginationEntityCount({ limit: 10000 }));
    dispatch(
      fetchUsersExport({
        type: currentUser?.role?.iforce_user ? "iforce" : "aldi",
      }) as any
    );
    dispatch(
      fetchUsers({
        page: 1,
        limit: paginationEntityCount,
        type: currentUser?.role?.iforce_user ? "iforce" : "aldi",
      })
    );
    dispatch(
      fetchRoles({
        type: currentUser?.role?.iforce_user ? "iforce" : "aldi",
      })
    );
    onCancel();
  };

  const handleChange = ({ target }: any) => {
    setNoChanges(false);
    let userObj = null;
    if (target.name === "role") {
      const clientData = userRoles.find(
        (item: any) => item._id === target.value
      ) as any;
      if (clientData && clientData.iforce_user) {
        if (user.client === "Aldi") {
          setClientObj({ name: target.name, value: target.value });
          setShowConfirmModal(true);
          console.log({ ["Role ID"]: target.value });
        } else {
          setRoleID(target.value);
          userObj = { ...user, [target.name]: target.value };
          delete userObj.client;
        }
      } else {
        setRoleID(target.value);
        userObj = { ...user, client: "Aldi", [target.name]: target.value };
      }
    } else if (target.name == "active" || target.name == "lock") {
      userObj = { ...user, [target.name]: target.checked };
    } else {
      userObj = { ...user, [target.name]: target.value };
    }

    if (!userObj) {
      return;
    }

    setUser(userObj);

    validateForm(userObj, target);
  };

  const onConfirm = () => {
    let userObj = { ...user, [clientObj.name]: clientObj.value };
    delete userObj.client;
    setRoleID(clientObj.value);
    setUser(userObj);
    validateForm(userObj, clientObj);
    setShowConfirmModal(false);
    setClientObj({});
  };

  const onCancelModal = () => {
    setRoleID(user.role?._id || "");
    setShowConfirmModal(false);
    setClientObj({});
  };

  const validateForm = (userObj: any, target: any) => {
    if (
      !userObj.first_name ||
      !userObj.last_name ||
      !userObj.username ||
      !userObj.role ||
      !userObj.username
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
    ) {
      return setFormIsNotValid(true);
    }

    if (userObj.phone_number && userObj.phone_number.match(/\D/g)) {
      setUser({
        ...userObj,
        phone_number: target.value.replace(/\D/g, ""),
      });
      return setFormIsNotValid(true);
    }

    return setFormIsNotValid(false);
  };

  const undoChanges = () => {
    setNoChanges(true);
    getData();
  };

  return (
    <>
      {!show ? (
        <div className={styles.wrapper}>
          <div className={styles.content}>
            {/* <button onClick={onCancel} style={{ display: 'flex', alignItems: 'center', fontSize: 20, }}>
                            <ArrowLeftOutlined style={{ paddingRight: 12 }} />
                            {'Edit User'}
                        </button> */}
            <div className={styles.header}>
              <div className={styles.buttonsGroup}>
                <AppButton
                  className="xsm:w-28 xsm:h-9 lg:w-30 lg:h-10 font-bold tracking-wide mt-5 position-absolute top-1 z-50"
                  onClick={() => setIsEdit(!isEdit)}
                  style={{
                    right: 145,
                  }}
                  title="Edit"
                  loading={loader}
                  disabled={loader}
                />

                <AppButton
                  className="xsm:w-28 xsm:h-9 lg:w-30 lg:h-10 font-bold tracking-wide mt-5 position-absolute top-1 z-50"
                  onClick={undoChanges}
                  disabled={noChanges || loader}
                  style={{
                    right: 280,
                  }}
                  title="Reset"
                  loading={loader}
                />

                <AppButton
                  className="xsm:w-28 xsm:h-9 lg:w-30 lg:h-10 font-bold tracking-wide mt-5 position-absolute top-1 z-50"
                  onClick={onCancel}
                  style={{
                    right: 415,
                  }}
                  title="Cancel"
                  loading={loader}
                  disabled={loader}
                />

                <AppButton
                  className="xsm:w-28 xsm:h-9 lg:w-30 lg:h-10 font-bold tracking-wide mt-5 position-absolute top-1 z-50"
                  style={{
                    right: 10,
                  }}
                  onClick={onSave}
                  disabled={formIsNotValid || noChanges || loader}
                  loading={loader}
                  title="Save"
                />
              </div>
            </div>

            {user ? (
              <Form noValidate validated={validated} onSubmit={onSave}>
                <Row className={`${styles.createUserFormRow}`}>
                  <Col md={12} className="d-flex align-items-center">
                    <Form.Group className="mr-5" controlId="first_name">
                      <Form.Label>First Name</Form.Label>
                      <Form.Control
                        style={{
                          width: "500px",
                          cursor: isEdit ? "not-allowed" : "auto",
                        }}
                        className={styles.formItem}
                        name="first_name"
                        value={user.first_name}
                        onChange={handleChange}
                        maxLength={40}
                        required
                        disabled={isEdit}
                      />
                      <Form.Control.Feedback type="invalid">
                        Please enter a first name.
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="ml-5 mr-5" controlId="last_name">
                      <Form.Label>Last Name</Form.Label>
                      <Form.Control
                        style={{
                          width: "500px",
                          cursor: isEdit ? "not-allowed" : "auto",
                        }}
                        className={styles.formItem}
                        name="last_name"
                        value={user.last_name}
                        onChange={handleChange}
                        maxLength={40}
                        required
                        disabled={isEdit}
                      />
                      <Form.Control.Feedback type="invalid">
                        Please enter a last name.
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="active" className="mt-4 ml-5">
                      <Checkbox
                        name="active"
                        checked={user.active}
                        disabled={isEdit}
                        onChange={handleChange}
                      >
                        Active
                      </Checkbox>
                    </Form.Group>
                  </Col>
                </Row>
                <Row className={`${styles.createUserFormRow}`}>
                  <Col md={12}>
                    <Form.Group controlId="phone_number">
                      <Form.Label>Phone Number</Form.Label>
                      <Form.Control
                        style={{
                          width: "200px",
                          cursor: isEdit ? "not-allowed" : "auto",
                        }}
                        className={styles.formItem}
                        value={user.phone_number}
                        name="phone_number"
                        onChange={handleChange}
                        maxLength={18}
                        disabled={isEdit}
                      />
                      <Form.Control.Feedback type="invalid">
                        Please enter phone number.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                <Row className={`${styles.createUserFormRow}`}>
                  <Col md={12} className="d-flex">
                    <Form.Group
                      className="mr-5 "
                      controlId="role"
                      style={{ alignSelf: "start" }}
                    >
                      <Form.Label>User Role</Form.Label>
                      <Form.Select
                        style={{
                          width: "600px",

                          cursor:
                            isEdit || currentUser._id === userId
                              ? "not-allowed"
                              : "auto",
                        }}
                        name="role"
                        required
                        disabled={isEdit || currentUser._id === userId}
                        onChange={handleChange}
                        value={roleID}
                      >
                        <option value={""} key={-1}>
                          Select Role
                        </option>
                        {userRoles.map((role: any, index: any) => (
                          <option value={role["_id"]} key={index}>
                            {`${
                              clientData && clientData[0] && clientData[0].code
                                ? `${clientData[0].code}:`
                                : ""
                            }${role.code} ${role.name}`}
                          </option>
                        ))}
                      </Form.Select>

                      <Form.Control.Feedback type="invalid">
                        Please select user role.
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group
                      className="ml-5"
                      controlId="client"
                      style={{ alignSelf: "end" }}
                    >
                      <Form.Label>Client</Form.Label>
                      {/* <Form.Control
                                            style={{width: '300px'}}
                                            className={styles.formItem}
                                            value={user.client}
                                            name="client"
                                            onChange={handleChange}
                                            maxLength={50}
                                            placeholder='Select Client'
                                            disabled={true}
                                            required
                                        /> */}
                      <Form.Control
                        style={{
                          width: "200px",

                          cursor: isEdit ? "not-allowed" : "auto",
                        }}
                        className={styles.formItem}
                        value={""}
                        name="client"
                        onChange={handleChange}
                        maxLength={50}
                        placeholder={user.client}
                        required
                        disabled={true}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row className={`${styles.createUserFormRow}`}>
                  <Col md={12}>
                    <Form.Group as={Col} controlId="username">
                      <Form.Label>Email Address (Username)</Form.Label>
                      <Form.Control
                        style={{
                          width: "600px",
                          cursor: "not-allowed",
                        }}
                        className={styles.formItem}
                        value={user.username}
                        name="username"
                        onChange={handleChange}
                        maxLength={50}
                        required
                        disabled={true}
                      />
                      <Form.Control.Feedback type="invalid">
                        Please enter a email.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                <Row className={`${styles.createUserFormRow}`}>
                  <Col md={12} className="d-flex align-items-center">
                    <Form.Group as={Col} controlId="lock" className="mt-4">
                      <Checkbox
                        name="lock"
                        checked={user.lock}
                        disabled={isEdit}
                        onChange={handleChange}
                      >
                        User Locked
                      </Checkbox>
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
            ) : null}
          </div>
        </div>
      ) : (
        <ClientForm
          onCancel={() => setShow(false)}
          user={user}
          setUser={setUser}
        />
      )}

      <ClearModal
        text={"Warning: the Client User has been linked to an iForce User Role"}
        show={showConfirmModal}
        onHide={onCancelModal}
        onConfirm={onConfirm}
      />
      {/* <PermissionsModalNew
                show={permissionsModalShow}
                onHide={() => setPermissionsModalShow(false)}
                userRoleId={selectedUserRoleId} /> */}
    </>
  );
};

export default EditUser;
