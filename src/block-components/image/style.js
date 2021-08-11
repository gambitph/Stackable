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
		hoverSelector,
		enableWidth = true,
		enableHeight = true,
	} = options

	return [
		{
			selector: `${ selector }:not(.stk--is-resizing)`,
			hoverSelector: hoverSelector ? `${ hoverSelector }:not(.stk--is-resizing)` : undefined,
			renderIn: 'edit',
			styleRule: 'width',
			attrName: 'imageWidth',
			hasUnits: '%',
			responsive: 'all',
			enabledCallback: () => enableWidth,
		},
		{
			selector,
			hoverSelector,
			renderIn: 'save',
			styleRule: 'width',
			attrName: 'imageWidth',
			hasUnits: '%',
			responsive: 'all',
			enabledCallback: () => enableWidth,
		},
		{
			selector: `${ selector }:not(.stk--is-resizing)`,
			hoverSelector: hoverSelector ? `${ hoverSelector }:not(.stk--is-resizing)` : undefined,
			renderIn: 'edit',
			styleRule: 'height',
			attrName: 'imageHeight',
			hasUnits: 'px',
			responsive: 'all',
			enabledCallback: () => enableHeight,
		},
		{
			selector,
			hoverSelector,
			renderIn: 'save',
			styleRule: 'height',
			attrName: 'imageHeight',
			hasUnits: 'px',
			responsive: 'all',
			enabledCallback: () => enableHeight,
		},
		{
			selector: `${ selector } .stk-img-resizer-wrapper`,
			hoverSelector: hoverSelector ? `${ hoverSelector } .stk-img-resizer-wrapper` : undefined,
			renderIn: 'edit',
			styleRule: 'boxShadow',
			attrName: 'imageShadow',
			hover: 'all',
		},
		{
			selector,
			hoverSelector,
			renderIn: 'save',
			styleRule: 'boxShadow',
			attrName: 'imageShadow',
			hover: 'all',
		},
		{
			selector: `${ selector } img`,
			hoverSelector: `${ hoverSelector } img`,
			styleRule: 'filter',
			attrName: 'imageFilter',
			hover: 'all',
		},
		{
			selector: `${ selector } img`,
			hoverSelector: `${ hoverSelector } img`,
			styleRule: 'transform',
			attrName: 'imageZoom',
			format: 'scale(%s)',
			hover: 'all',
		},
		{
			selector: `${ selector } .stk-img-resizer-wrapper`,
			hoverSelector: hoverSelector ? `${ hoverSelector } .stk-img-resizer-wrapper` : undefined,
			renderIn: 'edit',
			styleRule: 'borderRadius',
			attrName: 'imageBorderRadius',
			format: '%spx',
		},
		{
			selector,
			hoverSelector,
			renderIn: 'save',
			styleRule: 'borderRadius',
			attrName: 'imageBorderRadius',
			format: '%spx',
		},
		{
			selector: `${ selector } img`,
			hoverSelector: `${ hoverSelector } img`,
			styleRule: 'objectPosition',
			attrName: 'imageFocalPoint',
			valueCallback: focalPointToPosition,
			responsive: 'all',
			hover: 'all',
		},
		{
			selector: `${ selector } img`,
			hoverSelector: `${ hoverSelector } img`,
			styleRule: 'objectFit',
			attrName: 'imageFit',
			responsive: 'all',
		},

		// Image Shape
		{
			renderIn: 'edit',
			// This is so that the resizer won't get clipped.
			selector: `${ selector } .stk-img-resizer-wrapper`,
			hoverSelector: hoverSelector ? `${ hoverSelector } .stk-img-resizer-wrapper` : undefined,
			styleRule: 'mask-image',
			vendorPrefixes: [ '-webkit-' ],
			attrName: 'imageShape',
			responsive: 'all',
			enabledCallback: getAttribute => !! getAttribute( 'imageShape' ),
			valueCallback: ( value, getAttribute ) => {
				return getShapeCSS( value, getAttribute( 'imageShapeFlipX' ), getAttribute( 'imageShapeFlipY' ), getAttribute( 'imageShapeStretch' ) )
			},
			dependencies: [ 'imageShapeFlipX', 'imageShapeFlipY', 'imageShapeStretch' ],
		},
		{
			renderIn: 'save',
			selector,
			hoverSelector,
			styleRule: 'mask-image',
			vendorPrefixes: [ '-webkit-' ],
			attrName: 'imageShape',
			responsive: 'all',
			enabledCallback: getAttribute => !! getAttribute( 'imageShape' ),
			valueCallback: ( value, getAttribute ) => {
				return getShapeCSS( value, getAttribute( 'imageShapeFlipX' ), getAttribute( 'imageShapeFlipY' ), getAttribute( 'imageShapeStretch' ) )
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
