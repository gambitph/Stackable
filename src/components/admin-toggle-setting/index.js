import { i18n } from 'stackable'
import AdminBaseSetting from '../admin-base-setting'
import { createRef } from '@wordpress/element'
import { __ } from '@wordpress/i18n'
import classnames from 'classnames'

const AdminToggleSetting = props => {
	const ref = createRef()
	return (
		<AdminBaseSetting
			onClick={ ev => {
				props.onChange( ! props.value )
				ev.preventDefault()
				ref.current.focus()
			} }
			{ ...props }
			className={ classnames( props.className, 'ugb-admin-toggle-setting' ) }
		>
			<button
				ref={ ref }
				className={ classnames(
					'ugb-admin-toggle-setting__button',
					{ 'ugb-admin-toggle-setting__button--enabled': !! props.value }
				) }
				type="button"
				role="switch"
				aria-checked={ !! props.value }
				onClick={ ev => {
					props.onChange( ! props.value )
					ev.preventDefault()
					ev.stopPropagation()
				} }
				style={ { minWidth: props.width || undefined } }
				disabled={ props.isDisabled ? 'disabled' : '' }
			>
			</button>
			<span className="ugb-admin-toggle-setting__label">
				<span style={ { visibility: props.value ? 'visible' : 'hidden' } }>{ props.enabled }</span>
				<span style={ { visibility: ! props.value ? 'visible' : 'hidden' } }>{ props.disabled }</span>
			</span>
		</AdminBaseSetting>
	)
}

AdminToggleSetting.defaultProps = {
	label: '',
	value: false,
	placeholder: '',
	onChange: () => {},
	disabled: __( 'Disabled', i18n ),
	enabled: __( 'Enabled', i18n ),
	width: '',
	isDisabled: false,
}

export default AdminToggleSetting
