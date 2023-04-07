# Ling-340-Assignment-4
A Levenshtein Distance (aka: Edit Distance) algorithm that extends JSON objects
used for Linguistics research. This was created for the fourth assignment of my
Phonology course (Ling 340) at the [University of Saskatchewan](https://usask.ca),
taught by Jesse Stewart.

# Installation

## Full Installation
1. Download this code repository
2. Make sure that Node v14.21 or higher is installed (`node --version`)


## Partial Installation
This must be used in an *ES Module* project, as the file uses `export`. To make
it work with a *CommonJS* project, change `export` to be `exports.lev = `.

1. Copy and paste the `src/levenshtein.js` file into your project (**Including License Header**)
2. Import the function with either `import` or `require` depending on if your project is an ES Module or Common JS.

# Usage
This **ONLY** apply to the [Full Installation](#full-installation).

## Configuration
You can specify override settings using a list of objects with more details in
the code near the top of `src/main.js`. This is an example of an override object
that Dr. Stewart provided for being able to compare Spanish and Quichua:
```js
{
	set_to: `Sp`,
	filters: [
		/f[lr]/,
		/s[tcrp]/,
		/[tbdcgp]r/,
		/[bp]l/,
		/nes/,
		/cion/,
		/ero/,
		/inter/,
		/ls/,
		/ei/,
		/ie/,
		/oe/,
		/eo/,
		/ae/,
		/ea/,
		/er$/,
		/ar$/,
		/ir$/,
		/[0-9]+/,
	],
},
```

## Running
```
node src/main.js [in_file] [out_file]
```
If `[in_file]` is not provided, it defaults to `data.json`. If `[out_file]` is
not provided, it defaults to the value of `[in_file]`(overwriting the existing
file).

The `[in_file]` is expected to be a JSON file in the format of [sample_data.json](sample_data.json)