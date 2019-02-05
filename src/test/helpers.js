import {
	createBlock,
	getSaveContent,
	registerBlockType,
	unregisterBlockType,
} from '@wordpress/blocks'

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
	} else if ( type === 'boolean' ) {
		return ! defaultValue
	} else if ( type === 'number' ) {
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
