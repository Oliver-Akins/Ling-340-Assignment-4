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


/** The name of the file to read */
const in_file = process.argv[2] ?? `data.json`;

/** The name of the file to write from */
const out_file = process.argv[3] ?? in_file;

/**
 * An array of objects that consist of overrides for the lexeme pattern in order
 * to short-cut the levenshtein distance calculation as needed.
 *
 * {
 *   set_to: ``,
 *   filters: []
 * }
 *
 * Where:
 * set_to is a string representing the value to set the derivation value to.
 * filters is an array of RegExes to match the lexeme form to, any positive match
 *   results in the override being applied.
 */
const overrides = [];

//===========================================================================\\
import fs from "fs/promises";
import { lev } from "./levenshtein.mjs";


/**
 * Searches all of the lexeme groups to determine if the system
 *
 * @param {string} lexeme The lexeme string
 * @returns The language origin that was caused by the lexeme group overrides
 */
function shortcut_distance(lexeme) {
	for (const override of overrides) {
		for (const pattern of override.filters) {
			if (lexeme.match(pattern)) {
				return override.set_to;
			};
		};
	};
	return null;
};

//===========================================================================\\

async function main() {

	// load the JSON file
	const data = JSON.parse(
		await fs.readFile(in_file, `utf-8`).catch(() => {
			console.error(`Cannot load file "${in_file}", please make sure it exists and uses UTF-8 encoding`);
			process.exit(1);
		})
	);

	for (const o of data) {
		let [ lex ] = o["Lexeme"];

		let [ sp ] = o["Spanish"];
		let [ qu] = o["Quichua"];

		let deriv = null;

		// Check if the lexemes match any of the filtered groups, if a shortcut
		// is found, then we don't process the lechteinsten distance algorithm
		// and just set it to the group that is filtered
		if (deriv = shortcut_distance(lex)) {
			o.Derivation = [ deriv ];
			continue;
		};

		// Calculate the distance between the two morphemes
		let sp_distance = lev(lex, sp);
		let qu_distance = lev(lex, qu);


		// Determine which category the levenshtein distance puts the derivation
		// into
		if (sp_distance < qu_distance) {
			o.Derivation = [ `Sp` ];
		}
		else if (sp_distance > qu_distance) {
			o.Derivation = [ `Qu` ];
		}
		else {
			o.Derivation = [`Check`];
		};
	};

	fs.writeFile(
		out_file,
		JSON.stringify(data)
			.replace(/\{/g, `\n\n{`)
			.replace(/\,\"/g, `,\n"`)
	);
};


main();