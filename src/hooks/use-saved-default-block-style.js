/**
 * External dependencies
 */
import { find, omit } from 'lodash'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { useSelect, useDispatch } from '@wordpress/data'
import { useState } from '@wordpress/element'
import { CONTENT_ATTRIBUTES, recursivelyAddUniqueIdToInnerBlocks } from '~stackable/util'
import { createBlocksFromInnerBlocksTemplate, getBlockVariations } from '@wordpress/blocks'

export const useSavedDefaultBlockStyle = ( blockProps, blockStyles = {} ) => {
	const {
		clientId, name, attributes,
	} = blockProps
	const [ isApplied, setIsApplied ] = useState( false )

	const { getDefaultBlockStyle } = useSelect( 'stackable/block-styles' )
	const { replaceInnerBlocks } = useDispatch( 'core/block-editor' )

	// Apply the default saved styles to the block.
	if ( ! isApplied && ! attributes.uniqueId ) {
		// If there is a variation, it means there is a variation/layout picker, in
		// this case the variation picker will do the job.
		const hasVariations = getBlockVariations( name ).length > 0
		if ( ! hasVariations ) {
			// Get the default block styles.
			const blockStyle = getDefaultBlockStyle( name )
			if ( ! blockStyle ) {
				return
			}
			const blockData = JSON.parse( blockStyle.data )
			// Filter out content attributes.
			let newAttributes = omit( blockData.attributes, CONTENT_ATTRIBUTES, 'uniqueId' )

			// Check if there are any block styles added in the block, if there
			// are, the default attributes may not work properly, we may need to
			// call the onSelect to apply the style.
			if ( attributes.className?.includes( 'is-style-' ) ) {
				let potentialStyleName = attributes.className.match( /is-style-([^\s]+)/ )
				potentialStyleName = potentialStyleName ? potentialStyleName[ 1 ] : ''
				const blockStyle = find( blockStyles, { name: potentialStyleName } )

				if ( blockStyle ) {
					newAttributes = {
						...newAttributes,
						...blockStyle.onSelect( newAttributes ),
					}
				}
			}

			// Apply the saved attributes to the block.
			Object.keys( newAttributes ).forEach( attrName => {
				attributes[ attrName ] = newAttributes[ attrName ]
			} )

			// Create and apply the innerBlocks.
			const innerBlocks = createBlocksFromInnerBlocksTemplate( blockData.innerBlocks )
			// We need to add unique Ids to prevent the default styles from getting applied.
			recursivelyAddUniqueIdToInnerBlocks( innerBlocks )
			replaceInnerBlocks(
				clientId,
				innerBlocks,
				false,
			)

			// This can repeat because of nested blocks, ens
			setIsApplied( true )
		}
	}
}
