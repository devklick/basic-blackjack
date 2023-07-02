import Card from "../Card/Card";
import { Participant } from "../Table/hooks/useGame";
import { CardObject } from "../Card/card.types";

import styles from "./CardRow.module.scss";

export interface CardRowProps {
  cardOwner: Participant;
  cards: CardObject[];
}

const CardRow = (props: CardRowProps) => {
  return (
    <div className={styles.CardRow}>
      <div className={styles.CardOwner}>{props.cardOwner} Cards</div>
      <div className={styles.Cards}>
        {props.cards.map(({ facing, rank, suit }, i) => (
          <Card facing={facing} rank={rank} suit={suit} key={i}></Card>
        ))}
      </div>
    </div>
  );
};

export default CardRow;
