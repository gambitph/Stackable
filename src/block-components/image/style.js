/**
 * Internal dependencies
 */
import { getShapeCSS } from './get-shape-css'

/**
 * External dependencies
 */
import { toNumber } from 'lodash'
import { Style as StyleComponent } from '~stackable/components'
import { getStyles, useStyles } from '~stackable/util'

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
		hoverSelector = '.stk-img-wrapper:hover',
		hoverSelectorCallback = null,
		enableWidth = true,
		enableHeight = true,
	} = options

	return [
		{
			selector: `${ selector }:not(.stk--is-resizing)`,
			renderIn: 'edit',
			styleRule: 'width',
			attrName: 'imageWidth',
			hasUnits: '%',
			responsive: 'all',
			enabledCallback: () => enableWidth,
		},
		{
			selector,
			renderIn: 'save',
			styleRule: 'width',
			attrName: 'imageWidth',
			hasUnits: '%',
			responsive: 'all',
			enabledCallback: () => enableWidth,
		},
		{
			selector: `${ selector }:not(.stk--is-resizing)`,
			renderIn: 'edit',
			styleRule: 'height',
			attrName: 'imageHeight',
			hasUnits: 'px',
			responsive: 'all',
			enabledCallback: () => enableHeight,
		},
		{
			selector,
			renderIn: 'save',
			styleRule: 'height',
			attrName: 'imageHeight',
			hasUnits: 'px',
			responsive: 'all',
			enabledCallback: () => enableHeight,
		},
		/**
		 * `box-shadow` will not work alongside
		 * `mask-image`. Use `drop-shadow` instead.
		 *
		 * @see https://stackoverflow.com/questions/12492006/box-shadow-on-element-with-webkit-mask-image
		 */
		{
			selector: `${ selector } .stk-img-resizer-wrapper`,
			hoverSelector: hoverSelector ? `${ hoverSelector } .stk-img-resizer-wrapper` : undefined,
			hoverSelectorCallback,
			renderIn: 'edit',
			styleRule: 'filter',
			attrName: 'imageShadow',
			format: 'drop-shadow(%s)',
			hover: 'all',
		},
		{
			selector,
			hoverSelector,
			renderIn: 'save',
			styleRule: 'filter',
			attrName: 'imageShadow',
			format: 'drop-shadow(%s)',
			hover: 'all',
		},
		{
			selector: `${ selector } img`,
			hoverSelector: `${ hoverSelector } img`,
			hoverSelectorCallback,
			styleRule: 'filter',
			attrName: 'imageFilter',
			hover: 'all',
		},
		{
			selector: `${ selector } img`,
			hoverSelector: `${ hoverSelector } img`,
			hoverSelectorCallback,
			styleRule: 'transform',
			attrName: 'imageZoom',
			format: 'scale(%s)',
			hover: 'all',
		},
		/**
		 * Add the border radius in the actual image since
		 * filter CSS style values (e.g. `brightness`) can sometimes mess up
		 * the border radius of the image. So add the border-radius alongside filters.
		 *
		 * @see https://github.com/gambitph/Stackable/issues/1833
		 */
		{
			selector: `${ selector } .stk-img-resizer-wrapper img`,
			renderIn: 'edit',
			styleRule: 'borderRadius',
			attrName: 'imageBorderRadius',
			format: '%spx',
		},
		{
			selector: `${ selector } img`,
			renderIn: 'save',
			styleRule: 'borderRadius',
			attrName: 'imageBorderRadius',
			format: '%spx',
		},
		{
			selector: `${ selector } img`,
			hoverSelector: `${ hoverSelector } img`,
			hoverSelectorCallback,
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
			selector: [
				`${ selector } .stk-img-resizer-wrapper img`,
				`${ selector } .stk-img-resizer-wrapper::after`,
			],
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
			selector: [
				`${ selector } img`,
				`${ selector }::after`,
			],
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
			selector: `${ selector }::after`,
			hoverSelector: `${ hoverSelector }::after`,
			hoverSelectorCallback,
			styleRule: 'backgroundColor',
			attrName: 'imageOverlayColor',
			hover: 'all',
		},
		{
			renderIn: 'edit',
			selector: `${ selector } .stk-img-resizer-wrapper::after`,
			hoverSelector: `${ hoverSelector } .stk-img-resizer-wrapper::after`,
			hoverSelectorCallback,
			styleRule: 'backgroundColor',
			attrName: 'imageOverlayColor',
			hover: 'all',
		},
		{
			renderIn: 'save',
			selector: `${ selector }::after`,
			styleRule: 'opacity',
			attrName: 'imageOverlayOpacity',
			hover: 'all',
		},
		{
			renderIn: 'edit',
			selector: `${ selector } .stk-img-resizer-wrapper::after`,
			hoverSelector: `${ hoverSelector } .stk-img-resizer-wrapper::after`,
			hoverSelectorCallback,
			styleRule: 'opacity',
			attrName: 'imageOverlayOpacity',
			hover: 'all',
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
