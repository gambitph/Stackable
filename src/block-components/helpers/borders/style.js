/**
 * External dependencies
 */
import { getStyles, useStyles } from '~stackable/util'
import { Style as StyleComponent } from '~stackable/components'

/**
 * WordPress dependencies
 */
import { Fragment } from '@wordpress/element'

const getStyleParams = ( options = {} ) => {
	const {
		selector = '',
		attrNameTemplate = '%s',
	} = options

	return [
		{
			selector,
			styleRule: 'borderRadius',
			attrName: 'borderRadius',
			attrNameTemplate,
			format: '%spx',
			responsive: 'all',
			hover: 'all',
		},
		{
			selector,
			styleRule: 'boxShadow',
			attrName: 'shadow',
			attrNameTemplate,
			hover: 'all',
		},
		{
			selector,
			styleRule: 'borderStyle',
			attrName: 'borderType',
			attrNameTemplate,
		},
		{
			selector,
			styleRule: 'borderColor',
			attrName: 'borderColor',
			attrNameTemplate,
			hover: 'all',
		},
		{
			selector,
			styleRule: 'borderTopWidth',
			attrName: 'borderWidth',
			attrNameTemplate,
			responsive: 'all',
			hover: 'all',
			format: '%spx',
			valuePreCallback: value => value?.top,
		},
		{
			selector,
			styleRule: 'borderRightWidth',
			attrName: 'borderWidth',
			attrNameTemplate,
			responsive: 'all',
			hover: 'all',
			format: '%spx',
			valuePreCallback: value => value?.right,
		},
		{
			selector,
			styleRule: 'borderBottomWidth',
			attrName: 'borderWidth',
			attrNameTemplate,
			responsive: 'all',
			hover: 'all',
			format: '%spx',
			valuePreCallback: value => value?.bottom,
		},
		{
			selector,
			styleRule: 'borderLeftWidth',
			attrName: 'borderWidth',
			attrNameTemplate,
			responsive: 'all',
			hover: 'all',
			format: '%spx',
			valuePreCallback: value => value?.left,
		},
	]
}

export const BorderStyle = props => {
	const {
		attributes,
		options = {},
		...propsToPass
	} = props

	const styles = useStyles( attributes, getStyleParams( options ) )

	return (
		<Fragment>
			<StyleComponent
				styles={ styles }
				versionAdded="3.0.0"
				versionDeprecated=""
				{ ...propsToPass }
			/>
		</Fragment>
	)
}

BorderStyle.Content = props => {
	const {
		attributes,
		options = {},
		...propsToPass
	} = props

	const styles = getStyles( attributes, getStyleParams( options ) )

	return (
		<Fragment>
			<StyleComponent.Content
				styles={ styles }
				versionAdded="3.0.0"
				versionDeprecated=""
				{ ...propsToPass }
			/>
		</Fragment>
	)
}
