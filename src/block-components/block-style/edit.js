/**
 * Internal dependencies
 */
import BlockStyles from './block-styles'

/**
 * External dependencies
 */
import { i18n } from 'stackable'
import {
	InspectorStyleControls,
	PanelAdvancedSettings,
} from '~stackable/components'

/**
 * WordPress dependencies
 */
import { useBlockEditContext } from '@wordpress/block-editor'
import { __ } from '@wordpress/i18n'

export const Edit = props => {
	const { clientId } = useBlockEditContext()

	return (
		<InspectorStyleControls>
			<PanelAdvancedSettings
				title={ __( 'Styles', i18n ) }
				id="styles"
				initialOpen={ props.initialOpen }
			>
				<BlockStyles clientId={ clientId } />
			</PanelAdvancedSettings>
		</InspectorStyleControls>
	)
}

Edit.defaultProps = {
	initialOpen: true,
}
