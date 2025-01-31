/**
 * Filter that modified the metadata of the blocks to hide blocks and
 * variations depending on the settings of the user.
 */
import { settings } from 'stackable'
import { addFilter } from '@wordpress/hooks'
import {
	BLOCK_STATE,
	substituteCoreIfDisabled,
} from '~stackable/util'
import { substitutionRules } from './blocks'
import { cloneDeep } from 'lodash'

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

// Traverse the innerblocks of a given block definition and substitute core blocks if disabled and whitelisted.
const traverseBlocksAndSubstitute = ( blocks, whitelist ) => {
	return blocks.map( block => {
		let [ blockName, blockAttributes, innerBlocks ] = block

		// If there are innerBlocks, recursively traverse them.
		if ( innerBlocks && innerBlocks.length > 0 ) {
			innerBlocks = traverseBlocksAndSubstitute( innerBlocks, whitelist )
		}

		if ( whitelist.includes( blockName ) ) {
			return substituteCoreIfDisabled( blockName, blockAttributes, innerBlocks, substitutionRules )
		}

		if ( innerBlocks ) {
			return [ blockName, blockAttributes, innerBlocks ]
		}
		return [ blockName, blockAttributes ]
	} )
}

const applySettingsToMeta = metadata => {
	const disabledBlocks = settings.stackable_block_states || {} // eslint-disable-line camelcase
	let inserter = true

	// If the block is hidden, set the inserter to false.
	if ( metadata.name in disabledBlocks ) {
		inserter = ! disabledBlocks[ metadata.name ] === BLOCK_STATE.HIDDEN
	}

	// Check if this block is dependent on another variation being enabled.
	if ( metadata[ 'stk-block-dependency' ] && metadata[ 'stk-block-dependency' ] in disabledBlocks ) {
		inserter = ! disabledBlocks[ metadata[ 'stk-block-dependency' ] ] === BLOCK_STATE.HIDDEN
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

	const whitelist = metadata[ 'stk-substitution-blocks' ]
	if ( whitelist ) {
		variations = variations.map( variation => {
			const newVariation = cloneDeep( variation )
			if ( newVariation.innerBlocks && Array.isArray( newVariation.innerBlocks ) ) {
				newVariation.innerBlocks = traverseBlocksAndSubstitute( newVariation.innerBlocks, whitelist )
			}
			return newVariation
		} )
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
