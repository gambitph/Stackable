/**
 * External dependencies
 */
import {
	addBorderAttributes,
} from '~stackable/block-components'
import { Link, Icon } from '../'

const buttonAttributes = {
	buttonPadding: {
		stkResponsive: true,
		type: 'object',
		stkUnits: 'px',
	},
	buttonBackgroundColorType: {
		type: 'string',
		default: '',
	},
	buttonBackgroundColor: {
		stkHover: true,
		type: 'string',
		default: '', // button primary color.
	},
	buttonBackgroundColor2: {
		stkHover: true,
		type: 'string',
		default: '',
	},
	buttonBackgroundGradientDirection: {
		stkHover: true,
		type: 'number',
		default: '',
	},
	buttonMinHeight: {
		stkResponsive: true,
		type: 'number',
		default: '',
	},
	buttonWidth: {
		stkResponsive: true,
		type: 'number',
		default: '',
	},
	buttonFullWidth: {
		type: 'boolean',
		default: '',
	},
	buttonHoverEffect: {
		type: 'string',
		default: '',
	},
}

export const addAttributes = ( attrObject, options = {} ) => {
	const {
		selector,
	} = options

	attrObject.add( {
		attributes: buttonAttributes,
		versionAdded: '3.0.0',
		versionDeprecated: '',
	} )

	addBorderAttributes( attrObject, 'button%s' )
	Link.addAttributes( attrObject, { selector } )
	Icon.addAttributes( attrObject )
}
