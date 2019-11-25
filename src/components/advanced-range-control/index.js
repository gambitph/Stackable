/**
 * Internal dependencies
 */
import BaseControlMultiLabel from '../base-control-multi-label'

/**
 * WordPress dependencies
 */
import { BaseControl, RangeControl } from '@wordpress/components'

/**
 * External dependencies
 */
import classnames from 'classnames'
import { omit } from 'lodash'

const AdvancedRangeControl = props => {
	const propsToPass = { ...omit( props, [ 'className', 'help', 'label', 'units', 'unit', 'onChangeUnit', 'screens', 'placeholder', 'initialPosition' ] ) }

	// Change the min, max & step values depending on the unit used.
	const i = props.units.indexOf( props.unit ) < 0 ? 0 : props.units.indexOf( props.unit )
	if ( Array.isArray( props.min ) ) {
		propsToPass.min = props.min[ i ]
	}
	if ( Array.isArray( props.max ) ) {
		propsToPass.max = props.max[ i ]
	}
	if ( Array.isArray( props.step ) ) {
		propsToPass.step = props.step[ i ]
	}
	propsToPass.initialPosition = props.initialPosition !== '' ? props.initialPosition : props.placeholder
	if ( Array.isArray( props.placeholder ) ) {
		propsToPass.placeholder = props.placeholder[ i ] || ''
		propsToPass.initialPosition = props.placeholder[ i ] || ''
	}
	if ( Array.isArray( props.initialPosition ) ) {
		propsToPass.initialPosition = props.initialPosition[ i ] || ''
	}

	return (
		<BaseControl
			help={ props.help }
			className={ classnames( 'ugb-advanced-range-control', props.className ) }
		>
			<BaseControlMultiLabel
				label={ props.label }
				units={ props.units }
				unit={ props.unit }
				onChangeUnit={ props.onChangeUnit }
				screens={ props.screens }
			/>
			<RangeControl
				placeholder={ props.placeholder }
				initialPosition={ props.initialPosition }
				{ ...propsToPass }
			/>
		</BaseControl>
	)
}

AdvancedRangeControl.defaultProps = {
	onChange: () => {},
	onChangeUnit: () => {},
	help: '',
	className: '',
	units: [ 'px' ],
	unit: 'px',
	screens: [ 'desktop' ],
	placeholder: '',
	initialPosition: '',
}

export default AdvancedRangeControl
