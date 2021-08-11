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
		onSelect: () => ( { hasContainer: false } ),
	},

	// TODO: These are premium designs.
	{
		name: 'portfolio',
		label: __( 'Portfolio', i18n ),
		onSelect: () => ( { hasContainer: true } ),
	},
	{
		name: 'vertical-card',
		label: __( 'Vertical Card', i18n ),
		onSelect: () => ( { hasContainer: true } ),
	},
	{
		name: 'vertical-card-2',
		label: __( 'Vertical Card 2', i18n ),
		onSelect: () => ( { hasContainer: true } ),
	},
]
