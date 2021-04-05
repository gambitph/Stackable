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

const AdvancedToggleControl = props => {
	const {
		label,
		checked,
		help,
		onChange,
	} = props

	const instanceId = useInstanceId( AdvancedToggleControl )
	const id = `inspector-toggle-control-${ instanceId }`

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
			value={ props.checked }
			showReset={ props.defaultValue ? props.checked !== props.defaultValue : props.checked }
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
	checked: false,
	onChange: () => {},
	allowReset: false,
	showReset: null,
	defaultValue: '',
	onReset: null,
	allowLink: false,
	isLinked: true,
	onLink: () => {},
}

export default AdvancedToggleControl
