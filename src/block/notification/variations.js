/**
 * External dependencies
 */
import { i18n, isPro } from 'stackable'

/**
 * WordPress dependencies
 */
import {
	__, sprintf, _x,
} from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'

/**
 * Template option choices for predefined columns layouts.
 *
 * @type {WPBlockVariation[]}
 */
const variations = applyFilters(
	'stackable.notification.variations',
	[
		{
			name: 'default',
			title: __( 'Default', i18n ),
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Default', i18n ) ),
			attributes: { className: 'is-style-default' },
			isDefault: true,
			innerBlocks: [
				[ 'stackable/icon', {
					icon: '<svg data-prefix="fas" data-icon="exclamation-triangle" class="svg-inline--fa fa-exclamation-triangle fa-w-18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" aria-hidden="true" width="32" height="32"><path fill="currentColor" d="M569.517 440.013C587.975 472.007 564.806 512 527.94 512H48.054c-36.937 0-59.999-40.055-41.577-71.987L246.423 23.985c18.467-32.009 64.72-31.951 83.154 0l239.94 416.028zM288 354c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z"></path></svg>',
					iconColor1: '#FFFFFF',
				} ],
				[ 'stackable/heading', {
					text: _x( 'Title for This Block', 'Heading placeholder', i18n ), textTag: 'h3', textRemoveTextMargins: true,
				} ],
				[ 'stackable/text', { text: _x( 'Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block.', 'Content placeholder', i18n ) } ],
				[ 'stackable/button-group', {}, [
					[ 'stackable/button', {
						text: _x( 'Button', 'Button placeholder', i18n ),
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
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Plain', i18n ) ),
			attributes: {
				className: 'is-style-plain',
				blockShadow: '0px 2px 20px rgba(153, 153, 153, 0.2)',
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
					text: _x( 'Title for This Block', 'Heading placeholder', i18n ), textTag: 'h3', textRemoveTextMargins: true,
					textColor1: 'var(--stk-container-background-color, #40ba7b)',
				} ],
				[ 'stackable/text', {
					text: _x( 'Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block.', 'Content placeholder', i18n ),
					textColor1: 'var(--stk-container-background-color, #40ba7b)',
				} ],
				[ 'stackable/button-group', {}, [
					[ 'stackable/button', {
						text: _x( 'Button', 'Button placeholder', i18n ),
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
			name: 'horizontal',
			title: __( 'Horizontal', i18n ),
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Horizontal', i18n ) ),
			isPremium: ! isPro,
			scope: [ 'block' ],
		},
		{
			name: 'bordered',
			title: __( 'Bordered', i18n ),
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Bordered', i18n ) ),
			isPremium: ! isPro,
			scope: [ 'block' ],
		},
		{
			name: 'outlined',
			title: __( 'Outlined', i18n ),
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Outlined', i18n ) ),
			isPremium: ! isPro,
			scope: [ 'block' ],
		},
		{
			name: 'large-icon',
			title: __( 'Large Icon', i18n ),
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Large Icon', i18n ) ),
			isPremium: ! isPro,
			scope: [ 'block' ],
		},
	]
)

export default variations
