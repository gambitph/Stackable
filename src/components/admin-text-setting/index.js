import AdminBaseSetting from '../admin-base-setting'
import { createRef } from '@wordpress/element'
import { maskSensitiveValue } from '~stackable/util'

const AdminTextSetting = props => {
	const ref = createRef()
	const maskedValue = props.maskValue ? maskSensitiveValue( props.value ) : props.value

	return (
		<AdminBaseSetting
			onClick={ ev => {
				ev.preventDefault()
				ref.current.focus()
				if ( props.maskValue ) {
					ref.current.select()
				}
			} }
			{ ...props }
		>
			<input
				ref={ ref }
				className="ugb-admin-text-setting"
				type={ props.type }
				value={ maskedValue }
				placeholder={ props.placeholder }
				autoComplete={ props.maskValue ? 'off' : undefined }
				onFocus={ () => {
					if ( props.maskValue ) {
						ref.current.select()
					}
				} }
				onChange={ event => {
					if ( props.maskValue && event.target.value === maskedValue ) {
						return
					}
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
	maskValue: false,
	placeholder: '',
	onChange: () => {},
}

export default AdminTextSetting
