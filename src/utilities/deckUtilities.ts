import {
  CardObject,
  CardRankMetadataMap,
  CardRanks,
  CardSuits,
  Facing,
} from "../components/Card/Card";
import { Participant } from "../components/Table/Table";
import { randomIntInRange } from "./randomUtilities";

export type DeckType = "Standard";

/**
 * An over-engineered shuffle implementation designed to emulate the riffle-shuffle.
 * @param cards The cards to be shuffled.
 * @returns The shuffled cards
 */
export const shuffleDeck = (cards: CardObject[]): CardObject[] => {
  for (let n: number = 0; n < 3; n++) {
    // cut the deck roughly in half
    const halfway = cards.length / 2;
    const splitAt = randomIntInRange(halfway - 3, halfway + 3);
    const left = cards.slice(0, splitAt);
    const right = cards.slice(splitAt);

    let shuffled: CardObject[] = [];

    let l: number = 0;
    let r: number = 0;
    while (l < left.length) {
      // determine how many cards to take from the left side
      let take = randomIntInRange(0, 3);

      // if we're taking more than is available, or there's no cards left on the right side,
      // take the remaining cards on the left side
      if (l + take > left.length || r >= right.length) {
        take = left.length - l;
      }

      // take the cards and add them to the shuffled deck
      shuffled = shuffled.concat(left.slice(l, l + take));

      // set the counter so we know which cards have already been taken from the left side
      l += take;

      // determine how many cards to take from the right side
      take = randomIntInRange(0, 3);

      // if we're taking more than is available, or there's no cards left on the left side,
      // take the remaining cards from the right side.
      if (r + take > right.length || l >= left.length) {
        take = right.length - r;
      }

      // take the cards and add them to the shuffled deck
      shuffled = shuffled.concat(right.slice(r, r + take));

      // set the counter so we know which cards have already been taken from the right side
      r += take;
    }
    cards = shuffled;
  }

  return cards;
};

export const generateDeck = (
  deckType: DeckType,
  shuffle: boolean = true
): CardObject[] => {
  if (deckType !== "Standard") {
    throw new Error(`DeckType ${deckType} not yet supported.`);
  }
  const cardIndexes = [...Array(52).keys()]; // 0-51
  const cards: CardObject[] = [];

  Object.values(CardRanks).forEach((rank) => {
    Object.values(CardSuits).forEach((suit) => {
      const card: CardObject = { rank, suit, facing: "Up" };

      // If the deck is to be shuffled, lets create it with cards
      // in a random order to get a head start. Select a random index
      // where the card should be inserted into the deck.
      const index = shuffle
        ? cardIndexes[randomIntInRange(0, cardIndexes.length - 1)]
        : cards.length;

      // Insert the card into the deck
      cards[index] = card;

      const indexOfIndex = cardIndexes.indexOf(index);
      cardIndexes.splice(indexOfIndex, 1);
    });
  });

  return shuffle ? shuffleDeck(cards) : cards;
};

export interface CardValue {
  card: CardObject;
  rankValueUsed: number;
  rankRelativeValueUsed: number;
}
export interface BestHand {
  score: number;
  cards: CardValue[];
}

/**
 * Calculates the best hand, i.e. the closest to 21, for the set of cards.
 * @param cards The cards to be checked
 * @returns {BestHand} The best hand that can be achieved with the input cards
 */
export const calculateBestHand = (cards: CardObject[]): BestHand => {
  const bestHand: BestHand = {
    cards: [],
    score: 0,
  };

  let aceCount = 0;
  cards.forEach((card) => {
    if (card.rank === "Ace") {
      aceCount++;
    }

    const cardValue = Math.max(...CardRankMetadataMap[card.rank].values);
    const cardRelativeValue = Math.max(
      ...CardRankMetadataMap[card.rank].relativeValues
    );
    bestHand.cards.push({
      card,
      rankRelativeValueUsed: cardRelativeValue,
      rankValueUsed: cardValue,
    });
    bestHand.score += cardValue;
  });

  for (let i = 0; i < aceCount; i++) {
    if (bestHand.score <= 21) {
      break;
    }
    bestHand.cards.find((c) => c.rankValueUsed === 11)!.rankValueUsed -= 10;
    bestHand.score -= 10;
  }

  return bestHand;
};

export interface GameResult {
  /**
   * The participant who won the game.
   * It's possible for a game to draw, in which case winner will be null.
   */
  winner?: Participant | null;
  /**
   * The test to be displayed to the user regarding the winner.
   */
  winnerText: string;
}

/**
 * Checks the player's hand against the dealers hand and determines who the winner is.
 * @param playerHand The players hand
 * @param dealerHand The dealers hand
 * @returns The result of the game; who won and why.
 */
export const determineWinner = (
  playerHand: BestHand,
  dealerHand: BestHand
): GameResult => {
  if (playerHand.score > dealerHand.score) {
    return {
      winner: "Player",
      winnerText: "Player wins with a high score",
    };
  }
  if (dealerHand.score > playerHand.score) {
    return {
      winner: "Dealer",
      winnerText: "Dealer wins with a high score",
    };
  }
  if (playerHand.cards.length > dealerHand.cards.length) {
    return {
      winner: "Player",
      winnerText: "Player wins with the most cards",
    };
  }
  if (dealerHand.cards.length > playerHand.cards.length) {
    return {
      winner: "Dealer",
      winnerText: "Dealer wins with the most cards",
    };
  }
  const cardCount = playerHand.cards.length;
  let currentCardIndex = 0;
  while (currentCardIndex < cardCount) {
    if (
      playerHand.cards[currentCardIndex].rankValueUsed >
      dealerHand.cards[currentCardIndex].rankValueUsed
    ) {
      return {
        winner: "Player",
        winnerText: "Player wins with a high card",
      };
    }
    if (
      dealerHand.cards[currentCardIndex].rankValueUsed >
      playerHand.cards[currentCardIndex].rankValueUsed
    ) {
      return {
        winner: "Dealer",
        winnerText: "Dealer wins with a high card",
      };
    }
  }
  return {
    winner: null,
    winnerText: "Draw! Same hand value, number of cards, and card ranks!",
  };
};
