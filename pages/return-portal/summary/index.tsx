/** @format */
import React from "react";
import ReturnPortalContainer from "../../../components/ReturnPortalContainer";
import { Layout, Typography } from "antd";
import styles from "./Summary.module.scss";
import { useRouter } from "next/router";
import useTheme from "../../../hooks/useTheme";

const { Content } = Layout;
const { Title, Text, Link } = Typography;

interface Props {}

const Summary = ({}: Props): JSX.Element => {
  const theme = useTheme();
  const router = useRouter();

  const onClick = (path: string) => {
    router.push(path);
  };

  return (
    <ReturnPortalContainer
      btnText1={"Download"}
      btnText2={"Close X"}
      btnOnClick1={() => console.log("btnOnClick2")}
      btnOnClick2={() => console.log("btnOnClick2")}
    >
      <Content style={{ backgroundColor: theme?.white }}>
        <div
          style={{
            marginTop: 40,
            paddingLeft: 120,
            marginRight: 120,
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <Title
            style={{
              marginBottom: -4,
              color: theme?.successBorder,
              textAlign: "center",
            }}
            level={2}
          >
            Return Completed
          </Title>
          <Text style={{ textAlign: "center", marginTop: 16 }}>
            <span className="font-bold">Return Reference ID: </span>
            001234 28/10/2021
          </Text>
          <Text style={{ textAlign: "center", marginTop: 16 }}>
            We will update you via email on the progress of your returns and
            refund.
          </Text>
          <Text style={{ textAlign: "center" }}>Thank You</Text>

          <div className={styles.bodyContainer}>
            <div className={styles.rightContainer}>
              <ul>
                <li className={`${styles.liItem} font-bold`}>
                  Customer Information:
                </li>
                <li className={styles.liItem}>John Jones</li>
                <li className={styles.liItem}>
                  Delivery Address: 99 New Road, Birmigham, B109YZ
                </li>
                <li className={styles.liItem}>
                  <Link href="https://ant.design" target="_blank">
                    customername@gamil.com
                  </Link>
                </li>
                <li className={styles.liItem}>(44) 076 541 2331</li>
              </ul>

              <div className={styles.itemContainer}>
                <Text
                  style={{
                    marginTop: 40,
                    marginBottom: 24,
                    fontWeight: "bold",
                  }}
                >
                  Small Items
                </Text>
                <div className={styles.borderView}>
                  <Text style={{}}>
                    We have emailed a QR Code to you. Please show this when you
                    drop your item at the post office.
                  </Text>
                  <Text style={{ color: "blue" }}>
                    Post office address: 99 New Road, Birmigham, B109YZ
                  </Text>
                </div>
              </div>

              <div className={styles.itemContainer}>
                <Text
                  style={{
                    marginTop: 32,
                    marginBottom: 24,
                    fontWeight: "bold",
                  }}
                >
                  Large or Heavy Items
                </Text>
                <div className={styles.borderView}>
                  <Text style={{}}>
                    Our Customer Service advisor would contact you soon to
                    arrange a convenient collection date.
                  </Text>
                </div>
              </div>
            </div>

            <div className={styles.leftContainer}>
              <ul>
                <li className={`${styles.liItemLeft} font-bold`}>
                  Order Information:
                </li>
                <li className={styles.liItemLeft}>Order No: 5123457</li>
                <li className={styles.liItemLeft}>Order Date: 01/12/2021</li>
                <li className={styles.liItemLeft}>(44) 076 541 2331</li>
              </ul>
            </div>
          </div>
        </div>
      </Content>
    </ReturnPortalContainer>
  );
};

export default Summary;
