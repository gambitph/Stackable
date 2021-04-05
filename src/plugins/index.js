/**
 * Internal dependencies
 */
import './global-settings'
import './premium-notice'

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

if ( devMode ) {
	registerPlugin( 'stackable-block-attributes-get-button', { render: GetBlockAttributesButton } )
}
