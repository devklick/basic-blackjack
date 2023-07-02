import { create } from "zustand";
import { persist } from "zustand/middleware";

export type WarningType = "hit-on-high" | "stick-on-low";
export interface GameSettingsStoreState {
  hitWarningsEnabled: boolean;
  stickWarningsEnabled: boolean;
  settingsModalOpen: boolean;
  setWarningEnabled: (warningType: WarningType, enabled: boolean) => void;
  toggleWarningEnabled: (warningType: WarningType) => void;
  getWarningEnabled: (warningType: WarningType) => boolean;
  setSettingsModelOpen: (open: boolean) => void;
}

const nonPersistedKeys: Array<keyof GameSettingsStoreState> = [
  "settingsModalOpen",
];

export const useGameSettingsStore = create<GameSettingsStoreState>()(
  persist(
    (set, get) => ({
      hitWarningsEnabled: true,
      stickWarningsEnabled: true,
      settingsModalOpen: false,
      setWarningEnabled(warningType, enabled) {
        switch (warningType) {
          case "hit-on-high":
            set({ hitWarningsEnabled: enabled });
            break;
          case "stick-on-low":
            set({ stickWarningsEnabled: enabled });
            break;
          default:
            throw new Error("Unknown warning type");
        }
      },
      toggleWarningEnabled(warningType) {
        switch (warningType) {
          case "hit-on-high":
            set({ hitWarningsEnabled: !get().hitWarningsEnabled });
            break;
          case "stick-on-low":
            set({ stickWarningsEnabled: !get().stickWarningsEnabled });
            break;
          default:
            throw new Error("Unknown warning type");
        }
      },
      getWarningEnabled(warningType) {
        switch (warningType) {
          case "hit-on-high":
            return get().hitWarningsEnabled;
          case "stick-on-low":
            return get().stickWarningsEnabled;
          default:
            throw new Error("Unknown warning type");
        }
      },
      setSettingsModelOpen(open) {
        set({ settingsModalOpen: open });
      },
    }),
    {
      name: "game-settings",
      partialize(state) {
        return Object.fromEntries(
          Object.entries(state).filter(
            ([key]) =>
              !nonPersistedKeys.includes(key as keyof GameSettingsStoreState)
          )
        );
      },
    }
  )
);
