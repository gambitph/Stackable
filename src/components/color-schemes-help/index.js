import { i18n } from 'stackable'

import { __ } from '@wordpress/i18n'
import { Button } from '@wordpress/components'
import { dispatch } from '@wordpress/data'

export const ColorSchemesHelp = () => {
	const onClick = () => {
		// Open the global settings sidebar and the color schemes panel.
		dispatch( 'core/edit-post' ).openGeneralSidebar( 'stackable-global-settings/sidebar' )
		dispatch( 'stackable/global-color-schemes' ).setIsOpen( true )
	}

	return <p>
		{ __( 'Change the color scheme.', i18n ) }
		<Button variant="link" onClick={ onClick }> { __( ' Manage', i18n ) } </Button>
		{ __( ' your color schemes.', i18n ) }
	</p>
}

