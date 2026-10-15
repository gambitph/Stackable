/**
 * Internal dependencies
 */

/**
 * External dependencies
 */
import { i18n } from 'stackable'
import {
	BlockStyles,
	InspectorStyleControls,
	PanelAdvancedSettings,
} from '~stackable/components'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { memo } from '@wordpress/element'
import { getPropsWithDefaults } from '../../util/props'

export const Edit = memo( incomingProps => {
	const props = getPropsWithDefaults( incomingProps, EDIT_DEFAULT_PROPS )
	return (
		<InspectorStyleControls>
			<PanelAdvancedSettings
				title={ __( 'Styles', i18n ) }
				id="styles"
				initialOpen={ props.initialOpen }
				responsive={ false }
			>
				<BlockStyles styles={ props.styles } />
				{ props.children }
			</PanelAdvancedSettings>
		</InspectorStyleControls>
	)
} )

const EDIT_DEFAULT_PROPS = {
	initialOpen: true,
	styles: [],
}
