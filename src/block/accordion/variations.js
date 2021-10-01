/**
 * Internal dependencies
 */
import ImageDefault from './images/default.svg'
import ImagePlain from './images/plain.svg'
import ImageShadow from './images/shadow.svg'
import ImageColored from './images/colored.svg'
import ImagePlus from './images/plus.svg'

/**
 * WorddPress dependencies
 */
import {
	__, _x, sprintf,
} from '@wordpress/i18n'

/**
 * External dependencies
 */
import { i18n, isPro } from 'stackable'
import { applyFilters } from '@wordpress/hooks'

const defaultIcon = '<svg data-prefix="fas" data-icon="chevron-down" class="svg-inline--fa fa-chevron-down fa-w-14" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" aria-hidden="true"><path fill="currentColor" d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z"></path></svg>'

/**
 * Template option choices for predefined columns layouts.
 *
 * @type {WPBlockVariation[]}
 */
const variations = applyFilters(
	'stackable.accordion.variations',
	[
		{
			name: 'default',
			title: __( 'Default', i18n ),
			icon: ImageDefault,
			isDefault: true,
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Default', i18n ) ),
			innerBlocks: [
				[ 'stackable/column', {
					templateLock: 'insert', hasContainer: true, htmlTag: 'summary',
					className: 'stk--container-small stk-block-accordion__heading',
				}, [
					[ 'stackable/icon-label', {}, [
						[ 'stackable/heading', {
							text: _x( 'Title for This Block', 'Heading placeholder', i18n ), hasP: true, textTag: 'h4',
						} ],
						[ 'stackable/icon', {
							icon: defaultIcon,
							linkHasLink: false,
						} ],
					] ],
				] ],
				[ 'stackable/column', { templateLock: false, className: 'stk-block-accordion__content' }, [
					[ 'stackable/text', {
						text: _x( 'Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block.', 'Content placeholder', i18n ),
					} ],
				] ],
			],
			scope: [ 'block' ],
		},
		{
			name: 'plain',
			title: __( 'Plain', i18n ),
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Plain', i18n ) ),
			icon: ImagePlain,
			attributes: {
				blockBorderType: 'solid',
				blockBorderColor: '#dfdad1',
				blockBorderWidth: {
					top: 0, right: 0, bottom: 1, left: 0,
				},
				blockPadding: {
					top: '', right: '', bottom: 24, left: '',
				},
			},
			innerBlocks: [
				[ 'stackable/column', {
					templateLock: 'insert', htmlTag: 'summary',
					className: 'stk--container-small stk-block-accordion__heading',
				}, [
					[ 'stackable/icon-label', {}, [
						[ 'stackable/heading', {
							text: _x( 'Title for This Block', 'Heading placeholder', i18n ), hasP: true, textTag: 'h4',
						} ],
						[ 'stackable/icon', {
							icon: defaultIcon,
							linkHasLink: false,
						} ],
					] ],
				] ],
				[ 'stackable/column', {
					templateLock: false,
					className: 'stk-block-accordion__content',
					containerPadding: {
						top: 0, right: 0, bottom: 0, left: 0,
					},
				}, [
					[ 'stackable/text', {
						text: _x( 'Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block.', 'Content placeholder', i18n ),
					} ],
				] ],
			],
			scope: [ 'block' ],
		},
		{
			name: 'shadow',
			title: __( 'Shadow', i18n ),
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Shadow', i18n ) ),
			icon: ImageShadow,
			isPremium: ! isPro,
			scope: [ 'block' ],
		},
		{
			name: 'colored',
			title: __( 'Colored', i18n ),
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Colored', i18n ) ),
			icon: ImageColored,
			isPremium: ! isPro,
			scope: [ 'block' ],
		},
		{
			name: 'plus',
			title: __( 'Plus', i18n ),
			description: sprintf( _x( '%s Layout', 'Block layout name', i18n ), __( 'Plus', i18n ) ),
			icon: ImagePlus,
			isPremium: ! isPro,
			scope: [ 'block' ],
		},
	]
)

export default variations
