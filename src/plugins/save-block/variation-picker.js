/**
 * External dependencies
 */
import { isPro } from 'stackable'

/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks'
import { select } from '@wordpress/data'

// Override the variation picker in-case that there is a saved block
// style/variation.
addFilter( 'stackable.variation-picker.variation-selected', 'stackable/saved-block', ( nextVariation, blockName ) => {
	// For free users, only do this for the default block variation.
	if ( ! isPro && nextVariation.name !== 'default' ) {
		return nextVariation
	}

	// The variation's name is the block style / slug.
	const { getBlockStyle } = select( 'stackable/block-styles' )
	const blockStyle = getBlockStyle( blockName, nextVariation.name )

	if ( blockStyle ) {
		const blockData = JSON.parse( blockStyle.data )
		return {
			...nextVariation,
			attributes: blockData.attributes || {},
			innerBlocks: blockData.innerBlocks || [],
		}
	}

	return nextVariation
} )
