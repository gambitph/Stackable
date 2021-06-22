/**
 * External dependencies
 */
import { Style as StyleComponent } from '~stackable/components'
import {
	useStyles, getStyles,
} from '~stackable/util'

const getStyleParams = options => {
	const {
		selector,
		hoverSelector,
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
			valueCallback: ( value, getAttribute, device, state ) => {
				return `${ value }${ getAttribute( 'buttonPaddingUnit', device, state ) || 'px' }`
			},
			dependencies: [ 'buttonPaddingUnit' ],
		},
		{
			selector,
			styleRule: 'background',
			attrName: 'buttonBackgroundColor',
			hover: 'all',
			hoverSelector,
			valueCallback: ( _, getAttribute, device, state ) => {
				const buttonBackgroundGradientDirection = getAttribute( 'buttonBackgroundGradientDirection', device, state )
				const buttonBackgroundColor = getAttribute( 'buttonBackgroundColor', device, state )
				const buttonBackgroundColor2 = getAttribute( 'buttonBackgroundColor2', device, state )

				if ( getAttribute( 'buttonBackgroundColorType', device, state ) !== 'gradient' ) {
					return getAttribute( 'buttonBackgroundColor', device, state )
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
