/**
 * Internal dependencies
 */
import './global-settings'
import './premium-notice'
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
import { ThemeBlockSize } from './theme-block-size'

/**
 * WordPress dependencies
 */
import { registerPlugin } from '@wordpress/plugins'
import { loadPromise, models } from '@wordpress/api'

/**
 * External dependencies
 */
import { ConvertToContainerButton, GetBlockAttributesButton } from '~stackable/components'
import { devMode } from 'stackable'

registerPlugin( 'stackable-convert-to-container-button', { render: ConvertToContainerButton } )
registerPlugin( 'stackable-block-hover-state', { render: BlockHoverState } )
registerPlugin( 'stackable-content-align', { render: ContentAlign } )
registerPlugin( 'stackable-editor-dom', { render: EditorDom } )
registerPlugin( 'stackable-theme-block-size', { render: ThemeBlockSize } )

if ( devMode ) {
	registerPlugin( 'stackable-block-attributes-get-button', { render: GetBlockAttributesButton } )
}

loadPromise.then( () => {
	const settings = new models.Settings()
	settings.fetch().then( response => {
		if ( response.stackable_enable_block_linking ) {
			registerPlugin( 'stackable-block-linking', { render: BlockLinking } )
		}
	} )
} )
