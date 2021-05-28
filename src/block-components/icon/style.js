/**
 * External dependencies
 */
import {
	getAttrNameFunction, __getValue,
} from '~stackable/util'
import { compact } from 'lodash'
import { Style as StyleComponent } from '~stackable/components'
/**
 * WordPress dependencies
 */
import { useMemo, Fragment } from '@wordpress/element'

const getIconStyle = ( options = {} ) => {
	const {
		selector,
		wrapperSelector,
		uniqueId,
		iconColorType,
		iconColor1,
		iconColor2,
		iconSize,
		iconSizeTablet,
		iconSizeMobile,
		iconOpacity,
		iconRotation,
		iconPosition,
		iconGap,
	} = options

	const iconStyles = {
		[ selector + ' svg:last-child' ]: {
			opacity: iconOpacity !== '' ? iconOpacity : undefined,
			transform: iconRotation !== '' ? `rotate(${ iconRotation }deg)` : undefined,
			height: iconSize !== '' ? `${ iconSize }px` : undefined,
			width: iconSize !== '' ? `${ iconSize }px` : undefined,
		},
		tablet: {
			[ selector + ' svg:last-child' ]: {
				height: iconSizeTablet !== '' ? `${ iconSizeTablet }px` : undefined,
				width: iconSizeTablet !== '' ? `${ iconSizeTablet }px` : undefined,
			},
		},
		mobile: {
			[ selector + ' svg:last-child' ]: {
				height: iconSizeMobile !== '' ? `${ iconSizeMobile }px` : undefined,
				width: iconSizeMobile !== '' ? `${ iconSizeMobile }px` : undefined,
			},
		},
	}

	if ( wrapperSelector ) {
		iconStyles[ wrapperSelector ] = {
			flexDirection: iconPosition !== '' ? 'row-reverse' : undefined,
			columnGap: iconGap !== '' ? `${ iconGap }px` : undefined,
		}
	}

	if ( iconColorType !== 'gradient' && iconColor1 !== '' ) {
		iconStyles[ `${ selector } svg:last-child, ${ selector } svg:last-child g, ${ selector } svg:last-child path, ${ selector } svg:last-child rect, ${ selector } svg:last-child polygon, ${ selector } svg:last-child ellipse` ] = {
			fill: iconColor1,
		}
	}

	if ( iconColorType === 'gradient' && iconColor1 !== '' && iconColor2 !== '' ) {
		iconStyles[ `${ selector } #${ uniqueId }` ] = {
			[ `--${ uniqueId }-color-1` ]: iconColor1 !== '' ? iconColor1 : undefined,
			[ `--${ uniqueId }-color-2` ]: iconColor2 !== '' ? iconColor2 : undefined,
		}
		iconStyles[ `${ selector } svg:last-child, ${ selector } svg:last-child g, ${ selector } svg:last-child path, ${ selector } svg:last-child rect, ${ selector } svg:last-child polygon, ${ selector } svg:last-child ellipse` ] = {
			fill: `url(#${ uniqueId })`,
		}
	}

	return iconStyles
}

