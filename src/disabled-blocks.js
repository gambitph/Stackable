/**
 * Filter that modified the metadata of the blocks to hide blocks and
 * variations depending on the settings of the user.
 */
import { settings } from 'stackable'
import { addFilter } from '@wordpress/hooks'
import {
	BLOCK_STATE,
	BLOCK_DEPENDENCIES,
	substituteCoreIfDisabled,
} from '~stackable/util'
import _ from 'lodash'

// Contains the hookname of block variations and a list of whitelisted block names to substitute.
const VARIATION_FILTERS_WHITELIST = {
	'stackable.accordion.variations': [ 'stackable/text' ],
	'stackable.card.variations': [ 'stackable/heading', 'stackable/text', 'stackable/subtitle', 'stackable/button-group', 'stackable/button' ],
	'stackable.image-box.variations': [ 'stackable/heading', 'stackable/text' ],
	'stackable.notification.variations': [ 'stackable/heading', 'stackable/text', 'stackable/button-group', 'stackable/button' ],
	'stackable.blockquote.variations': [ 'stackable/text' ],
	'stackable.call-to-action.variations': [ 'stackable/heading', 'stackable/text', 'stackable/button-group', 'stackable/button' ],
	'stackable.feature.variations': [ 'stackable/heading', 'stackable/text', 'stackable/button-group', 'stackable/button' ],
	'stackable.feature-grid.variations': [ 'stackable/image', 'stackable/heading', 'stackable/text', 'stackable/button-group', 'stackable/button' ],
	'stackable.hero.variations': [ 'stackable/heading', 'stackable/text', 'stackable/button-group', 'stackable/button' ],
	'stackable.pricing-box.variations': [ 'stackable/heading', 'stackable/subtitle', 'stackable/button-group', 'stackable/button' ],
	'stackable.team-member.variations': [ 'stackable/image', 'stackable/heading', 'stackable/subtitle', 'stackable/text', 'stackable/button-group', 'stackable/button' ],
	'stackable.testimonial.variations': [ 'stackable/image', 'stackable/heading', 'stackable/subtitle', 'stackable/text' ],
}

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
	const disabledBlocks = settings.stackable_block_states || {} // eslint-disable-line camelcase
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

// Traverse the innerblocks of a given block definition and substitute core blocks if disabled and whitelisted.
const traverseBlocksAndSubstitute = ( blocks, whitelist ) => {
	return blocks.map( block => {
		let [ blockName, blockAttributes, innerBlocks ] = block

		// If there are innerBlocks, recursively traverse them.
		if ( innerBlocks && innerBlocks.length > 0 ) {
			innerBlocks = traverseBlocksAndSubstitute( innerBlocks, whitelist )
		}

		if ( whitelist.includes( blockName ) ) {
			return substituteCoreIfDisabled( blockName, blockAttributes, innerBlocks )
		}

		if ( innerBlocks ) {
			return [ blockName, blockAttributes, innerBlocks ]
		}
		return [ blockName, blockAttributes ]
	} )
}

Object.entries( VARIATION_FILTERS_WHITELIST ).forEach( ( [ hookName, whitelist ] ) => {
	// Make sure to run after pro filters
	addFilter( hookName, 'stackable/disabled-blocks', blockVariations => {
		return blockVariations.map( variation => {
			const newVariation = _.cloneDeep( variation )
			newVariation.innerBlocks = traverseBlocksAndSubstitute( newVariation.innerBlocks, whitelist )
			return newVariation
		} )
	}, 11 )
} )

