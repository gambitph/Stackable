/**
 * Internal dependencies
 */
import { getShapeCSS } from './get-shape-css'

/**
 * External dependencies
 */
import { toNumber } from 'lodash'
import { BlockCss } from '~stackable/components'

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
		selector = '.stk-img-wrapper',
		hoverSelector = '.stk-img-wrapper:hover',
		hoverSelectorCallback = null,
		enableWidth = true,
		enableHeight = true,
		widthStyleRule = null,
		widthUnitCallback = null,
		heightUnitCallback = null,
		dependencies = [],
	} = props
	return (
		<>
			<BlockCss
				{ ...propsToPass }
				selector={ [
					`${ selector }`,
					`${ selector } .stk-img-resizer-wrapper`,
				] }
				renderIn="edit"
				styleRule="aspectRatio"
				attrName="imageAspectRatio"
				key="imageAspectRatio"
				responsive="all"
			/>
			<BlockCss
				{ ...propsToPass }
				selector={ selector }
				renderIn="save"
				styleRule="aspectRatio"
				attrName="imageAspectRatio"
				key="imageAspectRatio"
				responsive="all"
			/>
			<BlockCss
				{ ...propsToPass }
				selector={ `${ selector }:not(.stk--is-resizing)` }
				renderIn="edit"
				styleRule="width"
				attrName="imageWidth"
				key="imageWidth"
				hasUnits="%"
				unitCallback={ widthUnitCallback }
				responsive="all"
				enabledCallback={ () => enableWidth }
			/>
			<BlockCss
				{ ...propsToPass }
				selector={ selector }
				renderIn="save"
				styleRule={ widthStyleRule || 'width' }
				attrName="imageWidth"
				key="imageWidth-save"
				hasUnits="%"
				unitCallback={ widthUnitCallback }
				responsive="all"
				enabledCallback={ () => enableWidth }
			/>
			<BlockCss
				{ ...propsToPass }
				selector={ `${ selector }:not(.stk--is-resizing)` }
				renderIn="edit"
				styleRule="height"
				attrName="imageHeight"
				key="imageHeight"
				hasUnits="px"
				unitCallback={ heightUnitCallback }
				responsive="all"
				enabledCallback={ () => enableHeight }
			/>
			<BlockCss
				{ ...propsToPass }
				selector={ selector }
				renderIn="save"
				styleRule="height"
				attrName="imageHeight"
				key="imageHeight-save"
				hasUnits="px"
				unitCallback={ heightUnitCallback }
				responsive="all"
				enabledCallback={ () => enableHeight }
			/>
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
				key="imageShadow"
				format="drop-shadow(%s)"
				hover="all"
			/>
			<BlockCss
				{ ...propsToPass }
				selector={ selector }
				hoverSelector={ hoverSelector }
				renderIn="save"
				styleRule="filter"
				attrName="imageShadow"
				key="imageShadow-save"
				format="drop-shadow(%s)"
				hover="all"
			/>
			<BlockCss
				{ ...propsToPass }
				selector={ `${ selector } img` }
				hoverSelector={ `${ hoverSelector } img` }
				hoverSelectorCallback={ hoverSelectorCallback }
				styleRule="filter"
				attrName="imageFilter"
				key="imageFilter"
				hover="all"
			/>
			<BlockCss
				{ ...propsToPass }
				selector={ `${ selector } img` }
				hoverSelector={ `${ hoverSelector } img` }
				hoverSelectorCallback={ hoverSelectorCallback }
				styleRule="transform"
				attrName="imageZoom"
				key="imageZoom"
				format="scale(%s)"
				hover="all"
			/>
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
				key="imageBorderRadius"
				format="%spx"
			/>
			<BlockCss
				{ ...propsToPass }
				selector={ `${ selector } img` }
				renderIn="save"
				styleRule="borderRadius"
				attrName="imageBorderRadius"
				key="imageBorderRadius-save"
				format="%spx"
			/>
			<BlockCss
				{ ...propsToPass }
				selector={ `${ selector } img` }
				hoverSelector={ `${ hoverSelector } img` }
				hoverSelectorCallback={ hoverSelectorCallback }
				styleRule="objectPosition"
				attrName="imageFocalPoint"
				key="imageFocalPoint"
				valueCallback={ focalPointToPosition }
				responsive="all"
				hover="all"
			/>
			<BlockCss
				{ ...propsToPass }
				selector={ `${ selector } img` }
				styleRule="objectFit"
				attrName="imageFit"
				key="imageFit"
				responsive="all"
			/>

			{ /** Image shape */ }
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
				key="imageShape"
				responsive="all"
				enabledCallback={ getAttribute => !! getAttribute( 'imageShape' ) }
				valueCallback={ ( value, getAttribute ) => {
					return getShapeCSS( value, getAttribute( 'imageShapeFlipX' ), getAttribute( 'imageShapeFlipY' ), getAttribute( 'imageShapeStretch' ) )
				} }
				dependencies={ [
					'imageShapeFlipX',
					'imageShapeFlipY',
					'imageShapeStretch',
					...dependencies,
				] }
			/>
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
				key="imageShape-save"
				responsive="all"
				enabledCallback={ getAttribute => !! getAttribute( 'imageShape' ) }
				valueCallback={ ( value, getAttribute ) => {
					return getShapeCSS( value, getAttribute( 'imageShapeFlipX' ), getAttribute( 'imageShapeFlipY' ), getAttribute( 'imageShapeStretch' ) )
				} }
				dependencies={ [
					'imageShapeFlipX',
					'imageShapeFlipY',
					'imageShapeStretch',
					...dependencies,
				] }
			/>
			{ /* These 2 components are for the gradient overlay normal states */ }
			<BlockCss
				{ ...propsToPass }
				renderIn="save"
				selector={ `${ selector }::after` }
				hoverSelector={ `${ hoverSelector }::after` }
				hoverSelectorCallback={ hoverSelectorCallback }
				styleRuleCallback={ getAttribute => {
					const colorType = getAttribute( 'imageOverlayColorType' )
					return colorType === 'gradient' ? 'backgroundImage' : 'backgroundColor'
				} }
				attrName="imageOverlayColor"
				key="imageOverlayColor-save"
				hoverCallback={ getAttribute => {
					const colorType = getAttribute( 'imageOverlayColorType' )
					return colorType === 'gradient' ? null : 'all'
				} }
				valueCallback={ ( value, getAttribute ) => {
					const textColorType = getAttribute( 'imageOverlayColorType' )
					const isGradient = value?.startsWith( 'linear-' ) || value?.startsWith( 'radial-' )

					// If the type was switched, adjust the value so that gradient will show up.
					if ( textColorType === 'gradient' && ! isGradient ) {
						return `linear-gradient(${ value } 0%, ${ value } 100%)`
					} else if ( textColorType !== 'gradient' && isGradient ) {
						const color = value.match( /((rgba?|var)\([^\)]+\)|#[\w\d]+)/ )
						if ( color ) {
							return color[ 0 ]
						}
					}
					return value
				} }
				dependencies={ [
					'imageOverlayColorType',
					...dependencies,
				 ] }
			/>
			<BlockCss
				{ ...propsToPass }
				renderIn="edit"
				selector={ `${ selector } .stk-img-resizer-wrapper::after` }
				hoverSelector={ `${ hoverSelector } .stk-img-resizer-wrapper::after` }
				hoverSelectorCallback={ hoverSelectorCallback }
				styleRuleCallback={ getAttribute => {
					const colorType = getAttribute( 'imageOverlayColorType' )
					return colorType === 'gradient' ? 'backgroundImage' : 'backgroundColor'
				} }
				attrName="imageOverlayColor"
				key="imageOverlayColor"
				hoverCallback={ getAttribute => {
					const colorType = getAttribute( 'imageOverlayColorType' )
					return colorType === 'gradient' ? null : 'all'
				} }
				valueCallback={ ( value, getAttribute ) => {
					const textColorType = getAttribute( 'imageOverlayColorType' )
					const isGradient = value?.startsWith( 'linear-' ) || value?.startsWith( 'radial-' )

					// If the type was switched, adjust the value so that gradient will show up.
					if ( textColorType === 'gradient' && ! isGradient ) {
						return `linear-gradient(${ value } 0%, ${ value } 100%)`
					} else if ( textColorType !== 'gradient' && isGradient ) {
						const color = value.match( /((rgba?|var)\([^\)]+\)|#[\w\d]+)/ )
						if ( color ) {
							return color[ 0 ]
						}
					}
					return value
				} }
				dependencies={ [
					'imageOverlayColorType',
					 ...dependencies,
				] }
			/>
			{ /* These 2 components are for the gradient overlay for hover states */ }
			<BlockCss
				{ ...propsToPass }
				renderIn="edit"
				selector={ `${ selector }::after` }
				hoverSelector={ `${ selector }::before` }
				styleRuleCallback={ getAttribute => {
					const colorType = getAttribute( 'imageOverlayColorType' )
					return colorType === 'gradient' ? 'backgroundImage' : 'backgroundColor'
				} }
				attrName="imageOverlayColor"
				key="imageOverlayColor-edit-image"
				hoverCallback={ getAttribute => {
					const colorType = getAttribute( 'imageOverlayColorType' )
					return colorType === 'gradient' ? 'all' : null
				} }
				enabledCallback={ getAttribute => getAttribute( 'imageOverlayColorType' ) === 'gradient' }
				valueCallback={ ( value, getAttribute, device, state ) => {
					if ( state === 'normal' ) {
						return undefined
					}

					const textColorType = getAttribute( 'imageOverlayColorType' )
					const isGradient = value?.startsWith( 'linear-' ) || value?.startsWith( 'radial-' )

					// If the type was switched, adjust the value so that gradient will show up.
					if ( textColorType === 'gradient' && ! isGradient ) {
						return `linear-gradient(${ value } 0%, ${ value } 100%)`
					} else if ( textColorType !== 'gradient' && isGradient ) {
						const color = value.match( /((rgba?|var)\([^\)]+\)|#[\w\d]+)/ )
						if ( color ) {
							return color[ 0 ]
						}
					}
					return value
				} }
				dependencies={ [
					'imageOverlayColorType',
					'imageOverlayOpacity',
					...dependencies,
				] }
			/>
			<BlockCss
				{ ...propsToPass }
				renderIn="save"
				selector={ `${ selector }::after` }
				hoverSelector={ `${ selector }::before` }
				styleRuleCallback={ getAttribute => {
					const colorType = getAttribute( 'imageOverlayColorType' )
					return colorType === 'gradient' ? 'backgroundImage' : 'backgroundColor'
				} }
				attrName="imageOverlayColor"
				key="imageOverlayColor-save-image"
				hoverCallback={ getAttribute => {
					const colorType = getAttribute( 'imageOverlayColorType' )
					return colorType === 'gradient' ? 'all' : null
				} }
				enabledCallback={ getAttribute => getAttribute( 'imageOverlayColorType' ) === 'gradient' }
				valueCallback={ ( value, getAttribute, device, state ) => {
					if ( state === 'normal' ) {
						return undefined
					}

					const textColorType = getAttribute( 'imageOverlayColorType' )
					const isGradient = value?.startsWith( 'linear-' ) || value?.startsWith( 'radial-' )

					// If the type was switched, adjust the value so that gradient will show up.
					if ( textColorType === 'gradient' && ! isGradient ) {
						return `linear-gradient(${ value } 0%, ${ value } 100%)`
					} else if ( textColorType !== 'gradient' && isGradient ) {
						const color = value.match( /((rgba?|var)\([^\)]+\)|#[\w\d]+)/ )
						if ( color ) {
							return color[ 0 ]
						}
					}
					return value
				} }
				dependencies={ [
					'imageOverlayColorType',
					'imageOverlayOpacity',
					...dependencies,
				] }
			/>
			<BlockCss
				{ ...propsToPass }
				renderIn="save"
				selector={ `${ selector }` }
				hoverSelector={ `${ selector }::before` }
				styleRule="--stk-gradient-overlay"
				attrName="imageOverlayOpacity"
				key="imageOverlayOpacity-save"
				hover="all"
			/>
			<BlockCss
				{ ...propsToPass }
				renderIn="edit"
				selector={ `${ selector } .stk-img-resizer-wrapper` }
				hoverSelector={ `${ selector } .stk-img-resizer-wrapper::before` }
				styleRule="--stk-gradient-overlay"
				attrName="imageOverlayOpacity"
				key="imageOverlayOpacity"
				hover="all"
			/>
			<BlockCss
				{ ...propsToPass }
				renderIn="save"
				selector={ `${ selector }::after, ${ selector }::before` }
				styleRule="mix-blend-mode"
				attrName="imageOverlayBlendMode"
				key="imageOverlayBlendMode-save"
			/>
			<BlockCss
				{ ...propsToPass }
				renderIn="edit"
				selector={ `${ selector } .stk-img-resizer-wrapper::after, ${ selector } .stk-img-resizer-wrapper::before` }
				hoverSelectorCallback={ hoverSelectorCallback }
				styleRule="mix-blend-mode"
				attrName="imageOverlayBlendMode"
				key="imageOverlayBlendMode"
			/>
		</>
	)
}

export const Style = props => {
	return <Styles { ...props } />
}

Style.Content = props => {
	return <Styles { ...props } />
}
