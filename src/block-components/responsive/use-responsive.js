import classnames from 'classnames'

export const getResponsiveClasses = attributes => {
	return classnames( {
		'stk--hide-desktop': attributes.hideDesktop,
		'stk--hide-tablet': attributes.hideTablet,
		'stk--hide-mobile': attributes.hideMobile,
	} )
}
