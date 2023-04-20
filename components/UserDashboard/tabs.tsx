import { Button } from "antd";
import { CloseCircleOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import Link from "next/link";
import { comparePaths } from "../../utils/helpers";
import useTheme from "../../hooks/useTheme";

interface Props {
  tabData: any;
  onRemove?: () => void;
}

const Tabs = ({ tabData, onRemove }: Props) => {
  const theme = useTheme();
  const link = tabData.link;
  const { asPath } = useRouter();
  const pathname = asPath;
  // const name = link.substring(1).split('/')
  let name = tabData.title;
  if (name == "Product Fixed Routing: Despatch") {
    name = "Product Fixed Routing";
  }

  const isActive = comparePaths(link, pathname);
  const style = isActive
    ? {
        background: theme?.primaryNight,
        color: theme?.white,
        border: "none",
        marginLeft: "-22px",
      }
    : { background: theme?.offWhite, marginLeft: "-22px", color: theme?.mono };
  return (
    <span className="flex align-items-center">
      <CloseCircleOutlined
        style={{ color: isActive ? theme?.offWhite : theme?.gray }}
        className={`ml-2 z-50`}
        onClick={onRemove}
      />
      <Link href={link} passHref>
        {/* THIS NEEDS TO BE DONE IN THEMING, BOTH CLASS AND OBJECT ARE GIVEN,
        FIGURE OUT */}
        <Button
          style={style}
          className="ml-2 flex align-items-center"
          size={"middle"}
          shape="round"
        >
          <span className="pl-3 pt-1 capitalize">
            {/* {name.length > 1 ? name[name.length - 1].split('-').join(' ') : name[0]} */}
            {name}
          </span>
        </Button>
      </Link>
    </span>
  );
};

export default Tabs;
