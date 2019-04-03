import { BaseControl, SelectControl } from '@wordpress/components'
import BaseControlMultiLabel from '../base-control-multi-label'
import classnames from 'classnames'
import { omit } from 'lodash'

const AdvancedSelectControl = props => {
	return (
		<BaseControl
			help={ props.help }
			className={ classnames( 'ugb-advanced-select-control', props.className ) }
		>
			<BaseControlMultiLabel
				label={ props.label }
				units={ props.units }
				unit={ props.unit }
				onChangeUnit={ props.onChangeUnit }
				screens={ props.screens }
			/>
			<SelectControl
				{ ...omit( props, [ 'className', 'help', 'label', 'units', 'unit', 'onChangeUnit', 'screens' ] ) }
			/>
		</BaseControl>
	)
}

AdvancedSelectControl.defaultProps = {
	onChange: () => {},
	onChangeUnit: () => {},
}

export default AdvancedSelectControl
