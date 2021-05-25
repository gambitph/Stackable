/**
 * External dependencies
 */
import classnames from 'classnames'
import { __getValue, getAttrNameFunction } from '~stackable/util'

export const getTypographyClasses = ( attributes = {}, options = {} ) => {
	const {
		attrNameTemplate = '%s',
		hoverAttrNameTemplate,
	} = options

	const getAttrName = getAttrNameFunction( attrNameTemplate )
	const getValue = __getValue( attributes, getAttrName, '' )

	let textClasses = classnames( {
		'stk--is-gradient': getValue( 'textColorType' ) === 'gradient',
	} )

	if ( hoverAttrNameTemplate ) {
		const getHoverAttrName = getAttrNameFunction( hoverAttrNameTemplate )
		const getHoverValue = __getValue( attributes, getHoverAttrName, '' )
		textClasses = classnames( textClasses, {
			'stk--hover-gradient': getHoverValue( 'textColorType' ) === 'gradient',
		} )
	}

	return [ 'stk--gradient-wrapper', textClasses ]
}
