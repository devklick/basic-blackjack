import { GameState } from "../Table";

import styles from "./Buttons.module.scss";

export interface ButtonsProps {
  gameState: GameState;
  clickHandlers: {
    onDealClicked: () => void;
    onHitClicked: () => void;
    onStickClicked: () => void;
  };
}

function PrePlayButtons({ onDealClicked }: { onDealClicked: () => void }) {
  return (
    <button key={"start"} onClick={() => onDealClicked()}>
      Deal
    </button>
  );
}

function InPlayButtons({
  onHitClicked,
  onStickClicked,
}: {
  onHitClicked: () => void;
  onStickClicked: () => void;
}) {
  return (
    <>
      <button key="hit" onClick={() => onHitClicked()}>
        Hit
      </button>
      <button key="stick" onClick={() => onStickClicked()}>
        Stick
      </button>
    </>
  );
}

function Buttons({
  gameState,
  clickHandlers: { onDealClicked, onHitClicked, onStickClicked },
}: ButtonsProps) {
  const prePlay = gameState === "WaitingForStart" || gameState === "GameOver";
  const inPlay = gameState === "PlayerRound";
  return (
    <div className={styles.ButtonContainer}>
      {prePlay && <PrePlayButtons onDealClicked={onDealClicked} />}
      {inPlay && (
        <InPlayButtons
          onHitClicked={onHitClicked}
          onStickClicked={onStickClicked}
        />
      )}
    </div>
  );
}

export default Buttons;
