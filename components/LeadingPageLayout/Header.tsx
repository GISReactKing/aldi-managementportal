import { Fragment } from "react";

import { Button } from "antd";

interface Props {}

function Header({}: Props): JSX.Element {
  return (
    <Fragment>
      <div className="h-18 w-full flex justify-between items-center xsm:px-4  md:px-28 py-2 shadow-sm">
        <div>
          <img alt="Logo image" src="/logo.png" width="56px" height="64px" />
        </div>
        <div>
          <Button className="mr-2 rounded" type="default">
            Need Help?
          </Button>
          <Button className="rounded" type="default">
            Close
          </Button>
        </div>
      </div>
    </Fragment>
  );
}

export default Header;
