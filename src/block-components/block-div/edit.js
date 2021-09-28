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
	InspectorBlockControls,
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
		hasSizeSpacing,
	} = props
	const { clientId } = useBlockEditContext()

	const { updateBlockAttributes } = useDispatch( 'core/block-editor' )
	const attributes = useBlockAttributes( clientId )
	const blockEl = useBlockEl()

	return (
		<InspectorBlockControls>
			<PanelAdvancedSettings
				title={ __( 'Background', i18n ) }
				id="background"
				checked={ attributes.hasBackground }
				onChange={ hasBackground => updateBlockAttributes( clientId, { hasBackground } ) }
			>
				<BackgroundControls attrNameTemplate="block%s" />
			</PanelAdvancedSettings>
			{ hasSizeSpacing && (
				<PanelAdvancedSettings
					title={ __( 'Size & Spacing', i18n ) }
					id="size"
				>
					<SizeControls
						attrNameTemplate="block%s"
						blockEl={ blockEl }
					/>
				</PanelAdvancedSettings>
			) }
			<PanelAdvancedSettings
				title={ __( 'Borders & Shadows', i18n ) }
				id="borders"
			>
				<BorderControls
					attrNameTemplate="block%s"
					blockEl={ blockEl }
				/>
			</PanelAdvancedSettings>
		</InspectorBlockControls>
	)
}

Edit.defaultProps = {
	hasSizeSpacing: true,
}
