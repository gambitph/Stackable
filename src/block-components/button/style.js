/**
 * External dependencies
 */
import { Style as StyleComponent } from '~stackable/components'
import {
	getAttributeName, useStyles, getStyles,
} from '~stackable/util'

const getStyleParams = options => {
	const {
		selector,
	} = options

	return [
		{
			selector,
			responsive: 'all',
			styles: {
				paddingTop: 'buttonPaddingTop',
				paddingBottom: 'buttonPaddingBottom',
				paddingRight: 'buttonPaddingRight',
				paddingLeft: 'buttonPaddingLeft',
			},
			valueCallback: ( value, attributes, device, state ) => {
				return `${ value }${ attributes[ getAttributeName( 'buttonPaddingUnit', device, state ) ] }`
			},
			dependencies: [ 'buttonPaddingUnit' ],
		},
		{
			selector,
			styleRule: 'background',
			attrName: 'buttonBackgroundColor',
			hover: 'all',
			valueCallback: ( _, attributes, device, state ) => {
				const buttonBackgroundGradientDirection = attributes[ getAttributeName( 'buttonBackgroundGradientDirection', device, state ) ]
				const buttonBackgroundColor = attributes[ getAttributeName( 'buttonBackgroundColor', device, state ) ]
				const buttonBackgroundColor2 = attributes[ getAttributeName( 'buttonBackgroundColor2', device, state ) ]

				if ( attributes[ getAttributeName( 'buttonBackgroundColorType', device, state ) ] !== 'gradient' ) {
					return attributes[ getAttributeName( 'buttonBackgroundColor', device, state ) ]
				}

				return `linear-gradient(${ buttonBackgroundGradientDirection !== '' ? buttonBackgroundGradientDirection + 'deg' : '90deg' }, ${ buttonBackgroundColor || buttonBackgroundColor2 }, ${ buttonBackgroundColor2 || buttonBackgroundColor })`
			},
			dependencies: [ 'buttonBackgroundGradientDirection', 'buttonBackgroundColor', 'buttonBackgroundColor2', 'buttonBackgroundColorType' ],
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
		...propsToPass
	} = props

	const styles = getStyles( attributes, getStyleParams( propsToPass.options ) )

	return (
		<StyleComponent.Content
			styles={ styles }
			versionAdded="3.0.0"
			versionDeprecated=""
			{ ...propsToPass }
		/>
	)
}
