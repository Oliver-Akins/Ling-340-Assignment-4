/*
 * MIT License
 *
 * Copyright (c) 2023 Oliver Akins
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
// @ts-check


/**
 * Calculates the levenshtein distance between two strings. The calculation of
 * the levenshtein distance can be defined by the following piecewise function:
 *
 * ```
 *             /	|a|		if |b| = 0,
 *             |	|b|		if |a| = 0,
 *             |	lev(a[:-1], b[:-1])		if a[0] = b[0],
 * lev(a, b) = {
 *             |	       /	lev(a[:-1], b)
 *             |	1 + min{	lev(a, b[:-1])		otherwise,
 *             \	       \	lev(a[:-1], b[:-1])
 * ```
 *
 * Where:
 *  - `|X|` is the length of the string X
 *  - `X[:-1]` is the string X, EXCEPT for the last character
 *  - `X[Y]` is the Y-th character of the string X
 *
 * Read more about this algorithm and general pseudocode at:
 *	https://en.wikipedia.org/wiki/Levenshtein_distance
 *
 * @param {string} str1 The origin string
 * @param {string} str2 The target string
 * @returns The number of edits required to change str1 into str2
 */
export function lev(str1, str2) {

	// instantiate a matrix with str2.length rows, and str1.length columns
	let sieve = new Array(str2.length+1).fill(null);
	sieve = sieve.map(c => new Array(str1.length+1).fill(null));

	function rh2(a, b) {

		/*
		Shortcut the recursion if we've already calculated the distance for the
		location in the matrix.
		 */
		if (sieve[b.length][a.length] != null) {
			return sieve[b.length][a.length];
		};

		/*
		Hit the end of one of the words, so we just need to append the rest of
		the other word, making the distance equal to length.

		This handles the first two cases of the piecewise function definition.
		*/
		if (a.length == 0) return b.length;
		if (b.length == 0) return a.length;

		let val = null;

		/*
		The two characters are the same, so we don't need to add any additional
		value to the recursed value. This is handling the third case of the
		piecewise function definition.
		*/
		if (a.slice(-1) == b.slice(-1)) {
			val = rh2(a.slice(0, -1), b.slice(0, -1));
		}

		/*
		Determine if the character is a deletion, addition, or substitution, and
		calculate the minimum route to creation, this is incredibly inefficient
		when not using the sieve short-cutting, so we utilize the sieve to improve
		the effeciency of the algorithm without needing to massively change the
		algorithm. This handles the entirety of the "min" block in the piecewise
		function definition.
		*/
		else {
			val = 1 + Math.min(
				rh2(a.slice(0, -1), b), // deletion
				rh2(a, b.slice(0, -1)), // insertion
				rh2(a.slice(0, -1), b.slice(0, -1)) // substitution
			);
		};
		sieve[b.length][a.length] = val;
		return val;
	};

	return rh2(str1, str2);
};