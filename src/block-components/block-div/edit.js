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
	useBlockAttributesContext,
	useBlockEl,
	useBlockSetAttributesContext,
} from '~stackable/hooks'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'

export const Edit = props => {
	const {
		hasSizeSpacing,
	} = props
	const attributes = useBlockAttributesContext()
	const setAttributes = useBlockSetAttributesContext()
	const blockEl = useBlockEl()

	return (
		<InspectorBlockControls>
			<PanelAdvancedSettings
				title={ __( 'Background', i18n ) }
				id="background"
				checked={ attributes.hasBackground }
				onChange={ hasBackground => setAttributes( { hasBackground } ) }
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
