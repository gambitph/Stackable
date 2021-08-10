/**
 * External dependencies
 */
import { i18n } from 'stackable'
import { getAttributeName as _getAttributeName } from '~stackable/util'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'

const states = [ 'normal', 'hover', 'parent-hover' ]
const getAttributeName = ( attrName, state = 'normal' ) => _getAttributeName( attrName, 'Desktop', state )

export const blockStyles = [
	{
		name: 'default',
		label: __( 'Default', i18n ),
		isDefault: true,
		onSelect: attributes => {
			const getAttribute = ( attrName, state = 'normal' ) => attributes[ getAttributeName( attrName, state ) ]
			let willSetAttributes = {}

			willSetAttributes.buttonBorderType = ''

			states.forEach( state => {
				willSetAttributes = {
					...willSetAttributes,
					[ getAttributeName( 'buttonBackgroundColor', state ) ]: getAttribute( 'buttonBackgroundColor', state ) !== 'transparent'
						? getAttribute( 'buttonBackgroundColor', state )
						: getAttribute( 'textColor1', state ),
					[ getAttributeName( 'textColor1', state ) ]: getAttribute( 'buttonBackgroundColor', state ) === 'transparent'
						? undefined
						: getAttribute( 'buttonBackgroundColor', state ),
				}
			} )

			return willSetAttributes
		},
	},
	{
		name: 'ghost',
		label: __( 'Ghost', i18n ),
		onSelect: attributes => {
			const getAttribute = ( attrName, state = 'normal' ) => attributes[ getAttributeName( attrName, state ) ]

			let willSetAttributes = {}

			willSetAttributes.buttonBackgroundColorType = ''
			willSetAttributes.buttonBorderType = 'solid'

			states.forEach( state => {
				willSetAttributes = {
					...willSetAttributes,
					[ getAttributeName( 'buttonBorderColor', state ) ]: getAttribute( 'buttonBackgroundColor', state ) === 'transparent'
						? getAttribute( 'textColor1', state )
						: getAttribute( 'buttonBackgroundColor', state ),
					[ getAttributeName( 'buttonBackgroundColor', state ) ]: 'transparent',
					[ getAttributeName( 'textColor1', state ) ]: getAttribute( 'buttonBackgroundColor', state ) === 'transparent'
						? getAttribute( 'buttonBorderColor', state ) || getAttribute( 'textColor1', state )
						: getAttribute( 'buttonBackgroundColor', state ),
					[ getAttributeName( 'iconColor1', state ) ]: getAttribute( 'buttonBackgroundColor', state ) === 'transparent'
						? getAttribute( 'buttonBorderType', state ) ? getAttribute( 'buttonBorderColor', state ) : getAttribute( 'iconColor1', state )
						: getAttribute( 'buttonBackgroundColor', state ),
				}
			} )

			return willSetAttributes
		},
	},
	{
		name: 'plain',
		label: __( 'Plain', i18n ),
		onSelect: attributes => {
			const getAttribute = ( attrName, state = 'normal' ) => attributes[ getAttributeName( attrName, state ) ]

			let willSetAttributes = {}

			willSetAttributes.buttonBackgroundColorType = ''
			willSetAttributes.buttonBorderType = ''

			states.forEach( state => {
				willSetAttributes = {
					...willSetAttributes,
					[ getAttributeName( 'iconColor1', state ) ]: getAttribute( 'buttonBackgroundColor', state ) === 'transparent'
						? getAttribute( 'iconColor1', state )
						: getAttribute( 'buttonBackgroundColor', state ),
					[ getAttributeName( 'textColor1', state ) ]: getAttribute( 'buttonBackgroundColor', state ) === 'transparent'
						? getAttribute( 'textColor1', state )
						: getAttribute( 'buttonBackgroundColor', state ),
					[ getAttributeName( 'buttonBackgroundColor', state ) ]: 'transparent',
				}
			} )

			return willSetAttributes
		},
	},
]
