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
export const addImageStyles = ( styles, blockProps, options = {} ) => {
	const getValue = __getValue( blockProps.attributes )
	const {
		selector = '.stk-img-wrapper',
		enableWidth = true,
		enableHeight = true,
	} = options

	styles.add( {
		style: {
			// Only save styles since styles in edit are already in the Component.
			saveOnly: {
				[ selector ]: appendImportantAll( {
					width: enableWidth ? getValue( 'imageWidth', `%s${ getValue( 'imageWidthUnit', '%s', '%' ) }` ) : undefined,
					height: enableHeight ? getValue( 'imageHeight', `%s${ getValue( 'imageHeightUnit', '%s', 'px' ) }` ) : undefined,
				} ),
				tablet: {
					[ selector ]: appendImportantAll( {
						width: enableWidth ? getValue( 'imageWidthTablet', `%s${ getValue( 'imageWidthUnitTablet', '%s', '%' ) }` ) : undefined,
						height: enableHeight ? getValue( 'imageHeightTablet', `%s${ getValue( 'imageHeightUnitTablet', '%s', 'px' ) }` ) : undefined,
					} ),
				},
				mobile: {
					[ selector ]: appendImportantAll( {
						width: enableWidth ? getValue( 'imageWidthMobile', `%s${ getValue( 'imageWidthUnitMobile', '%s', '%' ) }` ) : undefined,
						height: enableHeight ? getValue( 'imageHeightMobile', `%s${ getValue( 'imageHeightUnitMobile', '%s', 'px' ) }` ) : undefined,
					} ),
				},
			},
		},
		versionAdded: '3.0.0',
		versionDeprecated: '',
	} )
}
