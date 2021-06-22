/**
 * External dependencies
 */
import classnames from 'classnames'
import { getAttributeName } from '~stackable/util'

export const getTypographyClasses = ( attributes = {} ) => {
	const textClasses = classnames( {
		'stk--is-gradient': attributes[ getAttributeName( 'textColorType', 'desktop', 'normal' ) ] === 'gradient',
		'stk--hover-gradient': attributes[ getAttributeName( 'textColorType', 'desktop', 'hover' ) ] === 'gradient',
	} )

	return [ 'stk--gradient-wrapper', textClasses ]
}
