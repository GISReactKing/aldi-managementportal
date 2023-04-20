import { useState } from "react";
import { Form, Row, Col } from "react-bootstrap";
import styles from "./order-and-returns-enquiry.module.scss";
import UserDashboard from "../../../components/UserDashboard";
import { Button, DatePicker, Checkbox } from "antd";
import moment from "moment";
import { AppButton } from "../../../components/AppButton";
import SummaryOrderHistory from "./summary-order-history";

const { RangePicker } = DatePicker;

const dateFormat = "DD/MM/YYYY";

interface Props {}

const OrderAndReturnsEnquiry = (props: Props) => {
  const [view, setView] = useState<string>("customerSelection");

  if (view === "SummaryOrderHistory") {
    return (
      <UserDashboard>
        <SummaryOrderHistory
          onGoBack={() => setView("customerSelection")}
          onSelectedRow={(e: any) => setView("SummaryForOrder")}
        />
      </UserDashboard>
    );
  }
  return (
    <UserDashboard>
      <h1
        data-testId="CustomerEnquiry"
        className="text-mono-title font-bold flex justify-center text-xmd"
      >
        Customer Enquiry Selection
      </h1>
      <>
        <AppButton
          className={`${styles.addButton} xsm:w-28 xsm:h-9 lg:w-30 lg:h-10 tracking-wide mt-5 position-absolute top-1 z-50`}
          title="Clear Filters"
          onClick={() => {}}
        />
        <AppButton
          className={`${styles.exportButton} xsm:w-28 xsm:h-9 lg:w-30 lg:h-10 tracking-wide mt-5 position-absolute top-1 right-4 z-50`}
          title="Display"
          onClick={() => setView("SummaryOrderHistory")}
        />
      </>
      <Form className="mt-5 ml-40 mr-40">
        <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
          <Form.Label
            style={{
              width: "220px",
              alignItems: "center",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            Order No:
          </Form.Label>
          <Col sm="2">
            <Form.Control defaultValue="" />
          </Col>
        </Form.Group>
        <Form.Label
          style={{
            width: "180px",
            alignItems: "center",
            display: "flex",
            justifyContent: "flex-end",
            color: "blue",
            marginBottom: "0px",
          }}
        >
          Alternatively
        </Form.Label>
        <Form.Group
          as={Row}
          style={{ flexDirection: "row", display: "flex" }}
          className="mb-3"
          controlId="formPlaintextEmail"
        >
          <Form.Label
            style={{
              width: "220px",
              alignItems: "center",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            Customer Email:
          </Form.Label>
          <Col sm="3">
            <Form.Control defaultValue="" />
          </Col>
          <Form.Label
            style={{
              width: "170px",
              alignItems: "center",
              display: "flex",
              margin: "0px",
              padding: "0px",
            }}
          >
            <span style={{ color: "blue", marginRight: 4 }}>{`${"and"}`}</span>
            {" Delivery Post Code:"}
          </Form.Label>
          <Col sm="2">
            <Form.Control defaultValue="" />
          </Col>
        </Form.Group>

        <Form.Label
          style={{
            width: "180px",
            alignItems: "center",
            display: "flex",
            justifyContent: "flex-end",
            color: "blue",
            marginBottom: "0px",
          }}
        >
          with
        </Form.Label>
        <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
          <Form.Label
            style={{
              width: "220px",
              alignItems: "center",
              display: "flex",
              justifyContent: "flex-end",
              marginTop: -25,
            }}
          >
            Order Date Range: From / To:
          </Form.Label>
          <Col>
            <Form.Group
              as={Row}
              style={{
                display: "flex",
                width: "100%",
                flexDirection: "row",
                alignItems: "center",
              }}
              controlId="return_date_range"
            >
              <RangePicker
                style={{ width: "250px" }}
                format={"DD/MM/YYYY"}
                disabledDate={(current) => {
                  let customDate = moment().format("DD/MM/YYYY");
                  return current && current >= moment(customDate, "DD/MM/YYYY");
                }}
              />
              <Button
                size="small"
                style={{ width: "60px", marginLeft: 10 }}
                className={`${styles.buttonInPicker}`}
                type="primary"
                onClick={() => console.log("clear")}
              >
                clear
              </Button>
            </Form.Group>
            <Form.Group
              as={Row}
              style={{
                display: "flex",
                width: "100%",
                flexDirection: "row",
                alignItems: "center",
              }}
              controlId="return_date_range"
            >
              <Checkbox
                style={{ marginTop: 10 }}
                name="active"
                onChange={(target: any) => console.log(target.checked)}
              >
                User Only include orders with Returns
              </Checkbox>
            </Form.Group>
          </Col>
        </Form.Group>
      </Form>
    </UserDashboard>
  );
};
export default OrderAndReturnsEnquiry;

{
  /* <span className='h-12 pt-1 w-full flex justify-between '>
                                <div>
                                    <Button
                                        className='border-0 font-bold tracking-wide  mt-3 z-50'
                                        type='primary'
                                        style={{ background: '#54C2F0', borderRadius: '4px' }}
                                        onClick={() => {
                                            console.log('add')
                                        }}
                                    >
                                        Add
                                    </Button>
                            
                                </div>
                
                            </span> */
}
