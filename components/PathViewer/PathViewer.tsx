import styles from "./pathViewer.module.scss";

interface IPathViewer {
  activeStep: number;
}

const PathViewer = ({ activeStep }: IPathViewer) => {
  const infoStyle = `${styles.info} ${
    activeStep === 1 ? styles.selected : ""
  } ${activeStep === 2 ? styles.removed : ""}`;

  const roleStyle = `${styles.role} ${activeStep === 2 ? styles.selected : ""}`;
  const doneStyle = `${styles.done} ${activeStep === 3 ? styles.selected : ""}`;
  return (
    <div className={styles.container}>
      <span className={infoStyle}>User Information</span>
      <span className={roleStyle}>Role & Permission</span>
      <span className={doneStyle}>Done</span>
    </div>
  );
};

export default PathViewer;
