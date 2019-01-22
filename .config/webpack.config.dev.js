const externals = require( './externals' )
const path = require( 'path' )

module.exports = [ {

    mode: 'development',

    devtool: 'cheap-module-source-map',

	entry: {
        'editor_blocks': path.resolve( __dirname, '../src/blocks.js' ),
    },

	output: {
		filename: '[name].js',
	    library: '[name]',  // it assigns this module to the global (window) object
    },

    // Permit importing @wordpress/* packages.
    externals,

    optimization: {
        splitChunks: {
			cacheGroups: {
				vendor: {
					test: /node_modules/,
					chunks: "initial",
					name: "editor_vendor",
					priority: 10,
					enforce: true
				}
			}
        },
    },

    resolve: {
        alias: {
            '@stackable': path.resolve( __dirname, '../src/' )
        }
    },

    // Clean up build output
	stats: {
		all: false,
		assets: true,
		colors: true,
		errors: true,
		performance: true,
		timings: true,
		warnings: true,
    },

	module: {
        strictExportPresence: true,
        rules: [
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
                            'transform-es2015-destructuring',
                            'transform-object-rest-spread',
                            [
                                'transform-react-jsx',
                                {
                                    pragma: 'wp.element.createElement',
                                },
                            ]
                        ]
                    }
                }
			},
        ]
    }
},
{
    mode: 'development',

    devtool: 'cheap-module-source-map',

	entry: {
		'frontend_blocks': path.resolve( __dirname, '../src/block-frontend.js' ),
		'admin_welcome': path.resolve( __dirname, '../src/welcome/admin.js' ),
    },

	output: {
		filename: '[name].js',
	    library: '[name]',  // it assigns this module to the global (window) object
    },

    // Permit importing @wordpress/* packages.
    externals,

    resolve: {
        alias: {
            '@stackable': path.resolve( __dirname, '../src/' )
        }
    },

    // Clean up build output
	stats: {
		all: false,
		assets: true,
		colors: true,
		errors: true,
		performance: true,
		timings: true,
		warnings: true,
    },

	module: {
        strictExportPresence: true,
        rules: [
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
                            'transform-es2015-destructuring',
                            'transform-object-rest-spread',
                            [
                                'transform-react-jsx',
                                {
                                    pragma: 'wp.element.createElement',
                                },
                            ]
                        ]
                    }
                }
			},
        ]
    }
}
]
