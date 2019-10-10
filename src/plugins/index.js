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
import { ConvertToContainerButton } from '~stackable/components'

registerPlugin( 'stackable-convert-to-container-button', { render: ConvertToContainerButton } )
registerPlugin( 'stackable-block-tester', {
	icon: 'clipboard',
	render: DebugSidebar,
} )
