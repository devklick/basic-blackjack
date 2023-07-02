import { useState } from "react";

function useParticipantStats() {
  const [wins, setWins] = useState<number>(0);

  /**
   * Updates the participants stats, incrementing
   * the number of games they have won by 1.
   */
  function incrementWins() {
    setWins(wins + 1);
  }

  return {
    /**
     * The number of games this participant has won
     * during the current session.
     */
    wins,
    incrementWins,
  };
}

export default useParticipantStats;
