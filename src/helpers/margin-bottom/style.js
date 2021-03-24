/**
 * External dependencies
 */
import {
	__getValue,
	appendImportantAll,
} from '~stackable/util'

/**
 * Adds image styles.
 *
 * @param {Object} styles The StyleObject to append to
 * @param {Object} attributes Block attributes
 * @param {Object} options Options
 */
export const addMarginBottomStyles = ( styles, attributes, options = {} ) => {
	const getValue = __getValue( attributes )
	const {
		selector = '',
	} = options

	styles.add( {
		style: {
			[ selector ]: appendImportantAll( {
				marginBottom: getValue( 'blockMarginBottom', '%spx' ),
			} ),
			tablet: {
				[ selector ]: appendImportantAll( {
					marginBottom: getValue( 'blockMarginBottomTablet', '%spx' ),
				} ),
			},
			mobile: {
				[ selector ]: appendImportantAll( {
					marginBottom: getValue( 'blockMarginBottomMobile', '%spx' ),
				} ),
			},
		},
		versionAdded: '3.0.0',
		versionDeprecated: '',
	} )
}
