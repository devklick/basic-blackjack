import React from 'react';
import Card, { CardObject } from '../Card/Card';
import styles from './CardRow.module.scss';

export interface CardRowProps {
  cardOwner: string;
  cards: CardObject[];
}

const CardRow = (props: CardRowProps) => {
  return (
    <div className={styles.CardRow}>
      {
        props.cards.length > 0
          ? <>
            <div className={styles.CardOwner}>{props.cardOwner} Cards</div>
            <div className={styles.Cards}>{props.cards.map(card => Card(card))}</div>
          </>
          : null
      }
    </div>
  )
}

export default CardRow;
