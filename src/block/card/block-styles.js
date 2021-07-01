/**
 * Internal dependencies
 */
import ImageStyleDefault from './images/default.svg'
import ImageStyleHorizontal from './images/horizontal.svg'

/**
 * External dependencies
 */
import { i18n } from 'stackable'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'

export const blockStyles = [
	{
		name: 'default',
		label: __( 'Default', i18n ),
		isDefault: true,
		image: ImageStyleDefault,
	},
	{
		name: 'horizontal',
		label: __( 'Horizontal', i18n ),
		image: ImageStyleHorizontal,
	},
]
