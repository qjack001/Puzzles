module.exports = {
	plugins: [
		require('postcss-nesting')({ noIsPseudoSelector: true }),
		require('autoprefixer'),
	],
}