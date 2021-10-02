/**
 * External dependencies
 */
import { i18n } from 'stackable'
import { getAttributeName as _getAttributeName } from '~stackable/util'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'

/**
 * Internal dependencies
 */
import ImageDefault from './images/default.svg'
import ImageGhost from './images/ghost.svg'
import ImagePlain from './images/plain.svg'
import ImagePill from './images/pill.svg'

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
				: getAttribute( 'iconColor1', state ),
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
		icon: ImageDefault,
		onSelect: defaultOnSelect,
	},
	{
		name: 'ghost',
		label: __( 'Ghost', i18n ),
		icon: ImageGhost,
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
					[ getAttributeName( 'iconColor1', state ) ]: getAttribute( 'buttonBackgroundColor', state ) === 'transparent'
						? getAttribute( 'buttonBorderType', state ) ? getAttribute( 'buttonBorderColor', state ) : getAttribute( 'iconColor1', state )
						: getAttribute( 'buttonBackgroundColor', state ),
				}
			} )

			return willSetAttributes
		},
	},
	{
		name: 'pill',
		label: __( 'Pill', i18n ),
		icon: ImagePill,
		// Same implementation as the default style, except we add additional styles in style.scss
		onSelect: defaultOnSelect,
	},
	{
		name: 'plain',
		label: __( 'Plain', i18n ),
		icon: ImagePlain,
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
					[ getAttributeName( 'buttonBackgroundColor', state ) ]: 'transparent',
				}
			} )

			return willSetAttributes
		},
	},
]
