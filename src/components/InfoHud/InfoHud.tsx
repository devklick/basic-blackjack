import React from "react";
import { GameState, Participant } from "../Table/Table";
import styles from "./InfoHud.module.scss";

export interface ScoreBoardRow {
  participant: Participant;
  score: number;
  displayScore: boolean;
  totalWins: number;
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
    <div className={styles.TableContainer}>
      <table className={styles.ScoreTable}>
        <tr>
          <th>Participant</th>
          <th>Hand Score</th>
        </tr>
        {scoreBoardRows.map((row) => {
          return (
            <tr>
              <td>{row.participant}</td>
              <td>{row.displayScore ? row.score : "?"}</td>
            </tr>
          );
        })}
      </table>
      <table className={styles.ScoreTable}>
        <th>Total Wins</th>
        {scoreBoardRows.map((row) => {
          return (
            <tr>
              <td>{row.totalWins}</td>
            </tr>
          );
        })}
      </table>
    </div>
  );
};

const InfoHud = (props: InfoHudProps) => {
  return (
    <div className={styles.InfoHud}>
      {/* {props.gameOver ? <div className={styles.Outcome}>{props.outcome}</div> : null} */}
      <div className={styles.Outcome}>
        {props.gameOver ? props.outcome : null}
      </div>
      {props.gameState !== "WaitingForStart"
        ? getScoreBoard(props.scoreBoardRows)
        : null}
      <div className={styles.ButtonContainer}>
        {props.gameState === "WaitingForStart" || props.gameOver ? (
          <button
            className={styles.StartButton}
            onClick={props.clickStartHandler}
          >
            {props.gameOver ? "Restart" : "Start"}
          </button>
        ) : null}
        {props.gameState === "PlayerRound" && !props.gameOver ? (
          <>
            <button
              className={styles.HitButton}
              onClick={props.clickHitHandler}
            >
              Hit
            </button>
            <button
              className={styles.StickButton}
              onClick={props.clickStickHandler}
            >
              Stick
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default InfoHud;
