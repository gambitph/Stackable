/**
 * Internal dependencies
 */
import AdvancedControl, { extractControlProps } from '../base-control2'
import { useControlHandlers } from '../base-control2/hooks'
import { ResetButton } from '../base-control2/reset-button'

/**
 * WordPress dependencies
 */
import { SelectControl } from '@wordpress/components'

/**
 * External dependencies
 */
import classnames from 'classnames'

const AdvancedSelectControl = props => {
	const [ value, onChange ] = useControlHandlers( props.attribute )
	const [ propsToPass, controlProps ] = extractControlProps( props )

	return (
		<AdvancedControl
			{ ...controlProps }
			className={ classnames( 'ugb-advanced-select-control', props.className ) }
		>
			<SelectControl
				{ ...propsToPass }
				value={ typeof props.value === 'undefined' ? value : props.value }
				onChange={ typeof props.onChange === 'undefined' ? onChange : props.onChange }
			/>
			<ResetButton
				allowReset={ props.allowReset }
				value={ typeof props.value === 'undefined' ? value : props.value }
				default={ props.default }
				onChange={ typeof props.onChange === 'undefined' ? onChange : props.onChange }
			/>
		</AdvancedControl>
	)
}

AdvancedSelectControl.defaultProps = {
	className: '',
	url: '',

	allowReset: true,
	default: '',

	attribute: '',

	value: undefined,
	onChange: undefined,
}

export default AdvancedSelectControl
