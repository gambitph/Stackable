/**
 * External dependencies
 */
import { TextToolbar } from '~stackable/components'

/**
 * WordPress dependencies
 */
import {
	BaseControl,
} from '@wordpress/components'
import { omit } from 'lodash'

const TextToolbarControl = props => {
	return (
		<BaseControl
			{ ...omit( props, [ 'controls' ] ) }
		>
			<TextToolbar controls={ props.controls.map( control => {
				return {
					...control,
					isActive: props.value === control.value,
					onClick: () => props.onChange( control.value ),
				}
			} ) } />
		</BaseControl>
	)
}

TextToolbarControl.defaultProps = {
	controls: {},
	value: '',
	onChange: () => {},
}

export default TextToolbarControl
