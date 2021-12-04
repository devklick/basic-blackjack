import React from 'react';
import styles from './Card.module.scss';

export enum CardSuit {
  Diamond = 'Diamond',
  Heart = 'Heart',
  Club = 'Club',
  Spade = 'Spade'
};

export interface CardSuitMetadata {
  colour: string;
  symbol: string;
}

export interface ICardSuitMetadataMap {
  [CardSuit.Club]: CardSuitMetadata;
  [CardSuit.Diamond]: CardSuitMetadata;
  [CardSuit.Heart]: CardSuitMetadata;
  [CardSuit.Spade]: CardSuitMetadata;
}

export const CardSuitMetadataMap: ICardSuitMetadataMap = {
  [CardSuit.Club]: { colour: "black", symbol: '♣' },
  [CardSuit.Diamond]: { colour: "red", symbol: '♦' },
  [CardSuit.Heart]: { colour: "red", symbol: '♥' },
  [CardSuit.Spade]: { colour: "black", symbol: '♠' }
}

export enum CardRank {
  Ace = 'Ace',
  Two = 'Two',
  Three = 'Three',
  Four = 'Four',
  Five = 'Five',
  Six = 'Six',
  Seven = 'Seven',
  Eight = 'Eight',
  Nine = 'Nine',
  Ten = 'Ten',
  Jack = 'Jack',
  Queen = 'Queen',
  King = 'King',
}

export interface CardRankMetadata {
  values: number[];
  symbol: string;
}

export interface ICardRankMetadataMap {
  [CardRank.Ace]: CardRankMetadata;
  [CardRank.Two]: CardRankMetadata;
  [CardRank.Three]: CardRankMetadata;
  [CardRank.Four]: CardRankMetadata;
  [CardRank.Five]: CardRankMetadata;
  [CardRank.Six]: CardRankMetadata;
  [CardRank.Seven]: CardRankMetadata;
  [CardRank.Eight]: CardRankMetadata;
  [CardRank.Nine]: CardRankMetadata;
  [CardRank.Ten]: CardRankMetadata;
  [CardRank.Jack]: CardRankMetadata;
  [CardRank.Queen]: CardRankMetadata;
  [CardRank.King]: CardRankMetadata;
}

export const CardRankMetadataMap: ICardRankMetadataMap = {
  [CardRank.Ace]: { values: [1, 14], symbol: 'A' },
  [CardRank.Two]: { values: [2], symbol: '2' },
  [CardRank.Three]: { values: [3], symbol: '3' },
  [CardRank.Four]: { values: [4], symbol: '4' },
  [CardRank.Five]: { values: [5], symbol: '5' },
  [CardRank.Six]: { values: [6], symbol: '6' },
  [CardRank.Seven]: { values: [7], symbol: '7' },
  [CardRank.Eight]: { values: [8], symbol: '8' },
  [CardRank.Nine]: { values: [9], symbol: '9' },
  [CardRank.Ten]: { values: [10], symbol: '10' },
  [CardRank.Jack]: { values: [11], symbol: 'J' },
  [CardRank.Queen]: { values: [12], symbol: 'Q' },
  [CardRank.King]: { values: [13], symbol: 'K' },
}

export interface CardObject {
  suit: CardSuit;
  rank: CardRank;
}

export interface CardProps extends CardObject { }

const Card: React.FC<CardProps> = ({ rank, suit }) => {
  const suitData = CardSuitMetadataMap[suit];
  const rankData = CardRankMetadataMap[rank];
  return (
    <div className={styles.Card} style={{ backgroundColor: suitData.colour }}>
      {rankData.symbol}
      {suitData.symbol}
    </div>
  )
};

export default Card;
