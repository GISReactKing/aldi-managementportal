import { Form, Row } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import styles from "./index.module.scss";
import { RootStateOrAny, useDispatch, useSelector } from "react-redux";
import {
  changeResetUserPassword,
  clearPasswordResetMessage,
} from "../../redux/slices/usersSlice";
import { Message } from "../../utils/message";

interface IForgotPasswordModal {
  show: boolean;
  onHide: () => void;
  showForgotPassword: (value: boolean) => void;
}

const ForgotPasswordModal = ({
  show,
  onHide,
  showForgotPassword,
}: IForgotPasswordModal) => {
  const dispatch = useDispatch();

  const [email, setEmail] = useState<string>("");
  const [validated, setValidated] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  const passwordResetMessage: string = useSelector(
    ({ users }: RootStateOrAny) => users.passwordResetMessage
  );

  const navigateBackToLogin = () => {
    onHide();
    setEmail("");
    setShowMessage(false);
    dispatch(clearPasswordResetMessage());
  };

  useEffect(() => {
    if (showMessage) {
      alert(passwordResetMessage);
      navigateBackToLogin();
    }
  }, [showMessage]);

  const handleSubmit = async (event: any) => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    if (form.checkValidity()) {
      try {
        const results = await dispatch(changeResetUserPassword(email) as any);
        if (!(results?.payload?.code === 404)) {
          onHide();
        }
      } catch (err: any) {
        Message(
          "danger",
          err?.message || "Something went wrong! Please try again later."
        );
        showForgotPassword(false);
      }
    }
    setValidated(true);
  };

  const userValidated = () => {
    if (
      email
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
    ) {
      return true;
    }
    return false;
  };
  return (
    <>
      <Modal
        show={show}
        onHide={() => {
          showForgotPassword(false);
        }}
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
            <div>Management Portal Forgot / Change Password</div>
          </div>
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
                  name="email"
                  placeholder="Enter Email Address"
                  value={email}
                  onChange={({ target }) => {
                    setEmail(target.value);
                  }}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please Enter Email Address.
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Row className={styles.loginBtnWrapper}>
              <button
                className={styles.submitBtn}
                type="submit"
                disabled={!userValidated()}
                style={{
                  opacity: !userValidated() ? 0.5 : 1,
                  cursor: !userValidated() ? "not-allowed" : "pointer",
                }}
              >
                Submit
              </button>
            </Row>
          </Form>
          <div className={styles.contactsInfo}></div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ForgotPasswordModal;
