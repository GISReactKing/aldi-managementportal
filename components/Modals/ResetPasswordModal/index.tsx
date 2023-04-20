import { Form, Row } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import styles from "./index.module.scss";
import { RootStateOrAny, useDispatch, useSelector } from "react-redux";
import { clearPasswordResetMessage } from "../../../redux/slices/usersSlice";
import { Message } from "../../../utils/message";

interface IResetPasswordConfirmModal {
  show: boolean;
  onHide: () => void;
}

const ResetPasswordConfirmModal = ({
  show,
  onHide,
}: IResetPasswordConfirmModal) => {
  const dispatch = useDispatch();

  const passwordResetMessage: string[] = useSelector(
    ({ users }: RootStateOrAny) => users.passwordResetMessage
  );

  const navigateBackToLogin = () => {
    onHide();
    dispatch(clearPasswordResetMessage());
  };

  const handleSubmit = async (event: any) => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    navigateBackToLogin();
  };

  return (
    <>
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
            <div>Password Change Confirmation</div>
          </div>
          <Form
            className={styles.formWrapper}
            noValidate
            onSubmit={handleSubmit}
          >
            <Row className={styles.fieldsRow}>
              {/* <Form.Label className=" text-center"> */}
              {passwordResetMessage?.map((item) => {
                return (
                  <p className=" mb-3" key={item}>
                    {item}
                  </p>
                );
              })}
              {/* </Form.Label> */}
            </Row>
            <Row className={styles.loginBtnWrapper}>
              <button className={styles.submitBtn} type="submit">
                Ok
              </button>
            </Row>
          </Form>
          <div className={styles.contactsInfo}></div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ResetPasswordConfirmModal;
