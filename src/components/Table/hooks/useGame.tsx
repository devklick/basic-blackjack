import { useEffect, useState } from "react";
import { useGameStats } from "../../InfoHud";
import { determineWinner } from "../../../utilities/deckUtilities";
import { Facing, useCardPile, useDeck } from "../../Card";
import useAudioPlayer from "./useAudioPlayer";

export type GameState =
  | "WaitingForStart"
  | "DealPlayerCard"
  | "DealDealerCard"
  | "PlayerRound"
  | "DealerRound"
  | "Result"
  | "GameOver";

export type Participant = "Player" | "Dealer";
export type Winner = Participant | "none";
export type WinType =
  | "opponent-bust"
  | "five-card-trick"
  | "high-score"
  | "most-cards"
  | "high-card"
  | "draw";

/**
 * A delay used to prevent actions from happening too quickly,
 * which would detract from the user experience in the UI.
 *
 * For example, this delay happens between cards being dealt,
 * and between the final card being dealt and the result being displayed.
 */
const delayBetweenActions = 400;

export function useGame() {
  const [state, setState] = useState<GameState>("WaitingForStart");
  const [outcome, setOutcome] = useState<string | null>(null);
  const [winner, setWinner] = useState<Winner>("none");

  const deck = useDeck();
  const player = useCardPile();
  const dealer = useCardPile();
  const stats = useGameStats();
  const { play } = useAudioPlayer();

  const dealPlayerCard = state === "DealPlayerCard";
  const dealDealerCard = state === "DealDealerCard";
  const resultGame = state === "Result";
  const dealerRound = state === "DealerRound";

  /**
   * Takes card of determining the winner
   * when the game state changes to Result
   */
  useEffect(() => {
    if (!resultGame) return;

    const gameResult = determineWinner(player.hand, dealer.hand);

    const timeout = setResult(gameResult.winnerText, gameResult.winner);

    return () => {
      clearTimeout(timeout);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resultGame]);

  /**
   * While cards are being dealt, this effect
   * will check if the players new card has caused them
   * to go bust or hit a five card trick.
   */
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (player.bust) {
      timeout = setResult("Player bust, dealer wins!", "Dealer");
    } else if (player.fiveCardTrick) {
      timeout = setResult("Player wins with a five card trick!", "Player");
    }
    return () => {
      timeout && clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player.bust, player.fiveCardTrick]);

  /**
   * Logic for dealer to decide whether to Hit or Stick.
   */
  useEffect(() => {
    if (!dealerRound) return;

    const dealerScore = getParticipantScore("Dealer");
    const playerScore = getParticipantScore("Player");

    let timeout: NodeJS.Timeout | undefined;

    if (dealer.bust) {
      timeout = setResult("Dealer bust, player wins!", "Player");
    } else if (dealer.fiveCardTrick) {
      timeout = setResult("Dealer wins with a five card trick!", "Dealer");
    }
    // Dealer has to hit if they've got less than 16 or less than the players score.
    else if (dealerScore >= 16 && dealerScore > playerScore) {
      setState("Result");
    } else {
      timeout = setTimeout(
        () => dealCardsToParticipant("Dealer", 1),
        delayBetweenActions
      );
    }

    return () => {
      clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dealerRound, dealer.cards, dealer.bust, dealer.fiveCardTrick]);

  /**
   * Deals a single card to the players pile
   * them changes state to allow the next card to
   * be dealt to the dealer.
   */
  useEffect(() => {
    if (!dealPlayerCard) return;

    const timeout = setTimeout(() => {
      player.addCards(deck.take(1));
      setState("DealDealerCard");
    }, delayBetweenActions);

    return () => {
      clearTimeout(timeout);
    };
  }, [dealPlayerCard, deck, player]);

  /**
   * Deals a single card to the dealers pile, then
   * changes state to either allow the next card to be dealt
   * to the player or the allow the player to decide whether to hit or stick
   */
  useEffect(() => {
    if (!dealDealerCard) return;

    const cardCountBefore = dealer.cards.length;
    const timeout = setTimeout(() => {
      const facing: Facing = cardCountBefore === 0 ? "Up" : "Down";
      dealer.addCards(deck.take(1), facing);

      if (cardCountBefore === 1) {
        setState("PlayerRound");
      } else {
        setState("DealPlayerCard");
      }
    }, delayBetweenActions);

    return () => {
      clearTimeout(timeout);
    };
  }, [dealDealerCard, deck, dealer]);

  /**
   * Caries out the actions required to set up a new game.
   */
  function setup() {
    setOutcome(null);
    setWinner("none");
    deck.init();

    player.setCards([]);
    dealer.setCards([]);

    setState("DealPlayerCard");
  }

  /**
   * Starts the process of the dealer round,
   * where the dealer will need to decide whether to hit or stick
   */
  function startDealerRound() {
    setState("DealerRound");

    dealer.setCardsFacing("Up");
  }

  /**
   * Gets the current score for the given participant.
   * Convenience function that wraps around `<participant>.hand.score`.
   * @param participant The participant who's score should be returned
   */
  function getParticipantScore(participant: Participant) {
    switch (participant) {
      case "Dealer":
        return dealer.hand.score;
      case "Player":
        return player.hand.score;
      default:
        throw new Error("WHO ARE YOU?!");
    }
  }

  /**
   * Takes the specified number of cards from the deck
   * and deals them to the specified participants card pile.
   * @param participant The participant to deal the cards to
   * @param count The number of cards to deal
   */
  function dealCardsToParticipant(participant: Participant, count = 1) {
    const cards = deck.take(count);

    switch (participant) {
      case "Dealer":
        dealer.addCards(cards);
        break;
      case "Player":
        player.addCards(cards);
        break;
      default:
        throw new Error("WHO ARE YOU?!");
    }
  }

  /**
   * Function to be called when the outcome of the game has been determined.
   * @param outcomeText The text to be displayed to describe the outcome
   * @param winner The participant that won the game, if any.
   */
  function setResult(
    outcomeText: string,
    winner?: Participant | null
  ): NodeJS.Timeout {
    return setTimeout(() => {
      setState("GameOver");
      setOutcome(outcomeText);
      setWinner(winner ?? "none");
      if (winner) {
        play(winner === "Player" ? "roundWon" : "roundLost");
      }

      winner && stats.updateWinnerStats(winner);
    }, delayBetweenActions);
  }

  return {
    /**
     * The current state of the game
     */
    state,
    /**
     * Information about the players cards and
     * functionality to interact with them
     */
    player,
    /**
     * Information about the dealers cards and
     * functionality to interact with them
     */
    dealer,
    /**
     * The outcome of the current game, if it has been determined yet
     */
    outcome,
    /**
     * Statistics about the games played during this session.
     */
    stats,

    /**
     * The participant who won the round, if any.
     */
    winner,
    setup,
    startDealerRound,
    getParticipantScore,
    dealCardsToParticipant,
  };
}
