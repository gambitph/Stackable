/**
 * Internal dependencies
 */
import './global-settings'
import './premium-notice'
import './design-library-button'
import { BlockLinking } from './block-linking'
import { BlockHoverState } from './block-hover-state'

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
