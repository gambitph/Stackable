/**
 * External dependencies
 */
import { find, omit } from 'lodash'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { useSelect, useDispatch } from '@wordpress/data'
import { CONTENT_ATTRIBUTES, recursivelyAddUniqueIdToInnerBlocks } from '~stackable/util'
import { createBlocksFromInnerBlocksTemplate, cloneBlock } from '@wordpress/blocks'

export const useSavedDefaultBlockStyle = ( blockProps, blockStyles = {} ) => {
	const { clientId, name, attributes } = blockProps
	const { getDefaultBlockStyle } = useSelect( 'stackable/block-styles' )
	const { replaceInnerBlocks } = useDispatch( 'core/block-editor' )
	// console.log('blockProps', blockProps)

	// Apply the default saved styles to the block.
	if ( ! attributes.uniqueId ) {
		// Get the default block styles.
		// Filter out content attributes.
		const blockStyle = getDefaultBlockStyle( name )
		if ( ! blockStyle ) {
			return
		}
		console.log('blockStyle', window.blockStyle = blockStyle)
		const blockData = JSON.parse( blockStyle.data )
		let newAttributes = omit( blockData.attributes, CONTENT_ATTRIBUTES, 'uniqueId' )

		// TODO: this works, but only to those without a variation. If there's a layout picker, we shouldn't use this!
		if ( attributes.className?.startsWith( 'is-style-' ) ) {
			// const styleName = attributes.className.
			const potentialStyleName = attributes.className.substring( 9 )
			const blockStyle = find( blockStyles, { name: potentialStyleName } )
			if ( blockStyle ) {
				newAttributes = {
					...newAttributes,
					...blockStyle.onSelect( newAttributes ),
				}
			}
		}

		console.log('newAttributes', newAttributes)
		// Apply the attributes to the block.
		Object.keys( newAttributes ).forEach( attrName => {
			attributes[ attrName ] = newAttributes[ attrName ]
		} )

		console.log('name')
	}

	// TODO: what if the block is a card, would the above work? how about the inner blocks?
	// TODO: if there's a variation, apply the block style only if the default variation is used.
}
