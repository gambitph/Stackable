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
	const shapeHoverSelector = `${ hoverSelector } .stk--inner-svg`

	const backgroundShapeSelector = `${ selector } .stk--shape-icon`
	const backgroundShapeHoverSelector = `${ hoverSelector } .stk--shape-icon`

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
			valuePreCallback: value => value ? 'row-reverse' : undefined,
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
					return `url(#linear-gradient-${ getAttribute( 'uniqueId' ) })`
				}
				return value
			},
			dependencies: [ 'iconColorType', 'iconColor1', 'iconColor2', 'uniqueId' ],
			hover: 'all',
		},
		{
			selectorCallback: getAttribute => `${ selector } #linear-gradient-${ getAttribute( 'uniqueId' ) }`,
			styleRule: 'transform',
			format: 'rotate(%sdeg)',
			attrName: 'iconColorGradientDirection',
			hoverSelectorCallback: getAttribute => `${ selector }:hover #linear-gradient-${ getAttribute( 'uniqueId' ) }`,
		},
		{
			selectorCallback: getAttribute => `${ selector } #linear-gradient-${ getAttribute( 'uniqueId' ) }`,
			styleRuleCallback: getAttribute => `--linear-gradient-${ getAttribute( 'uniqueId' ) }-color-1`,
			attrName: 'iconColor1',
			valuePreCallback: ( value, getAttribute, device, state ) => {
				if ( getAttribute( 'iconColorType' ) !== 'gradient' ||
					! getAttribute( 'iconColor1', 'desktop', state ) ||
					! getAttribute( 'iconColor2', 'desktop', state )
				) {
					return undefined
				}
				return value
			},
			hoverSelectorCallback: getAttribute => `${ selector }:hover #linear-gradient-${ getAttribute( 'uniqueId' ) }`,
			dependencies: [ 'iconColorType', 'iconColor1', 'iconColor2' ],
		},
		{
			selectorCallback: getAttribute => `${ selector } #linear-gradient-${ getAttribute( 'uniqueId' ) }`,
			styleRuleCallback: getAttribute => `--linear-gradient-${ getAttribute( 'uniqueId' ) }-color-2`,
			attrName: 'iconColor2',
			valuePreCallback: ( value, getAttribute, device, state ) => {
				if ( getAttribute( 'iconColorType' ) !== 'gradient' ||
					! getAttribute( 'iconColor1', 'desktop', state ) ||
					! getAttribute( 'iconColor2', 'desktop', state )
				) {
					return undefined
				}
				return value
			},
			hoverSelectorCallback: getAttribute => `${ selector }:hover #linear-gradient-${ getAttribute( 'uniqueId' ) }`,
			dependencies: [ 'iconColorType', 'iconColor1', 'iconColor2' ],
		},

		// Shape Styles
		{
			selector: shapeSelector,
			hoverSelector: shapeHoverSelector,
			styleRule: 'backgroundColor',
			attrName: 'shapeColor',
			hover: 'all',
		},
		{
			selector: shapeSelector,
			hoverSelector: shapeHoverSelector,
			styleRule: 'borderRadius',
			attrName: 'shapeBorderRadius',
			format: `%s%`,
			hover: 'all',
		},
		{
			selector: shapeSelector,
			hoverSelector: shapeHoverSelector,
			styleRule: 'padding',
			attrName: 'shapePadding',
			format: `%spx`,
		},
		{
			selector: shapeSelector,
			hoverSelector: shapeHoverSelector,
			styleRule: 'borderColor',
			attrName: 'shapeOutlineColor',
			hover: 'all',
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
					! getAttribute( 'shapeOutlineWidth', 'desktop', state )?.left
				) {
					return undefined
				}

				return 'solid'
			},
			hover: 'all',
			dependencies: [ 'shapeOutlineWidth' ],
		},
		{
			selector: shapeSelector,
			hoverSelector: shapeHoverSelector,
			styleRule: 'borderTopWidth',
			attrName: 'shapeOutlineWidth',
			responsive: 'all',
			format: '%spx',
			valuePreCallback: value => value?.top,
		},
		{
			selector: shapeSelector,
			hoverSelector: shapeHoverSelector,
			styleRule: 'borderRightWidth',
			attrName: 'shapeOutlineWidth',
			responsive: 'all',
			format: '%spx',
			valuePreCallback: value => value?.right,
		},
		{
			selector: shapeSelector,
			hoverSelector: shapeHoverSelector,
			styleRule: 'borderBottomWidth',
			attrName: 'shapeOutlineWidth',
			responsive: 'all',
			format: '%spx',
			valuePreCallback: value => value?.bottom,
		},
		{
			selector: shapeSelector,
			hoverSelector: shapeHoverSelector,
			styleRule: 'borderLeftWidth',
			attrName: 'shapeOutlineWidth',
			responsive: 'all',
			format: '%spx',
			valuePreCallback: value => value?.left,
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
			valuePreCallback: ( value, getAttribute, device, state ) => {
				const backgroundShapeSize = getAttribute( 'backgroundShapeSize', 'desktop', state )
				const backgroundShapeOffsetHorizontal = getAttribute( 'backgroundShapeOffsetHorizontal', 'desktop', state )
				const backgroundShapeOffsetVertical = getAttribute( 'backgroundShapeOffsetVertical', 'desktop', state )

				const transform = compact( [
					backgroundShapeSize !== '' ? `scale(${ backgroundShapeSize })` : undefined,
					backgroundShapeOffsetHorizontal !== '' ? `translateX(${ backgroundShapeOffsetHorizontal }px)` : undefined,
					backgroundShapeOffsetVertical !== '' ? `translateY(${ backgroundShapeOffsetVertical }px)` : undefined,
				] )

				return transform.length ? [
					'translateX(-50%)',
					'translateY(-50%)',
					...transform,
				].join( ' ' ) : ''
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

	const styles = useStyles( attributes, getStyleParams( options ) )

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

	const styles = getStyles( attributes, getStyleParams( options ) )

	return (
		<StyleComponent.Content
			styles={ styles }
			versionAdded="3.0.0"
			versionDeprecated=""
			{ ...propsToPass }
		/>
	)
}
