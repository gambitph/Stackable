/**
 * Internal dependencies
 */
import {
	BackgroundControls,
	BorderControls,
	SizeControls,
} from '../helpers'

/**
 * External dependencies
 */
import { i18n } from 'stackable'
import {
	InspectorStyleControls,
	PanelAdvancedSettings,
} from '~stackable/components'
import {
	useBlockAttributes, useBlockEl,
} from '~stackable/hooks'

/**
 * WordPress dependencies
 */
import { useBlockEditContext } from '@wordpress/block-editor'
import { useDispatch } from '@wordpress/data'
import { __ } from '@wordpress/i18n'

export const Edit = props => {
	const {
		sizeSelector = '.stk-container',
		borderSelector = '.stk-container',
	} = props

	const { clientId } = useBlockEditContext()

	const { updateBlockAttributes } = useDispatch( 'core/block-editor' )
	const attributes = useBlockAttributes( clientId )
	const blockElSize = useBlockEl( sizeSelector )
	const blockElBorder = useBlockEl( borderSelector )

	return (
		<InspectorStyleControls>
			<PanelAdvancedSettings
				title={ __( 'Container Background', i18n ) }
				id="container"
				checked={ attributes.hasContainer }
				onChange={ hasContainer => updateBlockAttributes( clientId, { hasContainer } ) }
			>
				<BackgroundControls attrNameTemplate="container%s" />
			</PanelAdvancedSettings>
			<PanelAdvancedSettings
				title={ __( 'Container Size & Spacing', i18n ) }
				id="container-size"
			>
				<SizeControls
					attrNameTemplate="container%s"
					blockEl={ blockElSize }
					enableMargin={ false }
				/>
			</PanelAdvancedSettings>
			<PanelAdvancedSettings
				title={ __( 'Container Borders & Shadow', i18n ) }
				id="container-size"
			>
				<BorderControls
					attrNameTemplate="container%s"
					blockEl={ blockElBorder }
				/>
			</PanelAdvancedSettings>
		</InspectorStyleControls>
	)
}
