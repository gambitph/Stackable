import {
	useStyles, getStyles,
} from '~stackable/util'
import { Style as StyleComponent } from '~stackable/components'

const getStyleParams = ( options = {} ) => {
	const {
		selector = '',
	} = options

	return [
		{
			selector,
			hoverSelector: selector ? `${ selector }:hover` : undefined,
			styleRule: 'transform',
			attrName: 'premadeHoverEffect',
			responsive: 'all',
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

	const styles = useStyles( attributes, getStyleParams( options ) )

	return (
		<StyleComponent
			styles={ styles }
			versionAdded="3.2.0"
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
			versionAdded="3.2.0"
			versionDeprecated=""
			{ ...propsToPass }
		/>
	)
}

