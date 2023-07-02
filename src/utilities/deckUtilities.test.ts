import { CardRankMetadataMap } from "../components/Card";
import { determineWinner, BestHand } from "./deckUtilities";
describe("deckUtilities", () => {
  describe("determineWinner", () => {
    let dealerHand: BestHand;
    let playerHand: BestHand;

    beforeEach(() => {
      dealerHand = {
        cards: [
          {
            card: { facing: "Up", rank: "Ace", suit: "Club" },
            rankRelativeValueUsed: Math.min(
              ...CardRankMetadataMap["Ace"].relativeValues
            ),
            rankValueUsed: Math.min(...CardRankMetadataMap["Ace"].values),
          },
        ],
        score: 1,
      };
      playerHand = {
        cards: [
          {
            card: { facing: "Up", rank: "Ace", suit: "Diamond" },
            rankRelativeValueUsed: Math.min(
              ...CardRankMetadataMap["Ace"].relativeValues
            ),
            rankValueUsed: Math.min(...CardRankMetadataMap["Ace"].values),
          },
        ],
        score: 1,
      };
    });

    describe("Winner based on score", () => {
      it("Should return Dealer when dealer score is greater than player score", () => {
        dealerHand.score = playerHand.score + 1;
        const result = determineWinner(playerHand, dealerHand);
        expect(result.winner).toBe("Dealer");
        expect(result.winnerText).toBe("Dealer wins with a high score");
      });
      it("Should return Player when player score is greater than dealer score", () => {
        playerHand.score = dealerHand.score + 1;
        const result = determineWinner(playerHand, dealerHand);
        expect(result.winner).toBe("Player");
        expect(result.winnerText).toBe("Player wins with a high score");
      });
    });

    describe("Winner based on number of cards", () => {
      it("Should return Dealer when dealer has more cards than player", () => {
        dealerHand.cards.push({
          card: { facing: "Up", rank: "Eight", suit: "Diamond" },
          rankRelativeValueUsed: 8,
          rankValueUsed: 8,
        });
        dealerHand.score = playerHand.score;
        const result = determineWinner(playerHand, dealerHand);
        expect(result.winner).toBe("Dealer");
        expect(result.winnerText).toBe("Dealer wins with the most cards");
      });

      it("Should return Player when player has more cards than player", () => {
        playerHand.cards.push({
          card: { facing: "Up", rank: "Eight", suit: "Diamond" },
          rankRelativeValueUsed: 8,
          rankValueUsed: 8,
        });
        playerHand.score = dealerHand.score;
        const result = determineWinner(playerHand, dealerHand);
        expect(result.winner).toBe("Player");
        expect(result.winnerText).toBe("Player wins with the most cards");
      });
    });

    describe("Winner based on high card", () => {
      it("Should return Dealer when dealers high card is greater than players", () => {
        dealerHand.cards.push({
          card: { facing: "Up", rank: "Eight", suit: "Diamond" },
          rankRelativeValueUsed: 8,
          rankValueUsed: 8,
        });
        playerHand.cards.push({
          card: { facing: "Up", rank: "Seven", suit: "Diamond" },
          rankRelativeValueUsed: 7,
          rankValueUsed: 7,
        });
        dealerHand.score = playerHand.score;
        const result = determineWinner(playerHand, dealerHand);
        expect(result.winner).toBe("Dealer");
        expect(result.winnerText).toBe("Dealer wins with a high card");
      });

      it("Should return Player when player has more cards than player", () => {
        dealerHand.cards.push({
          card: { facing: "Up", rank: "Seven", suit: "Diamond" },
          rankRelativeValueUsed: 7,
          rankValueUsed: 7,
        });
        playerHand.cards.push({
          card: { facing: "Up", rank: "Eight", suit: "Diamond" },
          rankRelativeValueUsed: 8,
          rankValueUsed: 8,
        });
        playerHand.score = dealerHand.score;
        const result = determineWinner(playerHand, dealerHand);
        expect(result.winner).toBe("Player");
        expect(result.winnerText).toBe("Player wins with a high card");
      });
    });

    it("Should return no winner when both players have same card values, count and high card", () => {
      const result = determineWinner(playerHand, dealerHand);
      expect(result.winner).toBeNull();
      expect(result.winnerText).toBe(
        "Draw! Same hand value, number of cards, and card ranks!"
      );
    });
  });
});
