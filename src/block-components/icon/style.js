/**
 * External dependencies
 */
import {
	useStyles, getStyles,
} from '~stackable/util'
import { compact } from 'lodash'
import { Style as StyleComponent } from '~stackable/components'

const getStyleParams = ( options = {} ) => {
	const {
		selector,
		wrapperSelector,
		uniqueId,
		backgroundShapeSelector,
	} = options

	return [
		// Icon Styles
		{
			selector: `${ selector } svg:last-child`,
			styles: {
				height: 'iconSize',
				width: 'iconSize',
			},
			responsive: 'all',
			hover: 'all',
			format: '%spx',
		},
		{
			selector: `${ selector } svg:last-child`,
			styleRule: 'opacity',
			attrName: 'iconOpacity',
			hover: 'all',
		},
		{
			selector: `${ selector } svg:last-child`,
			styleRule: 'transform',
			attrName: 'iconRotation',
			hover: 'all',
			format: 'rotate(%sdeg)',
		},
		{
			selector: wrapperSelector,
			styleRule: 'flexDirection',
			attrName: 'iconPosition',
			valuePreCallback: value => value !== '' ? 'row-reverse' : undefined,
		},
		{
			selector: wrapperSelector,
			styleRule: 'columnGap',
			attrName: 'iconGap',
			hover: 'all',
			format: `%spx`,
		},
		{
			selector: [
				`${ selector } svg:last-child`,
				`${ selector } svg:last-child g`,
				`${ selector } svg:last-child path`,
				`${ selector } svg:last-child rect`,
				`${ selector } svg:last-child polygon`,
				`${ selector } svg:last-child ellipse`,
			],
			styleRule: 'fill',
			attrName: 'iconColor1',
			valuePreCallback: ( value, getAttribute, device, state ) => {
				if ( getAttribute( 'iconColorType', 'desktop', state ) === 'gradient' && getAttribute( 'iconColor1', 'desktop', state ) && getAttribute( 'iconColor2', 'desktop', state ) ) {
					return `url(#${ uniqueId })`
				}
				return value
			},
			dependencies: [ 'iconColorType', 'iconColor1', 'iconColor2' ],
			hover: 'all',
		},
		{
			selector: `${ selector } #${ uniqueId }`,
			styles: {
				[ `--${ uniqueId }-color-1` ]: 'iconColor1',
				[ `--${ uniqueId }-color-2` ]: 'iconColor2',
			},
			valuePreCallback: ( value, getAttribute, device, state ) => {
				if ( getAttribute( 'iconColorType', 'desktop', state ) !== 'gradient' ||
					! getAttribute( 'iconColor1', 'desktop', state ) ||
					! getAttribute( 'iconColor2', 'desktop', state )
				) {
					return undefined
				}
				return value
			},
			hover: 'all',
			dependencies: [ 'iconColorType', 'iconColor1', 'iconColor2' ],
		},

		// Shape Styles
		{
			selector,
			styleRule: 'backgroundColor',
			attrName: 'shapeColor',
			enabledCallback: attributes => attributes.shaped,
			hover: 'all',
			dependencies: [ 'shaped' ],
		},
		{
			selector,
			styleRule: 'borderRadius',
			attrName: 'shapeBorderRadius',
			format: `%s%`,
			enabledCallback: attributes => attributes.shaped,
			hover: 'all',
			dependencies: [ 'shaped' ],
		},
		{
			selector,
			styleRule: 'padding',
			attrName: 'shapePadding',
			format: `%spx`,
			enabledCallback: attributes => attributes.shaped,
			hover: 'all',
			dependencies: [ 'shaped' ],
		},
		{
			selector,
			styleRule: 'borderColor',
			attrName: 'shapeOutlineColor',
			valuePreCallback: ( value, getAttribute, device, state ) => getAttribute( 'shapeOutline', 'desktop', state ) ? value : undefined,
			enabledCallback: attributes => attributes.shaped,
			hover: 'all',
			dependencies: [ 'shapeOutline', 'shaped' ],
		},
		{
			selector,
			styleRule: 'borderStyle',
			attrName: 'borderStyle',
			valuePreCallback: ( value, getAttribute, device, state ) => {
				if (
					! getAttribute( 'shapeOutlineWidthTop', 'desktop', state ) ||
					! getAttribute( 'shapeOutlineWidthRight', 'desktop', state ) ||
					! getAttribute( 'shapeOutlineWidthBottom', 'desktop', state ) ||
					! getAttribute( 'shapeOutlineWidthLeft', 'desktop', state ) ||
					! getAttribute( 'shapeOutline', 'desktop', state )
				) {
					return undefined
				}

				return 'solid'
			},
			enabledCallback: attributes => attributes.shaped,
			hover: 'all',
			dependencies: [ 'shaped', 'shapeOutline', 'shapeOutlineWidthTop', 'shapeOutlineWidthRight', 'shapeOutlineWidthBottom', 'shapeOutlineWidthLeft' ],
		},
		{
			selector,
			styles: {
				borderTopWidth: 'shapeOutlineWidthTop',
				borderRightWidth: 'shapeOutlineWidthRight',
				borderBottomWidth: 'shapeOutlineWidthBottom',
				borderLeftWidth: 'shapeOutlineWidthLeft',
			},
			enabledCallback: attributes => attributes.shaped,
			valuePreCallback: ( value, getAttribute, device, state ) => getAttribute( 'shapeOutline', 'desktop', state ) ? value : undefined,
			hover: 'all',
			responsive: 'all',
			format: '%spx',
			dependencies: [ 'shapeOutline', 'shaped' ],
		},

		// Background Shape Styles
		{
			selector: backgroundShapeSelector,
			styleRule: 'fill',
			attrName: 'backgroundShapeColor',
			hover: 'all',
			enabledCallback: attributes => attributes.showBackgroundShape,
			dependencies: [ 'showBackgroundShape' ],
		},
		{
			selector: backgroundShapeSelector,
			styleRule: 'opacity',
			attrName: 'backgroundShapeOpacity',
			hover: 'all',
			enabledCallback: attributes => attributes.showBackgroundShape,
			dependencies: [ 'showBackgroundShape' ],
		},
		{
			selector: backgroundShapeSelector,
			styleRule: 'transform',
			hover: 'all',
			valuePreCallback: ( value, getAttribute, device, state ) => {
				const backgroundShapeSize = getAttribute( 'backgroundShapeSize', 'desktop', state )
				const backgroundShapeOffsetHorizontal = getAttribute( 'backgroundShapeOffsetHorizontal', 'desktop', state )
				const backgroundShapeOffsetVertical = getAttribute( 'backgroundShapeOffsetVertical', 'desktop', state )

				const transform = compact( [
					backgroundShapeSize !== '' ? `scale(${ backgroundShapeSize })` : undefined,
					backgroundShapeOffsetHorizontal !== '' ? `translateX(${ backgroundShapeOffsetHorizontal }px)` : undefined,
					backgroundShapeOffsetVertical !== '' ? `translateY(${ backgroundShapeOffsetVertical }px)` : undefined,
				] ).join( ' ' )

				return transform
			},
			dependencies: [ 'showBackgroundShape', 'backgroundShapeSize', 'backgroundShapeOffsetVertical', 'backgroundShapeOffsetHorizontal' ],
			enabledCallback: attributes => attributes.showBackgroundShape,
		},
	]
}

export const Style = props => {
	const {
		attributes,
		options = {},
		...propsToPass
	} = props

	const {
		selector = '',
		wrapperSelector = '',
		backgroundShapeSelector = '.stk--shape-icon',
	} = options

	const uniqueId = 'linear-gradient-' + attributes.uniqueId

	const styles = useStyles( attributes, getStyleParams( {
		selector, wrapperSelector, uniqueId, backgroundShapeSelector,
	} ) )

	return (
		<StyleComponent
			styles={ styles }
			versionAdded="3.0.0"
			versionDeprecated=""
			{ ...propsToPass }
		/>
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
		wrapperSelector = '',
		backgroundShapeSelector = '.stk--shape-icon',
	} = options

	const uniqueId = 'linear-gradient-' + attributes.uniqueId

	const styles = getStyles( attributes, getStyleParams( {
		selector, wrapperSelector, uniqueId, backgroundShapeSelector,
	} ) )

	return (
		<StyleComponent.Content
			styles={ styles }
			versionAdded="3.0.0"
			versionDeprecated=""
			{ ...propsToPass }
		/>
	)
}
