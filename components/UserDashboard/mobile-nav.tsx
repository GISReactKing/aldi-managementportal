import { Drawer } from "antd";
import Navigation from "./navigation";

interface Props {
  visible?: boolean;
  setVisible: (e: boolean) => void;
}

function MobileNav({ visible, setVisible }: Props): JSX.Element {
  return (
    <>
      <Drawer
        width={239}
        style={{ backgroundColor: "none" }}
        bodyStyle={{
          padding: 0,
          backgroundColor: "none",
          position: "relative",
        }}
        placement={"left"}
        closable={false}
        onClose={() => setVisible(false)}
        visible={visible}
        key={"left"}
      >
        <Navigation drawer={[]} setVisible={setVisible} />
      </Drawer>
    </>
  );
}

export default MobileNav;
