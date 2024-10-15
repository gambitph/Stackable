/**
 * Internal dependencies
 */
import './store'
import './variation-picker'
import './custom-block-styles-editor'
import SaveMenu from './save-menu'
import { useSavedDefaultBlockStyle } from '~stackable/hooks'
import { settings } from 'stackable'

/**
 * WordPress dependencies
 */
import { withSelect } from '@wordpress/data'
import { registerPlugin } from '@wordpress/plugins'
import { addFilter } from '@wordpress/hooks'
import { createHigherOrderComponent } from '@wordpress/compose'

/**
 * Add the save block style menu to the more options menu of all Stackable
 * blocks.
 */
const _SaveMenu = withSelect( select => {
	return {
		clientId: select( 'core/block-editor' ).getSelectedBlockClientId(),
	}
} )( SaveMenu )

if ( settings.stackable_enable_save_as_default_block ) {
	registerPlugin( 'stackable-save-block-menu', { render: _SaveMenu } )
}

/**
 * Add the block style loader to each Stackable block.
 */
const withSaveBlockStyle = createHigherOrderComponent( BlockEdit => {
	return props => {
		useSavedDefaultBlockStyle( props )
		return <BlockEdit { ...props } />
	}
}, 'withSaveBlockStyle' )

addFilter(
	'editor.BlockEdit',
	'stackable/save-block-style',
	withSaveBlockStyle
)
