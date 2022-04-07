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
addFilter( 'stackable.variation-picker.variation-selected', 'stackable/saved-block', ( variation, blockName ) => {
	if ( ! variation ) {
		return variation
	}
	// For free users, only do this for the default block variation.
	if ( ! isPro && variation.name !== 'default' ) {
		return variation
	}

	// The variation's name is the block style / slug.
	const { getBlockStyle } = select( 'stackable/block-styles' )
	const blockStyle = getBlockStyle( blockName, variation.name )

	if ( blockStyle ) {
		const blockData = JSON.parse( blockStyle.data )
		return {
			...variation,
			attributes: blockData.attributes || {},
			innerBlocks: blockData.innerBlocks || [],
		}
	}

	return variation
} )
