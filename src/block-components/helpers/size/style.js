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
		horizontalAlignRule = 'justifyContent',
		verticalAlignRule = 'alignItems',
	} = options

	return [
		{
			selector,
			styleRule: 'minHeight',
			attrName: 'height',
			attrNameTemplate,
			responsive: 'all',
			hover: 'all',
			hasUnits: 'px',
		},
		{
			selector,
			styleRule: horizontalAlignRule || 'justifyContent',
			attrName: 'horizontalAlign',
			attrNameTemplate,
			responsive: 'all',
		},
		{
			selector,
			styleRule: verticalAlignRule || 'alignItems',
			attrName: 'verticalAlign',
			attrNameTemplate,
			responsive: 'all',
		},
		{
			selector,
			styleRule: 'maxWidth',
			attrName: 'width',
			attrNameTemplate,
			responsive: 'all',
			hover: 'all',
			hasUnits: 'px',
		},
		{
			selector,
			styleRule: 'minWidth',
			attrName: 'width',
			attrNameTemplate,
			responsive: 'all',
			hover: 'all',
			valueCallback: value => {
				return value !== '' ? 'auto' : undefined
			},
		},

		{
			selector,
			styleRule: 'paddingTop',
			attrName: 'padding',
			attrNameTemplate,
			responsive: 'all',
			hover: 'all',
			hasUnits: 'px',
			valuePreCallback: value => value?.top,
		},
		{
			selector,
			styleRule: 'paddingRight',
			attrName: 'padding',
			attrNameTemplate,
			responsive: 'all',
			hover: 'all',
			hasUnits: 'px',
			valuePreCallback: value => value?.right,
		},
		{
			selector,
			styleRule: 'paddingBottom',
			attrName: 'padding',
			attrNameTemplate,
			responsive: 'all',
			hover: 'all',
			hasUnits: 'px',
			valuePreCallback: value => value?.bottom,
		},
		{
			selector,
			styleRule: 'paddingLeft',
			attrName: 'padding',
			attrNameTemplate,
			responsive: 'all',
			hover: 'all',
			hasUnits: 'px',
			valuePreCallback: value => value?.left,
		},
		{
			selector,
			styleRule: 'marginTop',
			attrName: 'margin',
			attrNameTemplate,
			responsive: 'all',
			hasUnits: 'px',
			valuePreCallback: value => value?.top,
		},
		{
			selector,
			styleRule: 'marginRight',
			attrName: 'margin',
			attrNameTemplate,
			responsive: 'all',
			hasUnits: 'px',
			valuePreCallback: value => value?.right,
		},
		{
			selector,
			styleRule: 'marginBottom',
			attrName: 'margin',
			attrNameTemplate,
			responsive: 'all',
			hasUnits: 'px',
			valuePreCallback: value => value?.bottom,
		},
		{
			selector,
			styleRule: 'marginLeft',
			attrName: 'margin',
			attrNameTemplate,
			responsive: 'all',
			hasUnits: 'px',
			valuePreCallback: value => value?.left,
		},
	]
}

export const SizeStyle = props => {
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

SizeStyle.Content = props => {
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
