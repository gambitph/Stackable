/**
 * External dependencies
 */
import classnames from 'classnames'
import { useBlockAttributes } from '~stackable/hooks'

/**
 * Internal dependencies
 */
import { addAttributes } from './attributes'
import { Style } from './style'
import { Edit } from './edit'
import { Link } from '../link'
import { Icon } from '../icon'
import { getButtonClasses } from './get-button-classes'

/**
 * WordPress dependencies
 */
import { useBlockEditContext } from '@wordpress/block-editor'

export { getButtonClasses }

export const Button = props => {
	const {
		className,
		buttonProps,
		linkTrigger,
	} = props

	const { clientId } = useBlockEditContext()
	const attributes = useBlockAttributes( clientId )

	return (
		<Link
			className={ classnames( [ className, getButtonClasses( attributes ) ] ) }
			linkProps={ buttonProps }
			linkTrigger={ linkTrigger }
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
			className={ classnames( [ className, getButtonClasses( attributes ) ] ) }
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
