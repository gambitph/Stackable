import { i18n } from 'stackable'
import { AdminBaseSetting } from '~stackable/components'
import { __ } from '@wordpress/i18n'

const AdminToggleSetting = props => {
	return (
		<AdminBaseSetting { ...props }>
			<button
				className="ugb-admin-toggle-setting__button"
				type="button"
				role="switch"
				aria-checked={ !! props.value }
				onClick={ () => props.onChange( ! props.value ) }
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
