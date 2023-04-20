import { Form, InputGroup, Row } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { Modal, Alert } from "react-bootstrap";
import styles from "./changePasswordModal.module.scss";
import { RootStateOrAny, useDispatch, useSelector } from "react-redux";
import { IUser, changeUserPassword } from "../../redux/slices/usersSlice";
import { useRouter } from "next/router";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Spin, Typography, Button } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import isEqual from "lodash/isEqual";
import useTheme from "../../hooks/useTheme";

const { Text } = Typography;

interface IChangePasswordModal {
  show: boolean;
  onHide: () => void;
}

type userProps = {
  password: string;
  confirmPassword: string;
};

const defaultState = {
  password: "",
  confirmPassword: "",
};

const passwordFields: userProps = {
  password: "password",
  confirmPassword: "confirmPassword",
};

const ChangePasswordModal = ({ show, onHide }: IChangePasswordModal) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const router = useRouter();
  const antIcon = (
    <LoadingOutlined style={{ fontSize: 16, color: theme?.white }} spin />
  );
  const [user, setUser] = useState<userProps>({
    password: "",
    confirmPassword: "",
  });

  const [validated, setValidated] = useState(false);
  const [passwordShown, setPasswordShown] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [formIsNotValid, setFormIsNotValid] = useState(true);
  const [currentInputTarget, setCurrentInputTarget] = useState("");

  const currentUser: IUser = useSelector(
    ({ users }: RootStateOrAny) => users.currentUser
  );

  const validateForm = (userObj: any, target: any) => {
    if (!userObj.password.match(/^(?=.*[a-z])/)) {
      setPasswordErrorMessage("Password must have one lower case");
      return setFormIsNotValid(true);
    }
    if (!userObj.password.match(/^(?=.*[A-Z])/)) {
      setPasswordErrorMessage("Password must have one upper case");
      return setFormIsNotValid(true);
    }
    if (!userObj.password.match(/^(?=.*[0-9])/)) {
      setPasswordErrorMessage("Password must have one numeric");
      return setFormIsNotValid(true);
    }
    if (!userObj.password.match(/^(?=.*[!@#\$%\^&\*])/)) {
      setPasswordErrorMessage("Password must have one special character");
      return setFormIsNotValid(true);
    }

    setPasswordErrorMessage("");

    return setFormIsNotValid(false);
  };

  useEffect(() => {
    // checking if passwords match
    if (
      currentInputTarget === passwordFields.confirmPassword ||
      (user.confirmPassword && user.password)
    ) {
      if (!isEqual(user.password, user.confirmPassword)) {
        setPasswordErrorMessage("Passwords do not match");
        setFormIsNotValid(true);
      }
    }
  }, [user.confirmPassword, user.password]);

  useEffect(() => {
    setPasswordErrorMessage("");
  }, []);

  const handleChange = ({ target }: any) => {
    let userObj = null;

    if (target.name === passwordFields.confirmPassword) {
      setCurrentInputTarget(target.name);
      userObj = { ...user, [target.name]: target.value };
    }
    if (target.name === passwordFields.password) {
      setCurrentInputTarget(target.name);
      userObj = { ...user, [target.name]: target.value };
    }

    if (!userObj) {
      return;
    }

    setUser(userObj);

    validateForm(userObj, target);
  };

  const handleCloseModal = () => {
    onHide();
    setUser(defaultState);
    setPasswordErrorMessage("");
  };

  const handleSubmit = async (event: any) => {
    setLoggingIn(true);
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();

    if (form.checkValidity()) {
      if (!isEqual(user.password, user.confirmPassword)) {
        setPasswordErrorMessage("Passwords do not match");
        setFormIsNotValid(true);
        setCurrentInputTarget(passwordFields.confirmPassword);
        return;
      }

      const resetPassword = {
        id: currentUser?._id,
        password: user.confirmPassword,
      };

      const result: any = await dispatch(
        changeUserPassword(resetPassword) as any
      );
      if (result?.payload?.code && result.payload.code == 401) {
        setAuthError(result.payload.message);
        setLoggingIn(false);
      }
    }
    setValidated(true);
    setLoggingIn(false);
    setFormIsNotValid(false);
    setPasswordErrorMessage("");
    setCurrentInputTarget("");
    onHide();
    setUser(defaultState);
  };

  const userValidated = () => {
    if (
      user.password &&
      // user.password.match(/^(?=.*[a-z])/) &&
      // user.password.match(/^(?=.*[A-Z])/) &&
      // user.password.match(/^(?=.*[0-9])/) &&
      // user.password.match(/^(?=.*[!@#\$%\^&\*<>])/) &&
      user.password === user.confirmPassword
    ) {
      return true;
    }
    return false;
  };

  return (
    <Modal
      show={show}
      onHide={() => handleCloseModal()}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className={styles.modalContent}
    >
      <Modal.Header closeButton className={styles.loginModalHeader}>
        <div className={styles.logoContent}>
          <img width="91" alt="logo" src="assets/img/iforceLogo.png" />
        </div>
      </Modal.Header>
      <Modal.Body className={styles.loginModalBody}>
        <div className={styles.titleWrapper}>
          <div className={styles.title}>Management Portal Login</div>
          <div>
            First time logging in! Please change the default password to one you
            can easily remember.
          </div>
        </div>
        {authError && (
          <Alert variant={"danger"} className="mt-3">
            {authError}
          </Alert>
        )}
        <Form
          className={styles.formWrapper}
          noValidate
          validated={validated}
          onSubmit={handleSubmit}
        >
          <Row className={styles.fieldsRow}>
            <Form.Group>
              <Form.Label>Password</Form.Label>
              <InputGroup>
                <Form.Control
                  className={styles.formItem}
                  name="password"
                  placeholder="Enter Password"
                  type={passwordShown ? "text" : "password"}
                  value={user.password}
                  style={{ borderRight: "none" }}
                  onChange={({ target }) => {
                    setUser({ ...user, [target.name]: target.value });
                    setAuthError(null);
                    handleChange({ target });
                  }}
                  required
                />
                <InputGroup.Text
                  style={{ backgroundColor: "transparent", borderLeft: "none" }}
                >
                  <FontAwesomeIcon
                    style={{ cursor: "pointer" }}
                    //@ts-ignore
                    icon={passwordShown ? faEyeSlash : faEye}
                    onClick={() => {
                      setPasswordShown(!passwordShown);
                    }}
                  />
                </InputGroup.Text>
                <Form.Control.Feedback type="invalid">
                  Please Enter Confirm Password
                </Form.Control.Feedback>
              </InputGroup>
              <Form.Control.Feedback type="invalid">
                Please Enter Password.
              </Form.Control.Feedback>
            </Form.Group>
            {formIsNotValid &&
              currentInputTarget === passwordFields.password && (
                <small className="text-danger">{passwordErrorMessage}</small>
              )}
          </Row>
          <Row className={styles.fieldsRow}>
            <Form.Group>
              <Form.Label>Confirm Password</Form.Label>

              <InputGroup>
                <Form.Control
                  className={styles.formItem}
                  name="confirmPassword"
                  placeholder="Enter Confirm Password"
                  type={passwordShown ? "text" : "password"}
                  value={user.confirmPassword}
                  style={{ borderRight: "none" }}
                  onChange={({ target }) => {
                    setUser({ ...user, [target.name]: target.value });
                    setAuthError(null);
                    handleChange({ target });
                  }}
                  required
                />
                <InputGroup.Text
                  style={{ backgroundColor: "transparent", borderLeft: "none" }}
                >
                  <FontAwesomeIcon
                    style={{ cursor: "pointer" }}
                    //@ts-ignore
                    icon={passwordShown ? faEyeSlash : faEye}
                    onClick={() => {
                      setPasswordShown(!passwordShown);
                    }}
                  />
                </InputGroup.Text>
                <Form.Control.Feedback type="invalid">
                  Please Enter Confirm Password
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
            {formIsNotValid &&
              currentInputTarget === passwordFields.confirmPassword && (
                <small className="text-danger">{passwordErrorMessage}</small>
              )}
          </Row>
          <Row className={styles.loginBtnWrapper}>
            <button
              className={styles.loginBtn}
              type="submit"
              disabled={!userValidated() || formIsNotValid}
              style={{
                opacity: !userValidated() ? 0.5 : 1,
                cursor: !userValidated() ? "not-allowed" : "pointer",
              }}
            >
              Change
              {!authError && loggingIn && (
                <Spin
                  className="login-spinner"
                  size="small"
                  indicator={antIcon}
                  style={{
                    marginTop: "-4px",
                    marginLeft: 15,
                    position: "absolute",
                  }}
                />
              )}
            </button>
          </Row>
        </Form>
        <div className={styles.contactsInfo}></div>
      </Modal.Body>
    </Modal>
  );
};

export default ChangePasswordModal;
