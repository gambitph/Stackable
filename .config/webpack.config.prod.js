const externals = require( './externals' )
const rules = require( './rules' )
const path = require( 'path' )
const plugins = require( './plugins' )

module.exports = [ {

    mode: 'production',

    devtool: 'hidden-source-map',

	entry: {
        'editor_blocks': path.resolve( __dirname, '../src/blocks.js' ),
        'editor_blocks_deprecated_v2': {
			import: path.resolve( __dirname, '../src/deprecated/v2/blocks.js' ),
			filename: 'deprecated/[name].js'
		},
    },

	output: {
		filename: '[name].js',
	    library: '[name]',  // it assigns this module to the global (window) object
    },

    // Permit importing @wordpress/* packages.
    externals,

    resolve: {
        alias: {
            '~stackable': path.resolve( __dirname, '../src/' )
        }
    },

    // Optimize output bundle.
    optimization: {
		minimize: true,
        emitOnErrors: false,
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

	module: {
        strictExportPresence: true,
        rules,
	},

	plugins,
},
{

    mode: 'production',

    devtool: 'hidden-source-map',

	entry: {
		'frontend_blocks': path.resolve( __dirname, '../src/block-frontend.js' ),
        'admin_welcome': path.resolve( __dirname, '../src/welcome/admin.js' ),
		'frontend_blocks_deprecated_v2': {
			import: path.resolve( __dirname, '../src/deprecated/v2/block-frontend.js' ),
			filename: 'deprecated/[name].js'
		},
    },

	output: {
		filename: '[name].js',
	    library: '[name]',  // it assigns this module to the global (window) object
    },

    // Permit importing @wordpress/* packages.
    externals,

    resolve: {
        alias: {
            '~stackable': path.resolve( __dirname, '../src/' )
        }
    },

    // Optimize output bundle.
	optimization: {
		minimize: true,
        emitOnErrors: false,
	},

	module: {
        strictExportPresence: true,
        rules,
	},

	plugins,
},
{

    mode: 'production',

    devtool: 'hidden-source-map',

	entry: {
	},

	output: {
		filename: '[name].js',
	    library: '[name]',  // it assigns this module to the global (window) object
    },
    resolve: {
        alias: {
            '~stackable': path.resolve( __dirname, '../src/' )
        }
    },

    // Optimize output bundle.
	optimization: {
		minimize: true,
        emitOnErrors: false,
	},

	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: 'babel-loader',
					options: {
						// presets: ['es2015'],
						presets: [ '@wordpress/babel-preset-default' ],
						// Cache compilation results in ./node_modules/.cache/babel-loader/
						cacheDirectory: true,
						plugins: [
							'@babel/plugin-proposal-class-properties',
						]
					}
				},
				resolve: {
					fullySpecified: false
				},
			},
		],
	},
} ]
