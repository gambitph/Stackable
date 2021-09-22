const externals = require( './externals' )
const rules = require( './rules' )
const plugins = require( './plugins' )
const path = require( 'path' )

module.exports = [ {

    mode: 'development',

    devtool: 'cheap-module-source-map',

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
            '~stackable': path.resolve( __dirname, '../src/' )
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
        rules,
	},

	plugins,
},
{
    mode: 'development',

    devtool: 'cheap-module-source-map',

	entry: {
		'admin_welcome': path.resolve( __dirname, '../src/welcome/admin.js' ),
		// V2 deprecated script, we build this here since that's how we did it before.
		'admin_welcome_v2': {
			import: path.resolve( __dirname, '../src/deprecated/v2/welcome/admin.js' ),
			filename: 'deprecated/[name].js'
		},
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
        rules,
	},

	plugins,
},

/**
 * Frontend files are meant to be very lightweight, so no Babel, just make use
 * of eslint-plugin-compat to make sure that we only use JS functions that are
 * compatible with the browsers we support.
 */
{
    mode: 'development',

    devtool: 'cheap-module-source-map',

	target: [ 'web', 'es2017' ],

	entry: {
		'frontend_blocks': path.resolve( __dirname, '../src/block-frontend.js' ),
		'frontend_block_accordion': path.resolve( __dirname, '../src/block/accordion/frontend-accordion.js' ),
		'frontend_block_count_up': path.resolve( __dirname, '../src/block/count-up/frontend-count-up.js' ),
		'frontend_block_expand': path.resolve( __dirname, '../src/block/expand/frontend-expand.js' ),
		'frontend_block_notification': path.resolve( __dirname, '../src/block/notification/frontend-notification.js' ),
		'frontend_block_video_popup': path.resolve( __dirname, '../src/block/video-popup/frontend-video-popup.js' ),
    },

	output: {
		filename: '[name].js',
	    library: '[name]',  // it assigns this module to the global (window) object
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
} ]
