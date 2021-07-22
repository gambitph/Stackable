const ImageMinimizerPlugin = require( 'image-minimizer-webpack-plugin' )

module.exports = [
	new ImageMinimizerPlugin( {
		minimizerOptions: {
			plugins: [
				[ "pngquant", { quality: [ 0.5, 0.5 ] } ],
			],
		},
	} ),
]
