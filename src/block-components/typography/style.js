/**
 * External dependencies
 */
import {
	getFontFamily, clampInheritedStyle, useStyles, getStyles,
} from '~stackable/util'
import { Style as StyleComponent } from '~stackable/components'

const getStyleParams = ( options = {} ) => {
	const {
		selector = '',
		inherit = true,
		inheritMin,
		inheritMax = 50,
		hoverSelector = '',
	} = options

	return [
		{
			selector: '',
			styleRule: 'columnCount',
			attrName: 'columns',
			responsive: 'all',
		},
		{
			selector,
			styleRule: 'fontSize',
			attrName: 'fontSize',
			hasUnits: 'px',
			responsive: 'all',
			hover: 'all',
			hoverSelector,
			clampCallback: ( _value, getAttribute, device, state ) => {
				const currentValue = getAttribute( 'fontSize', device, state )
				const isMobile = device === 'mobile'

				let value = _value
				const clampedValue = inherit && clampInheritedStyle(
					_value,
					{ min: inheritMin, max: inheritMax }
				)

				/**
				 * When clamping values in mobile, make sure to get the
				 * clamped desktop value first before checking the clamped
				 * tablet value.
				 *
				 * When the tablet is already clamped, the fallback value should
				 * be undefined already to avoid generating 2 identical styles.
				 */
				if ( isMobile ) {
					const clampedDesktopValue = inherit && clampInheritedStyle(
						getAttribute( 'fontSize', 'desktop', state ),
						{ min: inheritMin, max: inheritMax }
					)
					value = clampedDesktopValue ? clampedDesktopValue : value
				}

				value = clampedValue ? clampedValue : value
				value = typeof currentValue !== 'undefined' && currentValue !== ''
					? currentValue
					: isMobile ? undefined : value
				return value
			},
			dependencies: [ 'fontSizeUnit', 'fontSize' ],
		},
		{
			selector,
			styleRule: 'margin',
			attrName: 'textRemoveTextMargins',
			valueCallback: value => {
				return value ? 0 : undefined
			},
		},
		{
			selector,
			styleRule: 'color',
			hover: 'all',
			hoverSelector,
			attrName: 'textColor1',
			valuePreCallback: ( value, getAttribute, device, state ) => {
				if ( getAttribute( 'textColorType', 'desktop', state ) === 'gradient' ) {
					return undefined
				}
				return value
			},
			dependencies: [ 'textColorType' ],
		},
		{
			selector,
			styleRule: 'backgroundImage',
			hoverSelector,
			attrName: 'textColor1',
			valuePreCallback: ( value, getAttribute ) => {
				if (
					getAttribute( 'textColorType', 'desktop', 'normal' ) !== 'gradient' ||
					getAttribute( 'textColor1', 'desktop', 'normal' ) === '' ||
					getAttribute( 'textColor2', 'desktop', 'normal' ) === ''
				) {
					return undefined
				}
				return value
			},
			valueCallback: ( value, getAttribute ) => {
				const textColor1 = getAttribute( 'textColor1', 'desktop', 'normal' )
				const textColor2 = getAttribute( 'textColor2', 'desktop', 'normal' )
				const textGradientDirection = getAttribute( 'textGradientDirection', 'desktop', 'normal' )

				return `linear-gradient(${ textGradientDirection !== '' ? `${ textGradientDirection }deg, ` : '' }${ textColor1 }, ${ textColor2 })`
			},
			dependencies: [ 'textColorType', 'textColor1', 'textColor2', 'textGradientDirection' ],
		},
		{
			selector,
			styleRule: 'lineHeight',
			attrName: 'lineHeight',
			responsive: 'all',
			hasUnits: 'em',
		},
		{
			selector,
			styles: {
				fontWeight: 'fontWeight',
				textTransform: 'textTransform',
			},
		},
		{
			selector,
			styleRule: 'fontFamily',
			attrName: 'fontFamily',
			valueCallback: value => getFontFamily( value ),
		},
		{
			selector,
			styleRule: 'letterSpacing',
			attrName: 'letterSpacing',
			format: '%spx',
		},
		{
			selector: '.stk--top-line',
			styleRule: 'height',
			attrName: 'topLineHeight',
			format: '%spx',
		},
		{
			selector: '.stk--top-line',
			styleRule: 'width',
			attrName: 'topLineWidth',
			hasUnits: 'px',
			hover: 'all',
		},
		{
			selector: '.stk--top-line',
			styleRule: 'backgroundColor',
			attrName: 'topLineColor',
			hover: 'all',
		},
		{
			selector: '.stk--top-line',
			styleRule: 'backgroundColor',
			attrName: 'topLineColor',
			hover: 'all',
		},
		{
			selector: '.stk--top-line',
			styleRule: 'marginBottom',
			attrName: 'topLineMargin',
			responsive: 'all',
			format: '%spx',
		},
		{
			selector: '.stk--top-line',
			styleRule: 'marginLeft',
			attrName: 'topLineAlign',
			responsive: 'all',
			valueCallback: () => 'auto',
		},
		{
			selector: '.stk--top-line',
			styleRule: 'marginRight',
			attrName: 'topLineAlign',
			responsive: 'all',
			valueCallback: value => value === 'center' ? 'auto' : undefined,
		},
		{
			selector: '.stk--bottom-line',
			styleRule: 'height',
			attrName: 'bottomLineHeight',
			format: '%spx',
		},
		{
			selector: '.stk--bottom-line',
			styleRule: 'width',
			attrName: 'bottomLineWidth',
			hasUnits: 'px',
			hover: 'all',
		},
		{
			selector: '.stk--bottom-line',
			styleRule: 'backgroundColor',
			attrName: 'bottomLineColor',
			hover: 'all',
		},
		{
			selector: '.stk--bottom-line',
			styleRule: 'backgroundColor',
			attrName: 'bottomLineColor',
			hover: 'all',
		},
		{
			selector: '.stk--bottom-line',
			styleRule: 'marginTop',
			attrName: 'bottomLineMargin',
			responsive: 'all',
			format: '%spx',
		},
		{
			selector: '.stk--bottom-line',
			styleRule: 'marginLeft',
			attrName: 'bottomLineAlign',
			responsive: 'all',
			valueCallback: () => 'auto',
		},
		{
			selector: '.stk--bottom-line',
			styleRule: 'marginRight',
			attrName: 'bottomLineAlign',
			responsive: 'all',
			valueCallback: value => value === 'center' ? 'auto' : undefined,
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
