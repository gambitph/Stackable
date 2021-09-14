/**
 * Internal dependencies
 */
import './global-settings'
import './premium-notice'
import { BlockLinking } from './block-linking'
import { BlockHoverState } from './block-hover-state'

/**
 * WordPress dependencies
 */
import { registerPlugin } from '@wordpress/plugins'

/**
 * External dependencies
 */
import { ConvertToContainerButton, GetBlockAttributesButton } from '~stackable/components'
import { devMode } from 'stackable'

registerPlugin( 'stackable-convert-to-container-button', { render: ConvertToContainerButton } )
registerPlugin( 'stackable-block-linking', { render: BlockLinking } )
registerPlugin( 'stackable-block-hover-state', { render: BlockHoverState } )

if ( devMode ) {
	registerPlugin( 'stackable-block-attributes-get-button', { render: GetBlockAttributesButton } )
}
