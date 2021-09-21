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
		name: 'basic',
		title: __( 'Basic', i18n ),
		description: __( 'Basic Layout', i18n ),
		attributes: { className: 'is-style-basic' },
		isDefault: true,
		innerBlocks: [
			[ 'stackable/icon', {
				icon: '<svg data-prefix="fas" data-icon="exclamation-triangle" class="svg-inline--fa fa-exclamation-triangle fa-w-18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" aria-hidden="true" width="32" height="32"><path fill="currentColor" d="M569.517 440.013C587.975 472.007 564.806 512 527.94 512H48.054c-36.937 0-59.999-40.055-41.577-71.987L246.423 23.985c18.467-32.009 64.72-31.951 83.154 0l239.94 416.028zM288 354c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z"></path></svg>',
				iconColor1: '#FFFFFF',
			} ],
			[ 'stackable/heading', {
				text: __( 'Notification', i18n ), textTag: 'h3', textRemoveTextMargins: true,
			} ],
			[ 'stackable/text', { text: 'Description for this block. Use this space for describing your block.' } ],
			[ 'stackable/button-group', {}, [
				[ 'stackable/button', {
					text: __( 'Button', i18n ),
					buttonBackgroundColor: 'transparent',
					buttonBorderType: 'solid',
					buttonBorderColor: '#FFFFFF',
					textColorClass: 'has-white-color',
					textColor1: '#FFFFFF',
					buttonBorderWidth: {
						top: 1,
						right: 1,
						bottom: 1,
						left: 1,
					},
				} ],
			] ],
		],
		scope: [ 'block' ],
	},
	{
		name: 'plain',
		title: __( 'Plain', i18n ),
		description: __( 'Plain Layout', i18n ),
		attributes: {
			className: 'is-style-plain',
			hasContainer: false,
			containerPadding: {
				top: 32,
				right: 32,
				bottom: 32,
				left: 32,
			},
			dismissibleColor: 'var(--stk-container-background-color, #40ba7b)',
		},
		innerBlocks: [
			[ 'stackable/icon', {
				icon: '<svg data-prefix="fas" data-icon="exclamation-triangle" class="svg-inline--fa fa-exclamation-triangle fa-w-18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" aria-hidden="true" width="32" height="32"><path fill="currentColor" d="M569.517 440.013C587.975 472.007 564.806 512 527.94 512H48.054c-36.937 0-59.999-40.055-41.577-71.987L246.423 23.985c18.467-32.009 64.72-31.951 83.154 0l239.94 416.028zM288 354c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z"></path></svg>',
				iconColor1: 'var(--stk-container-background-color, #40ba7b)',
			} ],
			[ 'stackable/heading', {
				text: __( 'Notification', i18n ),
				textTag: 'h3',
				textColor1: 'var(--stk-container-background-color, #40ba7b)',
				textRemoveTextMargins: true,
			} ],
			[ 'stackable/text', {
				text: 'Description for this block. Use this space for describing your block.',
				textColor1: 'var(--stk-container-background-color, #40ba7b)',
			} ],
			[ 'stackable/button-group', {}, [
				[ 'stackable/button', {
					text: __( 'Button', i18n ),
					buttonBackgroundColor: 'transparent',
					buttonBorderType: 'solid',
					buttonBorderColor: 'var(--stk-container-background-color, #40ba7b)',
					textColor1: 'var(--stk-container-background-color, #40ba7b)',
					buttonBorderWidth: {
						top: 1,
						right: 1,
						bottom: 1,
						left: 1,
					},
				} ],
			] ],
		],
		scope: [ 'block' ],
	},
	{
		name: 'bordered',
		title: __( 'Bordered', i18n ),
		description: __( 'Bordered Layout', i18n ),
		attributes: {
			className: 'is-style-bordered',
			containerBackgroundColor: '#FFFFFF',
			containerBorderType: 'solid',
			containerBorderColor: 'var(--stk-container-background-color, #40ba7b)',
			containerBorderWidth: {
				top: 0,
				right: 0,
				bottom: 0,
				left: 5,
			},
			dismissibleColor: '#000000',
		},
		innerBlocks: [
			[ 'stackable/icon', {
				icon: '<svg data-prefix="fas" data-icon="exclamation-triangle" class="svg-inline--fa fa-exclamation-triangle fa-w-18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" aria-hidden="true" width="32" height="32"><path fill="currentColor" d="M569.517 440.013C587.975 472.007 564.806 512 527.94 512H48.054c-36.937 0-59.999-40.055-41.577-71.987L246.423 23.985c18.467-32.009 64.72-31.951 83.154 0l239.94 416.028zM288 354c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z"></path></svg>',
				iconColor1: '#000000',
			} ],
			[ 'stackable/heading', {
				text: __( 'Notification', i18n ),
				textTag: 'h3',
				textColor1: '#000000',
				textColorClass: 'has-black-color',
				textRemoveTextMargins: true,
			} ],
			[ 'stackable/text', {
				text: 'Description for this block. Use this space for describing your block.',
				textColor1: '#000000',
				textColorClass: 'has-black-color',
			} ],
			[ 'stackable/button-group', {}, [
				[ 'stackable/button', {
					text: __( 'Button', i18n ),
					buttonBackgroundColor: 'transparent',
					buttonBorderType: 'solid',
					buttonBorderColor: '#000000',
					textColor1: '#000000',
					textColorClass: 'has-black-color',
					buttonBorderWidth: {
						top: 1,
						right: 1,
						bottom: 1,
						left: 1,
					},
				} ],
			] ],
		],
		scope: [ 'block' ],
	},
	{
		name: 'outlined',
		title: __( 'Outlined', i18n ),
		description: __( 'Outlined Layout', i18n ),
		attributes: {
			className: 'is-style-outlined',
			hasContainer: false,
			containerBackgroundColor: '#FFFFFF',
			containerBorderType: 'solid',
			containerBorderColor: 'var(--stk-container-background-color, #40ba7b)',
			containerPadding: {
				top: 32,
				right: 32,
				bottom: 32,
				left: 32,
			},
			dismissibleColor: 'var(--stk-container-background-color, #40ba7b)',
		},
		innerBlocks: [
			[ 'stackable/icon', {
				icon: '<svg data-prefix="fas" data-icon="exclamation-triangle" class="svg-inline--fa fa-exclamation-triangle fa-w-18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" aria-hidden="true" width="32" height="32"><path fill="currentColor" d="M569.517 440.013C587.975 472.007 564.806 512 527.94 512H48.054c-36.937 0-59.999-40.055-41.577-71.987L246.423 23.985c18.467-32.009 64.72-31.951 83.154 0l239.94 416.028zM288 354c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z"></path></svg>',
				iconColor1: '#000000',
			} ],
			[ 'stackable/heading', {
				text: __( 'Notification', i18n ),
				textTag: 'h3',
				textColor1: '#000000',
				textColorClass: 'has-black-color',
				textRemoveTextMargins: true,
			} ],
			[ 'stackable/text', {
				text: 'Description for this block. Use this space for describing your block.',
				textColor1: '#000000',
				textColorClass: 'has-black-color',
			} ],
			[ 'stackable/button-group', {}, [
				[ 'stackable/button', {
					text: __( 'Button', i18n ),
					buttonBackgroundColor: 'transparent',
					buttonBorderType: 'solid',
					buttonBorderColor: '#000000',
					textColor1: '#000000',
					textColorClass: 'has-black-color',
					buttonBorderWidth: {
						top: 1,
						right: 1,
						bottom: 1,
						left: 1,
					},
				} ],
			] ],
		],
		scope: [ 'block' ],
	},
	{
		name: 'large-icon',
		title: __( 'Large Icon', i18n ),
		description: __( 'Large Icon Layout', i18n ),
		attributes: { className: 'is-style-large-icon', overflow: 'hidden' },
		innerBlocks: [
			[ 'stackable/icon', {
				opacity: 0.2,
				position: 'absolute',
				positionNum: {
					top: -72,
					left: -72,
				},
				icon: '<svg data-prefix="fas" data-icon="exclamation-triangle" class="svg-inline--fa fa-exclamation-triangle fa-w-18" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M569.517 440.013C587.975 472.007 564.806 512 527.94 512H48.054c-36.937 0-59.999-40.055-41.577-71.987L246.423 23.985c18.467-32.009 64.72-31.951 83.154 0l239.94 416.028zM288 354c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z"></path></svg>',
				iconColor1: '#FFFFFF',
				iconRotation: 350,
				iconSize: 200,
			} ],
			[ 'stackable/heading', {
				text: __( 'Notification', i18n ), textTag: 'h3', textRemoveTextMargins: true,
			} ],
			[ 'stackable/text', { text: 'Description for this block. Use this space for describing your block.' } ],
			[ 'stackable/button-group', {}, [
				[ 'stackable/button', {
					text: __( 'Button', i18n ),
					buttonBackgroundColor: 'transparent',
					buttonBorderType: 'solid',
					buttonBorderColor: '#FFFFFF',
					textColorClass: 'has-white-color',
					textColor1: '#FFFFFF',
					buttonBorderWidth: {
						top: 1,
						right: 1,
						bottom: 1,
						left: 1,
					},
				} ],
			] ],
		],
		scope: [ 'block' ],
	},
]

export default variations
