/**
 * External dependencies
 */
import { initBlockModule } from '~stackable/modules'
import { withMainClassname } from '~stackable/higher-order'

/**
 * WordPress dependencies
 */
import { getBlockType, registerBlockType } from '@wordpress/blocks'
import { applyFilters } from '@wordpress/hooks'

const registerBlock = ( name, settings = {} ) => {
	if ( getBlockType( name ) ) {
		return
	}

	const blockName = name.replace( /^\w+\//g, '' )
	const blockSettings = {
		...settings,
		modules: applyFilters( `stackable.${ blockName }.modules`, settings.modules || {} ),
		deprecated: ( settings.deprecated || [] ).map( deprecated => {
			return {
				...deprecated,
				save: withMainClassname( name )( deprecated.save ),
			}
		} ),
	}

	// Initialize the modules found in the block settings.
	Object.keys( blockSettings.modules ).forEach( moduleName => {
		const options = blockSettings.modules[ moduleName ]
		if ( ! options ) {
			return
		}

		initBlockModule( blockName, moduleName, typeof options === 'object' ? options : {} )
	} )

	// Allow modules to modify the block's attributes.
	blockSettings.attributes = applyFilters( `stackable.block.attributes`, blockSettings.attributes )
	blockSettings.attributes = applyFilters( `stackable.${ blockName }.attributes`, blockSettings.attributes )

	blockSettings.edit = withMainClassname( name )( blockSettings.edit )
	blockSettings.save = withMainClassname( name )( blockSettings.save )

	// Register the block.
	registerBlockType( name, applyFilters( `stackable.${ blockName }.settings`, blockSettings ) )

	return blockSettings
}

export default registerBlock
