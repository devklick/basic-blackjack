import Card from "../Card";
import { Participant } from "../Table";
import { CardObject } from "../Card";

import styles from "./CardRow.module.scss";
import React from "react";
import { CardEffect } from "../Card/Card";

export interface CardRowProps {
  cardOwner: Participant;
  cards: CardObject[];
  effect: CardEffect;
  children?: React.ReactNode;
}

const CardRow = ({ cardOwner, cards, effect, children }: CardRowProps) => {
  return (
    <div className={styles.CardRow}>
      <div className={styles.CardOwner}>
        <span>{cardOwner} Cards</span>
        {/* 
          Pretty hacky, but the settings icon is passed 
          into this row as a child element
        */}
        {children}
      </div>
      <div className={styles.Cards}>
        {cards.map(({ facing, rank, suit }, i) => (
          <Card
            facing={facing}
            rank={rank}
            suit={suit}
            key={i}
            effect={effect}
          />
        ))}
      </div>
    </div>
  );
};

export default CardRow;
