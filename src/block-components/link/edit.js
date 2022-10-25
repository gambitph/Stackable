/**
 * External dependencies
 */
import { i18n } from 'stackable'
import { InspectorStyleControls, PanelAdvancedSettings } from '~stackable/components'
import { useAttributeEditHandlers } from '~stackable/hooks'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'

/**
 * Internal dependencies
 */
import { LinkControls } from '../helpers/link'

export const Edit = props => {
	const {
		getAttribute, updateAttributeHandler,
	} = useAttributeEditHandlers( 'link%s' )

	return (
		<InspectorStyleControls>
			<PanelAdvancedSettings
				title={ __( 'Link', i18n ) }
				id="link"
				hasToggle={ props.hasToggle }
				checked={ props.hasToggle ? getAttribute( 'hasLink' ) : undefined }
				onChange={ props.hasToggle ? updateAttributeHandler( 'hasLink' ) : undefined }
			>
				<LinkControls attrNameTemplate="link%s" />
			</PanelAdvancedSettings>
		</InspectorStyleControls>
	)
}

Edit.defaultProps = {
	hasToggle: false,
}
