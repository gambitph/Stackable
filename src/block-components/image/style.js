/**
 * External dependencies
 */
import { toNumber } from 'lodash'
import {
	__getValue,
	appendImportantAll,
} from '~stackable/util'
import { getShapeCSS } from './get-shape-css'
import { Style as StyleComponent } from '~stackable/components'
import { Fragment, useMemo } from '@wordpress/element'

const focalPointToPosition = ( { x, y } ) => {
	let _x = toNumber( x )
	let _y = toNumber( y )
	_x = isNaN( _x ) ? 50 : _x * 100
	_y = isNaN( _y ) ? 50 : _y * 100
	return `${ _x }% ${ _y }%`
}

export const getStyles1 = ( attributes, options = {} ) => {
	const getValue = __getValue( attributes )
	const {
		selector = '.stk-img-wrapper',
		enableWidth = true,
		enableHeight = true,
	} = options

	return {
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
	}
}

export const getStyles2 = ( attributes, options = {} ) => {
	const getValue = __getValue( attributes )
	const {
		selector = '.stk-img-wrapper',
	} = options

	return {
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
	}
}

export const getStyles3 = ( attributes, options = {} ) => {
	const getValue = __getValue( attributes )
	const {
		selector = '.stk-img-wrapper',
	} = options

	if ( ! getValue( 'imageShape' ) ) {
		return {}
	}

	return {
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
	}
}

export const Style = props => {
	const {
		attributes,
		options = {},
		...propsToPass
	} = props

	const getValue = __getValue( attributes )

	const styles1 = useMemo(
		() => getStyles1( attributes, options ),
		[
			options.selector,
			options.enableWidth,
			options.enableHeight,
			getValue( 'imageWidth' ),
			getValue( 'imageWidthUnit' ),
			getValue( 'imageHeight' ),
			getValue( 'imageHeightUnit' ),

			getValue( 'imageWidthTablet' ),
			getValue( 'imageWidthUnitTablet' ),
			getValue( 'imageHeightTablet' ),
			getValue( 'imageHeightUnitTablet' ),

			getValue( 'imageWidthMobile' ),
			getValue( 'imageWidthUnitMobile' ),
			getValue( 'imageHeightMobile' ),
			getValue( 'imageHeightUnitMobile' ),
			attributes.uniqueId,
		]
	)

	const styles2 = useMemo(
		() => getStyles2( attributes, options ),
		[
			options.selector,
			getValue( 'imageShadow' ),
			getValue( 'imageFilter' ),
			getValue( 'imageZoom' ),
			getValue( 'imageBorderRadius' ),

			getValue( 'imageFocalPoint' ),
			getValue( 'imageFit' ),
			getValue( 'imageFocalPointTablet' ),
			getValue( 'imageFitTablet' ),
			getValue( 'imageFocalPointMobile' ),
			getValue( 'imageFitMobile' ),
			attributes.uniqueId,
		]
	)

	const styles3 = useMemo(
		() => getStyles3( attributes, options ),
		[
			options.selector,
			getValue( 'imageShape' ),
			getValue( 'imageShapeFlipX' ),
			getValue( 'imageShapeFlipY' ),
			getValue( 'imageShapeStretch' ),
			attributes.uniqueId,
		]
	)

	return (
		<Fragment>
			<StyleComponent
				styles={ styles1 }
				versionAdded="3.0.0"
				versionDeprecated=""
				{ ...propsToPass }
			/>
			<StyleComponent
				styles={ styles2 }
				versionAdded="3.0.0"
				versionDeprecated=""
				{ ...propsToPass }
			/>
			<StyleComponent
				styles={ styles3 }
				versionAdded="3.0.0"
				versionDeprecated=""
				{ ...propsToPass }
			/>
		</Fragment>
	)
}

Style.Content = props => {
	const {
		attributes,
		options = {},
		...propsToPass
	} = props

	const styles1 = getStyles1( attributes, options )
	const styles2 = getStyles2( attributes, options )
	const styles3 = getStyles3( attributes, options )

	return (
		<Fragment>
			<StyleComponent.Content
				styles={ styles1 }
				versionAdded="3.0.0"
				versionDeprecated=""
				{ ...propsToPass }
			/>
			<StyleComponent.Content
				styles={ styles2 }
				versionAdded="3.0.0"
				versionDeprecated=""
				{ ...propsToPass }
			/>
			<StyleComponent.Content
				styles={ styles3 }
				versionAdded="3.0.0"
				versionDeprecated=""
				{ ...propsToPass }
			/>
		</Fragment>
	)
}
