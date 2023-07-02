import { useRef } from "react";
import { DeckType, generateDeck } from "../../../utilities/deckUtilities";
import { CardObject, Facing } from "../card.types";

interface UseDeckProps {
  deckType: DeckType;
}

function useDeck({ deckType }: UseDeckProps = { deckType: "Standard" }) {
  const deck = useRef(generateDeck(deckType));

  /**
   * Takes the specified number of cards from the deck.
   * @param count The number of cards to take
   * @param facing The direction the card should be facing when revealed
   * @returns The cards that have been taken from the deck
   */
  function take(count = 1, facing: Facing = "Up"): CardObject[] {
    const cards = deck.current.slice(-count);
    cards.forEach((c) => (c.facing = facing));
    deck.current = deck.current.slice(0, -count);
    return cards;
  }

  /**
   * Initializes a new deck
   */
  function init() {
    deck.current = generateDeck(deckType);
  }

  return { take, init };
}

export default useDeck;
