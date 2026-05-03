import { GameState } from '../Table';
import ScoreBoard, { ScoreBoardRow } from '../ScoreBoard';
import Buttons from '../Buttons';
import styles from './InfoHud.module.scss';
import { JSX } from 'react';

export interface InfoHudProps {
  outcome?: string | null;
  gameState: GameState;
  scoreBoardRows: ScoreBoardRow[];
  clickHandlers: {
    onDealClicked: () => void;
    onHitClicked: () => void;
    onStickClicked: () => void;
  };
}

function InfoHud({ gameState, scoreBoardRows, outcome, clickHandlers }: InfoHudProps): JSX.Element {
  const displayScoreBoard = gameState !== 'WaitingForStart';
  return (
    <div className={styles.InfoHud}>
      <div className={styles.Outcome}>{outcome}</div>
      {displayScoreBoard && <ScoreBoard scoreBoardRows={scoreBoardRows} />}
      <Buttons gameState={gameState} clickHandlers={clickHandlers} />
    </div>
  );
}

export default InfoHud;
