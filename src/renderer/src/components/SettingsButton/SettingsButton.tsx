import { JSX } from 'react';
import { useGameSettingsStore } from '../../stores/gameSettingsStore';

import styles from './SettingsButton.module.scss';

interface SettingsButtonProps {}

// eslint-disable-next-line no-empty-pattern
function SettingsButton({}: SettingsButtonProps): JSX.Element {
  const { settingsModalOpen, setSettingsModelOpen } = useGameSettingsStore();

  function onClick(): void {
    setSettingsModelOpen(!settingsModalOpen);
  }

  const classes = [styles.SettingsButton, settingsModalOpen ? styles.Open : styles.Closed].join(
    ' '
  );

  return (
    <div className={classes} onClick={onClick}>
      <span className={styles.Symbol}>☰</span>
    </div>
  );
}

export default SettingsButton;
