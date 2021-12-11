import styles from './YesNoPopUp.module.scss';

export interface YesNoPopUpProps {
  message: string;
  onClickYes: () => void;
  onClickNo: () => void;
  onClickClose: () => void;
}

const YesNoPopUp = (props: YesNoPopUpProps) => {
  return (
    <div className={styles.YesNoPopUp}>
      <div className={styles.Content}>
        <span>{props.message}</span>
        <div className={styles.ButtonContainer}>
          <button className={styles.Yes} onClick={props.onClickYes}>Yes</button>
          <button className={styles.No} onClick={props.onClickNo}>No</button>
        </div>
      </div>
    </div>
  )
}

export default YesNoPopUp;
