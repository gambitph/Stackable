module.exports = [
	{
		test: /\.js$/,
		exclude: /(node_modules|bower_components)/,
		use: {
			loader: 'babel-loader',
			options: {
				presets: [ '@wordpress/babel-preset-default' ],
				// Cache compilation results in ./node_modules/.cache/babel-loader/
				cacheDirectory: true,
			}
		},
		resolve: {
			fullySpecified: false
		},
	},
	{
		// Fixes Module not found error: (probably because the origin is a '*.mjs' file or a '*.js' file where the package.json contains '"type": "module"').
        test: /\.m?jsx?$/,
		resolve: {
			fullySpecified: false
		},
	},
	{
		test: /\.svg$/,
		// Settings are in .svgrrc
		use: [
			{
				loader: 'babel-loader', // Use our own babel-loader instead of the included one.
				options: {
					presets: [ '@wordpress/babel-preset-default' ],
					cacheDirectory: true,
				},
			},
			{
				loader: '@svgr/webpack',
				options: { babel: false },
			}
		],
	},
	{
		test: /\.(png|jpg|gif)$/,
		use: [
			{
				loader: 'file-loader',
				options: {
					outputPath: 'images', // Dump images in dist/images.
					publicPath: 'dist/images', // URLs point to dist/images.
					regExp: /\/([^\/]+)\/([^\/]+)\/images\/(.+)\.(.*)?$/, // Gather strings for the output filename.
					name: '[1]-[2]-[3].[hash:hex:7].[ext]', // Filename e.g. block-accordion-basic.1b659fc.png
				},
			},
		],
	},
	// Help video snippets
	{
		test: /help\/videos\/[\w\d-_]+\.(mp4)$/,
		use: [
			{
				loader: 'file-loader',
				options: {
					outputPath: 'videos/help', // Dump images in dist/videos/help.
					publicPath: 'dist/videos/help', // URLs point to dist/videos/help.
					regExp: /\/videos\/(.+)\.(.*)?$/, // Gather strings for the output filename.
					name: '[1].[ext]', // Filename e.g. borders.mp4
				},
			},
		],
	},
	{
		test: /\.(mp4)$/,
		exclude: /(help\/videos)/,
		use: [
			{
				loader: 'file-loader',
				options: {
					outputPath: 'videos', // Dump images in dist/images.
					publicPath: 'dist/videos', // URLs point to dist/images.
					regExp: /\/([^\/]+)\/([^\/]+)\/videos\/(.+)\.(.*)?$/, // Gather strings for the output filename.
					name: '[2]-[3].[hash:hex:7].[ext]', // Filename e.g. help-borders.1b659fc.mp4
				},
			},
		],
	},
]