const getShapedIconStyle = ( options = {} ) => {
	const {
		selector,
		shaped,
		shapeColor,
		shapeBorderRadius,
		shapePadding,
		shapeOutline,
		shapeOutlineColor,
		shapeOutlineWidthTop,
		shapeOutlineWidthRight,
		shapeOutlineWidthBottom,
		shapeOutlineWidthLeft,
		shapeOutlineWidthTopTablet,
		shapeOutlineWidthRightTablet,
		shapeOutlineWidthBottomTablet,
		shapeOutlineWidthLeftTablet,
		shapeOutlineWidthTopMobile,
		shapeOutlineWidthRightMobile,
		shapeOutlineWidthBottomMobile,
		shapeOutlineWidthLeftMobile,
	} = options

	const iconStyles = {
		[ selector ]: {},
		tablet: {
			[ selector ]: {},
		},
		mobile: {
			[ selector ]: {},
		},
	}

	if ( shaped ) {
		iconStyles[ selector ] = {
			backgroundColor: shapeColor !== '' ? shapeColor : undefined,
			borderRadius: shapeBorderRadius !== '' ? `${ shapeBorderRadius }%` : undefined,
			padding: shapePadding !== '' ? `${ shapePadding }px` : undefined,
			...( shapeOutline ? {
				borderColor: shapeOutlineColor !== '' ? shapeOutlineColor : undefined,
				borderStyle: shapeOutlineWidthTop !== '' && shapeOutlineWidthRight !== '' && shapeOutlineWidthBottom !== '' && shapeOutlineWidthLeft !== '' ? 'solid' : undefined,
				borderTopWidth: shapeOutlineWidthTop !== '' ? `${ shapeOutlineWidthTop }px` : undefined,
				borderRightWidth: shapeOutlineWidthRight !== '' ? `${ shapeOutlineWidthRight }px` : undefined,
				borderBottomWidth: shapeOutlineWidthBottom !== '' ? `${ shapeOutlineWidthBottom }px` : undefined,
				borderLeftWidth: shapeOutlineWidthLeft !== '' ? `${ shapeOutlineWidthLeft }px` : undefined,
			} : {} ),
		}

		iconStyles.tablet[ selector ] = {
			...( shapeOutline ? {
				borderTopWidth: shapeOutlineWidthTopTablet !== '' ? `${ shapeOutlineWidthTopTablet }px` : undefined,
				borderRightWidth: shapeOutlineWidthRightTablet !== '' ? `${ shapeOutlineWidthRightTablet }px` : undefined,
				borderBottomWidth: shapeOutlineWidthBottomTablet !== '' ? `${ shapeOutlineWidthBottomTablet }px` : undefined,
				borderLeftWidth: shapeOutlineWidthLeftTablet !== '' ? `${ shapeOutlineWidthLeftTablet }px` : undefined,
			} : {} ),
		}

		iconStyles.mobile[ selector ] = {
			...( shapeOutline ? {
				borderTopWidth: shapeOutlineWidthTopMobile !== '' ? `${ shapeOutlineWidthTopMobile }px` : undefined,
				borderRightWidth: shapeOutlineWidthRightMobile !== '' ? `${ shapeOutlineWidthRightMobile }px` : undefined,
				borderBottomWidth: shapeOutlineWidthBottomMobile !== '' ? `${ shapeOutlineWidthBottomMobile }px` : undefined,
				borderLeftWidth: shapeOutlineWidthLeftMobile !== '' ? `${ shapeOutlineWidthLeftMobile }px` : undefined,
			} : {} ),
		}
	}

	return iconStyles
}

const getBackgroundShapeStyle = ( options = {} ) => {
	const {
		backgroundShapeSelector,
		showBackgroundShape,
		backgroundShapeColor,
		backgroundShapeOpacity,
		backgroundShapeSize,
		backgroundShapeOffsetHorizontal,
		backgroundShapeOffsetVertical,
	} = options

	const iconStyles = {}

	if ( showBackgroundShape ) {
		const transform = compact( [
			backgroundShapeSize !== '' ? `scale(${ backgroundShapeSize })` : undefined,
			backgroundShapeOffsetHorizontal !== '' ? `translateX(${ backgroundShapeOffsetHorizontal }px)` : undefined,
			backgroundShapeOffsetVertical !== '' ? `translateY(${ backgroundShapeOffsetVertical }px)` : undefined,
		] ).join( ' ' )

		iconStyles[ backgroundShapeSelector ] = {
			fill: backgroundShapeColor !== '' ? backgroundShapeColor : undefined,
			opacity: backgroundShapeOpacity !== '' ? backgroundShapeOpacity : undefined,
			transform: transform !== '' ? transform : undefined,
		}
	}

	return iconStyles
}

