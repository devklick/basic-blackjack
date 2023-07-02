import {
  CardObject,
  CardRankMetadataMap,
  CardSuitMetadataMap,
} from "./card.types";

import styles from "./Card.module.scss";

export interface CardProps extends CardObject {}

function Card({ rank, suit, facing }: CardProps) {
  const suitData = CardSuitMetadataMap[suit];
  const rankData = CardRankMetadataMap[rank];

  let color = suitData.color;
  let content: string[] = [rankData.symbol, suitData.symbol];

  if (facing === "Down") {
    color = "grey";
    content = ["?"];
  }

  return (
    <div className={styles.Card} style={{ backgroundColor: color }}>
      {content}
    </div>
  );
}

export default Card;
