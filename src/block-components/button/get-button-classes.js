/**
 * External dependencies
 */
import classnames from 'classnames'

export const getButtonClasses = attributes => {
	return classnames( 'stk-button', {
		[ `stk--hover-effect-${ attributes.buttonHoverEffect }` ]: attributes.buttonHoverEffect,
	} )
}
