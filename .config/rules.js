module.exports = [
	{
		test: /\.js$/,
		exclude: /(node_modules|bower_components)/,
		use: {
			loader: 'babel-loader',
			options: {
				// presets: ['es2015'],
				// Cache compilation results in ./node_modules/.cache/babel-loader/
				cacheDirectory: true,
				plugins: [
					'@babel/plugin-proposal-class-properties',
					'@babel/plugin-transform-destructuring',
					'@babel/plugin-proposal-object-rest-spread',
					[
						'@babel/plugin-transform-react-jsx',
						{
							pragma: 'wp.element.createElement',
						},
					]
				]
			}
		}
	},
	{
		test: /\.svg$/,
		use: ['@svgr/webpack'], // Settings are in .svgrrc
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
]
