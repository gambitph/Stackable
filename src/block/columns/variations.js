/**
 * Internal dependencies
 */
import ImageStyleOneColumn from './images/one-column-full.svg'
import ImageStyleTwoColumns from './images/two-columns-equal.svg'
import ImageStyleTwoColumns2 from './images/two-columns-one-third-two-thirds.svg'
import ImageStyleTwoColumns3 from './images/two-columns-two-thirds-one-third.svg'
import ImageStyleThreeColumns from './images/three-columns-equal.svg'
import ImageStyleThreeColumns2 from './images/three-columns-wider-center.svg'
import ImageStyleFourColumns from './images/four-columns-equal.svg'

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
		name: 'one-column-full',
		title: __( '100' ),
		description: __( 'One column' ),
		icon: ImageStyleOneColumn,
		innerBlocks: [ [ 'stackable/column' ] ],
		scope: [ 'block' ],
	},
	{
		name: 'two-columns-equal',
		title: __( '50 / 50' ),
		description: __( 'Two columns; equal split' ),
		icon: ImageStyleTwoColumns,
		isDefault: true,
		innerBlocks: [ [ 'stackable/column' ], [ 'stackable/column' ] ],
		scope: [ 'block' ],
	},
	{
		name: 'two-columns-one-third-two-thirds',
		title: __( '30 / 70' ),
		description: __( 'Two columns; one-third, two-thirds split' ),
		icon: ImageStyleTwoColumns2,
		innerBlocks: [
			[ 'stackable/column', { columnWidth: 33.3 } ],
			[ 'stackable/column', { columnWidth: 66.7 } ],
		],
		scope: [ 'block' ],
	},
	{
		name: 'two-columns-two-thirds-one-third',
		title: __( '70 / 30' ),
		description: __( 'Two columns; two-thirds, one-third split' ),
		icon: ImageStyleTwoColumns3,
		innerBlocks: [
			[ 'stackable/column', { columnWidth: 66.7 } ],
			[ 'stackable/column', { columnWidth: 33.3 } ],
		],
		scope: [ 'block' ],
	},
	{
		name: 'three-columns-equal',
		title: __( '33 / 33 / 33' ),
		description: __( 'Three columns; equal split' ),
		icon: ImageStyleThreeColumns,
		innerBlocks: [
			[ 'stackable/column' ],
			[ 'stackable/column' ],
			[ 'stackable/column' ],
		],
		scope: [ 'block' ],
	},
	{
		name: 'three-columns-wider-center',
		title: __( '25 / 50 / 25' ),
		description: __( 'Three columns; wide center column' ),
		icon: ImageStyleThreeColumns2,
		innerBlocks: [
			[ 'stackable/column', { columnWidth: 25 } ],
			[ 'stackable/column', { columnWidth: 50 } ],
			[ 'stackable/column', { columnWidth: 25 } ],
		],
		scope: [ 'block' ],
	},
	{
		name: 'four-columns-equal',
		title: __( '25 / 25 / 25 / 25' ),
		description: __( 'Four columns; equal split' ),
		icon: ImageStyleFourColumns,
		innerBlocks: [
			[ 'stackable/column', { columnWidth: 25 } ],
			[ 'stackable/column', { columnWidth: 25 } ],
			[ 'stackable/column', { columnWidth: 25 } ],
			[ 'stackable/column', { columnWidth: 25 } ],
		],
		scope: [ 'block' ],
	},
]

export default variations
