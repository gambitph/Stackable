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

const defaultOnSelect = attributes => {
	const getAttribute = ( attrName, state = 'normal' ) => attributes[ getAttributeName( attrName, state ) ]
	let willSetAttributes = {}

	willSetAttributes.buttonBorderType = ''

	states.forEach( state => {
		willSetAttributes = {
			...willSetAttributes,
			[ getAttributeName( 'buttonBackgroundColor', state ) ]: getAttribute( 'buttonBackgroundColor', state ) !== 'transparent'
				? getAttribute( 'buttonBackgroundColor', state )
				: getAttribute( 'iconColor1', state ),
			[ getAttributeName( 'iconColor1', state ) ]: getAttribute( 'buttonBackgroundColor', state ) === 'transparent'
				? undefined
				: getAttribute( 'buttonBackgroundColor', state ),
			[ getAttributeName( 'buttonWidth', state ) ]: undefined,
		}
	} )

	return willSetAttributes
}

export const blockStyles = [
	{
		name: 'default',
		label: __( 'Default', i18n ),
		isDefault: true,
		onSelect: defaultOnSelect,
	},
	{
		name: 'pill',
		label: __( 'Pill', i18n ),
		// Same implementation with default style, except we add additional styles in style.scss
		onSelect: defaultOnSelect,
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
						? getAttribute( 'iconColor1', state )
						: getAttribute( 'buttonBackgroundColor', state ),
					[ getAttributeName( 'buttonBackgroundColor', state ) ]: 'transparent',
					[ getAttributeName( 'iconColor1' ) ]: getAttribute( 'buttonBackgroundColor', state ) === 'transparent'
						? getAttribute( 'buttonBorderColor', state ) || getAttribute( 'iconColor1', state )
						: getAttribute( 'buttonBackgroundColor' ),
				}
			} )

			return willSetAttributes
		},
	},
]
