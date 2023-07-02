import { Participant } from "../../Table/hooks/useGame";
import useParticipantStats from "./useParticipantStats";

function useGameStats() {
  const playerStats = useParticipantStats();
  const dealerStats = useParticipantStats();

  /**
   * Updates the specified participants stats,
   * incrementing the number of games they have won by 1.
   * @param winner The winning participant
   */
  function updateWinnerStats(winner: Participant) {
    switch (winner) {
      case "Dealer":
        dealerStats.incrementWins();
        break;
      case "Player":
        playerStats.incrementWins();
        break;
    }
  }

  return {
    /**
     * The number of games the player has won during this session
     */
    playerWins: playerStats.wins,
    /**
     * The number of games the dealer has won during this session.
     */
    dealerWins: dealerStats.wins,
    updateWinnerStats,
  };
}

export default useGameStats;
