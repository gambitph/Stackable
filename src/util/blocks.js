/**
 * External dependencies
 */
import { omit } from 'lodash'
import { loadGoogleFontInAttributes } from '~stackable/util'

/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks'
import { createBlock } from '@wordpress/blocks'
import { dispatch, select } from '@wordpress/data'

const ignoreAttributes = [
	'uniqueClass',
]

// Checks whether a block is modified or not.
const cachedDefaultAttributes = {}
export function isUnmodifiedBlock( block ) {
	if ( ! cachedDefaultAttributes[ block.name ] ) {
		cachedDefaultAttributes[ block.name ] = createBlock( block.name ).attributes
	}
	return Object.keys( cachedDefaultAttributes[ block.name ] ).every( attrName => {
		if ( ignoreAttributes.includes( attrName ) ) {
			return true
		}
		return cachedDefaultAttributes[ block.name ][ attrName ] === block.attributes[ attrName ]
	} )
}

export const applyBlockDesign = ( attributes, clientId = null ) => {
	const {
		getBlockName, getSelectedBlockClientId, getBlockAttributes,
	} = select( 'core/block-editor' )
	const { updateBlockAttributes } = dispatch( 'core/block-editor' )
	const { getBlockType } = select( 'core/blocks' )

	const blockClientId = clientId ? clientId : getSelectedBlockClientId()
	if ( ! blockClientId ) {
		return
	}

	const currentBlockAttributes = getBlockAttributes( blockClientId )
	const blockName = getBlockName( blockClientId ).replace( /^\w+\//g, '' )
	const attributeDefinition = getBlockType( getBlockName( blockClientId ) ).attributes
	const defaultAttributes = Object.keys( attributeDefinition ).reduce( ( attrs, attrName ) => {
		return {
			...attrs,
			[ attrName ]: attributeDefinition[ attrName ] ? attributeDefinition[ attrName ].default : '',
		}
	}, {} )

	// The filter should omit attributes which should not be overridden. For example, text titles.
	const blockAttributes = applyFilters( `stackable.${ blockName }.design.apply-block-attributes`, { ...defaultAttributes, ...attributes }, currentBlockAttributes )

	// Check for any Fonts that we need to load.
	loadGoogleFontInAttributes( blockAttributes )

	updateBlockAttributes( blockClientId, omit( blockAttributes, [ 'uniqueClass' ] ) )
}
