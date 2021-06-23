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
