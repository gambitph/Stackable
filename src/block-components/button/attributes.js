/**
 * External dependencies
 */
import { addBorderAttributes } from '~stackable/block-components'
import { Link, Icon } from '../'

const buttonAttributes = {
	padding: {
		stkResponsive: true,
		type: 'object',
		stkUnits: 'px',
	},
	backgroundColorType: {
		type: 'string',
		default: '',
	},
	backgroundColor: {
		stkHover: true,
		type: 'string',
		default: '', // button primary color.
	},
	backgroundColor2: {
		stkHover: true,
		type: 'string',
		default: '',
	},
	backgroundGradientDirection: {
		stkHover: true,
		type: 'number',
		default: '',
	},
	minHeight: {
		stkResponsive: true,
		type: 'number',
		default: '',
	},
	width: {
		stkResponsive: true,
		type: 'number',
		default: '',
	},
	fullWidth: {
		type: 'boolean',
		default: '',
	},
	hoverEffect: {
		type: 'string',
		default: 'darken',
	},
}

export const addAttributes = ( attrObject, options = {} ) => {
	const {
		selector,
		attrNameTemplate = 'button%s',
	} = options

	attrObject.add( {
		attributes: buttonAttributes,
		attrNameTemplate,
		versionAdded: '3.0.0',
		versionDeprecated: '',
	} )

	addBorderAttributes( attrObject, attrNameTemplate )
	Link.addAttributes( attrObject, { selector } )
	Icon.addAttributes( attrObject )
}
