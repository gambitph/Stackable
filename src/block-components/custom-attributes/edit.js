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
import { useBlockAttributesContext, useBlockSetAttributesContext } from '~stackable/hooks'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { INVALID_HTML_ATTRIBUTES } from '.'

export const Edit = () => {
	const attributes = useBlockAttributesContext()
	const setAttributes = useBlockSetAttributesContext()

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
					onChange={ customAttributes => setAttributes( { customAttributes } ) }
				/>
			</PanelAdvancedSettings>
		</InspectorAdvancedControls>
	)
}
