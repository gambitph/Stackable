/**
 * External dependencies
 */
import classnames from 'classnames'
import { getAttrNameFunction } from '~stackable/util'

export const getTypographyClasses = ( attributes = {}, attrNameTemplate = '%s' ) => {
	const getAttributeName = getAttrNameFunction( attrNameTemplate )
	return classnames( {
		'stk--is-gradient': attributes[ getAttributeName( 'textColorType' ) ] === 'gradient',
		[ `has-text-align-${ attributes[ getAttributeName( 'textAlign' ) ] }` ]: attributes[ getAttributeName( 'textAlign' ) ],
	} )
}
