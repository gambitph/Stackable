/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'

/**
 * External dependencies
 */
import { i18n } from 'stackable'
import { SelectControl } from '@wordpress/components'

const BlendModeControl = props => {
	return (
		<SelectControl
			label={ props.label }
			value={ props.value }
			help={ props.help }
			options={ [
				{ value: '', label: __( 'None', i18n ) },
				{ value: 'normal', label: __( 'Normal', i18n ) },
				{ value: 'multiply', label: __( 'Multiply', i18n ) },
				{ value: 'screen', label: __( 'Screen', i18n ) },
				{ value: 'overlay', label: __( 'Overlay', i18n ) },
				{ value: 'darken', label: __( 'Darken', i18n ) },
				{ value: 'lighten', label: __( 'Lighten', i18n ) },
				{ value: 'color-dodge', label: __( 'Color Dodge', i18n ) },
				{ value: 'color-burn', label: __( 'Color Burn', i18n ) },
				{ value: 'hard-light', label: __( 'Hard Light', i18n ) },
				{ value: 'soft-light', label: __( 'Soft Light', i18n ) },
				{ value: 'difference', label: __( 'Difference', i18n ) },
				{ value: 'exclusion', label: __( 'Exclusion', i18n ) },
				{ value: 'hue', label: __( 'Hue', i18n ) },
				{ value: 'saturation', label: __( 'Saturation', i18n ) },
				{ value: 'color', label: __( 'Color', i18n ) },
				{ value: 'luminosity', label: __( 'Luminosity', i18n ) },
				{ value: 'initial', label: __( 'Initial', i18n ) },
				{ value: 'inherit', label: __( 'Inherit', i18n ) },
				{ value: 'unset', label: __( 'Unset', i18n ) },
			] }
			onChange={ props.onChange }
		/>
	)
}

BlendModeControl.defaultProps = {
	onChange: () => {},
	value: '',
	label: __( 'Mix Blend Mode', i18n ),
	help: __( 'Not supported in all browsers.', i18n ),
}

export default BlendModeControl
