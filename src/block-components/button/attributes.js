import { convertResponsiveAttributes } from '~stackable/util'
import { addLinkAttributes } from '../helpers/link'

export const buttonAttributes = {
	// Button Paddings.
	...convertResponsiveAttributes( {
		buttonPaddingTop_: {
			type: 'number',
			default: '',
		},
		buttonPaddingBottom_: {
			type: 'number',
			default: '',
		},
		buttonPaddingRight_: {
			type: 'number',
			default: '',
		},
		buttonPaddingLeft_: {
			type: 'number',
			default: '',
		},
		buttonPaddingUnit_: {
			type: 'string',
			default: 'px',
		},
	} ),
	// Button Normal Styles
	buttonNoBackgroundColor: {
		type: 'boolean',
		default: '',
	},
	buttonBackgroundColorType: {
		type: 'string',
		default: '',
	},
	buttonBackgroundColor: {
		type: 'string',
		default: '', // button primary color.
	},
	buttonBackgroundColor2: {
		type: 'string',
		default: '',
	},
	buttonBackgroundGradientDirection: {
		type: 'number',
		default: '',
	},

	// Button Hover Styles
	buttonHoverNoBackgroundColor: {
		type: 'boolean',
		default: '',
	},
	buttonHoverBackgroundColorType: {
		type: 'string',
		default: '',
	},
	buttonHoverBackgroundColor: {
		type: 'string',
		default: '',
	},
	buttonHoverBackgroundColor2: {
		type: 'string',
		default: '',
	},
	buttonHoverBackgroundGradientDirection: {
		type: 'number',
		default: '',
	},
}

export const addAttributes = ( attrObject, options = {} ) => {
	const {
		selector = '.stk-button__button',
	} = options
	attrObject.add( {
		attributes: {
			...buttonAttributes,
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
