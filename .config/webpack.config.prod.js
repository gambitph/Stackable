const { externals, stackableExternals } = require( './externals' )
const rules = require( './rules' )
const path = require( 'path' )
const plugins = require( './plugins' )

module.exports = [
/**
 * These entry is for scripts that compiles our libraries and modules into the
 * built script.
 */
{

    mode: 'production',

    devtool: 'hidden-source-map',

	entry: {
        // This is our main editor script that loads our modules into an api
		// window.stk
		stk: {
			import: path.resolve( __dirname, '../src/stk.js' ),
			library: {
				name: 'stk',
				type: 'window',
			},
		},
		// Admin settings script.
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
    },

    // Externals are only WordPress loaded libraries.
    externals,

    resolve: {
        alias: {
            '~stackable': path.resolve( __dirname, '../src/' )
        }
    },

    // Optimize output bundle.
    // optimization: {
	// 	minimize: true,
    //     emitOnErrors: false,
    //     splitChunks: {
	// 		cacheGroups: {
	// 			vendor: {
	// 				test: /node_modules/,
	// 				chunks: "initial",
	// 				name: "editor_vendor",
	// 				priority: 10,
	// 				enforce: true
	// 			}
	// 		}
    //     },
    // },

	module: {
        strictExportPresence: true,
        rules,
	},

	plugins,
},

/**
 * This entry is for editor scripts that use our apis from window.stk
 */
{

    mode: 'production',

    devtool: 'hidden-source-map',

	entry: {
		editor_blocks: {
			import: path.resolve( __dirname, '../src/blocks.js' ),
		},
        'editor_blocks_deprecated_v2': {
			import: path.resolve( __dirname, '../src/deprecated/v2/blocks.js' ),
			filename: 'deprecated/[name].js'
		},
    },

	output: {
		filename: '[name].js',
    },

    // Use window.stk as external imports.
    externals: {
		...externals,
		...stackableExternals,
	},

	resolve: {
		alias: {
			// This is only used by deprecated v1 and v2 code, this normally
			// shouldn't be imported outside deprecated scripts.
			'~stackable/deprecated': path.resolve( __dirname, '../src/deprecated' ),
		},
	},

    // Optimize output bundle.
    // optimization: {
	// 	minimize: true,
    //     emitOnErrors: false,
    //     splitChunks: {
	// 		cacheGroups: {
	// 			vendor: {
	// 				test: /node_modules/,
	// 				chunks: "initial",
	// 				name: "editor_vendor",
	// 				priority: 10,
	// 				enforce: true
	// 			}
	// 		}
    //     },
    // },

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

    mode: 'production',

    devtool: 'hidden-source-map',

	target: [ 'web', 'es2017' ],

	entry: {
		'frontend_image_lightbox': path.resolve( __dirname, '../src/lightbox/frontend-image-lightbox.js' ),
		'frontend_blocks': path.resolve( __dirname, '../src/block-frontend.js' ),
		'frontend_block_accordion': path.resolve( __dirname, '../src/block/accordion/frontend-accordion.js' ),
		'frontend_block_accordion_polyfill': path.resolve( __dirname, '../src/block/accordion/frontend-accordion-polyfill.js' ),
		'frontend_block_carousel': path.resolve( __dirname, '../src/block/carousel/frontend-carousel.js' ),
		'frontend_block_count_up': path.resolve( __dirname, '../src/block/count-up/frontend-count-up.js' ),
		'frontend_block_countdown': path.resolve( __dirname, '../src/block/countdown/frontend-countdown.js' ),
		'frontend_block_expand': path.resolve( __dirname, '../src/block/expand/frontend-expand.js' ),
		'frontend_block_map': path.resolve( __dirname, '../src/block/map/frontend-map.js' ),
		'frontend_block_notification': path.resolve( __dirname, '../src/block/notification/frontend-notification.js' ),
		'frontend_block_video_popup': path.resolve( __dirname, '../src/block/video-popup/frontend-video-popup.js' ),
		'frontend_block_progress_circle': path.resolve( __dirname, '../src/block/progress-circle/frontend-progress-circle.js' ),
		'frontend_block_progress_bar': path.resolve( __dirname, '../src/block/progress-bar/frontend-progress-bar.js' ),
		'frontend_block_horizontal_scroller': path.resolve( __dirname, '../src/block/horizontal-scroller/frontend-horizontal-scroller.js' ),
		'frontend_block_tabs': path.resolve( __dirname, '../src/block/tabs/frontend-tabs.js' ),
		'frontend_image_optimizer_polyfill': path.resolve( __dirname, '../src/block-components/image/image-optimizer-polyfill.js' ),
	},

	output: {
		filename: '[name].js',
	    library: '[name]',  // it assigns this module to the global (window) object
    },
} ]
