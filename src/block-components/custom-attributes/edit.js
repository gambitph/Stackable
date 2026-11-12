/**
 * Internal dependencies
 */

/**
 * External dependencies
 */
import { i18n } from 'stackable'
import {
	ControlSeparator,
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
		<p>{ __( 'Add custom HTML attributes to enhance the functionality of your block or link. For example:', i18n ) }</p>
		<code>data-id=&quot;my-title&quot;</code>
		{ hasLink && <>
			<br />
			<code>aria-label=&quot;Learn more&quot;</code>
		</> }
		<br />
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
				responsive={ false }
			>
				<CustomAttributesControl
					label={ props.linkAttributeName ? __( 'Block Custom Attributes', i18n ) : __( 'Custom Attributes', i18n ) }
					value={ customAttributes }
					placeholder={ __( 'data-id="my-title"', i18n ) }
					invalidHtmlAttributes={ INVALID_HTML_ATTRIBUTES }
					onChange={ customAttributes => setAttributes( { customAttributes } ) }
					help={ __( 'Attributes placed here will be added to the block element. Separate multiple attributes with a space.', i18n ) }
				/>
				{ props.linkAttributeName && <CustomAttributesControl
					label={ __( 'Link Custom Attributes', i18n ) }
					value={ linkCustomAttributes }
					placeholder={ __( 'aria-label="Learn more"', i18n ) }
					invalidHtmlAttributes={ INVALID_HTML_ATTRIBUTES }
					onChange={ linkCustomAttributes => setAttributes( { [ props.linkAttributeName ]: linkCustomAttributes } ) }
					help={ __( 'Attributes placed here will be added to the anchor tag if this block has a link. Separate multiple attributes with a space.', i18n ) }
				/>
				}
				<ControlSeparator />
				<CustomAttributesHelp hasLink />
			</PanelAdvancedSettings>
		</InspectorAdvancedControls>
	)
}

Edit.defaultProps = {
	linkAttributeName: '',
}
