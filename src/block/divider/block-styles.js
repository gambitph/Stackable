/**
 * External dependencies
 */
import { i18n } from 'stackable'
import { getAttributeName as _getAttributeName } from '~stackable/util'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'

export const blockStyles = [
	{
		name: 'default',
		label: __( 'Default', i18n ),
		isDefault: true,
	},
	{
		name: 'bar',
		label: __( 'Bar', i18n ),
	},
	{
		name: 'dots',
		label: __( 'Dots', i18n ),
	},
	{
		name: 'asterisks',
		label: __( 'Asterisks', i18n ),
	},
]
