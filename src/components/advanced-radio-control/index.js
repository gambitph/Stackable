/**
 * WordPress dependencies
 */
import { RadioControl } from '@wordpress/components'

/**
 * External dependencies
 */
import classnames from 'classnames'
import { omit } from 'lodash'
import { BaseControl } from '..'
import { getPropsWithDefaults } from '../../util/props'

// TODO: reset not showing up
const AdvancedRadioControl = incomingProps => {
	const props = getPropsWithDefaults( incomingProps, ADVANCED_RADIO_CONTROL_DEFAULT_PROPS )
	return (
		<BaseControl
			help={ props.help }
			className={ classnames( 'ugb-advanced-radio-control', props.className ) }
			label={ props.label }
			units={ props.units }
			unit={ props.unit }
			onChangeUnit={ props.onChangeUnit }
			screens={ props.screens }
			allowReset={ props.allowReset }
			value={ props.selected }
			onChange={ props.onChange }
			defaultValue={ props.defaultValue }
		>
			<RadioControl
				{ ...omit( props, [ 'className', 'help', 'label', 'units', 'unit', 'onChangeUnit', 'screens', 'allowReset', 'defaultValue' ] ) }
			/>
		</BaseControl>
	)
}

const ADVANCED_RADIO_CONTROL_DEFAULT_PROPS = {
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

export default AdvancedRadioControl
