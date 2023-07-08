import {
  CardObject,
  CardRankMetadataMap,
  CardSuitMetadataMap,
} from "./card.types";

import styles from "./Card.module.scss";

export type CardEffect = "highlight" | "dim" | "none";
export interface CardProps extends CardObject {
  effect: CardEffect;
}

function Card({ rank, suit, facing, effect }: CardProps) {
  const suitData = CardSuitMetadataMap[suit];
  const rankData = CardRankMetadataMap[rank];

  let color = suitData.color;
  let content: string[] = [rankData.symbol, suitData.symbol];

  if (facing === "Down") {
    color = "grey";
    content = ["?"];
  }

  const cardClasses = [
    styles.Card,
    effect === "dim" && styles.CardDim,
    effect === "highlight" && styles.CardHighlight,
  ].join(" ");

  return (
    <div className={styles.CardWrapper}>
      <div className={cardClasses} style={{ backgroundColor: color }}>
        <div className={styles.CardContent}>{content}</div>
      </div>
    </div>
  );
}

export default Card;
