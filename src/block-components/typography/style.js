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
		selectorCallback = null,
		attrNameTemplate = '%s',
		inherit = true,
		inheritMin,
		inheritMax = 50,
		hoverSelector = '',
		hoverSelectorCallback = null,
		dependencies = [],
	} = options

	return [
		{
			selector,
			selectorCallback,
			attrNameTemplate,
			styleRule: 'fontSize',
			attrName: 'fontSize',
			hasUnits: 'px',
			responsive: 'all',
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
			dependencies: [ 'fontSizeUnit', 'fontSize', ...dependencies ],
		},
		{
			selector,
			selectorCallback,
			attrNameTemplate,
			styleRule: 'margin',
			attrName: 'textRemoveTextMargins',
			valueCallback: value => {
				return value ? 0 : undefined
			},
			dependencies,
		},
		{
			selector,
			selectorCallback,
			attrNameTemplate,
			styleRule: 'color',
			hover: 'all',
			hoverSelector,
			hoverSelectorCallback,
			attrName: 'textColor1',
			valuePreCallback: ( value, getAttribute, device, state ) => {
				if ( getAttribute( 'textColorType', 'desktop', state ) === 'gradient' ) {
					return undefined
				}
				return value
			},
			dependencies: [ 'textColorType', ...dependencies ],
		},
		{
			selector,
			selectorCallback,
			attrNameTemplate,
			styleRule: 'backgroundImage',
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
			dependencies: [ 'textColorType', 'textColor1', 'textColor2', 'textGradientDirection', ...dependencies ],
		},
		{
			selector,
			selectorCallback,
			attrNameTemplate,
			styleRule: 'lineHeight',
			attrName: 'lineHeight',
			responsive: 'all',
			hasUnits: 'em',
			dependencies,
		},
		{
			selector,
			selectorCallback,
			attrNameTemplate,
			styles: {
				fontWeight: 'fontWeight',
				textTransform: 'textTransform',
			},
			dependencies,
		},
		{
			selector,
			selectorCallback,
			attrNameTemplate,
			styleRule: 'fontFamily',
			attrName: 'fontFamily',
			valueCallback: value => getFontFamily( value ),
			dependencies,
		},
		{
			selector,
			selectorCallback,
			attrNameTemplate,
			styleRule: 'letterSpacing',
			attrName: 'letterSpacing',
			format: '%spx',
			dependencies,
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
