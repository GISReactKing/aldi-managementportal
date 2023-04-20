import React, { ReactElement } from "react";
import { Button } from "antd";

interface Props {}

const PolicyHrf = ({}: Props): ReactElement => {
  return (
    <p className="font-light opacity-80">
      Read about our{" "}
      <Button className="p-0" type="link">
        Return policy
      </Button>{" "}
      or{" "}
      <Button className="p-0" type="link">
        Exchange policy
      </Button>
    </p>
  );
};

export default PolicyHrf;
