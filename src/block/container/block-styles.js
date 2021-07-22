/**
 * Internal dependencies
 */
// TODO: Add svg icons

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
		onSelect: () => {
			return {
				showImage: false, imageHeight: '', imageWidth: '',
			}
		},
		isDefault: true,
	},
	{
		name: 'image',
		label: __( 'Image', i18n ),
		onSelect: () => {
			return {
				showImage: true, imageWidth: 100, imageHeight: '', imageWidthUnit: '%',
			}
		},
	},
	{
		name: 'image-2',
		label: __( 'Image 2', i18n ),
		onSelect: () => {
			return {
				showImage: true, imageHeight: 100, imageWidth: '', imageHeightUnit: '%',
			}
		},
	},
	{
		name: 'image-3',
		label: __( 'Image 3', i18n ),
		onSelect: () => {
			return {
				showImage: true, imageHeight: 100, imageWidth: '', imageHeightUnit: '%',
			}
		},
	},
]
