/**
 * Register all the blocks found.
 *
 * This is the file that Webpack is compiling into editor_blocks.js
 */
import './icons'
import './format-types'
import { registerBlockType } from '@wordpress/blocks'

const context = require.context( './block', true, /index\.js$/ )
const editContext = require.context( './block', true, /edit\.js$/ )
const saveContext = require.context( './block', true, /save\.js$/ )
const deprecatedContext = require.context( './block', true, /deprecated\.js$/ )

// Register all the blocks found.
context.keys().forEach( key => {
	const block = context( key )

	const settings = {
		...block.settings,
	}
	try {
		settings.edit = editContext( key.replace( 'index.js', 'edit.js' ) ).default
	} catch ( error ) {}
	try {
		settings.save = saveContext( key.replace( 'index.js', 'save.js' ) ).default
	} catch ( error ) {}
	try {
		settings.deprecated = deprecatedContext( key.replace( 'index.js', 'deprecated.js' ) ).default
	} catch ( error ) {}

	if ( block.name ) {
		registerBlockType( block.name, settings )
	}
} )
