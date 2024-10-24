/**
 * Filter that modified the metadata of the blocks to hide blocks and
 * variations depending on the settings of the user.
 */
import { settings } from 'stackable'
import { addFilter } from '@wordpress/hooks'
import { BLOCK_STATE, BLOCK_DEPENDENCIES } from '~stackable/util'

const getDefaultVariation = variations => {
	return variations?.find( ( { isDefault } ) => isDefault )?.name
}
const getVariationsToRemove = ( disabledBlocks, blockName ) => {
	const variations = []
	for ( const block in disabledBlocks ) {
		if ( block.startsWith( `${ blockName }|` ) ) {
			variations.push( block.split( '|' )[ 1 ] )
		}
	}
	return variations
}

const applySettingsToMeta = metadata => {
	const disabledBlocks = settings.stackable_disabled_blocks || {} // eslint-disable-line camelcase
	let inserter = true

	// If the block is hidden, set the inserter to false.
	if ( metadata.name in disabledBlocks ) {
		inserter = ! disabledBlocks[ metadata.name ] === BLOCK_STATE.HIDDEN
	}

	// Check if this block is dependent on another variation being enabled.
	if ( BLOCK_DEPENDENCIES[ metadata.name ] && BLOCK_DEPENDENCIES[ metadata.name ] in disabledBlocks ) {
		inserter = ! disabledBlocks[ BLOCK_DEPENDENCIES[ metadata.name ] ] === BLOCK_STATE.HIDDEN
	}

	const variationsToRemove = getVariationsToRemove( disabledBlocks, metadata.name )
	let variations = metadata.variations || []

	// Remove the variations that are hidden which removes the block from the inserter.
	if ( variationsToRemove.length ) {
		const hasDefaultVariation = !! getDefaultVariation( metadata.variations )
		variations = variations.filter( variation => ! variationsToRemove.includes( variation.name ) )
		// If there was a default variation before, ensure we still have a default
		// variation if it gets removed.
		if ( variations.length && hasDefaultVariation && ! getDefaultVariation( variations ) ) {
			variations[ 0 ].isDefault = true
		}

		// If no more variations are left, and the main block is hidden, remove the
		// main block from the inserter so it won't show up when adding a block.
		if ( ! variations.length ) {
			if ( metadata[ 'stk-type' ] === 'hidden' ) {
				inserter = false
			}
		}
	}

	// Adjust the metadata.
	metadata.variations = variations
	if ( typeof metadata.supports === 'undefined' ) {
		metadata.supports = {}
	}
	metadata.supports.inserter = inserter

	return metadata
}

addFilter( 'stackable.block.metadata', 'stackable/disabled-blocks', applySettingsToMeta )
