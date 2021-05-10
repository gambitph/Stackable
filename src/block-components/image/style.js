/**
 * External dependencies
 */
import { toNumber } from 'lodash'
import {
	__getValue,
	appendImportantAll,
} from '~stackable/util'
import { getShapeCSS } from './get-shape-css'

const focalPointToPosition = ( { x, y } ) => {
	let _x = toNumber( x )
	let _y = toNumber( y )
	_x = isNaN( _x ) ? 50 : _x * 100
	_y = isNaN( _y ) ? 50 : _y * 100
	return `${ _x }% ${ _y }%`
}

/**
 * Adds image styles.
 *
 * @param {Object} styles The StyleObject to append to
 * @param {Object} attributes Block attributes
 * @param {Object} options Options
 */
export const addStyles = ( styles, attributes, options = {} ) => {
	const getValue = __getValue( attributes )
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

	styles.add( {
		style: {
			[ selector ]: appendImportantAll( {
				boxShadow: getValue( 'imageShadow' ),
			} ),
			[ `${ selector } img` ]: appendImportantAll( {
				filter: getValue( 'imageFilter' ),
				transform: getValue( 'imageZoom', 'scale(%s)' ),
				borderRadius: getValue( 'imageBorderRadius', `%spx` ),
				objectPosition: getValue( 'imageFocalPoint' ) ? focalPointToPosition( getValue( 'imageFocalPoint' ) ) : undefined,
				objectFit: getValue( 'imageFit' ),
			} ),
			tablet: {
				[ `${ selector } img` ]: appendImportantAll( {
					objectPosition: getValue( 'imageFocalPointTablet' ) ? focalPointToPosition( getValue( 'imageFocalPointTablet' ) ) : undefined,
					objectFit: getValue( 'imageFitTablet' ),
				} ),
			},
			mobile: {
				[ `${ selector } img` ]: appendImportantAll( {
					objectPosition: getValue( 'imageFocalPointMobile' ) ? focalPointToPosition( getValue( 'imageFocalPointMobile' ) ) : undefined,
					objectFit: getValue( 'imageFitMobile' ),
				} ),
			},
		},
		versionAdded: '3.0.0',
		versionDeprecated: '',
	} )

	if ( getValue( 'imageShape' ) ) {
		styles.add( {
			style: {
				editor: {
					// This is so that the resizer won't get clipped.
					[ `${ selector } .stk-img-resizer-wrapper` ]: appendImportantAll( {
						...getShapeCSS( getValue( 'imageShape' ), getValue( 'imageShapeFlipX' ), getValue( 'imageShapeFlipY' ), getValue( 'imageShapeStretch' ) ),
					} ),
				},
				saveOnly: {
					[ selector ]: appendImportantAll( {
						...getShapeCSS( getValue( 'imageShape' ), getValue( 'imageShapeFlipX' ), getValue( 'imageShapeFlipY' ), getValue( 'imageShapeStretch' ) ),
					} ),
				},
			},
			versionAdded: '3.0.0',
			versionDeprecated: '',
		} )
	}
}
