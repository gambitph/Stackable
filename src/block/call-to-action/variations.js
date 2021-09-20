/**
 * External dependencies
 */
import { i18n } from 'stackable'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'

/**
 * Template option choices for predefined columns layouts.
 *
 * @type {WPBlockVariation[]}
 */
const variations = [
	{
		name: 'default',
		title: __( 'Default', i18n ),
		description: __( 'Default Layout', i18n ),
		isDefault: true,
		attributes: {
			hasContainer: true,
		},
		innerBlocks: [
			[ 'stackable/heading', { text: __( 'Call to Action' ), textTag: 'h3' } ],
			[ 'stackable/text', { text: 'Description for this block. Use this space for describing your block.' } ],
			[ 'stackable/button-group', {}, [
				[ 'stackable/button', { text: 'Button' } ],
			] ],
		],
		scope: [ 'block' ],
	},
	{
		name: 'plain',
		title: __( 'Plain', i18n ),
		description: __( 'Plain Layout', i18n ),
		attributes: {
			hasContainer: false,
		},
		innerBlocks: [
			[ 'stackable/heading', { text: __( 'Call to Action' ), textTag: 'h3' } ],
			[ 'stackable/text', { text: 'Description for this block. Use this space for describing your block.' } ],
			[ 'stackable/button-group', {}, [
				[ 'stackable/button', { text: 'Button' } ],
			] ],
		],
		scope: [ 'block' ],
	},
	{
		name: 'horizontal',
		title: __( 'Horizontal', i18n ),
		description: __( 'Horizontal Layout', i18n ),
		attributes: {
			hasContainer: true,
			innerBlockOrientation: 'horizontal',
		},
		innerBlocks: [
			[ 'stackable/heading', { text: __( 'Call to Action' ), textTag: 'h3' } ],
			[ 'stackable/text', { text: 'Description for this block. Use this space for describing your block.' } ],
			[ 'stackable/button-group', {}, [
				[ 'stackable/button', { text: 'Button' } ],
			] ],
		],
		scope: [ 'block' ],
	},
	{
		name: 'horizontal-2',
		title: __( 'Horizontal 2', i18n ),
		description: __( 'Horizontal 2 Layout', i18n ),
		attributes: {
			hasContainer: true,
		},
		innerBlocks: [
			[ 'stackable/columns', { forceHideVariationPicker: true }, [
				[ 'stackable/column', { contentAlign: 'left' }, [
					[ 'stackable/heading', { text: __( 'Call to Action' ), textTag: 'h3' } ],
					[ 'stackable/text', { text: 'Description for this block. Use this space for describing your block.' } ],
				] ],
				[ 'stackable/column', { contentAlign: 'right' }, [
					[ 'stackable/button-group', {}, [
						[ 'stackable/button', { text: 'Button' } ],
					] ],
				] ],
			] ],
		],
		scope: [ 'block' ],
	},
	{
		name: 'horizontal-3',
		title: __( 'Horizontal 3', i18n ),
		description: __( 'Horizontal 3 Layout', i18n ),
		attributes: {
			hasContainer: true,
		},
		innerBlocks: [
			[ 'stackable/columns', { forceHideVariationPicker: true }, [
				[ 'stackable/column', { contentAlign: 'left' }, [
					[ 'stackable/heading', { text: __( 'Call to Action' ), textTag: 'h3' } ],
				] ],
				[ 'stackable/column', { contentAlign: 'right' }, [
					[ 'stackable/text', { text: 'Description for this block. Use this space for describing your block.' } ],
					[ 'stackable/button-group', {}, [
						[ 'stackable/button', { text: 'Button' } ],
					] ],
				] ],
			] ],
		],
		scope: [ 'block' ],
	},
	{
		name: 'split-centered',
		title: __( 'Split Centered', i18n ),
		description: __( 'Split Centered Layout', i18n ),
		attributes: {
			hasContainer: true,
		},
		innerBlocks: [
			[ 'stackable/columns', { forceHideVariationPicker: true }, [
				[ 'stackable/column', { contentAlign: 'right' }, [
					[ 'stackable/heading', { text: __( 'Call to Action' ), textTag: 'h1' } ],
				] ],
				[ 'stackable/column', { contentAlign: 'left' }, [
					[ 'stackable/text', { text: 'Description for this block. Use this space for describing your block.' } ],
					[ 'stackable/button-group', {}, [
						[ 'stackable/button', { text: 'Button' } ],
					] ],
				] ],
			] ],
		],
		scope: [ 'block' ],
	},
]

export default variations
