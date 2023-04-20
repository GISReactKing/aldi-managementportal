import React, { useEffect, useState } from "react";
import styles from "./create.module.scss";
import UserDashboard from "../../../components/UserDashboard";
import {
  checkUserName,
  createUsers,
  IUser,
  signinUsers,
} from "../../../redux/slices/usersSlice";
import { Col, Form, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { RootStateOrAny, useDispatch, useSelector } from "react-redux";
import { Checkbox, Button } from "antd";
import {
  fetchRoles,
  fetchUsers,
  fetchUsersExport,
  updateUsersPaginationEntityCount,
} from "../../../redux/slices/usersSlice";
import ClientForm from "../client-list/clientForm";
import { AppButton } from "../../../components/AppButton";
import { toast, ToastContainer } from "react-toastify";
import useTheme from "../../../hooks/useTheme";

interface Props {
  onCancel: () => void;
}

const SetUpUser = ({ onCancel }: Props) => {
  const theme = useTheme();
  const [userRoles, setUserRoles] = useState([]);
  const [passwordShown, setPasswordShown] = useState(false);
  const [validated, setValidated] = useState(false);
  const [formIsNotValid, setFormIsNotValid] = useState(true);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [show, setShow] = useState<boolean>(false);
  const [emailExit, setEmailExit] = useState("");
  const [user, setUser] = useState<IUser>({
    _id: "",
    access_token: "",
    first_name: "",
    last_name: "",
    active: false,
    phone_number: "",
    username: "",
    power_bi_username: "Example Power BI Username",
    domain_username: "Domain Username",
    lock: false,
    client: "",
    created_on: "",
    last_login: "",
    is_login: false,
    password: "",
  });
  const dispatch = useDispatch();

  const paginationEntityCount = useSelector(
    ({ users }: RootStateOrAny) => users.paginationEntityCount
  );

  const usersRoles: IUser[] = useSelector(
    ({ users }: RootStateOrAny) => users.roles
  );

  const currentUser: any = useSelector(
    ({ users }: RootStateOrAny) => users.currentUser
  );

  const clientData = useSelector(
    ({ client }: RootStateOrAny) => client.clientList
  );

  const loader = useSelector(({ users }: RootStateOrAny) => users.loader);

  useEffect(() => {
    if (usersRoles && usersRoles.length) {
      const arr = usersRoles as any;
      setUserRoles(arr);
    }
  }, [usersRoles]);

  useEffect(() => {
    if (!usersRoles.length) {
      dispatch(
        fetchRoles({ type: currentUser?.role?.iforce_user ? "iforce" : "aldi" })
      );
    }
  }, []);

  const notify = (text: string) => toast.error(text);

  const handleSubmit = (event: any) => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    if (form.checkValidity()) {
      const userData: any = {
        ...user,
        email: user.username,
      };

      if (!userData.phone_number) {
        delete userData.phone_number;
      }

      const result: any = dispatch(createUsers(userData) as any);
      result.then((res: any) => {
        if (res.error) {
          notify(res.error.message);
        } else {
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
        }
      });
    }
    // setValidated(true);
  };

  const handleChange = ({ target }: any) => {
    let userObj = null;
    if (target.name === "role") {
      const clientData = userRoles.find(
        (item: any) => item._id === target.value
      ) as any;
      if (clientData && clientData.iforce_user) {
        console.log({ clientData });
        userObj = { ...user, [target.name]: target.value };
        delete userObj.client;
      } else {
        userObj = { ...user, client: "Aldi", [target.name]: target.value };
      }
    } else if (target.name == "active" || target.name == "lock") {
      userObj = { ...user, [target.name]: target.checked, password: "" };
    } else {
      userObj = { ...user, [target.name]: target.value };
    }

    if (target.name === "username") {
      setEmailExit("");
    }

    if (!userObj) {
      return;
    }

    setUser(userObj);

    validateForm(userObj, target);
  };

  const validateForm = (userObj: any, target: any) => {
    if (userObj.phone_number.match(/\D/g)) {
      setUser({
        ...userObj,
        phone_number: target.value.replace(/\D/g, ""),
      });
      return setFormIsNotValid(true);
    }

    if (
      !userObj.first_name ||
      !userObj.last_name ||
      !userObj.username ||
      !userObj.role ||
      (userObj.active && !userObj.password) ||
      !userObj.username
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
    ) {
      return setFormIsNotValid(true);
    }

    if (userObj.active && !userObj.password.match(/^(?=.*[a-z])/)) {
      setPasswordErrorMessage("Password must have one lower case");
      return setFormIsNotValid(true);
    }
    if (userObj.active && !userObj.password.match(/^(?=.*[A-Z])/)) {
      setPasswordErrorMessage("Password must have one upper case");
      return setFormIsNotValid(true);
    }
    if (userObj.active && !userObj.password.match(/^(?=.*[0-9])/)) {
      setPasswordErrorMessage("Password must have one numeric");
      return setFormIsNotValid(true);
    }
    if (userObj.active && !userObj.password.match(/^(?=.*[!@#\$%\^&\*])/)) {
      setPasswordErrorMessage("Password must have one special character");
      return setFormIsNotValid(true);
    }

    setPasswordErrorMessage("");

    if (emailExit) {
      return setFormIsNotValid(true);
    }

    return setFormIsNotValid(false);
  };

  const resetForm = () => {
    setUser({
      _id: "",
      access_token: "",
      first_name: "",
      last_name: "",
      active: false,
      phone_number: "",
      username: "",
      power_bi_username: "",
      domain_username: "",
      lock: false,
      client: "",
      created_on: "",
      last_login: "",
      is_login: false,
      password: "",
    });

    setFormIsNotValid(true);
    setPasswordErrorMessage("");
  };

  const checkEmail = (value: string) => {
    if (
      value
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
    ) {
      checkUserName(value)
        .then((res: any) => {
          setEmailExit(res);
          setFormIsNotValid(true);
        })
        .catch((err) => {
          setEmailExit("");
        });
    }
  };

  return (
    <>
      {!show ? (
        <div>
          <div className={styles.buttonsGroup}>
            <AppButton
              className="xsm:w-28 xsm:h-9 lg:w-30 lg:h-10 font-bold tracking-wide mt-5 border-0 position-absolute top-1 z-50"
              style={{
                borderRadius: "4px",
                right: 280,
              }}
              onClick={onCancel}
              title="Cancel"
              disabled={loader}
              loading={loader}
            />

            <AppButton
              className="xsm:w-28 xsm:h-9 lg:w-30 lg:h-10 font-bold tracking-wide mt-5 border-0 position-absolute top-1 z-50"
              style={{
                borderRadius: "4px",
                right: 145,
              }}
              onClick={resetForm}
              title="Reset"
              disabled={loader}
              loading={loader}
            />

            <AppButton
              className="xsm:w-28 xsm:h-9 lg:w-30 lg:h-10 font-bold tracking-wide mt-5 border-0 position-absolute top-1 z-50"
              style={{
                borderRadius: "4px",
                right: 10,
              }}
              onClick={handleSubmit}
              disabled={formIsNotValid || loader}
              loading={loader}
              title="Save"
            />
          </div>
          <div className={styles.wrapper}>
            <div className={styles.content}>
              {user ? (
                <Form
                  noValidate
                  validated={validated}
                  onSubmit={handleSubmit}
                  autoComplete="off"
                >
                  <Row className={`${styles.createUserFormRow}`}>
                    <Col md={12} className="d-flex align-items-center">
                      <Form.Group className="mr-5" controlId="first_name">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control
                          style={{ width: "500px" }}
                          className={styles.formItem}
                          name="first_name"
                          value={user.first_name}
                          onChange={handleChange}
                          maxLength={40}
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Please enter a first name.
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group className="ml-5 mr-5" controlId="last_name">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control
                          style={{ width: "500px" }}
                          className={styles.formItem}
                          name="last_name"
                          value={user.last_name}
                          onChange={handleChange}
                          maxLength={40}
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Please enter a last name.
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group controlId="active" className="mt-4 ml-5">
                        <Checkbox
                          name="active"
                          checked={user.active}
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
                          style={{ width: "200px" }}
                          className={styles.formItem}
                          value={user.phone_number}
                          name="phone_number"
                          onChange={handleChange}
                          maxLength={18}
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
                          style={{ width: "600px" }}
                          name="role"
                          required
                          onChange={handleChange}
                        >
                          <option value={""} key={-1}>
                            Select Role
                          </option>
                          {userRoles.map((role: any, index: any) => {
                            if (
                              !currentUser?.role?.iforce_user &&
                              role.name.indexOf("Force") != -1
                            ) {
                              return false;
                            }

                            return (
                              <option
                                selected={role["_id"] == user.role}
                                value={role["_id"]}
                                key={index}
                              >
                                {`${
                                  clientData &&
                                  clientData[0] &&
                                  clientData[0].code
                                    ? `${clientData[0].code}:`
                                    : ""
                                }${role.code} ${role.name}`}
                              </option>
                            );
                          })}
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
                        <Form.Control
                          style={{ width: "200px" }}
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
                          style={{ width: "600px" }}
                          className={styles.formItem}
                          value={user.username}
                          name="username"
                          onChange={(e) => {
                            handleChange(e);
                            checkEmail(e.target.value);
                          }}
                          maxLength={50}
                          required
                          // onBlur={checkEmail}
                        />
                        <Form.Control.Feedback type="invalid">
                          Please enter a email.
                        </Form.Control.Feedback>
                        {emailExit ? (
                          <p className="text-danger">
                            <small>{emailExit}</small>
                          </p>
                        ) : (
                          ""
                        )}
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row className={`${styles.createUserFormRow}`}>
                    <Col md={12} className="d-flex align-items-center">
                      <Form.Group className="mr-5" controlId="password">
                        <Form.Label>Password</Form.Label>
                        <div style={{ width: "300px", position: "relative" }}>
                          <Form.Control
                            style={{
                              width: "300px",
                              cursor: !user.active ? "not-allowed" : "auto",
                            }}
                            className={styles.formItem}
                            value={user.password}
                            type={passwordShown ? "text" : "password"}
                            name="password"
                            onInput={handleChange}
                            autoComplete={"new-password"}
                            maxLength={20}
                            required
                            disabled={!user.active}
                          />
                          <FontAwesomeIcon
                            //@ts-ignore
                            icon={passwordShown ? faEyeSlash : faEye}
                            className={styles.passwordViewer}
                            onClick={() => {
                              setPasswordShown(!passwordShown);
                            }}
                          />
                        </div>
                        <small className="text-danger">
                          {passwordErrorMessage}
                        </small>
                        <Form.Control.Feedback type="invalid">
                          Please enter password.
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group
                        as={Col}
                        controlId="lock"
                        className="mt-4 ml-5"
                      >
                        <Checkbox
                          name="lock"
                          checked={user.lock}
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
          <ToastContainer
            position="top-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </div>
      ) : (
        <ClientForm
          onCancel={() => setShow(false)}
          user={user}
          setUser={setUser}
        />
      )}

      {/* <PermissionsModal show={show} onHide={() => setShow(false)} userRoleId={selectedUserRoleId} /> */}
      {/* <PermissionsModalNew
                show={show}
                onHide={() => setShow(false)}
                userRoleId={selectedUserRoleId} /> */}
    </>
  );
};

export default SetUpUser;
