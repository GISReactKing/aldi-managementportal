import React, { useState } from "react";
import { Form, Input, Button } from "antd";
import PolicyHrf from "../../components/PolicyHrf";
import useTheme from "../../hooks/useTheme";

const LoginForm = () => {
  const theme = useTheme();
  const [form] = Form.useForm();
  const [requiredMark, setRequiredMarkType] = useState("optional");

  const onRequiredTypeChange = ({ requiredMarkValue }: any) => {
    setRequiredMarkType(requiredMarkValue);
  };

  return (
    <div className="h-auto">
      <h1 className="w-full text-center text-lg font-bold">
        Aldi Returns Portal
      </h1>
      <p
        style={{ color: theme?.mono }}
        className="font-light mt-4 tracking-wide opacity-80"
      >
        Please provide the information below to begin return process.
      </p>
      <div className="mt-8">
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            requiredMarkValue: requiredMark,
          }}
          onValuesChange={onRequiredTypeChange}
        >
          <Form.Item className="font-bold tracking-wide" label="Email Address">
            <Input
              style={{
                backgroundColor: theme?.offWhite,
              }}
              className="h-14"
              placeholder="Email Address"
            />
          </Form.Item>

          <Form.Item
            className="font-bold tracking-wide"
            label="Delivery Post Code"
          >
            <Input
              style={{
                backgroundColor: theme?.offWhite,
              }}
              className="h-14"
              placeholder="Enter Post Code"
            />
          </Form.Item>

          <Form.Item className="font-bold tracking-wide" label="Order Number">
            <Input
              style={{
                backgroundColor: theme?.offWhite,
              }}
              className="h-14"
              placeholder="Enter Order Number"
            />
          </Form.Item>

          <Form.Item>
            <Button
              style={{
                backgroundColor: theme?.primary,
              }}
              className="w-full h-14 font-bold tracking-wide mt-2 border-0"
              type="primary"
            >
              Get Started
            </Button>
          </Form.Item>
        </Form>
        <div className="mt-4 text-center">
          <PolicyHrf />
        </div>

        <p className="text-center font-light mt-4">
          For inquiry or complaint please contact Aldi customer service{" "}
          <Button className="p-0" type="link">
            here
          </Button>
          .
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
