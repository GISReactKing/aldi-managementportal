/** @format */
import { Button, Popover } from "antd";
import {
  DeleteIcon,
  ExportIcon,
  SmallRestPasswordIcon,
  CloseIcon,
} from "../../../../components/Icons";
import useTheme from "../../../../hooks/useTheme";

interface Props {
  dltPress?: () => void;
  onRestPassword?: () => void;
  onCloseActionBar?: () => void;
  activeActionBar?: boolean;
}

const ActionBar = ({
  dltPress,
  onRestPassword,
  activeActionBar,
  onCloseActionBar,
}: Props): JSX.Element => {
  const theme = useTheme();
  return (
    <>
      <div
        className={`${
          activeActionBar ? "flex" : "hidden"
        } border-t border-b mt-3 mb-3 py-2 justify-between items-center`}
        style={{ borderColor: theme?.monoInput }}
      >
        <div>
          <Popover
            placement="bottom"
            arrowPointAtCenter
            content={
              <div className="flex flex-col p-0">
                <Button
                  type="text"
                  style={{ color: theme?.mono }}
                  className="text-12 tracking-xl-wide"
                >
                  Export as CSV
                </Button>
                <Button
                  type="text"
                  style={{ color: theme?.mono }}
                  className="text-12 tracking-xl-wide"
                >
                  Export as PDF
                </Button>
              </div>
            }
            trigger="click"
          >
            <Button
              type="text"
              style={{ color: theme?.monoGray }}
              className="hover:bg-transparent hover:text-primary-sea md:ml-1 text-xsm"
              icon={<ExportIcon />}
            >
              <span className="ml-3">Export Activity</span>
            </Button>
          </Popover>

          <Button
            type="text"
            style={{ color: theme?.monoGray }}
            className="hover:bg-transparent hover:text-secondary-fire md:ml-4 text-xsm"
            icon={<DeleteIcon />}
            onClick={dltPress}
          >
            <span className="ml-3">Delete Activity</span>
          </Button>
        </div>
        <Button
          onClick={onCloseActionBar}
          className="border-0 flex justify-center items-center"
          icon={<CloseIcon color={theme?.monoPlaceholder} size={20} />}
        />
      </div>
    </>
  );
};

export default ActionBar;
