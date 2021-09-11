/**
 * External dependencies
 */
import {
	useStyles, getStyles,
} from '~stackable/util'
import { Style as StyleComponent } from '~stackable/components'

const getStyleParams = ( options = {} ) => {
	const {
		selector,
		enableColumnGap = true,
	} = options

	return [
		{
			selector,
			styleRule: 'columnGap',
			attrName: 'columnGap',
			format: '%spx',
			responsive: 'all',
			enabledCallback: () => enableColumnGap,
		},
		{
			selector,
			styleRule: 'rowGap',
			attrName: 'rowGap',
			format: '%spx',
			responsive: 'all',
		},
	]
}

export const FlexGapStyles = props => {
	const {
		attributes,
		options = {},
		...propsToPass
	} = props

	const styles = useStyles( attributes, getStyleParams( options ) )

	return (
		<>
			<StyleComponent
				styles={ styles }
				versionAdded="3.0.0"
				versionDeprecated=""
				{ ...propsToPass }
			/>
		</>
	)
}

FlexGapStyles.Content = props => {
	const {
		attributes,
		options = {},
		...propsToPass
	} = props

	const styles = getStyles( attributes, getStyleParams( options ) )

	return (
		<>
			<StyleComponent.Content
				styles={ styles }
				versionAdded="3.0.0"
				versionDeprecated=""
				{ ...propsToPass }
			/>
		</>
	)
}
