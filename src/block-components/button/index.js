/**
 * External dependencies
 */
import classnames from 'classnames'

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
		buttonProps,
	} = props

	return (
		<Link
			className={ classnames( [ className, 'stk-button' ] ) }
			linkProps={ buttonProps }
		>
			<Icon hasLinearGradient={ false } />
			{ props.children }
		</Link>
	)
}

Button.defaultProps = {
	className: '',
	buttonProps: {},
}

Button.Content = props => {
	const {
		className,
		attributes,
		buttonProps,
	} = props

	return (
		<Link.Content
			linkProps={ buttonProps }
			attributes={ attributes }
			className={ classnames( [ className, 'stk-button' ] ) }
		>
			<Icon.Content
				attributes={ attributes }
				hasLinearGradient={ false }
			/>
			{ props.children }
		</Link.Content>
	)
}

Button.Content.defaultProps = {
	className: '',
	buttonProps: {},
}

Button.InspectorControls = Edit

Button.addAttributes = addAttributes

Button.Style = Style
