import { addLinkAttributes } from '../helpers/link'
import { addBorderAttributes } from '../helpers/borders'

export const addAttributes = ( attrObject, options = {} ) => {
	const {
		selector = '.stk-button__button',
	} = options
	attrObject.add( {
		attributes: {
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
		},
		versionAdded: '3.0.0',
		versionDeprecated: '',
	} )

	addLinkAttributes( attrObject, 'link%s', selector )
	addBorderAttributes( attrObject, 'button%s' )
}
