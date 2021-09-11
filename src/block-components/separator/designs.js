/**
 * External dependencies
 */
import { i18n } from 'stackable'

/**
 * Internal dependencies
 */
import ImageDesignCurve1 from './images/curve-1.png'
import ImageDesignCurve2 from './images/curve-2.png'
import ImageDesignCurve3 from './images/curve-3.png'
import ImageDesignRounded1 from './images/rounded-1.png'
import ImageDesignRounded2 from './images/rounded-2.png'
import ImageDesignRounded3 from './images/rounded-3.png'
import ImageDesignSlant1 from './images/slant-1.png'
import ImageDesignSlant2 from './images/slant-2.png'
import ImageDesignStraight1 from './images/straight-1.png'
import ImageDesignWave1 from './images/wave-1.png'
import ImageDesignWave2 from './images/wave-2.png'
import ImageDesignWave3 from './images/wave-3.png'
import ImageDesignWave4 from './images/wave-4.png'

/**
 * WordPress dependencies
 */
import {
	__, _x, sprintf,
} from '@wordpress/i18n'

export const designs = [
	{
		image: ImageDesignWave1, label: sprintf( _x( '%s %d', 'Nth Title', i18n ), __( 'Wave', i18n ), 1 ), value: 'wave-1',
	},
	{
		image: ImageDesignStraight1, label: __( 'Straight', i18n ), value: 'straight-1',
	},
	{
		image: ImageDesignWave2, label: sprintf( _x( '%s %d', 'Nth Title', i18n ), __( 'Wave', i18n ), 2 ), value: 'wave-2',
	},
	{
		image: ImageDesignWave3, label: sprintf( _x( '%s %d', 'Nth Title', i18n ), __( 'Wave', i18n ), 3 ), value: 'wave-3',
	},
	{
		image: ImageDesignWave4, label: sprintf( _x( '%s %d', 'Nth Title', i18n ), __( 'Wave', i18n ), 4 ), value: 'wave-4',
	},
	{
		image: ImageDesignSlant1, label: sprintf( _x( '%s %d', 'Nth Title', i18n ), __( 'Slant', i18n ), 1 ), value: 'slant-1',
	},
	{
		image: ImageDesignSlant2, label: sprintf( _x( '%s %d', 'Nth Title', i18n ), __( 'Slant', i18n ), 2 ), value: 'slant-2',
	},
	{
		image: ImageDesignCurve1, label: sprintf( _x( '%s %d', 'Nth Title', i18n ), __( 'Curve', i18n ), 1 ), value: 'curve-1',
	},
	{
		image: ImageDesignCurve2, label: sprintf( _x( '%s %d', 'Nth Title', i18n ), __( 'Curve', i18n ), 2 ), value: 'curve-2',
	},
	{
		image: ImageDesignCurve3, label: sprintf( _x( '%s %d', 'Nth Title', i18n ), __( 'Curve', i18n ), 3 ), value: 'curve-3',
	},
	{
		image: ImageDesignRounded1, label: sprintf( _x( '%s %d', 'Nth Title', i18n ), __( 'Rounded', i18n ), 1 ), value: 'rounded-1',
	},
	{
		image: ImageDesignRounded2, label: sprintf( _x( '%s %d', 'Nth Title', i18n ), __( 'Rounded', i18n ), 2 ), value: 'rounded-2',
	},
	{
		image: ImageDesignRounded3, label: sprintf( _x( '%s %d', 'Nth Title', i18n ), __( 'Rounded', i18n ), 3 ), value: 'rounded-3',
	},
]

