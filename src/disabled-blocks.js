/**
 * Filter that modified the metadata of the blocks to hide blocks and
 * variations depending on the settings of the user.
 */
import { settings } from 'stackable'
import { addFilter } from '@wordpress/hooks'
import { BLOCK_STATE } from '~stackable/util'

// Disable these blocks when the following variables are disabled. We need this
// so that if a variation is disabled, we will no longer be able to add the
// relevant block.
// const BLOCK_DEPENDENCIES = {
// 	'stackable/icon-button': 'stackable/button-group|icon-button',
// 	'stackable/button': 'stackable/button-group|button',
// }

// const getDefaultVariation = variations => {
// 	return variations?.find( ( { isDefault } ) => isDefault )?.name
// }
// const getVariationsToRemove = ( disabledBlocks, blockName ) => {
// 	return disabledBlocks.filter( disabledBlock => disabledBlock.startsWith( `${ blockName }|` ) )
// 		.map( disabledBlock => disabledBlock.split( '|' )[ 1 ] )
// }

const applySettingsToMeta = metadata => {
	let inserter = true
	if ( metadata.name in settings.stackable_disabled_blocks ) {
		inserter = ! settings.stackable_disabled_blocks[ metadata.name ] === BLOCK_STATE.HIDDEN
	}

	// // Check if this block is dependent on another variation being enabled.
	// if ( BLOCK_DEPENDENCIES[ metadata.name ] ) {
	// 	if ( settings.stackable_disabled_blocks.includes( BLOCK_DEPENDENCIES[ metadata.name ] ) ) {
	// 		inserter = false
	// 	}
	// }

	// const variationsToRemove = getVariationsToRemove( settings.stackable_disabled_blocks, metadata.name )
	// let variations = metadata.variations || []

	// // Remove variations if there are ones disabled.
	// if ( variationsToRemove.length ) {
	// 	const hasDefaultVariation = !! getDefaultVariation( metadata.variations )
	// 	variations = variations.filter( variation => ! variationsToRemove.includes( variation.name ) )
	// 	// If there was a default variation before, ensure we still have a default
	// 	// variation if it gets removed.
	// 	if ( variations.length && hasDefaultVariation && ! getDefaultVariation( variations ) ) {
	// 		variations[ 0 ].isDefault = true
	// 	}

	// 	// If no more variations are left, and the main block is hidden, remove the
	// 	// main block from the inserter so it won't show up when adding a block.
	// 	if ( ! variations.length ) {
	// 		if ( metadata[ 'stk-type' ] === 'hidden' ) {
	// 			inserter = false
	// 		}
	// 	}
	// }

	// // Adjust the metadata.
	// metadata.variations = variations
	if ( typeof metadata.supports === 'undefined' ) {
		metadata.supports = {}
	}
	metadata.supports.inserter = inserter

	return metadata
}

addFilter( 'stackable.block.metadata', 'stackable/disabled-blocks', applySettingsToMeta )
