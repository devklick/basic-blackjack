import { useGameSettingsStore } from "../../stores/gameSettingsStore";
import { useGameStatsStore } from "../../stores/gameStatsStore";
import CheckBox from "../CheckBox";

import styles from "./GameSettings.module.scss";

function GameSettings() {
  const gameSettings = useGameSettingsStore();
  const gameStats = useGameStatsStore();

  return (
    <div className={styles.GameSettings}>
      <div className={styles.Title}>
        <span>Game Settings</span>
        <CheckBox
          className="ToggleSettings"
          checked={gameSettings.settingsModalOpen}
          onChanged={(open) => gameSettings.setSettingsModelOpen(open)}
          symbol="☰"
        />
      </div>
      <div className={styles.Content}>
        <div className={styles.GameSetting}>
          <div className={styles.Info}>
            <span className={styles.Header}>Clear Saved Wins</span>
            <span className={styles.Description}>
              Resets the player and dealer win count back to zero
            </span>
          </div>
          <div className={styles.ControlWrapper}>
            <button
              className={styles.Control}
              onClick={() => gameStats.reset()}
            >
              Clear
            </button>
          </div>
        </div>

        <div className={styles.GameSetting}>
          <div className={styles.Info}>
            <span className={styles.Header}>Hit Warnings Enabled</span>
            <span className={styles.Description}>
              Whether or not you want to see a warning if you click "hit" while
              already having a reasonably high score
            </span>
          </div>
          <div className={styles.ControlWrapper}>
            <CheckBox
              className={styles.Control}
              checked={gameSettings.hitWarningsEnabled}
              onChanged={() => gameSettings.toggleWarningEnabled("hit-on-high")}
            />
          </div>
        </div>

        <div className={styles.GameSetting}>
          <div className={styles.Info}>
            <span className={styles.Header}>Stick Warnings Enabled</span>
            <span className={styles.Description}>
              Whether or not you want to see a warning if you click "stick"
              while having a fairly low score
            </span>
          </div>
          <div className={styles.ControlWrapper}>
            <CheckBox
              className={styles.Control}
              checked={gameSettings.stickWarningsEnabled}
              onChanged={() =>
                gameSettings.toggleWarningEnabled("stick-on-low")
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default GameSettings;
