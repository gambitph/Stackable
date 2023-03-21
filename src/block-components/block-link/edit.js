/**
 * External dependencies
 */
import { i18n } from 'stackable'
import {
	InspectorAdvancedControls,
	PanelAdvancedSettings,
} from '~stackable/components'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { LinkControls } from '../helpers/link'

export const Edit = ( { hasLink, hasTitle } ) => {
	return (
		<>
			<InspectorAdvancedControls>
				<PanelAdvancedSettings
					title={ __( 'Link', i18n ) }
					id="link"
				>
					<LinkControls attrNameTemplate="blockLink%s" hasLink={ hasLink } hasTitle={ hasTitle } />
				</PanelAdvancedSettings>
			</InspectorAdvancedControls>
		</>
	)
}

Edit.defaultProps = {
	hasLink: true,
	hasTitle: true,
}
