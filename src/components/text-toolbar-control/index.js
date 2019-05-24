import {
	BaseControl,
} from '@wordpress/components'
import { omit } from 'lodash'
import { TextToolbar } from '@stackable/components'

const TextToolbarControl = props => {
	return (
		<BaseControl
			{ ...omit( props, [ 'controls' ] ) }
		>
			<TextToolbar controls={ props.controls } />
		</BaseControl>
	)
}

TextToolbarControl.defaultProps = {
	controls: {},
}

export default TextToolbarControl
