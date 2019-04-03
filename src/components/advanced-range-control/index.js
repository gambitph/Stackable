import { BaseControl, RangeControl } from '@wordpress/components'
import BaseControlMultiLabel from '../base-control-multi-label'
import classnames from 'classnames'
import { omit } from 'lodash'

const AdvancedRangeControl = props => {
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
				{ ...omit( props, [ 'className', 'help', 'label', 'units', 'unit', 'onChangeUnit', 'screens' ] ) }
			/>
		</BaseControl>
	)
}

AdvancedRangeControl.defaultProps = {
	onChange: () => {},
	onChangeUnit: () => {},
}

export default AdvancedRangeControl
