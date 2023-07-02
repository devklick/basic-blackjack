import { create } from "zustand";
import { persist } from "zustand/middleware";

export type WarningType = "hit-on-high" | "stick-on-low";
export interface GameSettingsStoreState {
  hitWarningsEnabled: boolean;
  stickWarningsEnabled: boolean;
  setWarningsEnabled: ({
    hitWarningsEnabled = null,
    stickWarningsEnabled = null,
  }: {
    hitWarningsEnabled: boolean | null;
    stickWarningsEnabled: boolean | null;
  }) => void;
  setWarningEnabled: (warningType: WarningType, enabled: boolean) => void;
  getWarningEnabled: (warningType: WarningType) => boolean;
}

export const useGameSettingsStore = create<GameSettingsStoreState>()(
  persist(
    (set, get) => ({
      hitWarningsEnabled: true,
      stickWarningsEnabled: true,
      setWarningsEnabled: ({
        hitWarningsEnabled = null,
        stickWarningsEnabled = null,
      }: {
        hitWarningsEnabled: boolean | null;
        stickWarningsEnabled: boolean | null;
      }) => {
        set({
          hitWarningsEnabled: hitWarningsEnabled ?? get().hitWarningsEnabled,
          stickWarningsEnabled:
            stickWarningsEnabled ?? get().stickWarningsEnabled,
        });
      },
      setWarningEnabled: (warningType, enabled) => {
        switch (warningType) {
          case "hit-on-high":
            set({ hitWarningsEnabled: enabled });
            break;
          case "stick-on-low":
            set({ stickWarningsEnabled: enabled });
            break;
        }
      },
      getWarningEnabled: (warningType) => {
        switch (warningType) {
          case "hit-on-high":
            return get().hitWarningsEnabled;
          case "stick-on-low":
            return get().stickWarningsEnabled;
          default:
            throw new Error("Unknown warning type");
        }
      },
    }),
    {
      name: "game-settings",
    }
  )
);
