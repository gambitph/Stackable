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
import { select, dispatch } from '@wordpress/data'
import { useState, useEffect } from '@wordpress/element'
import { applyFilters } from '@wordpress/hooks'
import { createBlocksFromInnerBlocksTemplate, getBlockVariations } from '@wordpress/blocks'

export const useSavedDefaultBlockStyle = blockProps => {
	const {
		clientId, name, attributes,
	} = blockProps
	const [ isApplied, setIsApplied ] = useState( false )
	const [ replaceInnerBlocks, setReplaceInnerBlocks ] = useState( null )

	// Dispatch the replace inner blocks inside a useEffect to prevent updating
	// during render.
	useEffect( () => {
		if ( clientId && replaceInnerBlocks ) {
			dispatch( 'core/block-editor' ).replaceInnerBlocks(
				clientId,
				replaceInnerBlocks,
				false,
			)
			setReplaceInnerBlocks( null )
		}
	}, [ clientId, replaceInnerBlocks ] )

	// Unique ID setting is immediate, so we need to catch if we can apply the default block styles.
	if ( ! name.startsWith( 'stackable/' ) || attributes.uniqueId ) {
		return
	}

	// Apply the default saved styles to the block.
	if ( ! isApplied ) {
		// If there is a variation, it means there is a variation/layout picker, in
		// this case the variation picker will do the job.
		const hasVariations = getBlockVariations( name ).length > 0
		if ( ! hasVariations ) {
			// Let others prevent default block styles to be added depending on the
			// parent (e.g. helpful for preventing the Accordion block from getting the
			// default saved styles of the Icon Label block)
			// eslint-disable-next-line stackable/no-get-block-parents
			const parentBlockIds = select( 'core/block-editor' ).getBlockParents( clientId )
			const parentBlocks = parentBlockIds.map( id => select( 'core/block-editor' ).getBlock( id )?.name )
			const enable = applyFilters( 'stackable.block-default-styles.use-saved-style', true, blockProps, parentBlocks )
			if ( ! enable ) {
				return
			}

			// Get the default block styles.
			const blockStyle = select( 'stackable/block-styles' ).getDefaultBlockStyle( name )
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
			// console.log( 'applied!' )
			Object.keys( newAttributes ).forEach( attrName => {
				attributes[ attrName ] = newAttributes[ attrName ]
			} )

			// Create and apply the innerBlocks.
			// Do not do this for icon lists because it causes an error on transform.
			// The icon list inner blocks are created by the icon list block itself. See src/blocks/icon-list/transforms.js
			if ( blockData.innerBlocks?.length && name !== 'stackable/icon-list' ) {
				const innerBlocks = createBlocksFromInnerBlocksTemplate( blockData.innerBlocks )
				// We need to add unique Ids to prevent the default styles from getting applied.
				recursivelyAddUniqueIdToInnerBlocks( innerBlocks )
				setReplaceInnerBlocks( innerBlocks ) // replaceInnerBlocks in useEffect to prevent React error.
			}

			// This can repeat because of nested blocks, ens
			setIsApplied( true )
		}
	}
}
