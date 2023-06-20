/**
 * Internal dependencies
 */
import ImageDefault from './images/default.svg'

/**
 * External dependencies
 */
import { i18n } from 'stackable'
import { getAttributeName as _getAttributeName } from '~stackable/util'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'

const getAttributeName = ( attrName, state = 'normal' ) => _getAttributeName( attrName, 'Desktop', state )

export const blockStyles = [
	{
		name: 'default',
		label: __( 'Default', i18n ),
		isDefault: true,
		// icon: ImageDefault,
		onSelect: attributes => {
			// const getAttribute = ( attrName, state = 'normal' ) => attributes[ getAttributeName( attrName, state ) ]
			const willSetAttributes = {}

			// willSetAttributes.buttonBorderType = ''

			// states.forEach( state => {
			// 	willSetAttributes = {
			// 		...willSetAttributes,
			// 		[ getAttributeName( 'buttonBackgroundColor', state ) ]: getAttribute( 'buttonBackgroundColor', state ) !== 'transparent'
			// 			? getAttribute( 'buttonBackgroundColor', state )
			// 			: getAttribute( 'textColor1', state ),
			// 		[ getAttributeName( 'textColor1', state ) ]: getAttribute( 'buttonBackgroundColor', state ) === 'transparent'
			// 			? undefined
			// 			: getAttribute( 'buttonBackgroundColor', state ),
			// 	}
			// } )

			return willSetAttributes
		},
	},
	{
		name: 'centered-buttons',
		label: __( 'Centered Buttons', i18n ),
		disabled: true,
		// isDefault: true,
		// icon: ImageDefault,
		onSelect: attributes => {
			// const getAttribute = ( attrName, state = 'normal' ) => attributes[ getAttributeName( attrName, state ) ]
			const willSetAttributes = {}

			// willSetAttributes.buttonBorderType = ''

			// states.forEach( state => {
			// 	willSetAttributes = {
			// 		...willSetAttributes,
			// 		[ getAttributeName( 'buttonBackgroundColor', state ) ]: getAttribute( 'buttonBackgroundColor', state ) !== 'transparent'
			// 			? getAttribute( 'buttonBackgroundColor', state )
			// 			: getAttribute( 'textColor1', state ),
			// 		[ getAttributeName( 'textColor1', state ) ]: getAttribute( 'buttonBackgroundColor', state ) === 'transparent'
			// 			? undefined
			// 			: getAttribute( 'buttonBackgroundColor', state ),
			// 	}
			// } )

			return willSetAttributes
		},
	},
]
