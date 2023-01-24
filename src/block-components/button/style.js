/**
 * Internal dependencies
 */
import { BorderStyle } from '../helpers/borders'
import { Icon } from '../icon'
import { BlockCss } from '~stackable/components'

/**
 * WordPress dependencies
 */
import { sprintf } from '@wordpress/i18n'

const Styles = props => {
	const propsToPass = {
		...props,
		version: props.version,
		versionAdded: '3.0.0',
		versionDeprecated: '',
	}
	const {
		selector,
		hoverSelector,
		dependencies = [],
	} = props

	return (
		<>
			<BlockCss
				{ ...propsToPass }
				selector={ [ '', '.stk-button' ] }
				styleRule="width"
				attrName="buttonFullWidth"
				key="buttonFullWidth"
				valueCallback={ () => '100%' }
				format="%spx"
				enabledCallback={ getAttribute => getAttribute( 'buttonFullWidth' ) }
			/>
			{
			// This makes the full-width button occupy the available space, but make
			// others wrap when it's too small.
			}
			<BlockCss
				{ ...propsToPass }
				renderIn="save"
				selector=""
				styleRule="flex"
				attrName="buttonFullWidth"
				key="buttonFullWidth-save"
				valueCallback={ () => '1 1 0' }
				enabledCallback={ getAttribute => getAttribute( 'buttonFullWidth' ) }
			/>
			<BlockCss
				{ ...propsToPass }
				renderIn="edit"
				selectorCallback={ ( getAttributes, attributes, clientId ) => `[data-block="${ clientId }"]` }
				styleRule="flex"
				attrName="buttonFullWidth"
				key="buttonFullWidth-flex"
				valueCallback={ () => '1 1 0' }
				enabledCallback={ getAttribute => getAttribute( 'buttonFullWidth' ) }
			/>
			<BlockCss
				{ ...propsToPass }
				selector={ selector }
				responsive="all"
				styleRule="minHeight"
				attrName="buttonMinHeight"
				key="buttonMinHeight"
				format="%spx"
			/>
			<BlockCss
				{ ...propsToPass }
				selector={ selector }
				responsive="all"
				styleRule="width"
				attrName="buttonWidth"
				key="buttonWidth"
				format="%spx"
				enabledCallback={ getAttribute => ! getAttribute( 'buttonFullWidth' ) }
				dependencies={ [
					'buttonFullWidth',
					...dependencies,
				] }
			/>
			<BlockCss
				{ ...propsToPass }
				selector={ selector }
				responsive="all"
				styleRule="paddingTop"
				attrName="buttonPadding"
				key="buttonPadding-top"
				hasUnits="px"
				valuePreCallback={ value => value?.top }
			/>
			<BlockCss
				{ ...propsToPass }
				selector={ selector }
				responsive="all"
				styleRule="paddingRight"
				attrName="buttonPadding"
				key="buttonPadding-right"
				hasUnits="px"
				valuePreCallback={ value => value?.right }
			/>
			<BlockCss
				{ ...propsToPass }
				selector={ selector }
				responsive="all"
				styleRule="paddingBottom"
				attrName="buttonPadding"
				key="buttonPadding-bottom"
				hasUnits="px"
				valuePreCallback={ value => value?.bottom }
			/>
			<BlockCss
				{ ...propsToPass }
				selector={ selector }
				responsive="all"
				styleRule="paddingLeft"
				attrName="buttonPadding"
				key="buttonPadding-left"
				hasUnits="px"
				valuePreCallback={ value => value?.left }
			/>
			<BlockCss
				{ ...propsToPass }
				selector={ selector }
				styleRule="background"
				attrName="buttonBackgroundColor"
				key="buttonBackgroundColor"
				valueCallback={ ( _, getAttribute ) => {
					const buttonBackgroundGradientDirection = getAttribute( 'buttonBackgroundGradientDirection' )
					const buttonBackgroundColor = getAttribute( 'buttonBackgroundColor' )
					const buttonBackgroundColor2 = getAttribute( 'buttonBackgroundColor2' )

					if ( getAttribute( 'buttonBackgroundColorType' ) !== 'gradient' ) {
						return getAttribute( 'buttonBackgroundColor' )
					}

					return `linear-gradient(${ buttonBackgroundGradientDirection !== '' ? buttonBackgroundGradientDirection + 'deg' : '90deg' }, ${ buttonBackgroundColor || buttonBackgroundColor2 }, ${ buttonBackgroundColor2 || buttonBackgroundColor })`
				} }
				dependencies={ [
					'buttonBackgroundGradientDirection',
					'buttonBackgroundColor',
					'buttonBackgroundColor2',
					'buttonBackgroundColorType',
					...dependencies,
				 ] }
			/>
			<BlockCss
				{ ...propsToPass }
				selector={ `${ selector }:after` }
				styleRule="background"
				attrName="buttonBackgroundColor"
				key="buttonBackgroundColor-after"
				hover="all"
				hoverSelector={ hoverSelector ? hoverSelector : `${ selector }:hover:after` }
				valuePreCallback={ ( value, getAttribute, device, state ) => {
					if ( state === 'normal' ) {
						return undefined
					}

					if ( getAttribute( 'buttonBackgroundColorType' ) !== 'gradient' ) {
						return value
					}

					const buttonBackgroundGradientDirection = getAttribute( 'buttonBackgroundGradientDirection', 'desktop', state )
					const buttonBackgroundColor = getAttribute( 'buttonBackgroundColor', 'desktop', state )
					const buttonBackgroundColor2 = getAttribute( 'buttonBackgroundColor2', 'desktop', state )

					if (
						( typeof buttonBackgroundColor !== undefined &&
					buttonBackgroundColor !== '' ) ||
					( typeof buttonBackgroundColor2 !== undefined &&
					buttonBackgroundColor2 !== '' )
					) {
						return `linear-gradient(${ buttonBackgroundGradientDirection !== '' ? buttonBackgroundGradientDirection + 'deg' : '90deg' }, ${ buttonBackgroundColor || buttonBackgroundColor2 }, ${ buttonBackgroundColor2 || buttonBackgroundColor })`
					}
          
					return undefined
				} }
				dependencies={ [
					'buttonBackgroundGradientDirection',
					'buttonBackgroundColor',
					'buttonBackgroundColor2',
					'buttonBackgroundColorType',
					...dependencies,
				] }
			/>
			<BlockCss
				{ ...propsToPass }
				selector={ `${ selector }:after` }
				styleRule="opacity"
				attrName="buttonBackgroundColor"
				key="buttonBackgroundColor-opacity"
				hover="all"
				hoverSelector={ hoverSelector ? hoverSelector : `${ selector }:hover:after` }
				valuePreCallback={ ( value, getAttribute, device, state ) => {
					if ( state === 'normal' ) {
						return undefined
					}

					const buttonBackgroundColor = getAttribute( 'buttonBackgroundColor', 'desktop', state )

					if (
						typeof buttonBackgroundColor !== 'undefined' &&
					buttonBackgroundColor !== ''
					) {
						return 1
					}

					return undefined
				} }
			/>
		</>
	)
}

