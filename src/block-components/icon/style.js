/**
 * WordPress dependencies
 */
import { doAction } from '@wordpress/hooks'

export const addStyles = ( blockStyleGenerator, props = {} ) => {
	const propsToPass = {
		...props,
		version: props.version,
		versionAdded: '3.0.0',
		versionDeprecated: '',
	}
	const {
		hasIconGap = true,
		selector = '',
		hoverSelector = '',
		dependencies = [],
	} = props

	const getSvgSelector = ( getAttribute, _selector = selector, suffixes = [], fallback = selector ) => {
		const svgSelector = `${ _selector || fallback } .stk--inner-svg svg:last-child`
		if ( suffixes.length ) {
			return [
				svgSelector,
				svgSelector + ` :is(${ suffixes.join( ',' ) })`,
			]
		}
		return svgSelector
	}

	const getSvgHoverSelector = ( getAttribute, _selector = selector, suffixes = [] ) => getSvgSelector( getAttribute, _selector, suffixes, selector + ':hover' )

	const shapeSelector = `${ selector } .stk--inner-svg`
	const shapeHoverSelector = `${ hoverSelector } .stk--inner-svg`

	{ /* Icon Styles */ }
	blockStyleGenerator.addBlockStyles( 'iconSize', [ {
		...propsToPass,
		selectorCallback: getAttribute => getSvgSelector( getAttribute ),
		hoverSelectorCallback: getAttribute => getSvgHoverSelector( getAttribute, hoverSelector ),
		styleRule: 'height',
		attrName: 'iconSize',
		key: 'iconSize',
		responsive: 'all',
		format: '%spx',
	} ] )

	blockStyleGenerator.addBlockStyles( 'iconSize', [ {
		...propsToPass,
		selectorCallback: getAttribute => getSvgSelector( getAttribute ),
		hoverSelectorCallback: getAttribute => getSvgHoverSelector( getAttribute, hoverSelector ),
		styleRule: 'width',
		attrName: 'iconSize',
		key: 'iconSize-width',
		responsive: 'all',
		format: '%spx',
	} ] )

	blockStyleGenerator.addBlockStyles( 'iconOpacity', [ {
		...propsToPass,
		selectorCallback: getAttribute => getSvgSelector( getAttribute ),
		hoverSelectorCallback: getAttribute => getSvgHoverSelector( getAttribute, hoverSelector ),
		styleRule: 'opacity',
		attrName: 'iconOpacity',
		key: 'iconOpacity',
		hover: 'all',
	} ] )

	blockStyleGenerator.addBlockStyles( 'iconRotation', [ {
		...propsToPass,
		selectorCallback: getAttribute => getSvgSelector( getAttribute ),
		hoverSelectorCallback: getAttribute => getSvgHoverSelector( getAttribute, hoverSelector ),
		styleRule: 'transform',
		attrName: 'iconRotation',
		key: 'iconRotation',
		hover: 'all',
		format: 'rotate(%sdeg)',
	} ] )

	if ( hasIconGap ) {
		blockStyleGenerator.addBlockStyles( 'iconGap', [ {
			...propsToPass,
			selectorCallback: getAttribute => getSvgSelector( getAttribute ),
			hoverSelectorCallback: getAttribute => getSvgSelector( getAttribute, hoverSelector ),
			styleRuleCallback: getAttribute => getAttribute( 'iconPosition' ) === 'right' ? 'marginInlineStart' : 'marginInlineEnd',
			attrName: 'iconGap',
			key: 'iconGap',
			format: '%spx',
			dependencies: [
				'iconPosition',
				...dependencies,
			],
		} ] )
	}

	blockStyleGenerator.addBlockStyles( 'iconColor1', [ {
		...propsToPass,
		selectorCallback: getAttribute => getSvgSelector( getAttribute, selector, [ 'g', 'path', 'rect', 'polygon', 'ellipse' ] ),
		hoverSelectorCallback: getAttribute => getSvgHoverSelector( getAttribute, hoverSelector, [ 'g', 'path', 'rect', 'polygon', 'ellipse' ] ),
		styleRule: 'fill',
		attrName: 'iconColor1',
		key: 'iconColor1-fill',
		valuePreCallback: ( value, getAttribute, device, state ) => {
			if ( getAttribute( 'iconColorType' ) === 'gradient' && getAttribute( 'iconColor1', 'desktop', state ) && getAttribute( 'iconColor2', 'desktop', state ) ) {
				return `url(#linear-gradient-${ getAttribute( 'uniqueId' ) })`
			}

			if ( ! getAttribute( 'iconColorType' ) ) {
				return value
			}

			return undefined
		},
		dependencies: [
			'iconColorType',
			'iconColor1',
			'iconColor2',
			'uniqueId',
			...dependencies,
		],
		hover: 'all',
	} ] )

	blockStyleGenerator.addBlockStyles( 'iconColorGradientDirection', [ {
		...propsToPass,
		selectorCallback: getAttribute => `${ selector } #linear-gradient-${ getAttribute( 'uniqueId' ) }`,
		styleRule: 'transform',
		format: 'rotate(%sdeg)',
		attrName: 'iconColorGradientDirection',
		key: 'iconColorGradientDirection',
		hoverSelectorCallback: getAttribute => `${ selector }:hover #linear-gradient-${ getAttribute( 'uniqueId' ) }`,
	} ] )

	blockStyleGenerator.addBlockStyles( 'iconColor1', [ {
		...propsToPass,
		selectorCallback: getAttribute => `${ selector } #linear-gradient-${ getAttribute( 'uniqueId' ) }`,
		styleRuleCallback: getAttribute => `--linear-gradient-${ getAttribute( 'uniqueId' ) }-color-1`,
		attrName: 'iconColor1',
		key: 'iconColor1',
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
		dependencies: [
			'iconColorType',
			'iconColor1',
			'iconColor2',
			...dependencies,
		],
	} ] )

	blockStyleGenerator.addBlockStyles( 'iconColor2', [ {
		...propsToPass,
		selectorCallback: getAttribute => `${ selector } #linear-gradient-${ getAttribute( 'uniqueId' ) }`,
		styleRuleCallback: getAttribute => `--linear-gradient-${ getAttribute( 'uniqueId' ) }-color-2`,
		attrName: 'iconColor2',
		key: 'iconColor2',
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
		dependencies: [
			'iconColorType',
			'iconColor1',
			'iconColor2',
			...dependencies,
		],
	} ] )

	{ /* Shape Styles */ }
	blockStyleGenerator.addBlockStyles( 'shapeColor1', [ {
		...propsToPass,
		selector: shapeSelector,
		hoverSelector: shapeHoverSelector,
		styleRule: 'backgroundColor',
		attrName: 'shapeColor1',
		key: 'shapeColor1',
		hover: 'all',
		valuePreCallback: ( value, getAttribute, device, state ) => {
			const shapeColorType = getAttribute( 'shapeColorType' )
			if ( state !== 'normal' && shapeColorType === 'gradient' ) {
				return undefined
			}

			return value
		},
		dependencies: [
			'shapeColorType',
			'shapeColor2',
			'shapeColorType',
			'shapeGradientDirection',
			...dependencies,
		],
	} ] )

	blockStyleGenerator.addBlockStyles( 'shapeBorderRadius', [ {
		...propsToPass,
		selector: shapeSelector,
		hoverSelector: shapeHoverSelector,
		styleRule: 'borderRadius',
		attrName: 'shapeBorderRadius',
		key: 'shapeBorderRadius',
		format: '%s%',
		hover: 'all',
	} ] )

	blockStyleGenerator.addBlockStyles( 'shapePadding', [ {
		...propsToPass,
		selector: shapeSelector,
		hoverSelector: shapeHoverSelector,
		styleRule: 'padding',
		attrName: 'shapePadding',
		key: 'shapePadding',
		format: '%spx',
	} ] )

	blockStyleGenerator.addBlockStyles( 'shapeOutlineColor', [ {
		...propsToPass,
		selector: shapeSelector,
		hoverSelector: shapeHoverSelector,
		styleRule: 'borderColor',
		attrName: 'shapeOutlineColor',
		key: 'shapeOutlineColor',
		hover: 'all',
	} ] )

	blockStyleGenerator.addBlockStyles( 'borderStyle', [ {
		...propsToPass,
		selector: shapeSelector,
		hoverSelector: shapeHoverSelector,
		styleRule: 'borderStyle',
		attrName: 'borderStyle',
		key: 'borderStyle',
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
		dependencies: [
			'shapeOutlineWidth',
			...dependencies,
		],
	} ] )

	blockStyleGenerator.addBlockStyles( 'shapeOutlineWidth', [ {
		...propsToPass,
		selector: shapeSelector,
		hoverSelector: shapeHoverSelector,
		styleRule: 'borderTopWidth',
		attrName: 'shapeOutlineWidth',
		key: 'shapeOutlineWidth-top',
		responsive: 'all',
		format: '%spx',
		valuePreCallback: value => value?.top,
	} ] )

	blockStyleGenerator.addBlockStyles( 'shapeOutlineWidth', [ {
		...propsToPass,
		selector: shapeSelector,
		hoverSelector: shapeHoverSelector,
		styleRule: 'borderRightWidth',
		attrName: 'shapeOutlineWidth',
		key: 'shapeOutlineWidth-right',
		responsive: 'all',
		format: '%spx',
		valuePreCallback: value => value?.right,
	} ] )

	blockStyleGenerator.addBlockStyles( 'shapeOutlineWidth', [ {
		...propsToPass,
		selector: shapeSelector,
		hoverSelector: shapeHoverSelector,
		styleRule: 'borderBottomWidth',
		attrName: 'shapeOutlineWidth',
		key: 'shapeOutlineWidth-bottom',
		responsive: 'all',
		format: '%spx',
		valuePreCallback: value => value?.bottom,
	} ] )

	blockStyleGenerator.addBlockStyles( 'shapeOutlineWidth', [ {
		...propsToPass,
		selector: shapeSelector,
		hoverSelector: shapeHoverSelector,
		styleRule: 'borderLeftWidth',
		attrName: 'shapeOutlineWidth',
		key: 'shapeOutlineWidth-left',
		responsive: 'all',
		format: '%spx',
		valuePreCallback: value => value?.left,
	} ] )

	doAction( 'stackable.block-component.icon.indiv-icon-style.addStyles', blockStyleGenerator )
}
