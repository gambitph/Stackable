module.exports = api => {
	api.cache( false )

	return {
		presets: [
			'@wordpress/babel-preset-default', // @see https://github.com/WordPress/gutenberg/tree/trunk/packages/babel-preset-default
		],
	}
}
