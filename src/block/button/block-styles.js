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
import ImageLink from './images/link.svg'

const states = [ 'normal', 'hover', 'parent-hover' ]
const getAttributeName = ( attrName, state = 'normal' ) => _getAttributeName( attrName, 'Desktop', state )

export const blockStyles = [
	{
		name: 'default',
		label: __( 'Default', i18n ),
		isDefault: true,
		icon: ImageDefault,
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
					[ getAttributeName( 'textColor1', state ) ]: getAttribute( 'buttonBackgroundColor', state ) === 'transparent'
						? getAttribute( 'textColor1', state )
						: getAttribute( 'buttonBackgroundColor', state ),
					[ getAttributeName( 'buttonBackgroundColor', state ) ]: 'transparent',
				}
			} )

			return willSetAttributes
		},
	},
	{
		name: 'link',
		label: __( 'Link', i18n ),
		icon: ImageLink,
		onSelect: () => {
			let willSetAttributes = {}

			willSetAttributes.buttonBackgroundColorType = ''
			willSetAttributes.buttonBorderType = ''

			states.forEach( state => {
				willSetAttributes = {
					...willSetAttributes,
					[ getAttributeName( 'buttonBackgroundColor', state ) ]: '',
					[ getAttributeName( 'buttonBorderType', state ) ]: '',
					[ getAttributeName( 'iconColor1', state ) ]: '',
					[ getAttributeName( 'textColor1', state ) ]: '',
					[ getAttributeName( 'buttonBackgroundColor', state ) ]: '',
				}
			} )

			return willSetAttributes
		},
	},
]
