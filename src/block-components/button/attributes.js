/**
 * External dependencies
 */
import {
	addBorderAttributes,
} from '~stackable/block-components'
import { omit } from 'lodash'
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
	buttonTextColor: {
		type: 'string',
		stkHover: true,
		default: '',
	},
	buttonMinHeight: {
		stkResponsive: true,
		type: 'number',
		default: '',
	},
}

export const addAttributes = ( attrObject, options = {} ) => {
	const {
		hasTextColor = true,
		hasIconGap = true,
		hasIconPosition = true,
		selector,
	} = options
	const attributesToExclude = []

	if ( ! hasTextColor ) {
		attributesToExclude.push(
			'buttonTextColorType',
			'buttonTextColor1',
			'buttonTextColor2',
			'buttonTextGradientDirection',
		)
	}

	attrObject.add( {
		attributes: attributesToExclude.length
			? omit( buttonAttributes, attributesToExclude )
			: buttonAttributes,
		versionAdded: '3.0.0',
		versionDeprecated: '',
	} )

	addBorderAttributes( attrObject, 'button%s' )
	Link.addAttributes( attrObject, { selector } )
	Icon.addAttributes( attrObject, {
		hasGradient: false,
		hasShape: false,
		hasBackgroundShape: false,
		hasIconGap,
		hasIconPosition,
	} )
}
