/**
 * External dependencies
 */
import { i18n } from 'stackable'
import { InspectorStyleControls, PanelAdvancedSettings } from '~stackable/components'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'

/**
 * Internal dependencies
 */
import { LinkControls } from '../helpers/link'

export const Edit = () => {
	return (
		<InspectorStyleControls>
			<PanelAdvancedSettings
				title={ __( 'Link', i18n ) }
				id="link"
			>
				<LinkControls attrNameTemplate="link%s" />
			</PanelAdvancedSettings>
		</InspectorStyleControls>
	)
}
