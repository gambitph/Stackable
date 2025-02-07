import AdvancedSelectControl from '../advanced-select-control'
import { i18n } from 'stackable'
import { __ } from '@wordpress/i18n'
import { InspectorControls } from '@wordpress/block-editor'

// TODO: when `add-new` is picked, disregard the value and open the global setting for global color scheme
const GlobalColorSchemeControl = () => {
	return (
		<InspectorControls>
			<AdvancedSelectControl
				label={ __( 'Color Scheme', 'ultimate-addons-for-gutenberg' ) }
				className="stk-global-color-scheme-control"
				options={ [
					{ value: '', label: __( 'Default', i18n ) },
					{ value: 'alt', label: __( 'Alternative', i18n ) },
					{ value: 'add-new', label: __( 'Add new…', i18n ) },
				] }
				allowReset={ false }
			/>
		</InspectorControls>
	)
}

export default GlobalColorSchemeControl
