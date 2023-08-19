/**
 * Internal dependencies
 */
import './global-settings'
import './theme-block-size'
import './design-library-button'
import './layout-picker-reset'
// import './v2-migration-popup' // Probably 1.5yrs of checking for backward compatibility is enough.
import './navigation-view'
import './save-block'
import './editor-device-preview-class'
import { BlockLinking } from './block-linking'
import { BlockHoverState } from './block-hover-state'
import { ContentAlign } from './content-align'
import { EditorDom } from './get-editor-dom'

/**
 * WordPress dependencies
 */
import { registerPlugin } from '@wordpress/plugins'

/**
 * External dependencies
 */
import { ConvertToContainerButton, GetBlockAttributesButton } from '~stackable/components'
import { devMode } from 'stackable'
import { fetchSettings } from '~stackable/util'

registerPlugin( 'stackable-convert-to-container-button', { render: ConvertToContainerButton } )
registerPlugin( 'stackable-block-hover-state', { render: BlockHoverState } )
registerPlugin( 'stackable-content-align', { render: ContentAlign } )
registerPlugin( 'stackable-editor-dom', { render: EditorDom } )

if ( devMode ) {
	registerPlugin( 'stackable-block-attributes-get-button', { render: GetBlockAttributesButton } )
}

fetchSettings().then( response => {
	if ( response.stackable_enable_block_linking ) {
		registerPlugin( 'stackable-block-linking', { render: BlockLinking } )
	}
} )
