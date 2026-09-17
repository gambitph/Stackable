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
import { ExternalLink } from '@wordpress/components'
import { INVALID_HTML_ATTRIBUTES } from '.'

const CustomAttributesHelp = ( { hasLink } ) => {
	return <>
		{ hasLink
			? __( 'You can type in custom HTML attributes for this block or its link in the fields above. Examples:', i18n )
			: __( 'You can type in custom HTML attributes for this block in the field above. Example:', i18n ) }
		<br />
		<code>data-id=&quot;my-title&quot;</code>
		{ hasLink && <>
			<br />
			<code>aria-label=&quot;Learn more&quot;</code>
		</> }
		<br />
		<ExternalLink
			href="https://docs.wpstackable.com/article/461-how-to-use-custom-attributes?utm_source=inspector&utm_campaign=learnmore&utm_medium=gutenberg"
			target="_docs"
		>
			{ __( 'Learn more about Custom Attributes', i18n ) }
		</ExternalLink>
	</>
}

export const Edit = props => {
	const {
		customAttributes,
		linkCustomAttributes,
	} = useBlockAttributesContext( attributes => ( {
		customAttributes: attributes.customAttributes,
		linkCustomAttributes: props.linkAttributeName ? attributes[ props.linkAttributeName ] : undefined,
	} ) )
	const setAttributes = useBlockSetAttributesContext()

	return (
		<InspectorAdvancedControls>
			<PanelAdvancedSettings
				title={ __( 'Custom Attributes', i18n ) }
				id="custom-attributes"
			>
				<CustomAttributesControl
					label={ props.linkAttributeName ? __( 'Block Custom Attributes', i18n ) : __( 'Custom Attributes', i18n ) }
					value={ customAttributes }
					invalidHtmlAttributes={ INVALID_HTML_ATTRIBUTES }
					onChange={ customAttributes => setAttributes( { customAttributes } ) }
					help={ ! props.linkAttributeName && <CustomAttributesHelp hasLink={ false } /> }
				/>
				{ props.linkAttributeName && <CustomAttributesControl
					label={ __( 'Link Custom Attributes', i18n ) }
					value={ linkCustomAttributes }
					invalidHtmlAttributes={ INVALID_HTML_ATTRIBUTES }
					onChange={ linkCustomAttributes => setAttributes( { [ props.linkAttributeName ]: linkCustomAttributes } ) }
					help={ <CustomAttributesHelp hasLink /> }
				/>
				}
			</PanelAdvancedSettings>
		</InspectorAdvancedControls>
	)
}

Edit.defaultProps = {
	linkAttributeName: '',
}
