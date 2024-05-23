/**
 * External dependencies
 */
import { i18n } from 'stackable'
import {
	InspectorAdvancedControls, InspectorStyleControls, PanelAdvancedSettings,
} from '~stackable/components'
import { useBlockAttributesContext, useBlockSetAttributesContext } from '~stackable/hooks'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'

/**
 * Internal dependencies
 */
import { LinkControls } from '../helpers/link'
import { getAttrNameFunction } from '~stackable/util'

export const Edit = props => {
	const getAttrName = getAttrNameFunction( 'link%s' )
	const attrName = getAttrName( 'hasLink' )
	const hasLink = useBlockAttributesContext( attributes => attributes[ attrName ] )
	const setAttributes = useBlockSetAttributesContext()

	const onChange = value => {
		setAttributes( { [ attrName ]: value } )
	}

	const Tab = props.isAdvancedTab ? InspectorAdvancedControls : InspectorStyleControls

	return (
		<Tab>
			<PanelAdvancedSettings
				title={ __( 'Link', i18n ) }
				id="link"
				hasToggle={ props.hasToggle }
				checked={ props.hasToggle ? hasLink : undefined }
				onChange={ props.hasToggle ? onChange : undefined }
			>
				<LinkControls attrNameTemplate="link%s" hasLightbox hasAnchorId={ props.hasAnchorId } />
			</PanelAdvancedSettings>
		</Tab>
	)
}

Edit.defaultProps = {
	hasToggle: false,
	isAdvancedTab: false,
	hasAnchorId: false,
}
