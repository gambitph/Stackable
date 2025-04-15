import { i18n } from 'stackable'
import { Link } from '~stackable/components'

import { __ } from '@wordpress/i18n'
import { dispatch } from '@wordpress/data'

export const ColorSchemesHelp = () => {
	const onClick = () => {
		// Open the global settings sidebar.
		dispatch( 'core/edit-post' )?.openGeneralSidebar( 'stackable-global-settings/sidebar' ) // For Block Editor
		dispatch( 'core/edit-site' )?.openGeneralSidebar( 'stackable-global-settings/sidebar' ) // For Site Editor

		// Add a small delay to ensure DOM elements are fully rendered and accessible after the sidebar opens
		setTimeout( () => {
			// Closes all panels except the color scheme panel
			const panels = document.querySelectorAll( '.ugb-global-settings__inspector > .ugb-toggle-panel-body.is-opened' )
			panels?.forEach( panel => {
				if ( panel.classList.contains( 'ugb-global-color-schemes__panel' ) ) {
					return
				}
				const toggle = panel.querySelector( '.components-panel__body-title > .components-panel__body-toggle' )
				toggle?.click()
			} )

			const colorSchemeToggle = document.querySelector( '.ugb-global-color-schemes__panel .components-panel__body-title > .components-panel__body-toggle' )
			// Opens the color scheme panel
			if ( colorSchemeToggle.getAttribute( 'aria-expanded' ) === 'false' ) {
				colorSchemeToggle?.click()
			}
		}, 10 )
	}

	return <>
		<span>{ __( 'Change the color scheme.', i18n ) }</span>
		&nbsp;
		<Link onClick={ onClick }> { __( 'Manage your color schemes.', i18n ) } </Link>
	</>
}

