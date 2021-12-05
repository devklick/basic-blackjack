import { CardObject, CardRank, CardRankMetadataMap, CardSuit, Facing } from "../components/Card/Card";
import { randomIntInRange } from "./randomUtilities";

export enum DeckType {
	Standard
}

export const shuffleDeck = (cards: CardObject[]): CardObject[] => {
	for (let n: number = 0; n < 5; n++) {
		const halfway = cards.length / 2;
		const splitAt = randomIntInRange(halfway - 3, halfway + 3);
		const left = cards.slice(0, splitAt);
		const right = cards.slice(splitAt);

		let shuffled: CardObject[] = [];

		let l: number = 0;
		let r: number = 0;
		while (l < left.length) {
			// determine how many cards to take from the left side
			let take = randomIntInRange(1, 6);

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
			take = randomIntInRange(1, 6);

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
			const index = shuffle
				? randomIntInRange(0, cards.length)
				: cards.length

			cards.splice(index, 0, card);
		})
	})

	return shuffle ? shuffleDeck(cards) : cards
}

/**
 * Calculates the best score, i.e. the closest to 21, for the set of cards.
 * @param cards The cards to be checked
 * @returns {number} The best score for the cards
 */
export const calculateBestScore = (cards: CardObject[]): number => {
	let aceCount = 0;
	let score = cards
		.map(card => {
			if (card.rank === CardRank.Ace) {
				aceCount++;
			}
			return Math.max(...CardRankMetadataMap[card.rank].values);
		})
		.reduce((accumulator, curr) => accumulator + curr, 0);

	for (let i = 0; i < aceCount; i++) {
		if (score < 21) {
			break;
		}
		score -= 10;
	}


	return score;
}