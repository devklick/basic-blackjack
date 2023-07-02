import { useState } from "react";
import CardRow from "../CardRow";
import InfoHud from "../InfoHud";
import YesNoPopUp from "../YesNoPopUp";
import { useGame } from ".";
import { ScoreBoardRow } from "../ScoreBoard";
import { useGameSettingsStore } from "../../stores/gameSettingsStore";

import styles from "./Table.module.scss";

const Table = ({ hide = false }: { hide?: boolean }) => {
  const game = useGame();
  const { hitWarningsEnabled, stickWarningsEnabled } = useGameSettingsStore();
  const [showHitWarning, setShowHitWarning] = useState<boolean>(false);
  const [showStickWarning, setShowStickWarning] = useState<boolean>(false);

  const onDealClicked = (): void => {
    if (game.state !== "WaitingForStart" && game.state !== "GameOver") return;
    game.setup();
  };

  const onHitClicked = (overrideWarning: boolean = false) => {
    if (game.state !== "PlayerRound") return;

    if (
      hitWarningsEnabled &&
      game.getParticipantScore("Player") >= 18 &&
      !overrideWarning
    ) {
      setShowHitWarning(true);
      return;
    }

    game.dealCardsToParticipant("Player", 1);
  };

  const onStickClicked = (overrideWarning: boolean = false) => {
    if (game.state !== "PlayerRound") return;

    if (
      stickWarningsEnabled &&
      game.getParticipantScore("Player") <= 10 &&
      !overrideWarning
    ) {
      setShowStickWarning(true);
      return;
    }

    game.startDealerRound();
  };

  function getHitWarning() {
    return (
      <YesNoPopUp
        type="hit-on-high"
        onClickNo={() => setShowHitWarning(false)}
        onClickYes={() => {
          setShowHitWarning(false);
          onHitClicked(true);
        }}
      />
    );
  }

  function getStickWarning() {
    return (
      <YesNoPopUp
        type="stick-on-low"
        onClickNo={() => setShowStickWarning(false)}
        onClickYes={() => {
          setShowStickWarning(false);
          onStickClicked(true);
        }}
      />
    );
  }

  function getScoreBoardRows(): ScoreBoardRow[] {
    return [
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
    ];
  }

  return (
    <div className={styles.Table} style={{ display: hide ? "none" : "" }}>
      {showHitWarning && getHitWarning()}
      {showStickWarning && getStickWarning()}
      <CardRow cardOwner={"Dealer"} cards={game.dealer.cards} />
      <CardRow cardOwner={"Player"} cards={game.player.cards} />
      <InfoHud
        gameState={game.state}
        outcome={game.outcome}
        scoreBoardRows={getScoreBoardRows()}
        clickHandlers={{
          onDealClicked,
          onHitClicked,
          onStickClicked,
        }}
      />
    </div>
  );
};

export default Table;
