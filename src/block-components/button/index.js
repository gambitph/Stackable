/**
 * External dependencies
 */
import classnames from 'classnames'
import { useBlockAttributesContext } from '~stackable/hooks'

/**
 * Internal dependencies
 */
import { addAttributes } from './attributes'
import { addStyles } from './style'
import { Edit } from './edit'
import { Link } from '../link'
import { Icon } from '../icon'
import { getButtonClasses } from './get-button-classes'
import { getPropsWithDefaults } from '../../util/props'

export { getButtonClasses }
export { deprecateButtonGradientColor } from './deprecated'

export const Button = incomingProps => {
	const props = getPropsWithDefaults( incomingProps, BUTTON_DEFAULT_PROPS )
	const {
		className,
		buttonProps,
		linkTrigger,
	} = props

	const attributes = useBlockAttributesContext( attributes => {
		return {
			buttonHoverEffect: attributes.buttonHoverEffect,
			iconPosition: attributes.iconPosition,
		}
	} )

	return (
		<Link
			className={ classnames( [ className, getButtonClasses( attributes ) ] ) }
			linkProps={ buttonProps }
			linkTrigger={ linkTrigger }
		>
			{ attributes.iconPosition === 'right' && props.children }
			<Icon hasLinearGradient={ false } />
			{ attributes.iconPosition !== 'right' && props.children }
		</Link>
	)
}

const BUTTON_DEFAULT_PROPS = {
	className: '',
	buttonProps: {},
}

Button.Content = incomingProps => {
	const props = getPropsWithDefaults( incomingProps, BUTTON_CONTENT_DEFAULT_PROPS )
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
			{ attributes.iconPosition === 'right' && props.children }
			<Icon.Content
				attributes={ attributes }
				hasLinearGradient={ false }
			/>
			{ attributes.iconPosition !== 'right' && props.children }
		</Link.Content>
	)
}

const BUTTON_CONTENT_DEFAULT_PROPS = {
	className: '',
	buttonProps: {},
}

Button.InspectorControls = Edit

Button.addAttributes = addAttributes

Button.addStyles = addStyles
