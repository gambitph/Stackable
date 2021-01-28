/**
 * WordPress dependencies
 */
import { getBlockType, registerBlockType } from '@wordpress/blocks'
import { applyFilters } from '@wordpress/hooks'
import { getBlockName, supportsBlockCollections } from './util'

const registerBlock = ( name, settings = {} ) => {
	if ( getBlockType( name ) ) {
		return
	}

	const blockName = getBlockName( name )
	const blockSettings = {
		...settings,
		category: supportsBlockCollections() ? settings.category : 'stackable',
	}

	// Register the block.
	registerBlockType( name, applyFilters( `stackable.${ blockName }.settings`, blockSettings ) )

	return blockSettings
}

export default registerBlock
