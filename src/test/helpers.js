import { createBlock, registerBlockType, unregisterBlockType } from '@wordpress/blocks'

export const getDefaultAttributes = ( blockName, blockSettings ) => {
	if ( typeof blockSettings.save === 'undefined' ) {
		throw 'save block setting is required'
	}

	registerBlockType( blockName, blockSettings )
	const { attributes } = createBlock( blockName )
	unregisterBlockType( blockName )

	return attributes
}

export const createAttributeValues = schema => {
	return Object.keys( schema ).reduce( ( attrs, attrName ) => {
		return {
			...attrs,
			[ attrName ]: createAttributeValue( attrName, schema[ attrName ] ),
		}
	}, {} )
}

export const createAttributeValue = ( attrName, attrParams ) => {
	const {
		type = 'string',
		default: defaultValue = '',
	} = attrParams

	if ( type === 'boolean' ) {
		// return Math.random() > 0.5
		return ! defaultValue
	} else if ( type === 'number' ) {
		// return Math.floor( Math.random() * 100 )
		return Math.floor( defaultValue / 2 )
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
