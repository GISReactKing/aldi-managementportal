/** @format */

import React from "react";
import { Layout, Typography } from "antd";
import { Form, Row, Col } from "react-bootstrap";
import Link from "next/link";
import styles from "./sign-in.module.scss";
import ReturnPortalContainer from "../../../components/ReturnPortalContainer";
import { useRouter } from "next/router";
import useTheme from "../../../hooks/useTheme";

const { Content } = Layout;
const { Text } = Typography;

interface Props {}

const SignIn = ({}: Props): JSX.Element => {
  const router = useRouter();
  const theme = useTheme();

  const onClick = (path: string) => {
    router.push(path);
  };

  return (
    <>
      <ReturnPortalContainer
        btnText1={"Need Help?"}
        btnText2={"Get Started"}
        btnOnClick1={() => console.log("btnOnClick2")}
        btnOnClick2={() => console.log("btnOnClick2")}
      >
        <Layout>
          <Content style={{ backgroundColor: theme?.white }}>
            <div
              className="site-layout-background"
              style={{ textAlign: "center", lineHeight: "20px" }}
            >
              <Text style={{ backgroundColor: theme?.white }}>
                To make a return, simply tell us your email and delivery post
                code, then click Start to select your Order No.:
              </Text>
            </div>

            <Row className={styles.formRow}>
              <Col md={3} />
              <Form.Label className={styles.formLabel} column lg={2}>
                Email Address:
              </Form.Label>
              <Col md={3}>
                <Form.Control
                  className={`${styles.formItem} ${styles.formValue}`}
                  value={"test@test.com"}
                  type="email"
                  name="email"
                  onChange={({ target }) => {}}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please enter email address.
                </Form.Control.Feedback>
              </Col>
              <Col md={3} />
            </Row>
            <Row className={styles.formRow}>
              <Col md={3} />
              <Form.Label className={styles.formLabel} column lg={2}>
                Delivery Post code:
              </Form.Label>
              <Col md={2}>
                <Form.Control
                  className={`${styles.formItem} ${styles.formValue}`}
                  value={"ASASASASASAS"}
                  type="delivery_post_code"
                  name="delivery_post_code"
                  onChange={({ target }) => {}}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please enter Delivery Post code.
                </Form.Control.Feedback>
              </Col>
              <Col md={4} />
            </Row>
            <Row className={styles.formRow}>
              <Col md={3} />
              <Form.Label className={styles.formLabel} column lg={2}>
                Order No:
              </Form.Label>
              <Col md={2}>
                <Form.Control
                  className={`${styles.formItem} ${styles.formValue}`}
                  value={"3245423"}
                  type="order_no"
                  name="order_no"
                  onChange={({ target }) => {}}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please enter Order No.
                </Form.Control.Feedback>
              </Col>
              <Col md={4} />
            </Row>
            <div className={styles.buttonsGroup}>
              <button className={styles.cancelButton} onClick={() => {}}>
                Exit
              </button>
              <button
                className={styles.confirmButton}
                style={{ marginLeft: "40px" }}
                // onClick={() => setActiveStep(2)}
                type="submit"
              >
                Confirm
              </button>
            </div>

            <div
              className="site-layout-background"
              style={{
                backgroundColor: theme?.white,
                lineHeight: "20px",
                textAlign: "center",
              }}
            >
              <Text style={{ backgroundColor: theme?.white }}>
                If you have experienced a problem with your return and wish
                speak to someone about a possible replacement,
              </Text>
            </div>
            <div
              className="site-layout-background"
              style={{
                backgroundColor: theme?.white,
                lineHeight: "20px",
                textAlign: "center",
              }}
            >
              <Text style={{ backgroundColor: theme?.white }}>
                please contact Aldi Customer Services
                <Link href={"/"}> here</Link>
              </Text>
            </div>
          </Content>
        </Layout>
      </ReturnPortalContainer>
    </>
  );
};

export default SignIn;
