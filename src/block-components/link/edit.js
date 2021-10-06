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

export const Edit = () => {
	const {
		getAttribute, updateAttributeHandler,
	} = useAttributeEditHandlers( 'link%s' )

	return (
		<InspectorStyleControls>
			<PanelAdvancedSettings
				title={ __( 'Link', i18n ) }
				id="link"
				checked={ getAttribute( 'hasLink' ) }
				onChange={ updateAttributeHandler( 'hasLink' ) }
			>
				<LinkControls attrNameTemplate="link%s" />
			</PanelAdvancedSettings>
		</InspectorStyleControls>
	)
}
