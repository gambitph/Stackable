/**
 * Internal dependencies
 */
import { convertSVGStringToBase64 } from './util'

/**
 * External dependencies
 */
import {
	Typography, MarginBottom, BlockDiv, Advanced, EffectsAnimations, Alignment, Transform,
} from '~stackable/block-components'
import { useBlockAttributesContext } from '~stackable/hooks'
import { BlockCss, BlockCssCompiler } from '~stackable/components'

/**
 * WordPress dependencies
 */
import { memo } from '@wordpress/element'

const typographyOptions = {
	selector: [
		'ul li',
		'ol li',
	],
	hoverSelector: [
		'.%s:hover ul li',
		'.%s:hover ol li',
	],
}

const Styles = props => {
	const propsToPass = {
		...props,
		version: props.version,
		versionAdded: '3.0.0',
		versionDeprecated: '',
	}
	const {
		icons,
	} = props

	return (
		<>
			{ Object.keys( icons ).reduce( ( acc, key ) => {
				acc.push(
					<BlockCss
						renderIn="edit"
						selector={ key }
						hover="all"
						hoverSelector={ '.%s:hover ' + key }
						styleRule="listStyleImage"
						attrName="markerColor"
						valuePreCallback={ ( value, getAttribute, device, state ) => {
							const iconRotation = getAttribute( 'iconRotation' )
							const iconOpacity = getAttribute( 'iconOpacity', 'desktop', state )
							if ( state !== 'normal' && ! value && ! iconRotation && ! iconOpacity ) {
								return undefined
							}

							const transform = `rotate(${ iconRotation + 'deg' })`
							const iconWithColor = convertSVGStringToBase64( getAttribute( 'icons' )?.[ key ], value || '#000', { transform, opacity: iconOpacity } )
							return `url('data:image/svg+xml;base64,${ iconWithColor }')`
						} }
						dependencies={ [ 'icons', 'iconRotation', 'iconOpacity' ] }
						{ ...propsToPass }
					/>
				)
				acc.push(
					<BlockCss
						renderIn="save"
						selector={ key }
						hover="all"
						hoverSelector={ '.%s:hover ' + key }
						styleRule="listStyleImage"
						attrName="markerColor"
						valuePreCallback={ ( value, getAttribute, device, state ) => {
							const iconRotation = getAttribute( 'iconRotation' )
							const iconOpacity = getAttribute( 'iconOpacity', 'desktop', state )
							if ( state !== 'normal' && ! value && ! iconRotation && ! iconOpacity ) {
								return undefined
							}

							const transform = `rotate(${ iconRotation + 'deg' })`

							const iconWithColor = convertSVGStringToBase64( getAttribute( 'icons' )?.[ key ], value || '#000', { transform, opacity: iconOpacity } )
							return `url('data:image/svg+xml;base64,${ iconWithColor }')`
						} }
						dependencies={ [ 'icons', 'iconRotation', 'iconOpacity' ] }
						{ ...propsToPass }
					/>
				)
				return acc
			}, [] ) }

			<BlockCss
				selector="li"
				styleRule="paddingInlineStart"
				attrName="iconGap"
				responsive="all"
				format="%spx"
				{ ...propsToPass }
			/>
			<BlockCss
				selector="ol"
				styleRule="listStyleType"
				attrName="listType"
				{ ...propsToPass }
			/>
			<BlockCss
				selector=""
				styleRule="columnCount"
				attrName="columns"
				responsive="all"
				{ ...propsToPass }
			/>
			<BlockCss
				selector=""
				styleRule="columnGap"
				attrName="columnGap"
				responsive="all"
				format="%spx"
				{ ...propsToPass }
			/>
			<BlockCss
				selector="li"
				styleRule="marginBottom"
				attrName="rowGap"
				responsive="all"
				format="%spx"
				{ ...propsToPass }
			/>
			<BlockCss
				selector={ [ 'ul', 'ol' ] }
				styleRule="paddingLeft"
				attrName="indentation"
				responsive="all"
				format="%spx"
				{ ...propsToPass }
			/>
			<BlockCss
				selector="ul li"
				hover="all"
				hoverSelector=".%s:hover li"
				styleRule="listStyleImage"
				attrName="markerColor"
				valuePreCallback={ ( value, getAttribute, device, state ) => {
					const iconSVG = getAttribute( 'icon' )
					const iconRotation = getAttribute( 'iconRotation' )
					const iconOpacity = getAttribute( 'iconOpacity', 'desktop', state )
					if ( state !== 'normal' && ! value && ! iconRotation && ! iconOpacity ) {
						return undefined
					}

					if ( ! iconSVG ) {
						return undefined
					}

					const transform = `rotate(${ iconRotation + 'deg' })`

					const iconWithColor = convertSVGStringToBase64( iconSVG, value || '#000', { transform, opacity: iconOpacity } )
					return `url('data:image/svg+xml;base64,${ iconWithColor }')`
				} }
				dependencies={ [ 'icon', 'iconRotation', 'iconOpacity' ] }
				{ ...propsToPass }
			/>
			<BlockCss
				selector="li::marker"
				hover="all"
				hoverSelector=".%s:hover li::marker"
				styleRule="color"
				attrName="markerColor"
				{ ...propsToPass }
			/>
			<BlockCss
				selector="li::marker"
				styleRule="fontSize"
				attrName="iconSize"
				responsive="all"
				format="%sem"
				{ ...propsToPass }
			/>
			<BlockCss
				// For calculating the approximate clickable area for
				// icon picker.
				renderIn="edit"
				selector=""
				styleRule="--stk-icon-height"
				attrName="iconSize"
				responsive="all"
				format="%sem"
				{ ...propsToPass }
			/>
			<BlockCss
				selector={ [ 'li' ] }
				styleRule="marginInline"
				attrName="listAlignment"
				responsive="all"
				valueCallback={ value => value === 'center' ? 'auto' : value === 'right' ? 'auto 0' : value === 'left' ? '0 auto' : '' }
				{ ...propsToPass }
			/>
		</>
	)
}

export const IconListStyles = memo( props => {
	const icons = useBlockAttributesContext( attributes => attributes.icons )

	return (
		<>
			<Alignment.Style { ...props } />
			<Typography.Style { ...props } { ...typographyOptions } />
			<MarginBottom.Style { ...props } />
			<BlockDiv.Style { ...props } />
			<EffectsAnimations.Style { ...props } />
			<Advanced.Style { ...props } />
			<Transform.Style { ...props } />
			<Styles { ...props } icons={ icons } />
		</>
	)
} )

IconListStyles.defaultProps = {
	version: '',
}

IconListStyles.Content = props => {
	if ( props.attributes.generatedCss ) {
		return <style>{ props.attributes.generatedCss }</style>
	}

	return (
		<BlockCssCompiler>
			<Alignment.Style.Content { ...props } />
			<Typography.Style.Content { ...props } { ...typographyOptions } />
			<MarginBottom.Style.Content { ...props } />
			<BlockDiv.Style.Content { ...props } />
			<EffectsAnimations.Style.Content { ...props } />
			<Advanced.Style.Content { ...props } />
			<Transform.Style.Content { ...props } />
			<Styles { ...props } icons={ props.attributes.icons } />
		</BlockCssCompiler>
	)
}

IconListStyles.Content.defaultProps = {
	version: '',
	attributes: {},
}
