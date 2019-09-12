/**
 * All frontend scripts required by our blocks should be included here.
 *
 * This is the file that Webpack is compiling into blocks.frontend.build.js
 */

/**
 * Internal dependencies
 */
import './polyfill'

const context = require.context(
	'./block', // Search within the src/blocks directory.
	true, // Search recursively.
	/frontend\.js$/ // Match any frontend.js.
)

// Import.
context.keys().forEach( key => context( key ) )
