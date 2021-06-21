/**
 * Internal dependencies
 */
import { getShapeCSS } from './get-shape-css'
import { Style as StyleComponent } from '~stackable/components'
import { getStyles, useStyles } from '~stackable/util'

/**
 * External dependencies
 */
import { toNumber } from 'lodash'

/**
 * WordPress dependencies
 */
import { Fragment } from '@wordpress/element'

const focalPointToPosition = ( { x, y } ) => {
	let _x = toNumber( x )
	let _y = toNumber( y )
	_x = isNaN( _x ) ? 50 : _x * 100
	_y = isNaN( _y ) ? 50 : _y * 100
	return `${ _x }% ${ _y }%`
}

const getStyleParams = ( options = {} ) => {
	const {
		selector = '.stk-img-wrapper',
		enableWidth = true,
		enableHeight = true,
	} = options

	return [
		{
			selector,
			styleRule: 'width',
			attrName: 'imageWidth',
			hasUnits: '%',
			responsive: 'all',
			enabledCallback: () => enableWidth,
		},
		{
			selector,
			styleRule: 'height',
			attrName: 'imageHeight',
			responsive: 'all',
			enabledCallback: () => enableHeight,
		},
		{
			selector,
			styleRule: 'boxShadow',
			attrName: 'imageShadow',
			hover: 'all',
		},
		{
			selector: `${ selector } img`,
			styleRule: 'filter',
			attrName: 'imageFilter',
		},
		{
			selector: `${ selector } img`,
			styleRule: 'transform',
			attrName: 'imageZoom',
			format: 'scale(%s)',
			hover: 'all',
		},
		{
			selector: `${ selector } img`,
			styleRule: 'borderRadius',
			attrName: 'imageBorderRadius',
			format: '%spx',
		},
		{
			selector: `${ selector } img`,
			styleRule: 'objectPosition',
			attrName: 'imageFocalPoint',
			valueCallback: focalPointToPosition,
			responsive: 'all',
			hover: 'all',
		},
		{
			selector: `${ selector } img`,
			styleRule: 'objectFit',
			attrName: 'imageFit',
			responsive: 'all',
		},

		// Image Shape
		{
			renderIn: 'edit',
			// This is so that the resizer won't get clipped.
			selector: `${ selector } .stk-img-resizer-wrapper`,
			styleRule: 'mask-image',
			vendorPrefixes: [ '-webkit-' ],
			attrName: 'imageShape',
			responsive: 'all',
			enabledCallback: attributes => !! attributes.imageShape,
			valueCallback: ( value, attributes ) => {
				return getShapeCSS( value, attributes.imageShapeFlipX, attributes.imageShapeFlipY, attributes.imageShapeStretch )
			},
			dependencies: [ 'imageShapeFlipX', 'imageShapeFlipY', 'imageShapeStretch' ],
		},
		{
			renderIn: 'save',
			selector,
			styleRule: 'mask-image',
			vendorPrefixes: [ '-webkit-' ],
			attrName: 'imageShape',
			responsive: 'all',
			enabledCallback: attributes => !! attributes.imageShape,
			valueCallback: ( value, attributes ) => {
				return getShapeCSS( value, attributes.imageShapeFlipX, attributes.imageShapeFlipY, attributes.imageShapeStretch )
			},
			dependencies: [ 'imageShapeFlipX', 'imageShapeFlipY', 'imageShapeStretch' ],
		},
	]
}

export const Style = props => {
	const {
		attributes,
		options = {},
		...propsToPass
	} = props

	const styles = useStyles( attributes, getStyleParams( options ) )

	return (
		<Fragment>
			<StyleComponent
				styles={ styles }
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

	const styles = getStyles( attributes, getStyleParams( options ) )

	return (
		<Fragment>
			<StyleComponent.Content
				styles={ styles }
				versionAdded="3.0.0"
				versionDeprecated=""
				{ ...propsToPass }
			/>
		</Fragment>
	)
}
