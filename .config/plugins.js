const ImageminPlugin = require( 'imagemin-webpack' )
  
module.exports = [
	new ImageminPlugin( {
		bail: false,
		cache: true,
		imageminOptions: {
			plugins: [
				[ "pngquant", { quality: [ 0.5, 0.5 ] } ],
			]
		}
	} ),
]