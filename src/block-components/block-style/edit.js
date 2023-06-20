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
import { __ } from '@wordpress/i18n'
import { memo } from '@wordpress/element'

export const Edit = memo( props => {
	return (
		<InspectorStyleControls>
			<PanelAdvancedSettings
				title={ __( 'Styles', i18n ) }
				id="styles"
				initialOpen={ props.initialOpen }
			>
				<BlockStyles styles={ props.styles } />
				{ props.children }
			</PanelAdvancedSettings>
		</InspectorStyleControls>
	)
} )

Edit.Controls = BlockStyles

Edit.defaultProps = {
	initialOpen: true,
	styles: [],
}
