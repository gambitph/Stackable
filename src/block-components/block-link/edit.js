/**
 * External dependencies
 */
import { i18n } from 'stackable'
import {
	InspectorBlockControls,
	PanelAdvancedSettings,
} from '~stackable/components'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { LinkControls } from '../helpers/link'

export const Edit = ( { hasLink } ) => {
	return (
		<>
			<InspectorBlockControls>
				<PanelAdvancedSettings
					title={ __( 'Link', i18n ) }
					id="link"
				>
					<LinkControls attrNameTemplate="blockLink%s" hasLink={ hasLink } />
				</PanelAdvancedSettings>
			</InspectorBlockControls>
		</>
	)
}

Edit.defaultProps = {
	hasLink: true,
}
