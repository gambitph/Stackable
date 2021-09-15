/**
 * Internal dependencies
 */
import { BaseControl } from '..'

/**
 * Exterior dependencies
 */
import { isFunction } from 'lodash'
import classnames from 'classnames'

/**
 * WordPress dependencies
 */
import { useInstanceId } from '@wordpress/compose'
import { FormToggle } from '@wordpress/components'
import { useControlHandlers } from '../base-control2/hooks'

const AdvancedToggleControl = props => {
	const {
		label,
		help,
	} = props

	const instanceId = useInstanceId( AdvancedToggleControl )
	const id = `inspector-toggle-control-${ instanceId }`

	const [ _checked, _onChange ] = useControlHandlers( props.attribute, props.responsive, props.hover, props.changeCallback )

	const checked = typeof props.checked === 'undefined' ? _checked : props.checked
	const onChange = typeof props.onChange === 'undefined' ? _onChange : props.onChange

	let describedBy, helpLabel
	if ( help ) {
		describedBy = id + '__help'
		helpLabel = isFunction( help ) ? help( checked ) : help
	}

	const className = classnames( [
		'components-toggle-control',
		'stk-toggle-control',
		props.className,
	] )

	return (
		<BaseControl
			id={ id }
			help={ helpLabel }
			className={ className }
			allowReset={ true }
			value={ checked }
			showReset={ props.defaultValue ? checked !== props.defaultValue : checked }
			onChange={ onChange }
			hasLabel={ false }
			defaultValue={ props.defaultValue }
		>
			<FormToggle
				id={ id }
				checked={ checked }
				onChange={ event => onChange( event.target.checked ) }
				aria-describedby={ describedBy }
			/>
			<label htmlFor={ id } className="components-toggle-control__label">
				{ label }
			</label>
		</BaseControl>
	)
}

AdvancedToggleControl.defaultProps = {
	className: '',
	allowReset: false,
	showReset: null,
	defaultValue: '',

	attribute: '',
	responsive: false,
	hover: false,

	checked: undefined,
	onChange: undefined,
}

export default AdvancedToggleControl
