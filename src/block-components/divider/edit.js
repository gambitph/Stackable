/**
 * External dependencies
 */
import { i18n } from 'stackable'
import {
	InspectorStyleControls,
	PanelAdvancedSettings,
	AdvancedToolbarControl,
	ColorPaletteControl,
} from '~stackable/components'
import {
	useBlockAttributesContext,
	useBlockSetAttributesContext,
} from '~stackable/hooks'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'

const DIVIDER_TYPE_CONTROLS = [
	{
		value: '',
		title: __( 'None', i18n ),
	},
	{
		value: ':',
		title: __( ':', i18n ),
	},
	{
		value: '|',
		title: __( '|', i18n ),
	},
]

export const Edit = props => {
	const {
		attributes,
	} = props

	const hasDivider = useBlockAttributesContext( attributes => attributes.hasDivider )
	const setAttributes = useBlockSetAttributesContext()

	return (
		<InspectorStyleControls>
			<PanelAdvancedSettings
				title={ __( 'Separator', i18n ) }
				id="divider"
				hasToggle={ true }
				checked={ hasDivider }
				onChange={ hasDivider => setAttributes( { hasDivider } ) }
			>
				<AdvancedToolbarControl
					controls={ DIVIDER_TYPE_CONTROLS }
					attribute="dividerType"
					fullwidth={ true }
					default={ attributes?.dividerType ? attributes.dividerType : '' }
					isSmall={ false }
				/>
				<ColorPaletteControl
					label={ __( 'Color', i18n ) }
					attribute="dividerColor"
				/>
			</PanelAdvancedSettings>
		</InspectorStyleControls>
	)
}
