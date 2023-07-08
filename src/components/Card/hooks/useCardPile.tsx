import { useRef, useState } from "react";
import { CardObject, Facing } from "../card.types";
import { BestHand, calculateBestHand } from "../../../utilities/deckUtilities";
import useAudioPlayer from "../../Table/hooks/useAudioPlayer";

const defaultBestHand: BestHand = { cards: [], score: 0 };
/**
 * A hook that represents a pile of cards and encapsulates
 * the various actions that need to be performed on the pile of cards.
 */
export function useCardPile() {
  const [cards, setCardsState] = useState<CardObject[]>([]);
  const bestHand = useRef<BestHand>(defaultBestHand);
  const bust = useRef<boolean>(false);
  const fiveCardTrick = useRef<boolean>(false);
  const allCardsVisible = useRef<boolean>(false);
  const {play} = useAudioPlayer();

  /**
   * Add cards to the pile
   * @param cardsToAdd The cards to be added to the pile
   * @param facing The direction the card should be facing when placed in the pile
   */
  function addCards(cardsToAdd: CardObject[], facing: Facing | null = null) {
    cardsToAdd.forEach(card => {
      play('cardDealt');
      if (facing) card.facing = facing;
    });
    setCards([...cards].concat(cardsToAdd));
  }

  /**
   * Clears existing cards and re-initializes the pile
   * with the specified cards
   * @param cardsToSet The cards that should make up the entire card pile
   */
  function setCards(cardsToSet: CardObject[]) {
    let allVisible = true;
    for (const card of cardsToSet) {
      if (card.facing === "Down") {
        allVisible = false;
      }
    }
    allCardsVisible.current = allVisible;

    bestHand.current = calculateBestHand(cardsToSet);
    bust.current = bestHand.current.score > 21;
    if (cardsToSet.length === 5 && bestHand.current.score <= 21) {
      fiveCardTrick.current = true;
    }
    setCardsState(cardsToSet);
  }

  /**
   * Update all cards to face the specified direction
   * @param facing The direction that all cards should face
   */
  function setCardsFacing(facing: Facing) {
    setCards(
      [...cards].map((c) => {
        c.facing = facing;
        return c;
      })
    );
  }

  return {
    /**
     * The cards currently in the pile
     */
    cards,

    /**
     * The best hand that can be made out of the cards in the pile
     */
    hand: bestHand.current,

    /**
     * Whether or not the hand exceeds the maximum allowed score
     */
    bust: bust.current,

    /**
     * Whether or not all cards are facing up.
     */
    allCardsVisible: allCardsVisible.current,

    /**
     * Whether or not this pile contains five cards
     * totalling less than or equal to the maximum allows score.
     */
    fiveCardTrick: fiveCardTrick.current,

    addCards,
    setCards,
    setCardsFacing,
  };
}
