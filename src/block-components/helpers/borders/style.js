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
		addBorderRadiusOverflow = true,
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
		// This is to prevent gradient background from overflowing.
		{
			selector: borderRadiusSelector || selector,
			styleRule: 'overflow',
			attrName: 'borderRadius',
			attrNameTemplate,
			responsive: 'all',
			hover: 'all',
			hoverSelector: borderRadiusSelector ? undefined : hoverSelector,
			enabledCallback: ( _getAttribute, attributes ) => {
				if ( addBorderRadiusOverflow && attrNameTemplate === 'block%s' && attributes.overflow ) {
					return false
				}
				return addBorderRadiusOverflow
			},
			valueCallback: () => 'hidden',
			dependencies: [ 'overflow' ],
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
			dependencies: [ 'borderType' ],
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
			dependencies: [ 'borderType' ],
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
			dependencies: [ 'borderType' ],
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
			dependencies: [ 'borderType' ],
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
			dependencies: [ 'borderType' ],
		},
	]
}

export const BorderStyle = props => {
	const styles = useStyles( getStyleParams( props ) )

	return (
		<Fragment>
			<StyleComponent
				styles={ styles }
				versionAdded="3.0.0"
				versionDeprecated=""
				{ ...props }
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
