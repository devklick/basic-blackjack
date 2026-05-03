import { JSX } from 'react';
import { Participant } from '../Table';

import styles from './ScoreBoard.module.scss';

export interface ScoreBoardRow {
  participant: Participant;
  score: number;
  displayScore: boolean;
  totalWins: number;
}

export interface ScoreBoardProps {
  scoreBoardRows: ScoreBoardRow[];
}

function CurrentHandScores({ scoreBoardRows }: ScoreBoardProps): JSX.Element {
  return (
    <table className={styles.ScoreTable}>
      <thead>
        <tr>
          <th>Participant</th>
          <th>Score</th>
        </tr>
      </thead>
      <tbody>
        {scoreBoardRows.map((row, i) => {
          return (
            <tr key={i}>
              <td>{row.participant}</td>
              <td>{row.displayScore ? row.score : '?'}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function TotalWins({ scoreBoardRows }: ScoreBoardProps): JSX.Element {
  return (
    <table className={styles.ScoreTable}>
      <thead>
        <tr>
          <th>Wins</th>
        </tr>
      </thead>
      <tbody>
        {scoreBoardRows.map((row, i) => {
          return (
            <tr key={i}>
              <td>{row.totalWins}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function ScoreBoard({ scoreBoardRows }: ScoreBoardProps): JSX.Element {
  return (
    <div className={styles.TableContainer}>
      <CurrentHandScores scoreBoardRows={scoreBoardRows} />
      <TotalWins scoreBoardRows={scoreBoardRows} />
    </div>
  );
}

export default ScoreBoard;
