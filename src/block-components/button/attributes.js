import { addLinkAttributes } from '../helpers/link'

export const addAttributes = ( attrObject, options = {} ) => {
	const {
		selector = '.stk-button__button',
	} = options
	attrObject.add( {
		attributes: {
			buttonPaddingTop: {
				stkResponsive: true,
				type: 'number',
				default: '',
			},
			buttonPaddingBottom: {
				stkResponsive: true,
				type: 'number',
				default: '',
			},
			buttonPaddingRight: {
				stkResponsive: true,
				type: 'number',
				default: '',
			},
			buttonPaddingLeft: {
				stkResponsive: true,
				type: 'number',
				default: '',
			},
			buttonPaddingUnit: {
				stkResponsive: true,
				type: 'string',
				default: 'px',
			},
			buttonBackgroundColorType: {
				stkHover: true,
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
			text: {
				source: 'html',
				selector,
				default: '',
			},
		},
		versionAdded: '3.0.0',
		versionDeprecated: '',
	} )

	addLinkAttributes( attrObject, 'link%s', selector )
}
