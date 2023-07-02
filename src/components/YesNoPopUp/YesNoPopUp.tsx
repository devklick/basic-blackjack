import { useState } from "react";
import {
  WarningType,
  useGameSettingsStore,
} from "../../stores/gameSettingsStore";
import styles from "./YesNoPopUp.module.scss";

export interface YesNoPopUpProps {
  type: WarningType;
  message?: string;
  onClickYes: () => void;
  onClickNo: () => void;
}

const YesNoPopUp = ({
  onClickNo,
  onClickYes,
  message = "Are you sure?",
  type,
}: YesNoPopUpProps) => {
  const { setWarningEnabled } = useGameSettingsStore();
  const [disableFuture, setDisableFuture] = useState<boolean>(false);

  function onClick(ignore: boolean) {
    if (disableFuture) setWarningEnabled(type, false);

    if (ignore) onClickYes();
    else onClickNo();
  }

  return (
    <div className={styles.YesNoPopUp}>
      <div className={styles.Content}>
        <span>{message}</span>
        <div className={styles.ButtonContainer}>
          <button className={styles.Yes} onClick={() => onClick(true)}>
            Yes
          </button>
          <button className={styles.No} onClick={() => onClick(false)}>
            No
          </button>
        </div>
        <span>Don't warn me again</span>
        <input
          type="checkbox"
          checked={disableFuture}
          onChange={(e) => setDisableFuture(!disableFuture)}
        />
      </div>
    </div>
  );
};

export default YesNoPopUp;
