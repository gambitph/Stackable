const externals = require( './externals' )
const rules = require( './rules' )
const path = require( 'path' )
const plugins = require( './plugins' )

module.exports = [ {

    mode: 'production',

    devtool: 'hidden-source-map',

	entry: {
        'editor_blocks': path.resolve( __dirname, '../src/blocks.js' ),
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
        noEmitOnErrors: true,
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
        noEmitOnErrors: true,
	},

	module: {
        strictExportPresence: true,
        rules,
	},
	
	plugins,
} ]
