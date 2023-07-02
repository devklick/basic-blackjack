import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Participant } from "../components/Table";

export interface GameStatsStoreState {
  playerWins: number;
  dealerWins: number;
  incrementWins: (participant: Participant) => void;
  reset: () => void;
}

export const useGameStatsStore = create<GameStatsStoreState>()(
  persist(
    (set, get) => ({
      dealerWins: 0,
      playerWins: 0,
      incrementWins(participant) {
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
      reset() {
        set({ dealerWins: 0, playerWins: 0 });
      },
    }),
    {
      name: "game-stats",
    }
  )
);
