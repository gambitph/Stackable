/**
 * External dependencies
 */
import { i18n } from 'stackable'
import { getAttributeName as _getAttributeName } from '~stackable/util'

/**
 * Internal dependencies
 */
import ImageDefault from './images/default.svg'
import ImageBar from './images/bar.svg'
import ImageDots from './images/dots.svg'
import ImageAsterisks from './images/asterisks.svg'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'

export const blockStyles = [
	{
		name: 'default',
		label: __( 'Default', i18n ),
		isDefault: true,
		icon: ImageDefault,
	},
	{
		name: 'bar',
		label: __( 'Bar', i18n ),
		icon: ImageBar,
	},
	{
		name: 'dots',
		label: __( 'Dots', i18n ),
		icon: ImageDots,
	},
	{
		name: 'asterisks',
		label: __( 'Asterisks', i18n ),
		icon: ImageAsterisks,
	},
]
