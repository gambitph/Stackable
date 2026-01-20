import AdminBaseSetting from '../admin-base-setting'
import IconControl from '../icon-control'
import classnames from 'classnames'

const defaultIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 190 190"><polygon points="173.8,28.4 60.4,141.8 15.7,97.2 5.1,107.8 60.4,163 184.4,39 173.8,28.4"/></svg>'

const AdminIconSetting = props => {
	return (
		<AdminBaseSetting
			{ ...props }
			className={ classnames( props.className, 'ugb-admin-icon-setting' ) }>
			<IconControl
				label=""
				value={ props.value }
				defaultValue={ defaultIcon }
				onChange={ icon => {
					props.onChange( icon )
				} }
				allowReset={ false }
				hasPanelModifiedIndicator={ true }
			/>
			{ props.children }
		</AdminBaseSetting>
	)
}

AdminIconSetting.defaultProps = {
	value: '',
	onChange: () => {},
}

export default AdminIconSetting
