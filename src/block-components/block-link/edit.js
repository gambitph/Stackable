/**
 * External dependencies
 */
import { i18n } from 'stackable'
import {
	InspectorSectionControls,
	PanelAdvancedSettings,
} from '~stackable/components'
import { useBlockAttributes, useDidAttributesChange } from '~stackable/hooks'

/**
 * WordPress dependencies
 */
import { useBlockEditContext } from '@wordpress/block-editor'
import { useDispatch } from '@wordpress/data'
import { Fragment, useCallback } from '@wordpress/element'
import { __ } from '@wordpress/i18n'
import { LinkControls } from '../helpers/link'

export const Edit = () => {
	const { clientId, name: blockName } = useBlockEditContext()

	const { updateBlockAttributes } = useDispatch( 'core/block-editor' )
	const attributes = useBlockAttributes( clientId )

	// Turn on hasBackground when background attributes are changed.
	const onAttributesChanged = useCallback( () => {
		updateBlockAttributes( clientId, { hasBlockLink: true } )
	}, [ clientId ] )
	useDidAttributesChange( onAttributesChanged, blockName, attributes.blockLinkUrl )

	return (
		<Fragment>
			<InspectorSectionControls>
				<PanelAdvancedSettings
					title={ __( 'Link', i18n ) }
					id="link"
					checked={ attributes.hasBlockLink }
					onChange={ hasBlockLink => updateBlockAttributes( clientId, { hasBlockLink } ) }
				>
					<LinkControls attrNameTemplate="blockLink%s" />
				</PanelAdvancedSettings>
			</InspectorSectionControls>
		</Fragment>
	)
}
