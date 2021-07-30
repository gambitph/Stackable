/**
 * External dependencies
 */
import { i18n } from 'stackable'
import { getAttrNameFunction } from '~stackable/util'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'

const _getAttributeName = getAttrNameFunction( 'button%s' )

export const blockStyles = [
	{
		name: 'default',
		label: __( 'Default', i18n ),
		isDefault: true,
		onSelect: attributes => {
			const states = [ 'normal', 'hover', 'parent-hover' ]
			const getAttributeName = ( attrName, state = 'normal' ) => _getAttributeName( attrName, 'Desktop', state )
			const getAttribute = ( attrName, state = 'normal' ) => attributes[ getAttributeName( attrName, state ) ]

			let willSetAttributes = {}

			willSetAttributes.buttonBorderType = ''

			states.forEach( state => {
				willSetAttributes = {
					...willSetAttributes,
					[ getAttributeName( 'BackgroundColor', state ) ]: getAttribute( 'BackgroundColor', state ) !== 'transparent'
						? getAttribute( 'BackgroundColor', state )
						: getAttribute( 'TextColor', state ),
					[ getAttributeName( 'TextColor', state ) ]: getAttribute( 'BackgroundColor', state ) === 'transparent'
						? undefined
						: getAttribute( 'BackgroundColor', state ),

				}
			} )

			return willSetAttributes
		},
	},
	{
		name: 'ghost',
		label: __( 'Ghost', i18n ),
		onSelect: attributes => {
			const states = [ 'normal', 'hover', 'parent-hover' ]
			const getAttributeName = ( attrName, state = 'normal' ) => _getAttributeName( attrName, 'Desktop', state )
			const getAttribute = ( attrName, state = 'normal' ) => attributes[ getAttributeName( attrName, state ) ]

			let willSetAttributes = {}

			willSetAttributes.buttonBackgroundColorType = ''
			willSetAttributes.buttonBorderType = 'solid'

			states.forEach( state => {
				willSetAttributes = {
					...willSetAttributes,
					[ getAttributeName( 'BorderColor', state ) ]: getAttribute( 'BackgroundColor', state ) === 'transparent'
						? getAttribute( 'TextColor', state )
						: getAttribute( 'BackgroundColor', state ),
					[ getAttributeName( 'BackgroundColor', state ) ]: 'transparent',
					[ getAttributeName( 'TextColor' ) ]: getAttribute( 'BackgroundColor', state ) === 'transparent'
						? getAttribute( 'BorderColor', state ) || getAttribute( 'TextColor', state )
						: getAttribute( 'BackgroundColor' ),
				}
			} )

			return willSetAttributes
		},
	},
	{
		name: 'plain',
		label: __( 'Plain', i18n ),
		onSelect: attributes => {
			const states = [ 'normal', 'hover', 'parent-hover' ]
			const getAttributeName = ( attrName, state = 'normal' ) => _getAttributeName( attrName, 'Desktop', state )
			const getAttribute = ( attrName, state = 'normal' ) => attributes[ getAttributeName( attrName, state ) ]

			let willSetAttributes = {}

			willSetAttributes.buttonBackgroundColorType = ''
			willSetAttributes.buttonBorderType = ''

			states.forEach( state => {
				willSetAttributes = {
					...willSetAttributes,
					[ getAttributeName( 'TextColor', state ) ]: getAttribute( 'BackgroundColor', state ) === 'transparent'
						? getAttribute( 'TextColor', state )
						: getAttribute( 'BackgroundColor', state ),
					[ getAttributeName( 'BackgroundColor', state ) ]: 'transparent',
				}
			} )

			return willSetAttributes
		},
	},
]
