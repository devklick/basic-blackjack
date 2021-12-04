import React from 'react';
import { randomIntInRange } from '../../utilities/randomUtilities';
import Card, { CardObject, CardRank, CardSuit } from '../Card/Card';
import styles from './Deck.module.scss';

export enum DeckType {
  Standard
}

export interface DeckProps {
  type: DeckType
}

const shuffleDeck = (cards: CardObject[]): CardObject[] => {
  for (let n: number = 0; n < 10; n++) {
    const left = cards.slice(0, cards.length / 2);
    const right = cards.slice(cards.length / 2);
    let shuffled: CardObject[] = [];

    let l: number = 0;
    let r: number = 0;
    while (l < left.length) {
      // determine how many cards to take from the left side
      let take = randomIntInRange(1, 10);

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
      take = randomIntInRange(1, 10);

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
}

const generateDeck = (deckType: DeckType, shuffle: boolean = true): CardObject[] => {
  if (deckType !== DeckType.Standard) {
    throw new Error(`DeckType ${deckType} not yet supported.`);
  }
  const cards: CardObject[] = [];

  Object.keys(CardRank).forEach(rank => {
    Object.keys(CardSuit).forEach(suit => {
      const card: CardObject = {
        rank: CardRank[rank as keyof typeof CardRank],
        suit: CardSuit[suit as keyof typeof CardSuit]
      };
      const index = shuffle
        ? randomIntInRange(0, cards.length)
        : cards.length

      cards.splice(index, 0, card);
    })
  })

  return shuffle ? shuffleDeck(cards) : cards
}

const Deck: React.FC<DeckProps> = ({ type }) => {
  const cards = generateDeck(type);

  return (
    <div className={styles.Deck}>
      {cards.map(card => {
        return Card({ ...card });
      })}
    </div>
  );
}



export default Deck;
