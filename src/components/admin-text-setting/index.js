import AdminBaseSetting from '../admin-base-setting'
import { useRef, useState } from '@wordpress/element'
import { maskSensitiveValue } from '~stackable/util/mask-sensitive-value'

const AdminTextSetting = props => {
	const ref = useRef()
	const [ isEditing, setIsEditing ] = useState( false )
	const value = props.maskValue && ! isEditing ? maskSensitiveValue( props.value ) : props.value

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
				value={ value }
				placeholder={ props.placeholder }
				autoComplete={ props.maskValue ? 'off' : undefined }
				onFocus={ () => {
					if ( props.maskValue ) {
						setIsEditing( true )
						setTimeout( () => ref.current?.select() )
					}
				} }
				onBlur={ () => {
					setIsEditing( false )
				} }
				onChange={ event => {
					if ( props.maskValue && ! isEditing ) {
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
