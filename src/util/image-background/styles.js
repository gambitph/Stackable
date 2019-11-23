/**
 * External dependencies
 */
import { camelCase } from 'lodash'
import { appendImportant, __getValue } from '~stackable/util'

/**
 * WordPress dependencies
 */
import { sprintf } from '@wordpress/i18n'

const createImageBackgroundStyles = ( attrNameTemplate = '%s', screen = 'desktop', blockAttributes = {} ) => {
	const getAttrName = attrName => camelCase( sprintf( attrNameTemplate, attrName ) )
	const getValue = __getValue( blockAttributes, getAttrName )

	if ( screen !== 'tablet' && screen !== 'mobile' ) { // Desktop.
		return {
			backgroundImage: getValue( 'Url', 'url(%s)' ),
			backgroundPosition: appendImportant( getValue( 'BackgroundPosition' ) ),
			backgroundRepeat: appendImportant( getValue( 'BackgroundRepeat' ) ),
			backgroundSize: appendImportant(
				getValue( 'BackgroundSize' ) !== 'custom' ? getValue( 'BackgroundSize' ) :
					getValue( 'BackgroundCustomSize' ) ? getValue( 'BackgroundCustomSize' ) + getValue( 'BackgroundCustomSizeUnit', '%s', 'px' ) :
						undefined
			),
		}
	} else if ( screen === 'tablet' ) { // Tablet.
		return {}
	}
	// Mobile.
	return {}
}

export default createImageBackgroundStyles

export const createImageBackgroundStyleSet = ( attrNameTemplate = '%s', mainClassName = '', blockAttributes = {}, options = {} ) => {
	return {
		[ `.${ mainClassName }` ]: {
			...createImageBackgroundStyles( attrNameTemplate, 'desktop', blockAttributes, options ),
		},
		tablet: {
			[ `.${ mainClassName }` ]: {
				...createImageBackgroundStyles( attrNameTemplate, 'tablet', blockAttributes, options ),
			},
		},
		mobile: {
			[ `.${ mainClassName }` ]: {
				...createImageBackgroundStyles( attrNameTemplate, 'mobile', blockAttributes, options ),
			},
		},
	}
}
