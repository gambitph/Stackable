/**
 * External dependencies
 */
import {
	getFontFamily, clampInheritedStyle, useStyles, getStyles,
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
			valueCallback: ( _value, getAttribute, device, state ) => {
				let value = _value
				const clampDesktopValue = inherit && clampInheritedStyle(
					getAttribute( 'fontSize', 'desktop', state ),
					{ min: inheritMin, max: inheritMax }
				)

				const clampTabletValue = clampInheritedStyle(
					getAttribute( 'fontSize', 'tablet', state ),
					{ min: inheritMin, max: inheritMax }
				)
				if ( device === 'tablet' ) {
					if ( clampDesktopValue ) {
						value = `${ clampDesktopValue }${ getAttribute( 'fontSizeUnit', device, state ) || 'px' }`
					}
					if ( getAttribute( 'fontSize', device, state ) !== '' ) {
						value = `${ getAttribute( 'fontSize', device, state ) }${ getAttribute( 'fontSizeUnit', device, state ) || 'px' }`
					}
				}

				if ( device === 'mobile' ) {
					if ( clampDesktopValue ) {
						value = `${ clampDesktopValue }${ getAttribute( 'fontSizeUnit', device, state ) || 'px' }`
					}

					if ( clampTabletValue ) {
						value = `${ clampTabletValue }${ getAttribute( 'fontSizeUnit', device, state ) || 'px' }`
					} else if ( clampDesktopValue || getAttribute( 'fontSize', device, state ) !== '' ) {
						value = undefined
					}

					if ( getAttribute( 'fontSize', device, state ) !== '' ) {
						value = `${ getAttribute( 'fontSize', device, state ) }${ getAttribute( 'fontSizeUnit', device, state ) || 'px' }`
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
			hover: 'all',
			hoverSelector,
			attrName: 'textColor1',
			valuePreCallback: ( value, getAttribute, device, state ) => {
				if (
					getAttribute( 'textColorType', 'desktop', state ) !== 'gradient' ||
					getAttribute( 'textColor1', 'desktop', state ) === '' ||
					getAttribute( 'textColor2', 'desktop', state ) === ''
				) {
					return undefined
				}
				return value
			},
			valueCallback: ( value, getAttribute, device, state ) => {
				const textColor1 = getAttribute( 'textColor1', 'desktop', state )
				const textColor2 = getAttribute( 'textColor2', 'desktop', state )
				const textGradientDirection = getAttribute( 'textGradientDirection', 'desktop', state )

				return `linear-gradient(${ textGradientDirection !== '' ? `${ textGradientDirection }deg, ` : '' }${ textColor1 }, ${ textColor2 })`
			},
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
			hover: 'all',
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
