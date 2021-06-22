module.exports = api => {
	api.cache( false )

	return {
		presets: [
			[ '@babel/preset-env', { modules: false } ],
			'@babel/preset-react',
			'@wordpress/babel-preset-default', // @see https://github.com/WordPress/gutenberg/tree/trunk/packages/babel-preset-default
		],
		env: {
			test: {
				plugins: [
					'@babel/plugin-transform-modules-commonjs',
					'@babel/plugin-proposal-class-properties',
					'@babel/plugin-proposal-optional-chaining',
				],
			},
		},
	}
}
