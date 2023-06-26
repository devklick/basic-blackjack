import { useEffect, useState } from "react";
import {
  BestHand,
  calculateBestHand,
  determineWinner,
  generateDeck,
} from "../../utilities/deckUtilities";
import { CardObject } from "../Card/Card";
import CardRow from "../CardRow/CardRow";
import InfoHud from "../InfoHud/InfoHud";
import YesNoPopUp from "../YesNoPopUp/YesNoPopUp";
import styles from "./Table.module.scss";

export type GameState =
  | "WaitingForStart"
  | "DealingCards"
  | "PlayerRound"
  | "DealerRound"
  | "Result";

export type Participant = "Dealer" | "Player";

const Table = () => {
  const [gameState, setGameState] = useState<GameState>("WaitingForStart");
  const [deckCards, setDeckCards] = useState<CardObject[]>([]);
  const [playerCards, setPlayerCards] = useState<CardObject[]>([]);
  const [dealerCards, setDealerCards] = useState<CardObject[]>([]);
  const defaultBestHand: BestHand = { cards: [], score: 0 };
  const [playerHand, setPlayerHand] = useState<BestHand>(defaultBestHand);
  const [dealerHand, setDealerHand] = useState<BestHand>(defaultBestHand);
  const [outcome, setOutcome] = useState<string | undefined>();
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [showDealerScore, setShowDealerScore] = useState<boolean>(false);
  const [totalPlayerWins, setTotalPlayerWins] = useState<number>(0);
  const [totalDealerWins, setTotalDealerWins] = useState<number>(0);
  const [showHitWarningYesNoPopUp, setShowHitWarningYesNoPopUp] =
    useState<boolean>(false);
  const [showStickWarningYesNoPopUp, setShowStickWarningYesNoPopUp] =
    useState<boolean>(false);

  /**
   * Performs the various relevant actions when a game has reached a result.
   * @param outcomeText The text to be displayed to describe the outcome
   * @param winner The participant that won the game
   */
  const setResult = (
    outcomeText: string,
    winner?: Participant | null
  ): void => {
    setGameState("Result");
    setOutcome(outcomeText);
    setGameOver(true);
    if (winner === "Dealer") {
      setTotalDealerWins((current) => current + 1);
    } else if (winner === "Player") {
      setTotalPlayerWins((current) => current + 1);
    }
  };
  /**
   * When a change to the dealerCars happens, this effect
   * will calculate the dealers score and whether or not
   * the player is bust or hits a five card trick
   * @todo //TODO: Need to determine winner properly.
   */
  useEffect(() => {
    const _playerHand = calculateBestHand(playerCards);
    setPlayerHand(_playerHand);

    if (_playerHand.score > 21) {
      return setResult("Player bust, dealer wins!", "Dealer");
    }
    if (playerCards.length === 5 && _playerHand.score <= 21) {
      return setResult("Player wins with a five card trick!", "Player");
    }

    const _dealerHand = calculateBestHand(dealerCards);
    setDealerHand(_dealerHand);

    if (_dealerHand.score > 21) {
      return setResult("Dealer bust, player wins!", "Player");
    }
    if (dealerCards.length === 5 && _dealerHand.score <= 21) {
      return setResult("Dealer wins with a five card trick!", "Dealer");
    }
  }, [playerCards, dealerCards]);

  /**
   * This effect calculates the outcome when all participants
   * have played their cards and no one has went bust, i.e. the
   * game has reached the resulting state.
   */
  useEffect(() => {
    if (gameState === "Result" && !gameOver) {
      const gameResult = determineWinner(playerHand, dealerHand);

      setResult(gameResult.winnerText, gameResult.winner);
    }
  }, [gameState, playerHand, dealerHand, gameOver]);

  /**
   * Handles the onClickStart event and starts a new game.
   * Deals a card facing up to player, a card facing up to dealer,
   * another card facing up to player, and finally a card cafing down to dealer
   */
  const clickStartHandler = (): void => {
    if (gameState !== "WaitingForStart" && !gameOver) {
      return;
    }
    setShowDealerScore(false);
    setGameOver(false);
    setPlayerCards([]);
    setDealerCards([]);
    setPlayerHand(defaultBestHand);
    setDealerHand(defaultBestHand);
    setGameState("DealingCards");

    let _deck = generateDeck("Standard");

    const _playerCards: CardObject[] = [];
    const _dealerCards: CardObject[] = [];

    let cardToDeal: CardObject = _deck[_deck.length - 1];
    _deck = _deck.slice(0, _deck.length - 1);
    setDeckCards(_deck);
    _playerCards.push(cardToDeal);
    setPlayerCards(_playerCards);

    cardToDeal = _deck[_deck.length - 1];
    _deck = _deck.slice(0, _deck.length - 1);
    setDeckCards(_deck);
    _dealerCards.push(cardToDeal);
    setDealerCards(_dealerCards);

    cardToDeal = _deck[_deck.length - 1];
    _deck = _deck.slice(0, _deck.length - 1);
    setDeckCards(_deck);
    _playerCards.push(cardToDeal);
    setPlayerCards(_playerCards);

    cardToDeal = _deck[_deck.length - 1];
    cardToDeal.facing = "Down";
    _deck = _deck.slice(0, _deck.length - 1);
    setDeckCards(_deck);
    _dealerCards.push(cardToDeal);
    setDealerCards(_dealerCards);

    setGameState("PlayerRound");
  };

  /**
   * Handles the onClickHit event, taking a card from
   * the deck and giving it to the player
   */
  const clickHitHandler = (overrideWarning: boolean = false) => {
    if (gameState !== "PlayerRound") {
      return;
    }

    if (playerHand.score >= 18 && !overrideWarning) {
      setShowHitWarningYesNoPopUp(true);
      return;
    }

    const card = deckCards[deckCards.length - 1];
    const updatedDeck = deckCards.slice(0, deckCards.length - 1);

    setDeckCards(updatedDeck);
    const updatedPlayerCards = [...playerCards];
    updatedPlayerCards.push(card);
    setPlayerCards(updatedPlayerCards);
  };

  /**
   * Handles the onClickStick event and performs the dealers betting.
   */
  const clickStickHandler = (overrideWarning: boolean = false) => {
    if (gameState !== "PlayerRound") {
      return;
    }

    if (playerHand.score <= 10 && !overrideWarning) {
      setShowStickWarningYesNoPopUp(true);
      return;
    }

    setGameState("DealerRound");

    const _dealerCards = [...dealerCards];
    _dealerCards.forEach((card) => (card.facing = "Up"));
    setShowDealerScore(true);

    let updatedDeck = [...deckCards];

    let score = calculateBestHand(_dealerCards).score;

    while (_dealerCards.length < 5) {
      if (score >= 16 && score >= playerHand.score) {
        break;
      }
      _dealerCards.push(updatedDeck[updatedDeck.length - 1]);
      updatedDeck = updatedDeck.slice(0, updatedDeck.length - 1);
      setDeckCards(updatedDeck);
      setDealerCards(_dealerCards);

      score = calculateBestHand(_dealerCards).score;
    }
    setTimeout(() => setGameState("Result"), 10);
  };

  return (
    <>
      <div className={styles.Table}>
        {showHitWarningYesNoPopUp ? (
          <YesNoPopUp
            message="Are you sure?"
            onClickYes={() => {
              setShowHitWarningYesNoPopUp(false);
              clickHitHandler(true);
            }}
            onClickNo={() => setShowHitWarningYesNoPopUp(false)}
          />
        ) : null}
        {showStickWarningYesNoPopUp ? (
          <YesNoPopUp
            message="Are you sure?"
            onClickYes={() => {
              setShowStickWarningYesNoPopUp(false);
              clickStickHandler(true);
            }}
            onClickNo={() => setShowStickWarningYesNoPopUp(false)}
          />
        ) : null}
        <CardRow cardOwner={"Dealer"} cards={dealerCards} />
        <CardRow cardOwner={"Player"} cards={playerCards} />
        <InfoHud
          gameOver={gameOver}
          gameState={gameState}
          outcome={outcome}
          clickStartHandler={clickStartHandler}
          clickHitHandler={() => clickHitHandler(false)}
          clickStickHandler={() => clickStickHandler(false)}
          scoreBoardRows={[
            {
              participant: "Dealer",
              score: dealerHand.score,
              displayScore: showDealerScore,
              totalWins: totalDealerWins,
            },
            {
              participant: "Player",
              score: playerHand.score,
              displayScore: true,
              totalWins: totalPlayerWins,
            },
          ]}
        />
      </div>
    </>
  );
};

export default Table;