export const Style = props => {
	const {
		attributes,
		options = {},
		...propsToPass
	} = props

	const {
		selector = '',
		attrNameTemplate = '%s',
		wrapperSelector = '',
		backgroundShapeSelector = '.stk--shape-icon',
		normalAttrNameTemplate = '%s',
	} = options

	const getAttrName = getAttrNameFunction( attrNameTemplate )
	const getValue = __getValue( attributes, getAttrName, '' )

	const uniqueId = 'linear-gradient-' + attributes.uniqueId

	const getNormalAttrName = getAttrNameFunction( normalAttrNameTemplate )
	const getNormalValue = __getValue( attributes, getNormalAttrName, '' )

	const iconStyles = useMemo(
		() => getIconStyle( {
			selector,
			wrapperSelector,
			uniqueId,
			iconColorType: getValue( 'iconColorType' ),
			iconColor1: getValue( 'iconColor1' ),
			iconColor2: getValue( 'iconColor2' ),
			iconColorGradientDirection: getValue( 'iconColorGradientDirection' ),
			iconSize: getValue( 'iconSize' ),
			iconSizeTablet: getValue( 'iconSizeTablet' ),
			iconSizeMobile: getValue( 'iconSizeMobile' ),
			iconOpacity: getValue( 'iconOpacity' ),
			iconRotation: getValue( 'iconRotation' ),
			iconPosition: getValue( 'iconPosition' ),
			iconGap: getValue( 'iconGap' ),
		} ),
		[
			selector,
			wrapperSelector,
			uniqueId,
			getValue( 'iconColorType' ),
			getValue( 'iconColor1' ),
			getValue( 'iconColor2' ),
			getValue( 'iconColorGradientDirection' ),
			getValue( 'iconSize' ),
			getValue( 'iconSizeTablet' ),
			getValue( 'iconSizeMobile' ),
			getValue( 'iconOpacity' ),
			getValue( 'iconRotation' ),
			getValue( 'iconPosition' ),
			getValue( 'iconGap' ),
		]
	)

	const shapedIconStyles = useMemo(
		() => getShapedIconStyle( {
			selector,
			shaped: getNormalValue( 'shaped' ),
			shapeColor: getValue( 'shapeColor' ),
			shapeBorderRadius: getValue( 'shapeBorderRadius' ),
			shapePadding: getValue( 'shapePadding' ),

			shapeOutline: getValue( 'shapeOutline' ),
			shapeOutlineColor: getValue( 'shapeOutlineColor' ),
			shapeOutlineWidthTop: getValue( 'shapeOutlineWidthTop' ),
			shapeOutlineWidthRight: getValue( 'shapeOutlineWidthRight' ),
			shapeOutlineWidthBottom: getValue( 'shapeOutlineWidthBottom' ),
			shapeOutlineWidthLeft: getValue( 'shapeOutlineWidthLeft' ),
			shapeOutlineWidthTopTablet: getValue( 'shapeOutlineWidthTopTablet' ),
			shapeOutlineWidthRightTablet: getValue( 'shapeOutlineWidthRightTablet' ),
			shapeOutlineWidthBottomTablet: getValue( 'shapeOutlineWidthBottomTablet' ),
			shapeOutlineWidthLeftTablet: getValue( 'shapeOutlineWidthLeftTablet' ),
			shapeOutlineWidthTopMobile: getValue( 'shapeOutlineWidthTopMobile' ),
			shapeOutlineWidthRightMobile: getValue( 'shapeOutlineWidthRightMobile' ),
			shapeOutlineWidthBottomMobile: getValue( 'shapeOutlineWidthBottomMobile' ),
			shapeOutlineWidthLeftMobile: getValue( 'shapeOutlineWidthLeftMobile' ),
		} ),
		[
			selector,
			getNormalValue( 'shaped' ),
			getValue( 'shapeColor' ),
			getValue( 'shapeBorderRadius' ),
			getValue( 'shapePadding' ),
			getValue( 'shapeOutline' ),
			getValue( 'shapeOutlineColor' ),
			getValue( 'shapeOutlineWidthTop' ),
			getValue( 'shapeOutlineWidthRight' ),
			getValue( 'shapeOutlineWidthBottom' ),
			getValue( 'shapeOutlineWidthLeft' ),
			getValue( 'shapeOutlineWidthTopTablet' ),
			getValue( 'shapeOutlineWidthRightTablet' ),
			getValue( 'shapeOutlineWidthBottomTablet' ),
			getValue( 'shapeOutlineWidthLeftTablet' ),
			getValue( 'shapeOutlineWidthTopMobile' ),
			getValue( 'shapeOutlineWidthRightMobile' ),
			getValue( 'shapeOutlineWidthBottomMobile' ),
			getValue( 'shapeOutlineWidthLeftMobile' ),
		]
	)

	const backgroundShapeStyles = useMemo(
		() => getBackgroundShapeStyle( {
			backgroundShapeSelector,
			showBackgroundShape: getNormalValue( 'showBackgroundShape' ),
			backgroundShapeColor: getValue( 'backgroundShapeColor' ),
			backgroundShapeOpacity: getValue( 'backgroundShapeOpacity' ),
			backgroundShapeSize: getValue( 'backgroundShapeSize' ),
			backgroundShapeOffsetHorizontal: getValue( 'backgroundShapeOffsetHorizontal' ),
			backgroundShapeOffsetVertical: getValue( 'backgroundShapeOffsetVertical' ),
		} ),
		[
			backgroundShapeSelector,
			getNormalValue( 'showBackgroundShape' ),
			getValue( 'backgroundShapeColor' ),
			getValue( 'backgroundShapeOpacity' ),
			getValue( 'backgroundShapeSize' ),
			getValue( 'backgroundShapeOffsetHorizontal' ),
			getValue( 'backgroundShapeOffsetVertical' ),
		]
	)

	return (
		<Fragment>
			<StyleComponent
				styles={ iconStyles }
				versionAdded="3.0.0"
				versionDeprecated=""
				{ ...propsToPass }
			/>
			<StyleComponent
				styles={ shapedIconStyles }
				versionAdded="3.0.0"
				versionDeprecated=""
				{ ...propsToPass }
			/>
			<StyleComponent
				styles={ backgroundShapeStyles }
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

	const {
		selector = '',
		attrNameTemplate = '%s',
		wrapperSelector = '',
		backgroundShapeSelector = '.stk--shape-icon',
		normalAttrNameTemplate = '%s',
	} = options

	const getAttrName = getAttrNameFunction( attrNameTemplate )
	const getValue = __getValue( attributes, getAttrName, '' )

	const uniqueId = 'linear-gradient-' + attributes.uniqueId

	const getNormalAttrName = getAttrNameFunction( normalAttrNameTemplate )
	const getNormalValue = __getValue( attributes, getNormalAttrName, '' )

	const iconStyles = getIconStyle( {
		selector,
		wrapperSelector,
		uniqueId,
		iconColorType: getValue( 'iconColorType' ),
		iconColor1: getValue( 'iconColor1' ),
		iconColor2: getValue( 'iconColor2' ),
		iconColorGradientDirection: getValue( 'iconColorGradientDirection' ),
		iconSize: getValue( 'iconSize' ),
		iconSizeTablet: getValue( 'iconSizeTablet' ),
		iconSizeMobile: getValue( 'iconSizeMobile' ),
		iconOpacity: getValue( 'iconOpacity' ),
		iconRotation: getValue( 'iconRotation' ),
		iconPosition: getValue( 'iconPosition' ),
		iconGap: getValue( 'iconGap' ),
	} )

	const shapedIconStyles = getShapedIconStyle( {
		selector,
		shaped: getNormalValue( 'shaped' ),
		shapeColor: getValue( 'shapeColor' ),
		shapeBorderRadius: getValue( 'shapeBorderRadius' ),
		shapePadding: getValue( 'shapePadding' ),

		shapeOutline: getValue( 'shapeOutline' ),
		shapeOutlineColor: getValue( 'shapeOutlineColor' ),
		shapeOutlineWidthTop: getValue( 'shapeOutlineWidthTop' ),
		shapeOutlineWidthRight: getValue( 'shapeOutlineWidthRight' ),
		shapeOutlineWidthBottom: getValue( 'shapeOutlineWidthBottom' ),
		shapeOutlineWidthLeft: getValue( 'shapeOutlineWidthLeft' ),
		shapeOutlineWidthTopTablet: getValue( 'shapeOutlineWidthTopTablet' ),
		shapeOutlineWidthRightTablet: getValue( 'shapeOutlineWidthRightTablet' ),
		shapeOutlineWidthBottomTablet: getValue( 'shapeOutlineWidthBottomTablet' ),
		shapeOutlineWidthLeftTablet: getValue( 'shapeOutlineWidthLeftTablet' ),
		shapeOutlineWidthTopMobile: getValue( 'shapeOutlineWidthTopMobile' ),
		shapeOutlineWidthRightMobile: getValue( 'shapeOutlineWidthRightMobile' ),
		shapeOutlineWidthBottomMobile: getValue( 'shapeOutlineWidthBottomMobile' ),
		shapeOutlineWidthLeftMobile: getValue( 'shapeOutlineWidthLeftMobile' ),
	} )

	const backgroundShapeStyles = getBackgroundShapeStyle( {
		backgroundShapeSelector,
		showBackgroundShape: getNormalValue( 'showBackgroundShape' ),
		backgroundShapeColor: getValue( 'backgroundShapeColor' ),
		backgroundShapeOpacity: getValue( 'backgroundShapeOpacity' ),
		backgroundShapeSize: getValue( 'backgroundShapeSize' ),
		backgroundShapeOffsetHorizontal: getValue( 'backgroundShapeOffsetHorizontal' ),
		backgroundShapeOffsetVertical: getValue( 'backgroundShapeOffsetVertical' ),
	} )

	return (
		<Fragment>
			<StyleComponent.Content
				styles={ iconStyles }
				versionAdded="3.0.0"
				versionDeprecated=""
				{ ...propsToPass }
			/>
			<StyleComponent.Content
				styles={ shapedIconStyles }
				versionAdded="3.0.0"
				versionDeprecated=""
				{ ...propsToPass }
			/>
			<StyleComponent.Content
				styles={ backgroundShapeStyles }
				versionAdded="3.0.0"
				versionDeprecated=""
				{ ...propsToPass }
			/>
		</Fragment>
	)
}
