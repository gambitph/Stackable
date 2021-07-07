/**
 * Internal dependencies
 */

/**
 * External dependencies
 */
import { i18n } from 'stackable'
import {
	CustomAttributesControl,
	InspectorAdvancedControls,
	PanelAdvancedSettings,
} from '~stackable/components'
import { useBlockAttributes } from '~stackable/hooks'

/**
 * WordPress dependencies
 */
import { useBlockEditContext } from '@wordpress/block-editor'
import { useDispatch } from '@wordpress/data'
import { __ } from '@wordpress/i18n'
import { INVALID_HTML_ATTRIBUTES } from '.'

export const Edit = () => {
	const { clientId } = useBlockEditContext()

	const { updateBlockAttributes } = useDispatch( 'core/block-editor' )
	const attributes = useBlockAttributes( clientId )

	return (
		<InspectorAdvancedControls>
			<PanelAdvancedSettings
				title={ __( 'Custom Attributes', i18n ) }
				id="custom-attributes"
			>
				<CustomAttributesControl
					label={ __( 'Custom Attributes', i18n ) }
					value={ attributes.customAttributes }
					invalidHtmlAttributes={ INVALID_HTML_ATTRIBUTES }
					onChange={ customAttributes => updateBlockAttributes( clientId, { customAttributes } ) }
				/>
			</PanelAdvancedSettings>
		</InspectorAdvancedControls>
	)
}
