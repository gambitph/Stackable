/**
 * External dependencies
 */
import compareVersions from 'compare-versions'
import deepmerge from 'deepmerge'

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

	getMerged( version = '' ) {
		return deepmerge.all( this.getStyles( version ) )
	}
}

export default StyleObject
