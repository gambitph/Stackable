/**
 * External dependencies
 */
import {
	getFontFamily, clampInheritedStyle, getAttributeName, useStyles, getStyles,
} from '~stackable/util'
import { Style as StyleComponent } from '~stackable/components'

const getStyleParams = ( options = {} ) => {
	const {
		selector,
		inherit,
		inheritMin,
		inheritMax,
		hoverSelector,
	} = options

	return [
		{
			selector,
			styleRule: 'fontSize',
			attrName: 'fontSize',
			hasUnits: 'px',
			responsive: 'all',
			hover: 'all',
			hoverSelector,
			valueCallback: ( _value, attributes, device, state ) => {
				let value = _value
				const clampDesktopValue = inherit && clampInheritedStyle(
					attributes[ getAttributeName( 'fontSize', 'desktop', state ) ],
					{ min: inheritMin, max: inheritMax }
				)

				const clampTabletValue = clampInheritedStyle(
					attributes[ getAttributeName( 'fontSize', 'tablet', state ) ],
					{ min: inheritMin, max: inheritMax }
				)
				if ( device === 'tablet' ) {
					if ( clampDesktopValue ) {
						value = `${ clampDesktopValue }${ attributes[ getAttributeName( 'fontSizeUnit', device, state ) ] || 'px' }`
					}
					if ( attributes[ getAttributeName( 'fontSize', device, state ) ] !== '' ) {
						value = `${ attributes[ getAttributeName( 'fontSize', device, state ) ] }${ attributes[ getAttributeName( 'fontSizeUnit', device, state ) ] || 'px' }`
					}
				}

				if ( device === 'mobile' ) {
					if ( clampDesktopValue ) {
						value = `${ clampDesktopValue }${ attributes[ getAttributeName( 'fontSizeUnit', device, state ) ] || 'px' }`
					}

					if ( clampTabletValue ) {
						value = `${ clampTabletValue }${ attributes[ getAttributeName( 'fontSizeUnit', device, state ) ] || 'px' }`
					} else if ( clampDesktopValue || attributes[ getAttributeName( 'fontSize', device, state ) ] !== '' ) {
						value = undefined
					}

					if ( attributes[ getAttributeName( 'fontSize', device, state ) ] !== '' ) {
						value = `${ attributes[ getAttributeName( 'fontSize', device, state ) ] }${ attributes[ getAttributeName( 'fontSizeUnit', device, state ) ] || 'px' }`
					}
				}

				return value
			},
			dependencies: [ 'fontSizeUnit', 'fontSize' ],
		},
		{
			selector,
			styleRule: 'color',
			hover: 'all',
			hoverSelector,
			attrName: 'textColor1',
			enabledCallback: attributes => attributes.textColorType !== 'gradient',
			dependencies: [ 'textColorType' ],
		},
		{
			selector,
			styleRule: 'backgroundImage',
			hover: 'all',
			hoverSelector,
			attrName: 'textColor1',
			valueCallback: ( value, attributes, device, state ) => {
				const textColor1 = attributes[ getAttributeName( 'textColor1', device, state ) ]
				const textColor2 = attributes[ getAttributeName( 'textColor2', device, state ) ]
				const textGradientDirection = attributes[ getAttributeName( 'textGradientDirection', device, state ) ]

				return `linear-gradient(${ textGradientDirection !== '' ? `${ textGradientDirection }deg, ` : '' }${ textColor1 }, ${ textColor2 })`
			},
			enabledCallback: ( {
				textColorType, textColor1, textColor2,
			} ) => textColorType === 'gradient' && textColor1 !== '' && textColor2 !== '',
			dependencies: [ 'textColorType', 'textColor1', 'textColor2', 'textGradientDirection' ],
		},
		{
			selector,
			styleRule: 'textAlign',
			attrName: 'textAlign',
			hover: 'all',
			hoverSelector,
			responsive: 'all',
		},
		{
			selector,
			styleRule: 'lineHeight',
			attrName: 'lineHeight',
			hover: 'all',
			hoverSelector,
			responsive: 'all',
			hasUnits: 'em',
		},
		{
			selector,
			styles: {
				fontWeight: 'fontWeight',
				textTransform: 'textTransform',
			},
			hover: 'all',
			hoverSelector,
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
			hasUnits: 'px',
		},
	]
}

export const Style = props => {
	const {
		attributes,
		options = {},
		...propsToPass
	} = props

	const {
		selector = '',
		inherit = true, // If false, desktop styles will only be applied to desktop, etc.
		inheritMax = 50, // If provided & inherit is true, clamp the inherited value in tablet and mobile to this.
		inheritMin,
		hoverSelector = '',
	} = options

	const styles = useStyles( attributes, getStyleParams( {
		selector, inherit, inheritMin, inheritMax, hoverSelector,
	} ) )

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

	const {
		selector = '',
		inherit = true, // If false, desktop styles will only be applied to desktop, etc.
		inheritMax = 50, // If provided & inherit is true, clamp the inherited value in tablet and mobile to this.
		inheritMin,
		hoverSelector = '',
	} = options

	const styles = getStyles( attributes, getStyleParams( {
		selector, inherit, inheritMin, inheritMax, hoverSelector,
	} ) )

	return (
		<StyleComponent.Content
			styles={ styles }
			versionAdded="3.0.0"
			versionDeprecated=""
			{ ...propsToPass }
		/>
	)
}
