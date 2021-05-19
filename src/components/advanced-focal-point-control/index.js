/**
 * WordPress dependencies
 */
import { FocalPointPicker } from '@wordpress/components'
import { memo } from '@wordpress/element'

/**
 * External dependencies
 */
import classnames from 'classnames'
import { omit } from 'lodash'
import { BaseControl } from '..'

const AdvancedFocalPointControl = props => {
	return (
		<BaseControl
			help={ props.help }
			className={ classnames( 'stk-advanced-focal-point-control', props.className ) }
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
			<FocalPointPicker
				{ ...omit( props, [ 'className', 'help', 'label', 'units', 'unit', 'onChangeUnit', 'screens', 'allowReset', 'defaultValue' ] ) }
			/>
		</BaseControl>
	)
}

AdvancedFocalPointControl.defaultProps = {
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

export default memo( AdvancedFocalPointControl )
