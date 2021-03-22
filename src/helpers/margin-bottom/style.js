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
 * @param {Object} blockProps Block props
 * @param {Object} options Options
 */
export const addMarginBottomStyles = ( styles, blockProps, options = {} ) => {
	const getValue = __getValue( blockProps.attributes )
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
