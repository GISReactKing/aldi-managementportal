import { Form, InputGroup, Row } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { Modal, Alert } from "react-bootstrap";
import styles from "./loginModal.module.scss";
import { RootStateOrAny, useDispatch, useSelector } from "react-redux";
import { IUser, signinUsers } from "../../redux/slices/usersSlice";
import { useRouter } from "next/router";
import isBoolean from "lodash/isBoolean";
import isUndefined from "lodash/isUndefined";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Spin, Typography, Button } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import IncorrectPasswordModal from "./IncorrectPasswordModal";
import useTheme from "../../hooks/useTheme";

const { Text } = Typography;

interface ILoginModal {
  show: boolean;
  onHide: () => void;
  showForgot: boolean;
  onHideForgot: () => void;
  setShowForgotPassword: (b: boolean) => void;
  setShowChangePassword: (b: boolean) => void;
}

type userProps = {
  username: string;
  password: string;
};

const defaultState = {
  username: "",
  password: "",
};

const LoginModal = ({
  show,
  onHide,
  setShowForgotPassword,
  setShowChangePassword,
  showForgot,
  onHideForgot,
}: ILoginModal) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const theme = useTheme();
  const antIcon = (
    <LoadingOutlined style={{ fontSize: 16, color: theme?.white }} spin />
  );
  const [user, setUser] = useState<userProps>({
    username: "",
    password: "",
  });
  const [validated, setValidated] = useState(false);
  const [passwordShown, setPasswordShown] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [incorrectPasswordTime, setIncorrectPasswordTime] = useState(0);

  const currentUser: IUser = useSelector(
    ({ users }: RootStateOrAny) => users.currentUser
  );

  useEffect(() => {
    const canLogin =
      currentUser?.isTemporaryPasswordReset ||
      isUndefined(currentUser?.isTemporaryPasswordReset);

    if (currentUser && canLogin) {
      router.push("/home");
      onHide();
    }
    setLoggingIn(false);
  }, [currentUser]);

  const handleSubmit = async (event: any) => {
    setLoggingIn(true);
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();

    if (form.checkValidity()) {
      const result: any = await dispatch(signinUsers(user) as any);

      if (result?.payload?.code && result.payload.code == 401) {
        setIncorrectPasswordTime(incorrectPasswordTime + 1);
        setAuthError(result.payload.message);
        setLoggingIn(false);
        // setShowChangePassword(true);
        return;
      }

      if (
        isBoolean(result?.payload?.isTemporaryPasswordReset) &&
        !result?.payload?.isTemporaryPasswordReset
      ) {
        setShowChangePassword(true);
        setLoggingIn(false);
        onHide();
        return;
      }

      setUser(defaultState);
    }

    // setValidated(true);
  };

  const onHideIncorrectPasswordModal = () => {
    setIncorrectPasswordTime(0);
    setAuthError(null);
    setUser({
      username: "",
      password: "",
    });
  };

  const userValidated = () => {
    if (
      user.username
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        ) &&
      user.password
      // user.password.match(/^(?=.*[a-z])/) &&
      // user.password.match(/^(?=.*[A-Z])/) &&
      // user.password.match(/^(?=.*[0-9])/) &&
      // user.password.match(/^(?=.*[!@#\$%\^&\*<>])/)
    ) {
      return true;
    }
    return false;
  };

  return incorrectPasswordTime < 3 ? (
    <Modal
      show={show}
      onHide={onHide}
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
          <div>Enter your details to login.</div>
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
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                className={styles.formItem}
                name="username"
                placeholder="Enter Email Address"
                value={user.username}
                onChange={({ target }) => {
                  setUser({ ...user, [target.name]: target.value });
                  setAuthError(null);
                }}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please Enter Email Address.
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row className={styles.fieldsRow}>
            <Form.Group>
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
                  Please Enter Password
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
          </Row>
          <Row className={styles.fieldsRow}>
            <Form.Group
              controlId="formBasicCheckbox"
              className="mb-3 mt-2 d-flex justify-between align-right"
            >
              <span></span>
              {/* <Form.Check type="checkbox" label="Remember Me" /> */}
              <Text
                className={styles.forgotButton}
                onClick={() => {
                  setShowForgotPassword(true);
                  onHide();
                }}
              >
                Change or Forgot Password
              </Text>
            </Form.Group>
          </Row>
          <Row className={styles.loginBtnWrapper}>
            <button
              className={styles.loginBtn}
              type="submit"
              disabled={!userValidated()}
              style={{
                opacity: !userValidated() ? 0.5 : 1,
                cursor: !userValidated() ? "not-allowed" : "pointer",
              }}
            >
              Login
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
        <div className={styles.contactsInfo}>
          {/* <p>
            For inquiry or complaint, please contact iforce customer service{" "}
            <span className={styles.link}>here</span>.
          </p> */}
        </div>
      </Modal.Body>
    </Modal>
  ) : (
    <IncorrectPasswordModal
      text="Please click the link for Change or Forgot Password"
      show={incorrectPasswordTime >= 3}
      onHide={onHideIncorrectPasswordModal}
    />
  );
};

export default LoginModal;
