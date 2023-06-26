import React from "react";
import styles from "./Card.module.scss";
import "../../StyleConstants.scss";

export const CardSuits = {
  Diamond: "Diamond",
  Heart: "Heart",
  Club: "Club",
  Spade: "Spade",
} as const;

export type CardSuit = (typeof CardSuits)[keyof typeof CardSuits];

export const CardRanks = {
  Ace: "Ace",
  Two: "Two",
  Three: "Three",
  Four: "Four",
  Five: "Five",
  Six: "Six",
  Seven: "Seven",
  Eight: "Eight",
  Nine: "Nine",
  Ten: "Ten",
  Jack: "Jack",
  Queen: "Queen",
  King: "King",
} as const;

export type CardRank = (typeof CardRanks)[keyof typeof CardRanks];

interface CardSuitMetadata {
  color: string;
  symbol: string;
}

export const CardSuitMetadataMap: Record<CardSuit, CardSuitMetadata> = {
  Club: { color: "#000000", symbol: "♣" },
  Diamond: { color: "#c01f1f", symbol: "♦" },
  Heart: { color: "#c01f1f", symbol: "♥" },
  Spade: { color: "#000000", symbol: "♠" },
};

interface CardRankMetadata {
  values: number[];
  symbol: string;
  relativeValues: number[];
}

export const CardRankMetadataMap: Record<CardRank, CardRankMetadata> = {
  Ace: { values: [1, 11], relativeValues: [1, 14], symbol: "A" },
  Two: { values: [2], relativeValues: [2], symbol: "2" },
  Three: { values: [3], relativeValues: [3], symbol: "3" },
  Four: { values: [4], relativeValues: [4], symbol: "4" },
  Five: { values: [5], relativeValues: [5], symbol: "5" },
  Six: { values: [6], relativeValues: [6], symbol: "6" },
  Seven: { values: [7], relativeValues: [7], symbol: "7" },
  Eight: { values: [8], relativeValues: [8], symbol: "8" },
  Nine: { values: [9], relativeValues: [9], symbol: "9" },
  Ten: { values: [10], relativeValues: [10], symbol: "10" },
  Jack: { values: [10], relativeValues: [11], symbol: "J" },
  Queen: { values: [10], relativeValues: [12], symbol: "Q" },
  King: { values: [10], relativeValues: [13], symbol: "K" },
};

export const FacingDirections = {
  Up: "Up",
  Down: "Down",
} as const;

export type Facing = (typeof FacingDirections)[keyof typeof FacingDirections];

export interface CardObject {
  suit: CardSuit;
  rank: CardRank;
  facing: Facing;
}

export interface CardProps extends CardObject {}

const Card: React.FC<CardProps> = ({ rank, suit, facing }) => {
  const suitData = CardSuitMetadataMap[suit];
  const rankData = CardRankMetadataMap[rank];
  return (
    <>
      {facing === "Down" ? (
        <div className={styles.Card} style={{ backgroundColor: "grey" }}>
          ?
        </div>
      ) : (
        <div
          className={styles.Card}
          style={{ backgroundColor: suitData.color }}
        >
          {rankData.symbol}
          {suitData.symbol}
        </div>
      )}
    </>
  );
};

export default Card;
