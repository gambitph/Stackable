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
		selector = '',
		uniqueId = '',
		hoverSelector = '',
	} = options

	const getSvgSelector = ( getAttribute, _selector = selector, suffixes = [] ) => {
		const svgSelector = `${ _selector } .stk--inner-svg svg:last-child`
		if ( suffixes.length ) {
			return suffixes.map( suffix => svgSelector + suffix )
		}
		return svgSelector
	}

	const shapeSelector = `${ selector } .stk--inner-svg`
	const shapeHoverSelector = `${ selector }:hover .stk--inner-svg`

	const backgroundShapeSelector = `${ selector } .stk--shape-icon`
	const backgroundShapeHoverSelector = `${ selector }:hover .stk--shape-icon`

	return [
		// Icon Styles
		{
			selectorCallback: getAttribute => getSvgSelector( getAttribute ),
			hoverSelectorCallback: getAttribute => getSvgSelector( getAttribute, hoverSelector ),
			styles: {
				height: 'iconSize',
				width: 'iconSize',
			},
			responsive: 'all',
			hover: 'all',
			format: '%spx',
		},
		{
			selectorCallback: getAttribute => getSvgSelector( getAttribute ),
			hoverSelectorCallback: getAttribute => getSvgSelector( getAttribute, hoverSelector ),
			styleRule: 'opacity',
			attrName: 'iconOpacity',
			hover: 'all',
		},
		{
			selectorCallback: getAttribute => getSvgSelector( getAttribute ),
			hoverSelectorCallback: getAttribute => getSvgSelector( getAttribute, hoverSelector ),
			styleRule: 'transform',
			attrName: 'iconRotation',
			hover: 'all',
			format: 'rotate(%sdeg)',
		},
		{
			selector,
			styleRule: 'flexDirection',
			attrName: 'iconPosition',
			valuePreCallback: value => value !== '' ? 'row-reverse' : undefined,
		},
		{
			selector,
			styleRule: 'columnGap',
			attrName: 'iconGap',
			hoverSelector,
			format: `%spx`,
		},
		{
			selectorCallback: getAttribute => getSvgSelector( getAttribute, selector, [ '', ' g', ' path', ' rect', ' polygon', ' ellipse' ] ),
			hoverSelectorCallback: getAttribute => getSvgSelector( getAttribute, hoverSelector, [ '', ' g', ' path', ' rect', ' polygon', ' ellipse' ] ),
			styleRule: 'fill',
			attrName: 'iconColor1',
			valuePreCallback: ( value, getAttribute, device, state ) => {
				if ( getAttribute( 'iconColorType' ) === 'gradient' && getAttribute( 'iconColor1', 'desktop', state ) && getAttribute( 'iconColor2', 'desktop', state ) ) {
					return `url(#${ uniqueId })`
				}
				return value
			},
			dependencies: [ 'iconColorType', 'iconColor1', 'iconColor2' ],
			hover: 'all',
		},
		{
			selector: `${ selector } #${ uniqueId }`,
			styleRule: 'transform',
			format: 'rotate(%sdeg)',
			attrName: 'iconColorGradientDirection',
			hover: 'all',
			hoverSelector: `${ selector }:hover #${ uniqueId }`,
		},
		{
			selector: `${ selector } #${ uniqueId }`,
			styles: {
				[ `--${ uniqueId }-color-1` ]: 'iconColor1',
				[ `--${ uniqueId }-color-2` ]: 'iconColor2',
			},
			valuePreCallback: ( value, getAttribute, device, state ) => {
				if ( getAttribute( 'iconColorType' ) !== 'gradient' ||
					! getAttribute( 'iconColor1', 'desktop', state ) ||
					! getAttribute( 'iconColor2', 'desktop', state )
				) {
					return undefined
				}
				return value
			},
			hover: 'all',
			hoverSelector: `${ selector }:hover #${ uniqueId }`,
			dependencies: [ 'iconColorType', 'iconColor1', 'iconColor2' ],
		},

		// Shape Styles
		{
			selector: shapeSelector,
			hoverSelector: shapeHoverSelector,
			styleRule: 'backgroundColor',
			attrName: 'shapeColor',
			enabledCallback: getAttribute => getAttribute( 'shaped' ),
			hover: 'all',
			dependencies: [ 'shaped' ],
		},
		{
			selector: shapeSelector,
			hoverSelector: shapeHoverSelector,
			styleRule: 'borderRadius',
			attrName: 'shapeBorderRadius',
			format: `%s%`,
			enabledCallback: getAttribute => getAttribute( 'shaped' ),
			hover: 'all',
			dependencies: [ 'shaped' ],
		},
		{
			selector: shapeSelector,
			hoverSelector: shapeHoverSelector,
			styleRule: 'padding',
			attrName: 'shapePadding',
			format: `%spx`,
			enabledCallback: getAttribute => getAttribute( 'shaped' ),
			hover: 'all',
			dependencies: [ 'shaped' ],
		},
		{
			selector: shapeSelector,
			hoverSelector: shapeHoverSelector,
			styleRule: 'borderColor',
			attrName: 'shapeOutlineColor',
			valuePreCallback: ( value, getAttribute ) => getAttribute( 'shapeOutline' ) ? value : undefined,
			enabledCallback: getAttribute => getAttribute( 'shaped' ),
			hover: 'all',
			dependencies: [ 'shapeOutline', 'shaped' ],
		},
		{
			selector: shapeSelector,
			hoverSelector: shapeHoverSelector,
			styleRule: 'borderStyle',
			attrName: 'borderStyle',
			valuePreCallback: ( value, getAttribute, device, state ) => {
				if (
					! getAttribute( 'shapeOutlineWidth', 'desktop', state )?.top ||
					! getAttribute( 'shapeOutlineWidth', 'desktop', state )?.right ||
					! getAttribute( 'shapeOutlineWidth', 'desktop', state )?.bottom ||
					! getAttribute( 'shapeOutlineWidth', 'desktop', state )?.left ||
					! getAttribute( 'shapeOutline' )
				) {
					return undefined
				}

				return 'solid'
			},
			enabledCallback: getAttribute => getAttribute( 'shaped' ),
			hover: 'all',
			dependencies: [ 'shaped', 'shapeOutline', 'shapeOutlineWidth' ],
		},
		{
			selector: shapeSelector,
			hoverSelector: shapeHoverSelector,
			styleRule: 'borderTopWidth',
			attrName: 'shapeOutlineWidth',
			hover: 'all',
			responsive: 'all',
			format: '%spx',
			valuePreCallback: ( value, getAttribute ) => getAttribute( 'shapeOutline' ) ? value?.top : undefined,
			dependencies: [ 'shapeOutline', 'shaped' ],
		},
		{
			selector: shapeSelector,
			hoverSelector: shapeHoverSelector,
			styleRule: 'borderRightWidth',
			attrName: 'shapeOutlineWidth',
			hover: 'all',
			responsive: 'all',
			format: '%spx',
			valuePreCallback: ( value, getAttribute ) => getAttribute( 'shapeOutline' ) ? value?.right : undefined,
			dependencies: [ 'shapeOutline', 'shaped' ],
		},
		{
			selector: shapeSelector,
			hoverSelector: shapeHoverSelector,
			styleRule: 'borderBottomWidth',
			attrName: 'shapeOutlineWidth',
			hover: 'all',
			responsive: 'all',
			format: '%spx',
			valuePreCallback: ( value, getAttribute ) => getAttribute( 'shapeOutline' ) ? value?.bottom : undefined,
			dependencies: [ 'shapeOutline', 'shaped' ],
		},
		{
			selector: shapeSelector,
			hoverSelector: shapeHoverSelector,
			styleRule: 'borderLeftWidth',
			attrName: 'shapeOutlineWidth',
			hover: 'all',
			responsive: 'all',
			format: '%spx',
			valuePreCallback: ( value, getAttribute ) => getAttribute( 'shapeOutline' ) ? value?.left : undefined,
			dependencies: [ 'shapeOutline', 'shaped' ],
		},

		// Background Shape Styles
		{
			selector: backgroundShapeSelector,
			hoverSelector: backgroundShapeHoverSelector,
			styleRule: 'fill',
			attrName: 'backgroundShapeColor',
			hover: 'all',
			enabledCallback: getAttribute => getAttribute( 'showBackgroundShape' ),
			dependencies: [ 'showBackgroundShape' ],
		},
		{
			selector: backgroundShapeSelector,
			hoverSelector: backgroundShapeHoverSelector,
			styleRule: 'opacity',
			attrName: 'backgroundShapeOpacity',
			hover: 'all',
			enabledCallback: getAttribute => getAttribute( 'showBackgroundShape' ),
			dependencies: [ 'showBackgroundShape' ],
		},
		{
			selector: backgroundShapeSelector,
			hoverSelector: backgroundShapeHoverSelector,
			styleRule: 'transform',
			hover: 'all',
			valuePreCallback: ( value, getAttribute, device, state ) => {
				const backgroundShapeSize = getAttribute( 'backgroundShapeSize', 'desktop', state )
				const backgroundShapeOffsetHorizontal = getAttribute( 'backgroundShapeOffsetHorizontal', 'desktop', state )
				const backgroundShapeOffsetVertical = getAttribute( 'backgroundShapeOffsetVertical', 'desktop', state )

				const transform = compact( [
					'translateX(-50%)',
					'translateY(-50%)',
					backgroundShapeSize !== '' ? `scale(${ backgroundShapeSize })` : undefined,
					backgroundShapeOffsetHorizontal !== '' ? `translateX(${ backgroundShapeOffsetHorizontal }px)` : undefined,
					backgroundShapeOffsetVertical !== '' ? `translateY(${ backgroundShapeOffsetVertical }px)` : undefined,
				] ).join( ' ' )

				return transform
			},
			dependencies: [ 'showBackgroundShape', 'backgroundShapeSize', 'backgroundShapeOffsetVertical', 'backgroundShapeOffsetHorizontal' ],
			enabledCallback: getAttribute => getAttribute( 'showBackgroundShape' ),
		},
	]
}

export const Style = props => {
	const {
		attributes,
		options = {},
		...propsToPass
	} = props

	const uniqueId = 'linear-gradient-' + attributes.uniqueId

	const styles = useStyles( attributes, getStyleParams( { ...options, uniqueId } ) )

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

	const uniqueId = 'linear-gradient-' + attributes.uniqueId

	const styles = getStyles( attributes, getStyleParams( { ...options, uniqueId } ) )

	return (
		<StyleComponent.Content
			styles={ styles }
			versionAdded="3.0.0"
			versionDeprecated=""
			{ ...propsToPass }
		/>
	)
}
