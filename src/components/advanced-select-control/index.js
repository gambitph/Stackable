/**
 * WordPress dependencies
 */
import { SelectControl } from '@wordpress/components'

/**
 * External dependencies
 */
import classnames from 'classnames'
import { omit } from 'lodash'
import { BaseControl } from '..'

const AdvancedSelectControl = props => {
	return (
		<BaseControl
			help={ props.help }
			className={ classnames( 'ugb-advanced-select-control', props.className ) }
			label={ props.label }
			units={ props.units }
			unit={ props.unit }
			onChangeUnit={ props.onChangeUnit }
			screens={ props.screens }
			allowReset={ props.allowReset }
			value={ props.value }
			onChange={ props.onChange }
			defaultValue={ props.defaultValue }
		>
			<SelectControl
				{ ...omit( props, [ 'className', 'help', 'label', 'units', 'unit', 'onChangeUnit', 'screens', 'defaultValue' ] ) }
			/>
		</BaseControl>
	)
}

AdvancedSelectControl.defaultProps = {
	onChange: () => {},
	onChangeUnit: () => {},
	help: '',
	className: '',
	units: [ 'px' ],
	unit: 'px',
	screens: [ 'desktop' ],
	allowReset: true,
	defaultValue: '',
}

export default AdvancedSelectControl
