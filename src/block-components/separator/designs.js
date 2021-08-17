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

import SVGCurve1 from './images/curve-1.svg'
import SVGCurve1Inverted from './images/curve-1-inverted.svg'
import SVGCurve2 from './images/curve-2.svg'
import SVGCurve2Inverted from './images/curve-2-inverted.svg'
import SVGCurve3 from './images/curve-3.svg'
import SVGCurve3Inverted from './images/curve-3-inverted.svg'
import SVGRounded1 from './images/rounded-1.svg'
import SVGRounded1Inverted from './images/rounded-1-inverted.svg'
import SVGRounded2 from './images/rounded-2.svg'
import SVGRounded2Inverted from './images/rounded-2-inverted.svg'
import SVGRounded3 from './images/rounded-3.svg'
import SVGRounded3Inverted from './images/rounded-3-inverted.svg'
import SVGSlant1 from './images/slant-1.svg'
import SVGSlant1Inverted from './images/slant-1-inverted.svg'
import SVGSlant2 from './images/slant-2.svg'
import SVGSlant2Inverted from './images/slant-2-inverted.svg'
import SVGStraight1 from './images/straight-1.svg'
import SVGWave1 from './images/wave-1.svg'
import SVGWave1Inverted from './images/wave-1-inverted.svg'
import SVGWave2 from './images/wave-2.svg'
import SVGWave2Inverted from './images/wave-2-inverted.svg'
import SVGWave3 from './images/wave-3.svg'
import SVGWave3Inverted from './images/wave-3-inverted.svg'
import SVGWave4 from './images/wave-4.svg'
import SVGWave4Inverted from './images/wave-4-inverted.svg'

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

export const separators = {
	'wave-1': {
		default: {
			shape: SVGWave1,
		},
		inverted: {
			shape: SVGWave1Inverted,
		},
	},
	'wave-2': {
		default: {
			shape: SVGWave2,
		},
		inverted: {
			shape: SVGWave2Inverted,
		},
	},
	'wave-3': {
		default: {
			shape: SVGWave3,
		},
		inverted: {
			shape: SVGWave3Inverted,
		},
	},
	'wave-4': {
		default: {
			shape: SVGWave4,
		},
		inverted: {
			shape: SVGWave4Inverted,
		},
	},
	'curve-1': {
		default: {
			shape: SVGCurve1,
		},
		inverted: {
			shape: SVGCurve1Inverted,
		},
	},
	'curve-2': {
		default: {
			shape: SVGCurve2,
		},
		inverted: {
			shape: SVGCurve2Inverted,
		},
	},
	'curve-3': {
		default: {
			shape: SVGCurve3,
		},
		inverted: {
			shape: SVGCurve3Inverted,
		},
	},
	'slant-1': {
		default: {
			shape: SVGSlant1,
		},
		inverted: {
			shape: SVGSlant1Inverted,
		},
	},
	'slant-2': {
		default: {
			shape: SVGSlant2,
		},
		inverted: {
			shape: SVGSlant2Inverted,
		},
	},
	'straight-1': {
		default: {
			shape: SVGStraight1,
		},
		inverted: {
			shape: SVGStraight1,
		},
	},
	'rounded-1': {
		default: {
			shape: SVGRounded1,
		},
		inverted: {
			shape: SVGRounded1Inverted,
		},
	},
	'rounded-2': {
		default: {
			shape: SVGRounded2,
		},
		inverted: {
			shape: SVGRounded2Inverted,
		},
	},
	'rounded-3': {
		default: {
			shape: SVGRounded3,
		},
		inverted: {
			shape: SVGRounded3Inverted,
		},
	},
}
