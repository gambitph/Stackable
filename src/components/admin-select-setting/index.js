import AdminBaseSetting from '../admin-base-setting'

const AdminSelectSetting = props => {
	return (
		<AdminBaseSetting { ...props }>
			{ /* eslint-disable-next-line jsx-a11y/no-onchange */ }
			<select
				className="ugb-admin-select-setting"
				value={ props.value }
				onChange={ event => props.onChange( event.target.value ) }
			>
				{ props.options.map( ( item, idx ) => {
					return (
						<option
							key={ idx }
							value={ item.value }
						>{ item.name }</option>
					)
				} ) }
			</select>
			{ props.children }
		</AdminBaseSetting>
	)
}

AdminSelectSetting.defaultProps = {
	label: '',
	value: '',
	onChange: () => {},
	options: [],
}

export default AdminSelectSetting
