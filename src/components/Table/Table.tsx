import { useState } from "react";
import CardRow from "../CardRow/CardRow";
import InfoHud from "../InfoHud/InfoHud";
import YesNoPopUp from "../YesNoPopUp/YesNoPopUp";
import useGame from "./hooks/useGame";

import styles from "./Table.module.scss";

const Table = () => {
  const game = useGame();
  const [showHitWarning, setShowHitWarning] = useState<boolean>(false);
  const [showStickWarning, setShowStickWarning] = useState<boolean>(false);

  const onDealClicked = (): void => {
    if (game.state !== "WaitingForStart" && game.state !== "GameOver") return;
    game.setup();
  };

  const onHitClicked = (overrideWarning: boolean = false) => {
    if (game.state !== "PlayerRound") return;

    if (game.getParticipantScore("Player") >= 18 && !overrideWarning) {
      setShowHitWarning(true);
      return;
    }

    game.dealCardsToParticipant("Player", 1);
  };

  const onStickClicked = (overrideWarning: boolean = false) => {
    if (game.state !== "PlayerRound") return;

    if (game.getParticipantScore("Player") <= 10 && !overrideWarning) {
      setShowStickWarning(true);
      return;
    }

    game.startDealerRound();
  };

  return (
    <div className={styles.Table}>
      {showHitWarning && (
        <YesNoPopUp
          onClickYes={() => {
            setShowHitWarning(false);
            onHitClicked(true);
          }}
          onClickNo={() => setShowHitWarning(false)}
        />
      )}
      {showStickWarning && (
        <YesNoPopUp
          onClickYes={() => {
            setShowStickWarning(false);
            onStickClicked(true);
          }}
          onClickNo={() => setShowStickWarning(false)}
        />
      )}
      <CardRow cardOwner={"Dealer"} cards={game.dealer.cards} />
      <CardRow cardOwner={"Player"} cards={game.player.cards} />
      <InfoHud
        gameState={game.state}
        outcome={game.outcome}
        clickHandlers={{
          onDealClicked,
          onHitClicked,
          onStickClicked,
        }}
        scoreBoardRows={[
          {
            participant: "Dealer",
            score: game.getParticipantScore("Dealer"),
            displayScore: game.dealer.allCardsVisible,
            totalWins: game.stats.dealerWins,
          },
          {
            participant: "Player",
            score: game.getParticipantScore("Player"),
            displayScore: true,
            totalWins: game.stats.playerWins,
          },
        ]}
      />
    </div>
  );
};

export default Table;
