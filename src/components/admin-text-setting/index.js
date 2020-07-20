import { AdminBaseSetting } from '~stackable/components'

const AdminTextSetting = props => {
	return (
		<AdminBaseSetting { ...props }>
			<input
				className="ugb-admin-text-setting"
				type={ props.type }
				value={ props.value }
				placeholder={ props.placeholder }
				onChange={ props.onChange }
			/>
		</AdminBaseSetting>
	)
}

AdminTextSetting.defaultProps = {
	label: '',
	type: 'text',
	value: '',
	placeholder: '',
	onChange: () => {},
}

export default AdminTextSetting
