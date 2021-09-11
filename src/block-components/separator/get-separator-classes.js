/**
 * External dependencies
 */
import classnames from 'classnames'

export const getSeparatorClasses = attributes => {
	return classnames( {
		'stk-has-top-separator': attributes.topSeparatorShow,
		'stk-has-bottom-separator': attributes.bottomSeparatorShow,
	} )
}
