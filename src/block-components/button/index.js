/**
 * Internal dependencies
 */
import { addAttributes } from './attributes'
import { Style } from './style'
import { Edit } from './edit'
import { Link } from '../link'
import { Icon } from '../icon'

export const Button = props => {
	const {
		className,
		hasLinearGradient,
	} = props

	return (
		<Link className={ className }>
			<Icon
				hasLinearGradient={ hasLinearGradient }
			/>
			{ props.children }
		</Link>
	)
}

Button.defaultProps = {
	className: '',
	hasLinearGradient: true,
}

Button.Content = props => {
	const {
		className,
		hasLinearGradient,
		attributes,
		...propsToPass
	} = props

	return (
		<Link.Content { ...propsToPass } attributes={ attributes } className={ className }>
			<Icon.Content
				attributes={ attributes }
				hasLinearGradient={ hasLinearGradient }
			/>
			{ props.children }
		</Link.Content>
	)
}

Button.Content.defaultProps = {
	className: '',
	hasLinearGradient: true,
	attributes: {},
}

Button.InspectorControls = Edit

Button.addAttributes = addAttributes

Button.Style = Style
