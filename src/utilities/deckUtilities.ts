import { CardObject, CardRank, CardRankMetadataMap, CardSuit, Facing } from "../components/Card/Card";
import { Participant } from "../components/Table/Table";
import { randomIntInRange } from "./randomUtilities";

export enum DeckType {
	Standard
}

/**
 * An over-engineered shuffle implementation designed to emulate the riffle-shuffle.
 * @param cards The cards to be shuffled.
 * @returns The shuffled cards
 */
export const shuffleDeck = (cards: CardObject[]): CardObject[] => {
	for (let n: number = 0; n < 3; n++) {
		// cut the deck roughly in half
		const halfway = cards.length / 2;
		const splitAt = randomIntInRange(halfway - 3, halfway + 3);
		const left = cards.slice(0, splitAt);
		const right = cards.slice(splitAt);

		let shuffled: CardObject[] = [];

		let l: number = 0;
		let r: number = 0;
		while (l < left.length) {
			// determine how many cards to take from the left side
			let take = randomIntInRange(0, 3);

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
			take = randomIntInRange(0, 3);

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

export const generateDeck = (deckType: DeckType, shuffle: boolean = true): CardObject[] => {
	if (deckType !== DeckType.Standard) {
		throw new Error(`DeckType ${deckType} not yet supported.`);
	}
	const cards: CardObject[] = [];

	Object.keys(CardRank).forEach(rank => {
		Object.keys(CardSuit).forEach(suit => {
			const card: CardObject = {
				rank: CardRank[rank as keyof typeof CardRank],
				suit: CardSuit[suit as keyof typeof CardSuit],
				facing: Facing.Up
			};

			// If the deck is to be shuffled, lets create it with cards 
			// in a random order to get a head start. Select a random index
			// where the card should be inserted into the deck.
			const index = shuffle
				? randomIntInRange(0, cards.length)
				: cards.length

			// Insert the card into the deck
			cards.splice(index, 0, card);
		})
	})

	return shuffle ? shuffleDeck(cards) : cards
}

export interface CardValue {
	card: CardObject;
	rankValueUsed: number
	rankRelativeValueUsed: number;
}
export interface BestHand {
	score: number;
	cards: CardValue[]
}

/**
 * Calculates the best hand, i.e. the closest to 21, for the set of cards.
 * @param cards The cards to be checked
 * @returns {BestHand} The best hand that can be achieved with the input cards
 */
export const calculateBestHand = (cards: CardObject[]): BestHand => {
	const bestHand: BestHand = {
		cards: [],
		score: 0
	};

	let aceCount = 0;
	cards.forEach(card => {
		if (card.rank === CardRank.Ace) {
			aceCount++;
		}

		const cardValue = Math.max(...CardRankMetadataMap[card.rank].values);
		const cardRelativeValue = Math.max(...CardRankMetadataMap[card.rank].relativeValues);
		bestHand.cards.push({
			card,
			rankRelativeValueUsed: cardRelativeValue,
			rankValueUsed: cardValue
		});
		bestHand.score += cardValue;
	});

	for (let i = 0; i < aceCount; i++) {
		if (bestHand.score <= 21) {
			break;
		}
		bestHand.cards.find(c => c.rankValueUsed === 11)!.rankValueUsed -= 10;
		bestHand.score -= 10;
	}

	return bestHand;
}

export interface GameResult {
	winner?: Participant | null;
	winnerText: string;
}

export const determineWinner = (playerHand: BestHand, dealerHand: BestHand): GameResult => {

	if (playerHand.score > dealerHand.score) {
		return { winner: Participant.Player, winnerText: "Player wins with a high score" };
	}
	if (dealerHand.score > playerHand.score) {
		return { winner: Participant.Dealer, winnerText: "Dealer wins with a high score" };
	}
	if (playerHand.cards.length > dealerHand.cards.length) {
		return { winner: Participant.Player, winnerText: "Player wins with the most cards" };
	}
	if (dealerHand.cards.length > playerHand.cards.length) {
		return { winner: Participant.Dealer, winnerText: "Dealer wins with the most cards" };
	}
	const cardCount = playerHand.cards.length;
	let currentCardIndex = 0;
	while (currentCardIndex < cardCount) {
		if (playerHand.cards[currentCardIndex].rankValueUsed > dealerHand.cards[currentCardIndex].rankValueUsed) {
			return { winner: Participant.Player, winnerText: "Player wins with a high card" };
		}
		if (dealerHand.cards[currentCardIndex].rankValueUsed > playerHand.cards[currentCardIndex].rankValueUsed) {
			return { winner: Participant.Dealer, winnerText: "Dealer wins with a high card" };
		}
	}
	return { winner: null, winnerText: "Draw! Same hand value, number of cards, and card ranks!" };
}