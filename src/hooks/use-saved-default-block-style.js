/**
 * Internal dependencies
 */
import { getDefinedBlockStyles } from './use-block-style'
import { CONTENT_ATTRIBUTES, recursivelyAddUniqueIdToInnerBlocks } from '~stackable/util'

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
import { applyFilters } from '@wordpress/hooks'
import { createBlocksFromInnerBlocksTemplate, getBlockVariations } from '@wordpress/blocks'

export const useSavedDefaultBlockStyle = blockProps => {
	const {
		clientId, name, attributes,
	} = blockProps
	const [ isApplied, setIsApplied ] = useState( false )

	const { getDefaultBlockStyle } = useSelect( 'stackable/block-styles' )
	const { getBlockParents, getBlockName } = useSelect( 'core/block-editor' )
	const { replaceInnerBlocks } = useDispatch( 'core/block-editor' )

	// Only do this for Stackable blocks.
	if ( ! name.startsWith( 'stackable/' ) ) {
		return
	}

	// Let others prevent default block styles to be added depending on the
	// parent (e.g. helpful for preventing the Accordion block from getting the
	// default saved styles of the Icon Label block)
	const parentBlocks = getBlockParents( clientId ).map( clientId => getBlockName( clientId ) )
	const enable = applyFilters( 'stackable.block-default-styles.use-saved-style', true, blockProps, parentBlocks )
	if ( ! enable ) {
		return
	}

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
				const blockStyles = getDefinedBlockStyles( name )
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

			if ( blockData.innerBlocks?.length ) {
			// Create and apply the innerBlocks.
				const innerBlocks = createBlocksFromInnerBlocksTemplate( blockData.innerBlocks )
				// We need to add unique Ids to prevent the default styles from getting applied.
				recursivelyAddUniqueIdToInnerBlocks( innerBlocks )
				replaceInnerBlocks(
					clientId,
					innerBlocks,
					false,
				)
			}

			// This can repeat because of nested blocks, ens
			setIsApplied( true )
		}
	}
}
