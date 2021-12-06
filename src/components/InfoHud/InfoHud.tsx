import React from 'react';
import { GameState } from '../Table/Table';
import styles from './InfoHud.module.scss';

export interface ScoreBoardRow {
  participant: string;
  score: number;
  displayScore: boolean;
}

export interface InfoHudProps {
  outcome?: string | null;
  gameOver: boolean;
  gameState: GameState;
  scoreBoardRows: ScoreBoardRow[];
  clickStartHandler: () => void;
  clickHitHandler: () => void;
  clickStickHandler: () => void;
}

const getScoreBoard = (scoreBoardRows: ScoreBoardRow[]) => {
  return (
    <table className={styles.ScoreTable}>
      {
        scoreBoardRows.map(row => {
          return (
            <tr>
              <td>{row.participant}</td>
              <td>{row.displayScore ? row.score : '?'}</td>
            </tr>
          )
        })
      }
    </table>
  )
}

const InfoHud = (props: InfoHudProps) => {
  return (
    <div className={styles.InfoHud}>
      {props.gameOver ? <div className={styles.Outcome}>{props.outcome}</div> : null}
      {props.gameState !== GameState.WaitingForStart ?
        getScoreBoard(props.scoreBoardRows)
        : null}
      <div className={styles.ButtonContainer}>
        {props.gameState === GameState.WaitingForStart || props.gameOver
          ? <button className={styles.StartButton} onClick={props.clickStartHandler}>{props.gameOver ? 'Restart' : 'Start'}</button>
          : null}
        {props.gameState === GameState.PlayerRound && !props.gameOver
          ? <>
            <button className={styles.HitButton} onClick={props.clickHitHandler}>Hit</button>
            <button className={styles.StickButton} onClick={props.clickStickHandler}>Stick</button>
          </>
          : null}
      </div>

    </div>
  );
}

export default InfoHud;
