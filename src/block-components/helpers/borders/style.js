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
		hoverSelector,
		borderRadiusSelector,
	} = options

	return [
		{
			selector: borderRadiusSelector || selector,
			styleRule: 'borderRadius',
			attrName: 'borderRadius',
			attrNameTemplate,
			format: '%spx',
			responsive: 'all',
			hover: 'all',
			hoverSelector: borderRadiusSelector ? undefined : hoverSelector,
		},
		// Adding a border radius should append `overflow: hidden`.
		{
			selector: borderRadiusSelector || selector,
			styleRule: 'overflow',
			attrName: 'borderRadius',
			attrNameTemplate,
			responsive: 'all',
			hover: 'all',
			hoverSelector: borderRadiusSelector ? undefined : hoverSelector,
			valueCallback: () => 'hidden',
		},
		{
			selector,
			styleRule: 'boxShadow',
			attrName: 'shadow',
			attrNameTemplate,
			hover: 'all',
			hoverSelector,
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
			enabledCallback: getAttribute => getAttribute( 'borderType' ),
			hover: 'all',
			hoverSelector,
		},
		{
			selector,
			styleRule: 'borderTopWidth',
			attrName: 'borderWidth',
			attrNameTemplate,
			responsive: 'all',
			hover: 'all',
			hoverSelector,
			format: '%spx',
			enabledCallback: getAttribute => getAttribute( 'borderType' ),
			valuePreCallback: value => value?.top,
		},
		{
			selector,
			styleRule: 'borderRightWidth',
			attrName: 'borderWidth',
			attrNameTemplate,
			responsive: 'all',
			hover: 'all',
			hoverSelector,
			format: '%spx',
			enabledCallback: getAttribute => getAttribute( 'borderType' ),
			valuePreCallback: value => value?.right,
		},
		{
			selector,
			styleRule: 'borderBottomWidth',
			attrName: 'borderWidth',
			attrNameTemplate,
			responsive: 'all',
			hover: 'all',
			hoverSelector,
			format: '%spx',
			enabledCallback: getAttribute => getAttribute( 'borderType' ),
			valuePreCallback: value => value?.bottom,
		},
		{
			selector,
			styleRule: 'borderLeftWidth',
			attrName: 'borderWidth',
			attrNameTemplate,
			responsive: 'all',
			hover: 'all',
			hoverSelector,
			format: '%spx',
			enabledCallback: getAttribute => getAttribute( 'borderType' ),
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
