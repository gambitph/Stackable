/**
 * External dependencies
 */
import registerStackableBlock from '~stackable/register-block'

/**
 * WordPress dependencies
 */
import {
	createBlock,
	getBlockType,
	getSaveContent,
	getSaveElement,
	registerBlockType,
	unregisterBlockType,
} from '@wordpress/blocks'
import { render } from 'enzyme'

// TODO: cleanup, remove unused functions here

export const blockSaveRender = ( name, settings, attributes = null ) => {
	if ( ! getBlockType( name ) ) {
		registerStackableBlock( name, { ...settings, category: 'common' } )
	}
	const attributesToRender = getBlockModifiedAttributes( name, settings, attributes )
	return render( getSaveElement( name, attributesToRender ) )
}

/**
 * Creates an object containing attributes with modified values.
 *
 * @param {string} name Block name
 * @param {Object} settings Block settings
 * @param {Object} attributes Attributes to override
 *
 * @return {Object} Attributes
 */
export const getBlockModifiedAttributes = ( name, settings, attributes = null ) => {
	if ( ! getBlockType( name ) ) {
		registerStackableBlock( name, { ...settings, category: 'common' } )
	}
	const block = createBlock( name )
	return {
		...block.attributes,
		...( attributes ? { ...createAttributeValues( settings.attributes, settings ), ...attributes } : {} ),
	}
}

export const getDefaultAttributes = ( blockName, blockSettings ) => {
	if ( typeof blockSettings.save === 'undefined' ) {
		throw 'save block setting is required'
	}

	registerBlockType( blockName, blockSettings )
	const { attributes } = createBlock( blockName )
	unregisterBlockType( blockName )

	return attributes
}

export const getSavedBlockHTML = props => {
	const {
		name,
		settings,
		save,
		attributes = {},
	} = props

	const blockSettings = {
		...settings,
		category: 'common',
		save,
	}

	const renderAttributes = {
		...getDefaultAttributes( name, blockSettings ),
		...attributes,
	}

	return getSaveContent(
		{
			...blockSettings,
			name,
		},
		renderAttributes,
	)
}

export const createAttributeValues = ( schema, blockSettings ) => {
	return Object.keys( schema ).reduce( ( attrs, attrName ) => {
		return {
			...attrs,
			[ attrName ]: createAttributeValue( attrName, schema[ attrName ], blockSettings ),
		}
	}, {} )
}

export const createAttributeValue = ( attrName, attrParams, blockSettings = {} ) => {
	const {
		type = 'string',
		default: defaultValue = '',
	} = attrParams

	if ( attrName === 'align' ) {
		// Use the last supported value of align.
		if ( blockSettings.supports && blockSettings.supports.align ) {
			const align = blockSettings.supports.align
			return Array.isArray( align ) ? align[ align.length - 1 ] : 'right'
		}
		return 'right'
	} else if ( attrName === 'columns' ) {
		return 3
	} else if ( type === 'boolean' ) {
		return ! defaultValue
	} else if ( type === 'number' ) {
		if ( typeof defaultValue === 'number' ) {
			return Math.floor( defaultValue / 2 )
		}
		return 123
	} else if ( type === 'url' ) {
		return `https://${ attrName }.com`
	} else if ( type === 'color' ) {
		return '#123456'
	} else if ( attrName.match( /color/i ) ) {
		return '#123456'
	} else if ( attrParams.multiline ) {
		return `<${ attrParams.multiline }>${ attrName }</${ attrParams.multiline }>`
	}
	return attrName
}
