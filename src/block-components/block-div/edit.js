import { attributes } from './attributes'
import { useUniqueId } from './use-unique-id'
import { addStyles } from './style'

import classnames from 'classnames'
import { i18n } from 'stackable'

import { useBlockEditContext } from '@wordpress/block-editor'
import { useSelect, useDispatch } from '@wordpress/data'
import { __ } from '@wordpress/i18n'
import {
	BackgroundControlsHelper, Div, InspectorSectionControls, PanelAdvancedSettings,
} from '~stackable/components'

export const Edit = props => {
	const { clientId } = useBlockEditContext()

	const { updateBlockAttributes } = useDispatch( 'core/block-editor' )
	const { attributes } = useSelect(
		select => {
			const { getBlockAttributes } = select( 'core/block-editor' )
			return {
				attributes: getBlockAttributes( clientId ),
			}
		},
		[ clientId ]
	)

	const {
		hasContainer,
		hasBackground,
	} = attributes

	return (
		<InspectorSectionControls>
			<PanelAdvancedSettings
				title={ __( 'Background', i18n ) }
				id="background"
				checked={ hasBackground }
				onChange={ hasBackground => updateBlockAttributes( clientId, { hasBackground } ) }
				toggleOnSetAttributes={ [
					'blockBackgroundColor',
					'arrowColor',
				] }
				toggleAttributeName="hasBackground"
			>
				<BackgroundControlsHelper
					attrNameTemplate="block%s"
					// setAttributes={ setAttributes }
					blockAttributes={ attributes }
				/>
			</PanelAdvancedSettings>
		</InspectorSectionControls>
	)
}
