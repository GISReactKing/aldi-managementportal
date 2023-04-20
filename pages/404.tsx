import { useRouter } from "next/router";
import styles from "./home.module.scss";

interface Props {}

const PageNotFound = ({}: Props) => {
  const router = useRouter();

  return (
    <div className="flex justify-center flex-col align-items-center h-screen">
      <h1 className="text-lg font-bold">This page could not be found | 404</h1>
      <button
        style={{ maxWidth: 200, marginTop: 20 }}
        className={styles.getStartedBtn}
        onClick={() => router.push("/")}
      >
        Get Started
      </button>
    </div>
  );
};

export default PageNotFound;
