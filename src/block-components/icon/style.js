/**
 * External dependencies
 */
import { BlockCss } from '~stackable/components'

/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks'
import { attributeHasValue } from '~stackable/util'

const Styles = props => {
	const propsToPass = {
		...props,
		version: props.version,
		versionAdded: '3.0.0',
		versionDeprecated: '',
	}
	const {
		attributes,
		selector = '',
		hoverSelector = '',
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

	return (
		<>
			{ /* Icon Styles */ }
			{ attributeHasValue( 'iconSize', attributes, { hasResponsive: true } ) &&
				<BlockCss
					{ ...propsToPass }
					selectorCallback={ getAttribute => getSvgSelector( getAttribute ) }
					hoverSelectorCallback={ getAttribute => getSvgHoverSelector( getAttribute, hoverSelector ) }
					styleRule="height"
					attrName="iconSize"
					responsive="all"
					format="%spx"
				/>
			}
			{ attributeHasValue( 'iconSize', attributes, { hasResponsive: true } ) &&
				<BlockCss
					{ ...propsToPass }
					selectorCallback={ getAttribute => getSvgSelector( getAttribute ) }
					hoverSelectorCallback={ getAttribute => getSvgHoverSelector( getAttribute, hoverSelector ) }
					styleRule="width"
					attrName="iconSize"
					responsive="all"
					format="%spx"
				/>
			}
			{ attributeHasValue( 'iconOpacity', attributes, { hasHover: true } ) &&
				<BlockCss
					{ ...propsToPass }
					selectorCallback={ getAttribute => getSvgSelector( getAttribute ) }
					hoverSelectorCallback={ getAttribute => getSvgHoverSelector( getAttribute, hoverSelector ) }
					styleRule="opacity"
					attrName="iconOpacity"
					hover="all"
				/>
			}
			{ attributeHasValue( 'iconRotation', attributes, { hasHover: true } ) &&
				<BlockCss
					{ ...propsToPass }
					selectorCallback={ getAttribute => getSvgSelector( getAttribute ) }
					hoverSelectorCallback={ getAttribute => getSvgHoverSelector( getAttribute, hoverSelector ) }
					styleRule="transform"
					attrName="iconRotation"
					hover="all"
					format="rotate(%sdeg)"
				/>
			}
			{ attributeHasValue( 'iconGap', attributes ) &&
				<BlockCss
					{ ...propsToPass }
					selectorCallback={ getAttribute => getSvgSelector( getAttribute ) }
					hoverSelectorCallback={ getAttribute => getSvgSelector( getAttribute, hoverSelector ) }
					styleRuleCallback={ getAttribute => getAttribute( 'iconPosition' ) === 'right' ? 'marginInlineStart' : 'marginInlineEnd' }
					attrName="iconGap"
					format={ `%spx` }
					dependencies={ [ 'iconPosition' ] }
				/>
			}
			{ attributeHasValue( 'iconColor1', attributes, { hasHover: true } ) &&
				<BlockCss
					{ ...propsToPass }
					selectorCallback={ getAttribute => getSvgSelector( getAttribute, selector, [ 'g', 'path', 'rect', 'polygon', 'ellipse' ] ) }
					hoverSelectorCallback={ getAttribute => getSvgHoverSelector( getAttribute, hoverSelector, [ 'g', 'path', 'rect', 'polygon', 'ellipse' ] ) }
					styleRule="fill"
					attrName="iconColor1"
					valuePreCallback={ ( value, getAttribute, device, state ) => {
						if ( getAttribute( 'iconColorType' ) === 'gradient' && getAttribute( 'iconColor1', 'desktop', state ) && getAttribute( 'iconColor2', 'desktop', state ) ) {
							return `url(#linear-gradient-${ getAttribute( 'uniqueId' ) })`
						}

						if ( ! getAttribute( 'iconColorType' ) ) {
							return value
						}

						return undefined
					} }
					dependencies={ [ 'iconColorType', 'iconColor1', 'iconColor2', 'uniqueId' ] }
					hover="all"
				/>
			}
			{ attributeHasValue( 'iconColorGradientDirection', attributes ) &&
				<BlockCss
					{ ...propsToPass }
					selectorCallback={ getAttribute => `${ selector } #linear-gradient-${ getAttribute( 'uniqueId' ) }` }
					styleRule="transform"
					format="rotate(%sdeg)"
					attrName="iconColorGradientDirection"
					hoverSelectorCallback={ getAttribute => `${ selector }:hover #linear-gradient-${ getAttribute( 'uniqueId' ) }` }
				/>
			}
			{ attributeHasValue( 'iconColor1', attributes ) &&
				<BlockCss
					{ ...propsToPass }
					selectorCallback={ getAttribute => `${ selector } #linear-gradient-${ getAttribute( 'uniqueId' ) }` }
					styleRuleCallback={ getAttribute => `--linear-gradient-${ getAttribute( 'uniqueId' ) }-color-1` }
					attrName="iconColor1"
					valuePreCallback={ ( value, getAttribute, device, state ) => {
						if ( getAttribute( 'iconColorType' ) !== 'gradient' ||
					     ! getAttribute( 'iconColor1', 'desktop', state ) ||
					     ! getAttribute( 'iconColor2', 'desktop', state )
						) {
							return undefined
						}
						return value
					} }
					hoverSelectorCallback={ getAttribute => `${ selector }:hover #linear-gradient-${ getAttribute( 'uniqueId' ) }` }
					dependencies={ [ 'iconColorType', 'iconColor1', 'iconColor2' ] }
				/>
			}
			{ attributeHasValue( 'iconColor2', attributes ) &&
				<BlockCss
					{ ...propsToPass }
					selectorCallback={ getAttribute => `${ selector } #linear-gradient-${ getAttribute( 'uniqueId' ) }` }
					styleRuleCallback={ getAttribute => `--linear-gradient-${ getAttribute( 'uniqueId' ) }-color-2` }
					attrName="iconColor2"
					valuePreCallback={ ( value, getAttribute, device, state ) => {
						if ( getAttribute( 'iconColorType' ) !== 'gradient' ||
					! getAttribute( 'iconColor1', 'desktop', state ) ||
					! getAttribute( 'iconColor2', 'desktop', state )
						) {
							return undefined
						}
						return value
					} }
					hoverSelectorCallback={ getAttribute => `${ selector }:hover #linear-gradient-${ getAttribute( 'uniqueId' ) }` }
					dependencies={ [ 'iconColorType', 'iconColor1', 'iconColor2' ] }
				/>
			}

			{ /* Shape Styles */ }
			{ attributeHasValue( 'shapeColor1', attributes, { hasHover: true } ) &&
				<BlockCss
					{ ...propsToPass }
					selector={ shapeSelector }
					hoverSelector={ shapeHoverSelector }
					styleRule="backgroundColor"
					attrName="shapeColor1"
					hover="all"
					valuePreCallback={ ( value, getAttribute, device, state ) => {
						const shapeColorType = getAttribute( 'shapeColorType' )
						if ( state !== 'normal' && shapeColorType === 'gradient' ) {
							return undefined
						}

						return value
					} }
					dependencies={ [ 'shapeColorType', 'shapeColor2', 'shapeColorType', 'shapeGradientDirection' ] }
				/>
			}
			{ attributeHasValue( 'shapeBorderRadius', attributes, { hasHover: true } ) &&
				<BlockCss
					{ ...propsToPass }
					selector={ shapeSelector }
					hoverSelector={ shapeHoverSelector }
					styleRule="borderRadius"
					attrName="shapeBorderRadius"
					format={ `%s%` }
					hover="all"
				/>
			}
			{ attributeHasValue( 'shapePadding', attributes ) &&
				<BlockCss
					{ ...propsToPass }
					selector={ shapeSelector }
					hoverSelector={ shapeHoverSelector }
					styleRule="padding"
					attrName="shapePadding"
					format={ `%spx` }
				/>
			}
			{ attributeHasValue( 'shapeOutlineColor', attributes, { hasHover: true } ) &&
				<BlockCss
					{ ...propsToPass }
					selector={ shapeSelector }
					hoverSelector={ shapeHoverSelector }
					styleRule="borderColor"
					attrName="shapeOutlineColor"
					hover="all"
				/>
			}
			{ attributeHasValue( 'borderStyle', attributes, { hasHover: true } ) &&
				<BlockCss
					{ ...propsToPass }
					selector={ shapeSelector }
					hoverSelector={ shapeHoverSelector }
					styleRule="borderStyle"
					attrName="borderStyle"
					valuePreCallback={ ( value, getAttribute, device, state ) => {
						if (
							! getAttribute( 'shapeOutlineWidth', 'desktop', state )?.top ||
						! getAttribute( 'shapeOutlineWidth', 'desktop', state )?.right ||
						! getAttribute( 'shapeOutlineWidth', 'desktop', state )?.bottom ||
						! getAttribute( 'shapeOutlineWidth', 'desktop', state )?.left
						) {
							return undefined
						}

						return 'solid'
					} }
					hover="all"
					dependencies={ [ 'shapeOutlineWidth' ] }
				/>
			}
			{ attributeHasValue( 'shapeOutlineWidth', attributes, { hasResponsive: true } ) &&
				<BlockCss
					{ ...propsToPass }
					selector={ shapeSelector }
					hoverSelector={ shapeHoverSelector }
					styleRule="borderTopWidth"
					attrName="shapeOutlineWidth"
					responsive="all"
					format="%spx"
					valuePreCallback={ value => value?.top }
				/>
			}
			{ attributeHasValue( 'shapeOutlineWidth', attributes, { hasResponsive: true } ) &&
				<BlockCss
					{ ...propsToPass }
					selector={ shapeSelector }
					hoverSelector={ shapeHoverSelector }
					styleRule="borderRightWidth"
					attrName="shapeOutlineWidth"
					responsive="all"
					format="%spx"
					valuePreCallback={ value => value?.right }
				/>
			}
			{ attributeHasValue( 'shapeOutlineWidth', attributes, { hasResponsive: true } ) &&
				<BlockCss
					{ ...propsToPass }
					selector={ shapeSelector }
					hoverSelector={ shapeHoverSelector }
					styleRule="borderBottomWidth"
					attrName="shapeOutlineWidth"
					responsive="all"
					format="%spx"
					valuePreCallback={ value => value?.bottom }
				/>
			}
			{ attributeHasValue( 'shapeOutlineWidth', attributes, { hasResponsive: true } ) &&
				<BlockCss
					{ ...propsToPass }
					selector={ shapeSelector }
					hoverSelector={ shapeHoverSelector }
					styleRule="borderLeftWidth"
					attrName="shapeOutlineWidth"
					responsive="all"
					format="%spx"
					valuePreCallback={ value => value?.left }
				/>
			}

		</>
	)
}

export const Style = props => {
	const IndivIconStyles = applyFilters( 'stackable.block-component.icon.indiv-icon-style', null )

	return <>
		<Styles { ...props } />
		{ IndivIconStyles && <IndivIconStyles { ...props } /> }
	</>
}

Style.Content = props => {
	const IndivIconStyles = applyFilters( 'stackable.block-component.icon.indiv-icon-style', null )

	return <>
		<Styles { ...props } />
		{ IndivIconStyles && <IndivIconStyles { ...props } /> }
	</>
}
