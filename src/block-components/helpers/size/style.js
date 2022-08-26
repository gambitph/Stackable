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
		horizontalAlignRule = 'margin',
		verticalAlignRule = 'alignItems',
		verticalAlignSelectorEdit = '',
		verticalAlignSelector = '',
		wrapperSelector = '', // The outer wrapper element that where the outer flex alignments, widths and margins are applied to.
	} = options

	return [
		{
			selector,
			styleRule: 'minHeight',
			attrName: 'height',
			attrNameTemplate,
			responsive: 'all',
			hasUnits: 'px',
		},
		{
			renderIn: 'save',
			selector: verticalAlignSelector || selector,
			styleRule: verticalAlignRule || 'alignItems',
			attrName: 'verticalAlign',
			attrNameTemplate,
			responsive: 'all',
		},
		{
			renderIn: 'edit',
			selector: verticalAlignSelectorEdit || verticalAlignSelector || selector,
			styleRule: 'justifyContent',
			attrName: 'verticalAlign',
			attrNameTemplate,
			responsive: 'all',
		},
		{
			selector: wrapperSelector || selector,
			styleRule: 'maxWidth',
			attrName: 'width',
			attrNameTemplate,
			responsive: 'all',
			hasUnits: 'px',
		},
		{
			selector: wrapperSelector || selector,
			styleRule: 'minWidth',
			attrName: 'width',
			attrNameTemplate,
			responsive: 'all',
			hover: 'all',
			versionAdded: '3.0.0',
			versionDeprecated: '3.0.2',
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
			selector: wrapperSelector || selector,
			styleRule: 'marginTop',
			attrName: 'margin',
			attrNameTemplate,
			responsive: 'all',
			hasUnits: 'px',
			valuePreCallback: value => value?.top,
			valueCallback: value => {
				return value.startsWith( 'auto' ) ? 'auto' : value
			},
		},
		{
			selector: wrapperSelector || selector,
			styleRule: 'marginRight',
			attrName: 'margin',
			attrNameTemplate,
			responsive: 'all',
			hasUnits: 'px',
			valuePreCallback: ( value, getAttribute, device ) => {
				const right = value?.right
				const horizontalAlign = getAttribute( 'horizontalAlign', device )
				const blockWidth = getAttribute( 'width', device )
				if ( blockWidth || typeof right !== 'undefined' ) {
					switch ( horizontalAlign ) {
						case 'flex-start':
						case 'center':
							return 'auto'
						case 'flex-end':
							return right || 0
						default: return right
					}
				} else {
					return ''
				}
			},
			valueCallback: value => {
				return value.startsWith( 'auto' ) ? 'auto' : value
			},
		},
		{
			selector: wrapperSelector || selector,
			styleRule: 'marginBottom',
			attrName: 'margin',
			attrNameTemplate,
			responsive: 'all',
			hasUnits: 'px',
			valuePreCallback: value => value?.bottom,
			valueCallback: value => {
				return value.startsWith( 'auto' ) ? 'auto' : value
			},
		},
		{
			selector: wrapperSelector || selector,
			styleRule: 'marginLeft',
			attrName: 'margin',
			attrNameTemplate,
			responsive: 'all',
			hasUnits: 'px',
			valuePreCallback: ( value, getAttribute, device ) => {
				const left = value?.left
				const horizontalAlign = getAttribute( 'horizontalAlign', device )
				const blockWidth = getAttribute( 'width', device )
				if ( blockWidth || typeof left !== 'undefined' ) {
					switch ( horizontalAlign ) {
						case 'flex-start':
							return left || 0
						case 'center':
						case 'flex-end':
							return 'auto'
						default: return left
					}
				} else {
					return ''
				}
			},
			valueCallback: value => {
				return value.startsWith( 'auto' ) ? 'auto' : value
			},
			dependencies: [ 'horizontalAlign' ],
		},
		{
			selector,
			styleRule: 'display',
			attrName: 'verticalAlign',
			attrNameTemplate,
			responsive: 'all',
			valueCallback: () => {
				return 'flex'
			},
		},
		{
			renderIn: 'save',
			selector,
			styleRule: 'flexDirection',
			attrName: 'verticalAlign',
			responsive: 'all',
			attrNameTemplate,
			valueCallback: () => {
				return ( verticalAlignRule || 'alignItems' ) === 'justifyContent' ? 'column' : undefined
			},
		},
		{
			renderIn: 'edit',
			selector,
			styleRule: 'flexDirection',
			attrName: 'verticalAlign',
			responsive: 'all',
			attrNameTemplate,
			valueCallback: () => {
				return 'column'
			},
		},
		...( ( horizontalAlignRule !== 'margin' ) ? [
			{

				renderIn: 'save',
				selector: wrapperSelector || selector,
				styleRule: horizontalAlignRule || 'justifyContent',
				attrName: 'horizontalAlign',
				attrNameTemplate,
				responsive: 'all',
			},
		] : [] ),
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
