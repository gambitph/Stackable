import { __ } from '@wordpress/i18n'
import { SelectControl } from '@wordpress/components'

const BlendModeControl = props => {
	return (
		<SelectControl
			label={ props.label }
			value={ props.value }
			help={ props.help }
			options={ [
				{ value: '', label: __( 'None' ) },
				{ value: 'normal', label: __( 'Normal' ) },
				{ value: 'multiply', label: __( 'Multiply' ) },
				{ value: 'screen', label: __( 'Screen' ) },
				{ value: 'overlay', label: __( 'Overlay' ) },
				{ value: 'darken', label: __( 'Darken' ) },
				{ value: 'lighten', label: __( 'Lighten' ) },
				{ value: 'color-dodge', label: __( 'Color Dodge' ) },
				{ value: 'color-burn', label: __( 'Color Burn' ) },
				{ value: 'hard-light', label: __( 'Hard Light' ) },
				{ value: 'soft-light', label: __( 'Soft Light' ) },
				{ value: 'difference', label: __( 'Difference' ) },
				{ value: 'exclusion', label: __( 'Exclusion' ) },
				{ value: 'hue', label: __( 'Hue' ) },
				{ value: 'saturation', label: __( 'Saturation' ) },
				{ value: 'color', label: __( 'Color' ) },
				{ value: 'luminosity', label: __( 'Luminosity' ) },
				{ value: 'initial', label: __( 'Initial' ) },
				{ value: 'inherit', label: __( 'Inherit' ) },
				{ value: 'unset', label: __( 'Unset' ) },
			] }
			onChange={ props.onChange }
		/>
	)
}

BlendModeControl.defaultProps = {
	onChange: () => {},
	value: '',
	label: __( 'Mix Blend Mode' ),
	help: __( 'Not supported in all browsers.' ),
}

export default BlendModeControl
