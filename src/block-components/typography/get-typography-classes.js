/**
 * External dependencies
 */
import classnames from 'classnames'
import { getAttributeName } from '~stackable/util'

export const getTypographyClasses = ( attributes = {} ) => {
	return classnames( {
		'stk--is-gradient': attributes[ getAttributeName( 'textColorType', 'desktop', 'normal' ) ] === 'gradient',
	} )
}
