/**
 * Register all the blocks found.
 *
 * This is the file that Webpack is compiling into editor_blocks.js
 */
import './icons'
import './modules'
import { applyFilters } from '@wordpress/hooks'
import { compose } from '@wordpress/compose'
import domReady from '@wordpress/dom-ready'
import { initBlockModule } from '@stackable/modules'
import { registerBlockType } from '@wordpress/blocks'
import { withMainClassname } from '@stackable/higher-order'

const context = require.context( './block', true, /index\.js$/ )
const editContext = require.context( './block', true, /edit\.js$/ )
const saveContext = require.context( './block', true, /save\.js$/ )
const deprecatedContext = require.context( './block', true, /deprecated\.js$/ )

// Register all the blocks found.
domReady( () => {
	context.keys().forEach( key => {
		const block = context( key )

		const settings = {
			modules: {},
			...block.settings,
		}

		try {
			settings.edit = editContext( key.replace( 'index.js', 'edit.js' ) ).default
		} catch ( error ) {}
		try {
			settings.save = saveContext( key.replace( 'index.js', 'save.js' ) ).default
		} catch ( error ) {}
		try {
			settings.deprecated = deprecatedContext( key.replace( 'index.js', 'deprecated.js' ) ).default.map( deprecated => {
				return {
					...deprecated,
					save: compose(
						withMainClassname( block.name ),
					)( deprecated.save ),
				}
			} )
		} catch ( error ) {}

		const blockName = block.name.replace( /^\w+\//g, '' )

		// Initialize modules.
		Object.keys( settings.modules ).forEach( moduleName => {
			const options = settings.modules[ moduleName ]
			if ( ! options ) {
				return
			}

			const optionsToPass = typeof options === 'object' ? options : {}
			initBlockModule( blockName, moduleName, optionsToPass )
		} )

		// Allow others to change our attributes.
		settings.attributes = applyFilters( `stackable.${ blockName }.attributes`, settings.attributes )

		// Register the block.
		registerBlockType( block.name, settings )
	} )
} )
