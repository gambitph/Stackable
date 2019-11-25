/**
 * Internal dependencies
 */
import { default as DebugSidebar } from './debug-sidebar'

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
	registerPlugin( 'stackable-block-tester', {
		icon: 'clipboard',
		render: DebugSidebar,
	} )
	registerPlugin( 'stackable-block-attributes-get-button', { render: GetBlockAttributesButton } )
}
