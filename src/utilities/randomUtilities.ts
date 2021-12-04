/**
 * Gets a random whole number between the inclusive range specified.
 * @param min The min inclusive value
 * @param max The max inclusive value
 * @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random#getting_a_random_integer_between_two_values_inclusive
 * @returns 
 */
export const randomIntInRange = (min: number, max: number): number => {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}