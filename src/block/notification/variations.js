/**
 * External dependencies
 */
import { i18n, isPro } from 'stackable'
import { substituteCoreIfDisabled, removeChildIfDisabled } from '~stackable/util'

/**
 * WordPress dependencies
 */
import {
	__, sprintf, _x,
} from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'

/**
 * Internal dependencies
 */
import ImageDefault from './images/default.svg'
import ImagePlain from './images/plain.svg'
import ImageSide from './images/side.svg'
import ImageBordered from './images/bordered.svg'
import ImageOutlined from './images/outlined.svg'
import ImageLargeIcon from './images/large-icon.svg'

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
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Default', i18n ) ),
			attributes: { className: 'is-style-default', hasContainer: true },
			isDefault: true,
			pickerTitle: __( 'Default', i18n ),
			pickerIcon: ImageDefault,
			isActive: [ 'className' ],
			innerBlocks: removeChildIfDisabled( 'stackable/icon', [
				[ 'stackable/icon', {
					icon: '<svg data-prefix="fas" data-icon="exclamation-triangle" class="svg-inline--fa fa-exclamation-triangle fa-w-18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" aria-hidden="true" width="32" height="32"><path fill="currentColor" d="M569.517 440.013C587.975 472.007 564.806 512 527.94 512H48.054c-36.937 0-59.999-40.055-41.577-71.987L246.423 23.985c18.467-32.009 64.72-31.951 83.154 0l239.94 416.028zM288 354c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z"></path></svg>',
					iconColor1: '#FFFFFF',
				} ],
				substituteCoreIfDisabled( 'stackable/heading', {
					text: _x( 'Title for This Block', 'Heading placeholder', i18n ), textTag: 'h3',
				} ),
				substituteCoreIfDisabled( 'stackable/text', { text: _x( 'Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block.', 'Content placeholder', i18n ) } ),
				substituteCoreIfDisabled( 'stackable/button-group', {}, [
					substituteCoreIfDisabled( 'stackable/button', {
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
					} ),
				] ),
			] ),
			scope: [ 'block' ],
		},
		{
			name: 'plain',
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
			pickerTitle: __( 'Plain', i18n ),
			pickerIcon: ImagePlain,
			isActive: [ 'className' ],
			innerBlocks: removeChildIfDisabled( 'stackable/icon', [
				[ 'stackable/icon', {
					icon: '<svg data-prefix="fas" data-icon="exclamation-triangle" class="svg-inline--fa fa-exclamation-triangle fa-w-18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" aria-hidden="true" width="32" height="32"><path fill="currentColor" d="M569.517 440.013C587.975 472.007 564.806 512 527.94 512H48.054c-36.937 0-59.999-40.055-41.577-71.987L246.423 23.985c18.467-32.009 64.72-31.951 83.154 0l239.94 416.028zM288 354c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z"></path></svg>',
					iconColor1: 'var(--stk-container-background-color, #40ba7b)',
				} ],
				substituteCoreIfDisabled( 'stackable/heading', {
					text: _x( 'Title for This Block', 'Heading placeholder', i18n ), textTag: 'h3',
					textColor1: 'var(--stk-container-background-color, #40ba7b)',
				} ),
				substituteCoreIfDisabled( 'stackable/text', {
					text: _x( 'Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block.', 'Content placeholder', i18n ),
					textColor1: 'var(--stk-container-background-color, #40ba7b)',
				} ),
				substituteCoreIfDisabled( 'stackable/button-group', {}, [
					substituteCoreIfDisabled( 'stackable/button', {
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
					} ),
				] ),
			] ),
			scope: [ 'block' ],
		},
		{
			name: 'side',
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Side', i18n ) ),
			attributes: {
				className: 'is-style-side',
			},
			pickerTitle: __( 'Side', i18n ),
			pickerIcon: ImageSide,
			isActive: [ 'className' ],
			isPremium: ! isPro,
			scope: [ 'block' ],
		},
		{
			name: 'bordered',
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Bordered', i18n ) ),
			attributes: {
				className: 'is-style-bordered',
			},
			pickerTitle: __( 'Bordered', i18n ),
			pickerIcon: ImageBordered,
			isActive: [ 'className' ],
			isPremium: ! isPro,
			scope: [ 'block' ],
		},
		{
			name: 'outlined',
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Outlined', i18n ) ),
			attributes: {
				className: 'is-style-outlined',
			},
			pickerTitle: __( 'Outlined', i18n ),
			pickerIcon: ImageOutlined,
			isActive: [ 'className' ],
			isPremium: ! isPro,
			scope: [ 'block' ],
		},
		{
			name: 'large-icon',
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Large Icon', i18n ) ),
			attributes: {
				className: 'is-style-large-icon',
			},
			pickerTitle: __( 'Large Icon', i18n ),
			pickerIcon: ImageLargeIcon,
			isActive: [ 'className' ],
			isPremium: ! isPro,
			scope: [ 'block' ],
		},
	]
)

export default variations
