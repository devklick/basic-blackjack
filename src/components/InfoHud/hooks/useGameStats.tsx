import { Participant } from "../../Table";
import { useGameStatsStore } from "../../../stores/gameStatsStore";

export function useGameStats() {
  const statsStore = useGameStatsStore();

  /**
   * Updates the specified participants stats,
   * incrementing the number of games they have won by 1.
   * @param winner The winning participant
   */
  function updateWinnerStats(winner: Participant) {
    statsStore.incrementWins(winner);
  }

  return {
    /**
     * The number of games the player has won during this session
     */
    playerWins: statsStore.playerWins,
    /**
     * The number of games the dealer has won during this session.
     */
    dealerWins: statsStore.dealerWins,
    updateWinnerStats,
  };
}
