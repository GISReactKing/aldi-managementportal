/** @format */

import { useRouter } from "next/router";
import { RootStateOrAny, useSelector } from "react-redux";
import _ from "lodash";
import { join } from "path/posix";
import useTheme from "../../hooks/useTheme";
interface Props {}

const ActiveRoute = ({}: Props): JSX.Element | null => {
  const router = useRouter();
  const routerNames = router.pathname.substring(1).split("/");
  const theme = useTheme();

  const navTabs: any = useSelector(
    ({ navTabs }: RootStateOrAny) => navTabs.navTabs
  );

  if (router.pathname === "/home") {
    return null;
  }

  return (
    <div className="flex xsm:hidden md:flex md:pl-3">
      {routerNames.map((path, index) => {
        let title = path.split("-").join(" ");
        if (title.toLowerCase() === "skus and stock") {
          title = "SKU's & Stock";
        }
        if (index == routerNames.length - 1) {
          const filteredNavTabs = _.filter(
            navTabs,
            (o: any) => o.link === router.pathname.split("?")[0]
          );
          if (filteredNavTabs && filteredNavTabs.length > 0) {
            title = filteredNavTabs[0].title;
          }
        } else if (
          title.toLowerCase() === "carriage claims and invoicing" ||
          title.toLowerCase() === "carriage: claims and invoicing"
        ) {
          title = "Carriage: Claims & Invoicing";
        }
        return (
          <div key={index}>
            <span className={index > 0 ? "ml-4" : "ml-0"}>
              {index > 0 && (
                <img
                  className={"d-inline-block"}
                  style={{ marginTop: "-0.2rem" }}
                  alt="forward-arrow.svg"
                  src="/Icons/forward-arrow.svg"
                />
              )}
            </span>
            <span
              className={`capitalize text-sm`}
              style={
                index == routerNames.length - 1
                  ? { color: theme?.monoTitle, marginLeft: "4px" }
                  : index == 0
                  ? { color: theme?.monoTitle }
                  : { color: theme?.monoTitle, marginLeft: "4px" }
              }
              key={index}
            >
              {title}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default ActiveRoute;
