import { i18n } from 'stackable'
import { AdminBaseSetting } from '~stackable/components'
import { createRef } from '@wordpress/element'
import { __ } from '@wordpress/i18n'

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
		>
			<button
				ref={ ref }
				className="ugb-admin-toggle-setting__button"
				type="button"
				role="switch"
				aria-checked={ !! props.value }
				onClick={ ev => {
					props.onChange( ! props.value )
					ev.preventDefault()
					ev.stopPropagation()
				} }
				style={ { minWidth: props.width || undefined } }
			>
				<span>{ props.disabled }</span>
				<span>{ props.enabled }</span>
			</button>
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
}

export default AdminToggleSetting
