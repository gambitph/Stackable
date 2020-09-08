import { AdminBaseSetting } from '~stackable/components'

const AdminTextSetting = props => {
	return (
		<AdminBaseSetting { ...props }>
			<input
				className="ugb-admin-text-setting"
				type={ props.type }
				value={ props.value }
				placeholder={ props.placeholder }
				onChange={ event => props.onChange( event.target.value ) }
			/>
			{ props.children }
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
