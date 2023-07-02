import styles from "./YesNoPopUp.module.scss";

export interface YesNoPopUpProps {
  message?: string;
  onClickYes: () => void;
  onClickNo: () => void;
}

const YesNoPopUp = ({
  onClickNo,
  onClickYes,
  message = "Are you sure?",
}: YesNoPopUpProps) => {
  return (
    <div className={styles.YesNoPopUp}>
      <div className={styles.Content}>
        <span>{message}</span>
        <div className={styles.ButtonContainer}>
          <button className={styles.Yes} onClick={onClickYes}>
            Yes
          </button>
          <button className={styles.No} onClick={onClickNo}>
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default YesNoPopUp;
