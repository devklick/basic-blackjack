import Card from "../Card";
import { Participant } from "../Table";
import { CardObject } from "../Card";

import styles from "./CardRow.module.scss";
import React from "react";

export interface CardRowProps {
  cardOwner: Participant;
  cards: CardObject[];
  children?: React.ReactNode;
}

const CardRow = (props: CardRowProps) => {
  return (
    <div className={styles.CardRow}>
      <div className={styles.CardOwner}>
        <span>{props.cardOwner} Cards</span>
        {/* 
          Pretty hacky, but the settings icon is passed 
          into this row as a child element
        */}
        {props.children}
      </div>
      <div className={styles.Cards}>
        {props.cards.map(({ facing, rank, suit }, i) => (
          <Card facing={facing} rank={rank} suit={suit} key={i}></Card>
        ))}
      </div>
    </div>
  );
};

export default CardRow;
