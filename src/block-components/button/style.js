/**
 * External dependencies
 */
import { Style as StyleComponent } from '~stackable/components'
import {
	useStyles, getStyles,
} from '~stackable/util'

/**
 * WordPress dependencies
 */
import { Fragment } from '@wordpress/element'
import { sprintf } from '@wordpress/i18n'

/**
 * Internal dependencies
 */
import { BorderStyle } from '../helpers/borders'
import { Icon } from '../icon'

const getStyleParams = options => {
	const {
		selector,
	} = options

	return [
		{
			selector,
			responsive: 'all',
			styleRule: 'minHeight',
			attrName: 'buttonMinHeight',
			format: '%spx',
		},
		{
			selector,
			responsive: 'all',
			styleRule: 'width',
			attrName: 'buttonWidth',
			format: '%spx',
		},
		{
			selector,
			responsive: 'all',
			styleRule: 'paddingTop',
			attrName: 'buttonPadding',
			hasUnits: 'px',
			valuePreCallback: value => value?.top,
		},
		{
			selector,
			responsive: 'all',
			styleRule: 'paddingRight',
			attrName: 'buttonPadding',
			hasUnits: 'px',
			valuePreCallback: value => value?.right,
		},
		{
			selector,
			responsive: 'all',
			styleRule: 'paddingBottom',
			attrName: 'buttonPadding',
			hasUnits: 'px',
			valuePreCallback: value => value?.bottom,
		},
		{
			selector,
			responsive: 'all',
			styleRule: 'paddingLeft',
			attrName: 'buttonPadding',
			hasUnits: 'px',
			valuePreCallback: value => value?.left,
		},
		{
			selector,
			styleRule: 'background',
			attrName: 'buttonBackgroundColor',
			valueCallback: ( _, getAttribute ) => {
				const buttonBackgroundGradientDirection = getAttribute( 'buttonBackgroundGradientDirection' )
				const buttonBackgroundColor = getAttribute( 'buttonBackgroundColor' )
				const buttonBackgroundColor2 = getAttribute( 'buttonBackgroundColor2' )

				if ( getAttribute( 'buttonBackgroundColorType' ) !== 'gradient' ) {
					return getAttribute( 'buttonBackgroundColor' )
				}

				return `linear-gradient(${ buttonBackgroundGradientDirection !== '' ? buttonBackgroundGradientDirection + 'deg' : '90deg' }, ${ buttonBackgroundColor || buttonBackgroundColor2 }, ${ buttonBackgroundColor2 || buttonBackgroundColor })`
			},
			dependencies: [ 'buttonBackgroundGradientDirection', 'buttonBackgroundColor', 'buttonBackgroundColor2', 'buttonBackgroundColorType' ],
		},
		{
			selector: `${ selector }:after`,
			styleRule: 'background',
			attrName: 'buttonBackgroundColor',
			hover: 'all',
			hoverSelector: `${ selector }:hover:after`,
			valuePreCallback: ( value, getAttribute, device, state ) => {
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
			},
			dependencies: [ 'buttonBackgroundGradientDirection', 'buttonBackgroundColor', 'buttonBackgroundColor2', 'buttonBackgroundColorType' ],
		},
		{
			selector: `${ selector }:after`,
			styleRule: 'opacity',
			attrName: 'buttonBackgroundColor',
			hover: 'all',
			hoverSelector: `${ selector }:hover:after`,
			valuePreCallback: ( value, getAttribute, device, state ) => {
				if ( state === 'normal' ) {
					return undefined
				}

				const buttonBackgroundColor = getAttribute( 'buttonBackgroundColor', 'desktop', state )

				if (
					typeof buttonBackgroundColor !== undefined &&
					buttonBackgroundColor !== ''
				) {
					return 1
				}

				return undefined
			},
		},
	]
}

export const Style = props => {
	const {
		attributes,
		...propsToPass
	} = props

	const styles = useStyles( attributes, getStyleParams( propsToPass.options ) )

	return (
		<Fragment>
			<StyleComponent
				styles={ styles }
				versionAdded="3.0.0"
				versionDeprecated=""
				{ ...propsToPass }
			/>
			<BorderStyle
				{ ...{
					attributes,
					...propsToPass,
					options: {
						...propsToPass.options,
						selector: propsToPass.options.selector + ':before',
						hoverSelector: propsToPass.options.selector + ':hover:before',
						borderRadiusSelector: propsToPass.options.selector,
						attrNameTemplate: sprintf( 'button%s', propsToPass.options?.attrNameTemplate || '%s' ),
					},
				} }
			/>
			<Icon.Style
				{ ...{
					attributes,
					...propsToPass,
				} } />
		</Fragment>
	)
}

Style.Content = props => {
	const {
		attributes,
		...propsToPass
	} = props

	const styles = getStyles( attributes, getStyleParams( propsToPass.options ) )

	return (
		<Fragment>
			<StyleComponent.Content
				styles={ styles }
				versionAdded="3.0.0"
				versionDeprecated=""
				{ ...propsToPass }
			/>
			<BorderStyle.Content
				{ ...{
					attributes,
					...propsToPass,
					options: {
						...propsToPass.options,
						selector: propsToPass.options.selector + ':before',
						hoverSelector: propsToPass.options.selector + ':hover:before',
						borderRadiusSelector: propsToPass.options.selector,
						attrNameTemplate: sprintf( 'button%s', propsToPass.options?.attrNameTemplate || '%s' ),
					},
				} }
			/>
			<Icon.Style.Content
				{ ...{
					attributes,
					...propsToPass,
				} } />
		</Fragment>
	)
}
