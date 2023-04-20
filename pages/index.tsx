/** @format */

import { NextPage } from "next";
import React, { Fragment, useEffect, useState } from "react";
import styles from "./home.module.scss";
import LoginModal from "../components/LoginModal";
import ForgotPasswordModal from "../components/ForgotPasswordModal";
import { fetchCurrentUsers } from "../redux/slices/usersSlice";
import { useDispatch } from "react-redux";

import SuperAdmin from "../components/SuperAdmin";

import ChangePasswordModal from "../components/ChangePasswordModal";
import ResetPasswordConfirmModal from "../components/Modals/ResetPasswordModal";
import { initializeTheme } from "../redux/slices/themeSlice";
import { ConfigProvider } from "antd";
import useTheme from "../hooks/useTheme";

const Home: NextPage = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const [show, setShow] = useState<boolean>(false);
  const [showChangePassword, setShowChangePassword] = useState<boolean>(false);
  const [showForgotPassword, setShowForgotPassword] = useState<boolean>(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);

  useEffect(() => {
    dispatch(initializeTheme());
    ConfigProvider.config({
      theme: {
        primaryColor: theme.primary,
      },
    });
    dispatch(fetchCurrentUsers());
  }, []);

  return (
    <div>
      <LoginModal
        show={show}
        onHide={() => setShow(false)}
        showForgot={showForgotPassword}
        setShowForgotPassword={setShowForgotPassword}
        setShowChangePassword={setShowChangePassword}
        onHideForgot={() => setShowForgotPassword(false)}
      />
      <ChangePasswordModal
        show={showChangePassword}
        onHide={() => setShowChangePassword(false)}
      />
      <ForgotPasswordModal
        show={showForgotPassword}
        onHide={() => {
          setShowForgotPassword(false);
          setShowResetPasswordModal(true);
        }}
        showForgotPassword={setShowForgotPassword}
      />
      <ResetPasswordConfirmModal
        show={showResetPasswordModal}
        onHide={() => {
          setShowResetPasswordModal(false);
          setShow(true);
        }}
      />
      <Fragment>
        {/* <div className="header-top h-10 pt-4">
          <div
            className="align-content-end bottom-12 flex justify-center float-end"
            style={{ paddingBottom: 8 }}
          >
            <SuperAdmin onlyIcon={false} />
          </div>
          <div className="container">
            <img alt="Logo image" src="/logo.png" width="56px" height="64px" />
          </div>
        </div> */}
      </Fragment>
      <div className={styles.content}>
        <div className={`container ${styles.contentChildDiv}`}>
          <img className={styles.logoImage} alt="Logo" src="/logo.png" />
          <div className={styles.heading}>Management Portal</div>
          <button className={styles.mainBtn} onClick={() => setShow(true)}>
            <b>Login</b>
          </button>
        </div>
      </div>
      <div className={styles.bottomBorder} />
    </div>
  );
};

export default Home;
