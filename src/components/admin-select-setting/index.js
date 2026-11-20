import AdminBaseSetting from '../admin-base-setting'
import { getPropsWithDefaults } from '../../util/props'

const AdminSelectSetting = incomingProps => {
	const props = getPropsWithDefaults( incomingProps, ADMIN_SELECT_SETTING_DEFAULT_PROPS )
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

const ADMIN_SELECT_SETTING_DEFAULT_PROPS = {
	label: '',
	value: '',
	onChange: () => {},
	options: [],
}

export default AdminSelectSetting
