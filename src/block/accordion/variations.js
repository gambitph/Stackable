/**
 * WorddPress dependencies
 */
import { __ } from '@wordpress/i18n'

/**
 * External dependencies
 */
import { i18n } from 'stackable'

const defaultIcon = '<svg data-prefix="fas" data-icon="chevron-down" class="svg-inline--fa fa-chevron-down fa-w-14" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" aria-hidden="true"><path fill="currentColor" d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z"></path></svg>'

/**
 * Template option choices for predefined columns layouts.
 *
 * @type {WPBlockVariation[]}
 */
const variations = [
	{
		name: 'default',
		title: __( 'Default', i18n ),
		description: __( 'Default Layout' ),
		innerBlocks: [
			[ 'stackable/column', {
				templateLock: 'insert', hasContainer: true, htmlTag: 'summary',
				className: 'stk--container-small stk-block-accordion__heading',
			}, [
				[ 'stackable/icon-label', {}, [
					[ 'stackable/heading', {
						text: __( 'Accordion Title' ), hasP: true, textTag: 'h4',
					} ],
					[ 'stackable/icon', {
						icon: defaultIcon,
					} ],
				] ],
			] ],
			[ 'stackable/column', { templateLock: false, className: 'stk-block-accordion__content' }, [
				[ 'stackable/text', {
					text: 'Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block.',
				} ],
			] ],
		],
		scope: [ 'block' ],
	},
	{
		name: 'plain',
		title: __( 'Plain', i18n ),
		description: __( 'Plain Layout' ),
		attributes: {
			blockBorderType: 'solid',
			blockBorderColor: 'var(--stk-accordion-border-color)',
			blockBorderWidth: {
				top: 0,
				right: 0,
				bottom: 1,
				left: 0,
			},
		},
		innerBlocks: [
			[ 'stackable/column', {
				templateLock: 'insert', htmlTag: 'summary',
				className: 'stk--container-small stk-block-accordion__heading',
			}, [
				[ 'stackable/icon-label', {}, [
					[ 'stackable/heading', {
						text: __( 'Accordion Title' ), hasP: true, textTag: 'h4',
					} ],
					[ 'stackable/icon', {
						icon: defaultIcon,
					} ],
				] ],
			] ],
			[ 'stackable/column', { templateLock: false, className: 'stk-block-accordion__content' }, [
				[ 'stackable/text', {
					text: 'Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block.',
				} ],
			] ],
		],
		scope: [ 'block' ],
	},
	{
		name: 'colored',
		title: __( 'Colored', i18n ),
		description: __( 'Colored Layout' ),
		attributes: {
			hasBackground: true,
			blockMargin: {
				top: '',
				right: '',
				bottom: '',
				left: '',
			},
			blockPadding: {
				top: 0,
				right: 0,
				bottom: 0,
				left: 0,
			},
		},
		innerBlocks: [
			[ 'stackable/column', {
				templateLock: 'insert', htmlTag: 'summary',
				className: 'stk--container-small stk-block-accordion__heading',
			}, [
				[ 'stackable/icon-label', {}, [
					[ 'stackable/heading', {
						text: __( 'Accordion Title' ), hasP: true, textTag: 'h4',
					} ],
					[ 'stackable/icon', {
						icon: defaultIcon,
					} ],
				] ],
			] ],
			[ 'stackable/column', { templateLock: false, className: 'stk-block-accordion__content' }, [
				[ 'stackable/text', {
					text: 'Description for this block. Use this space for describing your block. Any text will do. Description for this block. You can use this space for describing your block.',
				} ],
			] ],
		],
		scope: [ 'block' ],
	},
]

export default variations
