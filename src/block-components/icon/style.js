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
		wrapperSelector = '',
		backgroundShapeSelector = '.stk--shape-icon',
		hoverSelector = '',
	} = options

	const getSvgSelector = ( getAttribute, _selector = selector, suffixes = [] ) => {
		const svgSelector = `${ _selector } svg${ getAttribute( 'iconColorType' ) === 'gradient' ? ':last-child' : '' }`
		if ( suffixes.length ) {
			return suffixes.map( suffix => svgSelector + suffix )
		}
		return svgSelector
	}

	return [
		// Icon Styles
		{
			selectorCallback: getAttribute => getSvgSelector( getAttribute ),
			styles: {
				height: 'iconSize',
				width: 'iconSize',
			},
			responsive: 'all',
			hover: 'all',
			hoverSelector,
			format: '%spx',
		},
		{
			selectorCallback: getAttribute => getSvgSelector( getAttribute ),
			styleRule: 'opacity',
			attrName: 'iconOpacity',
			hover: 'all',
			hoverSelector,
		},
		{
			selectorCallback: getAttribute => getSvgSelector( getAttribute ),
			styleRule: 'transform',
			attrName: 'iconRotation',
			hover: 'all',
			hoverSelector,
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
			hoverSelector,
			format: `%spx`,
		},
		{
			selectorCallback: getAttribute => getSvgSelector( getAttribute, selector, [ '', ' g', ' path', ' rect', ' polygon', ' ellipse' ] ),
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
			hoverSelectorCallback: getAttribute => getSvgSelector( getAttribute, hoverSelector, [ '', ' g', ' path', ' rect', ' polygon', ' ellipse' ] ),
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
			hoverSelector,
			dependencies: [ 'iconColorType', 'iconColor1', 'iconColor2' ],
		},

		// Shape Styles
		{
			selector,
			styleRule: 'backgroundColor',
			attrName: 'shapeColor',
			enabledCallback: attributes => attributes.shaped,
			hover: 'all',
			hoverSelector,
			dependencies: [ 'shaped' ],
		},
		{
			selector,
			styleRule: 'borderRadius',
			attrName: 'shapeBorderRadius',
			format: `%s%`,
			enabledCallback: attributes => attributes.shaped,
			hover: 'all',
			hoverSelector,
			dependencies: [ 'shaped' ],
		},
		{
			selector,
			styleRule: 'padding',
			attrName: 'shapePadding',
			format: `%spx`,
			enabledCallback: attributes => attributes.shaped,
			hover: 'all',
			hoverSelector,
			dependencies: [ 'shaped' ],
		},
		{
			selector,
			styleRule: 'borderColor',
			attrName: 'shapeOutlineColor',
			valuePreCallback: ( value, getAttribute ) => getAttribute( 'shapeOutline' ) ? value : undefined,
			enabledCallback: attributes => attributes.shaped,
			hover: 'all',
			hoverSelector,
			dependencies: [ 'shapeOutline', 'shaped' ],
		},
		{
			selector,
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
			enabledCallback: attributes => attributes.shaped,
			hover: 'all',
			hoverSelector,
			dependencies: [ 'shaped', 'shapeOutline', 'shapeOutlineWidth' ],
		},
		{
			selector,
			styleRule: 'borderTopWidth',
			attrName: 'shapeOutlineWidth',
			hover: 'all',
			hoverSelector,
			responsive: 'all',
			format: '%spx',
			valuePreCallback: ( value, getAttribute ) => getAttribute( 'shapeOutline' ) ? value?.top : undefined,
			dependencies: [ 'shapeOutline', 'shaped' ],
		},
		{
			selector,
			styleRule: 'borderRightWidth',
			attrName: 'shapeOutlineWidth',
			hover: 'all',
			hoverSelector,
			responsive: 'all',
			format: '%spx',
			valuePreCallback: ( value, getAttribute ) => getAttribute( 'shapeOutline' ) ? value?.right : undefined,
			dependencies: [ 'shapeOutline', 'shaped' ],
		},
		{
			selector,
			styleRule: 'borderBottomWidth',
			attrName: 'shapeOutlineWidth',
			hover: 'all',
			hoverSelector,
			responsive: 'all',
			format: '%spx',
			valuePreCallback: ( value, getAttribute ) => getAttribute( 'shapeOutline' ) ? value?.bottom : undefined,
			dependencies: [ 'shapeOutline', 'shaped' ],
		},
		{
			selector,
			styleRule: 'borderLeftWidth',
			attrName: 'shapeOutlineWidth',
			hover: 'all',
			hoverSelector,
			responsive: 'all',
			format: '%spx',
			valuePreCallback: ( value, getAttribute ) => getAttribute( 'shapeOutline' ) ? value?.left : undefined,
			dependencies: [ 'shapeOutline', 'shaped' ],
		},

		// Background Shape Styles
		{
			selector: backgroundShapeSelector,
			styleRule: 'fill',
			attrName: 'backgroundShapeColor',
			hover: 'all',
			hoverSelector,
			enabledCallback: attributes => attributes.showBackgroundShape,
			dependencies: [ 'showBackgroundShape' ],
		},
		{
			selector: backgroundShapeSelector,
			styleRule: 'opacity',
			attrName: 'backgroundShapeOpacity',
			hover: 'all',
			hoverSelector,
			enabledCallback: attributes => attributes.showBackgroundShape,
			dependencies: [ 'showBackgroundShape' ],
		},
		{
			selector: backgroundShapeSelector,
			styleRule: 'transform',
			hover: 'all',
			hoverSelector,
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
