import React, { useRef } from "react";
import dynamic from "next/dynamic";
import SunEditorCore from "suneditor/src/lib/core";
import "suneditor/dist/css/suneditor.min.css";
import { Form, Input, Button, Row, Col, Select } from "antd";
import UserDashboard from "../../components/UserDashboard";
import useTheme from "../../hooks/useTheme";

const { Option } = Select;

interface Props {}

const SunEditor = dynamic(() => import("suneditor-react"), {
  ssr: false,
});

const EmailEditor = ({}: Props) => {
  const editor = useRef<SunEditorCore>();
  const theme = useTheme();

  const getSunEditorInstance = (sunEditor: SunEditorCore) => {
    editor.current = sunEditor;
  };

  const setOptions: any = {
    height: "30vh",
    mode: "classic",
    rtl: false,
    katex: "window.katex",
    videoFileInput: false,
    tabDisable: false,
    buttonList: [
      [
        "undo",
        "redo",
        "font",
        "fontSize",
        "formatBlock",
        "blockquote",
        "bold",
        "underline",
        "italic",
        "strike",
        "subscript",
        "superscript",
        "fontColor",
        "hiliteColor",
        "textStyle",
        "removeFormat",
        "outdent",
        "indent",
        "align",
        "horizontalRule",
        "list",
        "lineHeight",
        "table",
        "link",
        "image",
        "math",
        "fullScreen",
        "preview",
        "print",
      ],
    ],
    "lang(In nodejs)": "us",
  };

  return (
    <UserDashboard>
      <div>
        <Form
          //   form={form}
          layout="vertical"
          initialValues={
            {
              // requiredMarkValue: requiredMark,
            }
          }
          //   onValuesChange={onRequiredTypeChange}
        >
          <Row gutter={[16, 0]}>
            <Col xs={24} md={12}>
              <Form.Item className="font-bold tracking-wide mb-3" label="Name">
                <Input
                  style={{ backgroundColor: theme?.offWhite }}
                  className="h-10 rounded"
                  placeholder="Enter Name"
                />
              </Form.Item>
              <Form.Item
                className="font-bold tracking-wide mb-3"
                label="Description"
              >
                <Input
                  style={{ backgroundColor: theme?.offWhite }}
                  className="h-10 rounded"
                  placeholder="Enter description"
                />
              </Form.Item>
              <Form.Item
                className="font-bold tracking-wide mb-3"
                label="Client"
              >
                <Select
                  className="my-selector"
                  options={[
                    { label: "Client 1", value: "Client 1" },
                    { label: "Client 2", value: "Client 2" },
                  ]}
                  // onChange={handleChange}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                className="font-bold tracking-wide mb-3"
                label="Country"
              >
                <Select
                  className="my-selector"
                  options={[
                    { label: "Beijing", value: "Beijing" },
                    { label: "Shanghai", value: "Shanghai" },
                  ]}
                  // onChange={handleChange}
                />
              </Form.Item>

              <Form.Item
                className="font-bold tracking-wide mb-3"
                label="Template Type"
              >
                <Input
                  disabled
                  value="Email"
                  style={{ backgroundColor: theme?.offWhite }}
                  className="h-10 rounded"
                  placeholder="Enter Client"
                />
              </Form.Item>

              <Form.Item className="font-bold tracking-wide mb-3" label="Email">
                <Input
                  style={{ backgroundColor: theme?.offWhite }}
                  className="h-10 rounded"
                  placeholder="Type her email subject..."
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <SunEditor
              getSunEditorInstance={getSunEditorInstance}
              setOptions={setOptions}
            />
          </Form.Item>

          <Form.Item className="text-right">
            <Button
              style={{
                background: theme?.monoLightGray,
                color: theme?.monoTitle,
              }}
              className="h-12 w-36 font-bold tracking-wide rounded hover:text-primary  border-0 mr-4"
              type="primary"
            >
              Cancel
            </Button>
            <Button
              style={{ backgroundColor: theme?.primary }}
              className="h-12 w-36 font-bold tracking-wide rounded border-0"
              type="primary"
            >
              Send
            </Button>
          </Form.Item>
        </Form>
      </div>
    </UserDashboard>
  );
};
export default EmailEditor;
