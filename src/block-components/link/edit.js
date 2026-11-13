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
import { getPropsWithDefaults } from '../../util/props'

export const Edit = incomingProps => {
	const props = getPropsWithDefaults( incomingProps, EDIT_DEFAULT_PROPS )
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
				responsive={ false }
				hasToggle={ props.hasToggle }
				checked={ props.hasToggle ? hasLink : undefined }
				onChange={ props.hasToggle ? onChange : undefined }
			>
				<LinkControls attrNameTemplate="link%s" hasLightbox hasAnchorId={ props.hasAnchorId } />
			</PanelAdvancedSettings>
		</Tab>
	)
}

const EDIT_DEFAULT_PROPS = {
	hasToggle: false,
	isAdvancedTab: false,
	hasAnchorId: false,
}
