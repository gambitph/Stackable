/**
 * Internal dependencies
 */
import { getShapeCSS } from './get-shape-css'

/**
 * External dependencies
 */
import { toNumber } from 'lodash'
import { BlockCss } from '~stackable/components'
import { attributeHasValue, hexToRgba } from '~stackable/util'

const focalPointToPosition = ( { x, y } ) => {
	let _x = toNumber( x )
	let _y = toNumber( y )
	_x = isNaN( _x ) ? 50 : _x * 100
	_y = isNaN( _y ) ? 50 : _y * 100
	return `${ _x }% ${ _y }%`
}

const Styles = props => {
	const propsToPass = {
		...props,
		version: props.version,
		versionAdded: '3.0.0',
		versionDeprecated: '',
	}
	const {
		attributes,
		selector = '.stk-img-wrapper',
		hoverSelector = '.stk-img-wrapper:hover',
		hoverSelectorCallback = null,
		enableWidth = true,
		enableHeight = true,
		widthStyleRule = null,
		widthUnitCallback = null,
		heightUnitCallback = null,
	} = props

	return (
		<>
			{ attributeHasValue( 'imageWidth', attributes, { hasResponsive: true } ) &&
				<BlockCss
					{ ...propsToPass }
					selector={ `${ selector }:not(.stk--is-resizing)` }
					renderIn="edit"
					styleRule="width"
					attrName="imageWidth"
					hasUnits="%"
					unitCallback={ widthUnitCallback }
					responsive="all"
					enabledCallback={ () => enableWidth }
				/>
			}
			{ attributeHasValue( 'imageWidth', attributes, { hasResponsive: true } ) &&
				<BlockCss
					{ ...propsToPass }
					selector={ selector }
					renderIn="save"
					styleRule={ widthStyleRule || 'width' }
					attrName="imageWidth"
					hasUnits="%"
					unitCallback={ widthUnitCallback }
					responsive="all"
					enabledCallback={ () => enableWidth }
				/>
			}
			{ attributeHasValue( 'imageHeight', attributes, { hasResponsive: true } ) &&
				<BlockCss
					{ ...propsToPass }
					selector={ `${ selector }:not(.stk--is-resizing)` }
					renderIn="edit"
					styleRule="height"
					attrName="imageHeight"
					hasUnits="px"
					unitCallback={ heightUnitCallback }
					responsive="all"
					enabledCallback={ () => enableHeight }
				/>
			}
			{ attributeHasValue( 'imageHeight', attributes, { hasResponsive: true } ) &&
				<BlockCss
					{ ...propsToPass }
					selector={ selector }
					renderIn="save"
					styleRule="height"
					attrName="imageHeight"
					hasUnits="px"
					unitCallback={ heightUnitCallback }
					responsive="all"
					enabledCallback={ () => enableHeight }
				/>
			}
			{ attributeHasValue( 'imageShadow', attributes, { hasHover: true } ) &&
				<BlockCss
					{ ...propsToPass }
					/**
					 * `box-shadow` will not work alongside
					 * `mask-image`. Use `drop-shadow` instead.
					 *
					 * @see https://stackoverflow.com/questions/12492006/box-shadow-on-element-with-webkit-mask-image
					 */
					selector={ `${ selector } .stk-img-resizer-wrapper` }
					hoverSelector={ hoverSelector ? `${ hoverSelector } .stk-img-resizer-wrapper` : undefined }
					hoverSelectorCallback={ hoverSelectorCallback }
					renderIn="edit"
					styleRule="filter"
					attrName="imageShadow"
					format="drop-shadow(%s)"
					hover="all"
				/>
			}
			{ attributeHasValue( 'imageShadow', attributes, { hasHover: true } ) &&
				<BlockCss
					{ ...propsToPass }
					selector={ selector }
					hoverSelector={ hoverSelector }
					renderIn="save"
					styleRule="filter"
					attrName="imageShadow"
					format="drop-shadow(%s)"
					hover="all"
				/>
			}
			{ attributeHasValue( 'imageFilter', attributes, { hasHover: true } ) &&
				<BlockCss
					{ ...propsToPass }
					selector={ `${ selector } img` }
					hoverSelector={ `${ hoverSelector } img` }
					hoverSelectorCallback={ hoverSelectorCallback }
					styleRule="filter"
					attrName="imageFilter"
					hover="all"
				/>
			}
			{ attributeHasValue( 'imageZoom', attributes, { hasHover: true } ) &&
				<BlockCss
					{ ...propsToPass }
					selector={ `${ selector } img` }
					hoverSelector={ `${ hoverSelector } img` }
					hoverSelectorCallback={ hoverSelectorCallback }
					styleRule="transform"
					attrName="imageZoom"
					format="scale(%s)"
					hover="all"
				/>
			}
			{ attributeHasValue( 'imageBorderRadius', attributes ) &&
				<BlockCss
					{ ...propsToPass }
					/**
					 * Add the border radius in the actual image since
					 * filter CSS style values (e.g. `brightness`) can sometimes mess up
					 * the border radius of the image. So add the border-radius alongside filters.
					 *
					 * @see https://github.com/gambitph/Stackable/issues/1833
					 */
					selector={ `${ selector } .stk-img-resizer-wrapper img` }
					renderIn="edit"
					styleRule="borderRadius"
					attrName="imageBorderRadius"
					format="%spx"
				/>
			}
			{ attributeHasValue( 'imageBorderRadius', attributes ) &&
				<BlockCss
					{ ...propsToPass }
					selector={ `${ selector } img` }
					renderIn="save"
					styleRule="borderRadius"
					attrName="imageBorderRadius"
					format="%spx"
				/>
			}
			{ attributeHasValue( 'imageFocalPoint', attributes, { hasResponsive: true, hasHover: true } ) &&
				<BlockCss
					{ ...propsToPass }
					selector={ `${ selector } img` }
					hoverSelector={ `${ hoverSelector } img` }
					hoverSelectorCallback={ hoverSelectorCallback }
					styleRule="objectPosition"
					attrName="imageFocalPoint"
					valueCallback={ focalPointToPosition }
					responsive="all"
					hover="all"
				/>
			}
			{ attributeHasValue( 'imageFit', attributes, { hasResponsive: true } ) &&
				<BlockCss
					{ ...propsToPass }
					selector={ `${ selector } img` }
					styleRule="objectFit"
					attrName="imageFit"
					responsive="all"
				/>
			}

			{ /** Image shape */ }
			{ attributeHasValue( 'imageShape', attributes, { hasResponsive: true } ) &&
				<BlockCss
					{ ...propsToPass }
					renderIn="edit"
					// This is so that the resizer won't get clipped.
					selector={ [
						`${ selector } .stk-img-resizer-wrapper img`,
						`${ selector } .stk-img-resizer-wrapper::after`,
						`${ selector } .stk-img-resizer-wrapper::before`,
					] }
					styleRule="mask-image"
					vendorPrefixes={ [ '-webkit-' ] }
					attrName="imageShape"
					responsive="all"
					enabledCallback={ getAttribute => !! getAttribute( 'imageShape' ) }
					valueCallback={ ( value, getAttribute ) => {
						return getShapeCSS( value, getAttribute( 'imageShapeFlipX' ), getAttribute( 'imageShapeFlipY' ), getAttribute( 'imageShapeStretch' ) )
					} }
					dependencies={ [ 'imageShapeFlipX', 'imageShapeFlipY', 'imageShapeStretch' ] }
				/>
			}
			{ attributeHasValue( 'imageShape', attributes, { hasResponsive: true } ) &&
				<BlockCss
					{ ...propsToPass }
					renderIn="save"
					selector={ [
						`${ selector } img`,
						`${ selector }::after`,
						`${ selector }::before`,
					] }
					styleRule="mask-image"
					vendorPrefixes={ [ '-webkit-' ] }
					attrName="imageShape"
					responsive="all"
					enabledCallback={ getAttribute => !! getAttribute( 'imageShape' ) }
					valueCallback={ ( value, getAttribute ) => {
						return getShapeCSS( value, getAttribute( 'imageShapeFlipX' ), getAttribute( 'imageShapeFlipY' ), getAttribute( 'imageShapeStretch' ) )
					} }
					dependencies={ [ 'imageShapeFlipX', 'imageShapeFlipY', 'imageShapeStretch' ] }
				/>
			}
			{ attributeHasValue( 'imageOverlayColor', attributes, { hasHover: true } ) &&
				<BlockCss
					{ ...propsToPass }
					renderIn="save"
					selector={ `${ selector }::after` }
					hoverSelector={ `${ hoverSelector }::after` }
					hoverSelectorCallback={ hoverSelectorCallback }
					styleRule="backgroundColor"
					attrName="imageOverlayColor"
					hover="all"
					enabledCallback={ getAttribute => getAttribute( 'imageOverlayColorType' ) !== 'gradient' }
					dependencies={ [ 'imageOverlayColorType' ] }
				/>
			}
			{ attributeHasValue( 'imageOverlayColor', attributes, { hasHover: true } ) &&
				<BlockCss
					{ ...propsToPass }
					renderIn="edit"
					selector={ `${ selector } .stk-img-resizer-wrapper::after` }
					hoverSelector={ `${ hoverSelector } .stk-img-resizer-wrapper::after` }
					hoverSelectorCallback={ hoverSelectorCallback }
					styleRule="backgroundColor"
					attrName="imageOverlayColor"
					hover="all"
					enabledCallback={ getAttribute => getAttribute( 'imageOverlayColorType' ) !== 'gradient' }
					dependencies={ [ 'imageOverlayColorType' ] }
				/>
			}
			{ attributeHasValue( 'imageOverlayColor', attributes, { hasHover: true } ) &&
				<BlockCss
					{ ...propsToPass }
					renderIn="save"
					selector={ `${ selector }::after` }
					hoverSelector={ `${ selector }::before` }
					styleRule="backgroundImage"
					attrName="imageOverlayColor"
					hover="all"
					enabledCallback={ getAttribute => getAttribute( 'imageOverlayColorType' ) === 'gradient' }
					valuePreCallback={ ( value, getAttribute, device, state ) => {
						if ( state !== 'normal' ) {
							if ( getAttribute( 'imageOverlayColor2', 'desktop', 'normal' ) || getAttribute( 'imageOverlayColor', 'desktop', 'normal' ) ) {
								return '1'
							}
						}
						return value
					} }
					valueCallback={ ( value, getAttribute, device, state ) => {
						// The default color is the same as the other one but transparent. Same so that there won't be a weird transition to transparent.
						let defaultColor1 = getAttribute( 'imageOverlayColor2', 'desktop', state )
						if ( state !== 'normal' && ! defaultColor1 ) { // For hover state, use the default if not set.
							defaultColor1 = getAttribute( 'imageOverlayColor2', 'desktop', 'normal' )
						}
						defaultColor1 = hexToRgba( defaultColor1 || '#ffffff', 0 )

						let defaultColor2 = getAttribute( 'imageOverlayColor', 'desktop', state )
						if ( state !== 'normal' && ! defaultColor2 ) { // For hover state, use the default if not set.
							defaultColor2 = getAttribute( 'imageOverlayColor', 'desktop', 'normal' )
						}
						defaultColor2 = hexToRgba( defaultColor2 || '#ffffff', 0 )

						// Gradient location.
						let color1Location = getAttribute( 'imageOverlayGradientLocation1', 'desktop', state )
						if ( state !== 'normal' && color1Location === '' ) {
							color1Location = getAttribute( 'imageOverlayGradientLocation1', 'desktop', 'normal' )
						}
						color1Location = `${ color1Location || '0' }%`

						let color2Location = getAttribute( 'imageOverlayGradientLocation2', 'desktop', state )
						if ( state !== 'normal' && color2Location === '' ) {
							color2Location = getAttribute( 'imageOverlayGradientLocation2', 'desktop', 'normal' )
						}
						color2Location = `${ color2Location || '100' }%`

						let angle = getAttribute( 'imageOverlayGradientDirection', 'desktop', state )
						// For hover state, use the default if not set.
						if ( state !== 'normal' && angle === '' ) {
							angle = getAttribute( 'imageOverlayGradientDirection', 'desktop', 'normal' )
						}

						if ( angle === '' ) {
							angle = '90'
						}
						angle = `${ angle }deg`

						let color1 = getAttribute( 'imageOverlayColor', 'desktop', state )
						if ( state !== 'normal' && ! color1 ) { // For hover state, use the default if not set.
							color1 = getAttribute( 'imageOverlayColor', 'desktop', 'normal' )
						}
						let color2 = getAttribute( 'imageOverlayColor2', 'desktop', state )
						if ( state !== 'normal' && ! color2 ) { // For hover state, use the default if not set.
							color2 = getAttribute( 'imageOverlayColor2', 'desktop', 'normal' )
						}

						return `linear-gradient(${ angle }, ${ color1 || defaultColor1 } ${ color1Location }, ${ color2 || defaultColor2 } ${ color2Location })`
					} }
					dependencies={ [ 'imageOverlayColorType', 'imageOverlayColor2', 'imageOverlayColor', 'imageOverlayGradientLocation1', 'imageOverlayGradientLocation2', 'imageOverlayGradientDirection', 'imageOverlayOpacity' ] }
				/>
			}
			{ attributeHasValue( 'imageOverlayColor', attributes, { hasHover: true } ) &&
				<BlockCss
					{ ...propsToPass }
					renderIn="edit"
					selector={ `${ selector } .stk-img-resizer-wrapper::after` }
					hoverSelector={ `${ selector } .stk-img-resizer-wrapper::before` }
					hoverSelectorCallback={ hoverSelectorCallback }
					styleRule="backgroundImage"
					attrName="imageOverlayColor"
					hover="all"
					enabledCallback={ getAttribute => getAttribute( 'imageOverlayColorType' ) === 'gradient' }
					valuePreCallback={ ( value, getAttribute, device, state ) => {
						if ( state !== 'normal' ) {
							if ( getAttribute( 'imageOverlayColor2', 'desktop', 'normal' ) || getAttribute( 'imageOverlayColor', 'desktop', 'normal' ) ) {
								return '1'
							}
						}
						return value
					} }
					valueCallback={ ( value, getAttribute, device, state ) => {
						// The default color is the same as the other one but transparent. Same so that there won't be a weird transition to transparent.
						let defaultColor1 = getAttribute( 'imageOverlayColor2', 'desktop', state )
						if ( state !== 'normal' && ! defaultColor1 ) { // For hover state, use the default if not set.
							defaultColor1 = getAttribute( 'imageOverlayColor2', 'desktop', 'normal' )
						}
						defaultColor1 = hexToRgba( defaultColor1 || '#ffffff', 0 )

						let defaultColor2 = getAttribute( 'imageOverlayColor', 'desktop', state )
						if ( state !== 'normal' && ! defaultColor2 ) { // For hover state, use the default if not set.
							defaultColor2 = getAttribute( 'imageOverlayColor', 'desktop', 'normal' )
						}
						defaultColor2 = hexToRgba( defaultColor2 || '#ffffff', 0 )

						// Gradient location.
						let color1Location = getAttribute( 'imageOverlayGradientLocation1', 'desktop', state )
						if ( state !== 'normal' && color1Location === '' ) {
							color1Location = getAttribute( 'imageOverlayGradientLocation1', 'desktop', 'normal' )
						}
						color1Location = `${ color1Location || '0' }%`

						let color2Location = getAttribute( 'imageOverlayGradientLocation2', 'desktop', state )
						if ( state !== 'normal' && color2Location === '' ) {
							color2Location = getAttribute( 'imageOverlayGradientLocation2', 'desktop', 'normal' )
						}
						color2Location = `${ color2Location || '100' }%`

						let angle = getAttribute( 'imageOverlayGradientDirection', 'desktop', state )
						// For hover state, use the default if not set.
						if ( state !== 'normal' && angle === '' ) {
							angle = getAttribute( 'imageOverlayGradientDirection', 'desktop', 'normal' )
						}

						if ( angle === '' ) {
							angle = '90'
						}
						angle = `${ angle }deg`

						let color1 = getAttribute( 'imageOverlayColor', 'desktop', state )
						if ( state !== 'normal' && ! color1 ) { // For hover state, use the default if not set.
							color1 = getAttribute( 'imageOverlayColor', 'desktop', 'normal' )
						}
						let color2 = getAttribute( 'imageOverlayColor2', 'desktop', state )
						if ( state !== 'normal' && ! color2 ) { // For hover state, use the default if not set.
							color2 = getAttribute( 'imageOverlayColor2', 'desktop', 'normal' )
						}

						return `linear-gradient(${ angle }, ${ color1 || defaultColor1 } ${ color1Location }, ${ color2 || defaultColor2 } ${ color2Location })`
					} }
					dependencies={ [ 'imageOverlayColorType', 'imageOverlayColor2', 'imageOverlayColor', 'imageOverlayGradientLocation1', 'imageOverlayGradientLocation2', 'imageOverlayGradientDirection', 'imageOverlayOpacity' ] }
				/>
			}
			{ attributeHasValue( 'imageOverlayOpacity', attributes, { hasHover: true } ) &&
				<BlockCss
					{ ...propsToPass }
					renderIn="save"
					selector={ `${ selector }` }
					hoverSelector={ `${ selector }::before` }
					styleRule="--stk-gradient-overlay"
					attrName="imageOverlayOpacity"
					hover="all"
				/>
			}
			{ attributeHasValue( 'imageOverlayOpacity', attributes, { hasHover: true } ) &&
				<BlockCss
					{ ...propsToPass }
					renderIn="edit"
					selector={ `${ selector } .stk-img-resizer-wrapper` }
					hoverSelector={ `${ selector } .stk-img-resizer-wrapper::before` }
					styleRule="--stk-gradient-overlay"
					attrName="imageOverlayOpacity"
					hover="all"
				/>
			}
			{ attributeHasValue( 'imageOverlayBlendMode', attributes ) &&
				<BlockCss
					{ ...propsToPass }
					renderIn="save"
					selector={ `${ selector }::after, ${ selector }::before` }
					styleRule="mix-blend-mode"
					attrName="imageOverlayBlendMode"
				/>
			}
			{ attributeHasValue( 'imageOverlayBlendMode', attributes ) &&
				<BlockCss
					{ ...propsToPass }
					renderIn="edit"
					selector={ `${ selector } .stk-img-resizer-wrapper::after, ${ selector } .stk-img-resizer-wrapper::before` }
					hoverSelectorCallback={ hoverSelectorCallback }
					styleRule="mix-blend-mode"
					attrName="imageOverlayBlendMode"
				/>
			}

		</>
	)
}

export const Style = props => {
	return <Styles { ...props } />
}

Style.Content = props => {
	return <Styles { ...props } />
}
