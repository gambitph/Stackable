/**
 * Internal dependencies
 */
import { appendImportant } from '.'

/**
 * External dependencies
 */
import compareVersions from 'compare-versions'
import deepmerge from 'deepmerge'

export const doImportant = ( styleObject, important = true ) => {
	if ( typeof styleObject !== 'object' ) {
		return appendImportant( styleObject, important )
	}

	return Object.keys( styleObject ).reduce( ( newStyleObject, key ) => {
		return {
			...newStyleObject,
			[ key ]: doImportant( styleObject[ key ], important ),
		}
	}, {} )
}

export const mergeStyles = ( styles, important = true ) => {
	const _styles = deepmerge.all( styles )
	return important ? doImportant( _styles ) : _styles
}

/**
 * Style object, this manages the generation of styles.
 */
class StyleObject {
	constructor( styles = [] ) {
	  this.styles = styles
	}

	// Add a style object.
	add( {
		style, versionAdded, versionDeprecated,
	} ) {
	  this.styles.push( {
			styleObject: style,
			versionAdded: versionAdded || '',
			versionDeprecated: versionDeprecated || false,
		} )
	}

	getStyles( version = '' ) {
		return this.styles
			.filter( ( { versionAdded, versionDeprecated } ) => {
				// If no version was given, just get everything that's not yet deprecated.
				if ( ! version ) {
					return !! versionDeprecated
				}

				// If given, get styles which...
				return compareVersions( version, versionAdded ) >= 0 && // Were introduced on the same version.
					( ! versionDeprecated || compareVersions( version, versionDeprecated ) === -1 ) // Are not yet deprecated.
			} )
			.map( ( { styleObject } ) => styleObject ) // Get the styles only.
	}

	getMerged( version = '', important = true ) {
		return mergeStyles( this.getStyles( version ), important )
	}
}

export default StyleObject
