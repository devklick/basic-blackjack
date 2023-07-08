import cardDealt from "../../../assets/audio/DardDealt.mp3";
import roundLost from "../../../assets/audio/RoundLost.mp3";
import roundWon from "../../../assets/audio/RoundWon.mp3";
import warning from "../../../assets/audio/WarningAlert.mp3";
import { useGameSettingsStore } from "../../../stores/gameSettingsStore";

type SoundEffect = "cardDealt" | "warning" | "roundWon" | "roundLost";

const sounds: Record<SoundEffect, string> = {
  cardDealt,
  roundLost,
  roundWon,
  warning,
};

function useAudioPlayer() {
  const { audioEnabled } = useGameSettingsStore();

  function play(soundEffect: SoundEffect) {
    audioEnabled && new Audio(sounds[soundEffect]).play();
  }

  return { play };
}
export default useAudioPlayer;
