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
		name: 'plain',
		title: __( 'Plain', i18n ),
		description: __( 'Plain Layout', i18n ),
		attributes: { className: 'is-style-plain' },
		isDefault: true,
		innerBlocks: [
			[ 'stackable/column', {}, [
				[ 'stackable/heading', { text: __( 'Feature' ) } ],
				[ 'stackable/text', { text: __( 'Description for this block. Use this space for describing your block.' ) } ],
				[ 'stackable/button-group', {}, [
					[ 'stackable/button', { text: __( 'Button' ) } ],
				] ],
			] ],
			[ 'stackable/column', { templateLock: 'insert' }, [
				[ 'stackable/image', {} ],
			] ],
		],
		scope: [ 'block' ],
	},
	{
		name: 'overlap-shape-1',
		title: __( 'Overlap Shape 1', i18n ),
		description: __( 'Overlap Shape 1 Layout', i18n ),
		attributes: { className: 'is-style-overlap-shape-1', alignVertical: true },
		innerBlocks: [
			[ 'stackable/column', {
				zIndex: 1,
				templateLock: 'insert',
				blockMargin: {
					bottom: -400,
				},
			}, [
				[ 'stackable/image', {
					imageShape: 'blob1',
				} ],
			] ],
			[ 'stackable/column', {
				hasContainer: true,
				containerWidth: 350,
				zIndex: 2,
			}, [
				[ 'stackable/heading', { text: __( 'Feature' ) } ],
				[ 'stackable/text', { text: __( 'Description for this block. Use this space for describing your block.' ) } ],
				[ 'stackable/button-group', {}, [
					[ 'stackable/button', { text: __( 'Button' ) } ],
				] ],
			] ],
		],
		scope: [ 'block' ],
	},
	{
		name: 'overlap-shape-2',
		title: __( 'Overlap Shape 2', i18n ),
		description: __( 'Overlap Shape 2 Layout', i18n ),
		attributes: { className: 'is-style-overlap-shape-2', alignVertical: true },
		innerBlocks: [
			[ 'stackable/column', {
				zIndex: 1,
				templateLock: 'insert',
				blockMargin: {
					bottom: -300,
				},
			}, [
				[ 'stackable/image', {
					imageShape: 'blob1',
				} ],
			] ],
			[ 'stackable/column', {
				hasContainer: true,
				containerWidth: 400,
				zIndex: 2,
			}, [
				[ 'stackable/heading', { text: __( 'Feature' ) } ],
				[ 'stackable/text', { text: __( 'Description for this block. Use this space for describing your block.' ) } ],
				[ 'stackable/button-group', {}, [
					[ 'stackable/button', { text: __( 'Button' ) } ],
				] ],
			] ],
		],
		scope: [ 'block' ],
	},
	{
		name: 'overlap-shape-3',
		title: __( 'Overlap Shape 3', i18n ),
		description: __( 'Overlap Shape 3 Layout', i18n ),
		attributes: { className: 'is-style-overlap-shape-3', alignVertical: true },
		innerBlocks: [
			[ 'stackable/column', {
				zIndex: 1,
				templateLock: 'insert',
				blockMargin: {
					bottom: -450,
				},
			}, [
				[ 'stackable/image', {
					imageShape: 'blob1',
				} ],
			] ],
			[ 'stackable/column', {
				hasContainer: true,
				containerWidth: 400,
				zIndex: 2,
			}, [
				[ 'stackable/heading', { text: __( 'Feature' ) } ],
				[ 'stackable/text', { text: __( 'Description for this block. Use this space for describing your block.' ) } ],
				[ 'stackable/button-group', {}, [
					[ 'stackable/button', { text: __( 'Button' ) } ],
				] ],
			] ],
		],
		scope: [ 'block' ],
	},
	{
		name: 'overlap-shape-4',
		title: __( 'Overlap Shape 4', i18n ),
		description: __( 'Overlap Shape 4 Layout', i18n ),
		attributes: { className: 'is-style-overlap-shape-4', alignVertical: true },
		innerBlocks: [
			[ 'stackable/column', {
				zIndex: 1,
				templateLock: 'insert',
				blockMargin: {
					bottom: -400,
				},
			}, [
				[ 'stackable/image', {
					imageShape: 'blob1',
				} ],
			] ],
			[ 'stackable/column', {
				hasContainer: true,
				containerWidth: 350,
				containerHorizontalAlign: 'center',
				zIndex: 2,
			}, [
				[ 'stackable/heading', { text: __( 'Feature' ) } ],
				[ 'stackable/text', { text: __( 'Description for this block. Use this space for describing your block.' ) } ],
				[ 'stackable/button-group', {}, [
					[ 'stackable/button', { text: __( 'Button' ) } ],
				] ],
			] ],
		],
		scope: [ 'block' ],
	},
]

export default variations
