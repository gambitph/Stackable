import { BaseControl, RangeControl } from '@wordpress/components'
import BaseControlMultiLabel from '../base-control-multi-label'
import classnames from 'classnames'
import { omit } from 'lodash'

const ResponsiveRangeControl = props => {
	return (
		<BaseControl
			help={ props.help }
			className={ classnames( 'ugb-responsive-range-control', props.className ) }
		>
			<BaseControlMultiLabel
				label={ props.label }
				units={ props.units }
				unit={ props.unit }
				onChangeUnit={ props.onChangeUnit }
				screens={ props.screens }
			/>
			<RangeControl
				{ ...omit( props, [ 'label', 'help', 'className', 'units', 'unit', 'onChangeUnit', 'screens' ] ) }
			/>
		</BaseControl>
	)
}

ResponsiveRangeControl.defaultProps = {
	help: '',
	className: '',
	units: [ 'px' ],
	unit: 'px',
	onChangeUnit: () => {},
	screens: [ 'desktop', 'tablet', 'mobile' ],
}

export default ResponsiveRangeControl