export const Style = props => {
	const {
		selector = '',
		attrNameTemplate = '',
	} = props

	return (
		<>
			<Styles { ...props } />
			<BorderStyle
				{ ...props }
				selector={ selector + ':before' }
				// Adding border radius clips button's shadow.
				// This prevents this from happening.
				// @see src/block-components/borders/style.js
				addBorderRadiusOverflow={ false }
				hoverSelector={ selector + ':hover:before' }
				borderRadiusSelector={ selector }
				attrNameTemplate={ sprintf( 'button%s', attrNameTemplate || '%s' ) }
			/>
			<Icon.Style { ...props } />
		</>
	)
}

Style.Content = props => {
	const {
		selector = '',
		attrNameTemplate = '',
	} = props

	return (
		<>
			<Styles { ...props } />
			<BorderStyle.Content
				{ ...props }
				selector={ selector + ':before' }
				// Adding border radius clips button's shadow.
				// This prevents this from happening.
				// @see src/block-components/borders/style.js}
				addBorderRadiusOverflow={ false }
				hoverSelector={ selector + ':hover:before' }
				borderRadiusSelector={ selector }
				attrNameTemplate={ sprintf( 'button%s', attrNameTemplate || '%s' ) }
			/>
			<Icon.Style.Content { ...props } />
		</>
	)
}
