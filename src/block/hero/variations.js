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
			[ 'stackable/heading', { text: __( 'Hero Section' ) } ],
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
			[ 'stackable/heading', { text: __( 'Hero Section' ) } ],
			[ 'stackable/text', { text: 'Description for this block. Use this space for describing your block.' } ],
			[ 'stackable/button-group', {}, [
				[ 'stackable/button', { text: 'Button' } ],
			] ],
		],
		scope: [ 'block' ],
	},
	{
		name: 'half-overlay',
		title: __( 'Half Overlay', i18n ),
		description: __( 'Half Overlay Layout', i18n ),
		attributes: {
			hasContainer: true,
			hasBackground: true,
			blockBackgroundColor: '#000000',
			blockBorderRadius: 25,
			containerBackgroundColor: '#5e5e8f',
			containerWidth: 400,
			blockPadding: {
				top: 0,
				right: 0,
				bottom: 0,
				left: 0,
			},
		},
		innerBlocks: [
			[ 'stackable/heading', {
				text: __( 'Hero Section' ),
				textColorClass: 'has-white-color',
				textColor1: '#FFFFFF',
			} ],
			[ 'stackable/text', {
				text: 'Description for this block. Use this space for describing your block.',
				textColorClass: 'has-white-color',
				textColor1: '#FFFFFF',
			} ],
			[ 'stackable/button-group', {}, [
				[ 'stackable/button', { text: 'Button' } ],
			] ],
		],
		scope: [ 'block' ],
	},
	{
		name: 'center-overlay',
		title: __( 'Center Overlay', i18n ),
		description: __( 'Center Overlay Layout', i18n ),
		attributes: {
			hasBackground: true,
			blockBackgroundColor: '#000000',
			containerBackgroundColor: '#5e5e8f',
			blockPadding: {
				top: 64,
				right: 64,
				bottom: 64,
				left: 64,
			},
		},
		innerBlocks: [
			[ 'stackable/heading', {
				text: __( 'Hero Section' ),
				textColorClass: 'has-white-color',
				textColor1: '#FFFFFF',
			} ],
			[ 'stackable/text', {
				text: 'Description for this block. Use this space for describing your block.',
				textColorClass: 'has-white-color',
				textColor1: '#FFFFFF',
			} ],
			[ 'stackable/button-group', {}, [
				[ 'stackable/button', { text: 'Button' } ],
			] ],
		],
		scope: [ 'block' ],
	},
	{
		name: 'side-overlay',
		title: __( 'Side Overlay', i18n ),
		description: __( 'Side Overlay Layout', i18n ),
		attributes: {
			hasBackground: true,
			blockBackgroundColor: '#000000',
			blockPadding: {
				top: 64,
				right: 64,
				bottom: 64,
				left: 64,
			},
			containerBackgroundColor: '#5e5e8f',
			containerWidth: 400,
		},
		innerBlocks: [
			[ 'stackable/heading', {
				text: __( 'Hero Section' ),
				textColorClass: 'has-white-color',
				textColor1: '#FFFFFF',
			} ],
			[ 'stackable/text', {
				text: 'Description for this block. Use this space for describing your block.',
				textColorClass: 'has-white-color',
				textColor1: '#FFFFFF',
			} ],
			[ 'stackable/button-group', {}, [
				[ 'stackable/button', { text: 'Button' } ],
			] ],
		],
		scope: [ 'block' ],
	},
	{
		name: 'half',
		title: __( 'Half', i18n ),
		description: __( 'Half Layout', i18n ),
		attributes: {
			hasBackground: true,
			blockBackgroundColor: '#000000',
			blockPadding: {
				top: 64,
				right: 64,
				bottom: 64,
				left: 64,
			},
			hasContainer: false,
			containerBackgroundColor: '#5e5e8f',
			containerWidth: 400,
		},
		innerBlocks: [
			[ 'stackable/heading', {
				text: __( 'Hero Section' ),
				textColorClass: 'has-white-color',
				textColor1: '#FFFFFF',
			} ],
			[ 'stackable/text', {
				text: 'Description for this block. Use this space for describing your block.',
				textColorClass: 'has-white-color',
				textColor1: '#FFFFFF',
			} ],
			[ 'stackable/button-group', {}, [
				[ 'stackable/button', { text: 'Button' } ],
			] ],
		],
		scope: [ 'block' ],
	},
]

export default variations
