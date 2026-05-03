import { Participant } from '../../Table';
import { useGameStatsStore } from '../../../stores/gameStatsStore';

type UseGameStatsReturn = {
  /**
   * The number of games the player has won during this session
   */
  playerWins: number;
  /**
   * The number of games the dealer has won during this session.
   */
  dealerWins: number;
  updateWinnerStats: (winner: Participant) => void;
};

export function useGameStats(): UseGameStatsReturn {
  const statsStore = useGameStatsStore();

  /**
   * Updates the specified participants stats,
   * incrementing the number of games they have won by 1.
   * @param winner The winning participant
   */
  function updateWinnerStats(winner: Participant): void {
    statsStore.incrementWins(winner);
  }

  return {
    playerWins: statsStore.playerWins,
    dealerWins: statsStore.dealerWins,
    updateWinnerStats
  };
}
