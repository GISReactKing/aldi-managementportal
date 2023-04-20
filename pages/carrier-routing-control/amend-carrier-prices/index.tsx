import React, { Fragment, useState, useRef } from "react";
import {
  DatePicker,
  AutoComplete,
  Typography,
  Button,
  Checkbox,
  Layout,
  Select,
} from "antd";
import moment from "moment";
import UserDashboard from "../../../components/UserDashboard";
import styles from "./styles.module.scss";
import Multiselect from "multiselect-react-dropdown";
import { DeleteOutlined } from "@ant-design/icons";
import { Col, Form, Row } from "react-bootstrap";
import DataTable from "./dataTable";
import { useRouter } from "next/router";
import { useReactToPrint } from "react-to-print";
import useTheme from "../../../hooks/useTheme";

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

const dateFormat = "DD/MM/YYYY";

interface Props {
  detailData: any;
}

type TMocks = {
  id: number;
  name: string;
};

const AmendCarrierPrices = ({ detailData }: Props) => {
  const theme = useTheme();
  const [isSimple, setIsSimple] = useState(true);
  const router = useRouter();

  const handleChange = () => {};

  const componentToPrintRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentToPrintRef.current,
  });

  return (
    <UserDashboard>
      <Button
        className="xsm:h-9 lg:h-10 font-bold tracking-wide mt-5 position-absolute top-0 z-50"
        type="primary"
        style={{
          color: "#fff",
          borderRadius: "4px",
          position: "absolute",
          top: 0,
          right: 170,
          background: theme?.primarySea,
        }}
      >
        Save
      </Button>
      <Button
        className="xsm:h-9 lg:h-10 font-bold tracking-wide mt-5 position-absolute top-0 z-50"
        type="primary"
        style={{
          color: "#fff",
          borderRadius: "4px",
          position: "absolute",
          top: 0,
          right: 83,
          background: theme?.primarySea,
        }}
        onClick={() => router.back()}
      >
        Cancel
      </Button>
      <Button
        className="xsm:h-9 lg:h-10 font-bold tracking-wide mt-5 border-0 position-absolute top-0 right-4 z-50"
        type="primary"
        style={{
          color: "#fff",
          borderRadius: "4px",
          position: "absolute",
          top: 0,
          right: 10,
          background: theme?.primarySea,
        }}
        onClick={() => handlePrint()}
      >
        Print
      </Button>

      <div className={styles.wrapper} ref={componentToPrintRef}>
        <div className={styles.header}></div>
        <div className={styles.content}>
          <Row className="mb-5 justify-content-center">
            <Col md="8">
              <Title level={3} className="text-center">
                Amend Carrier Prices
              </Title>
              <Title level={4} className="text-center mt-0">
                Cost Type: By Parcel {isSimple ? "Simple" : "Matrix"}
              </Title>
            </Col>
          </Row>
          <Row>
            <Col md="4" style={{ textAlign: "end", marginTop: 5 }}>
              <Text>Carrier:</Text>
            </Col>
            <Col md="8">
              <Row>
                <Col md="2">
                  <Form.Control
                    className={styles.formItem}
                    name="carrier"
                    onChange={handleChange}
                    required
                  />
                </Col>
                <Col md="2" style={{ marginTop: 5 }}>
                  <Text>Active</Text>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col md="4" style={{ textAlign: "end", marginTop: 5 }}>
              <Text>Despatch Method:</Text>
            </Col>
            <Col md="6">
              <Row>
                <Col md="6">
                  <Form.Control
                    className={styles.formItem}
                    name="despatch_method"
                    onChange={handleChange}
                    required
                  />
                </Col>
              </Row>
            </Col>
          </Row>
          <>
            <Row className="mt-4">
              <Col md="3"></Col>
              <Col md="5" style={{ marginLeft: "40px" }}>
                <Title level={5}>Primary Parameters:</Title>
              </Col>
            </Row>
            {/*<Row className="mt-3">*/}
            {/*    <Col md='4' style={{textAlign: 'end', marginTop: 5}}><Text>Best Price:</Text></Col>*/}
            {/*    <Col md='8'>*/}
            {/*        <Row>*/}
            {/*            <Col md='2'>*/}
            {/*                <Form.Control*/}
            {/*                    style={{textAlign: 'end'}}*/}
            {/*                    className={styles.formItem}*/}
            {/*                    name="best_price"*/}
            {/*                    onChange={handleChange}*/}
            {/*                    value={3.25}*/}
            {/*                    required*/}
            {/*                />*/}
            {/*            </Col>*/}
            {/*        </Row>*/}
            {/*    </Col>*/}
            {/*</Row>*/}
            <Row className="mt-3">
              <Col md="4" style={{ textAlign: "end", marginTop: 5 }} />
              <Col md="8">
                <Row>
                  <Col md="2">
                    <Button
                      size="small"
                      className={`${styles.buttonInContent} tracking-wide w-20 z-50`}
                      type="primary"
                      onClick={() => console.log("Confirm")}
                    >
                      Add Row
                    </Button>
                  </Col>
                </Row>
                <Row className="mt-2">
                  <Col md="6">
                    <DataTable />
                  </Col>
                </Row>
              </Col>
            </Row>
          </>
          <>
            <Row className="mt-4">
              <Col md="3"></Col>
              <Col md="5" style={{ marginLeft: "40px" }}>
                <Title level={5}>Secondary Parameters:</Title>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col md="3"></Col>
              <Col md="2" style={{ textAlign: "end", marginTop: 5 }}>
                <Text>Either: Permanently Effective From:</Text>
              </Col>
              <Col md="7">
                <Row>
                  <Col md="2">
                    <DatePicker
                      style={{ borderRadius: 4 }}
                      defaultValue={moment("01/01/2015", dateFormat)}
                      format={dateFormat}
                    />
                  </Col>
                  <Col md="2">
                    <Button
                      size="small"
                      className={`${styles.buttonInPicker} tracking-wide w-15  z-50 mt-1`}
                      type="primary"
                      onClick={() => console.log("clear")}
                    >
                      clear
                    </Button>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col md="3"></Col>
              <Col md="2" style={{ textAlign: "end", marginTop: 5 }}>
                <Text>Or: Effective Between:</Text>
              </Col>
              <Col md="7">
                <Row>
                  <Col md="3">
                    <RangePicker
                      style={{ borderRadius: 4 }}
                      defaultValue={[
                        moment("01/01/2015", dateFormat),
                        moment("01/01/2015", dateFormat),
                      ]}
                      format={dateFormat}
                    />
                  </Col>
                  <Col md="2">
                    <Button
                      size="small"
                      className={`${styles.buttonInPicker} tracking-wide w-15  z-50 mt-1`}
                      type="primary"
                      onClick={() => console.log("clear")}
                    >
                      clear
                    </Button>
                  </Col>
                </Row>
              </Col>
            </Row>
            {/*<Row className="mt-3">*/}
            {/*    <Col md='4' style={{textAlign: 'end', marginTop: 5}}><Text>Best Price:</Text></Col>*/}
            {/*    <Col md='8'>*/}
            {/*        <Row>*/}
            {/*            <Col md='2'>*/}
            {/*                <Form.Control*/}
            {/*                    style={{textAlign: 'end'}}*/}
            {/*                    className={styles.formItem}*/}
            {/*                    name="best_price"*/}
            {/*                    onChange={handleChange}*/}
            {/*                    value={3.25}*/}
            {/*                    required*/}
            {/*                />*/}
            {/*            </Col>*/}
            {/*        </Row>*/}
            {/*    </Col>*/}
            {/*</Row>*/}
            <Row className="mt-3">
              <Col md="4" style={{ textAlign: "end", marginTop: 5 }} />
              <Col md="8">
                <Row>
                  <Col md="2">
                    <Button
                      size="small"
                      className={`${styles.buttonInContent} tracking-wide w-20 z-50`}
                      type="primary"
                      onClick={() => console.log("Confirm")}
                    >
                      Add Row
                    </Button>
                  </Col>
                </Row>
                <Row className="mt-2">
                  <Col md="6">
                    <DataTable />
                  </Col>
                </Row>
              </Col>
            </Row>
          </>
        </div>
      </div>
    </UserDashboard>
  );
};

export default AmendCarrierPrices;
