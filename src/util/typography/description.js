import { getFontFamilyLabel } from '../font'
import {
	upperFirst, startCase, last,
} from 'lodash'

/**
 * Creates a summary description of what the current font is.
 *
 * @param {Object} styleObject Our font styles
 * @param {string} device The current device to create the typography description for
 * @param {string} separator The separator to use join the style values
 */
export const createTypographyDescription = ( styleObject, device = 'desktop', separator = ', ' ) => {
	const description = []
	if ( styleObject.fontFamily ) {
		description.push( getFontFamilyLabel( styleObject.fontFamily ) )
	}
	if ( styleObject.fontSize ) {
		description.push( `${ styleObject.fontSize }${ styleObject.fontSizeUnit || 'px' }` )
	}

	// Show the correct font size when in tablet or mobile previews.
	if ( device === 'tablet' && styleObject.tabletFontSize ) {
		if ( styleObject.fontSize ) {
			description.pop()
		}
		description.push( `${ styleObject.tabletFontSize }${ styleObject.tabletFontSizeUnit || 'px' }` )
	} else if ( device === 'mobile' && ( styleObject.tabletFontSize || styleObject.mobileFontSize ) ) {
		if ( styleObject.fontSize ) {
			description.pop()
		}
		if ( styleObject.mobileFontSize ) {
			description.push( `${ styleObject.mobileFontSize }${ styleObject.mobileFontSizeUnit || 'px' }` )
		} else {
			description.push( `${ styleObject.tabletFontSize }${ styleObject.tabletFontSizeUnit || 'px' }` )
		}
	}

	if ( styleObject.fontWeight ) {
		description.push( styleObject.fontWeight )
	}
	if ( styleObject.textTransform ) {
		description.push( upperFirst( styleObject.textTransform ) )
	}

	// If a css custom property, get just the name names
	return description.map( value => {
		if ( value.includes( 'var(' ) ) {
			const propName = value.match( /var\(([^\),]*)/ )?.[ 1 ]
			return startCase( last( propName.split( '--' ) ) )
		}
		return value
	} ).join( separator )
}

