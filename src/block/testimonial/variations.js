/**
 * Internal dependencies
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
		name: 'basic',
		title: __( 'Basic', i18n ),
		description: __( 'Basic Layout', i18n ),
		attributes: { className: 'is-style-basic' },
		isDefault: true,
		innerBlocks: [
			[ 'stackable/text', { text: __( 'Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block.', i18n ) } ],
			[ 'stackable/image', {
				imageHeight: 75, imageWidth: 75, imageWidthUnit: 'px', imageBorderRadius: 90,
			} ],
			[ 'stackable/heading', {
				text: __( 'Name', i18n ), textTag: 'h3', textRemoveTextMargins: true,
			} ],
			[ 'stackable/subtitle', {
				text: __( 'Position', i18n ),
			} ],
		],
		scope: [ 'block' ],
	},
	{
		name: 'plain',
		title: __( 'Plain', i18n ),
		description: __( 'Plain Layout', i18n ),
		attributes: { className: 'is-style-plain', hasContainer: false },
		isDefault: true,
		innerBlocks: [
			[ 'stackable/text', { text: __( 'Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block.', i18n ) } ],
			[ 'stackable/image', {
				imageHeight: 75, imageWidth: 75, imageWidthUnit: 'px', imageBorderRadius: 90,
			} ],
			[ 'stackable/heading', {
				text: __( 'Name', i18n ), textTag: 'h3', textRemoveTextMargins: true,
			} ],
			[ 'stackable/subtitle', {
				text: __( 'Position', i18n ),
			} ],
		],
		scope: [ 'block' ],
	},
	{
		name: 'basic-2',
		title: __( 'Basic 2', i18n ),
		description: __( 'Basic 2 Layout', i18n ),
		attributes: { className: 'is-style-basic-2', hasContainer: false },
		isDefault: true,
		innerBlocks: [
			[ 'stackable/text', { text: __( 'Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block.', i18n ), hasBackground: true } ],
			[ 'stackable/columns', {}, [
				[ 'stackable/column', { columnWidth: 25 }, [
					[ 'stackable/image', {
						imageHeight: 75, imageWidth: 75, imageWidthUnit: 'px', imageBorderRadius: 90,
					} ],
				] ],
				[ 'stackable/column', { columnWidth: 75, contentAlign: 'left' }, [
					[ 'stackable/heading', {
						text: __( 'Name', i18n ), textTag: 'h3', textRemoveTextMargins: true,
					} ],
					[ 'stackable/subtitle', {
						text: __( 'Position', i18n ),
					} ],
				] ],
			] ],
		],
		scope: [ 'block' ],
	},
	{
		name: 'bubble',
		title: __( 'Bubble', i18n ),
		description: __( 'Bubble Layout', i18n ),
		attributes: { className: 'is-style-bubble', hasContainer: false },
		isDefault: true,
		innerBlocks: [
			[ 'stackable/text', {
				text: __( 'Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block.', i18n ), hasBackground: true, className: 'stk-block-testimonial__text',
			} ],
			[ 'stackable/columns', {}, [
				[ 'stackable/column', { columnWidth: 25 }, [
					[ 'stackable/image', {
						imageHeight: 75, imageWidth: 75, imageWidthUnit: 'px', imageBorderRadius: 90,
					} ],
				] ],
				[ 'stackable/column', { columnWidth: 75, contentAlign: 'left' }, [
					[ 'stackable/heading', {
						text: __( 'Name', i18n ), textTag: 'h3', textRemoveTextMargins: true,
					} ],
					[ 'stackable/subtitle', {
						text: __( 'Position', i18n ),
					} ],
				] ],
			] ],
		],
		scope: [ 'block' ],
	},
]

export default variations
