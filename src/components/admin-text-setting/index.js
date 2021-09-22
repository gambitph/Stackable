import { AdminBaseSetting } from '~stackable/components'
import { createRef } from '@wordpress/element'

const AdminTextSetting = props => {
	const ref = createRef()
	return (
		<AdminBaseSetting
			onClick={ ev => {
				ev.preventDefault()
				ref.current.focus()
			} }
			{ ...props }
		>
			<input
				ref={ ref }
				className="ugb-admin-text-setting"
				type={ props.type }
				value={ props.value }
				placeholder={ props.placeholder }
				onChange={ event => {
					props.onChange( event.target.value )
					event.preventDefault()
					event.stopPropagation()
				} }
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
