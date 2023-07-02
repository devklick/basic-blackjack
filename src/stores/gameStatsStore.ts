import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Participant } from "../components/Table/hooks/useGame";

export interface GameStatsStoreState {
  playerWins: number;
  dealerWins: number;
  incrementWins: (participant: Participant) => void;
}

export const useGameStatsStore = create<GameStatsStoreState>()(
  persist(
    (set, get) => ({
      dealerWins: 0,
      playerWins: 0,
      incrementWins: (participant) => {
        let dealerWins = get().dealerWins;
        let playerWins = get().playerWins;
        switch (participant) {
          case "Dealer":
            dealerWins++;
            break;
          case "Player":
            playerWins++;
            break;
        }
        set({ dealerWins, playerWins });
      },
    }),
    {
      name: "game-stats",
    }
  )
);
