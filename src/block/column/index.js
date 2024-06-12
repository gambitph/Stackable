/**
 * BLOCK: Card Block.
 */

/**
 * External dependencies
 */
import { ColumnIcon } from '~stackable/icons'
import { i18n } from 'stackable'

/**
 * Internal dependencies
 */
import edit from './edit'
import save from './save'
import schema from './schema'
import deprecated from './deprecated'
import metadata from './block.json'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { select } from '@wordpress/data'

export const settings = {
	...metadata,
	icon: ColumnIcon,
	attributes: schema,
	supports: {
		anchor: true,
		reusable: false,
		stkBlockLinking: true,
		stkSaveBlockStyle: false,
		stkDefaultTab: 'layout',
		spacing: true,
	},
	//  styles: blockStyles,

	deprecated,
	edit,
	save,

	__experimentalLabel: ( attributes, { context } ) => {
		const customName = attributes?.metadata?.name
		if ( context === 'list-view' && customName ) {
			return customName
		}

		if ( context === 'list-view' && attributes?.uniqueId ) {
			const { getEditorDom } = select( 'stackable/editor-dom' )
			const editorDom = getEditorDom()
			const isCarouselSlide = editorDom?.querySelector( `.stk-block-carousel__slider > * > * > * > * > [data-block-id="${ attributes.uniqueId }"]` )
			if ( isCarouselSlide ) {
				return __( 'Slide', i18n )
			}
			const isHorizontalScroller = editorDom?.querySelector( `.stk-block-horizontal-scroller > * > * > * > * > * > [data-block-id="${ attributes.uniqueId }"]` )
			if ( isHorizontalScroller ) {
				return __( 'Slide', i18n )
			}
		}

		return ''
	},
}
